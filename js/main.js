'use strict';
/* ============ Screens & wiring ============ */
const Game = {
  party: [], camp: null, screen: 'party',
  go(screen) {
    RUN_ID++; // abort any running battle
    Game.screen = screen;
    $$('.screen').forEach(s => s.classList.toggle('hidden', s.id !== 'screen-' + screen));
    $('#result').classList.add('hidden');
    const order = ['party', 'campaign', 'story', 'battle'], i = order.indexOf(screen);
    $$('.steps li').forEach((li, k) => { li.classList.toggle('on', k === i); li.classList.toggle('done', k < i); });
    if (screen === 'campaign') { renderSlots('#partySlots2'); renderCampaigns(); }
    if (screen === 'story') renderStory();
    window.scrollTo(0, 0);
  },
  /** withStory=true -> show the storybook first, otherwise jump straight into battle */
  start(withStory) {
    if (!Game.party.length || !Game.camp) return;
    if (withStory) return Game.go('story');
    UIX.paused = false; $('#pauseBtn').textContent = '⏸';
    Game.go('battle');
    runBattle(Game.camp, Game.party.slice()).catch(e => { console.error(e); $('#dmText').textContent = '⚠ ' + e.message; });
  }
};

/* ---------- language ---------- */
function applyStatic() {
  document.documentElement.lang = LANG; document.title = t('title');
  $$('[data-i18n]').forEach(e => e.textContent = t(e.dataset.i18n));
  $$('#langSeg button').forEach(b => b.classList.toggle('on', b.dataset.lang === LANG));
}
function setLang(l) {
  setLangValue(l); applyStatic(); renderClasses(); syncParty();
  if (Game.screen === 'campaign') { renderSlots('#partySlots2'); renderCampaigns(); }
  if (Game.screen === 'story') renderStory();
  if (Game.screen === 'battle') { relocalizeBattle(); if (!$('#result').classList.contains('hidden') && G && G.over) showResult(G); }
}

/* ---------- party ---------- */
function statBar(label, v, max, color) { return `<div class="b"><span>${label}</span><div class="t"><i style="width:${Math.min(100, v / max * 100)}%;background:${color}"></i></div><span style="width:26px;text-align:right">${v}</span></div>`; }
function skillLine(s) {
  const dice = s.kind === 'buff' ? t('buff') : s.dice[0] + 'd' + s.dice[1];
  const cost = s.res ? ` · ${s.cost}${s.res.toUpperCase()}` : '';
  return `<li><span>${s.ic}</span>${tr(s.name)}<em>${dice}${cost}${s.aoe || s.selfCenter ? ' · ' + t('aoe') : ''}</em></li>`;
}
function renderClasses() {
  const g = $('#classGrid'); g.innerHTML = '';
  Object.values(CLASSES).forEach(c => {
    const e = el('div', 'cls-card' + (Game.party.includes(c.key) ? ' sel' : '')); e.dataset.key = c.key;
    e.innerHTML = `<div class="cls-art">${modelSVG(c.key)}</div>
      <div class="cls-head"><b>${tr(c.hero)} <small style="color:var(--muted);font-weight:400">${tr(c.name)}</small></b><span class="role">${tr(c.role)}</span></div>
      <p class="desc">${tdesc('cls.' + c.key, c.desc)}</p>
      <div class="mini">${statBar('HP', c.hp, 65, C.green)}${statBar('MP', c.mp, 26, C.blue)}${statBar('SP', c.sp, 22, C.yellow)}</div>
      <div class="statline">${t('stats', { ac: c.ac, atk: c.atk, mod: c.mod, mv: c.move })}</div>
      <ul class="skills">${c.skills.map(skillLine).join('')}</ul>`;
    e.onclick = () => togglePick(c.key);
    g.append(e);
  });
}
function togglePick(k) {
  const i = Game.party.indexOf(k);
  if (i >= 0) Game.party.splice(i, 1); else if (Game.party.length < 4) Game.party.push(k); else { flashSlots(); return; }
  syncParty();
}
function flashSlots() { const s = $('#partySlots'); s.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 250 }); }
function renderSlots(sel) {
  const box = $(sel); box.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const k = Game.party[i], s = el('div', 'slot' + (k ? ' f' : ''));
    if (k) { s.innerHTML = modelSVG(k) + `<small>${tr(CLASSES[k].hero)}</small>`; if (sel === '#partySlots') { s.title = t('remove'); s.onclick = () => togglePick(k); } }
    else s.textContent = '+';
    box.append(s);
  }
}
function syncParty() {
  $$('.cls-card').forEach(c => c.classList.toggle('sel', Game.party.includes(c.dataset.key)));
  renderSlots('#partySlots'); $('#toCampaign').disabled = !Game.party.length;
}

/* ---------- campaigns ---------- */
function renderCampaigns() {
  const g = $('#campGrid'); g.innerHTML = '';
  CAMPAIGNS.forEach(c => {
    const counts = {}; c.enemies.forEach(e => counts[e[0]] = (counts[e[0]] || 0) + 1);
    const boss = MONSTERS[c.boss[0]], S = story(c.id);
    const e = el('div', 'camp' + (Game.camp && Game.camp.id === c.id ? ' sel' : ''));
    e.innerHTML = `<div class="pv" style="background:repeating-conic-gradient(${c.theme.a} 0 25%,${c.theme.b} 0 50%) 0 0/48px 48px"><span class="ic">${c.icon}</span><span class="big">${boss.emoji}</span></div>
      <div class="bd">${S ? `<div class="chap" style="margin-bottom:2px">${S.chapter}</div>` : ''}<h2>${tr(c.name)}</h2><p>${tdesc('camp.' + c.id, c.desc)}</p>
      <div class="diff">${t('diff')} ${[1, 2, 3].map(n => `<i class="${n <= c.difficulty ? 'on' : ''}"></i>`).join('')}</div>
      <div class="foes">${Object.entries(counts).map(([k, n]) => `<span class="foe">${MONSTERS[k].emoji} ${tr(MONSTERS[k].name)} ×${n}</span>`).join('')}<span class="foe boss">${boss.emoji} ${t('boss')} ${tr(boss.name)}</span></div></div>`;
    e.onclick = () => { Game.camp = c; $$('.camp').forEach(x => x.classList.remove('sel')); e.classList.add('sel'); $('#startBtn').disabled = false; };
    g.append(e);
  });
  $('#startBtn').disabled = !Game.camp;
}

/* ---------- story screen ---------- */
function renderStory() {
  const c = Game.camp, S = c && story(c.id); if (!c) return Game.go('campaign');
  const art = $('#storyArt');
  art.style.background = `repeating-conic-gradient(${c.theme.a} 0 25%,${c.theme.b} 0 50%) 0 0/56px 56px`;
  const boss = MONSTERS[c.boss[0]];
  art.innerHTML = `<span class="sc-ico">${c.icon}</span><span class="sc-vs">VS</span>
    <div class="grp">${Game.party.map(k => modelSVG(k)).join('')}</div>
    <div class="grp boss">${modelSVG(boss.key)}</div>`;
  $('#storyChap').textContent = S ? S.chapter : '';
  $('#storyTitle').textContent = tr(c.name);
  const box = $('#storyText'); box.innerHTML = '';
  (S ? S.intro : [tdesc('camp.' + c.id, c.desc)]).forEach((p, i) => { const e = el('p', '', p); e.style.animationDelay = (i * 0.9 + .2) + 's'; box.append(e); });
  $('#storyParty').innerHTML = Game.party.map(k => `<span>${CLASSES[k].emoji} ${tr(CLASSES[k].hero)} · ${tr(CLASSES[k].name)}</span>`).join('');
}

/* ---------- init ---------- */
applyStatic(); renderClasses(); syncParty();
$('#toCampaign').onclick = () => Game.go('campaign');
$('#backParty').onclick = () => Game.go('party');
$('#startBtn').onclick = () => Game.start(true);
$('#storyBack').onclick = () => Game.go('campaign');
$('#storyBegin').onclick = () => Game.start(false);
$('#clearParty').onclick = () => { Game.party = []; syncParty(); };
$('#randParty').onclick = () => { Game.party = Object.keys(CLASSES).sort(() => Math.random() - .5).slice(0, 4); syncParty(); };
$$('#viewSeg button').forEach(b => b.onclick = () => setView(b.dataset.view));
$$('#langSeg button').forEach(b => b.onclick = () => setLang(b.dataset.lang));
$('#soundBtn').onclick = () => { UIX.sound = !UIX.sound; $('#soundBtn').textContent = UIX.sound ? '🔊' : '🔇'; };
$('#pauseBtn').onclick = () => { UIX.paused = !UIX.paused; $('#pauseBtn').textContent = UIX.paused ? '▶' : '⏸'; };
$$('#speedSeg button').forEach(b => b.onclick = () => {
  UIX.speed = +b.dataset.s; $$('#speedSeg button').forEach(x => x.classList.toggle('on', x === b));
  if (UIX.board) UIX.board.style.setProperty('--spd', UIX.speed);
});
$('#quitBtn').onclick = () => Game.go('campaign');

// Demo links: index.html?party=knight,mage,cleric,rogue&camp=goblin&speed=2&view=chip&lang=th&story=1
(function auto() {
  const q = new URLSearchParams(location.search);
  if (q.get('lang') === 'th' || q.get('lang') === 'en') { setLangValue(q.get('lang')); applyStatic(); renderClasses(); }
  if (q.get('view')) setView(q.get('view'));
  if (q.get('speed')) { UIX.speed = +q.get('speed'); $$('#speedSeg button').forEach(x => x.classList.toggle('on', x.dataset.s === q.get('speed'))); }
  if (q.get('sound') === '0') { UIX.sound = false; $('#soundBtn').textContent = '🔇'; }
  if (q.get('party')) { Game.party = q.get('party').split(',').filter(k => CLASSES[k]).slice(0, 4); syncParty(); }
  Game.go('party');
  if (q.get('camp')) { Game.camp = CAMPAIGNS.find(c => c.id === q.get('camp')) || null; if (Game.camp && Game.party.length) Game.start(q.get('story') === '1'); }
})();
