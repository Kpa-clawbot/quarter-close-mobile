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

// ===== ECONOMY (real-world annual revenue per employee) =====
// baseRate = annual revenue in dollars for 1 employee
// Game ticks at 1/s, time scale converts annual → per-tick
const SOURCE_STATS = [
  { baseRate: 3000,        unlockCost: 0,       clickValue: 1,   autoCostMult: 10 },  // ~$3K/yr lemonade stand
  { baseRate: 30000,       unlockCost: 500,     clickValue: 5,   autoCostMult: 10 },  // ~$30K/yr food cart
  { baseRate: 200000,      unlockCost: 5000,    clickValue: 20,  autoCostMult: 10 },  // ~$200K/yr food truck
  { baseRate: 500000,      unlockCost: 25000,   clickValue: 50,  autoCostMult: 10 },  // ~$500K/yr restaurant
  { baseRate: 1000000,     unlockCost: 100000,  clickValue: 100, autoCostMult: 10 },  // ~$1M/yr catering
  { baseRate: 5000000,     unlockCost: 500000,  clickValue: 250, autoCostMult: 10 },  // ~$5M/yr chain
  { baseRate: 20000000,    unlockCost: 2000000, clickValue: 500, autoCostMult: 10 },  // ~$20M/yr franchise
  { baseRate: 100000000,   unlockCost: 10000000,clickValue: 1000,autoCostMult: 10 },  // ~$100M/yr corp
];

// ===== TIME SCALE =====
// Each tick = 1 real second, but represents more in-game time early on
const TIME_SCALES = [
  { threshold: 0,      secsPerTick: 86400, label: '⏩⏩ 1 day/s',  unit: 'day' },   // start
  { threshold: 0.1,    secsPerTick: 3600,  label: '⏩ 1 hr/s',     unit: 'hour' },   // ~$3.15M/yr
  { threshold: 1,      secsPerTick: 60,    label: '▶ 1 min/s',     unit: 'minute' }, // ~$31.5M/yr
  { threshold: 10,     secsPerTick: 1,     label: '▶ Real-time',   unit: 'second' }, // ~$315M/yr
];

let currentTimeScaleIndex = 0;

function getTimeScale() {
  const realPerSec = totalRealRevPerSec();
  let idx = 0;
  for (let i = TIME_SCALES.length - 1; i >= 0; i--) {
    if (realPerSec >= TIME_SCALES[i].threshold) { idx = i; break; }
  }
  return idx;
}

// Real rev/s (annual / seconds_per_year) — used for time scale thresholds
function totalRealRevPerSec() {
  let total = 0;
  const secsPerYear = 365.25 * 86400;
  for (const s of gameState.sources) {
    if (!s.unlocked || s.employees === 0) continue;
    const stats = SOURCE_STATS[s.id];
    const upgradeMult = 1 + s.upgradeLevel * 0.5;
    total += s.employees * stats.baseRate / secsPerYear * upgradeMult;
  }
  return total;
}

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
    body: 'Emergency maintenance required. All systems will be offline for approximately 15 seconds. This cannot be prevented.',
    timed: true,
    timedDelay: 5000,  // 5 second countdown
    timedEffect: (gs) => {
      gs.powerOutage = { until: Date.now() + 15000 };
      return '⚡ Power outage! Revenue paused for 15 seconds.';
    },
    actions: []
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
  gameStartDate: Date.UTC(2024, 0, 1),  // Jan 1, 2024
  gameElapsedSecs: 0,
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

// Revenue per tick for a source (annual rate * time_scale / secs_per_year)
function sourceRevPerTick(source) {
  if (!source.unlocked || source.employees === 0) return 0;
  const stats = SOURCE_STATS[source.id];
  const upgradeMult = 1 + source.upgradeLevel * 0.5;
  const secsPerYear = 365.25 * 86400;
  const scale = TIME_SCALES[currentTimeScaleIndex];
  return source.employees * stats.baseRate * upgradeMult * scale.secsPerTick / secsPerYear;
}

function totalRevPerTick() {
  let total = 0;
  for (const s of gameState.sources) {
    total += sourceRevPerTick(s);
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

// Annual revenue for display
function sourceAnnualRev(source) {
  if (!source.unlocked || source.employees === 0) return 0;
  const stats = SOURCE_STATS[source.id];
  const upgradeMult = 1 + source.upgradeLevel * 0.5;
  return source.employees * stats.baseRate * upgradeMult;
}

function totalAnnualRev() {
  let total = 0;
  for (const s of gameState.sources) {
    total += sourceAnnualRev(s);
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

function formatRate(annualRev) {
  // Show rate in the most readable unit
  if (annualRev >= 1e9) return '$' + (annualRev / 1e9).toFixed(1) + 'B/yr';
  if (annualRev >= 1e6) return '$' + (annualRev / 1e6).toFixed(1) + 'M/yr';
  if (annualRev >= 1e3) return '$' + (annualRev / 1e3).toFixed(0) + 'K/yr';
  return '$' + annualRev.toFixed(0) + '/yr';
}

function formatPerTick(perTick) {
  if (perTick >= 1e6) return '$' + (perTick / 1e6).toFixed(1) + 'M';
  if (perTick >= 1e3) return '$' + (perTick / 1e3).toFixed(1) + 'K';
  if (perTick >= 1) return '$' + perTick.toFixed(2);
  if (perTick >= 0.01) return '$' + perTick.toFixed(2);
  return '$' + perTick.toFixed(4);
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
  gameState.gameStartDate = Date.UTC(2024, 0, 1);
  gameState.gameElapsedSecs = 0;
  currentTimeScaleIndex = 0;

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
  const passiveIncome = totalRevPerTick();
  const spawnChance = passiveIncome > 500 ? 0.02 : passiveIncome > 50 ? 0.04 : 0.06;
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

// ===== TIME SCALE CHANGE NOTIFICATION =====
function showTimeScaleChange(oldScale, newScale) {
  const banner = document.getElementById('timescale-banner');
  const text = document.getElementById('timescale-text');

  let message;
  if (newScale.secsPerTick < oldScale.secsPerTick) {
    message = `⏳ Time is slowing down... ${oldScale.label} → ${newScale.label}`;
  } else {
    message = `⏩ Time is speeding up! ${oldScale.label} → ${newScale.label}`;
  }

  text.textContent = message;
  banner.classList.remove('hidden');
  banner.classList.add('timescale-flash');

  setTimeout(() => {
    banner.classList.remove('timescale-flash');
    banner.classList.add('hidden');
  }, 4000);
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

    const rev = sourceAnnualRev(state);
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

  const totalRev = totalAnnualRev();
  const perTick = totalRevPerTick();
  document.getElementById('total-rev').textContent = formatRate(totalRev);

  const scale = TIME_SCALES[currentTimeScaleIndex];
  document.getElementById('status-rev').textContent = formatPerTick(perTick) + '/tick';
  document.getElementById('status-timescale').textContent = scale.label;

  // In-game date
  const gameDate = new Date(gameState.gameStartDate + gameState.gameElapsedSecs * 1000);
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  document.getElementById('game-date').textContent = monthNames[gameDate.getUTCMonth()] + ' ' + gameDate.getUTCDate() + ', ' + gameDate.getUTCFullYear();

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

  // Update time scale
  const newScaleIdx = getTimeScale();
  if (newScaleIdx !== currentTimeScaleIndex) {
    const oldScale = TIME_SCALES[currentTimeScaleIndex];
    const newScale = TIME_SCALES[newScaleIdx];
    currentTimeScaleIndex = newScaleIdx;
    showTimeScaleChange(oldScale, newScale);
  }

  const scale = TIME_SCALES[currentTimeScaleIndex];
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
      const rev = sourceRevPerTick(state) * penaltyMult;

      if (state.automated) {
        gameState.cash += rev;
        gameState.totalEarned += rev;
      } else {
        state.pendingCollect += rev;
      }
    }
  }

  // Advance in-game time
  gameState.gameElapsedSecs += scale.secsPerTick;

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

  if (event.timed) {
    // Countdown bar — effect fires when it fills
    const wrapper = document.createElement('div');
    wrapper.className = 'toast-countdown-wrapper';
    const bar = document.createElement('div');
    bar.className = 'toast-countdown-bar';
    bar.style.animationDuration = (event.timedDelay / 1000) + 's';
    wrapper.appendChild(bar);

    const label = document.createElement('span');
    label.className = 'toast-countdown-label';
    label.textContent = 'Systems shutting down...';
    wrapper.appendChild(label);

    actionsDiv.appendChild(wrapper);

    // Hide close button for timed events
    document.getElementById('toast-close').style.display = 'none';

    setTimeout(() => {
      const result = event.timedEffect(gameState);
      document.getElementById('status-text').textContent = result;
      setTimeout(() => {
        document.getElementById('status-text').textContent = 'Ready';
      }, 3000);
      document.getElementById('toast-close').style.display = '';
      dismissEvent();
      updateDisplay();
    }, event.timedDelay);
  } else {
    document.getElementById('toast-close').style.display = '';
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
  }

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
    gameStartDate: gameState.gameStartDate,
    gameElapsedSecs: gameState.gameElapsedSecs,
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
    gameState.gameStartDate = data.gameStartDate || Date.UTC(2024, 0, 1);
    gameState.gameElapsedSecs = data.gameElapsedSecs || 0;
    currentTimeScaleIndex = 0;
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

    // Offline earnings — use annual rate, apply time based on real elapsed seconds
    // Each real second = scale.secsPerTick game-seconds, so convert annual to per-real-second
    if (elapsed > 5) {
      // Recalculate time scale for loaded state
      currentTimeScaleIndex = getTimeScale();
      const offlineScale = TIME_SCALES[currentTimeScaleIndex];
      const secsPerYear = 365.25 * 86400;
      let offlineEarnings = 0;
      for (const state of gameState.sources) {
        if (state.unlocked && state.automated && state.employees > 0) {
          const annual = sourceAnnualRev(state);
          offlineEarnings += annual * offlineScale.secsPerTick / secsPerYear * elapsed;
        }
      }
      // Also advance game time
      gameState.gameElapsedSecs += offlineScale.secsPerTick * elapsed;
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
  gameState.gameStartDate = Date.UTC(2024, 0, 1);
  gameState.gameElapsedSecs = 0;
  currentTimeScaleIndex = 0;
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
