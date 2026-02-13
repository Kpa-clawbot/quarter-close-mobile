# Quarter Close — Design Document

*A browser idle/tycoon game disguised as a corporate spreadsheet.*
*Working title: Quarter Close*

## Concept

It looks exactly like Excel/Google Sheets. But you're secretly building a business empire from startup to public megacorp. Your boss walks by? It's just a spreadsheet.

## Visual Design

- Styled like Excel/Google Sheets — grid lines, cell references (A1, B2), formula bar, sheet tabs at bottom
- Menus look like File/Edit/View/Insert
- "Save" = Ctrl+S (saves to localStorage)
- Status bar shows "Ready" like real Excel
- Favicon = green spreadsheet icon
- Stock ticker in corner (post-IPO)

## Core Loop

Revenue accrues per tick → spend on upgrades → grow departments → hit quarterly targets → earn prestige currency → reinvest

## Game Phases

### Phase 1: Startup (Bootstrapping)
- One sheet, minimal revenue
- Grind to initial milestones
- Angel investor "emails" — cash injections with strings attached
- Hire first employees (add rows)

### Phase 2: Growth (Venture Rounds)
- Series A, B, C funding rounds
- Each round = cash injection + board members who set KPIs
- Miss targets → board threatens to replace you
- New departments unlock as "sheet tabs" (Sales, R&D, Marketing, HR, Legal)

### Phase 3: IPO 🔔
- Big milestone event
- Stock price becomes live ticker in UI
- Public perception now matters
- Transition from private metrics to public company pressure

### Phase 4: Public Company (The Real Game)
- **Quarterly Earnings** — the core rhythm/prestige mechanic
- Every quarter: numbers reported vs analyst expectations
- Beat → stock moons, multipliers, analyst upgrades
- Miss → stock tanks, forced layoffs, lose some upgrades
- Expectations ratchet up each quarter (treadmill)

## Quarterly Earnings (Prestige Mechanic)

- Quarter closes → earnings reported → stock reacts
- Earn "retained earnings" (prestige currency)
- Reinvest into permanent upgrades
- Next quarter starts with higher baseline + higher expectations

### Guidance System
- Player sets own targets each quarter
- **Sandbagging:** Low guidance, easy to beat, small reward
- **Ambitious:** High guidance, hard to beat, big reward if you do
- Classic risk/reward tradeoff

## Advanced Mechanics

### Activist Investors
- Random events — someone tries hostile takeover
- Must hit certain metrics to fight them off
- Lose = game over or forced restructuring

### Stock Buybacks
- Spend cash to inflate stock price
- Short-term boost, long-term cash drain
- Trade-off: growth investment vs stock manipulation

### Cooking the Books 📕
- Risky button that inflates reported numbers
- Get caught = SEC investigation = massive penalty or game over
- Probability of getting caught increases with frequency
- Hilarious thematic tension

### Earnings Call
- Dialog event where "analysts" ask questions
- Player responses affect market sentiment
- Multiple choice — bullish/cautious/deflect

### Market Conditions
- Bull market = everything easy, rising tide
- Recession = survival mode, layoffs, cost cutting
- Cycle between them over long gameplay

## Random Events ("Emails")

- "Jim from accounting wants a raise" (yes/no → morale)
- "Marketing wants to sponsor a podcast" (spend cash → brand boost)
- "Server outage! Revenue paused for 30 seconds"
- "Competitor launched rival product" (temporary revenue hit)
- "Meeting invite: All-Hands" (decline or lose productivity)
- "HR complaint filed" (handle it or morale drops)

## Departments (Sheet Tabs)

| Tab | Function | Unlocked |
|-----|----------|----------|
| Overview | Dashboard, revenue summary, stock price | Start |
| Sales | Revenue generation, client acquisition | Start |
| R&D | Product upgrades, new revenue streams | Series A |
| Marketing | Brand value, customer growth rate | Series A |
| HR | Hiring, morale, productivity multiplier | Series B |
| Legal | Risk management, SEC defense | IPO |
| Finance | Buybacks, guidance, earnings reports | IPO |

## Idle Mechanics

- Revenue accumulates while tab is open
- Offline progress on return ("You were away for 3 hours, earned $X")
- Active play = clicking/decisions matter for optimization
- But casual play (check 2x/day) is viable

## Boss Key

- Hotkey (Esc or backtick) instantly shows a real empty spreadsheet
- No trace of game visible
- Press again to return

## Tech Stack

- Pure HTML/CSS/JS (vanilla, no framework)
- localStorage for saves
- No server needed
- Host on GitHub Pages
- Target: ~2000-3000 lines of code

## Open Questions

- [ ] Humor tone: corporate satire? absurdist? straight-faced?
- [ ] How many quarters before "winning"? Or endless?
- [ ] Mobile support? (spreadsheet UI might be rough on phone)
- [ ] Sound? (risky for "stealth at work" concept — probably off by default)
- [ ] ~~Name~~: **Quarter Close** ✅

---

*Created: 2026-02-13*
