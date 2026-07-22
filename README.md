<div align="center">

# 🐱⚔️🐭 Realm Vibe Rush

### *An idle, single-lane auto-battler where cats reclaim the kingdom's cheese (and Wi-Fi password) from the dreaded Mouse King.*
https://eisenjimmy.github.io/Realm-Vibe-Rush/
**Tap to summon your fuzzy army · watch them march · smash the enemy keep · evolve · repeat.**

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
| 🧩 **Depth** | 10-element chart × class rock-paper-scissors · air units · skill trees + evolutions · Commander globals · keep towers · 100 levels |
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
7. Spend 💎 gems in the **🛒 SHOP** (splash, or the big **⬆️ UPGRADE** button after a win) to **recruit new units** and invest in each unit's **skill tree**.

**Two combat layers stack on every hit** — the **elemental** type chart *and* a **class** rock-paper-scissors (**melee › ranged › caster › melee**). Watch the skies too: **flying bats can only be hit by ranged/caster units** (Catapults are ground-only!). Both keeps also **auto-fire at nearby foes**, LoL-tower style.

The **battlefield is ~2.4 screens wide** and the **camera scrolls** to follow your vanguard, so pushes feel like a real advance. A red **▶ counter** appears on the right edge when enemies are lurking off-screen.

---

## 🦸 Units

Summon from the bottom bar. Cost scales with power; class matters (see below).

| # | Unit | ◆ Cost | Class | Notes |
|---|------|-------:|-------|-------|
| 1 | **Warrior** | 50 | Melee | Cheap, sturdy front-liner. *Starter* |
| 2 | **Archer** | 65 | Ranged | Arrows from safety; **can hit air**. *Starter* |
| 3 | **Barbarian** | 110 | Melee | Big axe, heavy single-target damage. *Recruit 💎25* |
| 4 | **Catapult** | 145 | Ranged | Siege AoE, monster damage — **ground-only, can't hit air**. *Recruit 💎40* |
| 5 | **Mage** | 175 | Caster | **Wide** splash magic, lower per-hit. *Recruit 💎55* |
| 6 | **Healer** | 120 | Support | Heals the nearest wounded ally. *Starter* |

You **start with Warrior, Archer & Healer** — recruit the rest with gems in the Shop. *(Knight retired as a standalone unit — he's now the Warrior's **Guardian** skill branch.)*

Enemies — **Mouse Grunt, Rat Brute, Dark Slinger, Rat Warlock, Frost Yeti**, and the ranged-only **Fang Bat** (flying) — mirror these classes, drawn from a per-stage weighted pool, with a named **👹 BOSS** every 10th stage.

---

## ⚔️ Class matchup & the skies

On top of elements, every unit and enemy has a **class** in a rock-paper-scissors:

> **🗡️ Melee › 🏹 Ranged › ✨ Caster › 🗡️ Melee** &nbsp;·&nbsp; **Support** is neutral

Beating your target's class deals **×1.35**; losing deals **×0.75**. So Warrior (melee) crushes Archer (ranged), Mage (caster) melts Warrior, Archer out-ranges Mage. This multiplies with the elemental chart — a double-counter can hit **×2**, a double-mismatch under **×0.5**.

**Air:** **Fang Bats fly** and can *only* be attacked by **ranged/caster** units — bring Archers or Mages or they'll chew your keep. **Catapults are ground-only** (`noAir`) and ignore flyers entirely.

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

## 🌳 The Shop — Diablo-style skill trees & Commander

Open the **🛒 SHOP** from the splash or the big **⬆️ UPGRADE** button after a win. Everything costs **💎 gems** (earned each clear) and **resets for free** any time (`↺`).

### ⚔️ Units tab — one committed skill tree per unit
Pick a unit from the strip, then spend gems down a **branching tree** rendered as a node graph with connectors:

1. **Recruit** locked units first (Barbarian 💎25 · Catapult 💎40 · Mage 💎55).
2. From the **root, commit to ONE of two branches** — the other locks until you reset.
3. Walk **4 tiers** in order, each gem-gated:
   - **Tier 1 — Branch identity:** reshapes stats, weapon, silhouette & palette.
   - **Tier 2 — Stat node.**
   - **Tier 3 — Element node:** the **only** way to imbue an element (🔥💧⚡…). It's *earned deep in the tree*, never a free toggle.
   - **Tier 4 — Capstone.**

Owned nodes visibly **evolve** the unit: **⭐ at 2 nodes**, **🌟 True Form at 4** (cape → pauldrons → aura + crown). Branches genuinely change behaviour:

| Unit | Branch A | Branch B |
|---|---|---|
| **Warrior** | 🛡️ Guardian — the old Knight, tanky (⚙️ Metal) | 🪓 Berserker — reckless DPS (🔥 Fire) |
| **Archer** | 🏹 Ranger — sniper (⚡ Lightning) | 🗡️ Thief — **becomes melee!** (☠️ Poison) |
| **Barbarian** | Warlord — 🪨 Earth juggernaut | Raider — 🔥 Fire blitz |
| **Catapult** | Bombard — 💧/🔥 wider splash | Trebuchet — longer & heavier |
| **Mage** | Archmage — 💧 wider AoE | Warlock — ☠️ single-target nuke |
| **Healer** | Cleric — ✨ big heals | Medic — rapid triage |

> **Archer → Thief** literally swaps role (ranged → melee), weapon (bow → blade), range & look — the headline example of a branch that *changes how the unit plays*.

### 👑 Commander tab — global upgrades *(bought before battle, apply every run)*
- **Meteor Power** — bigger Meteor damage.
- **Meteor Cadence** — shorter Meteor cooldown.
- **War Economy** — more gold income.
- **Keep Ballista** — stronger auto-firing keep towers.

---

## 🏆 Scoring & progression

- **100 levels.** Levels **1–3** are a gentle tutorial (grunts only, cheap keeps); **4+** ramps hard — air units, class/element counters, **dual-element** maps from 25, and a **👹 boss every 10th stage**. Beyond 100, difficulty keeps scaling for the truly obsessed.
- **Per-stage score** = clear speed **+** keep HP remaining **+** total gold earned **+** value of your surviving army. Beat your best for a **★ NEW HIGH SCORE ★** and bonus gems.
- **Cumulative career highscore** (sum of every stage's best) is pinned to the **🏆 top banner at all times**, on every screen.
- **💎 Gems** are earned each clear and spent in the Shop.
- **💾 Auto-save** via `localStorage` (versioned schema with a migration hook). Hit **CONTINUE** on the splash to jump back to your furthest level.
- **📸 Share Card** — at any stage-end, generate a **PNG image card** showing your score, cumulative highscore, and every unit's chosen path/element/level. Shares via the native share sheet on mobile, or downloads a PNG on desktop.

---

## ⌨️ Controls

| Input | Action |
|---|---|
| **Tap card** / `1`–`6` | Summon Warrior / Archer / Barbarian / Catapult / Mage / Healer (locked ones open the Shop) |
| **Tap ☄️** / `Q` | Cast Meteor (AoE Fire nuke — hits air too, on cooldown) |
| `Space` | Pause / resume (or start on menus) |
| **⚙️ gear** | Settings — language & volume, any time |
| **⏸** | Pause |

Both **keeps auto-fire** at nearby foes with no input — upgrade yours via *Keep Ballista* in the Shop's Commander tab.

Every button is deliberately **juicy** — squash-and-stretch pops, click blips, and satisfying feedback everywhere.

---

## 📁 Project structure

```
Realm Vibe Rush/
├── index.html            # the entire game (canvas + audio + logic + UI)
├── README.md             # you are here
├── data/                 # JSON content (source of truth when served)
│   ├── units.json        # 6 playable units (stats + class + look + base element)
│   ├── enemies.json      # enemy roster (mouse, brute, slinger, warlock, yeti, flying bat)
│   ├── stages.json       # 100 generated levels (themes, rosters, bosses, curve)
│   └── types.json        # 10-element effectiveness chart
└── scripts/
    └── gen-stages.js     # deterministic level generator → data/stages.json
```

---

## 🛠️ Editing the game (data-driven)

Most content is JSON — no code needed. **Serve the folder** (see Quick start) so edits load, then refresh.

- **Tune a unit:** edit `data/units.json` (`hp`, `dmg`, `range`, `atk`, `speed`, `cost`, `cls`, `noAir`, `flying`, palette).
- **Rebalance the type chart:** edit `data/types.json` (`strongMult`, `weakMult`, per-type `strong`/`weak`). Class multipliers live in `CLS_BEATS`/`classMult` in `index.html`.
- **Change a stage:** edit an entry in `data/stages.json` (`baseHp`, `income`, `budgetRate`, `roster`, `boss`, palette).
- **Edit a skill tree / globals / starting units:** these live in `index.html` — `TREE_SPEC` (branch nodes: `mul` stat multipliers, `set` hard overrides like `role`/`weapon`/`range`, `look`, tier-3 `el.element`), `GLOBALS` (Commander upgrades), `START_OWNED` + `UNLOCK_COST` (which units you begin with / recruit prices).

> ⚠️ The offline fallback inside `index.html` mirrors `data/*.json`. If you change `units`/`enemies`/`types`, update the matching inline `FALLBACK` block too (stages regenerate automatically from `buildLevels()`). Save schema is **v2** — old saves auto-migrate (meta kept, trees reset).

---

## 🎲 Regenerating the 100 levels

Levels are produced by a **deterministic, seeded generator** so the on-disk `stages.json` and the in-game offline fallback are always identical.

```bash
node scripts/gen-stages.js     # rewrites data/stages.json (100 levels)
```

The same `buildLevels()` body is mirrored inside `index.html`. Tweak the difficulty curve, element cycle, boss cadence, or naming pools in one place and regenerate.

---

## 🗺️ Roadmap

- [ ] **Procedural art polish** — characters render procedurally (cohesive, zero-asset, flexible enough to tint by element / re-skin by branch / evolve). Future work: richer shading & detail, behind a single render seam.
- [ ] Second branch fork deeper in each tree (tiers 5–6).
- [ ] More flying/siege enemy variety and boss mechanics.
- [ ] Endless / daily-challenge mode.

---

## 🙏 Credits & licensing

**Everything in the game is original and self-contained:** all character/environment art is **drawn procedurally on canvas**, and all music & SFX are **synthesized at runtime via the Web Audio API**. There are **no external image or audio files** — nothing to license, attribute, or download. The game runs fully offline.

**Suggested project license:** MIT.

---

<div align="center">

*Made with first-principles sparring, questionable cheese-based lore, and an unreasonable amount of squash-and-stretch.*

**🐱 Now go get your Wi-Fi password back. 🐭**

</div>
