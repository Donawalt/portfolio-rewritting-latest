import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const ROOT = resolve(process.cwd(), "src");
const EXTENSIONS = new Set([".astro", ".jsx", ".tsx", ".js", ".ts"]);
const TAG_NAMES = new Set(["img", "Picture", "Image"]);

const sourceFiles = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
    } else if (EXTENSIONS.has(entry.slice(entry.lastIndexOf(".")))) {
      sourceFiles.push(full);
    }
  }
}
walk(ROOT);

// Find the end of a JSX/HTML tag, ignoring ">" inside braces or quoted strings.
function tagEnd(source, start) {
  let depth = 0;
  let quote = null;
  for (let i = start; i < source.length; i++) {
    const char = source[i];
    if (quote) {
      if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "{") depth++;
    else if (char === "}") depth = Math.max(0, depth - 1);
    else if (char === ">" && depth === 0) return i;
  }
  return source.length - 1;
}

const problems = [];
for (const file of sourceFiles) {
  const source = readFileSync(file, "utf8");
  const tagRegex = /<(img|Picture|Image)\b/g;
  let match;
  while ((match = tagRegex.exec(source))) {
    const end = tagEnd(source, tagRegex.lastIndex);
    const tag = source.slice(match.index, end + 1);
    tagRegex.lastIndex = end + 1;

    if (!/\balt\s*=/.test(tag)) {
      const line = source.slice(0, match.index).split("\n").length;
      problems.push({
        file: relative(process.cwd(), file),
        line,
        tag: tag.replace(/\s+/g, " ").slice(0, 160),
      });
    }
  }
}

if (problems.length) {
  console.error(`Missing alt text on ${problems.length} image element(s):`);
  for (const problem of problems) {
    console.error(`  ${problem.file}:${problem.line}  ${problem.tag}`);
  }
  process.exit(1);
}

console.log(`Alt-text check passed: ${sourceFiles.length} source files scanned.`);
