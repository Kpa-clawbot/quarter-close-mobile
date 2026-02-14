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
      { name: 'Tech Giant',          flavor: 'Congressional hearings are just PR' },
      { name: 'Big Tech',            flavor: 'FAANG who?' },
      { name: 'Monopoly',            flavor: 'Antitrust is a suggestion' },
      { name: 'Trillion Dollar Club', flavor: 'The GDP of a small country' },
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
      { name: 'CPG Conglomerate',     flavor: 'You own the grocery shelf' },
      { name: 'Global Supply Chain',  flavor: 'Farm to table to world' },
      { name: 'Food Monopoly',        flavor: 'Nestlé sends a fruit basket' },
      { name: 'You Feed The World',   flavor: 'Governments depend on you' },
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
      { name: 'Marketplace Platform', flavor: 'You ARE the marketplace' },
      { name: 'Logistics Network',    flavor: 'Your own planes and warehouses' },
      { name: 'Retail Monopoly',      flavor: 'Antitrust hearings scheduled' },
      { name: 'Everything Store',     flavor: 'You sell literally everything' },
    ]
  },
  generic: {
    name: 'Entrepreneur',
    icon: '📈',
    desc: 'From side hustle to conglomerate',
    sources: [
      { name: 'Tutoring Service',     flavor: 'Teach what you know' },
      { name: 'Online Course',        flavor: 'Passive income guru' },
      { name: 'Consulting Gig',       flavor: 'Charge by the hour' },
      { name: 'Small Agency',         flavor: 'Hire your first team' },
      { name: 'SaaS Product',         flavor: 'Productize the service' },
      { name: 'Venture-Backed Startup', flavor: 'Other people\'s money' },
      { name: 'Growth-Stage Company', flavor: 'Hockey stick chart' },
      { name: 'Tech Company',         flavor: 'IPO is calling' },
      { name: 'Holding Company',      flavor: 'Diversified portfolio' },
      { name: 'Private Equity',       flavor: 'Buy, optimize, flip' },
      { name: 'Conglomerate',         flavor: 'Berkshire vibes' },
      { name: 'Too Big To Fail',      flavor: 'The Fed has your back' },
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
  { baseRate: 400000000,   unlockCost: 50000000, clickValue: 2500, autoCostMult: 10 }, // ~$400M/yr tech giant
  { baseRate: 1500000000,  unlockCost: 250000000, clickValue: 5000, autoCostMult: 10 }, // ~$1.5B/yr big tech
  { baseRate: 5000000000,  unlockCost: 1000000000, clickValue: 10000, autoCostMult: 10 }, // ~$5B/yr monopoly
  { baseRate: 15000000000, unlockCost: 5000000000, clickValue: 25000, autoCostMult: 10 }, // ~$15B/yr trillion club
];

// ===== TIME SCALE =====
// Fixed: 1 tick = 1 game-day, always
const SECS_PER_DAY = 86400;
const SECS_PER_YEAR = 365.25 * SECS_PER_DAY;
const TIME_LABEL = '▶ 1 day/tick';

// ===== MINI-TASK DEFINITIONS =====
// tier: 'low' (clerical), 'mid' (management), 'high' (executive)
// rewardMult: multiplier × daily revenue
// minTier: minimum unlocked source tier to see this task
const MINI_TASKS = [
  // Low tier — clerical busywork
  { text: 'Approve Invoice #{{num}}?', rewardMult: [0.5, 1], tier: 'low', minTier: 0, type: 'approve' },
  { text: 'Confirm delivery #{{num}}', rewardMult: [0.3, 0.8], tier: 'low', minTier: 0, type: 'approve' },
  { text: 'Reply to vendor inquiry', rewardMult: [0.3, 0.6], tier: 'low', minTier: 0, type: 'approve' },
  { text: 'Approve time sheet for Week {{num}}', rewardMult: [0.2, 0.5], tier: 'low', minTier: 0, type: 'approve' },
  { text: 'Process refund #{{num}}', rewardMult: [0.4, 0.8], tier: 'low', minTier: 0, type: 'approve' },
  { text: 'Review expense report (${{num}})', rewardMult: [0.3, 0.7], tier: 'low', minTier: 0, type: 'approve' },

  // Mid tier — management decisions
  { text: 'Sign contract for Client #{{num}}', rewardMult: [2, 5], tier: 'mid', minTier: 2, type: 'approve' },
  { text: 'Authorize PO #{{num}}', rewardMult: [1.5, 3], tier: 'mid', minTier: 2, type: 'approve' },
  { text: 'Approve Q{{num}} marketing budget', rewardMult: [2, 4], tier: 'mid', minTier: 3, type: 'approve' },
  { text: 'Sign off on new hire #{{num}}', rewardMult: [1.5, 3], tier: 'mid', minTier: 3, type: 'approve' },
  { text: 'Negotiate vendor discount', rewardMult: [2, 5], tier: 'mid', minTier: 2, type: 'approve' },
  { text: 'Approve product launch timeline', rewardMult: [3, 6], tier: 'mid', minTier: 3, type: 'approve' },

  // High tier — executive/deal-level
  { text: 'Close Series {{num}} funding round', rewardMult: [8, 15], tier: 'high', minTier: 5, type: 'approve' },
  { text: 'Sign M&A term sheet — Acq #{{num}}', rewardMult: [10, 20], tier: 'high', minTier: 6, type: 'approve' },
  { text: 'Approve Board Resolution #{{num}}', rewardMult: [5, 10], tier: 'high', minTier: 5, type: 'approve' },
  { text: 'Finalize enterprise deal (${{num}}M)', rewardMult: [8, 15], tier: 'high', minTier: 5, type: 'approve' },
  { text: 'Sign IP licensing agreement #{{num}}', rewardMult: [6, 12], tier: 'high', minTier: 4, type: 'approve' },
  { text: 'Authorize stock buyback program', rewardMult: [10, 20], tier: 'high', minTier: 6, type: 'approve' },
];

function miniTaskReward(task) {
  const streakMult = gameState.miniTaskStreak >= 10 ? 3 :
                     gameState.miniTaskStreak >= 5 ? 2 :
                     gameState.miniTaskStreak >= 3 ? 1.5 : 1;
  // Use annual rev / 365.25 to get base daily rate, unaffected by penalties/outages
  const dailyRev = totalAnnualRev() / 365.25;
  const low = task.rewardMult[0];
  const high = task.rewardMult[1];
  const mult = low + Math.random() * (high - low);
  return Math.max(1, Math.floor(dailyRev * mult * streakMult));
}

// ===== EVENTS DEFINITIONS =====
const EVENTS = [
  {
    sender: 'Mom',
    subject: 'Quick investment opportunity',
    body: 'Honey, I believe in your little business! Here\'s a little something to help out.',
    actions: [
      { label: 'Accept (+5% cash)', effect: (gs) => {
        const gift = Math.max(10, Math.floor(gs.cash * 0.05));
        gs.cash += gift;
        return `Mom invested ${formatMoney(gift)}! Thanks, Mom.`;
      }},
      { label: 'Decline (no effect)', effect: () => 'You declined. Mom is mildly hurt.' },
    ]
  },
  {
    sender: 'Angry Customer',
    subject: 'RE: TERRIBLE SERVICE!!!',
    body: 'I want a FULL REFUND or I\'m leaving a 1-star review everywhere!',
    actions: [
      { label: 'Refund (-2% cash)', effect: (gs) => {
        const refund = Math.max(5, Math.floor(gs.cash * 0.02));
        gs.cash -= refund;
        return `Refunded ${formatMoney(refund)}. Complaint resolved.`;
      }},
      { label: 'Ignore (rev -10% for 60s)', effect: (gs) => {
        gs.revPenalty = { mult: 0.9, until: Date.now() + 60000 };
        return 'Bad reviews incoming! Revenue -10% for 60s.';
      }},
    ]
  },
  {
    sender: 'College Buddy',
    subject: 'Hey can I get a discount??',
    body: 'Bro remember me from college?? Hook me up with a discount! For old times\' sake 🤙',
    actions: [
      { label: 'Give discount (-1% cash)', effect: (gs) => {
        const cost = Math.max(5, Math.floor(gs.cash * 0.01));
        gs.cash -= cost;
        return `Gave ${formatMoney(cost)} discount. Your friend is happy!`;
      }},
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
  {
    sender: 'Google Alerts',
    subject: '📈 Your company is trending on TikTok!',
    body: 'A customer posted a viral video about your product. 2.3M views and counting! Revenue is spiking.',
    actions: [
      { label: 'Ride the wave! (3× rev, 30s)', effect: (gs) => {
        gs.revBonus = { mult: 3, until: Date.now() + 30000 };
        return '🔥 TikTok viral! Revenue ×3 for 30 seconds!';
      }},
    ]
  },
  {
    sender: 'PR Team',
    subject: 'Forbes wants to feature us! 🎉',
    body: 'Forbes is running a "30 Under 30" style piece and wants to include us. This will be huge for brand awareness.',
    actions: [
      { label: 'Do the interview (2× rev, 60s)', effect: (gs) => {
        gs.revBonus = { mult: 2, until: Date.now() + 60000 };
        return '📰 Forbes feature live! Revenue ×2 for 60 seconds!';
      }},
      { label: 'Too busy', effect: () => 'You passed on free press. Bold move.' },
    ]
  },
  {
    sender: 'Social Media',
    subject: '🚀 We hit the front page of Reddit!',
    body: 'Someone posted about us on r/technology and it exploded. Server traffic is through the roof!',
    actions: [
      { label: 'Scale the servers! (5× rev, 15s)', effect: (gs) => {
        gs.revBonus = { mult: 5, until: Date.now() + 15000 };
        return '🚀 Reddit front page! Revenue ×5 for 15 seconds!';
      }},
    ]
  },
  {
    sender: 'Marketing',
    subject: '📺 Local news wants to do a segment on us',
    body: 'Channel 7 heard about us and wants to do a feel-good local business story. Free advertising!',
    actions: [
      { label: 'Schedule the shoot (2× rev, 45s)', effect: (gs) => {
        gs.revBonus = { mult: 2, until: Date.now() + 45000 };
        return '📺 Local news feature! Revenue ×2 for 45 seconds!';
      }},
      { label: 'Camera shy', effect: () => 'Missed opportunity for free press.' },
    ]
  },
  {
    sender: 'Sales Team',
    subject: '🎉 Big client just signed!',
    body: null, // dynamic — set at trigger time
    dynamic: true,
    setup: (gs) => {
      const unlocked = gs.sources.map((s, i) => ({ s, i })).filter(x => x.s.unlocked && x.s.employees > 0);
      if (unlocked.length === 0) return null;
      const pick = unlocked[Math.floor(Math.random() * unlocked.length)];
      const src = getSourceDef(pick.i);
      const arc = ARCS[gs.arc];
      const name = arc.names[pick.i] || src.name;
      const mult = 5 + Math.floor(Math.random() * 6); // 5-10×
      const bonus = Math.floor(sourceRevPerTick(pick.s) * mult);
      if (bonus <= 0) return null;
      return {
        body: `The ${name} department just landed a whale client! One-time bonus of ${formatMoney(bonus)} (${mult}× daily revenue).`,
        actions: [
          { label: `Cash the check (+${formatMoney(bonus)})`, effect: (gs2) => {
            gs2.cash += bonus;
            gs2.totalEarned += bonus;
            gs2.quarterRevenue += bonus;
            trackEarningsRevenue(bonus);
            return `💰 ${name} scored! +${formatMoney(bonus)} from the big client.`;
          }},
        ]
      };
    },
  },
];

// ===== BOARD ROOM UPGRADES (Phase 2.2) =====
const BOARD_ROOM_UPGRADES = [
  {
    id: 'finance_dept_1',
    name: 'Finance Dept Lv1',
    desc: 'Auto-handles earnings. Defaults to conservative guidance (0.5× RE).',
    cost: 500,
    requires: null,
    maxCount: 1,
    category: 'Finance',
  },
  {
    id: 'finance_dept_2',
    name: 'Finance Dept Lv2',
    desc: 'Auto-earnings with in-line guidance (1× RE). Better returns.',
    cost: 2500,
    requires: 'finance_dept_1',
    maxCount: 1,
    category: 'Finance',
  },
  {
    id: 'finance_dept_3',
    name: 'Finance Dept Lv3',
    desc: 'Auto-earnings with ambitious guidance (2× RE). Maximum yield.',
    cost: 10000,
    requires: 'finance_dept_2',
    maxCount: 1,
    category: 'Finance',
  },
  {
    id: 'rev_mult_1',
    name: 'Revenue Multiplier I',
    desc: 'Permanent 1.1× revenue multiplier.',
    cost: 1000,
    requires: null,
    maxCount: 1,
    category: 'Revenue',
  },
  {
    id: 'rev_mult_2',
    name: 'Revenue Multiplier II',
    desc: 'Permanent 1.25× revenue multiplier.',
    cost: 5000,
    requires: 'rev_mult_1',
    maxCount: 1,
    category: 'Revenue',
  },
  {
    id: 'rev_mult_3',
    name: 'Revenue Multiplier III',
    desc: 'Permanent 1.5× revenue multiplier.',
    cost: 25000,
    requires: 'rev_mult_2',
    maxCount: 1,
    category: 'Revenue',
  },
  {
    id: 'lobbyist',
    name: 'Lobbyist',
    desc: 'Tax rate reduced from 25% to 20%.',
    cost: 1500,
    requires: null,
    maxCount: 1,
    category: 'Tax',
  },
  {
    id: 'tax_haven',
    name: 'Tax Haven',
    desc: 'Tax rate reduced to 15%.',
    cost: 8000,
    requires: 'lobbyist',
    maxCount: 1,
    category: 'Tax',
  },
  {
    id: 'analyst_relations',
    name: 'Analyst Relations',
    desc: 'Analyst expectation ratchet slowed by 50%.',
    cost: 2000,
    requires: null,
    maxCount: 1,
    category: 'Investor',
  },
  {
    id: 'golden_parachute',
    name: 'Golden Parachute',
    desc: 'Survive one asset seizure event (consumed on use).',
    cost: 3000,
    requires: null,
    maxCount: Infinity,
    category: 'Protection',
  },
];

function hasBoardRoomUpgrade(id) {
  return (gameState.boardRoomPurchases[id] || 0) > 0;
}

function getBoardRoomUpgradeCount(id) {
  return gameState.boardRoomPurchases[id] || 0;
}

function getBoardRoomRevMultiplier() {
  let mult = 1.0;
  if (hasBoardRoomUpgrade('rev_mult_1')) mult *= 1.1;
  if (hasBoardRoomUpgrade('rev_mult_2')) mult *= 1.25;
  if (hasBoardRoomUpgrade('rev_mult_3')) mult *= 1.5;
  return mult;
}

function getBoardRoomTaxRate() {
  if (hasBoardRoomUpgrade('tax_haven')) return 0.15;
  if (hasBoardRoomUpgrade('lobbyist')) return 0.20;
  return 0.25;
}

function getBoardRoomAMTRate() {
  // AMT is always 15%, unchanged by upgrades
  return 0.15;
}

function getFinanceDeptLevel() {
  if (hasBoardRoomUpgrade('finance_dept_3')) return 3;
  if (hasBoardRoomUpgrade('finance_dept_2')) return 2;
  if (hasBoardRoomUpgrade('finance_dept_1')) return 1;
  return 0;
}

// ===== GAME STATE =====
let gameState = {
  arc: null,  // selected arc key
  cash: 0,
  totalEarned: 0,
  sources: [],
  revPenalty: null,
  revBonus: null,
  powerOutage: null,
  hireFrozen: null,
  taxDebts: [],
  seriesAShown: false,
  lastSave: Date.now(),
  lastTick: Date.now(),
  bossMode: false,
  eventCooldown: 0,
  totalPlayTime: 0,
  miniTaskCooldown: 0,
  miniTaskActive: false,
  miniTaskStreak: 0,
  goldenCellActive: false,
  goldenCellCooldown: 60,  // don't spawn for first 60s
  totalClicks: 0,
  gameStartDate: Date.now(),  // real-world date at game start
  gameElapsedSecs: 0,
  // Financials
  quarterRevenue: 0,      // revenue earned this quarter
  quarterExpenses: 0,     // expenses this quarter
  quarterTaxPaid: 0,      // taxes paid this quarter
  totalTaxPaid: 0,        // lifetime taxes paid
  totalSpentHires: 0,
  totalSpentUpgrades: 0,
  totalSpentAuto: 0,
  lastQuarterDay: 0,      // game-day of last quarter close
  capitalExpenses: [],     // {amount, dayCreated, quartersLeft} — depreciate over 4 quarters
  valuationHistory: [],    // array of {day, val} for chart — sampled every ~5 ticks
  // Phase 2.1: IPO + Earnings
  isPublic: false,
  ipoDay: 0,
  sharesOutstanding: 1000000000, // 1B shares
  retainedEarnings: 0,
  analystBaseline: 1.0,
  earningsStreak: 0,       // positive = consecutive beats, negative = consecutive misses
  currentGuidance: null,   // 'conservative'|'in-line'|'ambitious'|'aggressive'
  guidanceTarget: 0,       // revenue target for current quarter
  lastEarningsDay: 0,      // game-day of last earnings report
  earningsQuarterRevenue: 0, // revenue tracked for earnings (separate from tax quarter)
  ipoStockPriceStart: 0,  // stock price at start of current earnings quarter
  // Phase 2.2: Board Room
  boardRoomPurchases: {},  // map of upgrade IDs to purchase count/level
  activeTab: 'operations', // 'operations' | 'boardroom'
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

function maxAffordable(source) {
  let cash = gameState.cash;
  let emps = source.employees;
  let count = 0;
  const stats = SOURCE_STATS[source.id];
  const base = stats.unlockCost || 10;
  while (count < 1000) {
    const cost = Math.max(5, Math.floor(base * 0.5 * Math.pow(1.15, emps)));
    if (cash < cost) break;
    cash -= cost;
    emps++;
    count++;
  }
  return count;
}

function maxAffordableUpgrades(source) {
  let cash = gameState.cash;
  let level = source.upgradeLevel;
  let count = 0;
  const stats = SOURCE_STATS[source.id];
  while (count < 100) {
    const cost = Math.floor(Math.max(50, 10 * stats.baseRate) * Math.pow(2, level));
    if (cash < cost) break;
    cash -= cost;
    level++;
    count++;
  }
  return count;
}

// Revenue per tick (= per day) for a source
function sourceRevPerTick(source) {
  if (!source.unlocked || source.employees === 0) return 0;
  const stats = SOURCE_STATS[source.id];
  const upgradeMult = 1 + source.upgradeLevel * 0.5;
  return source.employees * stats.baseRate * upgradeMult / 365.25;
}

function totalRevPerTick() {
  let total = 0;
  for (const s of gameState.sources) {
    total += sourceRevPerTick(s);
  }
  // Board Room revenue multiplier
  total *= getBoardRoomRevMultiplier();
  if (gameState.revPenalty && Date.now() < gameState.revPenalty.until) {
    total *= gameState.revPenalty.mult;
  } else {
    gameState.revPenalty = null;
  }
  if (gameState.revBonus && Date.now() < gameState.revBonus.until) {
    total *= gameState.revBonus.mult;
  } else {
    gameState.revBonus = null;
  }
  if (gameState.powerOutage && Date.now() < gameState.powerOutage.until) {
    total = 0;
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
  // Board Room revenue multiplier
  total *= getBoardRoomRevMultiplier();
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

function formatStatMoney(n) {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(2) + 'K';
  if (n >= 1) return '$' + n.toFixed(2);
  if (n >= 0.01) return '$' + n.toFixed(4);
  if (n >= 0.0001) return '$' + n.toFixed(6);
  return '$' + n.toExponential(1);
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
  gameState.totalClicks = 0;
  gameState.eventCooldown = 30;
  gameState.miniTaskCooldown = 10;
  gameState.miniTaskActive = false;
  gameState.miniTaskStreak = 0;
  gameState.goldenCellActive = false;
  gameState.goldenCellCooldown = 60;
  gameState.gameStartDate = Date.now();
  gameState.gameElapsedSecs = 0;
  gameState.revPenalty = null;
  gameState.revBonus = null;
  gameState.powerOutage = null;
  gameState.hireFrozen = null;
  gameState.taxDebts = [];
  gameState.quarterRevenue = 0;
  gameState.quarterExpenses = 0;
  gameState.quarterTaxPaid = 0;
  gameState.totalTaxPaid = 0;
  gameState.totalSpentHires = 0;
  gameState.totalSpentUpgrades = 0;
  gameState.totalSpentAuto = 0;
  gameState.lastQuarterDay = 0;
  gameState.capitalExpenses = [];
  gameState.valuationHistory = [];
  // Phase 2.1
  gameState.isPublic = false;
  gameState.ipoDay = 0;
  gameState.sharesOutstanding = 1000000000;
  gameState.retainedEarnings = 0;
  gameState.analystBaseline = 1.0;
  gameState.earningsStreak = 0;
  gameState.currentGuidance = null;
  gameState.guidanceTarget = 0;
  gameState.lastEarningsDay = 0;
  gameState.earningsQuarterRevenue = 0;
  gameState.ipoStockPriceStart = 0;
  gameState._earningsMultiplier = 1.0;
  // Phase 2.2: Board Room
  gameState.boardRoomPurchases = {};
  gameState.activeTab = 'operations';

  // Clear stale panels
  const taxPanel = document.getElementById('tax-panel');
  taxPanel.innerHTML = '';
  taxPanel.classList.add('hidden');
  document.getElementById('valuation-chart-container').classList.add('hidden');
  chartPositioned = false;

  // Reset Board Room state
  document.getElementById('board-room-rows').innerHTML = '';
  document.getElementById('board-room-rows').classList.add('hidden');
  _lastBoardRoomHash = '';
  switchTab('operations');
  updateBoardRoomTab();

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
      <div class="arc-first">${arc.sources[0].name} → ${arc.sources[arc.sources.length - 1].name}</div>
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

  // Filter tasks by highest unlocked tier
  const maxTier = gameState.sources.reduce((max, s) => s.unlocked ? Math.max(max, s.id) : max, 0);
  const eligible = MINI_TASKS.filter(t => t.minTier <= maxTier);
  const task = eligible[Math.floor(Math.random() * eligible.length)];
  const num = task.tier === 'high' ? (Math.floor(Math.random() * 9) + 1) : Math.floor(Math.random() * 9000) + 1000;
  const reward = miniTaskReward(task);
  const text = task.text.replace('{{num}}', num);

  showMiniTask(text, reward, task.tier);
}

let miniTaskTimer = null;

function showMiniTask(text, reward, tier) {
  gameState.miniTaskActive = true;
  const bar = document.getElementById('mini-task-bar');
  const tierLabels = { low: '📋', mid: '📊', high: '💼' };
  const streakLabel = gameState.miniTaskStreak >= 3 ? ` 🔥${gameState.miniTaskStreak}` : '';
  document.getElementById('mini-task-text').textContent = (tierLabels[tier] || '') + ' ' + text;
  document.getElementById('mini-task-reward').textContent = `+${formatMoney(reward)}${streakLabel}`;
  bar.dataset.reward = reward;
  bar.classList.remove('hidden');

  // Auto-expire: skip button fills red over 10s, then auto-skips
  if (miniTaskTimer) { clearTimeout(miniTaskTimer); miniTaskTimer = null; }
  const skipBtn = bar.querySelector('.mini-task-skip');
  skipBtn.style.position = 'relative';
  skipBtn.style.overflow = 'hidden';
  // Remove old countdown if any
  const oldFill = skipBtn.querySelector('.toast-btn-countdown');
  if (oldFill) oldFill.remove();
  const fill = document.createElement('div');
  fill.className = 'toast-btn-countdown';
  fill.style.animationDuration = '10s';
  skipBtn.appendChild(fill);

  miniTaskTimer = setTimeout(() => {
    miniTaskTimer = null;
    skipMiniTask();
  }, 10000);
}

function completeMiniTask() {
  if (miniTaskTimer) { clearTimeout(miniTaskTimer); miniTaskTimer = null; }
  const bar = document.getElementById('mini-task-bar');
  const reward = parseFloat(bar.dataset.reward) || 0;
  gameState.cash += reward;
  gameState.totalEarned += reward;
  gameState.quarterRevenue += reward;
  trackEarningsRevenue(reward);
  gameState.totalClicks++;
  gameState.miniTaskStreak++;
  bar.classList.add('hidden');
  gameState.miniTaskActive = false;
  gameState.miniTaskCooldown = 15 + Math.floor(Math.random() * 15); // 15-30s cooldown

  // Streak feedback
  const streakMsg = gameState.miniTaskStreak >= 10 ? ` 🔥🔥🔥 ${gameState.miniTaskStreak} streak! (3×)` :
                    gameState.miniTaskStreak >= 5 ? ` 🔥🔥 ${gameState.miniTaskStreak} streak! (2×)` :
                    gameState.miniTaskStreak >= 3 ? ` 🔥 ${gameState.miniTaskStreak} streak! (1.5×)` :
                    gameState.miniTaskStreak > 1 ? ` (${gameState.miniTaskStreak} in a row)` : '';
  document.getElementById('status-text').textContent = `✅ Task done! +${formatMoney(reward)}${streakMsg}`;
  setTimeout(() => { document.getElementById('status-text').textContent = 'Ready'; }, 2000);

  flashCash();
  updateDisplay();
}

function skipMiniTask() {
  if (miniTaskTimer) { clearTimeout(miniTaskTimer); miniTaskTimer = null; }
  const bar = document.getElementById('mini-task-bar');
  bar.classList.add('hidden');
  gameState.miniTaskActive = false;
  gameState.miniTaskCooldown = 10;
  if (gameState.miniTaskStreak > 0) {
    document.getElementById('status-text').textContent = `💔 Streak lost! (was ${gameState.miniTaskStreak})`;
    setTimeout(() => { document.getElementById('status-text').textContent = 'Ready'; }, 2000);
  }
  gameState.miniTaskStreak = 0;
}

// ===== TIME SCALE CHANGE NOTIFICATION =====

// ===== GOLDEN CELL =====
let goldenCellTimer = null;

function trySpawnGoldenCell() {
  if (gameState.goldenCellActive) return;
  if (gameState.goldenCellCooldown > 0) { gameState.goldenCellCooldown--; return; }

  // ~2% chance per tick (avg every 50s)
  if (Math.random() > 0.02) return;

  const unlocked = gameState.sources.map((s, i) => ({ s, i })).filter(x => x.s.unlocked && x.s.employees > 0);
  if (unlocked.length === 0) return;

  const pick = unlocked[Math.floor(Math.random() * unlocked.length)];
  const rowIndex = pick.i;

  // Pick a random visible cell in that row (columns b through h)
  const cols = ['cell-b', 'cell-c', 'cell-d', 'cell-e', 'cell-f', 'cell-g', 'cell-h'];
  const colClass = cols[Math.floor(Math.random() * cols.length)];

  // Find the grid row for this source
  const gridRows = document.querySelectorAll('#grid-container .source-row');
  if (rowIndex >= gridRows.length) return;

  const row = gridRows[rowIndex];
  const cell = row.querySelector('.' + colClass);
  if (!cell) return;

  const reward = Math.floor(totalRevPerTick() * 20);
  if (reward <= 0) return;

  gameState.goldenCellActive = true;
  cell.classList.add('golden-cell');
  cell.dataset.goldenReward = reward;

  // 5 second window
  goldenCellTimer = setTimeout(() => {
    cell.classList.remove('golden-cell');
    delete cell.dataset.goldenReward;
    gameState.goldenCellActive = false;
    gameState.goldenCellCooldown = 30 + Math.floor(Math.random() * 30); // 30-60s before next
  }, 5000);
}

function clickGoldenCell(cell) {
  if (!cell.classList.contains('golden-cell')) return false;

  const reward = parseFloat(cell.dataset.goldenReward) || 0;
  cell.classList.remove('golden-cell');
  delete cell.dataset.goldenReward;
  gameState.goldenCellActive = false;
  if (goldenCellTimer) { clearTimeout(goldenCellTimer); goldenCellTimer = null; }
  gameState.goldenCellCooldown = 30 + Math.floor(Math.random() * 30);

  gameState.cash += reward;
  gameState.totalEarned += reward;
  gameState.quarterRevenue += reward;
  trackEarningsRevenue(reward);
  gameState.totalClicks++;

  document.getElementById('status-text').textContent = `✨ Golden cell! +${formatMoney(reward)}`;
  setTimeout(() => { document.getElementById('status-text').textContent = 'Ready'; }, 2000);

  flashCash();
  updateDisplay();
  return true;
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
    row.className = 'grid-row source-row';
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
        <div class="cell cell-g" data-field="annual">—</div>
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
        <div class="cell cell-g" data-field="annual"></div>
        <div class="cell cell-h empty-cell"></div>
      `;
    }

    container.appendChild(row);
  }

  // Filler rows
  buildFillerRows();

  gridBuilt = true;
  updateGridValues();
}

function buildFillerRows() {
  const filler = document.getElementById('filler-rows');
  filler.innerHTML = '';
  const taxRowCount = gameState.taxDebts && gameState.taxDebts.length > 0 ? gameState.taxDebts.length + 3 : 0;

  // Calculate how many rows needed to fill viewport
  const ROW_HEIGHT = 28;
  const gridBottom = filler.getBoundingClientRect().top;
  const viewportHeight = window.innerHeight;
  // Measure actual bottom chrome height
  const revBar = document.getElementById('revenue-breakdown');
  const sheetTabs = document.getElementById('sheet-tabs');
  const statusBar = document.getElementById('status-bar');
  const bottomChrome = (revBar ? revBar.offsetHeight : 0) +
                        (sheetTabs ? sheetTabs.offsetHeight : 0) +
                        (statusBar ? statusBar.offsetHeight : 0);
  const available = viewportHeight - gridBottom - bottomChrome;
  const fillerCount = Math.max(3, Math.ceil(available / ROW_HEIGHT) + 1);

  const startRow = SOURCE_STATS.length + 4 + taxRowCount;
  for (let i = 0; i < fillerCount; i++) {
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
    const revPerDay = rev / 365.25;
    const hCost = hireCost(state);
    const uCost = upgradeCost(state);
    const aCost = automateCost(state);

    // Name
    const nameCell = row.querySelector('[data-field="name"]');
    nameCell.innerHTML = src.name + (state.upgradeLevel > 0 ? ` <span style="color:#999;font-size:10px">Lv${state.upgradeLevel}</span>` : '');

    // Employees
    row.querySelector('[data-field="emp"]').textContent = state.employees;

    // Rev/day (column C)
    row.querySelector('[data-field="rate"]').textContent = formatPerTick(revPerDay);

    // Rev/yr (column G)
    row.querySelector('[data-field="annual"]').textContent = formatRate(rev);

    // Action 1: Hire + Max
    const a1 = row.querySelector('[data-field="action1"]');
    const frozen = gameState.hireFrozen && Date.now() < gameState.hireFrozen;
    if (frozen) {
      const sLeft = Math.ceil((gameState.hireFrozen - Date.now()) / 1000);
      a1.innerHTML = `<button class="cell-btn btn-hire" disabled>🚫 Frozen (${sLeft}s)</button>`;
    } else {
      const maxHires = maxAffordable(state);
      const upgradeMult = 1 + state.upgradeLevel * 0.5;
      const hireGainPerDay = src.baseRate * upgradeMult / 365.25;
      a1.innerHTML = (maxHires > 1 ? `<button class="cell-btn btn-max" onclick="hireMax(${i})">Max(${maxHires})</button>` : '') +
        `<button class="cell-btn btn-hire" onclick="hireEmployee(${i})" ${gameState.cash >= hCost ? '' : 'disabled'} title="Hire 1 employee — adds ${formatPerTick(hireGainPerDay)}/day">Hire ${formatMoney(hCost)} (+${formatPerTick(hireGainPerDay)}/d)</button>`;
    }

    // Action 2: Upgrade or Automate
    const a2 = row.querySelector('[data-field="action2"]');
    if (!state.automated) {
      a2.innerHTML = `<button class="cell-btn btn-automate" onclick="automateSource(${i})" ${gameState.cash >= aCost ? '' : 'disabled'} title="Revenue flows automatically">Auto ${formatMoney(aCost)}</button>`;
    } else {
      const maxUpgrades = maxAffordableUpgrades(state);
      const revGainPerDay = state.employees * src.baseRate * 0.5 / 365.25;
      a2.innerHTML = (maxUpgrades > 1 ? `<button class="cell-btn btn-max" onclick="upgradeMax(${i})">Max(${maxUpgrades})</button>` : '') +
        `<button class="cell-btn btn-upgrade" onclick="upgradeSource(${i})" ${gameState.cash >= uCost ? '' : 'disabled'} title="+50% efficiency per employee — adds ${formatPerTick(revGainPerDay)}/day">⬆ ${formatMoney(uCost)} (+${formatPerTick(revGainPerDay)}/d)</button>`;
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

  // Per-tick display (= per day, prominent)
  document.getElementById('per-tick-display').textContent = formatPerTick(perTick) + '/day';

  // Stock price in header (Phase 2.1)
  const stockCell = document.getElementById('stock-price-cell');
  if (stockCell) {
    if (gameState.isPublic) {
      const sp = getStockPrice();
      stockCell.innerHTML = `<span style="font-size:10px;color:#888">📈 </span><span style="font-weight:700;color:#0078d4;font-family:Consolas,monospace;font-size:12px">${formatMoney(sp)}</span>`;
    } else {
      stockCell.innerHTML = '';
    }
  }

  // Revenue breakdown stats
  document.getElementById('stat-sec').textContent = formatStatMoney(totalRev / SECS_PER_YEAR) + '/sec';
  document.getElementById('stat-min').textContent = formatStatMoney(totalRev / SECS_PER_YEAR * 60) + '/min';
  document.getElementById('stat-hr').textContent = formatStatMoney(totalRev / SECS_PER_YEAR * 3600) + '/hr';
  document.getElementById('stat-day').textContent = formatStatMoney(perTick) + '/day';

  document.getElementById('status-timescale').textContent = TIME_LABEL;

  // In-game date
  const gameDate = new Date(gameState.gameStartDate + gameState.gameElapsedSecs * 1000);
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const totalDays = Math.floor(gameState.gameElapsedSecs / SECS_PER_DAY);
  const years = Math.floor(totalDays / 365);
  const days = totalDays % 365;
  const ageStr = years > 0 ? `Yr ${years + 1}, Day ${days + 1}` : `Day ${totalDays + 1}`;
  document.getElementById('game-date').textContent = monthNames[gameDate.getUTCMonth()] + ' ' + gameDate.getUTCDate() + ', ' + gameDate.getUTCFullYear() + `  (${ageStr})`;

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

  // Phase 2.1: Stock ticker in status bar
  const stockTicker = document.getElementById('stock-ticker');
  if (stockTicker) {
    if (gameState.isPublic) {
      const price = getStockPrice();
      stockTicker.textContent = `📈 ${formatMoney(price)}`;
      stockTicker.classList.remove('hidden');
    } else {
      stockTicker.classList.add('hidden');
    }
  }

  const activeCount = gameState.sources.filter(s => s.unlocked).length;
  const lastRow = activeCount + 3;
  // Only show default formula if no cell is manually selected
  if (!document.querySelector('.cell.selected-cell')) {
    document.getElementById('formula-input').textContent = `=SUM(C4:C${lastRow})`;
    document.getElementById('cell-ref').textContent = 'C2';
  } else {
    // Refresh selected cell content (values change each tick)
    const sel = document.querySelector('.cell.selected-cell');
    document.getElementById('formula-input').textContent = sel.textContent.trim() || '';
  }

  if (gameState.powerOutage && Date.now() < gameState.powerOutage.until) {
    const secsLeft = Math.ceil((gameState.powerOutage.until - Date.now()) / 1000);
    document.getElementById('status-text').textContent = `⚡ SYSTEMS OFFLINE — back in ${secsLeft}s`;
  } else if (gameState.powerOutage) {
    gameState.powerOutage = null;
    document.getElementById('status-text').textContent = '✅ Systems restored';
    setTimeout(() => {
      if (document.getElementById('status-text').textContent === '✅ Systems restored') {
        document.getElementById('status-text').textContent = 'Ready';
      }
    }, 3000);
  } else if (gameState.revPenalty && Date.now() < gameState.revPenalty.until) {
    const secsLeft = Math.ceil((gameState.revPenalty.until - Date.now()) / 1000);
    const hireFroze = gameState.hireFrozen && Date.now() < gameState.hireFrozen;
    const hireMsg = hireFroze ? ' | Hiring frozen' : '';
    document.getElementById('status-text').textContent = `⚠ Revenue penalty — ${secsLeft}s remaining${hireMsg}`;
  } else if (gameState.revPenalty) {
    gameState.revPenalty = null;
    document.getElementById('status-text').textContent = 'Ready';
  } else if (gameState.revBonus && Date.now() < gameState.revBonus.until) {
    const secsLeft = Math.ceil((gameState.revBonus.until - Date.now()) / 1000);
    document.getElementById('status-text').textContent = `🔥 Revenue ×${gameState.revBonus.mult} — ${secsLeft}s remaining`;
  } else if (gameState.revBonus) {
    gameState.revBonus = null;
    document.getElementById('status-text').textContent = 'Ready';
  } else if (gameState.hireFrozen && Date.now() < gameState.hireFrozen) {
    const secsLeft = Math.ceil((gameState.hireFrozen - Date.now()) / 1000);
    document.getElementById('status-text').textContent = `🚫 Hiring frozen — ${secsLeft}s remaining`;
  } else {
    if (gameState.hireFrozen) gameState.hireFrozen = null;
  }
  // Don't overwrite mini-task feedback messages

  // Update P&L section
  updateTaxPanel();

  // Update Board Room tab visibility and content
  updateBoardRoomTab();
  if (gameState.activeTab === 'boardroom') {
    buildBoardRoom();
  }
}

// ===== GAME ACTIONS =====
function unlockSource(index) {
  const src = getSourceDef(index);
  const state = gameState.sources[index];
  if (state.unlocked || gameState.cash < src.unlockCost) return;
  if (!isNextUnlock(index)) return;

  gameState.cash -= src.unlockCost;
  addCapitalExpense(src.unlockCost);
  state.unlocked = true;
  state.employees = 1;
  buildGrid();
  updateDisplay();
  flashCash();
}

function hireEmployee(index) {
  const state = gameState.sources[index];
  if (!state.unlocked) return;
  if (gameState.hireFrozen && Date.now() < gameState.hireFrozen) return;
  const cost = hireCost(state);
  if (gameState.cash < cost) return;

  gameState.cash -= cost;
  state.employees++;
  addCapitalExpense(cost);
  gameState.totalSpentHires += cost;
  updateGridValues();
  updateDisplay();
  flashCash();
}

function hireMax(index) {
  const state = gameState.sources[index];
  if (!state.unlocked) return;
  if (gameState.hireFrozen && Date.now() < gameState.hireFrozen) return;
  let hired = 0;
  let totalCost = 0;
  while (true) {
    const cost = hireCost(state);
    if (gameState.cash < cost) break;
    gameState.cash -= cost;
    state.employees++;
    totalCost += cost;
    hired++;
    if (hired > 1000) break; // safety
  }
  if (hired > 0) {
    addCapitalExpense(totalCost);
    gameState.totalSpentHires += totalCost;
    updateGridValues();
    updateDisplay();
    flashCash();
  }
}

function upgradeMax(index) {
  const state = gameState.sources[index];
  if (!state.unlocked) return;
  let upgraded = 0;
  let totalCost = 0;
  while (upgraded < 100) {
    const cost = upgradeCost(state);
    if (gameState.cash < cost) break;
    gameState.cash -= cost;
    state.upgradeLevel++;
    totalCost += cost;
    upgraded++;
  }
  if (upgraded > 0) {
    addCapitalExpense(totalCost);
    gameState.totalSpentUpgrades += totalCost;
    updateGridValues();
    updateDisplay();
    flashCash();
  }
}

function upgradeSource(index) {
  const state = gameState.sources[index];
  if (!state.unlocked) return;
  const cost = upgradeCost(state);
  if (gameState.cash < cost) return;

  gameState.cash -= cost;
  state.upgradeLevel++;
  addCapitalExpense(cost);
  gameState.totalSpentUpgrades += cost;
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
  addCapitalExpense(cost);
  gameState.totalSpentAuto += cost;
  gameState.cash += state.pendingCollect;
  gameState.totalEarned += state.pendingCollect;
  gameState.quarterRevenue += state.pendingCollect;
  trackEarningsRevenue(state.pendingCollect);
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
  gameState.quarterRevenue += clickEarnings;
  trackEarningsRevenue(clickEarnings);
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

// ===== DEPRECIATION =====
const DEPRECIATION_QUARTERS = 4;

function addCapitalExpense(amount) {
  if (!gameState.capitalExpenses) gameState.capitalExpenses = [];
  gameState.capitalExpenses.push({
    amount: amount,
    perQuarter: Math.max(1, Math.floor(amount / DEPRECIATION_QUARTERS)),
    quartersLeft: DEPRECIATION_QUARTERS,
  });
  gameState.quarterExpenses += amount; // track for P&L display
}

function getQuarterlyDepreciation() {
  if (!gameState.capitalExpenses) return 0;
  let total = 0;
  for (const cap of gameState.capitalExpenses) {
    if (cap.quartersLeft > 0) {
      total += cap.perQuarter;
    }
  }
  return total;
}

function tickDepreciation() {
  if (!gameState.capitalExpenses) return;
  gameState.capitalExpenses = gameState.capitalExpenses.filter(cap => {
    cap.quartersLeft--;
    return cap.quartersLeft > 0;
  });
}

function flashCash() {
  const el = document.getElementById('cash-display');
  el.classList.remove('cash-bump');
  void el.offsetWidth;
  el.classList.add('cash-bump');
}

// ===== GAME LOOP (1 second ticks) =====
// ===== TAX DEBT SYSTEM =====

function processQuarterlyTax() {
  const depreciation = getQuarterlyDepreciation();
  const taxableIncome = gameState.quarterRevenue - depreciation;
  const taxRate = getBoardRoomTaxRate();
  const regularTax = Math.max(0, Math.floor(taxableIncome * taxRate));

  // AMT: minimum 15% of gross revenue (can't deduct your way to zero)
  const amtRate = getBoardRoomAMTRate();
  const amtTax = Math.floor(gameState.quarterRevenue * amtRate);
  const isAMT = amtTax > regularTax;
  const taxOwed = Math.max(regularTax, amtTax);

  // Snapshot for display
  const qRev = gameState.quarterRevenue;
  const qDep = depreciation;

  // Tick depreciation (reduce remaining quarters on all assets)
  tickDepreciation();

  // Reset quarterly tracking
  gameState.quarterRevenue = 0;
  gameState.quarterExpenses = 0;
  gameState.quarterTaxPaid = 0;

  if (taxOwed <= 0) {
    const currentDay = Math.floor(gameState.gameElapsedSecs / SECS_PER_DAY);
    const quarter = Math.floor(currentDay / 90);
    const qLabel = `Q${(quarter % 4) + 1}`;
    showEventToast('IRS', `${qLabel} Quarterly Tax Assessment`,
      `Revenue: ${formatMoney(qRev)}\nDepreciation: (${formatMoney(qDep)})\nTaxable income: ${formatMoney(Math.max(0, taxableIncome))}\n\nNo tax owed this quarter.`,
      [{ label: 'OK', effect: () => `No tax liability for ${qLabel}. Keep investing!` }]);
    return;
  }

  const currentDay = Math.floor(gameState.gameElapsedSecs / SECS_PER_DAY);
  const quarter = Math.floor(currentDay / 90);
  const qLabel = `Q${(quarter % 4) + 1}`;

  const amtNote = isAMT ? `\n⚠️ AMT applies (${Math.round(amtRate*100)}% of revenue > regular tax)` : '';
  showEventToast('IRS', `${qLabel} Quarterly Tax Assessment`,
    `Revenue: ${formatMoney(qRev)}\nDepreciation: (${formatMoney(qDep)})\nTaxable income: ${formatMoney(taxableIncome)}\n\nTax owed (${isAMT ? 'AMT ' + Math.round(amtRate*100) + '%' : Math.round(taxRate*100) + '%'}): ${formatMoney(taxOwed)}${amtNote}`,
    [
      { label: `Pay ${formatMoney(taxOwed)}`,
        disabledLabel: 'Not enough cash',
        cashRequired: taxOwed,
        effect: (gs) => {
          gs.cash -= taxOwed;
          gs.quarterTaxPaid += taxOwed;
          gs.totalTaxPaid += taxOwed;
          return `Paid ${formatMoney(taxOwed)} in ${qLabel} taxes. Good standing with the IRS.`;
      }},
      { label: 'Ignore', effect: (gs) => {
        if (!gs.taxDebts) gs.taxDebts = [];
        gs.taxDebts.push({
          original: taxOwed,
          current: taxOwed,
          dayCreated: currentDay,
          daysOverdue: 0,
          stage: 'notice1',
          quarter: qLabel,
        });
        updateTaxPanel();
        return `You ignored the ${qLabel} tax bill. ${formatMoney(taxOwed)} added to tax liability. Interest is accruing...`;
      }},
    ], { closable: false });
}

function processTaxDebts() {
  if (!gameState.taxDebts || gameState.taxDebts.length === 0) return;

  let needsUpdate = false;
  for (const debt of gameState.taxDebts) {
    // Accrue 1% daily interest
    debt.current = Math.floor(debt.current * 1.01);
    debt.daysOverdue++;

    // Escalation stages
    const oldStage = debt.stage;
    if (debt.daysOverdue >= 180 && debt.stage !== 'seizure') {
      debt.stage = 'seizure';
    } else if (debt.daysOverdue >= 90 && debt.stage === 'notice2') {
      debt.stage = 'garnish';
    } else if (debt.daysOverdue >= 30 && debt.stage === 'notice1') {
      debt.stage = 'notice2';
    }

    if (debt.stage !== oldStage) needsUpdate = true;

    // Seizure: IRS just takes it (unless Golden Parachute)
    if (debt.stage === 'seizure') {
      if (hasBoardRoomUpgrade('golden_parachute')) {
        // Consume one Golden Parachute
        gameState.boardRoomPurchases['golden_parachute']--;
        if (gameState.boardRoomPurchases['golden_parachute'] <= 0) {
          delete gameState.boardRoomPurchases['golden_parachute'];
        }
        showEventToast('Legal Department', '🪂 Golden Parachute Activated',
          `Your Golden Parachute protected you from an IRS Asset Seizure! The tax debt of ${formatMoney(debt.current)} has been settled by your legal team. One Golden Parachute consumed.`,
          [{ label: 'Thank the lawyers', effect: () => '🪂 Golden Parachute saved you from asset seizure!' }]);
        debt.settled = true;
        needsUpdate = true;
      } else {
        const penalty = Math.floor(debt.current * 1.25); // 25% penalty on top
        const seized = Math.min(penalty, gameState.cash);
        gameState.cash -= seized;
        gameState.quarterTaxPaid += seized;
        gameState.totalTaxPaid += seized;
        showEventToast('IRS', 'Asset Seizure Notice',
          `The IRS has seized ${formatMoney(penalty)} from your accounts. Tax debt of ${formatMoney(debt.current)} plus 25% penalty. This was avoidable.`,
          [{ label: 'OK', effect: () => 'Assets seized. Consider paying next time.' }]);
        debt.settled = true;
        needsUpdate = true;
      }
    }

    // Stage change notifications
    if (debt.stage === 'notice2' && oldStage === 'notice1') {
      const debtRef = debt; // capture reference for closure
      showEventToast('IRS', '2nd Notice — Unpaid Tax Assessment',
        `This is your second notice. Original: ${formatMoney(debt.original)}, now owed: ${formatMoney(debt.current)}. Continued non-payment will result in revenue garnishment.`,
        [{ label: 'Pay now',
           disabledLabel: 'Not enough cash',
           cashRequired: debt.current,
           effect: (gs) => { const idx = gs.taxDebts.indexOf(debtRef); if (idx >= 0) settleTaxDebt(idx); return 'Debt settled.'; }},
         { label: 'Ignore', effect: () => 'The IRS does not forget.' }],
        { closable: false });
    } else if (debt.stage === 'garnish' && oldStage === 'notice2') {
      const debtRef = debt; // capture reference for closure
      showEventToast('IRS', '⚠ Revenue Garnishment Order',
        `The IRS is now garnishing 15% of your revenue until tax debt of ${formatMoney(debt.current)} is paid. Settle immediately to restore full income.`,
        [{ label: 'Pay now',
           disabledLabel: 'Not enough cash',
           cashRequired: debt.current,
           effect: (gs) => { const idx = gs.taxDebts.indexOf(debtRef); if (idx >= 0) settleTaxDebt(idx); return 'Debt settled. Garnishment lifted.'; }},
         { label: 'Ignore', effect: () => 'Asset seizure in 90 days.' }],
        { closable: false });
    }
  }

  // Remove settled debts
  gameState.taxDebts = gameState.taxDebts.filter(d => !d.settled);

  if (needsUpdate || gameState.taxDebts.length > 0) updateTaxPanel();
}

function settleTaxDebt(index) {
  if (!gameState.taxDebts || index < 0 || index >= gameState.taxDebts.length) return;
  const debt = gameState.taxDebts[index];
  if (gameState.cash < debt.current) {
    // Flash the settle button red with inline feedback
    const btn = document.querySelector(`[data-settle="${index}"]`);
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = `Need ${formatMoney(debt.current)}`;
      btn.classList.add('settle-flash');
      setTimeout(() => { btn.textContent = orig; btn.classList.remove('settle-flash'); }, 2000);
    }
    document.getElementById('status-text').textContent = `❌ Need ${formatMoney(debt.current)} to settle — you have ${formatMoney(gameState.cash)}`;
    return;
  }
  gameState.cash -= debt.current;
  gameState.quarterTaxPaid += debt.current;
  gameState.totalTaxPaid += debt.current;
  gameState.taxDebts.splice(index, 1);
  _lastTaxPanelHash = ''; // force rebuild
  updateTaxPanel();
  updateDisplay();
  flashCash();
}

function settleAllTax() {
  if (!gameState.taxDebts || gameState.taxDebts.length === 0) return;
  const total = gameState.taxDebts.reduce((sum, d) => sum + d.current, 0);
  if (gameState.cash < total) {
    const btn = document.querySelector('[data-settle-all]');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = `Need ${formatMoney(total)}`;
      btn.classList.add('settle-flash');
      setTimeout(() => { btn.textContent = orig; btn.classList.remove('settle-flash'); }, 2000);
    }
    document.getElementById('status-text').textContent = `❌ Need ${formatMoney(total)} to settle all — you have ${formatMoney(gameState.cash)}`;
    return;
  }
  gameState.cash -= total;
  gameState.quarterTaxPaid += total;
  gameState.totalTaxPaid += total;
  gameState.taxDebts = [];
  _lastTaxPanelHash = ''; // force rebuild
  updateTaxPanel();
  updateDisplay();
  flashCash();
}

function totalTaxOwed() {
  if (!gameState.taxDebts) return 0;
  return gameState.taxDebts.reduce((sum, d) => sum + d.current, 0);
}

let _lastTaxPanelHash = '';

function updateTaxPanel() {
  const panel = document.getElementById('tax-panel');
  const hasTaxDebts = gameState.taxDebts && gameState.taxDebts.length > 0;
  const hasActivity = gameState.totalEarned > 0;

  if (!hasActivity && !hasTaxDebts) {
    if (_lastTaxPanelHash !== 'empty') {
      panel.classList.add('hidden');
      panel.innerHTML = '';
      buildFillerRows();
      _lastTaxPanelHash = 'empty';
    }
    return;
  }
  panel.classList.remove('hidden');

  const sourceCount = SOURCE_STATS.length;
  let rowNum = sourceCount + 4;
  let html = '';

  // ===== P&L SECTION =====
  // Separator
  html += `<div class="grid-row sep-row">
    <div class="row-num">${rowNum++}</div>
    <div class="cell cell-a sep-cell"></div><div class="cell cell-b sep-cell"></div>
    <div class="cell cell-c sep-cell"></div><div class="cell cell-d sep-cell"></div>
    <div class="cell cell-e sep-cell"></div><div class="cell cell-f sep-cell"></div>
    <div class="cell cell-g sep-cell"></div><div class="cell cell-h sep-cell"></div>
  </div>`;

  const currentDay = Math.floor(gameState.gameElapsedSecs / SECS_PER_DAY);
  const daysIntoQuarter = currentDay - gameState.lastQuarterDay;
  const daysToTax = Math.max(0, 90 - daysIntoQuarter);

  // P&L Header
  html += `<div class="grid-row pnl-header">
    <div class="row-num">${rowNum++}</div>
    <div class="cell cell-a" style="font-weight:700;color:#333">PROFIT & LOSS</div>
    <div class="cell cell-b"></div>
    <div class="cell cell-c" style="font-size:10px;color:#888;justify-content:flex-end">This Qtr</div>
    <div class="cell cell-d" style="font-size:10px;color:#888;justify-content:flex-end">Lifetime</div>
    <div class="cell cell-e"></div>
    <div class="cell cell-f" style="font-size:10px;color:#888">Tax due in ${daysToTax}d</div>
    <div class="cell cell-g"></div>
    <div class="cell cell-h"></div>
  </div>`;

  const totalExpenses = gameState.totalSpentHires + gameState.totalSpentUpgrades + gameState.totalSpentAuto;
  const qDepreciation = getQuarterlyDepreciation();

  // Revenue
  html += `<div class="grid-row pnl-row">
    <div class="row-num">${rowNum++}</div>
    <div class="cell cell-a" style="padding-left:16px;color:#444">Revenue</div>
    <div class="cell cell-b"></div>
    <div class="cell cell-c" style="color:#217346;font-family:Consolas,monospace;font-size:11px;justify-content:flex-end">${formatMoney(gameState.quarterRevenue)}</div>
    <div class="cell cell-d" style="color:#217346;font-family:Consolas,monospace;font-size:11px;justify-content:flex-end">${formatMoney(gameState.totalEarned)}</div>
    <div class="cell cell-e"></div><div class="cell cell-f"></div>
    <div class="cell cell-g"></div><div class="cell cell-h"></div>
  </div>`;

  // Garnishment (if active)
  const garnishActive = gameState.taxDebts && gameState.taxDebts.some(d => d.stage === 'garnish');
  if (garnishActive) {
    const garnishLoss = Math.floor(gameState.quarterRevenue * 0.15 / 0.85); // estimate pre-garnish revenue lost
    html += `<div class="grid-row pnl-row">
      <div class="row-num">${rowNum++}</div>
      <div class="cell cell-a" style="padding-left:16px;color:#c00">🔴 IRS Garnishment</div>
      <div class="cell cell-b"></div>
      <div class="cell cell-c" style="color:#c00;font-family:Consolas,monospace;font-size:11px;justify-content:flex-end">−15%</div>
      <div class="cell cell-d"></div>
      <div class="cell cell-e"></div><div class="cell cell-f" style="font-size:9px;color:#c00">settle debt to remove</div>
      <div class="cell cell-g"></div><div class="cell cell-h"></div>
    </div>`;
  }

  // Capital Spending (this quarter)
  html += `<div class="grid-row pnl-row">
    <div class="row-num">${rowNum++}</div>
    <div class="cell cell-a" style="padding-left:16px;color:#444">Capital Spending</div>
    <div class="cell cell-b"></div>
    <div class="cell cell-c" style="color:#c00;font-family:Consolas,monospace;font-size:11px;justify-content:flex-end">(${formatMoney(gameState.quarterExpenses)})</div>
    <div class="cell cell-d" style="color:#c00;font-family:Consolas,monospace;font-size:11px;justify-content:flex-end">(${formatMoney(totalExpenses)})</div>
    <div class="cell cell-e"></div><div class="cell cell-f" style="font-size:9px;color:#999">not tax-deductible</div>
    <div class="cell cell-g"></div><div class="cell cell-h"></div>
  </div>`;

  // Depreciation
  const capCount = gameState.capitalExpenses ? gameState.capitalExpenses.length : 0;
  html += `<div class="grid-row pnl-row">
    <div class="row-num">${rowNum++}</div>
    <div class="cell cell-a" style="padding-left:16px;color:#444">Depreciation</div>
    <div class="cell cell-b"></div>
    <div class="cell cell-c" style="color:#c00;font-family:Consolas,monospace;font-size:11px;justify-content:flex-end">(${formatMoney(qDepreciation)})</div>
    <div class="cell cell-d"></div>
    <div class="cell cell-e"></div><div class="cell cell-f" style="font-size:9px;color:#999">${capCount} assets depreciating</div>
    <div class="cell cell-g"></div><div class="cell cell-h"></div>
  </div>`;

  // Taxes paid
  html += `<div class="grid-row pnl-row">
    <div class="row-num">${rowNum++}</div>
    <div class="cell cell-a" style="padding-left:16px;color:#444">Taxes Paid</div>
    <div class="cell cell-b"></div>
    <div class="cell cell-c" style="color:#c00;font-family:Consolas,monospace;font-size:11px;justify-content:flex-end">(${formatMoney(gameState.quarterTaxPaid)})</div>
    <div class="cell cell-d" style="color:#c00;font-family:Consolas,monospace;font-size:11px;justify-content:flex-end">(${formatMoney(gameState.totalTaxPaid)})</div>
    <div class="cell cell-e"></div><div class="cell cell-f"></div>
    <div class="cell cell-g"></div><div class="cell cell-h"></div>
  </div>`;

  // Taxable Income (revenue - depreciation, what IRS taxes — or AMT if higher)
  const qTaxable = Math.max(0, gameState.quarterRevenue - qDepreciation);
  const currentTaxRate = getBoardRoomTaxRate();
  const currentAMTRate = getBoardRoomAMTRate();
  const qRegularTax = Math.floor(qTaxable * currentTaxRate);
  const qAMT = Math.floor(gameState.quarterRevenue * currentAMTRate);
  const amtApplies = qAMT > qRegularTax && gameState.quarterRevenue > 0;
  const effectiveTaxable = amtApplies ? gameState.quarterRevenue : qTaxable;
  const taxRatePct = Math.round(currentTaxRate * 100);
  const amtRatePct = Math.round(currentAMTRate * 100);
  const taxableLabel = amtApplies ? 'AMT Taxable Income' : 'Taxable Income';
  const taxableNote = amtApplies ? `⚠️ AMT floor (${amtRatePct}% of revenue)` : 'rev − depreciation';
  html += `<div class="grid-row pnl-row">
    <div class="row-num">${rowNum++}</div>
    <div class="cell cell-a" style="padding-left:16px;color:${amtApplies ? '#c60' : '#888'};font-size:10px">${taxableLabel}</div>
    <div class="cell cell-b"></div>
    <div class="cell cell-c" style="color:${amtApplies ? '#c60' : '#888'};font-family:Consolas,monospace;font-size:10px;justify-content:flex-end">${formatMoney(effectiveTaxable)}</div>
    <div class="cell cell-d"></div>
    <div class="cell cell-e"></div><div class="cell cell-f" style="font-size:9px;color:${amtApplies ? '#c60' : '#999'}">${taxableNote}</div>
    <div class="cell cell-g"></div><div class="cell cell-h"></div>
  </div>`;

  // Net Income (double-underline like real accounting)
  const qNet = gameState.quarterRevenue - gameState.quarterExpenses - gameState.quarterTaxPaid;
  const ltNet = gameState.totalEarned - totalExpenses - gameState.totalTaxPaid;
  const qColor = qNet >= 0 ? '#217346' : '#c00';
  const ltColor = ltNet >= 0 ? '#217346' : '#c00';

  html += `<div class="grid-row pnl-net">
    <div class="row-num">${rowNum++}</div>
    <div class="cell cell-a" style="font-weight:700;color:#333;padding-left:16px">Net Income</div>
    <div class="cell cell-b"></div>
    <div class="cell cell-c" style="color:${qColor};font-family:Consolas,monospace;font-size:11px;font-weight:700;justify-content:flex-end;border-top:1px solid #333;border-bottom:3px double #333">${qNet < 0 ? '(' + formatMoney(-qNet) + ')' : formatMoney(qNet)}</div>
    <div class="cell cell-d" style="color:${ltColor};font-family:Consolas,monospace;font-size:11px;font-weight:700;justify-content:flex-end;border-top:1px solid #333;border-bottom:3px double #333">${ltNet < 0 ? '(' + formatMoney(-ltNet) + ')' : formatMoney(ltNet)}</div>
    <div class="cell cell-e"></div><div class="cell cell-f"></div>
    <div class="cell cell-g"></div><div class="cell cell-h"></div>
  </div>`;

  // ===== INVESTOR RELATIONS SECTION (Phase 2.1) =====
  if (gameState.isPublic) {
    const currentDay = Math.floor(gameState.gameElapsedSecs / SECS_PER_DAY);
    const earningsDaysSince = currentDay - gameState.lastEarningsDay;
    const earningsDaysLeft = Math.max(0, EARNINGS_QUARTER_DAYS - earningsDaysSince);
    const earningsQLabel = getEarningsQuarterLabel();
    const stockPrice = getStockPrice();
    const stockPriceStart = gameState.ipoStockPriceStart || stockPrice;
    const qtdChange = stockPriceStart > 0 ? ((stockPrice - stockPriceStart) / stockPriceStart * 100) : 0;
    const qtdColor = qtdChange >= 0 ? '#217346' : '#c00';
    const qtdStr = (qtdChange >= 0 ? '+' : '') + qtdChange.toFixed(1) + '%';
    const guidanceKey = gameState.currentGuidance || 'in-line';
    const guidanceLevel = GUIDANCE_LEVELS[guidanceKey];
    const target = gameState.guidanceTarget;
    const qRev = gameState.earningsQuarterRevenue;
    const daysElapsed = earningsDaysSince || 1;
    const expectedAtThisPoint = target > 0 ? (target * daysElapsed / EARNINGS_QUARTER_DAYS) : 0;
    const trackDiff = qRev - expectedAtThisPoint;
    const trackPct = expectedAtThisPoint > 0 ? ((trackDiff / expectedAtThisPoint) * 100) : 0;
    const onTrack = qRev >= expectedAtThisPoint;
    const trackLabel = onTrack ? '✅ On Track' : '⚠️ Off Track';
    const trackColor = onTrack ? '#217346' : '#c00';
    const trackDetail = `${onTrack ? '+' : ''}${formatCompact(trackDiff)} (${trackPct >= 0 ? '+' : ''}${trackPct.toFixed(1)}%)`;
    const streakVal = gameState.earningsStreak;
    const streakStr = streakVal > 0 ? `🔥 ${streakVal} beat${streakVal > 1 ? 's' : ''}` :
                      streakVal < 0 ? `❄️ ${Math.abs(streakVal)} miss${Math.abs(streakVal) > 1 ? 'es' : ''}` : '—';

    // Separator
    html += `<div class="grid-row sep-row">
      <div class="row-num">${rowNum++}</div>
      <div class="cell cell-a sep-cell"></div><div class="cell cell-b sep-cell"></div>
      <div class="cell cell-c sep-cell"></div><div class="cell cell-d sep-cell"></div>
      <div class="cell cell-e sep-cell"></div><div class="cell cell-f sep-cell"></div>
      <div class="cell cell-g sep-cell"></div><div class="cell cell-h sep-cell"></div>
    </div>`;

    // IR Header
    html += `<div class="grid-row ir-header">
      <div class="row-num">${rowNum++}</div>
      <div class="cell cell-a" style="font-weight:700;color:#0078d4">INVESTOR RELATIONS</div>
      <div class="cell cell-b"></div>
      <div class="cell cell-c"></div>
      <div class="cell cell-d"></div>
      <div class="cell cell-e"></div>
      <div class="cell cell-f" style="font-size:10px;color:#888">Earnings in ${earningsDaysLeft}d</div>
      <div class="cell cell-g"></div>
      <div class="cell cell-h"></div>
    </div>`;

    // Quarter + Days remaining
    html += `<div class="grid-row ir-row">
      <div class="row-num">${rowNum++}</div>
      <div class="cell cell-a" style="padding-left:16px;color:#444">Quarter</div>
      <div class="cell cell-b" style="font-weight:600;color:#0078d4">${earningsQLabel}</div>
      <div class="cell cell-c"></div>
      <div class="cell cell-d" style="font-size:10px;color:#888">Days Left</div>
      <div class="cell cell-e" style="font-weight:600;color:#333">${earningsDaysLeft}</div>
      <div class="cell cell-f"></div>
      <div class="cell cell-g"></div>
      <div class="cell cell-h"></div>
    </div>`;

    // Revenue vs Target
    html += `<div class="grid-row ir-row">
      <div class="row-num">${rowNum++}</div>
      <div class="cell cell-a" style="padding-left:16px;color:#444">Revenue vs Target</div>
      <div class="cell cell-b" style="font-weight:700;color:${trackColor}">${trackLabel}</div>
      <div class="cell cell-c" style="font-family:Consolas,monospace;font-size:11px;color:${trackColor}">${trackDetail}</div>
      <div class="cell cell-d" style="font-size:10px;color:#888">${formatCompact(qRev)} / ${formatCompact(target)}</div>
      <div class="cell cell-e"></div>
      <div class="cell cell-f"></div>
      <div class="cell cell-g"></div>
      <div class="cell cell-h"></div>
    </div>`;

    // Guidance row with buttons
    const guidanceKeys = Object.keys(GUIDANCE_LEVELS);
    const guidanceButtons = guidanceKeys.map(key => {
      const lv = GUIDANCE_LEVELS[key];
      const active = key === guidanceKey;
      const style = active
        ? 'font-weight:700;color:#0078d4;text-decoration:underline;cursor:pointer'
        : 'color:#888;cursor:pointer;font-size:10px';
      return `<span style="${style}" onclick="setGuidance('${key}')">${lv.emoji}${active ? ' ' + lv.label : ''}</span>`;
    }).join(' ');

    html += `<div class="grid-row ir-row" id="ir-guidance-row">
      <div class="row-num">${rowNum++}</div>
      <div class="cell cell-a" style="padding-left:16px;color:#444">Guidance</div>
      <div class="cell cell-b">${guidanceButtons}</div>
      <div class="cell cell-c" style="font-size:10px;color:#888;justify-content:flex-end">${guidanceLevel.reMult}× RE</div>
      <div class="cell cell-d" style="font-size:10px;color:#888">Target: ${formatCompact(gameState.guidanceTarget)}</div>
      <div class="cell cell-e"></div>
      <div class="cell cell-f"></div>
      <div class="cell cell-g"></div>
      <div class="cell cell-h"></div>
    </div>`;

    // Streak
    html += `<div class="grid-row ir-row">
      <div class="row-num">${rowNum++}</div>
      <div class="cell cell-a" style="padding-left:16px;color:#444">Streak</div>
      <div class="cell cell-b" style="color:#333">${streakStr}</div>
      <div class="cell cell-c"></div>
      <div class="cell cell-d" style="font-size:10px;color:#888">Analyst Exp</div>
      <div class="cell cell-e" style="font-family:Consolas,monospace;font-size:11px;color:#333">${(gameState.analystBaseline).toFixed(2)}×</div>
      <div class="cell cell-f"></div>
      <div class="cell cell-g"></div>
      <div class="cell cell-h"></div>
    </div>`;

    // Stock Price + QTD change
    html += `<div class="grid-row ir-row">
      <div class="row-num">${rowNum++}</div>
      <div class="cell cell-a" style="padding-left:16px;color:#444">Stock Price</div>
      <div class="cell cell-b" style="font-weight:700;color:#0078d4;font-family:Consolas,monospace;font-size:12px">${formatMoney(stockPrice)}</div>
      <div class="cell cell-c"></div>
      <div class="cell cell-d" style="font-size:10px;color:#888">QTD</div>
      <div class="cell cell-e" style="font-weight:600;color:${qtdColor};font-family:Consolas,monospace;font-size:11px">${qtdStr}</div>
      <div class="cell cell-f"></div>
      <div class="cell cell-g"></div>
      <div class="cell cell-h"></div>
    </div>`;

    // Retained Earnings
    html += `<div class="grid-row ir-row">
      <div class="row-num">${rowNum++}</div>
      <div class="cell cell-a" style="padding-left:16px;color:#444">Retained Earnings</div>
      <div class="cell cell-b" style="font-weight:700;color:#7b1fa2;font-family:Consolas,monospace;font-size:12px">${gameState.retainedEarnings.toLocaleString()} RE</div>
      <div class="cell cell-c"></div>
      <div class="cell cell-d"></div>
      <div class="cell cell-e"></div>
      <div class="cell cell-f" style="font-size:9px;color:#7b1fa2">Spend in Board Room tab</div>
      <div class="cell cell-g"></div>
      <div class="cell cell-h"></div>
    </div>`;
  }

  // ===== TAX LIABILITY (if any debts) =====
  if (hasTaxDebts) {
    const stageLabels = {
      notice1: '1st Notice',
      notice2: '⚠ 2nd Notice',
      garnish: '🔴 Garnishment',
      seizure: '🚨 Seizure',
    };

    html += `<div class="grid-row sep-row">
      <div class="row-num">${rowNum++}</div>
      <div class="cell cell-a sep-cell"></div><div class="cell cell-b sep-cell"></div>
      <div class="cell cell-c sep-cell"></div><div class="cell cell-d sep-cell"></div>
      <div class="cell cell-e sep-cell"></div><div class="cell cell-f sep-cell"></div>
      <div class="cell cell-g sep-cell"></div><div class="cell cell-h sep-cell"></div>
    </div>`;

    html += `<div class="grid-row tax-grid-header">
      <div class="row-num">${rowNum++}</div>
      <div class="cell cell-a" style="font-weight:600;color:#900">TAX LIABILITY</div>
      <div class="cell cell-b" style="font-weight:600;color:#666;font-size:10px">Original</div>
      <div class="cell cell-c" style="font-weight:600;color:#666;font-size:10px;justify-content:flex-end">Interest</div>
      <div class="cell cell-d" style="font-weight:600;color:#666;font-size:10px;justify-content:flex-end">Total Due</div>
      <div class="cell cell-e" style="font-weight:600;color:#666;font-size:10px">Age</div>
      <div class="cell cell-f" style="font-weight:600;color:#666;font-size:10px">Status</div>
      <div class="cell cell-g" style="font-weight:600;color:#666;font-size:10px">Next</div>
      <div class="cell cell-h"></div>
    </div>`;

    for (let i = 0; i < gameState.taxDebts.length; i++) {
      const d = gameState.taxDebts[i];
      const interest = d.current - d.original;
      const daysToNext = d.stage === 'notice1' ? (30 - d.daysOverdue) :
                         d.stage === 'notice2' ? (90 - d.daysOverdue) :
                         d.stage === 'garnish' ? (180 - d.daysOverdue) : 0;
      const nextLabel = d.stage === 'notice1' ? '2nd Notice' :
                        d.stage === 'notice2' ? 'Garnish' :
                        d.stage === 'garnish' ? 'Seizure' : '—';
      const nextText = daysToNext > 0 ? `${nextLabel} ${daysToNext}d` : '—';
      const qLabel = d.quarter || '';

      html += `<div class="grid-row tax-debt-row">
        <div class="row-num">${rowNum++}</div>
        <div class="cell cell-a" style="color:#900">${qLabel} Assessment</div>
        <div class="cell cell-b" style="font-family:Consolas,monospace;font-size:11px;color:#c00">${formatMoney(d.original)}</div>
        <div class="cell cell-c" style="font-family:Consolas,monospace;font-size:11px;color:#c00;justify-content:flex-end">${formatMoney(interest)}</div>
        <div class="cell cell-d" style="font-family:Consolas,monospace;font-size:11px;color:#c00;font-weight:700;justify-content:flex-end">${formatMoney(d.current)}</div>
        <div class="cell cell-e" style="color:#888;font-size:11px">${d.daysOverdue}d</div>
        <div class="cell cell-f" style="font-size:10px">${stageLabels[d.stage]}</div>
        <div class="cell cell-g" style="font-size:10px;color:#888">${nextText}</div>
        <div class="cell cell-h"><button class="cell-btn btn-max" data-settle="${i}">Settle</button></div>
      </div>`;
    }

    const total = totalTaxOwed();
    const settleAllVis = gameState.taxDebts.length > 1 ? '' : 'display:none';
    html += `<div class="grid-row tax-total-row">
      <div class="row-num">${rowNum++}</div>
      <div class="cell cell-a" style="font-weight:700;color:#900">TOTAL OWED</div>
      <div class="cell cell-b"></div>
      <div class="cell cell-c"></div>
      <div class="cell cell-d" style="font-family:Consolas,monospace;font-size:12px;color:#c00;font-weight:700;justify-content:flex-end">${formatMoney(total)}</div>
      <div class="cell cell-e"></div><div class="cell cell-f"></div>
      <div class="cell cell-g"></div>
      <div class="cell cell-h"><button class="cell-btn btn-max" data-settle-all style="${settleAllVis}">Settle All</button></div>
    </div>`;
  }

  // Only rebuild DOM if content actually changed (prevents click-swallowing race)
  // Hash key parts that change: P&L numbers, tax debt count/amounts/stages, days-to-tax, IR data
  const hashParts = [
    gameState.quarterRevenue|0, gameState.totalEarned|0,
    gameState.quarterExpenses|0, gameState.quarterTaxPaid|0, gameState.totalTaxPaid|0,
    daysToTax,
    gameState.taxDebts ? gameState.taxDebts.map(d => `${d.current|0}:${d.stage}:${d.daysOverdue}`).join(',') : '',
    gameState.capitalExpenses ? gameState.capitalExpenses.length : 0,
    garnishActive ? 1 : 0,
    // Phase 2.1: IR section changes
    gameState.isPublic ? 1 : 0,
    gameState.earningsQuarterRevenue|0,
    gameState.currentGuidance || '',
    gameState.retainedEarnings|0,
    gameState.earningsStreak|0,
    gameState.isPublic ? (Math.floor(getStockPrice() * 100)|0) : 0,
    // Phase 2.2: Board Room effects on display
    getBoardRoomTaxRate(),
    getBoardRoomRevMultiplier(),
  ].join('|');

  if (hashParts !== _lastTaxPanelHash) {
    _lastTaxPanelHash = hashParts;
    panel.innerHTML = html;
    buildFillerRows();
  }
}

// Debug: trigger quarterly tax
function triggerIRS() {
  processQuarterlyTax();
}

function triggerBonus() {
  gameState.revBonus = { mult: 5, until: Date.now() + 30000 };
  document.getElementById('status-text').textContent = '🔥 Revenue ×5 — 30s remaining (debug)';
}

function showEventToast(sender, subject, body, actions, opts) {
  showEvent({ sender, subject, body, actions, ...opts });
}

function gameTick() {
  if (!gameState.arc) return;
  if (gameState.earningsPaused) return;
  const now = Date.now();

  const isPowerOut = gameState.powerOutage && now < gameState.powerOutage.until;

  if (!isPowerOut) {
    let penaltyMult = 1;
    if (gameState.revPenalty && now < gameState.revPenalty.until) {
      penaltyMult = gameState.revPenalty.mult;
    } else {
      gameState.revPenalty = null;
    }

    let bonusMult = 1;
    if (gameState.revBonus && now < gameState.revBonus.until) {
      bonusMult = gameState.revBonus.mult;
    } else {
      gameState.revBonus = null;
    }

    // Tax garnishment
    const garnishActive = gameState.taxDebts && gameState.taxDebts.some(d => d.stage === 'garnish');
    if (garnishActive) penaltyMult *= 0.85;

    // Board Room revenue multiplier
    const brRevMult = getBoardRoomRevMultiplier();

    for (const state of gameState.sources) {
      if (!state.unlocked || state.employees === 0) continue;
      const fullRev = sourceRevPerTick(state) * brRevMult;
      const rev = fullRev * penaltyMult * bonusMult;
      const garnished = garnishActive ? Math.floor(fullRev * 0.15) : 0;

      if (state.automated) {
        gameState.cash += rev;
        gameState.totalEarned += rev;
        gameState.quarterRevenue += rev;
        trackEarningsRevenue(rev);
        if (garnished > 0) {
          gameState.quarterTaxPaid += garnished;
          gameState.totalTaxPaid += garnished;
        }
      } else {
        state.pendingCollect += rev;
      }
    }
  }

  // Advance in-game time (1 tick = 1 day)
  gameState.gameElapsedSecs += SECS_PER_DAY;

  // Quarterly tax assessment (every 90 game-days)
  const currentDay = Math.floor(gameState.gameElapsedSecs / SECS_PER_DAY);
  if (currentDay - gameState.lastQuarterDay >= 90) {
    processQuarterlyTax();
    gameState.lastQuarterDay = currentDay;
  }

  // Tax debt processing (each tick = 1 day)
  processTaxDebts();

  // Phase 2.1: IPO check
  checkIPOTrigger();

  // Phase 2.1: Earnings quarter check (every 90 game-days post-IPO)
  if (gameState.isPublic) {
    const earningsDaysSince = currentDay - gameState.lastEarningsDay;
    if (earningsDaysSince >= EARNINGS_QUARTER_DAYS) {
      processEarnings();
      gameState.lastEarningsDay = currentDay;
    }
  }

  gameState.totalPlayTime++;
  gameState.lastTick = now;

  // Mini-task system
  trySpawnMiniTask();
  trySpawnGoldenCell();

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

  // Valuation chart
  sampleValuation();
  drawValuationChart();

  updateToastButtons();
  updateGridValues();
  updateDisplay();
}

// ===== EVENTS =====
function triggerRandomEvent() {
  const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
  showEvent(event);
}

let eventToastTimer = null;
let _eventToastActions = null; // track actions with cashRequired for live updates

function showEvent(event) {
  // Handle dynamic events that generate content at trigger time
  if (event.dynamic && event.setup) {
    const result = event.setup(gameState);
    if (!result) return; // couldn't generate (e.g., no unlocked sources)
    event = { ...event, body: result.body, actions: result.actions };
  }

  // Clear any existing timer
  if (eventToastTimer) { clearTimeout(eventToastTimer); eventToastTimer = null; }

  const toast = document.getElementById('event-toast');

  // Restore saved position if available
  const savedPos = localStorage.getItem('quarterClose_toastPos');
  if (savedPos) {
    const pos = JSON.parse(savedPos);
    toast.style.left = pos.left + 'px';
    toast.style.top = pos.top + 'px';
    toast.style.transform = 'none';
  } else {
    toast.style.left = '50%';
    toast.style.top = '50%';
    toast.style.transform = 'translate(-50%, -50%)';
  }

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
    // Hide close button for non-closable toasts (earnings, IRS decisions)
    document.getElementById('toast-close').style.display = event.closable === false ? 'none' : '';
    // Default auto-expire: 10s for all events unless explicitly set
    const expiry = event.expiresMs !== undefined ? event.expiresMs : 10000;
    _eventToastActions = []; // reset tracked actions
    event.actions.forEach((action, i) => {
      const btn = document.createElement('button');
      btn.className = 'toast-btn' + (i === 0 ? ' toast-primary' : '');
      btn.textContent = action.label;

      // Track actions with cashRequired for live enable/disable updates
      if (action.cashRequired !== undefined) {
        _eventToastActions.push({ btn, action });
        if (gameState.cash < action.cashRequired) {
          btn.disabled = true;
          btn.textContent = action.disabledLabel || 'Not enough cash';
          btn.classList.add('toast-btn-disabled');
        }
      }

      btn.onclick = () => {
        if (btn.disabled) return;
        if (eventToastTimer) { clearTimeout(eventToastTimer); eventToastTimer = null; }
        _eventToastActions = null;
        const result = action.effect(gameState);
        document.getElementById('status-text').textContent = result;
        setTimeout(() => {
          document.getElementById('status-text').textContent = 'Ready';
        }, 3000);
        dismissEvent();
        updateDisplay();
      };

      // Add countdown overlay on the last action if event expires
      if (expiry > 0 && i === event.actions.length - 1) {
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        const fill = document.createElement('div');
        fill.className = 'toast-btn-countdown';
        fill.style.animationDuration = (expiry / 1000) + 's';
        btn.appendChild(fill);

        eventToastTimer = setTimeout(() => {
          eventToastTimer = null;
          btn.click();
        }, expiry);
      }

      actionsDiv.appendChild(btn);
    });
  }

  toast.classList.remove('hidden');
}

function dismissEvent() {
  if (eventToastTimer) { clearTimeout(eventToastTimer); eventToastTimer = null; }
  _eventToastActions = null;
  document.getElementById('event-toast').classList.add('hidden');
}

// Update toast buttons with cashRequired (called each tick)
function updateToastButtons() {
  if (!_eventToastActions) return;
  for (const { btn, action } of _eventToastActions) {
    const canAfford = gameState.cash >= action.cashRequired;
    if (canAfford && btn.disabled) {
      btn.disabled = false;
      btn.textContent = action.label;
      btn.classList.remove('toast-btn-disabled');
    } else if (!canAfford && !btn.disabled) {
      btn.disabled = true;
      btn.textContent = action.disabledLabel || 'Not enough cash';
      btn.classList.add('toast-btn-disabled');
    }
  }
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
    miniTaskStreak: gameState.miniTaskStreak,
    gameStartDate: gameState.gameStartDate,
    gameElapsedSecs: gameState.gameElapsedSecs,
    taxDebts: gameState.taxDebts || [],
    quarterRevenue: gameState.quarterRevenue,
    quarterExpenses: gameState.quarterExpenses,
    quarterTaxPaid: gameState.quarterTaxPaid,
    totalTaxPaid: gameState.totalTaxPaid,
    totalSpentHires: gameState.totalSpentHires,
    totalSpentUpgrades: gameState.totalSpentUpgrades,
    totalSpentAuto: gameState.totalSpentAuto,
    lastQuarterDay: gameState.lastQuarterDay,
    capitalExpenses: gameState.capitalExpenses || [],
    valuationHistory: gameState.valuationHistory || [],
    // Phase 2.1
    isPublic: gameState.isPublic || false,
    ipoDay: gameState.ipoDay || 0,
    sharesOutstanding: gameState.sharesOutstanding || 1000000000,
    retainedEarnings: gameState.retainedEarnings || 0,
    analystBaseline: gameState.analystBaseline || 1.0,
    earningsStreak: gameState.earningsStreak || 0,
    currentGuidance: gameState.currentGuidance || null,
    guidanceTarget: gameState.guidanceTarget || 0,
    lastEarningsDay: gameState.lastEarningsDay || 0,
    earningsQuarterRevenue: gameState.earningsQuarterRevenue || 0,
    ipoStockPriceStart: gameState.ipoStockPriceStart || 0,
    _earningsMultiplier: gameState._earningsMultiplier || 1.0,
    // Phase 2.2: Board Room
    boardRoomPurchases: gameState.boardRoomPurchases || {},
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
    gameState.miniTaskStreak = data.miniTaskStreak || 0;
    gameState.gameStartDate = data.gameStartDate || Date.UTC(2024, 0, 1);
    gameState.gameElapsedSecs = data.gameElapsedSecs || 0;
    gameState.eventCooldown = 30;
    gameState.miniTaskCooldown = 10;
    gameState.taxDebts = data.taxDebts || [];
    gameState.quarterRevenue = data.quarterRevenue || 0;
    gameState.quarterExpenses = data.quarterExpenses || 0;
    gameState.quarterTaxPaid = data.quarterTaxPaid || 0;
    gameState.totalTaxPaid = data.totalTaxPaid || 0;
    gameState.totalSpentHires = data.totalSpentHires || 0;
    gameState.totalSpentUpgrades = data.totalSpentUpgrades || 0;
    gameState.totalSpentAuto = data.totalSpentAuto || 0;
    gameState.lastQuarterDay = data.lastQuarterDay || 0;
    gameState.capitalExpenses = (data.capitalExpenses || []).filter(c => c && c.quartersLeft > 0 && c.perQuarter > 0);
    gameState.valuationHistory = data.valuationHistory || [];
    // Phase 2.1
    gameState.isPublic = data.isPublic || false;
    gameState.earningsPaused = false; // transient, never persist
    gameState.ipoDay = data.ipoDay || 0;
    gameState.sharesOutstanding = data.sharesOutstanding || 1000000000;
    gameState.retainedEarnings = data.retainedEarnings || 0;
    // Cap RE from pre-fix saves with inflated balances
    if (gameState.retainedEarnings > 100000) gameState.retainedEarnings = 0;
    gameState.analystBaseline = data.analystBaseline || 1.0;
    gameState.earningsStreak = data.earningsStreak || 0;
    gameState.currentGuidance = data.currentGuidance || null;
    gameState.guidanceTarget = data.guidanceTarget || 0;
    gameState.lastEarningsDay = data.lastEarningsDay || 0;
    gameState.earningsQuarterRevenue = data.earningsQuarterRevenue || 0;
    gameState.ipoStockPriceStart = data.ipoStockPriceStart || 0;
    gameState._earningsMultiplier = data._earningsMultiplier || 1.0;
    // Phase 2.2: Board Room
    gameState.boardRoomPurchases = data.boardRoomPurchases || {};
    gameState.activeTab = 'operations';

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
    // Each real second = 1 game-day, so offline ticks = elapsed seconds
    if (elapsed > 5) {
      let offlineEarnings = 0;
      for (const state of gameState.sources) {
        if (state.unlocked && state.automated && state.employees > 0) {
          const daily = sourceAnnualRev(state) / 365.25;
          offlineEarnings += daily * elapsed;
        }
      }
      // Also advance game time (1 day per elapsed second)
      gameState.gameElapsedSecs += SECS_PER_DAY * elapsed;
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
    updateTaxPanel();
    updateBoardRoomTab();

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
  gameState.gameStartDate = Date.now();
  gameState.gameElapsedSecs = 0;
  gameState.revPenalty = null;
  gameState.revBonus = null;
  gameState.powerOutage = null;
  gameState.hireFrozen = null;
  gameState.taxDebts = [];
  gameState.quarterRevenue = 0;
  gameState.quarterExpenses = 0;
  gameState.quarterTaxPaid = 0;
  gameState.totalTaxPaid = 0;
  gameState.totalSpentHires = 0;
  gameState.totalSpentUpgrades = 0;
  gameState.totalSpentAuto = 0;
  gameState.lastQuarterDay = 0;
  gameState.capitalExpenses = [];
  gameState.valuationHistory = [];
  // Phase 2.1
  gameState.isPublic = false;
  gameState.ipoDay = 0;
  gameState.sharesOutstanding = 1000000000;
  gameState.retainedEarnings = 0;
  gameState.analystBaseline = 1.0;
  gameState.earningsStreak = 0;
  gameState.currentGuidance = null;
  gameState.guidanceTarget = 0;
  gameState.lastEarningsDay = 0;
  gameState.earningsQuarterRevenue = 0;
  gameState.ipoStockPriceStart = 0;
  gameState._earningsMultiplier = 1.0;
  // Phase 2.2: Board Room
  gameState.boardRoomPurchases = {};
  gameState.activeTab = 'operations';
  gameState.eventCooldown = 0;
  gameState.miniTaskCooldown = 0;
  gameState.miniTaskActive = false;
  gameState.miniTaskStreak = 0;
  gameState.goldenCellActive = false;
  gameState.goldenCellCooldown = 60;
  _lastTaxPanelHash = ''; // force rebuild
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
  gameState.cash += 5000000;
  document.getElementById('series-a-modal').classList.remove('hidden');
}

function dismissSeriesA() {
  document.getElementById('series-a-modal').classList.add('hidden');
}

// ===== TOAST DRAG =====
let toastDragState = null;

function initToastDrag() {
  const header = document.getElementById('toast-header');
  header.style.cursor = 'move';

  header.addEventListener('mousedown', (e) => {
    if (e.target.id === 'toast-close') return;
    e.preventDefault();
    const toast = document.getElementById('event-toast');
    const rect = toast.getBoundingClientRect();
    // Switch from centered to absolute positioning on first drag
    toast.style.transform = 'none';
    toast.style.left = rect.left + 'px';
    toast.style.top = rect.top + 'px';
    toastDragState = { startX: e.clientX, startY: e.clientY, origLeft: rect.left, origTop: rect.top };
  });

  document.addEventListener('mousemove', (e) => {
    if (!toastDragState) return;
    const dx = e.clientX - toastDragState.startX;
    const dy = e.clientY - toastDragState.startY;
    const toast = document.getElementById('event-toast');
    toast.style.left = (toastDragState.origLeft + dx) + 'px';
    toast.style.top = (toastDragState.origTop + dy) + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (toastDragState) {
      const toast = document.getElementById('event-toast');
      const rect = toast.getBoundingClientRect();
      localStorage.setItem('quarterClose_toastPos', JSON.stringify({ left: rect.left, top: rect.top }));
      toastDragState = null;
    }
  });
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

function showHelp() {
  closeFileMenu();
  document.getElementById('help-modal').classList.remove('hidden');
}

function dismissHelp() {
  document.getElementById('help-modal').classList.add('hidden');
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
  // Golden cell click
  const goldenEl = e.target.closest('.golden-cell');
  if (goldenEl && clickGoldenCell(goldenEl)) return;

  if (fileMenuOpen && !e.target.closest('#file-menu')) {
    closeFileMenu();
  }

  // Formula bar: update cell reference on click
  const cell = e.target.closest('.cell');
  if (cell) {
    const row = cell.closest('.grid-row');
    if (row) {
      const colMap = { 'cell-a': 'A', 'cell-b': 'B', 'cell-c': 'C', 'cell-d': 'D',
                       'cell-e': 'E', 'cell-f': 'F', 'cell-g': 'G', 'cell-h': 'H' };
      let col = '';
      for (const [cls, letter] of Object.entries(colMap)) {
        if (cell.classList.contains(cls)) { col = letter; break; }
      }
      const rowNumEl = row.querySelector('.row-num');
      const rowNum = rowNumEl ? rowNumEl.textContent : '';
      if (col && rowNum) {
        const ref = col + rowNum;
        document.getElementById('cell-ref').textContent = ref;
        const text = cell.textContent.trim();
        document.getElementById('formula-input').textContent = text || '';
        // Highlight only non-interactive cells (skip action columns on source rows)
        document.querySelectorAll('.cell.selected-cell').forEach(c => c.classList.remove('selected-cell'));
        const isActionCol = cell.matches('[data-field="action1"], [data-field="action2"], [data-field="action3"]');
        if (!isActionCol) {
          cell.classList.add('selected-cell');
        }
      }
    }
  }
});

// ===== PHASE 2.1: IPO + EARNINGS =====
const IPO_VALUATION_THRESHOLD = 5e12; // $5T
const EARNINGS_QUARTER_DAYS = 90;
const GUIDANCE_LEVELS = {
  conservative: { label: 'Conservative', pct: 0.70, reMult: 0.5, emoji: '🛡️' },
  'in-line':    { label: 'In-Line',      pct: 0.90, reMult: 1.0, emoji: '📊' },
  ambitious:    { label: 'Ambitious',    pct: 1.10, reMult: 2.0, emoji: '🎯' },
  aggressive:   { label: 'Aggressive',   pct: 1.30, reMult: 3.0, emoji: '🔥' },
};

let ipoOffered = false; // track if we've already shown the IPO prompt this session

function getStockPrice() {
  if (!gameState.isPublic) return 0;
  return getCompanyValuation() / gameState.sharesOutstanding;
}

function checkIPOTrigger() {
  if (gameState.isPublic || ipoOffered) return;
  const val = getCompanyValuation();
  if (val >= IPO_VALUATION_THRESHOLD) {
    ipoOffered = true;
    showIPOModal();
  }
}

function showIPOModal() {
  showEventToast('Goldman Sachs', '📈 Investment Banks Are Calling',
    `Your company valuation has reached ${formatCompact(getCompanyValuation())}. Major investment banks want to take you public.\n\nAn IPO would make your company publicly traded with 1B shares outstanding. You\'ll need to report quarterly earnings and manage investor expectations.\n\nAre you ready for Wall Street?`,
    [
      { label: '🔔 Ring the Bell — Go Public!', effect: (gs) => {
        executeIPO();
        return '🎉 IPO complete! Welcome to the public markets. Your stock is now trading.';
      }},
      { label: 'Not yet', effect: () => {
        ipoOffered = false; // allow re-trigger
        return 'You declined the IPO. The bankers will call back when you\'re ready.';
      }},
    ], { expiresMs: 0 });
}

function executeIPO() {
  const currentDay = Math.floor(gameState.gameElapsedSecs / SECS_PER_DAY);
  gameState.isPublic = true;
  gameState.ipoDay = currentDay;
  gameState.sharesOutstanding = 1000000000;
  gameState.lastEarningsDay = currentDay;
  gameState.earningsQuarterRevenue = 0;
  gameState.currentGuidance = 'in-line';
  gameState.analystBaseline = 1.0;
  gameState.earningsStreak = 0;
  gameState.retainedEarnings = 0;

  // Set initial guidance target
  const projectedRevenue = totalRevPerTick() * EARNINGS_QUARTER_DAYS * gameState.analystBaseline;
  const level = GUIDANCE_LEVELS[gameState.currentGuidance];
  gameState.guidanceTarget = Math.floor(projectedRevenue * level.pct);
  gameState.ipoStockPriceStart = getStockPrice();

  // Rebuild the grid to show IR section
  _lastTaxPanelHash = '';
  updateTaxPanel();
  buildFillerRows();
  updateBoardRoomTab();
}

function forceIPO() {
  if (gameState.isPublic) return;
  executeIPO();
  document.getElementById('status-text').textContent = '🧪 Debug IPO triggered! You\'re public.';
  setTimeout(() => { document.getElementById('status-text').textContent = 'Ready'; }, 3000);
}

function resetBoardRoom() {
  gameState.boardRoomPurchases = {};
  gameState.retainedEarnings = 0;
  if (gameState.activeTab === 'boardroom') renderBoardRoom();
  document.getElementById('status-text').textContent = '🧪 Board Room reset — all upgrades cleared, RE set to 0.';
  setTimeout(() => { document.getElementById('status-text').textContent = 'Ready'; }, 3000);
}

function setGuidance(level) {
  if (!gameState.isPublic) return;
  gameState.currentGuidance = level;
  const projectedRevenue = totalRevPerTick() * EARNINGS_QUARTER_DAYS * gameState.analystBaseline;
  const guidanceLevel = GUIDANCE_LEVELS[level];
  gameState.guidanceTarget = Math.floor(projectedRevenue * guidanceLevel.pct);
  _lastTaxPanelHash = ''; // force IR section rebuild
  updateTaxPanel();
}

function getEarningsQuarterLabel() {
  if (!gameState.isPublic) return '';
  const currentDay = Math.floor(gameState.gameElapsedSecs / SECS_PER_DAY);
  const daysSinceIPO = currentDay - gameState.ipoDay;
  const quarterNum = Math.floor(daysSinceIPO / EARNINGS_QUARTER_DAYS);
  return `Q${(quarterNum % 4) + 1}`;
}

function processEarnings() {
  if (!gameState.isPublic) return;

  const qRevenue = gameState.earningsQuarterRevenue;
  const target = gameState.guidanceTarget;
  const guidanceKey = gameState.currentGuidance || 'in-line';
  const guidanceLevel = GUIDANCE_LEVELS[guidanceKey];
  const qLabel = getEarningsQuarterLabel();

  // Calculate beat/miss
  let margin = 0;
  if (target > 0) {
    margin = (qRevenue - target) / target;
  }

  let result, stockChange, reEarned;
  const isInLine = Math.abs(margin) <= 0.05;

  if (qRevenue >= target) {
    // Beat or in-line
    if (isInLine) {
      result = 'IN-LINE';
      stockChange = 0.01 + Math.random() * 0.04; // +1% to +5%
    } else {
      result = 'BEAT';
      // Stock jump: +5% to +30%, scaled by margin and guidance risk
      const marginBonus = Math.min(margin, 0.5); // cap at 50% over
      stockChange = 0.05 + marginBonus * 0.4 + (guidanceLevel.reMult - 0.5) * 0.02;
      stockChange = Math.min(stockChange, 0.30);
    }

    // RE calculation — logarithmic scale so it doesn't explode at high revenue
    const marginBonusMult = 1 + Math.min(margin, 0.5); // up to 1.5× for blowout
    const streakMult = gameState.earningsStreak >= 0 ?
      Math.min(2.0, 1 + gameState.earningsStreak * 0.1) : 1;
    // Base RE = 10 × log10(quarterRevenue) — e.g. $80B → ~109 base RE
    const baseRE = qRevenue > 0 ? Math.floor(10 * Math.log10(qRevenue)) : 0;
    reEarned = Math.floor(baseRE * guidanceLevel.reMult * marginBonusMult * streakMult);

    gameState.retainedEarnings += reEarned;
    gameState.earningsStreak = Math.max(0, gameState.earningsStreak) + 1;

    // Analyst ratchet (slowed by Analyst Relations upgrade)
    const hasAnalystRelations = hasBoardRoomUpgrade('analyst_relations');
    if (gameState.earningsStreak >= 3) {
      gameState.analystBaseline *= hasAnalystRelations ? 1.075 : 1.15; // analyst upgrade
    } else {
      gameState.analystBaseline *= hasAnalystRelations ? 1.025 : 1.05;
    }
  } else {
    // Miss
    if (isInLine) {
      result = 'IN-LINE';
      stockChange = -(0.01 + Math.random() * 0.04); // -1% to -5%
      reEarned = 0;
      gameState.earningsStreak = 0;
      gameState.analystBaseline *= 0.97;
    } else {
      result = 'MISS';
      const missMargin = Math.abs(margin);
      stockChange = -(0.05 + missMargin * 0.4 + (guidanceLevel.reMult - 0.5) * 0.02);
      stockChange = Math.max(stockChange, -0.25);
      reEarned = 0;

      gameState.earningsStreak = Math.min(0, gameState.earningsStreak) - 1;

      // Analyst ratchet (downgrade not affected by Analyst Relations)
      if (gameState.earningsStreak <= -2) {
        gameState.analystBaseline *= 0.90; // analyst downgrade
      } else {
        gameState.analystBaseline *= 0.97;
      }
    }
  }

  // Apply stock price change via valuation manipulation
  // We affect the market sentiment to create the price jump
  const currentPrice = getStockPrice();
  // Shift market sentiment to create the target price change
  // noise = 1 + marketSentiment * 0.015, so to move price by X%, we need to shift sentiment
  // But we want a discrete jump, so we'll adjust a persistent earnings multiplier instead
  if (!gameState._earningsMultiplier) gameState._earningsMultiplier = 1.0;
  gameState._earningsMultiplier *= (1 + stockChange);

  const newPrice = getStockPrice();

  // Reset for next quarter
  const oldQuarterRev = gameState.earningsQuarterRevenue;
  gameState.earningsQuarterRevenue = 0;

  // Show earnings modal with next quarter guidance selection
  const marginPct = (margin * 100).toFixed(1);
  const resultEmoji = result === 'BEAT' ? '📈' : result === 'MISS' ? '📉' : '➡️';
  const streakText = gameState.earningsStreak > 1 ? `🔥 ${gameState.earningsStreak} consecutive beats` :
                     gameState.earningsStreak < -1 ? `❄️ ${Math.abs(gameState.earningsStreak)} consecutive misses` : '';
  const analystText = gameState.earningsStreak >= 3 ? 'Analyst Upgrade ⬆️' :
                      gameState.earningsStreak <= -2 ? 'Analyst Downgrade ⬇️' : '';

  const stockPctStr = (stockChange >= 0 ? '+' : '') + (stockChange * 100).toFixed(1) + '%';

  // Finance Dept: auto-process earnings without modal
  const financeDeptLvl = getFinanceDeptLevel();
  if (financeDeptLvl > 0) {
    // Auto-set guidance based on Finance Dept level (player can override via IR row)
    const autoGuidance = financeDeptLvl >= 3 ? 'ambitious' :
                         financeDeptLvl >= 2 ? 'in-line' : 'conservative';
    setGuidance(autoGuidance);

    // Status bar notification instead of modal
    const reStr = reEarned > 0 ? ` +${reEarned} RE` : '';
    document.getElementById('status-text').textContent = `${resultEmoji} ${qLabel} ${result} (${marginPct > 0 ? '+' : ''}${marginPct}%) | Stock ${stockPctStr}${reStr}`;
    setTimeout(() => { document.getElementById('status-text').textContent = 'Ready'; }, 5000);

    // Record stock price at start of new quarter
    gameState.ipoStockPriceStart = getStockPrice();
    return;
  }

  showEarningsModal({
    qLabel,
    revenue: oldQuarterRev,
    target,
    guidanceKey,
    result,
    resultEmoji,
    marginPct,
    stockChange: stockPctStr,
    reEarned,
    streakText,
    analystText,
  });

  // Pause game while earnings modal is open
  gameState.earningsPaused = true;

  // Record stock price at start of new quarter
  gameState.ipoStockPriceStart = getStockPrice();
}

function showEarningsModal(data) {
  const guidanceLabel = GUIDANCE_LEVELS[data.guidanceKey].label;
  const body = `Revenue: ${formatMoney(data.revenue)}\nGuidance: ${formatMoney(data.target)} (${guidanceLabel})\nResult: ${data.result} (${data.marginPct > 0 ? '+' : ''}${data.marginPct}%) ${data.resultEmoji}\n\nStock: ${data.stockChange}\nRetained Earnings: +${data.reEarned} RE${data.streakText ? '\n' + data.streakText : ''}${data.analystText ? '\n' + data.analystText : ''}\n\nSet next quarter guidance:`;

  // Build actions — 4 guidance buttons + close
  const actions = Object.entries(GUIDANCE_LEVELS).map(([key, level]) => ({
    label: `${level.emoji} ${level.label} (${Math.round(level.pct * 100)}%)`,
    effect: (gs) => {
      gs.earningsPaused = false;
      setGuidance(key);
      return `${data.qLabel} earnings reported. Next quarter: ${level.label} guidance set.`;
    },
  }));

  showEventToast('Investor Relations', `${data.qLabel} EARNINGS REPORT`,
    body, actions, { expiresMs: 0, closable: false });
}

function trackEarningsRevenue(amount) {
  if (gameState.isPublic) {
    gameState.earningsQuarterRevenue += amount;
  }
}

// Expose
window.forceIPO = forceIPO;
window.resetBoardRoom = resetBoardRoom;
window.setGuidance = setGuidance;

// ===== BOARD ROOM (Phase 2.2) =====
function switchTab(tab) {
  gameState.activeTab = tab;

  const revenueRows = document.getElementById('revenue-rows');
  const taxPanel = document.getElementById('tax-panel');
  const fillerRows = document.getElementById('filler-rows');
  const boardRoom = document.getElementById('board-room-rows');
  const tabOps = document.getElementById('tab-operations');
  const tabBR = document.getElementById('tab-board-room');

  if (tab === 'boardroom') {
    revenueRows.classList.add('hidden');
    taxPanel.classList.add('hidden');
    fillerRows.classList.add('hidden');
    boardRoom.classList.remove('hidden');
    tabOps.classList.remove('active');
    tabBR.classList.add('active');
    buildBoardRoom();
  } else {
    revenueRows.classList.remove('hidden');
    taxPanel.classList.remove('hidden');
    fillerRows.classList.remove('hidden');
    boardRoom.classList.add('hidden');
    tabOps.classList.add('active');
    tabBR.classList.remove('active');
    _lastTaxPanelHash = ''; // force rebuild
    updateTaxPanel();
    buildFillerRows();
  }
}

function updateBoardRoomTab() {
  const tabBR = document.getElementById('tab-board-room');
  if (gameState.isPublic) {
    tabBR.classList.remove('hidden');
  } else {
    tabBR.classList.add('hidden');
  }
}

let _lastBoardRoomHash = '';

function buildBoardRoom() {
  const container = document.getElementById('board-room-rows');
  if (!container) return;

  // Hash for change detection
  const hashParts = [
    gameState.retainedEarnings,
    JSON.stringify(gameState.boardRoomPurchases),
  ].join('|');
  if (hashParts === _lastBoardRoomHash && container.innerHTML !== '') return;
  _lastBoardRoomHash = hashParts;

  let html = '';
  let rowNum = 4; // starts after the header rows (1-3)

  // Board Room header
  html += `<div class="grid-row br-header-row">
    <div class="row-num">${rowNum++}</div>
    <div class="cell cell-a" style="font-weight:700;color:#7b1fa2">BOARD ROOM</div>
    <div class="cell cell-b" style="font-weight:600;color:#666;font-size:10px">Category</div>
    <div class="cell cell-c" style="font-weight:600;color:#666;font-size:10px;justify-content:flex-end">Cost</div>
    <div class="cell cell-d" style="font-weight:600;color:#666;font-size:10px;justify-content:flex-end">Status</div>
    <div class="cell cell-e"></div>
    <div class="cell cell-f" style="font-weight:700;color:#7b1fa2;font-family:Consolas,monospace;font-size:12px">${gameState.retainedEarnings.toLocaleString()} RE</div>
    <div class="cell cell-g"></div>
    <div class="cell cell-h"></div>
  </div>`;

  // Separator
  html += `<div class="grid-row">
    <div class="row-num">${rowNum++}</div>
    <div class="cell cell-a sep-cell"></div><div class="cell cell-b sep-cell"></div>
    <div class="cell cell-c sep-cell"></div><div class="cell cell-d sep-cell"></div>
    <div class="cell cell-e sep-cell"></div><div class="cell cell-f sep-cell"></div>
    <div class="cell cell-g sep-cell"></div><div class="cell cell-h sep-cell"></div>
  </div>`;

  for (const upgrade of BOARD_ROOM_UPGRADES) {
    const owned = getBoardRoomUpgradeCount(upgrade.id);
    const isOwned = owned > 0 && upgrade.maxCount !== Infinity;
    const requiresMet = !upgrade.requires || hasBoardRoomUpgrade(upgrade.requires);
    const canAfford = gameState.retainedEarnings >= upgrade.cost;
    const isLocked = !requiresMet;

    let statusCell = '';
    let rowClass = 'grid-row br-upgrade-row';

    if (isOwned) {
      rowClass += ' br-owned';
      const label = upgrade.maxCount === 1 ? '✅ Owned' : `✅ Owned (×${owned})`;
      statusCell = `<span class="br-owned-badge">${label}</span>`;
    } else if (isLocked) {
      rowClass += ' br-locked';
      const reqUpgrade = BOARD_ROOM_UPGRADES.find(u => u.id === upgrade.requires);
      const reqName = reqUpgrade ? reqUpgrade.name : upgrade.requires;
      statusCell = `<span class="br-locked-badge">🔒 Requires ${reqName}</span>`;
    } else {
      // Buyable
      const countLabel = upgrade.maxCount === Infinity && owned > 0 ? ` (have ${owned})` : '';
      statusCell = `<button class="cell-btn btn-buy-re" data-buy-upgrade="${upgrade.id}" ${canAfford ? '' : 'disabled'}>Buy${countLabel}</button>`;
    }

    const costColor = isOwned ? '#999' : isLocked ? '#ccc' : canAfford ? '#7b1fa2' : '#c00';

    html += `<div class="${rowClass}">
      <div class="row-num">${rowNum++}</div>
      <div class="cell cell-a" style="font-weight:500;${isLocked ? 'color:#bbb' : ''}">${upgrade.name}</div>
      <div class="cell cell-b" style="font-size:10px;color:#888">${upgrade.category}</div>
      <div class="cell cell-c" style="font-family:Consolas,monospace;font-size:11px;color:${costColor};justify-content:flex-end">${upgrade.cost.toLocaleString()} RE</div>
      <div class="cell cell-d" style="justify-content:flex-end">${statusCell}</div>
      <div class="cell cell-e"></div>
      <div class="cell cell-f" style="font-size:10px;color:#888;white-space:normal;line-height:1.3">${upgrade.desc}</div>
      <div class="cell cell-g"></div>
      <div class="cell cell-h"></div>
    </div>`;
  }

  // Filler rows for the board room view
  const ROW_HEIGHT = 28;
  const gridBottom = container.getBoundingClientRect().top || 300;
  const viewportHeight = window.innerHeight;
  const revBar = document.getElementById('revenue-breakdown');
  const sheetTabs = document.getElementById('sheet-tabs');
  const statusBar = document.getElementById('status-bar');
  const bottomChrome = (revBar ? revBar.offsetHeight : 0) +
                        (sheetTabs ? sheetTabs.offsetHeight : 0) +
                        (statusBar ? statusBar.offsetHeight : 0);
  const usedRows = BOARD_ROOM_UPGRADES.length + 3; // header + sep + upgrades
  const available = viewportHeight - gridBottom - bottomChrome - (usedRows * ROW_HEIGHT);
  const fillerCount = Math.max(3, Math.ceil(available / ROW_HEIGHT) + 1);

  for (let i = 0; i < fillerCount; i++) {
    html += `<div class="filler-row">
      <div class="row-num">${rowNum + i}</div>
      <div class="cell"></div><div class="cell"></div><div class="cell"></div>
      <div class="cell"></div><div class="cell"></div><div class="cell"></div>
      <div class="cell"></div><div class="cell"></div>
    </div>`;
  }

  container.innerHTML = html;
}

function purchaseBoardRoomUpgrade(id) {
  const upgrade = BOARD_ROOM_UPGRADES.find(u => u.id === id);
  if (!upgrade) return;

  const owned = getBoardRoomUpgradeCount(id);
  if (owned >= upgrade.maxCount) return;
  if (upgrade.requires && !hasBoardRoomUpgrade(upgrade.requires)) return;
  if (gameState.retainedEarnings < upgrade.cost) return;

  gameState.retainedEarnings -= upgrade.cost;
  gameState.boardRoomPurchases[id] = (gameState.boardRoomPurchases[id] || 0) + 1;

  // Status bar feedback
  document.getElementById('status-text').textContent = `🏢 Purchased: ${upgrade.name}`;
  setTimeout(() => { document.getElementById('status-text').textContent = 'Ready'; }, 3000);

  _lastBoardRoomHash = ''; // force rebuild
  buildBoardRoom();
  _lastTaxPanelHash = ''; // force IR section rebuild (RE changed)
  updateDisplay();
  saveGame();
}

// ===== INITIALIZATION =====
function init() {
  generateBossGrid();
  initChartDrag();
  initToastDrag();

  // Delegated click handler for tax panel buttons (survives innerHTML rebuilds)
  document.getElementById('tax-panel').addEventListener('click', (e) => {
    const settleBtn = e.target.closest('[data-settle]');
    if (settleBtn) {
      e.stopPropagation();
      settleTaxDebt(parseInt(settleBtn.dataset.settle));
      return;
    }
    const settleAllBtn = e.target.closest('[data-settle-all]');
    if (settleAllBtn) {
      e.stopPropagation();
      settleAllTax();
      return;
    }
  });

  // Delegated click handler for Board Room buy buttons
  document.getElementById('board-room-rows').addEventListener('click', (e) => {
    const buyBtn = e.target.closest('[data-buy-upgrade]');
    if (buyBtn) {
      e.stopPropagation();
      purchaseBoardRoomUpgrade(buyBtn.dataset.buyUpgrade);
      return;
    }
  });

  const loaded = loadGame();
  if (!loaded) {
    showArcSelect();
  }
  setInterval(gameTick, 1000);
}

// Expose for inline onclick
// ===== VALUATION CHART =====
const MAX_VALUATION_POINTS = 200;
let valuationTickCounter = 0;
let chartPositioned = false;
let chartDragState = null;
let marketSentiment = 0; // random walk: drifts between -1 and 1

function initChartDrag() {
  const container = document.getElementById('valuation-chart-container');
  const handle = container.querySelector('.chart-resize-handle');

  // Drag (move) — on the container itself
  container.addEventListener('mousedown', (e) => {
    if (e.target === handle) return; // let resize handle its own
    e.preventDefault();
    const rect = container.getBoundingClientRect();
    chartDragState = { type: 'move', startX: e.clientX, startY: e.clientY, origLeft: rect.left, origTop: rect.top };
  });

  // Resize — on the handle
  handle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    chartDragState = { type: 'resize', startX: e.clientX, startY: e.clientY, origW: container.offsetWidth, origH: container.offsetHeight };
  });

  document.addEventListener('mousemove', (e) => {
    if (!chartDragState) return;
    if (chartDragState.type === 'move') {
      const dx = e.clientX - chartDragState.startX;
      const dy = e.clientY - chartDragState.startY;
      container.style.left = (chartDragState.origLeft + dx) + 'px';
      container.style.top = (chartDragState.origTop + dy) + 'px';
      container.style.right = 'auto';
    } else if (chartDragState.type === 'resize') {
      const dx = e.clientX - chartDragState.startX;
      const dy = e.clientY - chartDragState.startY;
      const newW = Math.max(200, chartDragState.origW + dx);
      const newH = Math.max(140, chartDragState.origH + dy);
      container.style.width = newW + 'px';
      container.style.height = newH + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    chartDragState = null;
  });
}

function positionChartDefault() {
  const container = document.getElementById('valuation-chart-container');
  // Position to the right of column G (Rev/yr)
  const cell = document.querySelector('#row-1 .cell-g');
  if (!cell) {
    // Fallback: top-right area
    container.style.right = '20px';
    container.style.top = '80px';
    container.style.width = '300px';
    container.style.height = '200px';
    chartPositioned = true;
    return;
  }
  const gRect = cell.getBoundingClientRect();
  container.style.left = (gRect.right + 12) + 'px';
  container.style.top = gRect.top + 'px';
  container.style.width = '560px';
  container.style.height = '340px';
  chartPositioned = true;
}

function getCompanyValuation() {
  // Valuation = cash + annual revenue × revenue multiple
  // Multiple = base (size) × growth modifier × small random noise
  const annualRev = totalRevPerTick() * 365.25;

  // Base multiple scales with company size
  const baseMult = annualRev > 1e9 ? 15 : annualRev > 1e8 ? 12 : annualRev > 1e7 ? 10 : annualRev > 1e6 ? 8 : 5;

  // Growth rate modifier — very mild, just enough to notice
  let growthMod = 1.0;
  const hist = gameState.valuationHistory;
  if (hist && hist.length >= 10) {
    const oldVal = hist[hist.length - 10].val;
    const currentVal = gameState.cash + annualRev * baseMult;
    if (oldVal > 0) {
      const growthRate = (currentVal - oldVal) / oldVal;
      if (growthRate > 0.5) growthMod = 1.08;
      else if (growthRate > 0.2) growthMod = 1.05;
      else if (growthRate > 0.05) growthMod = 1.02;
      else if (growthRate > -0.05) growthMod = 1.0;
      else if (growthRate > -0.2) growthMod = 0.97;
      else growthMod = 0.95;
    }
  }

  // Market sentiment — fractal noise with volatility clustering
  // Volatility itself is a random walk (calm periods → chaotic bursts)
  if (!gameState._volState) gameState._volState = 0.3;
  gameState._volState += (Math.random() - 0.5) * 0.1;
  gameState._volState = Math.max(0.05, Math.min(1.0, gameState._volState));
  const vol = gameState._volState;

  // Multiple random sources blended at different frequencies
  const fast = (Math.random() - 0.5) * vol * 0.2;
  const slow = (Math.random() < 0.1) ? (Math.random() - 0.5) * vol * 0.5 : 0; // 10% chance of drift shift
  const shock = (Math.random() < 0.02) ? (Math.random() - 0.5) * vol * 1.2 : 0; // 2% chance of big move

  marketSentiment += fast + slow + shock;
  marketSentiment *= 0.985; // gentle mean reversion
  marketSentiment = Math.max(-1, Math.min(1, marketSentiment));
  const noise = 1 + marketSentiment * 0.015; // ±1.5% range

  // Subtract tax debt from valuation (liabilities)
  let taxLiabilities = 0;
  if (gameState.taxDebts) {
    for (const debt of gameState.taxDebts) {
      if (!debt.settled) taxLiabilities += debt.current;
    }
  }

  const revMultiple = baseMult * growthMod * noise;
  let valuation = Math.max(0, gameState.cash + annualRev * revMultiple - taxLiabilities);

  // Phase 2.1: Earnings multiplier (stock reacts to beats/misses)
  if (gameState.isPublic && gameState._earningsMultiplier) {
    valuation *= gameState._earningsMultiplier;
  }

  return valuation;
}

function sampleValuation() {
  const day = Math.floor(gameState.gameElapsedSecs / SECS_PER_DAY);
  const val = getCompanyValuation();
  if (!gameState.valuationHistory) gameState.valuationHistory = [];
  gameState.valuationHistory.push({ day, val });

  // Cap history length
  if (gameState.valuationHistory.length > MAX_VALUATION_POINTS) {
    gameState.valuationHistory = gameState.valuationHistory.slice(-MAX_VALUATION_POINTS);
  }
}

function drawValuationChart() {
  const container = document.getElementById('valuation-chart-container');
  const hist = gameState.valuationHistory;
  if (!hist || hist.length < 1) {
    container.classList.add('hidden');
    return;
  }

  if (!chartPositioned) {
    // Need to show it first so we can position, then set size
    container.style.width = '300px';
    container.style.height = '200px';
    container.classList.remove('hidden');
    positionChartDefault();
  }
  container.classList.remove('hidden');

  const canvas = document.getElementById('valuation-chart');
  const ctx = canvas.getContext('2d');

  // Use explicit container size
  const W = Math.max(100, parseInt(container.style.width) || 300) - 20;
  const H = Math.max(60, parseInt(container.style.height) || 200) - 36;
  canvas.width = W;
  canvas.height = H;

  ctx.clearRect(0, 0, W, H);

  // Chart area (leave room for axes)
  const padL = 65, padR = 10, padT = 5, padB = 20;
  const cW = W - padL - padR;
  const cH = H - padT - padB;

  const vals = hist.map(h => h.val);
  const minVal = Math.min(...vals) * 0.95;
  const maxVal = Math.max(...vals) * 1.05;
  const range = maxVal - minVal || 1;

  // Gridlines (5 horizontal)
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  ctx.font = '9px Calibri, Segoe UI, sans-serif';
  ctx.fillStyle = '#888';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const y = padT + (cH * i / 4);
    const val = maxVal - (range * i / 4);
    ctx.beginPath();
    ctx.moveTo(padL, Math.round(y) + 0.5);
    ctx.lineTo(W - padR, Math.round(y) + 0.5);
    ctx.stroke();
    ctx.fillText(formatCompact(val), padL - 4, y + 3);
  }

  // X axis labels (first and last day)
  ctx.textAlign = 'center';
  ctx.fillStyle = '#888';
  ctx.fillText('Day ' + hist[0].day, padL, H - 2);
  ctx.fillText('Day ' + hist[hist.length - 1].day, W - padR, H - 2);

  // Data line
  ctx.beginPath();
  ctx.strokeStyle = '#4472C4'; // Excel blue
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';

  if (hist.length === 1) {
    // Single point — draw a dot in the center
    const x = padL + cW / 2;
    const y = padT + cH / 2;
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#4472C4';
    ctx.fill();
  } else {
    for (let i = 0; i < hist.length; i++) {
      const x = padL + (i / (hist.length - 1)) * cW;
      const y = padT + cH - ((hist[i].val - minVal) / range) * cH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Fill under line (subtle gradient)
    const lastX = padL + cW;
    const lastY = padT + cH - ((hist[hist.length - 1].val - minVal) / range) * cH;
    ctx.lineTo(lastX, padT + cH);
    ctx.lineTo(padL, padT + cH);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, padT, 0, padT + cH);
    grad.addColorStop(0, 'rgba(68, 114, 196, 0.15)');
    grad.addColorStop(1, 'rgba(68, 114, 196, 0.02)');
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // Current valuation label (top right)
  const current = vals[vals.length - 1];
  ctx.fillStyle = '#217346';
  ctx.font = 'bold 11px Calibri, Segoe UI, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(formatMoney(current), W - padR, padT + 12);
}

function formatCompact(n) {
  const sign = n < 0 ? '-' : '';
  const a = Math.abs(n);
  if (a >= 1e12) return sign + '$' + (a / 1e12).toFixed(1) + 'T';
  if (a >= 1e9) return sign + '$' + (a / 1e9).toFixed(1) + 'B';
  if (a >= 1e6) return sign + '$' + (a / 1e6).toFixed(1) + 'M';
  if (a >= 1e3) return sign + '$' + (a / 1e3).toFixed(1) + 'K';
  return sign + '$' + Math.floor(a);
}

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
window.showHelp = showHelp;
window.dismissHelp = dismissHelp;
window.switchTab = switchTab;

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', () => { if (gridBuilt) buildFillerRows(); });
