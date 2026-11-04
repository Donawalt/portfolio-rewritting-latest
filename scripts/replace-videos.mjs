#!/usr/bin/env node
/**
 * Video migration for the Sanity portfolio.
 *
 * Replaces the heavy .mov assets used by project video slices with compressed
 * H.264 MP4s, then repoints every reference on the documents.
 *
 * Stages (run in order):
 *   plan     resolve the Sanity assets, match them to local originals, build a manifest
 *   encode   transcode/trim with ffmpeg into .video-migration/encoded
 *   upload   upload the encoded files as new Sanity file assets
 *   patch    repoint the slice references (dry run unless --commit)
 *   verify   re-read the documents and confirm the new references are live
 *   cleanup  delete the old .mov assets (requires --yes, and a successful verify)
 *   rollback repoint the references back to the old assets (requires --commit)
 *   status   print the current manifest
 *
 * Usage:
 *   node scripts/replace-videos.mjs plan
 *   node scripts/replace-videos.mjs encode [--only <assetId>] [--force]
 *   node scripts/replace-videos.mjs upload
 *   node scripts/replace-videos.mjs patch [--commit]
 *   node scripts/replace-videos.mjs verify
 *   node scripts/replace-videos.mjs cleanup --yes
 *
 * Requires ffmpeg/ffprobe on PATH, PUBLIC_SANITY_PROJECT_ID,
 * PUBLIC_SANITY_DATASET and PUBLIC_SANITY_READ_TOKEN in .env, plus
 * SANITY_API_WRITE_TOKEN (Editor role) for upload/patch/cleanup/rollback.
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { createReadStream } from "node:fs";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = path.join(ROOT, "scripts", "video-migration.config.json");

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const log = (...args) => console.log(...args);
const warn = (...args) => console.warn("  !", ...args);
const fail = (message) => {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
};
const mb = (bytes) => `${(bytes / 1e6).toFixed(1)} MB`;
const seconds = (value) => `${Number(value).toFixed(1)}s`;
const even = (value) => (value % 2 === 0 ? value : value + 1);

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--commit") args.commit = true;
    else if (arg === "--yes") args.yes = true;
    else if (arg === "--force") args.force = true;
    else if (arg === "--only") {
      args.only = args.only || [];
      args.only.push(argv[++i]);
    } else args._.push(arg);
  }
  return args;
}

function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const rawLine of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Za-z0-9_]+)\s*=\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[match[1]] === undefined) process.env[match[1]] = value;
  }
}

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    fail(`Missing config: ${path.relative(ROOT, CONFIG_PATH)}`);
  }
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  return {
    ...config,
    sourcesDir: path.resolve(
      (config.sourcesDir || "~/Documents").replace(/^~(?=$|\/)/, os.homedir())
    ),
    workDir: path.resolve(ROOT, config.workDir || ".video-migration"),
    outputDir: path.resolve(
      ROOT,
      config.outputDir || ".video-migration/encoded"
    ),
    maxShortEdge: config.maxShortEdge || 1080,
    fps: config.fps || 50,
    crf: config.crf ?? 30,
    preset: config.preset || "medium",
    maxDuration: config.maxDuration || 30,
    audio: Boolean(config.audio),
    overrides: config.overrides || {},
    files: config.files || {},
  };
}

const MANIFEST_PATH = (config) => path.join(config.workDir, "manifest.json");

function readManifest(config) {
  const file = MANIFEST_PATH(config);
  if (!fs.existsSync(file)) fail(`No manifest yet. Run "plan" first.`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeManifest(config, manifest) {
  fs.mkdirSync(config.workDir, { recursive: true });
  manifest.updatedAt = new Date().toISOString();
  fs.writeFileSync(MANIFEST_PATH(config), `${JSON.stringify(manifest, null, 2)}\n`);
}

function assertTools() {
  for (const tool of ["ffmpeg", "ffprobe"]) {
    const result = spawnSync(tool, ["-version"], { encoding: "utf8" });
    if (result.status !== 0) fail(`${tool} is not available on PATH.`);
  }
}

function getClient({ requireWrite = false } = {}) {
  const writeToken = process.env.SANITY_API_WRITE_TOKEN;
  const token = writeToken || process.env.PUBLIC_SANITY_READ_TOKEN;
  if (!token) fail("No Sanity token found in .env");
  if (requireWrite && !writeToken) {
    fail(
      "SANITY_API_WRITE_TOKEN is required for this stage (Editor role, no PUBLIC_ prefix)."
    );
  }
  const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) fail("Sanity project id / dataset missing from .env");
  return createClient({
    projectId,
    dataset,
    token,
    apiVersion: (process.env.PUBLIC_SANITY_API_VERSION || "2021-10-21").replace(
      /^v/,
      ""
    ),
    useCdn: false,
  });
}

/** macOS stores filenames as NFD, Sanity usually returns NFC. Normalise both. */
function normaliseName(name) {
  return String(name || "")
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function listLocalFiles(dir) {
  if (!fs.existsSync(dir)) fail(`sourcesDir does not exist: ${dir}`);
  return fs
    .readdirSync(dir)
    .filter((name) => !name.startsWith("."))
    .map((name) => path.join(dir, name))
    .filter((file) => {
      try {
        return fs.statSync(file).isFile();
      } catch {
        return false;
      }
    });
}

function probe(file) {
  const result = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=width,height,duration,avg_frame_rate:format=duration",
      "-of",
      "json",
      file,
    ],
    { encoding: "utf8" }
  );
  if (result.status !== 0) return null;
  const data = JSON.parse(result.stdout);
  const stream = (data.streams || [])[0] || {};
  const duration = Number(stream.duration || (data.format || {}).duration);
  return {
    width: Number(stream.width) || 0,
    height: Number(stream.height) || 0,
    duration: Number.isFinite(duration) ? duration : null,
  };
}

/** Fit the short edge to `maxShortEdge`, never upscale, keep dimensions even. */
function targetSize(width, height, maxShortEdge) {
  const short = Math.min(width, height);
  if (!short || short <= maxShortEdge) {
    return { width: even(width), height: even(height) };
  }
  const scale = maxShortEdge / short;
  return {
    width: even(Math.max(2, Math.round(width * scale))),
    height: even(Math.max(2, Math.round(height * scale))),
  };
}

const VIDEO_REF = /^file-(.+)-([a-z0-9]+)$/i;

function splitFileRef(ref) {
  const match = String(ref || "").match(VIDEO_REF);
  if (!match) return null;
  return { id: match[1], extension: match[2].toLowerCase() };
}

function assetUrl(ref, projectId, dataset) {
  const info = splitFileRef(ref);
  if (!info) return null;
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${info.id}.${info.extension}`;
}

/* ------------------------------------------------------------------ */
/* stages                                                              */
/* ------------------------------------------------------------------ */

async function plan(config, args) {
  assertTools();
  const client = getClient();
  log("\nQuerying Sanity for project video slices…\n");

  const docs = await client.fetch(
    `*[_type == "project" && defined(content)]{
      _id,
      _updatedAt,
      "name": coalesce(name, title, seoTitle),
      "videos": content[_type in ["video", "videos"] && defined(asset)][]{
        _key,
        "ref": asset._ref,
        "asset": asset->{_id, originalFilename, size, extension, mimeType, metadata{duration, dimensions{width, height}}}
      }
    }`
  );

  const referenced = [];
  for (const doc of docs) {
    for (const slice of doc.videos || []) {
      if (!slice.ref || !String(slice.ref).startsWith("file-")) continue;
      const info = splitFileRef(slice.ref);
      if (!info || info.extension === "mp4") continue;
      referenced.push({ doc, slice, info });
    }
  }

  if (!referenced.length) fail("No .mov video slices found. Nothing to migrate.");

  const localFiles = listLocalFiles(config.sourcesDir);
  const localBySize = new Map();
  for (const file of localFiles) {
    const size = fs.statSync(file).size;
    localBySize.set(size, localBySize.has(size) ? null : file);
  }

  const entries = [];
  log(
    `${"asset".padEnd(12)}${"file".padEnd(46)}${"source".padStart(11)}${"duration".padStart(10)}${"trim".padStart(12)}  local`
  );
  log("-".repeat(110));

  for (const { doc, slice, info } of referenced) {
    const asset = slice.asset || {};
    const filename = asset.originalFilename || "";
    const size = Number(asset.size) || 0;

    let localPath = null;
    const override = config.files[info.id];
    if (override) {
      const candidate = path.join(config.sourcesDir, override);
      if (fs.existsSync(candidate)) localPath = candidate;
    }
    if (!localPath && filename) {
      const wanted = normaliseName(filename);
      localPath =
        localFiles.find((file) => normaliseName(path.basename(file)) === wanted) ||
        null;
    }
    if (!localPath && size) {
      localPath = localBySize.get(size) || null;
    }

    const sourceSize = localPath ? fs.statSync(localPath).size : size;
    let localInfo = localPath ? probe(localPath) : null;
    const duration =
      localInfo?.duration ||
      Number(asset.metadata?.duration) ||
      null;
    const overrideTrim = Number(config.overrides[info.id]?.trimStart) || 0;
    const trimStart = Math.max(0, Math.min(overrideTrim, (duration || 0) - 1));
    const trimDuration = duration
      ? Math.min(config.maxDuration, Math.max(0.5, duration - trimStart))
      : config.maxDuration;
    const sizeMatch = size ? sourceSize === size : null;

    entries.push({
      docId: doc._id,
      docName: doc.name || "",
      docUpdatedAt: doc._updatedAt,
      key: slice._key,
      oldRef: slice.ref,
      oldAssetId: asset._id || `file-${info.id}-${info.extension}`,
      extension: info.extension,
      filename: filename || (localPath ? path.basename(localPath) : `${info.id}.${info.extension}`),
      localPath,
      sourceSize,
      sizeMatch,
      duration,
      trimStart,
      trimDuration,
      sourceWidth: localInfo?.width || asset.metadata?.dimensions?.width || 0,
      sourceHeight: localInfo?.height || asset.metadata?.dimensions?.height || 0,
      outputPath: path.join(config.outputDir, `${info.id}.mp4`),
      outputSize: null,
      newAssetId: null,
      newRef: null,
      patched: false,
      verified: false,
      cleaned: false,
    });

    const target =
      entries[entries.length - 1].sourceWidth &&
      entries[entries.length - 1].sourceHeight
        ? targetSize(
            entries[entries.length - 1].sourceWidth,
            entries[entries.length - 1].sourceHeight,
            config.maxShortEdge
          )
        : null;
    entries[entries.length - 1].target = target;

    log(
      `${info.id.slice(0, 10).padEnd(12)}${(localPath ? path.basename(localPath) : "MISSING").slice(0, 44).padEnd(46)}` +
        `${mb(sourceSize).padStart(11)}${(duration ? seconds(duration) : "?").padStart(10)}` +
        `${`${seconds(trimStart)} +${seconds(trimDuration)}`.padStart(12)}` +
        `  ${localPath ? (sizeMatch === false ? "SIZE MISMATCH" : "ok") : "not found"}`
    );
  }

  const missing = entries.filter((entry) => !entry.localPath);
  const mismatched = entries.filter(
    (entry) => entry.localPath && entry.sizeMatch === false
  );

  writeManifest(config, {
    version: 1,
    createdAt: new Date().toISOString(),
    projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.PUBLIC_SANITY_DATASET,
    config: {
      maxShortEdge: config.maxShortEdge,
      fps: config.fps,
      crf: config.crf,
      preset: config.preset,
      maxDuration: config.maxDuration,
      audio: config.audio,
    },
    entries,
  });

  log("-".repeat(110));
  log(
    `${entries.length} video slice(s) — ${mb(
      entries.reduce((total, entry) => total + entry.sourceSize, 0)
    )} of source material`
  );
  if (missing.length) warn(`${missing.length} source file(s) not found — see "local" column`);
  if (mismatched.length) warn(`${mismatched.length} file(s) do not match the Sanity size exactly`);
  log(`\nManifest written to ${path.relative(ROOT, MANIFEST_PATH(config))}`);
  if (missing.length) {
    log("\nAdd a \"files\" override in the config (asset id → filename) for the missing ones.");
  } else {
    log('\nNext: node scripts/replace-videos.mjs encode');
  }
}

async function encode(config, args) {
  assertTools();
  const manifest = readManifest(config);
  fs.mkdirSync(config.outputDir, { recursive: true });

  const selected = manifest.entries.filter(
    (entry) =>
      (!args.only || args.only.includes(splitFileRef(entry.oldRef).id)) &&
      entry.localPath &&
      (args.force || !entry.outputSize)
  );

  if (!selected.length) {
    log("Nothing to encode (use --force to re-encode).");
    return;
  }

  for (const [index, entry] of selected.entries()) {
    const source = probe(entry.localPath) || {};
    const width = source.width || entry.sourceWidth;
    const height = source.height || entry.sourceHeight;
    if (!width || !height) fail(`Could not read video dimensions from ${entry.localPath}`);
    const size = targetSize(width, height, config.maxShortEdge);
    const trimStart = entry.trimStart || 0;
    const trimDuration = entry.trimDuration || config.maxDuration;

    log(
      `\n[${index + 1}/${selected.length}] ${path.basename(entry.localPath)} → ${size.width}x${size.height} @${config.fps}fps CRF${config.crf}`
    );
    log(
      `  trim ${seconds(trimStart)} → ${seconds(trimStart + trimDuration)} (${seconds(trimDuration)})`
    );

    const ffmpegArgs = [
      "-hide_banner",
      "-loglevel",
      "error",
      "-stats",
      "-y",
      "-ss",
      String(trimStart),
      "-t",
      String(trimDuration),
      "-i",
      entry.localPath,
      "-vf",
      `scale=${size.width}:${size.height}:flags=lanczos`,
      "-r",
      String(config.fps),
      "-c:v",
      "libx264",
      "-preset",
      config.preset,
      "-crf",
      String(config.crf),
      "-profile:v",
      "high",
      "-pix_fmt",
      "yuv420p",
      "-g",
      String(config.fps * 2),
      "-movflags",
      "+faststart",
    ];
    if (!config.audio) ffmpegArgs.push("-an");
    ffmpegArgs.push(entry.outputPath);

    const result = spawnSync("ffmpeg", ffmpegArgs, { stdio: "inherit" });
    if (result.status !== 0) fail(`ffmpeg failed for ${entry.localPath}`);

    const outputSize = fs.statSync(entry.outputPath).size;
    entry.outputSize = outputSize;
    entry.target = size;
    entry.trimStart = trimStart;
    entry.trimDuration = trimDuration;
    entry.encodedAt = new Date().toISOString();
    writeManifest(config, manifest);

    log(`  ✔ ${mb(outputSize)} (${((outputSize / entry.sourceSize) * 100).toFixed(1)}% of source)`);
  }

  const totalIn = manifest.entries.reduce((total, entry) => total + entry.sourceSize, 0);
  const totalOut = manifest.entries.reduce(
    (total, entry) => total + (entry.outputSize || 0),
    0
  );
  log(`\nTotal: ${mb(totalIn)} → ${mb(totalOut)}`);
  log("\nNext: node scripts/replace-videos.mjs upload");
}

async function upload(config) {
  const manifest = readManifest(config);
  const client = getClient({ requireWrite: true });
  const pending = manifest.entries.filter(
    (entry) => entry.outputSize && !entry.newAssetId
  );

  if (!pending.length) {
    log("Nothing to upload.");
    return;
  }

  for (const [index, entry] of pending.entries()) {
    const filename = `${path.basename(
      entry.filename,
      path.extname(entry.filename)
    )}.mp4`;
    log(
      `\n[${index + 1}/${pending.length}] ${filename} (${mb(entry.outputSize)})`
    );
    const asset = await client.assets.upload("file", createReadStream(entry.outputPath), {
      filename,
      contentType: "video/mp4",
    });
    entry.newAssetId = asset._id;
    entry.newRef = asset._id;
    entry.uploadedAt = new Date().toISOString();
    writeManifest(config, manifest);
    log(`  ✔ ${entry.newRef}`);
  }

  log("\nNext: node scripts/replace-videos.mjs patch");
}

async function patch(config, args) {
  const manifest = readManifest(config);
  const client = getClient({ requireWrite: args.commit });

  const ready = manifest.entries.filter((entry) => entry.newRef && !entry.patched);
  if (!ready.length) {
    log("Nothing to patch.");
    return;
  }

  // Concurrency guard: abort if a document changed since "plan".
  const docIds = [...new Set(ready.map((entry) => entry.docId))];
  const current = await client.fetch(
    `*[_id in $ids]{_id, _updatedAt}`,
    { ids: docIds }
  );
  const currentById = new Map(current.map((doc) => [doc._id, doc._updatedAt]));
  for (const entry of ready) {
    if (
      !args.force &&
      entry.docUpdatedAt &&
      currentById.get(entry.docId) &&
      currentById.get(entry.docId) !== entry.docUpdatedAt
    ) {
      fail(
        `Document ${entry.docId} changed since "plan" (Studio edits?). Re-run "plan" or use --force.`
      );
    }
  }

  const byDoc = new Map();
  for (const entry of ready) {
    if (!byDoc.has(entry.docId)) byDoc.set(entry.docId, []);
    byDoc.get(entry.docId).push(entry);
  }

  for (const [docId, entries] of byDoc) {
    const set = {};
    for (const entry of entries) {
      set[`content[_key=="${entry.key}"].asset._ref`] = entry.newRef;
    }
    log(`\n${docId}`);
    for (const entry of entries) {
      log(`  ${entry.key}: ${entry.oldRef} → ${entry.newRef}`);
    }
    if (!args.commit) continue;

    await client.patch(docId).set(set).commit();
    for (const entry of entries) {
      entry.patched = true;
      entry.patchedAt = new Date().toISOString();
    }
    writeManifest(config, manifest);
    log("  ✔ patched");
  }

  if (!args.commit) {
    log("\nDry run. Re-run with --commit to apply.");
  } else {
    log("\nNext: node scripts/replace-videos.mjs verify");
  }
}

async function verify(config) {
  const manifest = readManifest(config);
  const client = getClient();
  const entries = manifest.entries.filter((entry) => entry.newRef);
  if (!entries.length) fail("Nothing to verify. Run upload/patch first.");

  const docs = await client.fetch(
    `*[_id in $ids]{_id, "videos": content[_type in ["video", "videos"] && defined(asset)][]{_key, "ref": asset._ref}}`,
    { ids: [...new Set(entries.map((entry) => entry.docId))] }
  );
  const refByKey = new Map();
  for (const doc of docs) {
    for (const slice of doc.videos || []) {
      refByKey.set(`${doc._id}:${slice._key}`, slice.ref);
    }
  }

  let ok = 0;
  for (const entry of entries) {
    const live = refByKey.get(`${entry.docId}:${entry.key}`);
    const matches = live === entry.newRef;
    entry.verified = matches;
    log(
      `${matches ? "✔" : "✖"} ${entry.docId} ${entry.key}  ${live || "missing"}`
    );
    if (matches) ok += 1;
  }
  writeManifest(config, manifest);

  if (ok !== entries.length) {
    fail(`${entries.length - ok} reference(s) not updated.`);
  }

  log(`\nAll ${ok} reference(s) point at the new assets.`);
  log("\nRebuild the site with a fresh Sanity fetch before deleting the old assets.");
  log("Then: node scripts/replace-videos.mjs cleanup --yes");
}

async function cleanup(config, args) {
  if (!args.yes) fail('cleanup deletes assets. Re-run with "cleanup --yes".');
  const manifest = readManifest(config);
  const client = getClient({ requireWrite: true });
  const entries = manifest.entries.filter(
    (entry) => entry.verified && !entry.cleaned
  );
  if (!entries.length) fail("Nothing verified to clean up. Run verify first.");

  for (const [index, entry] of entries.entries()) {
    log(
      `[${index + 1}/${entries.length}] deleting ${entry.oldAssetId} (${mb(entry.sourceSize)})`
    );
    try {
      await client.delete(entry.oldAssetId);
      entry.cleaned = true;
      entry.cleanedAt = new Date().toISOString();
      writeManifest(config, manifest);
    } catch (error) {
      warn(
        `${entry.oldAssetId} could not be deleted (still referenced?): ${error.message}`
      );
    }
  }
  log("\nDone. Check the Sanity usage dashboard in a few minutes.");
}

async function rollback(config, args) {
  const manifest = readManifest(config);
  const client = getClient({ requireWrite: args.commit });
  const entries = manifest.entries.filter((entry) => entry.patched && entry.oldRef);
  if (!entries.length) fail("Nothing to roll back.");

  const byDoc = new Map();
  for (const entry of entries) {
    if (!byDoc.has(entry.docId)) byDoc.set(entry.docId, []);
    byDoc.get(entry.docId).push(entry);
  }
  for (const [docId, docEntries] of byDoc) {
    const set = {};
    for (const entry of docEntries) {
      set[`content[_key=="${entry.key}"].asset._ref`] = entry.oldRef;
    }
    log(`${docId}: ${docEntries.length} reference(s) → old assets`);
    if (!args.commit) continue;
    await client.patch(docId).set(set).commit();
    for (const entry of docEntries) entry.patched = false;
    writeManifest(config, manifest);
  }
  if (!args.commit) log("\nDry run. Re-run with --commit to apply.");
}

function status(config) {
  const manifest = readManifest(config);
  log(
    `${"asset".padEnd(12)}${"source".padStart(10)}${"output".padStart(10)}${"new ref".padEnd(46)}  patch verify clean`
  );
  log("-".repeat(110));
  for (const entry of manifest.entries) {
    log(
      `${splitFileRef(entry.oldRef).id.slice(0, 10).padEnd(12)}` +
        `${mb(entry.sourceSize).padStart(10)}` +
        `${(entry.outputSize ? mb(entry.outputSize) : "-").padStart(10)}` +
        `${(entry.newRef || "-").padEnd(46)}  ` +
        `${entry.patched ? " yes " : "  no "}  ${entry.verified ? " yes " : "  no "}  ${entry.cleaned ? "yes" : " no"}`
    );
  }
}

/* ------------------------------------------------------------------ */
/* main                                                                */
/* ------------------------------------------------------------------ */

const args = parseArgs(process.argv.slice(2));
const stage = args._[0];
const config = loadConfig();
loadEnv();

switch (stage) {
  case "plan":
    await plan(config, args);
    break;
  case "encode":
    await encode(config, args);
    break;
  case "upload":
    await upload(config);
    break;
  case "patch":
    await patch(config, args);
    break;
  case "verify":
    await verify(config);
    break;
  case "cleanup":
    await cleanup(config, args);
    break;
  case "rollback":
    await rollback(config, args);
    break;
  case "status":
    status(config);
    break;
  default:
    console.log(
      "Usage: node scripts/replace-videos.mjs <plan|encode|upload|patch|verify|cleanup|rollback|status> [--commit] [--yes] [--force] [--only <assetId>]"
    );
    process.exit(1);
}
