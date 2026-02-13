/* ============================================
   Quarter Close — Game Engine (Phase 1)
   ============================================ */

// ===== BUSINESS ARC DEFINITIONS =====
const ARCS = {
  tech: {
    name: 'Tech Startup',
    icon: '💻',
    desc: 'From blog to software empire',
    sources: [
      { name: 'Blog with Ads',       flavor: 'Monetize your hot takes' },
      { name: 'Freelance Web Dev',    flavor: 'Fiverr but classier' },
      { name: 'WordPress Agency',     flavor: 'Starter sites for everyone' },
      { name: 'SaaS MVP',            flavor: 'Monthly recurring revenue!' },
      { name: 'Mobile App',          flavor: 'There\'s an app for that' },
      { name: 'Series A Startup',    flavor: 'Burn rate is just a number' },
      { name: 'Dev Shop',            flavor: '50 engineers and a dream' },
      { name: 'Software Company',    flavor: 'Enterprise contracts 💰' },
    ]
  },
  food: {
    name: 'Food Empire',
    icon: '🍋',
    desc: 'From lemonade stand to food & beverage corp',
    sources: [
      { name: 'Lemonade Stand',       flavor: 'When life gives you lemons...' },
      { name: 'Food Cart',            flavor: 'Street food hustle' },
      { name: 'Food Truck',           flavor: 'Mobile and trendy' },
      { name: 'Small Restaurant',     flavor: 'Finally, a real kitchen' },
      { name: 'Catering Company',     flavor: 'Weddings pay well' },
      { name: 'Restaurant Chain',     flavor: 'Location, location, location' },
      { name: 'Franchise Operation',  flavor: 'Other people run your stores' },
      { name: 'Food & Beverage Corp', flavor: 'Fortune 500 here we come' },
    ]
  },
  ecommerce: {
    name: 'E-Commerce Hustler',
    icon: '📦',
    desc: 'From garage sales to retail empire',
    sources: [
      { name: 'Garage Sale',          flavor: 'One man\'s trash...' },
      { name: 'eBay Reselling',       flavor: 'Buy low, sell high' },
      { name: 'Dropshipping Store',   flavor: 'Never touch inventory' },
      { name: 'Amazon FBA',           flavor: 'Let Bezos handle logistics' },
      { name: 'Warehouse & Distro',   flavor: 'Cutting out the middleman' },
      { name: 'Private Label Brand',  flavor: 'Your name on the box' },
      { name: 'Retail Chain',         flavor: 'Brick and mortar comeback' },
      { name: 'Consumer Empire',      flavor: 'Everything ships next day' },
    ]
  },
  generic: {
    name: 'Entrepreneur',
    icon: '📈',
    desc: 'From side hustle to tech company',
    sources: [
      { name: 'Tutoring Service',     flavor: 'Teach what you know' },
      { name: 'Online Course',        flavor: 'Passive income guru' },
      { name: 'Consulting Gig',       flavor: 'Charge by the hour' },
      { name: 'Small Agency',         flavor: 'Hire your first team' },
      { name: 'SaaS Product',         flavor: 'Productize the service' },
      { name: 'Venture-Backed Startup', flavor: 'Other people\'s money' },
      { name: 'Growth-Stage Company', flavor: 'Hockey stick chart' },
      { name: 'Tech Company',         flavor: 'IPO is calling' },
    ]
  },
};

// ===== ECONOMY (rebalanced) =====
const SOURCE_STATS = [
  { baseRate: 0.05,  unlockCost: 0,       clickValue: 1,   autoCostMult: 10 },
  { baseRate: 0.25,  unlockCost: 50,      clickValue: 2,   autoCostMult: 10 },
  { baseRate: 1,     unlockCost: 200,     clickValue: 3,   autoCostMult: 10 },
  { baseRate: 4,     unlockCost: 1000,    clickValue: 5,   autoCostMult: 10 },
  { baseRate: 12,    unlockCost: 5000,    clickValue: 8,   autoCostMult: 10 },
  { baseRate: 40,    unlockCost: 20000,   clickValue: 12,  autoCostMult: 10 },
  { baseRate: 120,   unlockCost: 60000,   clickValue: 15,  autoCostMult: 10 },
  { baseRate: 400,   unlockCost: 150000,  clickValue: 20,  autoCostMult: 10 },
];

// ===== MINI-TASK DEFINITIONS =====
const MINI_TASKS = [
  { text: 'Approve Invoice #{{num}}?', reward: [5, 10], type: 'approve' },
  { text: 'Sign contract for Client #{{num}}', reward: [8, 15], type: 'approve' },
  { text: 'Review expense report (${{num}})', reward: [5, 8], type: 'approve' },
  { text: 'Authorize PO #{{num}}', reward: [6, 12], type: 'approve' },
  { text: 'Confirm delivery #{{num}}', reward: [4, 8], type: 'approve' },
  { text: 'Reply to vendor inquiry', reward: [3, 7], type: 'approve' },
  { text: 'Process refund #{{num}}', reward: [5, 10], type: 'approve' },
  { text: 'Approve time sheet for Week {{num}}', reward: [4, 9], type: 'approve' },
];

// ===== EVENTS DEFINITIONS =====
const EVENTS = [
  {
    sender: 'Mom',
    subject: 'Quick investment opportunity',
    body: 'Honey, I believe in your little business! I want to invest $50. No strings attached!',
    actions: [
      { label: 'Accept (+$50)', effect: (gs) => { gs.cash += 50; return 'Mom invested $50!'; } },
      { label: 'Decline (no effect)', effect: () => 'You declined. Mom is mildly hurt.' },
    ]
  },
  {
    sender: 'Angry Customer',
    subject: 'RE: TERRIBLE SERVICE!!!',
    body: 'I want a FULL REFUND or I\'m leaving a 1-star review everywhere!',
    actions: [
      { label: 'Refund them (-$20)', effect: (gs) => {
        if (gs.cash >= 20) { gs.cash -= 20; return 'Complaint resolved. Crisis averted.'; }
        return 'You don\'t have $20! Customer left a bad review.';
      }},
      { label: 'Ignore (rev -10% for 60s)', effect: (gs) => {
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
      { label: 'Pay taxes (-10% cash)', effect: (gs) => {
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
      { label: 'Give discount (+morale)', effect: () => 'Your friend is happy! Team morale +vibes.' },
      { label: 'Full price (no effect)', effect: () => 'They understand. Business is business.' },
    ]
  },
  {
    sender: 'IT Department',
    subject: '⚠️ POWER OUTAGE - Building 3',
    body: 'Emergency maintenance required. All systems will be offline for approximately 15 seconds.',
    actions: [
      { label: 'OK (rev paused 15s)', effect: (gs) => {
        gs.powerOutage = { until: Date.now() + 15000 };
        return '⚡ Power outage! Revenue paused for 15 seconds.';
      }},
    ]
  },
];

// ===== GAME STATE =====
let gameState = {
  arc: null,  // selected arc key
  cash: 0,
  totalEarned: 0,
  sources: [],
  revPenalty: null,
  powerOutage: null,
  seriesAShown: false,
  lastSave: Date.now(),
  lastTick: Date.now(),
  bossMode: false,
  eventCooldown: 0,
  totalPlayTime: 0,
  miniTaskCooldown: 0,
  miniTaskActive: false,
  totalClicks: 0,
};

let gridBuilt = false;

// ===== GET ACTIVE SOURCES (arc-aware) =====
function getSourceDef(index) {
  const arc = ARCS[gameState.arc];
  const stats = SOURCE_STATS[index];
  return {
    id: index,
    name: arc.sources[index].name,
    flavor: arc.sources[index].flavor,
    baseRate: stats.baseRate,
    unlockCost: stats.unlockCost,
    clickValue: stats.clickValue,
  };
}

// ===== COST FORMULAS =====
function hireCost(source) {
  const stats = SOURCE_STATS[source.id];
  const base = stats.unlockCost || 10;
  return Math.max(5, Math.floor(base * 0.5 * Math.pow(1.15, source.employees)));
}

function upgradeCost(source) {
  const stats = SOURCE_STATS[source.id];
  return Math.floor(Math.max(50, 10 * stats.baseRate) * Math.pow(2, source.upgradeLevel));
}

function automateCost(source) {
  const stats = SOURCE_STATS[source.id];
  return Math.floor(Math.max(50, stats.unlockCost) * stats.autoCostMult);
}

function sourceRevPerSec(source) {
  if (!source.unlocked || source.employees === 0) return 0;
  const stats = SOURCE_STATS[source.id];
  const upgradeMult = 1 + source.upgradeLevel * 0.5;
  return source.employees * stats.baseRate * upgradeMult;
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

// ===== ARC SELECTION =====
function selectArc(arcKey) {
  gameState.arc = arcKey;
  gameState.cash = 0;
  gameState.totalEarned = 0;
  gameState.sources = SOURCE_STATS.map((s, i) => ({
    id: i,
    unlocked: i === 0,
    employees: i === 0 ? 1 : 0,
    upgradeLevel: 0,
    automated: false,
    pendingCollect: 0,
  }));
  gameState.seriesAShown = false;
  gameState.totalPlayTime = 0;
  gameState.eventCooldown = 30;
  gameState.miniTaskCooldown = 10;
  gameState.miniTaskActive = false;

  document.getElementById('arc-select').classList.add('hidden');
  document.getElementById('game-view').classList.remove('hidden');

  buildGrid();
  updateDisplay();
  saveGame();
}

function showArcSelect() {
  const container = document.getElementById('arc-options');
  container.innerHTML = '';
  for (const [key, arc] of Object.entries(ARCS)) {
    const div = document.createElement('div');
    div.className = 'arc-option';
    div.onclick = () => selectArc(key);
    div.innerHTML = `
      <div class="arc-icon">${arc.icon}</div>
      <div class="arc-name">${arc.name}</div>
      <div class="arc-desc">${arc.desc}</div>
      <div class="arc-first">${arc.sources[0].name} → ${arc.sources[7].name}</div>
    `;
    container.appendChild(div);
  }
  document.getElementById('arc-select').classList.remove('hidden');
  document.getElementById('game-view').classList.add('hidden');
}

// ===== MINI-TASKS =====
function trySpawnMiniTask() {
  if (gameState.miniTaskActive) return;
  if (gameState.miniTaskCooldown > 0) { gameState.miniTaskCooldown--; return; }

  // Frequency decreases as passive income grows
  const passiveIncome = totalRevPerSec();
  const spawnChance = passiveIncome > 50 ? 0.02 : passiveIncome > 10 ? 0.04 : 0.06;
  if (Math.random() > spawnChance) return;

  const task = MINI_TASKS[Math.floor(Math.random() * MINI_TASKS.length)];
  const num = Math.floor(Math.random() * 9000) + 1000;
  const reward = task.reward[0] + Math.floor(Math.random() * (task.reward[1] - task.reward[0] + 1));
  const text = task.text.replace('{{num}}', num);

  showMiniTask(text, reward);
}

function showMiniTask(text, reward) {
  gameState.miniTaskActive = true;
  const bar = document.getElementById('mini-task-bar');
  document.getElementById('mini-task-text').textContent = text;
  document.getElementById('mini-task-reward').textContent = `+${formatMoney(reward)}`;
  bar.dataset.reward = reward;
  bar.classList.remove('hidden');
}

function completeMiniTask() {
  const bar = document.getElementById('mini-task-bar');
  const reward = parseFloat(bar.dataset.reward) || 0;
  gameState.cash += reward;
  gameState.totalEarned += reward;
  gameState.totalClicks++;
  bar.classList.add('hidden');
  gameState.miniTaskActive = false;
  gameState.miniTaskCooldown = 15 + Math.floor(Math.random() * 15); // 15-30s cooldown

  // Flash feedback
  document.getElementById('status-text').textContent = `✅ Task done! +${formatMoney(reward)}`;
  setTimeout(() => { document.getElementById('status-text').textContent = 'Ready'; }, 2000);

  flashCash();
  updateDisplay();
}

function skipMiniTask() {
  const bar = document.getElementById('mini-task-bar');
  bar.classList.add('hidden');
  gameState.miniTaskActive = false;
  gameState.miniTaskCooldown = 10;
}

// ===== RENDERING =====
function buildGrid() {
  if (!gameState.arc) return;
  const container = document.getElementById('revenue-rows');
  container.innerHTML = '';

  for (let i = 0; i < SOURCE_STATS.length; i++) {
    const src = getSourceDef(i);
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
  const startRow = SOURCE_STATS.length + 4;
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

function updateGridValues() {
  if (!gameState.arc) return;
  for (let i = 0; i < SOURCE_STATS.length; i++) {
    const src = getSourceDef(i);
    const state = gameState.sources[i];
    const row = document.getElementById(`source-row-${i}`);
    if (!row) continue;

    if (!state.unlocked) {
      const unlockBtn = row.querySelector('[data-btn="unlock"]');
      if (unlockBtn) {
        unlockBtn.disabled = gameState.cash < src.unlockCost;
      }
      continue;
    }

    if (row.classList.contains('source-locked')) {
      buildGrid();
      return;
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

    // Action 3: Collect (click) or AUTO badge
    const a3 = row.querySelector('[data-field="action3"]');
    if (!state.automated) {
      const pending = state.pendingCollect;
      const clickVal = src.clickValue;
      const hasPending = pending > 0.005;
      a3.innerHTML = `<button class="cell-btn btn-collect" onclick="collectSource(${i})">Collect${hasPending ? ' ' + formatMoney(pending) : ''} (+${formatMoney(clickVal)})</button>`;
    } else {
      a3.innerHTML = '<span class="auto-badge">⚡ AUTO</span>';
    }
  }
}

function isNextUnlock(index) {
  for (let i = 0; i < SOURCE_STATS.length; i++) {
    if (!gameState.sources[i].unlocked) return i === index;
  }
  return false;
}

function updateDisplay() {
  if (!gameState.arc) return;
  const cashEl = document.getElementById('cash-display');
  cashEl.textContent = formatMoney(gameState.cash);

  const totalRev = totalRevPerSec();
  document.getElementById('total-rev').textContent = formatRate(totalRev);
  document.getElementById('status-rev').textContent = 'Revenue: ' + formatRate(totalRev);

  // Play time
  const t = gameState.totalPlayTime;
  const hrs = Math.floor(t / 3600);
  const mins = Math.floor((t % 3600) / 60);
  const secs = t % 60;
  const timeStr = hrs > 0
    ? `⏱ ${hrs}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`
    : `⏱ ${mins}:${String(secs).padStart(2,'0')}`;
  document.getElementById('status-time').textContent = timeStr;
  document.getElementById('status-clicks').textContent = '🖱 ' + gameState.totalClicks;

  const activeCount = gameState.sources.filter(s => s.unlocked).length;
  const lastRow = activeCount + 3;
  document.getElementById('formula-input').textContent = `=SUM(C4:C${lastRow})`;
  document.getElementById('cell-ref').textContent = 'C2';

  if (gameState.powerOutage && Date.now() < gameState.powerOutage.until) {
    document.getElementById('status-text').textContent = '⚡ Power Outage — Systems Offline';
  } else if (gameState.revPenalty && Date.now() < gameState.revPenalty.until) {
    document.getElementById('status-text').textContent = '⚠ Revenue penalty active';
  }
  // Don't overwrite mini-task feedback messages
}

// ===== GAME ACTIONS =====
function unlockSource(index) {
  const src = getSourceDef(index);
  const state = gameState.sources[index];
  if (state.unlocked || gameState.cash < src.unlockCost) return;
  if (!isNextUnlock(index)) return;

  gameState.cash -= src.unlockCost;
  state.unlocked = true;
  state.employees = 1;
  buildGrid();
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
  if (!state.unlocked || state.automated) return;

  // Click value = flat bonus per click + any pending passive
  const src = getSourceDef(index);
  const clickEarnings = src.clickValue + state.pendingCollect;
  gameState.cash += clickEarnings;
  gameState.totalEarned += clickEarnings;
  gameState.totalClicks++;
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
  if (!gameState.arc) return;
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

  // Mini-task system
  trySpawnMiniTask();

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
  const gameVisible = !gameState.bossMode && gameState.arc;
  document.getElementById('game-view').classList.toggle('hidden', !gameVisible);
  document.getElementById('boss-view').classList.toggle('hidden', !gameState.bossMode);

  if (gameState.bossMode) {
    document.getElementById('event-toast').classList.add('hidden');
    document.getElementById('mini-task-bar').classList.add('hidden');
    document.title = 'Book1 - Excel';
  } else {
    document.title = 'Q4 Financials - Operations.xlsx - Quarter Close';
  }
}

// ===== SAVE / LOAD =====
function saveGame() {
  if (!gameState.arc) return;
  const saveData = {
    arc: gameState.arc,
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
    totalClicks: gameState.totalClicks,
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
    if (!data.arc) return false;

    const now = Date.now();
    const elapsed = Math.min((now - data.savedAt) / 1000, 8 * 3600);

    gameState.arc = data.arc;
    gameState.cash = data.cash || 0;
    gameState.totalEarned = data.totalEarned || 0;
    gameState.seriesAShown = data.seriesAShown || false;
    gameState.totalPlayTime = data.totalPlayTime || 0;
    gameState.totalClicks = data.totalClicks || 0;
    gameState.eventCooldown = 30;
    gameState.miniTaskCooldown = 10;

    // Rebuild sources for selected arc
    gameState.sources = SOURCE_STATS.map((s, i) => ({
      id: i,
      unlocked: false,
      employees: 0,
      upgradeLevel: 0,
      automated: false,
      pendingCollect: 0,
    }));

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

    // Show game view (skip arc select)
    document.getElementById('arc-select').classList.add('hidden');
    document.getElementById('game-view').classList.remove('hidden');
    buildGrid();
    updateDisplay();

    return true;
  } catch (e) {
    console.error('Load failed:', e);
    return false;
  }
}

function resetGame() {
  localStorage.removeItem('quarterClose_save');
  gameState.arc = null;
  gameState.cash = 0;
  gameState.totalEarned = 0;
  gameState.sources = [];
  gameState.seriesAShown = false;
  gameState.totalPlayTime = 0;
  gameState.totalClicks = 0;
  showArcSelect();
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
let autosaveEnabled = true;
let autosaveInterval = setInterval(() => { saveGame(); }, 30000);

// ===== FILE MENU =====
let fileMenuOpen = false;

function toggleFileMenu(e) {
  e.stopPropagation();
  fileMenuOpen = !fileMenuOpen;
  const dropdown = document.getElementById('file-dropdown');
  dropdown.classList.toggle('open', fileMenuOpen);
  updateAutosaveToggle();
}

function closeFileMenu() {
  fileMenuOpen = false;
  const dropdown = document.getElementById('file-dropdown');
  if (dropdown) dropdown.classList.remove('open');
}

function toggleAutosave(e) {
  e.stopPropagation();
  autosaveEnabled = !autosaveEnabled;
  if (autosaveEnabled) {
    autosaveInterval = setInterval(() => { saveGame(); }, 30000);
    document.getElementById('status-text').textContent = 'Auto-save enabled';
  } else {
    clearInterval(autosaveInterval);
    document.getElementById('status-text').textContent = 'Auto-save disabled';
  }
  updateAutosaveToggle();
  setTimeout(() => { document.getElementById('status-text').textContent = 'Ready'; }, 2000);
}

function updateAutosaveToggle() {
  const el = document.getElementById('autosave-toggle');
  if (el) el.classList.toggle('off', !autosaveEnabled);
}

function showAbout() {
  closeFileMenu();
  document.getElementById('about-modal').classList.remove('hidden');
}

function dismissAbout() {
  document.getElementById('about-modal').classList.add('hidden');
}

let pendingConfirmAction = null;

function confirmNewGame() {
  closeFileMenu();
  document.getElementById('confirm-text').textContent = 'Start a new game? All progress will be lost.';
  document.getElementById('confirm-modal').classList.remove('hidden');
  pendingConfirmAction = () => {
    resetGame();
    dismissConfirm();
  };
}

function confirmAction() {
  if (pendingConfirmAction) pendingConfirmAction();
  pendingConfirmAction = null;
}

function dismissConfirm() {
  document.getElementById('confirm-modal').classList.add('hidden');
  pendingConfirmAction = null;
}

// Close file menu when clicking anywhere else
document.addEventListener('click', (e) => {
  if (fileMenuOpen && !e.target.closest('#file-menu')) {
    closeFileMenu();
  }
});

// ===== INITIALIZATION =====
function init() {
  generateBossGrid();
  const loaded = loadGame();
  if (!loaded) {
    showArcSelect();
  }
  setInterval(gameTick, 1000);
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
window.selectArc = selectArc;
window.resetGame = resetGame;
window.completeMiniTask = completeMiniTask;
window.skipMiniTask = skipMiniTask;
window.toggleFileMenu = toggleFileMenu;
window.toggleAutosave = toggleAutosave;
window.showAbout = showAbout;
window.dismissAbout = dismissAbout;
window.confirmNewGame = confirmNewGame;
window.confirmAction = confirmAction;
window.dismissConfirm = dismissConfirm;

document.addEventListener('DOMContentLoaded', init);
