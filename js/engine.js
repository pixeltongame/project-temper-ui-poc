'use strict';
/* ============ Battle engine: pure rules + AI. All visuals go through UI hooks. ============ */
let G = null, UI = null, RUN_ID = 0;
function setUI(u) { UI = u; }

const rnd = () => Math.random();
const d = n => 1 + Math.floor(rnd() * n);
const rollDice = (n, s) => Array.from({ length: n }, () => d(s));
const sum = a => a.reduce((x, y) => x + y, 0);
const cheb = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
const foeOf = u => u.team === 'player' ? 'enemy' : 'player';
const alive = team => G.units.filter(u => u.alive && u.team === team);
const blocked = (x, y) => x < 0 || y < 0 || x >= G.cols || y >= G.rows || G.obst.has(x + ',' + y);
const occ = (x, y, ign) => G.units.some(u => u.alive && u !== ign && u.x === x && u.y === y);
const acOf = u => u.ac + u.gear.ac + (u.status.guard > 0 ? 3 : 0);
const hitOf = (u, sk) => u.atk + u.gear.hit + (sk.hitBonus || 0) + (u.status.inspire > 0 ? 2 : 0);
const dmgBonus = u => u.mod + u.gear.dmg + (u.status.inspire > 0 ? 2 : 0);
const avgDice = sk => sk.dice[0] * (sk.dice[1] + 1) / 2;
const lootAt = (x, y) => G.loot.find(l => l.x === x && l.y === y);

function makeUnit(def, team, x, y, id, name) {
  return {
    id, team, key: def.key, name, cls: def.name, emoji: def.emoji, boss: !!def.boss, scale: def.scale || 1, x, y,
    maxHp: def.hp, hp: def.hp, maxMp: def.mp, mp: def.mp, maxSp: def.sp, sp: def.sp,
    ac: def.ac, atk: def.atk, mod: def.mod, move: def.move, init: def.init || 0, skills: def.skills,
    status: { stun: 0, guard: 0, burn: 0, poison: 0, inspire: 0 }, gear: { hit: 0, dmg: 0, ac: 0 }, gearList: [],
    alive: true, stats: { dmg: 0, taken: 0, healed: 0, kills: 0 },
    ranged: Math.max(...def.skills.map(s => s.range || 0)) >= 4
  };
}

function newBattle(camp, keys) {
  const g = {
    camp, cols: camp.cols, rows: camp.rows, obst: new Set(camp.obstacles.map(o => o[0] + ',' + o[1])),
    units: [], loot: [], lootId: 0, round: 0, inv: { hp: 2, mp: 1, sp: 1 }, gold: 0, over: null, order: [], gained: [], timeout: false
  };
  G = g;
  keys.forEach((k, i) => { const c = CLASSES[k], p = camp.playerStart[i]; g.units.push(makeUnit(c, 'player', p[0], p[1], 'p' + i, c.hero)); });
  const list = camp.enemies.concat([camp.boss]);
  const counts = {}; list.forEach(e => counts[e[0]] = (counts[e[0]] || 0) + 1);
  const seen = {};
  list.forEach((e, i) => {
    const def = MONSTERS[e[0]]; seen[e[0]] = (seen[e[0]] || 0) + 1;
    const nm = counts[e[0]] > 1 ? def.name + ' ' + String.fromCharCode(64 + seen[e[0]]) : def.name;
    g.units.push(makeUnit(def, 'enemy', e[1], e[2], 'e' + i, nm));
  });
  return g;
}

/* ---------- pathing ---------- */
function reachable(u, budget) {
  const m = new Map(), s = { x: u.x, y: u.y, steps: 0, prev: null };
  m.set(u.x + ',' + u.y, s);
  const q = [s];
  while (q.length) {
    const n = q.shift(); if (n.steps >= budget) continue;
    for (const [dx, dy] of DIRS) {
      const x = n.x + dx, y = n.y + dy, k = x + ',' + y;
      if (m.has(k) || blocked(x, y) || occ(x, y, u)) continue;
      const nn = { x, y, steps: n.steps + 1, prev: n }; m.set(k, nn); q.push(nn);
    }
  }
  return m;
}
function distMap(gx, gy) {
  const m = new Map(); m.set(gx + ',' + gy, 0); const q = [[gx, gy]];
  while (q.length) {
    const [x, y] = q.shift(), dd = m.get(x + ',' + y);
    for (const [dx, dy] of DIRS) { const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (m.has(k) || blocked(nx, ny)) continue; m.set(k, dd + 1); q.push([nx, ny]); }
  }
  return m;
}

/* ---------- AI scoring ---------- */
function hitChance(u, sk, t) { const need = acOf(t) - hitOf(u, sk); return Math.min(.95, Math.max(.05, (21 - need) / 20)); }
function expDmg(u, sk, t) {
  const p = hitChance(u, sk, t), avg = avgDice(sk) + dmgBonus(u);
  let s = p * Math.min(avg, t.hp);
  if (p * avg >= t.hp * .9) s += 4;
  if (sk.status) s += (sk.status.chance || 1) * (sk.status.type === 'stun' ? 3 : 2) * p;
  s += (1 - t.hp / t.maxHp) * 1.5;
  return s;
}
function evalSkill(u, sk, pos, spLeft) {
  if (sk.res === 'mp' && u.mp < sk.cost) return null;
  if (sk.res === 'sp' && spLeft < sk.cost) return null;
  const foes = alive(foeOf(u)), friends = alive(u.team), pen = sk.cost * .12;
  const P = f => f === u ? pos : f;
  if (sk.kind === 'dmg') {
    let best = null;
    const centers = sk.selfCenter ? [pos] : foes.filter(f => cheb(pos, f) <= sk.range);
    for (const c of centers) {
      const targets = sk.selfCenter ? foes.filter(f => cheb(pos, f) <= sk.radius) : sk.aoe ? foes.filter(f => cheb(c, f) <= sk.aoe) : [c];
      if (!targets.length) continue;
      const s = targets.reduce((a, t) => a + expDmg(u, sk, t), 0) - pen;
      if (!best || s > best.score) best = { score: s, sk, center: sk.selfCenter ? null : c, targets };
    }
    return best;
  }
  if (sk.kind === 'heal') {
    let best = null;
    const centers = sk.selfCenter ? [u] : friends.filter(f => cheb(pos, P(f)) <= sk.range);
    for (const c of centers) {
      const cp = P(c);
      const targets = sk.selfCenter ? friends.filter(f => cheb(pos, P(f)) <= sk.radius) : sk.aoe ? friends.filter(f => cheb(cp, P(f)) <= sk.aoe) : [c];
      let v = 0; const avg = avgDice(sk) + u.mod;
      for (const t of targets) { const r = t.hp / t.maxHp; if (r > .65) continue; v += Math.min(t.maxHp - t.hp, avg) * .9 + (r < .35 ? 6 : 0); }
      if (v <= 0) continue;
      const s = v - pen;
      if (!best || s > best.score) best = { score: s, sk, center: sk.selfCenter ? null : c, targets: targets.filter(t => t.hp / t.maxHp <= .65) };
    }
    return best;
  }
  if (sk.kind === 'buff') {
    const t = sk.buff.type;
    if (t === 'guard') {
      if (u.status.guard > 0) return null;
      const adj = foes.filter(f => cheb(pos, f) <= 1).length;
      if (!adj || u.hp / u.maxHp > .8) return null;
      return { score: 4 + adj - pen, sk, center: null, targets: [u] };
    }
    if (t === 'inspire') {
      const targets = friends.filter(f => cheb(pos, P(f)) <= sk.radius && !(f.status.inspire > 0));
      if (targets.length < 2) return null;
      if (!foes.some(f => cheb(pos, f) <= 8)) return null;
      return { score: 2 + 1.6 * targets.length - pen, sk, center: null, targets };
    }
  }
  return null;
}
function posBonus(u, node) {
  let b = 0;
  const foes = alive(foeOf(u));
  if (u.ranged) b -= 1.6 * foes.filter(f => cheb(node, f) <= 1).length;
  if (u.team === 'player' && lootAt(node.x, node.y)) b += 2;
  return b;
}
function decide(u) {
  if (u.team === 'player') {
    const inv = G.inv, r = u.hp / u.maxHp;
    if (r < .35 && inv.hp > 0) return { type: 'potion', key: 'hp' };
    if (u.maxMp >= 14 && u.mp < 4 && inv.mp > 0) return { type: 'potion', key: 'mp' };
    if (u.maxSp >= 16 && u.sp < 4 && inv.sp > 0) return { type: 'potion', key: 'sp' };
  }
  const budget = Math.min(u.move, u.sp), reach = reachable(u, budget);
  let best = null;
  for (const node of reach.values()) {
    const spLeft = u.sp - node.steps;
    for (const sk of u.skills) {
      const o = evalSkill(u, sk, node, spLeft); if (!o) continue;
      const sc = o.score - node.steps * .15 + posBonus(u, node);
      if (!best || sc > best.score) best = { ...o, score: sc, node, type: 'act' };
    }
  }
  if (best && best.score > .01) return best;
  // nothing to do from reachable tiles -> move toward a goal
  const foes = alive(foeOf(u)); if (!foes.length) return { type: 'idle' };
  let goal = foes.reduce((a, b) => cheb(u, b) < cheb(u, a) ? b : a), why = 'advance';
  if (u.team === 'player') {
    const wounded = alive('player').filter(f => f !== u && f.hp / f.maxHp < .7);
    if (u.skills.some(s => s.kind === 'heal') && wounded.length) { goal = wounded.reduce((a, b) => a.hp / a.maxHp < b.hp / b.maxHp ? a : b); why = 'support'; }
    else if (G.loot.length) {
      const l = G.loot.reduce((a, b) => cheb(u, b) < cheb(u, a) ? b : a);
      if (cheb(u, l) <= cheb(u, goal) + 3) { goal = l; why = 'loot'; }
    }
  }
  const dm = distMap(goal.x, goal.y), cur = dm.get(u.x + ',' + u.y) ?? 99;
  let bn = null, bd = cur;
  for (const n of reach.values()) { const dd = dm.get(n.x + ',' + n.y) ?? 99; if (dd < bd || (dd === bd && bn && n.steps < bn.steps && dd < cur)) { bd = dd; bn = n; } }
  if (bn && bn.steps > 0) return { type: 'move', node: bn, why, goal };
  return { type: 'idle' };
}

/* ---------- loot ---------- */
function randDrop() {
  const r = rnd();
  if (r < .3) { const a = 10 + d(30); return { kind: 'gold', amount: a, name: a + ' Gold', emoji: '💰' }; }
  if (r < .55) return { kind: 'potion', key: 'hp', ...POTIONS.hp };
  if (r < .67) return { kind: 'potion', key: 'mp', ...POTIONS.mp };
  if (r < .77) return { kind: 'potion', key: 'sp', ...POTIONS.sp };
  const g = GEAR_COMMON[d(GEAR_COMMON.length) - 1]; return { kind: 'gear', rarity: 'common', ...g };
}
function genDrops(boss) {
  if (boss) { const g = GEAR_RARE[d(GEAR_RARE.length) - 1]; return [{ kind: 'gear', rarity: 'rare', ...g }, randDrop(), { kind: 'potion', key: 'hp', ...POTIONS.hp }]; }
  return rnd() < .6 ? [randDrop()] : [];
}
function freeTileNear(x, y) {
  const seen = new Set([x + ',' + y]), q = [[x, y]]; let fb = null;
  while (q.length) {
    const [cx, cy] = q.shift();
    if (!blocked(cx, cy) && !lootAt(cx, cy)) { if (!occ(cx, cy)) return { x: cx, y: cy }; fb = fb || { x: cx, y: cy }; }
    for (const [dx, dy] of DIRS) { const nx = cx + dx, ny = cy + dy, k = nx + ',' + ny; if (seen.has(k) || nx < 0 || ny < 0 || nx >= G.cols || ny >= G.rows) continue; seen.add(k); q.push([nx, ny]); }
  }
  return fb || { x, y };
}
async function pickup(u, l) {
  G.loot.splice(G.loot.indexOf(l), 1);
  const it = l.item; G.gained.push(it);
  if (it.kind === 'gold') G.gold += it.amount;
  else if (it.kind === 'potion') G.inv[it.key]++;
  else if (it.kind === 'gear') {
    u.gear.hit += it.hit || 0; u.gear.dmg += it.dmg || 0; u.gear.ac += it.ac || 0;
    if (it.hp) { u.maxHp += it.hp; u.hp += it.hp; }
    u.gearList.push(it);
  }
  UI.log(`${u.name} looted ${it.emoji} ${it.name}${it.kind === 'gear' ? ' (equipped)' : ''}.`, 'loot');
  await UI.pickup(u, l);
}

/* ---------- combat primitives ---------- */
async function kill(t, killer) {
  t.alive = false; t.hp = 0; for (const k in t.status) t.status[k] = 0;
  if (killer && killer.team !== t.team) killer.stats.kills++;
  UI.log(`${t.name} is defeated!`, 'death');
  await UI.die(t);
  if (t.team === 'enemy') {
    for (const item of genDrops(t.boss)) {
      const p = freeTileNear(t.x, t.y), l = { id: ++G.lootId, x: p.x, y: p.y, item };
      G.loot.push(l); await UI.dropLoot(l, t);
    }
  }
  checkEnd();
}
function checkEnd() {
  if (G.over) return;
  if (!alive('player').length) G.over = 'defeat';
  else if (!alive('enemy').some(e => e.boss)) G.over = 'victory';
}
async function applyDamage(t, dmg, o = {}) {
  t.hp = Math.max(0, t.hp - dmg); t.stats.taken += dmg; if (o.from && o.from.team !== t.team) o.from.stats.dmg += dmg;
  UI.refresh(t);
  await UI.hit(t, dmg, !!o.crit, o);
  if (t.hp <= 0) await kill(t, o.from);
}
async function applyHeal(t, amt, from) {
  const real = Math.min(amt, t.maxHp - t.hp); t.hp += real; if (from) from.stats.healed += real;
  UI.refresh(t); await UI.heal(t, real);
}

async function perform(u, p) {
  const sk = p.sk;
  if (sk.res) u[sk.res] -= sk.cost;
  UI.refresh(u);
  const center = (sk.selfCenter || sk.selfOnly || !p.center) ? { x: u.x, y: u.y } : { x: p.center.x, y: p.center.y };
  await UI.announce(u, sk, center);
  const targets = p.targets.filter(t => t.alive);
  if (!targets.length) return;

  if (sk.kind === 'buff') {
    UI.log(`${u.name} uses ${sk.name}.`, 'buff');
    await UI.castFx(u, sk, center, targets, {});
    for (const t of targets) { t.status[sk.buff.type] = Math.max(t.status[sk.buff.type], sk.buff.turns); UI.refresh(t); UI.statusFx && await UI.statusFx(t, sk.buff.type); }
    return;
  }
  if (sk.kind === 'heal') {
    UI.log(`${u.name} casts ${sk.name}.`, 'heal');
    await UI.castFx(u, sk, center, targets, {});
    for (let i = 0; i < targets.length; i++) {
      const t = targets[i], dice = rollDice(sk.dice[0], sk.dice[1]), total = sum(dice) + u.mod;
      await UI.rollDamage({ u, t, sk, dice, bonus: u.mod, total, heal: true, quick: i > 0 });
      await applyHeal(t, total, u);
    }
    return;
  }
  // damage
  const multi = targets.length > 1;
  if (multi) { UI.log(`${u.name} unleashes ${sk.name}!`, 'info'); await UI.castFx(u, sk, center, targets, { hit: true }); }
  for (let i = 0; i < targets.length; i++) {
    const t = targets[i]; if (!t.alive) continue;
    const roll = d(20), nat1 = roll === 1, crit = roll >= (sk.critRange || 20);
    const bonus = hitOf(u, sk), total = roll + bonus, ac = acOf(t);
    const hit = !nat1 && (crit || total >= ac);
    await UI.rollAttack({ u, t, sk, roll, bonus, total, ac, hit, crit, nat1, quick: multi && i > 0 });
    if (!multi) await UI.castFx(u, sk, center, [t], { hit });
    if (!hit) {
      UI.log(`${u.name}'s ${sk.name} ${nat1 ? 'fumbles' : 'misses'} ${t.name} (${roll}+${bonus}=${total} vs AC ${ac}).`, 'miss');
      await UI.miss(t, u, sk, nat1); continue;
    }
    let dice = rollDice(sk.dice[0], sk.dice[1]); if (crit) dice = dice.concat(rollDice(sk.dice[0], sk.dice[1]));
    const db = dmgBonus(u), dmg = Math.max(1, sum(dice) + db);
    await UI.rollDamage({ u, t, sk, dice, bonus: db, total: dmg, crit, quick: multi && i > 0 });
    UI.log(`${u.name} ${crit ? 'CRITS' : 'hits'} ${t.name} with ${sk.name} for ${dmg} damage.`, crit ? 'crit' : 'hit');
    await applyDamage(t, dmg, { from: u, crit, sk });
    if (sk.drain && u.alive) { const h = Math.floor(dmg / 2); if (h) await applyHeal(u, h, u); }
    if (t.alive && sk.status && rnd() < (sk.status.chance || 1)) {
      const st = sk.status;
      if (st.type === 'stun' && t.boss) { UI.log(`${t.name} resists the stun!`, 'info'); }
      else { t.status[st.type] = Math.max(t.status[st.type], st.turns); UI.log(`${t.name} is ${st.type === 'stun' ? 'stunned' : st.type === 'burn' ? 'burning' : 'poisoned'}!`, 'status'); UI.refresh(t); await UI.statusFx(t, st.type); }
    }
    if (G.over) break;
  }
}

async function moveAlong(u, node) {
  const path = []; for (let n = node; n.prev; n = n.prev) path.unshift(n);
  for (const n of path) {
    const from = { x: u.x, y: u.y }; u.x = n.x; u.y = n.y; u.sp -= 1; UI.refresh(u);
    await UI.moveUnit(u, from, n);
    if (u.team === 'player') { const l = lootAt(u.x, u.y); if (l) await pickup(u, l); }
  }
}

async function usePotion(u, key) {
  G.inv[key]--; const P = POTIONS[key];
  UI.log(`${u.name} drinks a ${P.name}.`, 'heal');
  await UI.announce(u, { name: P.name, ic: P.emoji }, u);
  if (key === 'hp') { const dice = rollDice(2, 6), total = sum(dice) + 4; await UI.rollDamage({ u, t: u, sk: { name: P.name, dice: [2, 6] }, dice, bonus: 4, total, heal: true }); await applyHeal(u, total, u); }
  else { const k = key; u[k] = Math.min(u['max' + k[0].toUpperCase() + k[1]], u[k] + 10); UI.refresh(u); await UI.heal(u, 0, key); }
}

async function takeTurn(u) {
  await UI.turnStart(u);
  u.mp = Math.min(u.maxMp, u.mp + 3); u.sp = Math.min(u.maxSp, u.sp + 5); UI.refresh(u);
  for (const t of ['burn', 'poison']) if (u.status[t] > 0) {
    u.status[t]--; const dmg = t === 'burn' ? 4 : 3;
    UI.log(`${u.name} suffers ${dmg} ${t} damage.`, 'status');
    await applyDamage(u, dmg, { src: t, dot: t });
    if (!u.alive) { await UI.turnEnd(u); return; }
  }
  if (u.status.guard > 0) u.status.guard--;
  if (u.status.inspire > 0) u.status.inspire--;
  UI.refresh(u);
  if (u.status.stun > 0) { u.status.stun--; UI.refresh(u); UI.log(`${u.name} is stunned and loses the turn.`, 'status'); await UI.skip(u); await UI.turnEnd(u); return; }
  if (!G.over) {
    const plan = decide(u);
    if (plan.type === 'potion') await usePotion(u, plan.key);
    else if (plan.type === 'act') {
      if (plan.node.steps > 0) await moveAlong(u, plan.node);
      if (u.alive && !G.over) await perform(u, plan);
    } else if (plan.type === 'move') {
      UI.log(`${u.name} ${plan.why === 'loot' ? 'heads for loot' : plan.why === 'support' ? 'moves to support allies' : 'advances'}.`, 'info');
      await moveAlong(u, plan.node);
    } else { UI.log(`${u.name} holds position.`, 'info'); await UI.skip(u, 'hold'); }
  }
  await UI.turnEnd(u);
}

async function runBattle(camp, keys) {
  RUN_ID++;
  const g = newBattle(camp, keys);
  try {
    await UI.battleStart(g);
    for (const u of g.units) u.initRoll = d(20) + u.init;
    UI.log('Initiative rolled!', 'info');
    await UI.initiative(g);
    while (!g.over && g.round < 40) {
      g.round++; g.order = g.units.filter(u => u.alive).sort((a, b) => b.initRoll - a.initRoll || b.init - a.init);
      await UI.roundStart(g.round);
      for (const u of g.order) { if (g.over) break; if (!u.alive) continue; await takeTurn(u); }
    }
    if (!g.over) { g.over = 'defeat'; g.timeout = true; }
    if (g.over === 'victory') {
      UI.log('The boss has fallen! The party gathers the spoils.', 'info');
      for (const l of [...g.loot]) {
        const ps = alive('player'); if (!ps.length) break;
        const n = ps.reduce((a, b) => cheb(a, l) < cheb(b, l) ? a : b);
        await pickup(n, l);
      }
    }
    await UI.battleEnd(g);
  } catch (e) { if (e.message !== 'abort') throw e; }
  return g;
}
