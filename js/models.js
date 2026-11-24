'use strict';
/* ============ Procedural 2D SVG "models" (no external assets needed) ============ */
const OUT = '#141a2b';
const W = {
  sword: '<rect x="42" y="10" width="3.6" height="31" rx="1" fill="#e3ebf5"/><rect x="38.5" y="38" width="11" height="3.4" rx="1" fill="#b98a2e"/>',
  rust: '<rect x="42" y="12" width="3.6" height="29" rx="1" fill="#9a8a78"/><rect x="38.5" y="38" width="11" height="3.4" rx="1" fill="#5a4630"/>',
  dagger: '<rect x="42.5" y="26" width="2.8" height="15" rx="1" fill="#e3ebf5"/><rect x="40" y="38.5" width="8" height="2.6" fill="#555"/>',
  staff: c => `<line x1="45" y1="61" x2="45" y2="9" stroke="#7a5230" stroke-width="3"/><circle cx="45" cy="8" r="5" fill="${c}"/><circle cx="43.5" cy="6.5" r="1.5" fill="#fff" stroke="none"/>`,
  mace: '<line x1="44" y1="50" x2="44" y2="17" stroke="#7a5230" stroke-width="3"/><circle cx="44" cy="14" r="5.5" fill="#b3bdcc"/>',
  bow: '<path d="M48 10 Q61 36 48 62" fill="none" stroke="#7a5230" stroke-width="3"/><line x1="48" y1="10" x2="48" y2="62" stroke="#eee" stroke-width="1"/>',
  axe: '<line x1="44" y1="56" x2="44" y2="10" stroke="#7a5230" stroke-width="3"/><path d="M44 8 L57 4 L57 22 L44 20 Z" fill="#c9d2de"/>',
  hammer: '<line x1="44" y1="54" x2="44" y2="12" stroke="#7a5230" stroke-width="3"/><rect x="37" y="6" width="15" height="10" rx="2" fill="#c9d2de"/>',
  lute: '<ellipse cx="47" cy="44" rx="7" ry="9" fill="#c9833a"/><line x1="47" y1="36" x2="53" y2="14" stroke="#7a5230" stroke-width="2.6"/><circle cx="47" cy="44" r="2.2" fill="#3a2410"/>',
  trident: '<line x1="45" y1="58" x2="45" y2="14" stroke="#555" stroke-width="2.4"/><path d="M39 8 V16 M45 6 V16 M51 8 V16 M39 16 H51" fill="none" stroke="#d5dbe6" stroke-width="2.4"/>',
  mace2: '<line x1="44" y1="50" x2="44" y2="17" stroke="#5a3a20" stroke-width="3.4"/><circle cx="44" cy="14" r="7" fill="#8a8f9a"/><path d="M44 5V2M52 14H56M36 14H32M50 8l3-3M38 8l-3-3" stroke="#d5dbe6" stroke-width="2.4"/>'
};
const SHIELD = c => `<path d="M8 27 H24 V40 Q16 50 8 40 Z" fill="${c}"/><path d="M16 29 V44 M10 34 H22" stroke="#e8eef8" stroke-width="2" fill="none"/>`;

function H(o) {
  const skin = o.skin || '#f0c8a4', legs = o.legs || '#39415a';
  return `<svg viewBox="0 0 64 64" class="mdl"><g stroke="${OUT}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
  ${o.back || ''}
  <rect x="24" y="44" width="6.5" height="14" rx="2.5" fill="${legs}"/><rect x="33.5" y="44" width="6.5" height="14" rx="2.5" fill="${legs}"/>
  ${o.robe ? `<path d="M21 28 L43 28 L48 58 L16 58 Z" fill="${o.body}"/>` : `<rect x="21" y="27" width="22" height="20" rx="5" fill="${o.body}"/>`}
  ${o.trim || ''}
  ${o.off || `<rect x="16" y="29" width="6" height="13" rx="3" fill="${skin}"/>`}
  <circle cx="32" cy="19" r="9.5" fill="${skin}"/>
  ${o.head || ''}
  <circle cx="35.5" cy="19.5" r="1.7" fill="${OUT}" stroke="none"/>
  ${o.face || ''}
  <rect x="40" y="29" width="6" height="12" rx="3" fill="${skin}"/>
  ${o.weapon || ''}
  </g></svg>`;
}
const dome = c => `<path d="M22.5 19 A9.5 9.5 0 0 1 41.5 19 Z" fill="${c}"/>`;

const MODEL_SRC = {
  knight: () => H({ body: '#9fb0c8', legs: '#566179', head: dome('#b8c5da') + `<path d="M30 10 Q32 0 41 5 Q35 6 35 11Z" fill="${C.blue}"/><rect x="31" y="14" width="10" height="2.4" fill="${OUT}"/>`, trim: `<rect x="21" y="38" width="22" height="3" fill="${C.blue}"/>`, off: SHIELD(C.blue), weapon: W.sword }),
  mage: () => H({ robe: true, body: '#274d93', skin: '#f0c8a4', head: `<ellipse cx="32" cy="13" rx="14" ry="3.6" fill="#1f3c75"/><path d="M23 13 Q28 -1 37 3 Q38 9 41 13 Z" fill="#274d93"/><path d="M31 9l1 -2 1 2 2 .5 -1.6 1.5 .4 2 -1.8 -1 -1.8 1 .4 -2 -1.6 -1.5z" fill="${C.yellow}" stroke="none"/>`, trim: `<path d="M32 30 V58" stroke="${C.yellow}" stroke-width="2"/>`, weapon: W.staff(C.yellow), face: `<path d="M26 25 Q32 36 38 25 Q32 28 26 25Z" fill="#e9eef7"/>` }),
  rogue: () => H({ body: '#2b3350', legs: '#20263d', head: `<path d="M21 21 Q20 6 32 6 Q44 6 43 21 Q38 13 32 13 Q26 13 21 21Z" fill="#232a45"/>`, trim: `<rect x="22" y="26" width="20" height="4.5" rx="2" fill="${C.green}"/><rect x="21" y="38" width="22" height="3" fill="#6a4a2a"/>`, weapon: W.dagger + '<rect x="14" y="32" width="4" height="12" rx="1.5" fill="#e3ebf5" transform="rotate(-20 16 38)"/>' }),
  cleric: () => H({ robe: true, body: '#eef3fa', head: `<path d="M22 19 Q21 7 32 7 Q43 7 42 19 Q37 12 32 12 Q27 12 22 19Z" fill="#f6f9fd"/>`, trim: `<path d="M32 31 V42 M27 36 H37" stroke="${C.green}" stroke-width="3.6"/><rect x="21" y="46" width="22" height="3" fill="${C.green}"/>`, weapon: W.mace }),
  ranger: () => H({ body: '#2f6b4f', legs: '#4a3a28', head: `<path d="M22 17 Q32 2 42 17 Q32 11 22 17Z" fill="#2a5e44"/><path d="M37 9 L47 3 L40 12Z" fill="${C.yellow}"/>`, trim: `<path d="M22 28 L40 44" stroke="#6a4a2a" stroke-width="3"/><rect x="21" y="40" width="22" height="3" fill="#6a4a2a"/>`, weapon: W.bow, back: '<rect x="14" y="26" width="5" height="18" rx="2" fill="#6a4a2a"/><path d="M15 26 V20 M17 26 V19" stroke="#ddd" stroke-width="1.5"/>' }),
  barbarian: () => H({ body: '#c58a52', legs: '#6a4a2a', head: `<path d="M22 15 Q32 4 42 15 Q32 11 22 15Z" fill="#a8362a"/><path d="M22 13 Q15 8 17 1 Q23 5 26 11Z" fill="#f0ead8"/><path d="M42 13 Q49 8 47 1 Q41 5 38 11Z" fill="#f0ead8"/>`, face: `<path d="M25 23 Q32 38 39 23 Q32 28 25 23Z" fill="#a8362a"/>`, trim: `<path d="M21 28 Q32 36 43 28 V32 Q32 40 21 32Z" fill="#7a5a3a"/><rect x="21" y="40" width="22" height="4" fill="#6a4a2a"/>`, weapon: W.axe }),
  paladin: () => H({ body: '#dfe7f3', legs: '#68738c', head: dome('#e9eff8') + `<path d="M32 3 L36 11 H28Z" fill="${C.yellow}"/><rect x="31" y="14" width="10" height="2.4" fill="${OUT}"/>`, trim: `<path d="M32 29 V44 M26 35 H38" stroke="${C.yellow}" stroke-width="3.4"/><rect x="21" y="43" width="22" height="3" fill="${C.yellow}"/>`, off: SHIELD(C.yellow), weapon: W.hammer }),
  bard: () => H({ body: '#b9482f', legs: '#3a2f57', head: `<path d="M21 14 Q32 6 43 14 Q32 11 21 14Z" fill="${C.yellow}"/><ellipse cx="32" cy="13.5" rx="13" ry="3" fill="#d9a22c"/><path d="M40 12 Q48 2 52 6 Q46 6 42 14Z" fill="${C.green}"/>`, trim: `<path d="M21 36 H43" stroke="${C.yellow}" stroke-width="3"/>`, weapon: W.lute }),

  goblin: () => H({ skin: '#6fae5a', body: '#7a5a3a', legs: '#4a3a28', head: '<path d="M23 16 L8 11 L22 23Z" fill="#6fae5a"/><path d="M41 16 L56 11 L42 23Z" fill="#6fae5a"/>', face: '<path d="M29 25 Q32 28 35 25" stroke="#141a2b" fill="none"/><path d="M30 25 l1 3 1-3z" fill="#fff" stroke="none"/>', weapon: W.rust }),
  goblin_archer: () => H({ skin: '#6fae5a', body: '#5a6b3a', legs: '#4a3a28', head: '<path d="M23 16 L8 11 L22 23Z" fill="#6fae5a"/><path d="M41 16 L56 11 L42 23Z" fill="#6fae5a"/><path d="M22 16 Q32 4 42 16 Q32 11 22 16Z" fill="#8a3a2a"/>', weapon: W.bow }),
  goblin_king: () => H({ skin: '#5f9a4a', body: '#8a1f2a', legs: '#4a3a28', back: `<path d="M20 28 L10 60 L40 60 L40 30Z" fill="${C.red}"/>`, head: `<path d="M23 16 L8 11 L22 23Z" fill="#5f9a4a"/><path d="M41 16 L56 11 L42 23Z" fill="#5f9a4a"/><path d="M22 12 L24 3 L28 9 L32 1 L36 9 L40 3 L42 12Z" fill="${C.yellow}"/>`, face: '<path d="M29 25 Q32 28 35 25" stroke="#141a2b" fill="none"/><path d="M29.5 25 l1 3 1-3zM33 25 l1 3 1-3z" fill="#fff" stroke="none"/>', trim: `<rect x="21" y="38" width="22" height="3" fill="${C.yellow}"/>`, weapon: W.mace2 }),
  skeleton: () => H({ skin: '#eef0f2', body: '#e0e4ea', legs: '#d4d9e0', head: '<circle cx="35.5" cy="19.5" r="2.8" fill="#141a2b" stroke="none"/><circle cx="28.5" cy="19.5" r="2.8" fill="#141a2b" stroke="none"/><path d="M28 26 H36 M30 26 V28 M33 26 V28" stroke="#141a2b" stroke-width="1.2"/>', trim: '<path d="M25 31 H39 M25 35 H39 M25 39 H39 M32 29 V44" stroke="#8d96a5" stroke-width="1.6"/>', weapon: W.rust }),
  zombie: () => H({ skin: '#8fb08a', body: '#5b5f78', legs: '#454a60', head: `<path d="M24 12 Q32 6 40 12" stroke="#4a5a3a" fill="none" stroke-width="2.4"/>`, face: '<path d="M28 25 H36" stroke="#141a2b"/><circle cx="28.5" cy="19.5" r="1.7" fill="#F6C24A" stroke="none"/>', trim: '<path d="M22 32 L28 38 L24 44" stroke="#2c3045" fill="none" stroke-width="2"/>', weapon: '<rect x="40" y="31" width="17" height="5.5" rx="2.7" fill="#8fb08a"/>' }),
  orc: () => H({ skin: '#5f9a4a', body: '#6b3b2a', legs: '#3a2a20', head: '<path d="M22 14 Q32 6 42 14 L42 16 Q32 12 22 16Z" fill="#2a2a2a"/>', face: '<path d="M29 25 L28 31 L32 26Z M36 25 L37 31 L33 26Z" fill="#fff" stroke="#141a2b" stroke-width="1"/>', trim: '<rect x="21" y="38" width="22" height="4" fill="#9aa3b2"/><circle cx="26" cy="31" r="3" fill="#9aa3b2"/><circle cx="38" cy="31" r="3" fill="#9aa3b2"/>', weapon: W.axe }),
  lich: () => H({ robe: true, skin: '#eaeaf2', body: '#4b2f7a', legs: '#2e1d4d', head: `<path d="M20 22 Q19 4 32 4 Q45 4 44 22 Q40 10 32 10 Q24 10 20 22Z" fill="#33205a"/><circle cx="35.5" cy="19.5" r="2.6" fill="${C.green}"/><circle cx="28.5" cy="19.5" r="2.6" fill="${C.green}"/>`, face: `<path d="M28 26 H36 M30 26 V28.5 M33 26 V28.5" stroke="${OUT}" stroke-width="1.2"/>`, trim: `<path d="M32 30 V58" stroke="${C.green}" stroke-width="2"/><path d="M25 36 H39" stroke="#8a62c9" stroke-width="2"/>`, weapon: W.staff(C.green) }),

  slime: () => `<svg viewBox="0 0 64 64" class="mdl"><g stroke="${OUT}" stroke-width="1.6" stroke-linejoin="round"><path d="M9 57 Q6 30 32 22 Q58 30 55 57 Q32 63 9 57Z" fill="${C.green}"/><path d="M15 38 Q19 31 27 30" stroke="#fff" fill="none" opacity=".7" stroke-width="2.4"/><circle cx="25" cy="43" r="4.6" fill="#fff"/><circle cx="40" cy="43" r="4.6" fill="#fff"/><circle cx="26.5" cy="44" r="2.2" fill="${OUT}"/><circle cx="41.5" cy="44" r="2.2" fill="${OUT}"/><path d="M27 51 Q33 56 38 51" fill="none"/><circle cx="46" cy="30" r="3" fill="${C.green}" opacity=".8"/></g></svg>`,
  wolf: () => `<svg viewBox="0 0 64 64" class="mdl"><g stroke="${OUT}" stroke-width="1.6" stroke-linejoin="round">
    <path d="M14 38 Q2 32 5 18 Q12 26 21 34Z" fill="#6c7587"/>
    <rect x="16" y="45" width="5.5" height="13" rx="2.5" fill="#5d6577"/><rect x="38" y="45" width="5.5" height="13" rx="2.5" fill="#5d6577"/>
    <ellipse cx="30" cy="41" rx="18" ry="10.5" fill="#7d8696"/>
    <rect x="23" y="46" width="5.5" height="12" rx="2.5" fill="#6c7587"/><rect x="44" y="46" width="5.5" height="12" rx="2.5" fill="#6c7587"/>
    <path d="M40 26 L42 13 L50 23Z" fill="#6c7587"/><circle cx="49" cy="31" r="9" fill="#8b94a5"/>
    <path d="M54 29 L64 35 L54 40Z" fill="#a4acbb"/><circle cx="63" cy="35.2" r="1.7" fill="${OUT}"/>
    <circle cx="51.5" cy="29" r="1.8" fill="${C.red}" stroke="none"/><path d="M55 40 l1.5 3 1.5-3z" fill="#fff" stroke="none"/></g></svg>`,
  imp: () => `<svg viewBox="0 0 64 64" class="mdl"><g stroke="${OUT}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
    <path d="M21 32 L4 12 L10 34 L2 32 L19 46Z" fill="#a52d28"/><path d="M43 32 L60 12 L54 34 L62 32 L45 46Z" fill="#a52d28"/>
    <path d="M24 52 Q8 56 8 44" fill="none" stroke="${C.red}" stroke-width="3"/>
    <rect x="25" y="50" width="5" height="9" rx="2" fill="${C.red}"/><rect x="34" y="50" width="5" height="9" rx="2" fill="${C.red}"/>
    <ellipse cx="32" cy="42" rx="10" ry="12" fill="${C.red}"/><circle cx="32" cy="24" r="10.5" fill="#e4524b"/>
    <path d="M24 18 L20 6 L29 14Z M40 18 L44 6 L35 14Z" fill="${C.yellow}"/>
    <circle cx="28" cy="23" r="2.3" fill="${C.yellow}"/><circle cx="36" cy="23" r="2.3" fill="${C.yellow}"/><circle cx="28.4" cy="23" r=".9" fill="${OUT}" stroke="none"/><circle cx="36.4" cy="23" r=".9" fill="${OUT}" stroke="none"/>
    <path d="M27 29 Q32 33 37 29" fill="none"/>${W.trident}</g></svg>`,
  dragon: () => `<svg viewBox="0 0 64 64" class="mdl"><g stroke="${OUT}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">
    <path d="M18 46 Q0 52 2 36 Q8 44 20 40Z" fill="#a8302a"/>
    <path d="M22 36 L8 6 L28 16 L36 2 L42 32Z" fill="#7d231f"/><path d="M14 14 L26 26 M28 16 L32 28" stroke="#5a1814" fill="none"/>
    <rect x="20" y="49" width="7.5" height="11" rx="3" fill="#b33830"/><rect x="36" y="49" width="7.5" height="11" rx="3" fill="#b33830"/>
    <ellipse cx="30" cy="42" rx="20" ry="13" fill="${C.red}"/>
    <path d="M14 48 Q30 59 46 48 Q30 53 14 48Z" fill="${C.yellow}"/>
    <path d="M14 33 L17 27 L20 32 L24 26 L27 31 L31 25 L34 30" fill="none" stroke="${C.yellow}" stroke-width="2.2"/>
    <path d="M40 40 Q52 34 49 22 L58 23 Q61 36 47 47Z" fill="${C.red}"/>
    <ellipse cx="54" cy="19" rx="8.5" ry="6.4" fill="#e4524b"/>
    <path d="M50 14 L46 4 L55 12Z M56 14 L56 4 L61 13Z" fill="${C.yellow}"/>
    <circle cx="56" cy="17" r="2.1" fill="${C.yellow}"/><circle cx="56.4" cy="17" r=".9" fill="${OUT}" stroke="none"/>
    <path d="M60 21 Q63.5 23 60 25.5" fill="none"/><path d="M51 24 Q55 27 59 24" fill="none"/></g></svg>`
};

const _mcache = {};
function modelSVG(key) { return _mcache[key] || (_mcache[key] = (MODEL_SRC[key] ? MODEL_SRC[key]() : '')); }
