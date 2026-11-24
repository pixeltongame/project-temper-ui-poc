'use strict';
/* ============ Game data: classes, monsters, items, campaigns ============ */
const C = { blue: '#306FC7', yellow: '#F6C24A', green: '#43938F', red: '#DA3832' };

/* Skill fields: kind(dmg|heal|buff) res(mp|sp|null) cost range dice[n,sides] fx
   aoe (radius around target) selfCenter+radius (around caster) selfOnly status{type,turns,chance} buff{type,turns}
   hitBonus critRange drain */
const CLASSES = {
  knight: { key: 'knight', hero: 'Aldric', name: 'Knight', role: 'Tank', emoji: '🛡️',
    hp: 52, mp: 6, sp: 18, ac: 16, atk: 5, mod: 3, move: 3, init: 1,
    desc: 'Armored front-liner. Soaks damage and stuns foes with shield bashes.',
    skills: [
      { id: 'sword', name: 'Longsword', ic: '⚔️', range: 1, dice: [1, 8], fx: 'slash' },
      { id: 'bash', name: 'Shield Bash', ic: '🛡️', res: 'sp', cost: 4, range: 1, dice: [1, 6], fx: 'bash', status: { type: 'stun', turns: 1, chance: .6 } },
      { id: 'guard', name: 'Guard Stance', ic: '🧱', kind: 'buff', res: 'sp', cost: 3, selfOnly: true, buff: { type: 'guard', turns: 2 }, fx: 'buff' } ] },
  mage: { key: 'mage', hero: 'Elara', name: 'Mage', role: 'Burst Caster', emoji: '🧙',
    hp: 28, mp: 26, sp: 10, ac: 11, atk: 5, mod: 3, move: 3, init: 2,
    desc: 'Glass cannon. Fireballs melt groups, frost bolts hit hard.',
    skills: [
      { id: 'arcane', name: 'Arcane Bolt', ic: '✨', range: 5, dice: [1, 6], fx: 'arcane' },
      { id: 'frost', name: 'Frost Bolt', ic: '❄️', res: 'mp', cost: 4, range: 5, dice: [2, 6], fx: 'ice' },
      { id: 'fireball', name: 'Fireball', ic: '🔥', res: 'mp', cost: 8, range: 5, aoe: 1, dice: [3, 6], fx: 'fire', status: { type: 'burn', turns: 3, chance: .7 } } ] },
  rogue: { key: 'rogue', hero: 'Vex', name: 'Rogue', role: 'Assassin', emoji: '🗡️',
    hp: 32, mp: 4, sp: 22, ac: 14, atk: 7, mod: 4, move: 5, init: 4,
    desc: 'Fast striker with huge crit range and poison blades.',
    skills: [
      { id: 'dagger', name: 'Dagger', ic: '🗡️', range: 1, dice: [1, 6], fx: 'slash' },
      { id: 'backstab', name: 'Backstab', ic: '🩸', res: 'sp', cost: 5, range: 1, dice: [2, 6], fx: 'slash', critRange: 18 },
      { id: 'poison', name: 'Poison Blade', ic: '☠️', res: 'sp', cost: 4, range: 1, dice: [1, 4], fx: 'poison', status: { type: 'poison', turns: 3, chance: 1 } } ] },
  cleric: { key: 'cleric', hero: 'Mira', name: 'Cleric', role: 'Healer', emoji: '✝️',
    hp: 38, mp: 22, sp: 10, ac: 14, atk: 4, mod: 2, move: 3, init: 0,
    desc: 'Keeps the party alive with heals and smites the wicked.',
    skills: [
      { id: 'mace', name: 'Mace', ic: '🔨', range: 1, dice: [1, 6], fx: 'bash' },
      { id: 'smite', name: 'Holy Smite', ic: '☀️', res: 'mp', cost: 5, range: 4, dice: [2, 6], fx: 'holy' },
      { id: 'heal', name: 'Healing Word', ic: '💚', kind: 'heal', res: 'mp', cost: 5, range: 4, dice: [2, 6], fx: 'heal' },
      { id: 'mheal', name: 'Mass Heal', ic: '🌿', kind: 'heal', res: 'mp', cost: 10, range: 4, aoe: 2, dice: [1, 8], fx: 'heal' } ] },
  ranger: { key: 'ranger', hero: 'Fenn', name: 'Ranger', role: 'Archer', emoji: '🏹',
    hp: 34, mp: 8, sp: 20, ac: 13, atk: 6, mod: 3, move: 4, init: 3,
    desc: 'Long range damage dealer. Kites enemies and rains arrows.',
    skills: [
      { id: 'bow', name: 'Shortbow', ic: '🏹', range: 6, dice: [1, 8], fx: 'arrow' },
      { id: 'power', name: 'Power Shot', ic: '🎯', res: 'sp', cost: 5, range: 7, dice: [2, 8], fx: 'arrow', hitBonus: 2 },
      { id: 'volley', name: 'Arrow Volley', ic: '🌧️', res: 'sp', cost: 8, range: 6, aoe: 1, dice: [1, 8], fx: 'arrow' } ] },
  barbarian: { key: 'barbarian', hero: 'Brug', name: 'Barbarian', role: 'Bruiser', emoji: '🪓',
    hp: 62, mp: 0, sp: 22, ac: 13, atk: 5, mod: 4, move: 4, init: 1,
    desc: 'Huge health pool, huge axe. Whirlwind hits everyone around.',
    skills: [
      { id: 'axe', name: 'Greataxe', ic: '🪓', range: 1, dice: [1, 12], fx: 'slash' },
      { id: 'reckless', name: 'Reckless Strike', ic: '💢', res: 'sp', cost: 5, range: 1, dice: [2, 8], fx: 'bash' },
      { id: 'whirl', name: 'Whirlwind', ic: '🌀', res: 'sp', cost: 8, selfCenter: true, radius: 1, range: 0, dice: [1, 10], fx: 'whirl' } ] },
  paladin: { key: 'paladin', hero: 'Seraph', name: 'Paladin', role: 'Holy Knight', emoji: '⚜️',
    hp: 46, mp: 14, sp: 14, ac: 16, atk: 5, mod: 3, move: 3, init: 0,
    desc: 'Tough melee fighter who can smite and heal allies.',
    skills: [
      { id: 'hammer', name: 'Warhammer', ic: '🔨', range: 1, dice: [1, 8], fx: 'bash' },
      { id: 'dsmite', name: 'Divine Smite', ic: '⚡', res: 'mp', cost: 4, range: 1, dice: [2, 8], fx: 'holy' },
      { id: 'loh', name: 'Lay on Hands', ic: '🤲', kind: 'heal', res: 'mp', cost: 5, range: 1, dice: [2, 8], fx: 'heal' } ] },
  bard: { key: 'bard', hero: 'Lyric', name: 'Bard', role: 'Support', emoji: '🎻',
    hp: 30, mp: 24, sp: 10, ac: 13, atk: 5, mod: 3, move: 4, init: 3,
    desc: 'Inspires allies (+2 hit & dmg) and mends wounds with song.',
    skills: [
      { id: 'note', name: 'Sharp Note', ic: '🎵', range: 4, dice: [1, 6], fx: 'music' },
      { id: 'inspire', name: 'Inspire', ic: '🎺', kind: 'buff', res: 'mp', cost: 5, selfCenter: true, radius: 3, range: 0, buff: { type: 'inspire', turns: 3 }, fx: 'buff' },
      { id: 'song', name: 'Soothing Song', ic: '🎶', kind: 'heal', res: 'mp', cost: 6, selfCenter: true, radius: 3, range: 0, dice: [1, 6], fx: 'heal' } ] }
};

const MONSTERS = {
  goblin: { key: 'goblin', name: 'Goblin', emoji: '👺', hp: 14, mp: 0, sp: 12, ac: 12, atk: 3, mod: 1, move: 4, init: 2, scale: .85,
    skills: [{ id: 'blade', name: 'Rusty Blade', range: 1, dice: [1, 6], fx: 'slash' }] },
  goblin_archer: { key: 'goblin_archer', name: 'Goblin Archer', emoji: '🏹', hp: 12, mp: 0, sp: 12, ac: 12, atk: 4, mod: 1, move: 4, init: 3, scale: .85,
    skills: [{ id: 'sbow', name: 'Crude Bow', range: 5, dice: [1, 6], fx: 'arrow' }] },
  wolf: { key: 'wolf', name: 'Wolf', emoji: '🐺', hp: 18, mp: 0, sp: 14, ac: 13, atk: 4, mod: 2, move: 6, init: 4, scale: .95,
    skills: [{ id: 'bite', name: 'Bite', range: 1, dice: [1, 6], fx: 'slash' }] },
  skeleton: { key: 'skeleton', name: 'Skeleton', emoji: '💀', hp: 20, mp: 0, sp: 12, ac: 12, atk: 3, mod: 2, move: 3, init: 1,
    skills: [{ id: 'bone', name: 'Bone Blade', range: 1, dice: [1, 8], fx: 'slash' }] },
  zombie: { key: 'zombie', name: 'Zombie', emoji: '🧟', hp: 26, mp: 0, sp: 10, ac: 9, atk: 3, mod: 2, move: 2, init: -1,
    skills: [{ id: 'slam', name: 'Rotten Slam', range: 1, dice: [1, 8], fx: 'bash' }] },
  slime: { key: 'slime', name: 'Acid Slime', emoji: '🟢', hp: 24, mp: 0, sp: 10, ac: 8, atk: 2, mod: 1, move: 2, init: 0, scale: .9,
    skills: [{ id: 'acid', name: 'Acid Touch', range: 1, dice: [1, 6], fx: 'poison', status: { type: 'poison', turns: 2, chance: .4 } }] },
  imp: { key: 'imp', name: 'Fire Imp', emoji: '😈', hp: 14, mp: 10, sp: 10, ac: 13, atk: 4, mod: 2, move: 4, init: 3, scale: .85,
    skills: [{ id: 'claw', name: 'Claw', range: 1, dice: [1, 4], fx: 'slash' },
      { id: 'fbolt', name: 'Firebolt', res: 'mp', cost: 3, range: 5, dice: [2, 4], fx: 'fire', status: { type: 'burn', turns: 2, chance: .5 } }] },
  orc: { key: 'orc', name: 'Orc', emoji: '👹', hp: 30, mp: 0, sp: 16, ac: 12, atk: 5, mod: 2, move: 4, init: 0, scale: 1.1,
    skills: [{ id: 'oaxe', name: 'Battle Axe', range: 1, dice: [1, 10], fx: 'slash' },
      { id: 'savage', name: 'Savage Swing', res: 'sp', cost: 5, range: 1, dice: [2, 6], fx: 'bash' }] },
  goblin_king: { key: 'goblin_king', name: 'Goblin King', emoji: '👑', boss: true, hp: 80, mp: 0, sp: 30, ac: 14, atk: 6, mod: 3, move: 3, init: 2, scale: 1.3,
    skills: [{ id: 'kmace', name: 'Spiked Mace', range: 1, dice: [1, 10], fx: 'bash' },
      { id: 'stomp', name: 'War Stomp', res: 'sp', cost: 6, selfCenter: true, radius: 1, range: 0, dice: [2, 6], fx: 'stomp', status: { type: 'stun', turns: 1, chance: .5 } },
      { id: 'rally', name: 'Rally Cry', kind: 'buff', res: 'sp', cost: 5, selfCenter: true, radius: 4, range: 0, buff: { type: 'inspire', turns: 3 }, fx: 'buff' }] },
  lich: { key: 'lich', name: 'Lich Lord', emoji: '☠️', boss: true, hp: 70, mp: 30, sp: 10, ac: 14, atk: 6, mod: 3, move: 3, init: 2, scale: 1.3,
    skills: [{ id: 'touch', name: 'Grave Touch', range: 1, dice: [1, 8], fx: 'shadow' },
      { id: 'sbolt', name: 'Shadow Bolt', res: 'mp', cost: 4, range: 6, dice: [2, 8], fx: 'shadow' },
      { id: 'nova', name: 'Death Nova', res: 'mp', cost: 10, selfCenter: true, radius: 2, range: 0, dice: [2, 6], fx: 'nova' },
      { id: 'drain', name: 'Drain Life', res: 'mp', cost: 6, range: 4, dice: [2, 6], fx: 'shadow', drain: true }] },
  dragon: { key: 'dragon', name: 'Ember Dragon', emoji: '🐉', boss: true, hp: 75, mp: 30, sp: 30, ac: 14, atk: 6, mod: 3, move: 4, init: 1, scale: 1.45,
    skills: [{ id: 'dbite', name: 'Bite', range: 1, dice: [2, 6], fx: 'slash' },
      { id: 'breath', name: 'Fire Breath', res: 'mp', cost: 10, range: 5, aoe: 1, dice: [3, 6], fx: 'breath', status: { type: 'burn', turns: 3, chance: .8 } },
      { id: 'tail', name: 'Tail Sweep', res: 'sp', cost: 6, selfCenter: true, radius: 1, range: 0, dice: [2, 8], fx: 'whirl', status: { type: 'stun', turns: 1, chance: .3 } }] }
};

// normalize skills
[CLASSES, MONSTERS].forEach(tbl => Object.values(tbl).forEach(d => d.skills.forEach(s => {
  s.kind = s.kind || 'dmg'; s.cost = s.cost || 0; s.res = s.res || null; if (s.range == null) s.range = 1;
})));

const POTIONS = {
  hp: { name: 'Healing Potion', emoji: '🧪', desc: 'Restores 2d6+4 HP' },
  mp: { name: 'Mana Potion', emoji: '🔷', desc: 'Restores 10 MP' },
  sp: { name: 'Stamina Tonic', emoji: '⚡', desc: 'Restores 10 SP' }
};
const GEAR_COMMON = [
  { name: 'Sharp Edge', emoji: '🗡️', hit: 1, dmg: 1 }, { name: 'Chain Vest', emoji: '🥋', ac: 1 },
  { name: 'Vitality Charm', emoji: '📿', hp: 6 }, { name: 'Lucky Ring', emoji: '💍', hit: 1 },
  { name: 'Iron Buckler', emoji: '🔰', ac: 1 }, { name: 'Whetstone', emoji: '🪨', dmg: 1 }];
const GEAR_RARE = [
  { name: 'Dragonfang Blade', emoji: '⚔️', hit: 1, dmg: 3 }, { name: 'Mythril Mail', emoji: '🦺', ac: 2, hp: 8 },
  { name: 'Archmage Orb', emoji: '🔮', hit: 2, dmg: 2 }, { name: 'Crown of Valor', emoji: '👑', ac: 1, hit: 1, dmg: 1, hp: 10 }];

const CAMPAIGNS = [
  { id: 'goblin', name: 'Goblin Camp', icon: '🏕️', difficulty: 1, cols: 12, rows: 8,
    desc: 'A goblin raiding party is camped by the old road. Cut through the rabble and topple their king.',
    theme: { a: '#2c4a3e', b: '#2a4438', line: 'rgba(255,255,255,.07)' },
    playerStart: [[1, 2], [1, 3], [1, 4], [1, 5]],
    obstacles: [[4, 1, '🌲'], [4, 2, '🌲'], [5, 6, '🌲'], [5, 5, '🪨'], [6, 3, '🌳'], [7, 0, '🌲'], [7, 7, '🌲'], [9, 4, '⛺'], [3, 7, '🪨'], [3, 0, '🌲']],
    enemies: [['goblin', 8, 2], ['goblin', 8, 5], ['goblin', 9, 3], ['goblin_archer', 10, 1], ['goblin_archer', 10, 6], ['wolf', 7, 4]],
    boss: ['goblin_king', 10, 4] },
  { id: 'crypt', name: 'Crypt of the Forgotten', icon: '⚰️', difficulty: 2, cols: 12, rows: 8,
    desc: 'The dead do not rest here. A Lich Lord commands skeletons, zombies and cursed imps.',
    theme: { a: '#2b2f4d', b: '#262a45', line: 'rgba(255,255,255,.06)' },
    playerStart: [[1, 2], [1, 3], [1, 4], [1, 5]],
    obstacles: [[4, 2, '⚰️'], [4, 5, '⚰️'], [6, 0, '🪦'], [6, 7, '🪦'], [6, 3, '🕯️'], [6, 4, '🕯️'], [9, 2, '⚰️'], [9, 5, '⚰️'], [3, 0, '🪦'], [3, 7, '🪦']],
    enemies: [['skeleton', 7, 2], ['skeleton', 7, 5], ['zombie', 8, 4], ['zombie', 9, 1], ['imp', 9, 6]],
    boss: ['lich', 10, 4] },
  { id: 'dragon', name: "Dragon's Peak", icon: '🌋', difficulty: 3, cols: 12, rows: 8,
    desc: 'Orc warbands, hellspawn and wolves guard the lair of the Ember Dragon. Bring your best.',
    theme: { a: '#4a2f33', b: '#432b30', line: 'rgba(255,255,255,.06)' },
    playerStart: [[1, 2], [1, 3], [1, 4], [1, 5]],
    obstacles: [[4, 1, '🪨'], [4, 6, '🪨'], [5, 3, '🌋'], [5, 4, '🌋'], [8, 0, '🪨'], [8, 7, '🪨'], [3, 4, '🪨'], [10, 2, '🔥'], [10, 5, '🔥']],
    enemies: [['orc', 7, 2], ['orc', 7, 5], ['wolf', 8, 3], ['imp', 9, 6]],
    boss: ['dragon', 10, 4] }
];
