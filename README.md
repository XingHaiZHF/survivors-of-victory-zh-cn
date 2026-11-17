# Survivors of Victory 3D — Simplified Chinese translation

Hand-reviewed Simplified Chinese (`zh-CN`) text for
**[Survivors of Victory 3D](https://github.com/exporterrormusic/survivors-of-victory-3d-releases)**,
a NIKKE fan game by ExportError.

This repo exists so the translations can be merged into the game instead of the
current machine-generated pass. It covers **all 813 strings** of the `0.1.53` build
(menus, HUD, achievements, shop, talent tree, skill/quest descriptions, patch notes).

## What's here

| Path | Purpose |
| --- | --- |
| `translations/zh-CN.json` | `{ "English source string": "简体中文" }` — one entry per translatable string |
| `tools/apply.js` | Writes the table into a built `dist/assets/index-*.js` chunk |
| `tools/verify.js` | Checks coverage, `{placeholder}` parity and leftover Latin text |

## How the game stores text

Every UI string lives in a single object literal inside the main i18n chunk:

```js
Ee={"Settings":["设置","設定"], "Language":["语言","語言"], ...}
```

- the key is the **English source string** (exact match, whitespace-collapsed);
- the value array is `[zh-CN, zh-TW]`;
- strings containing `{count}`, `{name}`, `{seconds}` … are matched as patterns,
  so the placeholders must be preserved verbatim.

## Merging

Either take the JSON and drop it into your source translation files:

```js
// zh-CN.ts (example)
export default {
  "Settings": "设置",
  "Language": "语言",
  // ...
};
```

or patch a built package directly:

```bash
# after unpacking resources/app.asar
node tools/verify.js dist/assets/index-Dtszc3bv.js translations/zh-CN.json
node tools/apply.js  dist/assets/index-Dtszc3bv.js translations/zh-CN.json
# repack app.asar
```

`apply.js` only rewrites the `zh-CN` column; **`zh-TW` is left untouched**, so the
Traditional Chinese pass keeps working as-is.

## Translation notes

Terminology follows the official Simplified Chinese localization of *Goddess of
Victory: NIKKE* where one exists, so the fan game reads like the source material:

| English | 简体中文 |
| --- | --- |
| Nikke | 妮姬 |
| Rapture | 莱彻 |
| Rapture Core | 莱彻核心 |
| Ark | 方舟 |
| Eden | 伊甸 |
| Commander | 指挥官 |
| Operative | 队员 |
| Squad | 小队 |
| Burst | 爆裂 |
| Burst gauge | 爆裂槽 |
| Special | 特殊技 |
| Talent | 天赋 |
| Capstone | 终极天赋 |
| Wave / Endless | 波次 / 无尽 |
| Obelisk | 方尖碑 |
| Ashen Caldera / Sakura Grove / The Frozen North / Haunted Pine Forest | 灰烬火山 / 樱花林 / 极北冰原 / 幽魂松林 |

Character names use the official CN spellings: Snow White 白雪公主, Scarlet 红莲,
Rapunzel 长发公主, Dorothy 桃乐丝, Nayuta 那由他, Marian 玛丽安, Crown 皇冠,
Kilo 基洛, Cecil 塞西尔, Sin 辛, Wells 威尔斯, Nihilister 尼希利斯特, Liliweiss 莉莉维斯.

Things that were deliberately **kept in English**, because the official CN client does
the same and players expect them:

- weapon class codes: `SR` `AR` `SMG` `MG` `SG` `BEAM` `RL`
- key names: `SHIFT` `LMB` `RMB` `TAB` `ESC` `F10`
- the stylised all-caps labels of the shell UI (`ARK SYSTEM`, `SOV // CLIENT INITIALIZATION`, `PATCH ARCHIVE`)

Gameplay wording stays short and imperative, the way the HUD expects it
(`DEPLOY` → `出击`, `BACK` → `返回`), and descriptions keep the game's own line
breaks, `//` and `·` separators.

## Status

- target build: `0.1.53`
- 813 / 813 strings translated
- placeholders verified: 0 mismatches
- remaining Latin text: only the intentional cases listed above

## License / disclaimer

Translation text is released under CC0 — use it however you like, no attribution
needed. *Survivors of Victory 3D* is an unofficial, non-commercial NIKKE fan project;
*Goddess of Victory: NIKKE* and its characters belong to SHIFT UP.
