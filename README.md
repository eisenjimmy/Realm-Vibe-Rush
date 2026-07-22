<div align="center">

# 🐱⚔️🐭 Realm Vibe Rush

### *An idle, single-lane auto-battler where cats reclaim the kingdom's cheese (and Wi-Fi password) from the dreaded Mouse King.*

**Tap to summon your fuzzy army · watch them march · smash the enemy keep · evolve · repeat.**

TRY HERER: https://eisenjimmy.github.io/Realm-Vibe-Rush/

![Genre](https://img.shields.io/badge/genre-idle%20lane%20battler-ff8a3a)
![Platform](https://img.shields.io/badge/platform-mobile%20web-3aa0ff)
![Tech](https://img.shields.io/badge/tech-vanilla%20JS%20%2B%20canvas-ffd23a)
![Assets](https://img.shields.io/badge/assets-none%20required-7fd13a)
![Offline](https://img.shields.io/badge/works-offline%20%2F%20file%3A%2F%2F-9fb0d8)
![i18n](https://img.shields.io/badge/lang-EN%20%2F%20한국어-c060ff)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

*A single self-contained HTML file. No build step. No dependencies. No network. Just open it.*

</div>

---

## 📖 Table of Contents

- [What is this?](#-what-is-this)
- [The (very serious) story](#-the-very-serious-story)
- [Quick start](#-quick-start)
- [How to play](#-how-to-play)
- [Units](#-units)
- [The elemental type chart](#-the-elemental-type-chart)
- [Upgrade trees — paths, elements & evolution](#-upgrade-trees--paths-elements--evolution)
- [Scoring & progression](#-scoring--progression)
- [Controls](#-controls)
- [Project structure](#-project-structure)
- [Editing the game (data-driven)](#-editing-the-game-data-driven)
- [Regenerating the 100 levels](#-regenerating-the-100-levels)
- [Roadmap](#-roadmap)
- [Credits & licensing](#-credits--licensing)

---

## 🎮 What is this?

**Realm Vibe Rush** is a phone-first **idle lane-battler** in the spirit of *The Battle Cats*. You don't place towers on a map — instead, gold trickles in automatically every second, and you spend it to **summon units** that march from your keep on the left toward the enemy keep on the right. They fight automatically. Win by **demolishing the enemy keep** before they demolish yours.

The whole game is **one `index.html` file** rendered on an HTML5 `<canvas>`, with **procedurally-drawn, animated chibi characters**, **synthesized Web Audio** music & SFX, and **JSON-driven** content. It runs offline, straight off your disk — no server, no build, no dependencies.

| | |
|---|---|
| 🎯 **Genre** | Idle / auto-battle / single-lane tower defense |
| 📱 **Target** | Phone-first (caps to phone width on desktop), one-thumb + keyboard |
| 🧩 **Depth** | 10-element type chart · branching skill trees · evolutions · 100 levels |
| 💾 **Saves** | `localStorage` — Continue anytime, cumulative career highscore |
| 🌏 **Languages** | English & 한국어, switchable any time |
| 🖼️ **Art** | Hand-drawn on canvas — zero image files needed |

---

## 🧀 The (very serious) story

> The dreaded **MOUSE KING** stole the kingdom's **ENTIRE cheese reserve** — and worse, the **royal Wi-Fi password**. The cats haven't streamed anything in **WEEKS**. This means **WAR**. Deploy the fuzzy army, reclaim the snacks, and get back online.
>
> *For glory. For cheese. For 5 bars of signal.*

Between every stage, your scouts deliver critical intelligence such as *"A wizard rat microwaved a fish indoors. This is a war crime."* Morale is fragile. Someone said `pspsps`.

---

## 🚀 Quick start

**Option A — just open it**
> Double-click `index.html`. Done. (Offline fallback data is baked in, so it works from `file://`.)

**Option B — serve it (recommended, unlocks live-editable JSON + all 100 levels from file)**
```bash
cd "path/to/Realm Vibe Rush"
python -m http.server 8080
# then open http://localhost:8080
```

> ℹ️ Browsers block `fetch()` on `file://`, so when opened directly the game uses an **inline copy** of the data that is **byte-identical** to the JSON files. Serving it lets you edit `data/*.json` and reload to see changes instantly.

---

## 🕹️ How to play

1. **Pick a language** on the splash (🇬🇧 / 🇰🇷) and press **GAME START** (or **CONTINUE** to resume your furthest level).
2. **Gold** rises automatically every second (top bar).
3. **Tap a unit card** at the bottom (or press `1`–`6`) to spend gold and **summon** that unit. Each has a cooldown.
4. Units **march right and auto-fight**. They pass through each other and pile onto the front line.
5. Tap the **☄️ Meteor** button (or `Q`) to nuke the whole enemy line — free, on a cooldown. Your one big "oh no you don't" button.
6. **Destroy the enemy keep** to win the stage, earn 💎 gems + a score, and advance.
7. Spend gems in the **⚔️ Barracks** to level up, imbue elements, and choose evolution paths.

The **battlefield is ~2.4 screens wide** and the **camera scrolls** to follow your vanguard, so pushes feel like a real advance. A red **▶ counter** appears on the right edge when enemies are lurking off-screen.

---

## 🦸 Units

Summon from the bottom bar. Costs are base values (before upgrades).

| # | Unit | ◆ Cost | Role | Notes |
|---|------|-------:|------|-------|
| 1 | **Warrior** | 50 | Melee | Cheap, balanced front-liner |
| 2 | **Archer** | 70 | Ranged | Fires arrows from safety |
| 3 | **Barbarian** | 100 | Melee | High damage, big axe |
| 4 | **Knight** | 130 | Melee | Tanky wall, soaks hits |
| 5 | **Mage** | 170 | Ranged | Splash magic, hits groups |
| 6 | **Healer** | 120 | Support | Heals the nearest wounded ally |

Enemies (Mouse Grunt, Rat Brute, Dark Slinger, Rat Warlock, Frost Yeti) mirror these roles, and **every 10th stage** unleashes a named **👹 BOSS** with a massive health pool.

---

## 🔥 The elemental type chart

Every unit and enemy carries one of **10 elements**. Attacks are multiplied by a type matchup — **1.5× super-effective**, **0.6× resisted**, **1× neutral**. Hits pop `SUPER!` (with a shake + freeze-frame) or `resist` so feedback is instant.

| Element | Strong vs (1.5×) | Weak vs (0.6×) |
|---|---|---|
| ⭐ **Normal** | — | Metal, Ghost |
| ⚙️ **Metal** | Monster, Poison | Fire, Lightning |
| 👹 **Monster** | Arcane, Normal | Metal, Fire |
| 🔥 **Fire** | Metal, Monster | Water, Earth |
| 💧 **Water** | Fire, Earth | Lightning, Poison |
| 🪨 **Earth** | Lightning, Poison | Water, Fire |
| ⚡ **Lightning** | Water, Metal | Earth, Ghost |
| ☠️ **Poison** | Water, Monster | Earth, Metal |
| 👻 **Ghost** | Normal, Arcane | Metal, Monster |
| ✨ **Arcane** | Ghost, Metal | Monster, Poison |

> Stages from **Level 11+** are themed around elements (and **dual-element** from Level 25), so **imbuing the right element** to counter the stage's enemies is the core strategic decision. Match your army to the map.

The full chart lives in [`data/types.json`](data/types.json) — tweak `strongMult` / `weakMult` / relationships freely.

---

## 🌳 Upgrade trees — paths, elements & evolution

Open the **⚔️ Barracks** (from the splash or the end-of-stage screen). Each unit has **three independent upgrade axes**:

### 1. 🌿 Skill-tree **Paths** *(free · committed · resettable)*
Each unit can commit to **one of two branching paths** that genuinely change how it plays. Paths are **power-neutral trades** (a give-and-take), so there's no single "best" pick — only what fits the stage. Choose freely, and hit **↺ Reset paths** any time (free) to re-spec.

| Unit | Path A | Path B |
|---|---|---|
| **Warrior** | 🛡️ *Guardian* — +HP, softer/slower (tank) | 🪓 *Berserker* — huge DMG, fragile & fast |
| **Archer** | 🏹 *Ranger* — longer range, harder shots | 🗡️ *Thief* — **becomes melee!** fast & stabby, no longer ranged |
| **Barbarian** | *Warlord* — tankier bruiser | *Raider* — blazing fast glass hitter |
| **Knight** | *Paladin* — immovable HP wall | *Crusader* — heavy-hitting axe |
| **Mage** | *Archmage* — big AoE splash | *Warlock* — single-target nuke, no splash |
| **Healer** | *Cleric* — big heals, long reach | *Medic* — rapid, smaller heals |

> The **Archer → Thief** transformation literally swaps the unit's role (ranged → melee), weapon (bow → blade), range, and look — the headline example of paths that *do different things*.

### 2. ☄️ **Element imbue** *(costs 💎 gems)*
Assign any of the 10 elements to a unit so its attacks exploit the type chart. Revert to Normal for free.

### 3. ⬆️ **Level-up** *(costs 💎 gems, Lv 0→8)*
Raw power: **+12% HP & damage per level**. This is where actual strength comes from — the same curve regardless of path, keeping balance clean.

### ✨ **Evolution** *(automatic, cosmetic milestone)*
As a unit **levels up**, it visually **evolves** — the reward is *look*, not a power spike, so balance stays intact:
- **Level 4 → ⭐ Evolved:** flowing cape, gold pauldrons, larger silhouette.
- **Level 8 → 🌟 True Form:** radiant aura, golden crown, twinkle, grandest size.

Your chosen **path** also reshapes the unit's silhouette, headgear, weapon, and palette — so a maxed, imbued, fully-pathed unit looks unmistakably *yours*.

---

## 🏆 Scoring & progression

- **100 hand-tuned levels.** Levels **1–10** are a gentle tutorial ramp; **11+** lean hard on elemental counters, dual-element maps, and bosses every 10th stage. Beyond 100, difficulty keeps scaling for the truly obsessed.
- **Per-stage score** = clear speed **+** keep HP remaining **+** total gold earned **+** value of your surviving army. Beat your best for a **★ NEW HIGH SCORE ★** and bonus gems.
- **Cumulative career highscore** (sum of every stage's best) is pinned to the **🏆 top banner at all times**, on every screen.
- **💎 Gems** are earned each clear and spent in the Barracks.
- **💾 Auto-save** via `localStorage` (versioned schema with a migration hook). Hit **CONTINUE** on the splash to jump back to your furthest level.
- **📸 Share Card** — at any stage-end, generate a **PNG image card** showing your score, cumulative highscore, and every unit's chosen path/element/level. Shares via the native share sheet on mobile, or downloads a PNG on desktop.

---

## ⌨️ Controls

| Input | Action |
|---|---|
| **Tap card** / `1`–`6` | Summon Warrior / Archer / Barbarian / Knight / Mage / Healer |
| **Tap ☄️** / `Q` | Cast Meteor (AoE nuke, on cooldown) |
| `Space` | Pause / resume (or start on menus) |
| **⚙️ gear** | Settings — language & volume, any time |
| **⏸** | Pause |

Every button is deliberately **juicy** — squash-and-stretch pops, click blips, and satisfying feedback everywhere.

---

## 📁 Project structure

```
Realm Vibe Rush/
├── index.html            # the entire game (canvas + audio + logic + UI)
├── README.md             # you are here
├── data/                 # JSON content (source of truth when served)
│   ├── units.json        # the 6 playable units (stats + look + base element)
│   ├── enemies.json      # enemy roster (mouse, brute, slinger, warlock, yeti)
│   ├── stages.json       # 100 generated levels (themes, rosters, bosses, curve)
│   └── types.json        # 10-element effectiveness chart
└── scripts/
    └── gen-stages.js     # deterministic level generator → data/stages.json
```

---

## 🛠️ Editing the game (data-driven)

Most content is JSON — no code needed. **Serve the folder** (see Quick start) so edits load, then refresh.

- **Tune a unit:** edit `data/units.json` (`hp`, `dmg`, `range`, `atk`, `speed`, `cost`, `cd`, palette).
- **Rebalance the type chart:** edit `data/types.json` (`strongMult`, `weakMult`, per-type `strong`/`weak` arrays).
- **Change a stage:** edit an entry in `data/stages.json` (`baseHp`, `income`, `budgetRate`, `roster`, `boss`, palette).
- **Add a skill-tree path:** paths currently live in the `PATHS` table inside `index.html` — add an entry with `mul` (stat multipliers), optional `set` (hard overrides like `role`/`weapon`/`range`), and `look` (head/weapon/palette).

> ⚠️ The offline fallback inside `index.html` mirrors `data/*.json`. If you change a JSON file and also want offline play to match, update the corresponding inline `FALLBACK` block (units/enemies/types) — stages regenerate automatically from `buildLevels()`.

---

## 🎲 Regenerating the 100 levels

Levels are produced by a **deterministic, seeded generator** so the on-disk `stages.json` and the in-game offline fallback are always identical.

```bash
node scripts/gen-stages.js     # rewrites data/stages.json (100 levels)
```

The same `buildLevels()` body is mirrored inside `index.html`. Tweak the difficulty curve, element cycle, boss cadence, or naming pools in one place and regenerate.

---

## 🗺️ Roadmap

- [ ] **Procedural art polish** — the game renders characters procedurally (cohesive, zero-asset, and flexible enough to tint by element / re-skin by path / evolve). Future work is richer shading, palettes, and detail — kept behind a single render seam so a sprite-sheet swap remains possible later if desired.
- [ ] Tier-2 skill nodes (a second fork per unit).
- [ ] Endless / daily-challenge mode.
- [ ] More boss mechanics and stage gimmicks.

---

## 🙏 Credits & licensing

**Everything in the game is original and self-contained:** all character/environment art is **drawn procedurally on canvas**, and all music & SFX are **synthesized at runtime via the Web Audio API**. There are **no external image or audio files** — nothing to license, attribute, or download. The game runs fully offline.

**Suggested project license:** MIT.

---

<div align="center">

*Made with first-principles sparring, questionable cheese-based lore, and an unreasonable amount of squash-and-stretch.*

**🐱 Now go get your Wi-Fi password back. 🐭**

</div>
