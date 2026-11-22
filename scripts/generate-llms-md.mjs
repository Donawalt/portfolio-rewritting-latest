#!/usr/bin/env node
/**
 * Generate a clean Markdown sibling for every indexable page after `astro build`.
 * Reads the HTML Astro already produced, so no extra Sanity/API calls are made.
 * Output URLs follow llmstxt.org: /about/ -> /about/index.md
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { parse } from "parse5";

const DIST = resolve("dist");

function sitemapUrls() {
  const files = readdirSync(DIST).filter((file) => /^sitemap-\d+\.xml$/.test(file));
  if (!files.length) throw new Error("No sitemap-*.xml found in dist/");

  return files.flatMap((file) => {
    const xml = readFileSync(join(DIST, file), "utf8");
    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  });
}

function htmlPathFor(url) {
  const pathname = new URL(url).pathname.replace(/^\//, "");
  const candidates = [
    join(DIST, pathname, "index.html"),
    join(DIST, decodeURIComponent(pathname), "index.html"),
  ];
  const found = candidates.find((candidate) => existsSync(candidate));
  if (!found) throw new Error(`No built HTML found for ${url} (tried ${candidates.join(", ")})`);
  return found;
}

function attrs(node) {
  return Object.fromEntries((node.attrs ?? []).map((attr) => [attr.name, attr.value]));
}

function findAll(node, predicate, results = []) {
  if (!node) return results;
  if (node.tagName && predicate(node)) results.push(node);
  for (const child of node.childNodes ?? []) findAll(child, predicate, results);
  return results;
}

function findElement(node, predicate) {
  return findAll(node, predicate)[0] ?? null;
}

function textOf(node) {
  if (!node) return "";
  if (node.nodeName === "#text") return node.value ?? "";
  if (node.nodeName === "#comment" || node.nodeName === "#documentType") return "";
  if (node.tagName && SKIPPED_TAGS.has(node.tagName)) return "";
  return (node.childNodes ?? []).map(textOf).join("");
}

function inline(text) {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

function resolveUrl(href, pageUrl) {
  if (!href || /^(?:#|mailto:|tel:|data:|javascript:)/i.test(href)) return href;
  try {
    return new URL(href, pageUrl).href;
  } catch {
    return href;
  }
}

const SKIPPED_TAGS = new Set([
  "script", "style", "noscript", "svg", "canvas", "iframe",
  "video", "audio", "form", "button", "input", "select", "textarea", "template",
]);

function shouldSkip(node) {
  if (!node.tagName || !SKIPPED_TAGS.has(node.tagName)) {
    const attr = attrs(node);
    const hiddenClass = /\b(?:hidden|sr-only|visually-hidden)\b/.test(attr.class ?? "");
    const hiddenStyle = /display\s*:\s*none|visibility\s*:\s*hidden/.test(attr.style ?? "");
    return Boolean(node.tagName) && (hiddenClass || hiddenStyle || attr["aria-hidden"] === "true");
  }
  return true;
}

function renderNodes(nodes, ctx) {
  return (nodes ?? []).map((node) => renderNode(node, ctx)).join("");
}

function renderList(node, ctx, depth) {
  const children = node.childNodes ?? [];
  const items = children.filter((child) => child.tagName === "li");
  if (!items.length) {
    return `${renderNodes(children, ctx).replace(/\s+$/, "")}\n\n`;
  }

  const ordered = node.tagName === "ol";
  const lines = [];
  let index = 0;

  for (const child of items) {
    index++;
    const parts = [];
    let nested = "";
    const itemCtx = { ...ctx, listDepth: depth + 1 };

    for (const content of child.childNodes ?? []) {
      if (content.tagName === "ul" || content.tagName === "ol") {
        nested += renderList(content, itemCtx, depth + 1);
      } else {
        parts.push(renderNode(content, itemCtx));
      }
    }

    const text = inline(parts.join(" "));
    const prefix = ordered ? `${index}. ` : "- ";
    lines.push(`${"  ".repeat(depth)}${prefix}${text}`.trimEnd());
    if (nested) lines.push(nested.replace(/\n+$/, ""));
  }

  return `${lines.join("\n")}\n\n`;
}

function renderTable(node, ctx) {
  const rows = findAll(node, (n) => n.tagName === "tr")
    .map((tr) => (tr.childNodes ?? [])
      .filter((cell) => cell.tagName === "th" || cell.tagName === "td")
      .map((cell) => inline(renderNodes(cell.childNodes, ctx))))
    .filter((cells) => cells.length);

  if (!rows.length) return "";
  const width = Math.max(...rows.map((row) => row.length));
  const pad = (row) => [...row, ...Array(width - row.length).fill("")];
  const line = (cells) => `| ${cells.join(" | ")} |`;
  const [head, ...body] = rows;

  return [
    line(pad(head)),
    `| ${Array(width).fill("---").join(" | ")} |`,
    ...body.map((row) => line(pad(row))),
  ].join("\n") + "\n\n";
}

function renderNode(node, ctx) {
  if (!node) return "";
  if (node.nodeName === "#comment" || node.nodeName === "#documentType") return "";
  if (node.nodeName === "#text") return (node.value ?? "").replace(/\s+/g, " ");
  if (!node.tagName || shouldSkip(node)) return "";

  const tag = node.tagName;
  const attr = attrs(node);
  const children = node.childNodes ?? [];
  const content = () => renderNodes(children, ctx);

  if (/^h[1-6]$/.test(tag)) {
    const text = inline(textOf(node));
    if (!text) return "";
    if (ctx.listDepth > 0) return `**${text}** `;
    if (tag === "h1") {
      ctx.firstH1Text ??= text;
      return "";
    }
    return `${"#".repeat(Number(tag[1]))} ${text}\n\n`;
  }

  if (tag === "p") {
    const text = inline(content());
    return text ? `${text}\n\n` : "";
  }

  if (tag === "a") {
    const text = inline(textOf(node));
    const href = resolveUrl(attr.href ?? "", ctx.pageUrl);
    return text && href && !href.startsWith("#") ? `[${text}](${href})` : text;
  }

  if (tag === "strong" || tag === "b" || tag === "em" || tag === "i" || tag === "del" || tag === "s") {
    const text = inline(content());
    if (!text) return "";
    if (tag === "strong" || tag === "b") return `**${text}**`;
    if (tag === "del" || tag === "s") return `~~${text}~~`;
    return `*${text}*`;
  }

  if (tag === "code") {
    const text = inline(textOf(node));
    return text ? `\`${text.replaceAll("`", "\\`")}\`` : "";
  }

  if (tag === "pre") {
    const code = textOf(node).replace(/^\n+|\n+$/g, "");
    const language = (attr.class ?? "").split(/\s+/).find((name) => name.startsWith("language-"));
    return `\`\`\`${language ? language.slice("language-".length) : ""}\n${code}\n\`\`\`\n\n`;
  }

  if (tag === "br") return "\n";
  if (tag === "hr") return "---\n\n";

  if (tag === "blockquote") {
    const body = content().trim().replace(/\n{3,}/g, "\n\n");
    return body ? `${body.split("\n").map((row) => `> ${row}`).join("\n")}\n\n` : "";
  }

  if (tag === "ul" || tag === "ol") return renderList(node, ctx, 0);

  if (tag === "picture") {
    const image = findElement(node, (n) => n.tagName === "img");
    return image ? renderNode(image, ctx) : "";
  }

  if (tag === "img") {
    const src = resolveUrl(attr.src ?? "", ctx.pageUrl);
    return src ? `![${inline(attr.alt ?? "")}](${src})` : "";
  }

  if (tag === "table") return renderTable(node, ctx);
  if (tag === "tr" || tag === "th" || tag === "td") return content();

  const body = content();
  return body.trim() ? `${body.replace(/\s+$/, "")}\n\n` : "";
}

function toMarkdown(html, pageUrl) {
  const document = parse(html);
  const title = inline(textOf(findElement(document, (node) => node.tagName === "title")));
  const description = inline(attrs(findElement(document, (node) =>
    node.tagName === "meta" && attrs(node).name === "description"))?.content ?? "");
  const canonicalLink = findElement(document, (node) =>
    node.tagName === "link" && attrs(node).rel === "canonical");
  const baseUrl = attrs(canonicalLink ?? {}).href || pageUrl;
  const main = findElement(document, (node) => node.tagName === "main") ?? document;

  const ctx = { pageUrl: baseUrl };
  const body = renderNodes(main.childNodes, ctx).trim();
  const parts = [`# ${title || ctx.firstH1Text || "Page"}`];
  if (description) parts.push(`> ${description}`);
  if (body) parts.push(body);

  const raw = parts.join("\n\n").replace(/\n{3,}/g, "\n\n");
  let inFence = false;
  const cleaned = raw.split("\n").map((line) => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      return line.trimEnd();
    }
    if (inFence || /^ {2,}(?:[-*+]|\d+\.) /.test(line)) return line.trimEnd();
    return line.trim();
  });

  return `${cleaned.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

const urls = sitemapUrls();
for (const url of urls) {
  const htmlPath = htmlPathFor(url);
  const markdownPath = join(dirname(htmlPath), "index.md");
  const markdown = toMarkdown(readFileSync(htmlPath, "utf8"), url);
  mkdirSync(dirname(markdownPath), { recursive: true });
  writeFileSync(markdownPath, markdown, "utf8");
}

console.log(`Generated ${urls.length} Markdown pages from built HTML.`);
