#!/usr/bin/env node
// apply.js — write a zh-CN translation table into a built Survivors of Victory chunk.
//
//   node apply.js <dist/assets/index-XXXX.js> <translations/zh-CN.json>
//
// The game keeps every UI string in one object literal:
//   Ee={"English source":["简体中文","繁體中文"], ...}
// This script replaces the first column (zh-CN) with the values from the JSON
// and leaves the Traditional Chinese column untouched.
const fs = require('fs');

const chunkPath = process.argv[2];
const dictPath = process.argv[3];
if (!chunkPath || !dictPath) {
  console.error('usage: node apply.js <index-*.js> <zh-CN.json>');
  process.exit(1);
}

const src = fs.readFileSync(chunkPath, 'utf8');
const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

// find the largest `Ee={` object literal
function matchingBrace(s, open) {
  let depth = 0, i = open;
  while (i < s.length) {
    const c = s[i];
    if (c === '"' || c === "'" || c === '`') {
      const q = c;
      i++;
      while (i < s.length) {
        if (s[i] === '\\') { i += 2; continue; }
        if (s[i] === q) break;
        i++;
      }
    } else if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return i; }
    i++;
  }
  return -1;
}

let best = null;
for (let pos = 0; ; ) {
  const j = src.indexOf('Ee={', pos);
  if (j < 0) break;
  const open = j + 3;
  const end = matchingBrace(src, open);
  if (end > 0 && (!best || end - open > best.end - best.open)) best = { open, end };
  pos = j + 1;
}
if (!best) { console.error('translation table literal not found'); process.exit(2); }

const literal = src.slice(best.open, best.end + 1);
const table = Function('return (' + literal + ')')();

let updated = 0, missing = 0;
for (const key of Object.keys(table)) {
  if (Object.prototype.hasOwnProperty.call(dict, key)) {
    table[key][0] = dict[key];
    updated++;
  } else {
    missing++;
  }
}
const unused = Object.keys(dict).filter((k) => !(k in table));

const out = src.slice(0, best.open) + JSON.stringify(table) + src.slice(best.end + 1);
fs.writeFileSync(chunkPath, out);
console.log(`updated ${updated} entries, ${missing} left as-is, ${unused.length} unused keys`);
if (unused.length) console.log('unused:', unused.slice(0, 10));
