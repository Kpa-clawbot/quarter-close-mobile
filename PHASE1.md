# Quarter Close — Phase 1: Startup

*MVP scope. Get the core loop working and the spreadsheet disguise nailed.*

## What You're Building

A lemonade-stand-to-small-business idle game that looks like Excel.

## Win Condition (Phase 1)

Reach $1M revenue → unlocks "Series A" teaser (end of phase 1 content, cliffhanger for phase 2).

## Core Mechanics

### The Grid
- Looks like a real spreadsheet with columns: A (Department/Item), B (Employees), C (Output/hr), D (Revenue/hr), E (Upgrade Cost), F (Action)
- Rows = revenue sources you've unlocked
- Cells update in real time (numbers tick up)
- Formula bar shows fake formulas ("=SUM(D2:D12)")

### Starting State
- Row 1: "Lemonade Stand" — 1 employee, $1/hr
- Cash balance shown in a cell (e.g., B1 = "Cash: $50.00")
- One sheet tab: "Operations"

### Revenue Sources (unlock in order)
| # | Name | Base $/hr | Unlock Cost | Flavor |
|---|------|-----------|-------------|--------|
| 1 | Lemonade Stand | $1 | Free | You start here |
| 2 | Lawn Mowing | $5 | $100 | "Recurring revenue" |
| 3 | Dog Walking | $12 | $500 | "Scalable" |
| 4 | Etsy Store | $30 | $2,000 | "E-commerce pivot" |
| 5 | Freelance Dev | $80 | $8,000 | "High margin" |
| 6 | SaaS Product | $200 | $25,000 | "MRR baby" |
| 7 | Consulting Firm | $500 | $75,000 | "Enterprise sales" |
| 8 | Agency | $1,500 | $200,000 | "Scaling the team" |

### Upgrades
Each revenue source has upgrades:
- **Hire** (add employee) — multiplies output, increasing cost each hire
- **Efficiency** — increases $/hr per employee (e.g., better tools, training)
- **Automate** — expensive one-time buy, row now produces without clicking

### Clicking
- Before automation: must click "Collect" button in column F to trigger revenue tick
- After automation: revenue flows passively
- Gives the classic idle game "click early, automate later" curve

### Time
- Game runs on a tick (1 second intervals)
- Revenue per tick = sum of all active rows
- Offline: on return, calculate elapsed time × revenue rate, cap at 8 hours ("Your team worked overtime!")

## UI Layout

```
┌─────────────────────────────────────────────────────────┐
│ 📁 File  Edit  View  Insert  Format  Help              │
├─────────────────────────────────────────────────────────┤
│ fx │ =SUM(D2:D8)                                       │
├────┬──────────────┬─────┬────────┬─────────┬────────────┤
│    │ A            │ B   │ C      │ D       │ E          │
├────┼──────────────┼─────┼────────┼─────────┼────────────┤
│ 1  │ OPERATIONS   │     │        │ Cash:   │ $1,234.56  │
├────┼──────────────┼─────┼────────┼─────────┼────────────┤
│ 2  │ Lemon Stand  │ 3   │ $3/s   │ [Hire]  │ [Upgrade]  │
├────┼──────────────┼─────┼────────┼─────────┼────────────┤
│ 3  │ Lawn Mowing  │ 1   │ $5/s   │ [Hire]  │ [Upgrade]  │
├────┼──────────────┼─────┼────────┼─────────┼────────────┤
│ 4  │ 🔒 Dog Walk  │     │        │ $500    │ [Unlock]   │
├────┼──────────────┼─────┼────────┼─────────┼────────────┤
│ ...│              │     │        │         │            │
├────┴──────────────┴─────┴────────┴─────────┴────────────┤
│ ◀ Operations │ + │                                      │
├─────────────────────────────────────────────────────────┤
│ Ready                              Revenue: $8/s  ▶ ▶▶ │
└─────────────────────────────────────────────────────────┘
```

## Events (Simple Set for Phase 1)

Random popups styled as Outlook notification toasts:
- "Mom wants to invest $50" → Accept (free cash) / Decline
- "Customer complaint!" → Handle ($20 cost) or Ignore (lose 10% revenue for 60s)
- "Tax time!" → Pay 10% of cash balance
- "Friend wants a discount" → Yes (morale+) / No (nothing)
- "Power outage" → All revenue paused for 15 seconds

Frequency: every 60-120 seconds

## Boss Key

- Press `Esc` → instant switch to empty spreadsheet (just a grid, no game elements)
- Press `Esc` again → back to game
- Game keeps running underneath

## Saves

- Auto-save to localStorage every 30 seconds
- Manual save = Ctrl+S (intercept browser save)
- Save includes: cash, all row states, upgrades, unlocks, timestamp for offline calc

## Tech

- Single `index.html` file (or index.html + style.css + game.js)
- No build step, no framework
- CSS Grid for the spreadsheet layout
- requestAnimationFrame or setInterval for game loop
- localStorage for persistence

## What's NOT in Phase 1

- No stock price / IPO
- No quarterly earnings
- No departments (just "Operations" tab)
- No cooking the books
- No analyst calls
- No board of directors
- No prestige/reset mechanic
- Just the core idle loop + spreadsheet disguise + events

## Definition of Done

- [ ] Looks convincingly like a spreadsheet at a glance
- [ ] 8 revenue sources unlockable in sequence
- [ ] Hire + upgrade mechanics working
- [ ] Automation mechanic working
- [ ] Offline progress on return
- [ ] Random events popping up
- [ ] Boss key works
- [ ] Save/load works
- [ ] Reaching $1M shows "Series A offer" teaser
- [ ] Playable and fun for 30-60 minutes

---

*Created: 2026-02-13*
