#!/usr/bin/env node
/**
 * Validate a generated llms.txt against the llmstxt.org v2 format.
 * Spec: https://llmstxt.org/index.md#format
 *
 * Usage: node scripts/validate-llms.mjs [path/to/llms.txt]
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

if (process.argv.includes("--pages")) {
  const pageErrors = [];
  const maps = readdirSync("dist").filter((file) => /^sitemap-\d+\.xml$/.test(file));
  const urls = maps.flatMap((file) => {
    const xml = readFileSync(resolve("dist", file), "utf8");
    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  });

  for (const url of urls) {
    const pathname = decodeURIComponent(new URL(url).pathname).replace(/^\//, "");
    const markdownPath = resolve("dist", pathname, "index.md");
    if (!existsSync(markdownPath)) {
      pageErrors.push(`missing Markdown page ${markdownPath} for ${url}`);
      continue;
    }
    const markdown = readFileSync(markdownPath, "utf8").replace(/^\uFEFF/, "").trim();
    if (!/^# \S/.test(markdown)) {
      pageErrors.push(`${markdownPath} must start with an H1`);
    }
    if (markdown.split(/\r?\n/).filter((line) => line.trim()).length < 3) {
      pageErrors.push(`${markdownPath} has no content beyond its headings`);
    }
  }

  if (!maps.length) pageErrors.push("no sitemap-*.xml found in dist/");

  if (pageErrors.length) {
    console.error("llms pages validator:");
    for (const error of pageErrors) console.error(`  - ${error}`);
    process.exit(1);
  }
  console.log(`llms pages validator: OK (${urls.length} Markdown pages)`);
  process.exit(0);
}

const target = resolve(process.argv[2] ?? "dist/llms.txt");

if (!existsSync(target)) {
  console.error(`llms.txt validator: file not found: ${target}`);
  process.exit(1);
}

const lines = readFileSync(target, "utf8").replace(/^\uFEFF/, "").split(/\r?\n/);
const errors = [];

const heading = (line) => line.match(/^(#{1,6})\s+(\S.*)$/);
const fileListItem = /^\s*(?:[-*+]|\d+\.)\s+\[([^\]]+)\]\(([^)]+)\)(?:\s*:\s*.*)?\s*$/;
const isLinkTarget = (url) => /^(?:https?:\/\/|mailto:|\/)/.test(url);
const fail = (line, message) => errors.push(`line ${line}: ${message}`);

// H1: the only required section; it must be the first non-empty line and appear once.
const first = lines.findIndex((line) => line.trim() !== "");
if (first < 0 || heading(lines[first])?.[1] !== "#") {
  fail(first + 1, "first non-empty line must be an H1 with the site name");
}
const h1s = lines
  .map((line, index) => ({ match: heading(line), index }))
  .filter(({ match }) => match?.[1] === "#");
if (h1s.length !== 1) {
  fail((h1s[1]?.index ?? 0) + 1, `expected exactly one H1, found ${h1s.length}`);
}

// Only H1 and H2 are part of the format; H3+ never is.
const h2s = [];
lines.forEach((line, index) => {
  const match = heading(line);
  if (!match) return;
  if (match[1].length >= 3) {
    fail(index + 1, "H3+ headings are not part of the llms.txt format");
  }
  if (match[1] === "##") h2s.push(index);
});

// Between the H1 and the first H2: free-form detail (paragraphs, lists, etc.),
// but no headings. A blockquote summary, when present, belongs here.
const firstH2 = h2s[0] ?? lines.length;
for (let index = first + 1; index < firstH2; index++) {
  if (!lines[index].trim()) continue;
  if (heading(lines[index])) {
    fail(index + 1, "detail section must not contain headings");
  }
}

// Every H2 section is a file list: only [name](url) items, with optional ": notes".
for (const [sectionIndex, start] of h2s.entries()) {
  const end = h2s[sectionIndex + 1] ?? lines.length;
  const title = heading(lines[start])[2];
  let itemCount = 0;

  for (let index = start + 1; index < end; index++) {
    const line = lines[index];
    if (!line.trim()) continue;
    const item = line.match(fileListItem);
    if (!item) {
      fail(index + 1, `section "${title}" must contain only markdown links, e.g. "- [Name](url): notes"`);
      continue;
    }
    itemCount++;
    if (!isLinkTarget(item[2])) {
      fail(index + 1, `invalid link target "${item[2]}" in section "${title}"`);
    }
  }

  if (itemCount === 0) {
    fail(start + 1, `section "${title}" contains no file links`);
  }
}

if (errors.length) {
  console.error(`llms.txt validator: ${target}`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`llms.txt validator: OK (${target})`);
