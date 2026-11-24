'use strict';
/* ============ UI layer: board, animations, dice, FX. Implements the hooks used by engine.js ============ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
const UIX = { speed: 1, paused: false, view: 'model', sound: true, board: null, fx: null, units: {}, loots: {}, cards: {}, rows: {} };
const T = ms => ms / UIX.speed;
const ST_ICON = { stun: '💫', burn: '🔥', poison: '☠️', guard: '🛡️', inspire: '✨' };
const rr = (a, b) => a + Math.random() * (b - a);

/* ---- timing helpers (abort-aware, pause-aware) ---- */
async function wait(ms) {
  const id = RUN_ID;
  await new Promise(r => setTimeout(r, T(ms)));
  while (UIX.paused && id === RUN_ID) await new Promise(r => setTimeout(r, 80));
  if (id !== RUN_ID) throw new Error('abort');
}
async function anim(e, kf, ms, opt = {}) {
  const id = RUN_ID; let a;
  try { a = e.animate(kf, { duration: T(ms), easing: 'ease-out', ...opt }); await a.finished; } catch (_) { }
  if (id !== RUN_ID) throw new Error('abort');
}

/* ---- sound (tiny WebAudio blips) ---- */
let _ac = null;
function tone(f, d = .1, type = 'sine', v = .05, slide = 0) {
  if (!UIX.sound) return;
  try {
    _ac = _ac || new (window.AudioContext || window.webkitAudioContext)();
    const o = _ac.createOscillator(), g = _ac.createGain(), t = _ac.currentTime;
    o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, f + slide), t + d);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g); g.connect(_ac.destination); o.start(t); o.stop(t + d);
  } catch (e) { }
}
const SFX = {
  tick: () => tone(500 + Math.random() * 500, .04, 'square', .015),
  hit: () => tone(180, .16, 'sawtooth', .06, -100),
  crit: () => { tone(240, .22, 'sawtooth', .07, -140); setTimeout(() => tone(700, .25, 'triangle', .05), 60); },
  miss: () => tone(320, .16, 'sine', .035, -180),
  heal: () => { tone(520, .15, 'sine', .05, 200); setTimeout(() => tone(800, .2, 'sine', .05), 120); },
  cast: () => tone(380, .28, 'triangle', .04, 320),
  loot: () => { tone(880, .1, 'square', .035); setTimeout(() => tone(1320, .14, 'square', .035), 90); },
  die: () => tone(220, .5, 'sawtooth', .05, -170),
  win: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, .25, 'triangle', .06), i * 140)),
  lose: () => [330, 262, 196].forEach((f, i) => setTimeout(() => tone(f, .35, 'sawtooth', .05), i * 200))
};

/* ---- geometry ---- */
const cellPx = () => UIX.board.clientWidth / G.cols;
const P = (x, y) => { const c = cellPx(); return { x: (x + .5) * c, y: (y + .5) * c }; };
const PU = u => P(u.x, u.y);

/* ---- sprites ---- */
function spriteHTML(u) {
  return UIX.view === 'chip'
    ? `<div class="chip"><span>${u.emoji}</span></div>`
    : `<div class="model">${modelSVG(u.key)}<i class="sh"></i></div>`;
}
function createUnitEl(u, i) {
  const e = el('div', `unit ${u.team}${u.boss ? ' boss' : ''}`);
  e.id = 'u-' + u.id; e.title = `${u.name} (${u.cls})`;
  e.style.setProperty('--x', u.x); e.style.setProperty('--y', u.y); e.style.setProperty('--sc', u.scale); e.style.setProperty('--dl', (i * .37) % 2);
  e.style.zIndex = 10 + u.y;
  e.innerHTML = `<div class="stat"><div class="ico"></div><div class="bars"><b class="hp"><i></i></b><b class="mp"><i></i></b><b class="sp"><i></i></b></div></div><div class="spr"><div class="flip">${spriteHTML(u)}</div></div>`;
  if (!u.maxMp) $('.mp', e).style.display = 'none';
  UIX.board.append(e); UIX.units[u.id] = e; return e;
}
function setView(v) {
  UIX.view = v;
  $$('#viewSeg button').forEach(b => b.classList.toggle('on', b.dataset.view === v));
  if (!G || !UIX.board || $('#screen-battle').classList.contains('hidden')) return;
  G.units.forEach(u => { const e = UIX.units[u.id]; if (e) $('.flip', e).innerHTML = spriteHTML(u); const c = UIX.cards[u.id]; if (c) $('.av', c).innerHTML = avatarHTML(u); });
}
const avatarHTML = u => UIX.view === 'chip' ? `<span style="font-size:26px;align-self:center">${u.emoji}</span>` : modelSVG(u.key);

/* ---- panel rendering ---- */
function setBar(b, cur, max, label) { b.firstElementChild.style.width = (max ? Math.max(0, cur / max * 100) : 0) + '%'; if (label) { const s = $('span', b); if (s) s.textContent = `${cur}/${max}`; } }
function barRow(cls, extra) { return `<div class="bar ${cls} ${extra || ''}"><i></i><span></span></div>`; }
function buildCards(g) {
  const box = $('#partyCards'); box.innerHTML = ''; UIX.cards = {};
  g.units.filter(u => u.team === 'player').forEach(u => {
    const c = el('div', 'card');
    c.innerHTML = `<div class="av">${avatarHTML(u)}</div><div><div class="nm"><span>${u.name}</span><small>${u.cls}</small></div>${barRow('hp')}${u.maxMp ? barRow('mp') : ''}${barRow('sp')}<div class="ic"></div></div>`;
    box.append(c); UIX.cards[u.id] = c;
  });
  const lst = $('#enemyList'); lst.innerHTML = ''; UIX.rows = {};
  g.units.filter(u => u.team === 'enemy').forEach(u => {
    const r = el('div', 'erow' + (u.boss ? ' boss' : ''));
    r.innerHTML = `<span>${u.emoji}</span><b>${u.name}</b>${barRow('hp', 'e')}`;
    lst.append(r); UIX.rows[u.id] = r;
  });
}
function renderInv() {
  if (!G) return;
  $('#invBox').innerHTML = `<span class="invi">💰 ${G.gold}</span>` + Object.keys(POTIONS).map(k => `<span class="invi" title="${POTIONS[k].desc}">${POTIONS[k].emoji} ${G.inv[k]}</span>`).join('');
}
function refreshUnit(u) {
  const e = UIX.units[u.id]; if (!e) return;
  setBar($('.hp', e), u.hp, u.maxHp); setBar($('.mp', e), u.mp, u.maxMp); setBar($('.sp', e), u.sp, u.maxSp);
  $('.ico', e).textContent = Object.keys(u.status).filter(k => u.status[k] > 0).map(k => ST_ICON[k]).join('');
  const c = UIX.cards[u.id];
  if (c) {
    const bars = $$('.bar', c); setBar(bars[0], u.hp, u.maxHp, 1); let i = 1;
    if (u.maxMp) setBar(bars[i++], u.mp, u.maxMp, 1); setBar(bars[i], u.sp, u.maxSp, 1);
    $('.ic', c).textContent = Object.keys(u.status).filter(k => u.status[k] > 0).map(k => ST_ICON[k]).join(' ') + (u.gearList.length ? '  ' : '') + u.gearList.map(g => g.emoji).join('');
    c.classList.toggle('dead', !u.alive);
  }
  const r = UIX.rows[u.id]; if (r) { setBar($('.bar', r), u.hp, u.maxHp, 1); r.classList.toggle('dead', !u.alive); }
  renderInv();
}
function updateOrder(list) {
  const bar = $('#orderBar'); bar.innerHTML = '';
  list.forEach(u => { const o = el('div', `ord ${u.team}${u.boss ? ' boss' : ''}${u.alive ? '' : ' dead'}`, u.emoji); o.id = 'ord-' + u.id; o.title = u.name + ' (init ' + u.initRoll + ')'; bar.append(o); });
}
function logLine(msg, cls) {
  const l = $('#log'); if (!l) return; const d = el('div', cls || '', msg); l.append(d); l.scrollTop = l.scrollHeight;
  if (l.children.length > 200) l.firstChild.remove();
}

/* ---- FX primitives ---- */
function fxAdd(e) { UIX.fx.append(e); return e; }
function floatText(p, text, color, big) {
  const e = fxAdd(el('div', 'float' + (big ? ' big' : ''), text)); e.style.left = p.x + 'px'; e.style.top = p.y + 'px'; e.style.color = color;
  anim(e, [{ transform: 'translate(-50%,-50%) scale(.5)', opacity: 0 }, { transform: 'translate(-50%,-90%) scale(1.25)', opacity: 1, offset: .2 }, { transform: 'translate(-50%,-230%) scale(1)', opacity: 0 }], 1100, { easing: 'ease-out' }).then(() => e.remove(), () => e.remove());
}
function callout(p, text) {
  const e = fxAdd(el('div', 'callout', text)); e.style.left = p.x + 'px'; e.style.top = (p.y - cellPx() * .45) + 'px';
  anim(e, [{ opacity: 0, transform: 'translate(-50%,-70%) scale(.7)' }, { opacity: 1, transform: 'translate(-50%,-100%) scale(1)', offset: .2 }, { opacity: 1, offset: .8 }, { opacity: 0 }], 1000, { easing: 'ease-out' }).then(() => e.remove(), () => e.remove());
}
function burst(p, o = {}) {
  const n = o.n || 8, c = cellPx(), r = (o.r || 1) * c, ps = [];
  for (let i = 0; i < n; i++) {
    const e = fxAdd(el('div', 'ptc', o.emoji || '✨')); e.style.left = p.x + 'px'; e.style.top = p.y + 'px'; if (o.size) e.style.fontSize = o.size * c + 'px';
    const a = rr(0, Math.PI * 2), dd = rr(.35, 1) * r, rise = o.rise ? -rr(.6, 1.1) * c : 0;
    ps.push(anim(e, [{ transform: 'translate(-50%,-50%) scale(.4)', opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * dd}px),calc(-50% + ${Math.sin(a) * dd + rise}px)) scale(1.1)`, opacity: 1, offset: .6 }, { transform: `translate(calc(-50% + ${Math.cos(a) * dd * 1.2}px),calc(-50% + ${Math.sin(a) * dd * 1.2 + rise}px)) scale(.6)`, opacity: 0 }], o.dur || 700, { easing: 'ease-out', delay: T(rr(0, 120)) }).then(() => e.remove(), () => e.remove()));
  }
  return Promise.all(ps);
}
function ring(p, rpx, color, ms = 600, fill = .18) {
  const e = fxAdd(el('div', 'glow')); Object.assign(e.style, { left: p.x + 'px', top: p.y + 'px', width: rpx * 2 + 'px', height: rpx * 2 + 'px', border: `4px solid ${color}`, background: `radial-gradient(circle,${color}${Math.round(fill * 255).toString(16).padStart(2, '0')},transparent 70%)`, boxShadow: `0 0 18px ${color}` });
  return anim(e, [{ transform: 'translate(-50%,-50%) scale(.1)', opacity: 1 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: .9, offset: .7 }, { transform: 'translate(-50%,-50%) scale(1.08)', opacity: 0 }], ms).then(() => e.remove(), () => e.remove());
}
function beam(p, color, ms = 500) {
  const e = fxAdd(el('div', 'glow')), w = cellPx() * .55;
  Object.assign(e.style, { left: p.x + 'px', top: '0', width: w + 'px', height: p.y + 'px', borderRadius: '8px', background: `linear-gradient(180deg,transparent,${color} 70%,#fff)`, boxShadow: `0 0 24px ${color}`, transformOrigin: '50% 0' });
  return anim(e, [{ transform: 'translateX(-50%) scaleY(0)', opacity: 1 }, { transform: 'translateX(-50%) scaleY(1)', opacity: 1, offset: .35 }, { transform: 'translateX(-50%) scaleY(1)', opacity: 0 }], ms).then(() => e.remove(), () => e.remove());
}
async function orb(a, b, color, size = .3, ms = 360, emoji) {
  const e = fxAdd(el('div', 'glow', emoji || '')), s = cellPx() * size;
  Object.assign(e.style, { left: '0', top: '0', width: s + 'px', height: s + 'px', transform: 'none', background: emoji ? 'transparent' : `radial-gradient(circle,#fff 0,${color} 45%,transparent 72%)`, boxShadow: emoji ? 'none' : `0 0 ${s}px ${color}`, fontSize: s + 'px', lineHeight: 1, textAlign: 'center' });
  await anim(e, [{ transform: `translate(${a.x}px,${a.y}px) translate(-50%,-50%) scale(.6)` }, { transform: `translate(${b.x}px,${b.y}px) translate(-50%,-50%) scale(1.1)` }], ms, { easing: 'ease-in', fill: 'forwards' });
  e.remove();
}
async function arrowTo(a, b, ms = 300) {
  const e = fxAdd(el('div', 'glow')), ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI, w = cellPx() * .5;
  Object.assign(e.style, { left: '0', top: '0', width: w + 'px', height: '3px', borderRadius: '2px', background: 'linear-gradient(90deg,transparent,#fff 60%,#F6C24A)' });
  await anim(e, [{ transform: `translate(${a.x}px,${a.y}px) translate(-50%,-50%) rotate(${ang}deg)` }, { transform: `translate(${b.x}px,${b.y}px) translate(-50%,-50%) rotate(${ang}deg)` }], ms, { easing: 'ease-in', fill: 'forwards' });
  e.remove();
}
function arc(p, color = '#fff') {
  const e = fxAdd(el('div', 'glow')), s = cellPx() * .95;
  Object.assign(e.style, { left: p.x + 'px', top: p.y + 'px', width: s + 'px', height: s + 'px', border: `5px solid transparent`, borderTopColor: color, borderRightColor: color, filter: 'drop-shadow(0 0 6px ' + color + ')' });
  return anim(e, [{ transform: 'translate(-50%,-50%) rotate(-80deg) scale(.5)', opacity: 1 }, { transform: 'translate(-50%,-50%) rotate(60deg) scale(1.1)', opacity: .9, offset: .7 }, { transform: 'translate(-50%,-50%) rotate(80deg) scale(1.15)', opacity: 0 }], 320).then(() => e.remove(), () => e.remove());
}
function shakeBoard(mag = 6, ms = 350) {
  return anim(UIX.board, [{ transform: 'translate(0,0)' }, { transform: `translate(${-mag}px,${mag / 2}px)` }, { transform: `translate(${mag}px,${-mag / 2}px)` }, { transform: `translate(${-mag / 2}px,0)` }, { transform: 'translate(0,0)' }], ms, { easing: 'linear' });
}
function lunge(u, c, f = .55) {
  const spr = $('.spr', UIX.units[u.id]), cp = cellPx(), dx = Math.sign(c.x - u.x) * cp * f, dy = Math.sign(c.y - u.y) * cp * f;
  return anim(spr, [{ transform: 'translate(0,0)' }, { transform: `translate(${dx}px,${dy}px) scale(1.12)`, offset: .4 }, { transform: 'translate(0,0)' }], 400, { easing: 'ease-in-out' });
}
async function melee(u, c, impact) {
  const p = lunge(u, c); await wait(160); impact(); await p;
}
const isMelee = sk => sk.range <= 1 && !sk.selfCenter && !sk.aoe;
const aimPoint = (c, hit) => { const p = P(c.x, c.y); if (hit === false) { const cp = cellPx(); p.x += rr(-.9, .9) * cp; p.y += rr(-.9, .9) * cp; } return p; };

const FXS = {
  async slash(u, sk, c, ts, o) { await melee(u, c, () => { if (o.hit !== false) { arc(P(c.x, c.y)); burst(P(c.x, c.y), { emoji: '✦', n: 4, r: .5, size: .22 }); } }); },
  async bash(u, sk, c, ts, o) { await melee(u, c, () => { if (o.hit !== false) { ring(P(c.x, c.y), cellPx() * .5, '#F6C24A', 350); burst(P(c.x, c.y), { emoji: '💥', n: 3, r: .5, size: .3 }); } }); },
  async poison(u, sk, c, ts, o) { await melee(u, c, () => { if (o.hit !== false) { burst(P(c.x, c.y), { emoji: '🟢', n: 7, r: .8, size: .2 }); arc(P(c.x, c.y), '#43938F'); } }); },
  async arrow(u, sk, c, ts, o) {
    if (sk.aoe) {
      const cp = cellPx(), cc = P(c.x, c.y), ps = [];
      for (let i = 0; i < 12; i++) { const to = { x: cc.x + rr(-1.3, 1.3) * cp, y: cc.y + rr(-1.2, 1.2) * cp }; ps.push((async () => { await wait(i * 40); await arrowTo({ x: to.x - cp * .4, y: to.y - cp * 2 }, to, 260); burst(to, { emoji: '✦', n: 1, r: .3, size: .15, dur: 300 }); })()); }
      await Promise.all(ps);
    } else { await arrowTo(PU(u), aimPoint(c, o.hit), 300); if (o.hit !== false) burst(P(c.x, c.y), { emoji: '✦', n: 3, r: .4, size: .18 }); }
  },
  async arcane(u, sk, c, ts, o) { await orb(PU(u), aimPoint(c, o.hit), C.blue, .3); if (o.hit !== false) { ring(P(c.x, c.y), cellPx() * .5, C.blue, 400); burst(P(c.x, c.y), { emoji: '✨', n: 5, r: .7 }); } },
  async music(u, sk, c, ts, o) { await orb(PU(u), aimPoint(c, o.hit), C.yellow, .4, 420, '🎵'); if (o.hit !== false) burst(P(c.x, c.y), { emoji: '🎶', n: 5, r: .7 }); },
  async ice(u, sk, c, ts, o) { await orb(PU(u), aimPoint(c, o.hit), '#8fc4ff', .32); if (o.hit !== false) { ring(P(c.x, c.y), cellPx() * .6, '#8fc4ff', 450); burst(P(c.x, c.y), { emoji: '❄️', n: 7, r: .9 }); } },
  async fire(u, sk, c, ts, o) {
    await orb(PU(u), aimPoint(c, o.hit), C.red, .34); if (o.hit === false) return;
    const rad = (sk.aoe ? sk.aoe + .5 : .6) * cellPx(); ring(P(c.x, c.y), rad, C.yellow, 550, .3); burst(P(c.x, c.y), { emoji: '🔥', n: sk.aoe ? 12 : 6, r: sk.aoe ? 1.6 : .8, size: .34 }); if (sk.aoe) shakeBoard(4, 300);
  },
  async holy(u, sk, c, ts, o) {
    if (isMelee(sk)) { const p = lunge(u, c); await wait(160); beam(P(c.x, c.y), C.yellow); await p; }
    else await beam(aimPoint(c, o.hit), C.yellow, 520);
    if (o.hit !== false) { ring(P(c.x, c.y), cellPx() * .6, C.yellow, 400); burst(P(c.x, c.y), { emoji: '✨', n: 6, r: .9 }); }
  },
  async shadow(u, sk, c, ts, o) {
    if (isMelee(sk)) await melee(u, c, () => { if (o.hit !== false) burst(P(c.x, c.y), { emoji: '💀', n: 3, r: .6, size: .25 }); });
    else { await orb(PU(u), aimPoint(c, o.hit), '#8a5bd1', .34); if (o.hit !== false) { ring(P(c.x, c.y), cellPx() * .5, '#8a5bd1', 450); burst(P(c.x, c.y), { emoji: '🌑', n: 5, r: .8 }); } }
    if (sk.drain && o.hit !== false) { await orb(P(c.x, c.y), PU(u), C.green, .26, 300); }
  },
  async heal(u, sk, c, ts) {
    ring(PU(u), cellPx() * .5, C.green, 400);
    await Promise.all(ts.map(t => { const p = PU(t); ring(p, cellPx() * .55, C.green, 700, .3); return burst(p, { emoji: '💚', n: 5, r: .5, rise: true, size: .22, dur: 900 }); }));
  },
  async buff(u, sk, c, ts) {
    const ic = sk.buff.type === 'guard' ? '🛡️' : sk.buff.type === 'inspire' ? '🎵' : '✨', col = sk.buff.type === 'guard' ? C.blue : C.yellow;
    if (sk.selfCenter) ring(PU(u), (sk.radius + .5) * cellPx(), col, 600, .12);
    await Promise.all(ts.map(t => { const p = PU(t); ring(p, cellPx() * .5, col, 650, .25); return burst(p, { emoji: ic, n: 4, r: .5, rise: true, size: .22, dur: 900 }); }));
  },
  async whirl(u, sk) {
    const spr = $('.spr', UIX.units[u.id]); ring(PU(u), (sk.radius + .3) * cellPx(), '#fff', 500, .15); burst(PU(u), { emoji: '💨', n: 8, r: sk.radius + .6, size: .3 });
    await anim(spr, [{ transform: 'rotate(0)' }, { transform: 'rotate(360deg) scale(1.1)' }, { transform: 'rotate(720deg)' }], 600, { easing: 'ease-in-out' });
  },
  async stomp(u, sk) { await anim($('.spr', UIX.units[u.id]), [{ transform: 'translateY(0)' }, { transform: 'translateY(-30%)', offset: .4 }, { transform: 'translateY(0)' }], 350); ring(PU(u), (sk.radius + .5) * cellPx(), C.yellow, 500, .25); burst(PU(u), { emoji: '💥', n: 6, r: sk.radius + .5, size: .3 }); await shakeBoard(7, 350); },
  async nova(u, sk) { SFX.cast(); ring(PU(u), (sk.radius + .6) * cellPx(), '#8a5bd1', 700, .35); burst(PU(u), { emoji: '☠️', n: 10, r: sk.radius + .6, size: .26 }); await shakeBoard(5, 450); },
  async breath(u, sk, c, ts, o) {
    const a = PU(u), b = P(c.x, c.y), ps = [];
    for (let i = 0; i < 9; i++) ps.push((async () => { await wait(i * 45); await orb(a, { x: b.x + rr(-.4, .4) * cellPx(), y: b.y + rr(-.4, .4) * cellPx() }, i % 2 ? C.red : C.yellow, .34, 320, '🔥'); })());
    await Promise.all(ps); ring(b, (sk.aoe + .6) * cellPx(), C.red, 600, .35); burst(b, { emoji: '🔥', n: 14, r: 1.8, size: .36 }); shakeBoard(7, 400);
  }
};

/* ---- dice panel ---- */
const dv = () => $('#dice');
function hideDice() { dv().classList.add('hidden'); }
async function spinNumber(textEl, max, dur, ticks = true) {
  const t0 = performance.now(), id = RUN_ID;
  while (performance.now() - t0 < T(dur) && id === RUN_ID) { textEl.textContent = 1 + Math.floor(Math.random() * max); if (ticks) SFX.tick(); await wait(65); }
}

/* ============ Hooks called by the engine ============ */
const GameUI = {
  refresh: refreshUnit,
  log: logLine,

  async battleStart(g) {
    const b = $('#board'); UIX.board = b; b.innerHTML = ''; UIX.units = {}; UIX.loots = {};
    b.style.setProperty('--cols', g.cols); b.style.setProperty('--rows', g.rows); b.style.setProperty('--spd', UIX.speed);
    b.style.setProperty('--ta', g.camp.theme.a); b.style.setProperty('--tb', g.camp.theme.b); b.style.setProperty('--tl', g.camp.theme.line);
    b.append(el('div', 'grid'));
    g.camp.obstacles.forEach(o => { const e = el('div', 'obst', o[2]); e.style.setProperty('--x', o[0]); e.style.setProperty('--y', o[1]); b.append(e); });
    g.units.forEach((u, i) => createUnitEl(u, i));
    UIX.fx = el('div', 'fx'); b.append(UIX.fx);
    $('#bCampIcon').textContent = g.camp.icon; $('#bCampName').textContent = g.camp.name; $('#roundTag').textContent = 'Round 0';
    $('#log').innerHTML = ''; hideDice(); $('#banner').classList.add('hidden'); $('#result').classList.add('hidden');
    buildCards(g); g.units.forEach(refreshUnit); renderInv();
    logLine(`⚔ ${g.camp.name}: ${g.units.filter(u => u.team === 'player').map(u => u.name).join(', ')} vs ${g.units.filter(u => u.team === 'enemy').length} foes.`, 'round');
    await wait(700);
  },
  async initiative(g) {
    const list = g.units.slice().sort((a, b) => b.initRoll - a.initRoll); updateOrder(list);
    logLine('Order: ' + list.map(u => `${u.name} (${u.initRoll})`).join(' › '), 'info');
    await wait(500);
  },
  async roundStart(n) {
    $('#roundTag').textContent = 'Round ' + n; logLine(`— Round ${n} —`, 'round'); updateOrder(G.order); await wait(250);
  },
  async turnStart(u) {
    $$('.unit.active').forEach(e => e.classList.remove('active')); $$('.card.act').forEach(e => e.classList.remove('act')); $$('.ord.act').forEach(e => e.classList.remove('act'));
    UIX.units[u.id].classList.add('active'); UIX.cards[u.id]?.classList.add('act'); $('#ord-' + u.id)?.classList.add('act'); $('#ord-' + u.id)?.scrollIntoView({ block: 'nearest', inline: 'center' });
    await wait(280);
  },
  async turnEnd(u) {
    UIX.units[u.id]?.classList.remove('active'); UIX.cards[u.id]?.classList.remove('act'); $('#ord-' + u.id)?.classList.remove('act');
    if (!u.alive) $('#ord-' + u.id)?.classList.add('dead');
    await wait(120); hideDice();
  },
  async skip(u, why) { floatText(PU(u), why === 'hold' ? '💤' : '💫 Stunned', '#fff'); await wait(450); },
  async moveUnit(u, from, to) {
    const e = UIX.units[u.id]; e.style.setProperty('--x', to.x); e.style.setProperty('--y', to.y); e.style.zIndex = 10 + to.y;
    await wait(290);
  },
  async announce(u, sk, c) {
    callout(PU(u), `${sk.ic || ''} ${sk.name}`);
    if (sk.kind === 'heal') SFX.heal(); else SFX.cast();
    await wait(380);
  },
  async castFx(u, sk, c, ts, o) { await (FXS[sk.fx] || FXS.slash)(u, sk, c, ts, o || {}); },

  async rollAttack(ev) {
    const D = dv(); D.classList.remove('hidden'); $('.d-row', D).style.display = '';
    $('.d-title', D).innerHTML = `${ev.u.emoji} <b>${ev.u.name}</b> → ${ev.t.emoji} <b>${ev.t.name}</b> · ${ev.sk.name}`;
    const d20 = $('.d20', D), txt = $('.d20 text', D), calc = $('.d-calc', D), res = $('.d-res', D);
    $('.d-dmg', D).innerHTML = ''; res.textContent = ''; res.className = 'd-res'; d20.className = 'd20 spin'; calc.textContent = `Attack roll vs AC ${ev.ac}`;
    await spinNumber(txt, 20, ev.quick ? 320 : 950);
    txt.textContent = ev.roll; const cls = ev.crit ? 'crit' : ev.hit ? 'hit' : 'miss'; d20.className = 'd20 pop ' + cls;
    calc.textContent = `${ev.roll} ${ev.bonus < 0 ? '−' : '+'} ${Math.abs(ev.bonus)} = ${ev.total}  vs AC ${ev.ac}`;
    res.className = 'd-res ' + cls; res.textContent = ev.crit ? 'CRITICAL HIT!' : ev.nat1 ? 'FUMBLE!' : ev.hit ? 'HIT!' : 'MISS';
    (ev.hit ? (ev.crit ? SFX.crit : SFX.hit) : SFX.miss)();
    await wait(ev.quick ? 260 : 650);
  },
  async rollDamage(ev) {
    const D = dv(); D.classList.remove('hidden');
    if (ev.heal) { $('.d-row', D).style.display = 'none'; $('.d-title', D).innerHTML = `${ev.u.emoji} <b>${ev.u.name}</b> → ${ev.t.emoji} <b>${ev.t.name}</b> · ${ev.sk.name}`; }
    const row = $('.d-dmg', D); row.innerHTML = '';
    const sides = ev.sk.dice[1], dice = ev.dice.map(() => { const x = el('div', 'die roll' + (ev.heal ? ' heal' : ''), '?'); row.append(x); return x; });
    const t0 = performance.now();
    while (performance.now() - t0 < T(ev.quick ? 300 : 700)) { dice.forEach(x => x.textContent = 1 + Math.floor(Math.random() * sides)); SFX.tick(); await wait(65); }
    dice.forEach((x, i) => { x.textContent = ev.dice[i]; x.classList.remove('roll'); if (ev.crit && i >= ev.dice.length / 2) x.classList.add('crit'); });
    row.append(el('span', 'd-tot ' + (ev.heal ? 'heal' : 'dmg'), `${ev.dice.length}d${sides}${ev.bonus ? (ev.bonus > 0 ? '+' : '−') + Math.abs(ev.bonus) : ''} = ${ev.total} ${ev.heal ? 'HEAL' : 'DMG'}`));
    await wait(ev.quick ? 220 : 500);
  },

  async hit(t, dmg, crit, o) {
    const e = UIX.units[t.id], p = PU(t);
    const col = o.dot === 'burn' ? C.yellow : o.dot === 'poison' ? '#b27cf0' : '#fff';
    floatText(p, (o.dot ? ST_ICON[o.dot] : '') + '−' + dmg, crit ? C.yellow : (o.dot ? col : '#ff8a84'), crit);
    if (crit) { callout(p, 'CRITICAL!'); shakeBoard(7, 300); }
    crit ? SFX.crit() : SFX.hit();
    const spr = $('.spr', e);
    await anim(spr, [{ transform: 'translateX(0)', filter: 'brightness(1)' }, { transform: 'translateX(-9px)', filter: 'brightness(3) saturate(0)' }, { transform: 'translateX(7px)', filter: 'brightness(2)' }, { transform: 'translateX(0)', filter: 'brightness(1)' }], 320, { easing: 'linear' });
  },
  async miss(t, u, sk, nat1) {
    floatText(PU(t), nat1 ? 'FUMBLE' : 'MISS', '#c8d4ee'); const spr = $('.spr', UIX.units[t.id]);
    await anim(spr, [{ transform: 'translateX(0)' }, { transform: 'translateX(14px) rotate(6deg)' }, { transform: 'translateX(0)' }], 300);
  },
  async heal(t, amt, key) {
    const p = PU(t);
    floatText(p, key ? `+10 ${key.toUpperCase()}` : '+' + amt, key === 'mp' ? '#8fb4ee' : key === 'sp' ? C.yellow : '#7fe3da', true);
    burst(p, { emoji: '✚', n: 5, r: .5, rise: true, size: .22 }); SFX.heal(); await wait(380);
  },
  async statusFx(t, type) { floatText(PU(t), ST_ICON[type] + ' ' + (type === 'stun' ? 'Stunned' : type === 'burn' ? 'Burning' : type === 'poison' ? 'Poisoned' : type === 'guard' ? 'Guarded' : 'Inspired'), type === 'inspire' || type === 'guard' ? C.yellow : '#e9c6ff'); await wait(300); },
  async die(u) {
    const e = UIX.units[u.id]; SFX.die(); burst(PU(u), { emoji: u.team === 'enemy' ? '💨' : '💔', n: 6, r: .8 });
    e.classList.remove('active'); $('.stat', e).style.display = 'none';
    await anim($('.spr', e), [{ transform: 'rotate(0) scale(1)', opacity: 1 }, { transform: 'rotate(80deg) translateY(10%) scale(.95)', opacity: .5 }], 650, { fill: 'forwards' });
    $('#ord-' + u.id)?.classList.add('dead');
    if (u.team === 'enemy') { await anim(e, [{ opacity: 1 }, { opacity: 0 }], 350, { fill: 'forwards' }); e.style.display = 'none'; }
    else { e.classList.add('dead'); e.append(el('div', 'tomb', '🪦')); }
    refreshUnit(u);
  },
  async dropLoot(l, from) {
    const e = el('div', 'loot', l.item.emoji); e.style.setProperty('--x', l.x); e.style.setProperty('--y', l.y); e.title = l.item.name;
    UIX.board.append(e); UIX.loots[l.id] = e; SFX.loot();
    const cp = cellPx(), dx = (from.x - l.x) * cp, dy = (from.y - l.y) * cp;
    await anim(e, [{ transform: `translate(${dx}px,${dy}px) scale(.3)`, opacity: 0 }, { transform: `translate(${dx * .4}px,${dy * .4 - cp * .6}px) scale(1.3)`, opacity: 1, offset: .55 }, { transform: 'translate(0,0) scale(1)', opacity: 1 }], 520);
    logLine(`${from.name} dropped ${l.item.emoji} ${l.item.name}.`, 'loot');
  },
  async pickup(u, l) {
    const e = UIX.loots[l.id]; SFX.loot();
    if (e) { const cp = cellPx(), dx = (u.x - l.x) * cp, dy = (u.y - l.y) * cp - cp * .3; await anim(e, [{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${dx}px,${dy}px) scale(.4)`, opacity: .2 }], 420, { easing: 'ease-in', fill: 'forwards' }); e.remove(); delete UIX.loots[l.id]; }
    floatText(PU(u), `${l.item.emoji} ${l.item.name}`, C.yellow, false); burst(PU(u), { emoji: '✨', n: 5, r: .7 });
    refreshUnit(u); await wait(300);
  },

  async battleEnd(g) {
    $$('.unit.active').forEach(e => e.classList.remove('active')); hideDice();
    const win = g.over === 'victory';
    const bn = $('#banner'); bn.classList.remove('hidden'); bn.style.color = win ? C.yellow : C.red; bn.textContent = win ? '🏆 VICTORY!' : (g.timeout ? '⌛ RETREAT' : '💀 DEFEAT');
    anim(bn, [{ transform: 'scale(.3)', opacity: 0 }, { transform: 'scale(1.15)', opacity: 1, offset: .6 }, { transform: 'scale(1)', opacity: 1 }], 700);
    if (win) { SFX.win(); for (let i = 0; i < 4; i++) { burst({ x: rr(.2, .8) * UIX.board.clientWidth, y: rr(.2, .7) * UIX.board.clientHeight }, { emoji: ['🎉', '✨', '⭐', '🪙'][i], n: 10, r: 2, size: .4, dur: 1100 }); await wait(250); } }
    else SFX.lose();
    await wait(1400); bn.classList.add('hidden'); showResult(g);
  }
};

/* ---- result screen ---- */
function showResult(g) {
  const win = g.over === 'victory', heroes = g.units.filter(u => u.team === 'player');
  const mvp = heroes.slice().sort((a, b) => b.stats.dmg + b.stats.healed - a.stats.dmg - a.stats.healed)[0];
  const rows = heroes.map(h => `<tr><td>${h.emoji} <b>${h.name}</b> <small style="color:var(--muted)">${h.cls}</small> ${h === mvp ? '<span class="mvp">★ MVP</span>' : ''}</td><td>${h.alive ? '❤️ ' + h.hp + '/' + h.maxHp : '🪦 fallen'}</td><td>${h.stats.dmg}</td><td>${h.stats.healed}</td><td>${h.stats.kills}</td><td>${h.gearList.map(x => x.emoji).join(' ') || '–'}</td></tr>`).join('');
  const loot = g.gained.length ? g.gained.map(i => `<span class="${i.rarity === 'rare' ? 'rare' : ''}">${i.emoji} ${i.name}</span>`).join('') : '<span>Nothing collected</span>';
  const box = $('#result'); box.classList.remove('hidden');
  box.innerHTML = `<div class="res-box ${win ? 'win' : 'lose'}"><h1>${win ? '🏆 Victory!' : g.timeout ? '⌛ The party retreated' : '💀 Defeat'}</h1>
    <div style="color:var(--muted)">${g.camp.name} · ${g.round} rounds · 💰 ${g.gold} gold</div>
    <table><tr><th>Hero</th><th>Status</th><th>Damage</th><th>Healed</th><th>Kills</th><th>Gear</th></tr>${rows}</table>
    <b>Loot collected</b><div class="res-loot">${loot}</div>
    <div class="res-btns"><button class="btn ghost" id="rNewParty">New party</button><button class="btn ghost" id="rCamp">Other campaign</button><button class="btn primary" id="rAgain">⚔ Play again</button></div></div>`;
  $('#rAgain').onclick = () => Game.start(); $('#rCamp').onclick = () => Game.go('campaign'); $('#rNewParty').onclick = () => Game.go('party');
}

setUI(GameUI);
