# Quarter Close — Dev Notes

## Workflow

- **Feedback comes via WhatsApp chat** — Iavor sends feedback conversationally
- **I file GitHub Issues** for each separate item identified (label appropriately: bug, ui, gameplay, feature, phase2)
- **Reference issues in commits** when fixing them
- **Repo:** https://github.com/Kpa-clawbot/quarter-close (private)
- **Collaborators:** KpaBap (admin), Kpa-clawbot (owner)

## Labels

- `bug` — something's broken
- `ui` — visual/styling tweaks  
- `gameplay` — balance, mechanics, feel
- `feature` — new stuff for current phase
- `phase2` — ideas to park for later

## Tech Stack

- Pure vanilla HTML/CSS/JS — no frameworks, no build step
- localStorage for saves
- Can host on GitHub Pages when ready to share
- Local dev server: `python3 -m http.server 8090` from project dir

## Project Structure

- `index.html` — page structure
- `style.css` — Excel-accurate styling
- `game.js` — game engine
- `DESIGN.md` — full game vision (all phases)
- `PHASE1.md` — current phase scope & spec

## Key Design Decisions

- Game title in browser tab: "Q4 Financials - Operations.xlsx - Excel Online"
- Boss Key = Esc (toggles to empty spreadsheet, game keeps running)
- Ctrl+S = save (intercepts browser save)
- No sound (stealth at work)
- Revenue sources unlock sequentially
- Progression: Click to collect → Automate → Upgrade
- Offline progress capped at 8 hours, automated sources only
