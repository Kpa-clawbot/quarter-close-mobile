# Quarter Close — Dev Notes

## Workflow

- **Feedback comes via WhatsApp chat** — Iavor sends feedback conversationally
- **I file GitHub Issues** for each separate item (label appropriately: bug, ui, gameplay, feature, phase2)
- **File issue FIRST, then code** — don't implement without an issue
- **Reference issues in commits** when fixing them
- **Propose designs before implementing** — wait for explicit approval on big mechanics
- **Repo:** https://github.com/Kpa-clawbot/quarter-close (public)
- **Collaborators:** KpaBap (admin), Kpa-clawbot (owner)
- **Live URL:** https://kpa-clawbot.github.io/quarter-close/ (GitHub Pages, master branch)
- **Analytics:** https://quarter-close.goatcounter.com (GoatCounter, loads only on github.io)

## Labels

- `bug` — something's broken
- `ui` — visual/styling tweaks  
- `gameplay` — balance, mechanics, feel
- `feature` — new stuff for current phase
- `phase2` — ideas to park for later

## Tech Stack

- Pure vanilla HTML/CSS/JS — no frameworks, no build step
- localStorage for saves (backward-compatible with fallback defaults)
- Hosted on GitHub Pages (public repo required for free plan)
- Local dev server: `nohup python3 -m http.server 8090 &` (must use nohup, not bare exec)

## Project Structure

- `index.html` — page structure + OG meta tags for social embeds
- `style.css` — Excel-accurate styling
- `game.js` — game engine (~2400 lines)
- `preview.png` — OG embed preview image (1200×630, Office 2003 splash style)
- `DESIGN.md` — full game vision (all phases)
- `PHASE1.md` — current phase scope & spec
- `DEVNOTES.md` — this file

## Key Design Decisions

- Game title in browser tab: "Q4 Financials - Operations.xlsx - Quarter Close"
- Boss Key = Esc (toggles to empty spreadsheet, game keeps running)
- Ctrl+S = save (intercepts browser save)
- No sound (stealth at work)
- Revenue sources unlock sequentially
- Progression: Click to collect → Automate → Upgrade
- Offline progress capped at 8 hours, automated sources only
- **Fixed 1 day/tick** — variable time scale was tried and scrapped (time compression cancels revenue growth dopamine)
- **4 career arcs**: Tech Startup, Food Empire, E-Commerce Hustler, Generic Entrepreneur — same core mechanics, different flavor text
- **Per-tick earnings should always go UP** — any mechanic causing sudden drops kills the fun
- **Max buttons styled as blue links** (spreadsheet hyperlink look), not colored buttons
- **IRS escalation over random dice** — debt compounds with 1% daily interest, stages escalate over 180 game-days
- **Depreciation for tax** — capital spending deducted over 4 quarters, not immediately (prevents gaming tax day)
- **All event toasts auto-expire in 10s** — last button (worst option) gets red countdown fill, auto-fires
- **IRS tax toasts never auto-expire** — too important to auto-fire (expiresMs: 0)
- **Late-game tiers stay grounded** — no sci-fi/absurd names. Tech companies ARE the endgame.
- **Fractal market noise** — volatility itself is a random walk (0.05-1.0), three noise frequencies (fast/slow/shock), creating realistic calm→chaotic chart patterns
- **Earnings modals never auto-expire** — like IRS toasts, they use `expiresMs: 0` because guidance selection is an important decision
- **Earnings and tax are independent cycles** — both fire every 90 game-days but use separate counters (`lastEarningsDay` vs `lastQuarterDay`), so they don't interfere
- **Stock price is derived, not stored** — `getStockPrice()` = `getCompanyValuation() / sharesOutstanding`, recalculated each tick
- **`_earningsMultiplier` persists stock reactions** — discrete jumps from earnings beats/misses layer on top of fractal noise via a multiplier on valuation

## Architecture Notes

### Tax Panel DOM Rebuild
- `updateTaxPanel()` rebuilds innerHTML for P&L + tax liability + IR sections
- Called every tick from `updateDisplay()`, but uses hash-based diffing (`_lastTaxPanelHash`) to skip rebuilds when data hasn't changed
- Settle buttons and guidance buttons use event delegation on `#tax-panel` (stable parent survives innerHTML rebuilds)
- **Lesson:** When innerHTML is rebuilt frequently, NEVER rely on button stability — use event delegation AND minimize unnecessary rebuilds

### Event Toast System
- `showEventToast()` renders desktop notification-style popup with buttons
- `expiresMs` controls auto-expire (default 10000, 0 to disable)
- Last button gets countdown overlay (CSS `toast-btn-countdown` animation)
- `eventToastTimer` global cleared on click/dismiss
- Events can use `type: 'dynamic'` with `setup()` function for content based on game state

### Valuation Chart
- Canvas-rendered, `#4472C4` Excel blue line, gray gridlines, gradient fill
- Formula: `Cash + (Annual Revenue × baseMult × growthMod × noise) - taxLiabilities`
- Post-IPO: valuation × `_earningsMultiplier` (stock price reactions from earnings)
- Draggable + resizable floating overlay, positioned right of Rev/yr column
- `_volState` tracks volatility random walk for fractal noise
- Max 200 data points, sampled every tick, persisted in save/load

### Phase 2.1: IPO + Earnings System
- **IPO trigger**: `checkIPOTrigger()` fires when `getCompanyValuation() >= $5T`, shows non-expiring toast with accept/decline
- **IPO execution**: `executeIPO()` sets `isPublic=true`, initializes 1B shares, sets default In-Line guidance, records `lastEarningsDay` and `ipoStockPriceStart`
- **IR section**: Rendered inside `updateTaxPanel()` (below P&L, above Tax Liability). Shows quarter, days left, revenue vs target (with inline progress bar), guidance buttons, streak, stock price + QTD%, retained earnings
- **Guidance buttons**: 4 inline buttons (🛡️ 📊 🎯 🔥) in the IR grid section, active one highlighted with `ir-active` class. Click handler via event delegation on `#tax-panel`
- **Earnings processing**: `processEarnings()` fires every 90 game-days post-IPO. Compares `earningsQuarterRevenue` to `guidanceTarget`, calculates beat/miss margin, applies stock change via `_earningsMultiplier`, awards RE on beats, updates analyst baseline + streak
- **Earnings revenue tracking**: `trackEarningsRevenue(amount)` called wherever revenue is added (gameTick, miniTask, goldenCell, big client events, automation collection). Keeps `earningsQuarterRevenue` in sync without duplicating revenue
- **Retained Earnings formula**: `Math.floor(qRevenue × 0.001 × guidanceMult × marginBonus × streakMult)` — miss = 0 RE. Accumulates but not spendable until Phase 2.2
- **Analyst ratchet**: `analystBaseline` starts at 1.0, moves ×1.05 on beat, ×0.97 on miss, ×1.15 on 3+ consecutive beats, ×0.90 on 2+ consecutive misses. Affects projected revenue calculation for next quarter's guidance target
- **Stock price display**: Two places — `#stock-price-cell` in the cash row (cell B2), and `#stock-ticker` in the status bar (gold colored)
- **Debug**: 🧪 IPO button calls `forceIPO()` — triggers IPO regardless of valuation
- **Save/load**: All new fields have fallback defaults (`|| false`, `|| 0`, `|| null`, `|| 1.0`). `_earningsMultiplier` also persisted.

### Save Compatibility
- All new fields use fallback defaults: `data.field || 0`, `data.array || []`
- No need to clear saves between code changes
- Only need New Game to switch arcs

### Phase 2.1: IPO + Earnings System
- **IPO trigger**: `checkIPOTrigger()` fires when `getCompanyValuation() >= 5e12`, shows accept/decline toast (expiresMs: 0)
- **Stock price**: `getStockPrice() = getCompanyValuation() / sharesOutstanding` — displayed in status bar and IR section
- **Earnings multiplier**: `gameState._earningsMultiplier` (persisted) — multiplicative factor on valuation, adjusted by earnings beats/misses. This creates discrete stock price jumps on top of fractal noise.
- **Guidance system**: 4 levels (conservative/in-line/ambitious/aggressive) with different risk/reward. Target = `totalRevPerTick() × 90 × analystBaseline × guidancePct`. Buttons use event delegation on `#tax-panel`.
- **Earnings quarter**: Independent 90-day cycle tracked by `lastEarningsDay` — separate from tax `lastQuarterDay`. Both can coincide but don't interfere.
- **Earnings revenue tracking**: `trackEarningsRevenue(amount)` called from all revenue sources (automated, clicks, mini-tasks, golden cells, event effects). Accumulates in `earningsQuarterRevenue`.
- **IR section**: Rendered inside `updateTaxPanel()` between P&L and Tax Liability sections. Uses same hash-based DOM diffing pattern. Guidance buttons use `data-guidance` attribute with delegated click handler.
- **Analyst ratchet**: `analystBaseline` multiplier shifts projected revenue baseline. Beats increase (+5%, or +15% on 3+ streak), misses decrease (-3%, or -10% on 2+ streak).
- **Retained Earnings**: Integer currency, earned on beats only. Formula: `quarterRev × 0.001 × guidanceMult × marginBonus × streakMult`. Displayed but not spendable until Phase 2.2.
- **Debug**: `forceIPO()` function, 🧪 IPO button next to existing debug buttons.

## GitHub Issues

### Closed
#1-#23, #25-#26

### Open
- #24 — Late-game pacing (extended to 12 tiers, further work TBD)
- #27 — Excel-style charts (valuation chart done, 7 more ideas: sparkline, pie, waterfall, etc.)
- #33 — Phase 2.1: IPO + Manual Earnings System (implemented)

## Commit History

~50 commits on master. Key milestones:
- `4ed71a0` — IRS tax debt escalation system
- `49adcbf` — P&L section + quarterly tax
- `0e76116` — Depreciation mechanic
- `a9f22ab` — Golden cell mechanic (completes #13 variable rewards)
- `406df89` — Valuation chart
- `032d3db` — Help screen
- `83bb849` — GitHub Pages + IRS toast fix
- `ef141df` — Extended to 12 tiers
- `b7b8da4` — Fractal market noise
- `a1ddb92` — V13 preview image (OG embed)
- `35610df` — Fix flaky Settle button (hash-based DOM rebuild)
- `b2e792c` — Phase 2 spec added
- `03a48cd` — Phase 2 restructured into sub-phases
- `20348f8` — **Phase 2.1: IPO + Manual Earnings System** (v0.2.0)
- `20348f8` — Phase 2.1: IPO + Manual Earnings System
