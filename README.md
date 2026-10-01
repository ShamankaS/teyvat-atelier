# Teyvat Atelier

Local web app for **Genshin Impact** account reviews. You import a GOOD JSON export (Irminsul or Genshin Optimizer), pick a character, and see how the equipped weapon, artifact sets, main stats, talent levels, and stat caps compare to community guide tables — **in percent**, not vague “this is better”.

No backend, no Hoyoverse login, no database. Parsing and scoring run in the browser. Optional `localStorage` keeps the last import on this machine.

---

## Why this exists

Genshin guides usually say “Homa is BiS” or “farm Emblem 4pc”. This tool answers the next question: **how far is *your* build from that, and what swap is worth the most right now** — including weapons that are already in the inventory but equipped on someone else.

It is a decision helper, not a rotation simulator. Relative weapon/set numbers are typical **team DPS vs R1 BiS** in a named reference team, rounded. Primary sheet source: [Prydwen.gg](https://www.prydwen.gg/genshin-impact) (full builds where published, otherwise Enka usage), cross-checked with KQM / TCL / community calcs.

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- Domain logic in `src/lib` (GOOD parser, stat totals, ranked suggestions)
- Guide tables in `src/data/guides.ts` (Prydwen + KQM/TCL)

## Features

- GOOD **v2 and v3** import (extra Irminsul fields are ignored; Traveler gear is remapped onto the traveler element in the file)
- Roster with search and filters: guided characters, fully geared, high-priority issues, everyone
- Per-character views: optimization queue with **percentage-point deltas**, current loadout, full weapon/set tables
- Inventory-aware weapon suggestions
- Bundled account JSON so the app is usable without a file picker

## Project layout

```
src/app/                 # pages
src/components/          # UI
src/data/guides.ts       # relative DPS tables and stat caps
src/data/catalog.ts      # names, weapon stats, set bonuses
src/lib/good/            # GOOD types + parser
src/lib/compute.ts       # equipped stats from artifacts/weapons
src/lib/analyze.ts       # compare loadout vs guide → suggestions
public/my-account.json   # default GOOD export loaded on start
public/sample-account.json
```

## Run locally

Requires **Node.js 20+**.

```bash
npm install
npm run dev
```

Open **http://localhost:43147** (fallback **http://127.0.0.1:43147**).

Stop with `Ctrl+C`. Production-style run:

```bash
npm run build
npm start
```

### On the site

1. The home page loads `public/my-account.json` by default.
2. Scroll to **Персонажи на аккаунте**.
3. Start with filter **Есть гайд**, then open a card.
4. Tabs: **Оптимизация** (what to change and by how many pp), **Как одет**, **Таблицы %**.

| Button | Action |
| --- | --- |
| Выбрать файл | Import another GOOD JSON from disk |
| Мой аккаунт | Reload `public/my-account.json` |
| Учебное демо | Small synthetic account |
| Сбросить | Clear the current account from the UI |

## JSON format

GOOD objects with:

- `characters` — `key`, `level`, `constellation`, `ascension`, `talent: { auto, skill, burst }`
- `weapons` — `key`, `level`, `ascension`, `refinement`, `location`
- `artifacts` — `setKey`, `slotKey`, `level`, `rarity`, `mainStatKey`, `location`, `substats`

## Guide coverage

Hu Tao, Raiden, Nahida, Furina, Neuvillette, Arlecchino, Yelan, Xiangling, Bennett, Xingqiu, Zhongli, Kazuha, Mavuika, Kinich, Navia, Alhaitham, Yoimiya, Ganyu, Ayaka, Clorinde, Mualani, Xilonen, Kokomi, Nilou, Citlali, Escoffier, Varesa, Yae Miko, Wriothesley, Fischl, Shinobu, Chevreuse, Sucrose, Shenhe, Tighnari, Mona, Jean.

Other imported characters still appear in the roster without percent tables.

## Out of scope (on purpose)

- No Hoyoverse / Enka live fetch
- No auth or server-side storage
- No full team buff graph or hit-by-hit optimizer (that is [Genshin Optimizer](https://frzyc.github.io/genshin-optimizer/) territory)

## License

MIT. See `LICENSE`.
