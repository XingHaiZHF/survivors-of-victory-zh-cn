#!/usr/bin/env node
// verify.js — report coverage/consistency between a translation JSON and a build chunk.
//
//   node verify.js <dist/assets/index-XXXX.js> <translations/zh-CN.json>
const fs = require('fs');

const chunkPath = process.argv[2];
const dictPath = process.argv[3];
const src = fs.readFileSync(chunkPath, 'utf8');
const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

function matchingBrace(s, open) {
  let depth = 0, i = open;
  while (i < s.length) {
    const c = s[i];
    if (c === '"' || c === "'" || c === '`') {
      const q = c; i++;
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
  const end = matchingBrace(src, j + 3);
  if (end > 0 && (!best || end - j > best.end - best.open)) best = { open: j + 3, end };
  pos = j + 1;
}
const table = Function('return (' + src.slice(best.open, best.end + 1) + ')')();

const keys = Object.keys(table);
const missing = keys.filter((k) => !(k in dict));
const extra = Object.keys(dict).filter((k) => !(k in table));
const placeholders = [];
for (const k of keys) {
  if (!(k in dict)) continue;
  const a = (k.match(/\{\w+\}/g) || []).sort().join(',');
  const b = (dict[k].match(/\{\w+\}/g) || []).sort().join(',');
  if (a !== b) placeholders.push([k, dict[k], a, b]);
}
const latin = [];
for (const k of keys) {
  if (!(k in dict)) continue;
  const stripped = dict[k].replace(/\{\w+\}/g, '');
  const words = stripped.match(/[A-Za-z]{3,}/g) || [];
  if (words.length) latin.push([k, dict[k], words.slice(0, 4)]);
}

console.log('table entries :', keys.length);
console.log('translated    :', keys.length - missing.length);
console.log('missing       :', missing.length);
if (missing.length) console.log(missing.slice(0, 20));
console.log('extra keys    :', extra.length);
if (extra.length) console.log(extra.slice(0, 20));
console.log('placeholder mismatches:', placeholders.length);
for (const p of placeholders.slice(0, 20)) console.log('  ', p);
console.log('entries containing latin words:', latin.length);
for (const l of latin.slice(0, 20)) console.log('  ', l);
process.exit(missing.length || placeholders.length ? 1 : 0);
