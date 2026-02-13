/* ============================================
   Quarter Close — Game Engine (Phase 1)
   ============================================ */

// ===== REVENUE SOURCE DEFINITIONS =====
const SOURCES = [
  { id: 0, name: 'Lemonade Stand', baseRate: 1,    unlockCost: 0,      flavor: 'You start here' },
  { id: 1, name: 'Lawn Mowing',    baseRate: 5,    unlockCost: 100,    flavor: 'Recurring revenue' },
  { id: 2, name: 'Dog Walking',    baseRate: 12,   unlockCost: 500,    flavor: 'Scalable' },
  { id: 3, name: 'Etsy Store',     baseRate: 30,   unlockCost: 2000,   flavor: 'E-commerce pivot' },
  { id: 4, name: 'Freelance Dev',  baseRate: 80,   unlockCost: 8000,   flavor: 'High margin' },
  { id: 5, name: 'SaaS Product',   baseRate: 200,  unlockCost: 25000,  flavor: 'MRR baby' },
  { id: 6, name: 'Consulting Firm',baseRate: 500,  unlockCost: 75000,  flavor: 'Enterprise sales' },
  { id: 7, name: 'Agency',         baseRate: 1500, unlockCost: 200000, flavor: 'Scaling the team' },
];

// ===== EVENTS DEFINITIONS =====
const EVENTS = [
  {
    sender: 'Mom',
    subject: 'Quick investment opportunity',
    body: 'Honey, I believe in your little business! I want to invest $50. No strings attached!',
    actions: [
      { label: 'Accept 💰', effect: (gs) => { gs.cash += 50; return 'Mom invested $50!'; } },
      { label: 'Decline', effect: () => 'You declined. Mom is mildly hurt.' },
    ]
  },
  {
    sender: 'Angry Customer',
    subject: 'RE: TERRIBLE SERVICE!!!',
    body: 'I want a FULL REFUND or I\'m leaving a 1-star review everywhere! This will cost $20 to handle.',
    actions: [
      { label: 'Handle it ($20)', effect: (gs) => {
        if (gs.cash >= 20) { gs.cash -= 20; return 'Complaint resolved. Crisis averted.'; }
        return 'You don\'t have $20! Customer left a bad review.';
      }},
      { label: 'Ignore', effect: (gs) => {
        gs.revPenalty = { mult: 0.9, until: Date.now() + 60000 };
        return 'Bad reviews incoming! Revenue -10% for 60s.';
      }},
    ]
  },
  {
    sender: 'IRS',
    subject: 'Tax Assessment Notice',
    body: 'Your quarterly tax assessment is due. Please remit 10% of current cash balance.',
    actions: [
      { label: 'Pay taxes', effect: (gs) => {
        const tax = Math.floor(gs.cash * 0.1);
        gs.cash -= tax;
        return `Paid $${formatNum(tax)} in taxes. Uncle Sam thanks you.`;
      }},
    ]
  },
  {
    sender: 'College Buddy',
    subject: 'Hey can I get a discount??',
    body: 'Bro remember me from college?? Hook me up with a discount! For old times\' sake 🤙',
    actions: [
      { label: 'Sure, why not', effect: () => 'Your friend is happy! Team morale +vibes.' },
      { label: 'Sorry, full price', effect: () => 'They understand. Business is business.' },
    ]
  },
  {
    sender: 'IT Department',
    subject: '⚠️ POWER OUTAGE - Building 3',
    body: 'Emergency maintenance required. All systems will be offline for approximately 15 seconds.',
    actions: [
      { label: 'OK', effect: (gs) => {
        gs.powerOutage = { until: Date.now() + 15000 };
        return '⚡ Power outage! Revenue paused for 15 seconds.';
      }},
    ]
  },
];

// ===== GAME STATE =====
let gameState = {
  cash: 50,
  totalEarned: 0,
  sources: SOURCES.map((s, i) => ({
    id: i,
    unlocked: i === 0,
    employees: i === 0 ? 1 : 0,
    upgradeLevel: 0,
    automated: false,
    pendingCollect: 0,
  })),
  revPenalty: null,
  powerOutage: null,
  seriesAShown: false,
  lastSave: Date.now(),
  lastTick: Date.now(),
  bossMode: false,
  eventCooldown: 0,
  totalPlayTime: 0,
};

// Track if DOM rows have been built (for incremental updates)
let gridBuilt = false;

// ===== COST FORMULAS =====
function hireCost(source) {
  const base = SOURCES[source.id].unlockCost || 10;
  return Math.max(10, Math.floor(base * 0.5 * Math.pow(1.15, source.employees)));
}

function upgradeCost(source) {
  const base = SOURCES[source.id].baseRate;
  return Math.floor(10 * base * Math.pow(2, source.upgradeLevel));
}

function automateCost(source) {
  const base = SOURCES[source.id].unlockCost || 50;
  return Math.floor(base * 10);
}

function sourceRevPerSec(source) {
  if (!source.unlocked || source.employees === 0) return 0;
  const base = SOURCES[source.id].baseRate;
  const upgradeMult = 1 + source.upgradeLevel * 0.5;
  return source.employees * base * upgradeMult;
}

function totalRevPerSec() {
  let total = 0;
  for (const s of gameState.sources) {
    total += sourceRevPerSec(s);
  }
  if (gameState.revPenalty && Date.now() < gameState.revPenalty.until) {
    total *= gameState.revPenalty.mult;
  } else {
    gameState.revPenalty = null;
  }
  if (gameState.powerOutage && Date.now() < gameState.powerOutage.until) {
    total = 0;
  } else {
    gameState.powerOutage = null;
  }
  return total;
}

// ===== FORMATTING =====
function formatMoney(n) {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e4) return '$' + (n / 1e3).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
}

function formatNum(n) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatRate(n) {
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M/s';
  if (n >= 1e4) return '$' + (n / 1e3).toFixed(1) + 'K/s';
  return '$' + n.toFixed(2) + '/s';
}

function formatDuration(seconds) {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  }
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${s}s`;
  }
  return `${Math.floor(seconds)}s`;
}

// ===== RENDERING =====

// Build the full grid once (called on init and when structure changes: unlock, automate)
function buildGrid() {
  const container = document.getElementById('revenue-rows');
  container.innerHTML = '';

  for (let i = 0; i < SOURCES.length; i++) {
    const src = SOURCES[i];
    const state = gameState.sources[i];
    const rowNum = i + 4;

    const row = document.createElement('div');
    row.className = 'grid-row';
    row.id = `source-row-${i}`;

    if (!state.unlocked) {
      row.classList.add('source-locked');
      const nextUnlockable = isNextUnlock(i);
      row.innerHTML = `
        <div class="row-num">${rowNum}</div>
        <div class="cell cell-a" data-field="name">🔒 ${src.name}</div>
        <div class="cell cell-b" data-field="emp">—</div>
        <div class="cell cell-c" data-field="rate">—</div>
        <div class="cell cell-d" data-field="action1">
          ${nextUnlockable ? `<button class="cell-btn btn-unlock" onclick="unlockSource(${i})" data-btn="unlock">Unlock ${formatMoney(src.unlockCost)}</button>` : `<span style="color:#ccc">${formatMoney(src.unlockCost)}</span>`}
        </div>
        <div class="cell cell-e" data-field="action2"></div>
        <div class="cell cell-f" data-field="action3"></div>
        <div class="cell cell-g empty-cell"></div>
        <div class="cell cell-h empty-cell"></div>
      `;
    } else {
      row.innerHTML = `
        <div class="row-num">${rowNum}</div>
        <div class="cell cell-a source-name" data-field="name"></div>
        <div class="cell cell-b" data-field="emp"></div>
        <div class="cell cell-c" data-field="rate"></div>
        <div class="cell cell-d" data-field="action1"></div>
        <div class="cell cell-e" data-field="action2"></div>
        <div class="cell cell-f" data-field="action3"></div>
        <div class="cell cell-g empty-cell"></div>
        <div class="cell cell-h empty-cell"></div>
      `;
    }

    container.appendChild(row);
  }

  // Filler rows
  const filler = document.getElementById('filler-rows');
  filler.innerHTML = '';
  const startRow = SOURCES.length + 4;
  for (let i = 0; i < 20; i++) {
    const row = document.createElement('div');
    row.className = 'filler-row';
    row.innerHTML = `
      <div class="row-num">${startRow + i}</div>
      <div class="cell"></div><div class="cell"></div><div class="cell"></div>
      <div class="cell"></div><div class="cell"></div><div class="cell"></div>
      <div class="cell"></div><div class="cell"></div>
    `;
    filler.appendChild(row);
  }

  gridBuilt = true;
  updateGridValues();
}

// Update only the values/buttons in existing rows (called every tick)
function updateGridValues() {
  for (let i = 0; i < SOURCES.length; i++) {
    const src = SOURCES[i];
    const state = gameState.sources[i];
    const row = document.getElementById(`source-row-${i}`);
    if (!row) continue;

    if (!state.unlocked) {
      // Update unlock button enabled/disabled state
      const unlockBtn = row.querySelector('[data-btn="unlock"]');
      if (unlockBtn) {
        unlockBtn.disabled = gameState.cash < src.unlockCost;
      }
      continue;
    }

    // Check if this was a locked row that's now unlocked — need structural rebuild
    if (row.classList.contains('source-locked')) {
      buildGrid();
      return; // buildGrid calls updateGridValues
    }

    const rev = sourceRevPerSec(state);
    const hCost = hireCost(state);
    const uCost = upgradeCost(state);
    const aCost = automateCost(state);

    // Name
    const nameCell = row.querySelector('[data-field="name"]');
    nameCell.innerHTML = src.name + (state.upgradeLevel > 0 ? ` <span style="color:#999;font-size:10px">Lv${state.upgradeLevel}</span>` : '');

    // Employees
    row.querySelector('[data-field="emp"]').textContent = state.employees;

    // Rate
    row.querySelector('[data-field="rate"]').textContent = formatRate(rev);

    // Action 1: Hire
    const a1 = row.querySelector('[data-field="action1"]');
    a1.innerHTML = `<button class="cell-btn btn-hire" onclick="hireEmployee(${i})" ${gameState.cash >= hCost ? '' : 'disabled'}>Hire ${formatMoney(hCost)}</button>`;

    // Action 2: Upgrade or Automate
    const a2 = row.querySelector('[data-field="action2"]');
    if (!state.automated) {
      a2.innerHTML = `<button class="cell-btn btn-automate" onclick="automateSource(${i})" ${gameState.cash >= aCost ? '' : 'disabled'} title="Revenue flows automatically">Auto ${formatMoney(aCost)}</button>`;
    } else {
      a2.innerHTML = `<button class="cell-btn btn-upgrade" onclick="upgradeSource(${i})" ${gameState.cash >= uCost ? '' : 'disabled'} title="+50% efficiency per employee">⬆ ${formatMoney(uCost)}</button>`;
    }

    // Action 3: Collect or AUTO badge
    const a3 = row.querySelector('[data-field="action3"]');
    if (!state.automated) {
      const pending = state.pendingCollect;
      const hasPending = pending > 0.005; // avoid floating point noise
      a3.innerHTML = `<button class="cell-btn btn-collect" onclick="collectSource(${i})" ${hasPending ? '' : 'disabled'}>Collect${hasPending ? ' ' + formatMoney(pending) : ''}</button>`;
    } else {
      a3.innerHTML = '<span class="auto-badge">⚡ AUTO</span>';
    }
  }
}

function isNextUnlock(index) {
  for (let i = 0; i < SOURCES.length; i++) {
    if (!gameState.sources[i].unlocked) return i === index;
  }
  return false;
}

function updateDisplay() {
  const cashEl = document.getElementById('cash-display');
  cashEl.textContent = formatMoney(gameState.cash);

  const totalRev = totalRevPerSec();
  document.getElementById('total-rev').textContent = formatRate(totalRev);
  document.getElementById('status-rev').textContent = 'Revenue: ' + formatRate(totalRev);

  const activeCount = gameState.sources.filter(s => s.unlocked).length;
  const lastRow = activeCount + 3;
  document.getElementById('formula-input').textContent = `=SUM(C4:C${lastRow})`;
  document.getElementById('cell-ref').textContent = 'C2';

  if (gameState.powerOutage && Date.now() < gameState.powerOutage.until) {
    document.getElementById('status-text').textContent = '⚡ Power Outage — Systems Offline';
  } else if (gameState.revPenalty && Date.now() < gameState.revPenalty.until) {
    document.getElementById('status-text').textContent = '⚠ Revenue penalty active';
  } else {
    document.getElementById('status-text').textContent = 'Ready';
  }
}

// ===== GAME ACTIONS =====
function unlockSource(index) {
  const src = SOURCES[index];
  const state = gameState.sources[index];
  if (state.unlocked || gameState.cash < src.unlockCost) return;
  if (!isNextUnlock(index)) return;

  gameState.cash -= src.unlockCost;
  state.unlocked = true;
  state.employees = 1;
  buildGrid(); // Structural change
  updateDisplay();
  flashCash();
}

function hireEmployee(index) {
  const state = gameState.sources[index];
  if (!state.unlocked) return;
  const cost = hireCost(state);
  if (gameState.cash < cost) return;

  gameState.cash -= cost;
  state.employees++;
  updateGridValues();
  updateDisplay();
  flashCash();
}

function upgradeSource(index) {
  const state = gameState.sources[index];
  if (!state.unlocked) return;
  const cost = upgradeCost(state);
  if (gameState.cash < cost) return;

  gameState.cash -= cost;
  state.upgradeLevel++;
  updateGridValues();
  updateDisplay();
  flashCash();
}

function automateSource(index) {
  const state = gameState.sources[index];
  if (!state.unlocked || state.automated) return;
  const cost = automateCost(state);
  if (gameState.cash < cost) return;

  gameState.cash -= cost;
  state.automated = true;
  gameState.cash += state.pendingCollect;
  gameState.totalEarned += state.pendingCollect;
  state.pendingCollect = 0;
  updateGridValues();
  updateDisplay();
  flashCash();
}

function collectSource(index) {
  const state = gameState.sources[index];
  if (!state.unlocked || state.automated || state.pendingCollect <= 0.005) return;

  gameState.cash += state.pendingCollect;
  gameState.totalEarned += state.pendingCollect;
  state.pendingCollect = 0;

  const row = document.getElementById(`source-row-${index}`);
  if (row) {
    row.classList.add('collect-flash');
    setTimeout(() => row.classList.remove('collect-flash'), 300);
  }

  updateGridValues();
  updateDisplay();
  flashCash();
}

function flashCash() {
  const el = document.getElementById('cash-display');
  el.classList.remove('cash-bump');
  void el.offsetWidth;
  el.classList.add('cash-bump');
}

// ===== GAME LOOP (1 second ticks) =====
function gameTick() {
  const now = Date.now();
  const isPowerOut = gameState.powerOutage && now < gameState.powerOutage.until;

  if (!isPowerOut) {
    let penaltyMult = 1;
    if (gameState.revPenalty && now < gameState.revPenalty.until) {
      penaltyMult = gameState.revPenalty.mult;
    } else {
      gameState.revPenalty = null;
    }

    for (const state of gameState.sources) {
      if (!state.unlocked || state.employees === 0) continue;
      const rev = sourceRevPerSec(state) * penaltyMult;

      if (state.automated) {
        gameState.cash += rev;
        gameState.totalEarned += rev;
      } else {
        state.pendingCollect += rev;
      }
    }
  }

  gameState.totalPlayTime++;
  gameState.lastTick = now;

  // Event system
  if (gameState.eventCooldown > 0) {
    gameState.eventCooldown--;
  } else if (!document.getElementById('event-toast').classList.contains('hidden')) {
    // Toast already visible
  } else {
    if (Math.random() < 0.015 && gameState.totalPlayTime > 30) {
      triggerRandomEvent();
      gameState.eventCooldown = 60 + Math.floor(Math.random() * 60);
    }
  }

  // $1M milestone
  if (gameState.totalEarned >= 1000000 && !gameState.seriesAShown) {
    gameState.seriesAShown = true;
    showSeriesA();
  }

  // Incremental display update (no DOM rebuild)
  updateGridValues();
  updateDisplay();
}

// ===== EVENTS =====
function triggerRandomEvent() {
  const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
  showEvent(event);
}

function showEvent(event) {
  const toast = document.getElementById('event-toast');
  document.getElementById('toast-sender').textContent = event.sender;
  document.getElementById('toast-body').textContent = event.body;

  const actionsDiv = document.getElementById('toast-actions');
  actionsDiv.innerHTML = '';
  event.actions.forEach((action, i) => {
    const btn = document.createElement('button');
    btn.className = 'toast-btn' + (i === 0 ? ' toast-primary' : '');
    btn.textContent = action.label;
    btn.onclick = () => {
      const result = action.effect(gameState);
      document.getElementById('status-text').textContent = result;
      setTimeout(() => {
        document.getElementById('status-text').textContent = 'Ready';
      }, 3000);
      dismissEvent();
      updateDisplay();
    };
    actionsDiv.appendChild(btn);
  });

  toast.classList.remove('hidden');
}

function dismissEvent() {
  document.getElementById('event-toast').classList.add('hidden');
}

// ===== BOSS KEY =====
function toggleBossMode() {
  gameState.bossMode = !gameState.bossMode;
  document.getElementById('game-view').classList.toggle('hidden', gameState.bossMode);
  document.getElementById('boss-view').classList.toggle('hidden', !gameState.bossMode);

  if (gameState.bossMode) {
    document.getElementById('event-toast').classList.add('hidden');
    document.title = 'Book1 - Excel';
  } else {
    document.title = 'Q4 Financials - Operations.xlsx - Excel Online';
  }
}

// ===== SAVE / LOAD =====
function saveGame() {
  const saveData = {
    cash: gameState.cash,
    totalEarned: gameState.totalEarned,
    sources: gameState.sources.map(s => ({
      id: s.id,
      unlocked: s.unlocked,
      employees: s.employees,
      upgradeLevel: s.upgradeLevel,
      automated: s.automated,
      pendingCollect: s.pendingCollect,
    })),
    seriesAShown: gameState.seriesAShown,
    totalPlayTime: gameState.totalPlayTime,
    savedAt: Date.now(),
  };

  try {
    localStorage.setItem('quarterClose_save', JSON.stringify(saveData));
    gameState.lastSave = Date.now();

    const saveEl = document.getElementById('status-save');
    saveEl.textContent = '💾 Saved!';
    setTimeout(() => { saveEl.textContent = '💾 Saved'; }, 1500);
  } catch (e) {
    console.error('Save failed:', e);
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem('quarterClose_save');
    if (!raw) return false;

    const data = JSON.parse(raw);
    const now = Date.now();
    const elapsed = Math.min((now - data.savedAt) / 1000, 8 * 3600);

    gameState.cash = data.cash || 50;
    gameState.totalEarned = data.totalEarned || 0;
    gameState.seriesAShown = data.seriesAShown || false;
    gameState.totalPlayTime = data.totalPlayTime || 0;

    if (data.sources) {
      data.sources.forEach((saved, i) => {
        if (i < gameState.sources.length) {
          gameState.sources[i].unlocked = saved.unlocked;
          gameState.sources[i].employees = saved.employees;
          gameState.sources[i].upgradeLevel = saved.upgradeLevel;
          gameState.sources[i].automated = saved.automated;
          gameState.sources[i].pendingCollect = saved.pendingCollect || 0;
        }
      });
    }

    // Offline earnings
    if (elapsed > 5) {
      let offlineEarnings = 0;
      for (const state of gameState.sources) {
        if (state.unlocked && state.automated && state.employees > 0) {
          offlineEarnings += sourceRevPerSec(state) * elapsed;
        }
      }
      if (offlineEarnings > 0) {
        gameState.cash += offlineEarnings;
        gameState.totalEarned += offlineEarnings;
        showOfflineModal(elapsed, offlineEarnings);
      }
    }

    return true;
  } catch (e) {
    console.error('Load failed:', e);
    return false;
  }
}

// ===== OFFLINE MODAL =====
function showOfflineModal(elapsedSeconds, earnings) {
  const body = document.getElementById('offline-body');
  body.innerHTML = `
    <p>Your team worked while you were away!</p>
    <p>⏱ Time elapsed: <strong>${formatDuration(elapsedSeconds)}</strong></p>
    <p>💰 Earnings: <strong>${formatMoney(earnings)}</strong></p>
    ${elapsedSeconds >= 8 * 3600 ? '<p style="color:#999;font-size:11px">(Capped at 8 hours overtime)</p>' : ''}
  `;
  document.getElementById('offline-modal').classList.remove('hidden');
}

function dismissOffline() {
  document.getElementById('offline-modal').classList.add('hidden');
}

// ===== SERIES A =====
function showSeriesA() {
  document.getElementById('series-a-modal').classList.remove('hidden');
}

function dismissSeriesA() {
  document.getElementById('series-a-modal').classList.add('hidden');
}

// ===== BOSS VIEW GENERATION =====
function generateBossGrid() {
  const grid = document.getElementById('boss-grid');
  grid.innerHTML = '';

  const corner = document.createElement('div');
  corner.style.cssText = 'background:#f0f0f0;border-right:1px solid #c0c0c0;border-bottom:1px solid #c0c0c0;';
  grid.appendChild(corner);

  const cols = 'ABCDEFGHIJ';
  for (let c = 0; c < 10; c++) {
    const header = document.createElement('div');
    header.className = 'boss-col-header';
    header.textContent = cols[c];
    grid.appendChild(header);
  }

  for (let r = 1; r <= 30; r++) {
    const rn = document.createElement('div');
    rn.className = 'boss-row-num';
    rn.textContent = r;
    grid.appendChild(rn);
    for (let c = 0; c < 10; c++) {
      const cell = document.createElement('div');
      cell.className = 'boss-cell';
      grid.appendChild(cell);
    }
  }
}

// ===== KEYBOARD HANDLERS =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    e.preventDefault();
    toggleBossMode();
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveGame();
    return;
  }
});

// ===== AUTO-SAVE (every 30s) =====
setInterval(() => { saveGame(); }, 30000);

// ===== INITIALIZATION =====
function init() {
  generateBossGrid();
  loadGame();
  buildGrid();
  updateDisplay();
  setInterval(gameTick, 1000);
  gameState.eventCooldown = 30;
}

// Expose for inline onclick
window.unlockSource = unlockSource;
window.hireEmployee = hireEmployee;
window.upgradeSource = upgradeSource;
window.automateSource = automateSource;
window.collectSource = collectSource;
window.dismissEvent = dismissEvent;
window.dismissOffline = dismissOffline;
window.dismissSeriesA = dismissSeriesA;

document.addEventListener('DOMContentLoaded', init);
