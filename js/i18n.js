'use strict';
/* ============ i18n: English / Thai ============ */
let LANG = 'en';
try { LANG = localStorage.getItem('dd_lang') || 'en'; } catch (e) { }
if (LANG !== 'en' && LANG !== 'th') LANG = 'en';

// English name/phrase -> Thai (names of classes, skills, monsters, items ...)
const TH = {
  // classes & heroes
  'Knight': 'อัศวิน', 'Mage': 'จอมเวท', 'Rogue': 'โจร', 'Cleric': 'นักบวช', 'Ranger': 'เรนเจอร์', 'Barbarian': 'บาร์บาเรียน', 'Paladin': 'พาลาดิน', 'Bard': 'บาร์ด',
  'Aldric': 'อัลดริก', 'Elara': 'เอลารา', 'Vex': 'เว็กซ์', 'Mira': 'มิรา', 'Fenn': 'เฟนน์', 'Brug': 'บรูก', 'Seraph': 'เซราฟ', 'Lyric': 'ลิริก',
  'Tank': 'แทงค์', 'Burst Caster': 'จอมเวทระเบิด', 'Assassin': 'นักฆ่า', 'Healer': 'ผู้รักษา', 'Archer': 'นักธนู', 'Bruiser': 'ตัวลุย', 'Holy Knight': 'อัศวินศักดิ์สิทธิ์', 'Support': 'ซัพพอร์ต',
  // hero skills
  'Longsword': 'ดาบยาว', 'Shield Bash': 'กระแทกโล่', 'Guard Stance': 'ท่าตั้งการ์ด', 'Arcane Bolt': 'ลูกเวทอาคม', 'Frost Bolt': 'ลูกเวทน้ำแข็ง', 'Fireball': 'ลูกไฟ',
  'Dagger': 'กริช', 'Backstab': 'แทงข้างหลัง', 'Poison Blade': 'ใบมีดพิษ', 'Mace': 'กระบองเหล็ก', 'Holy Smite': 'พลังศักดิ์สิทธิ์', 'Healing Word': 'วาจาเยียวยา', 'Mass Heal': 'เยียวยาหมู่',
  'Shortbow': 'ธนูสั้น', 'Power Shot': 'ยิงเต็มแรง', 'Arrow Volley': 'ห่าธนู', 'Greataxe': 'ขวานใหญ่', 'Reckless Strike': 'ฟาดไม่คิดชีวิต', 'Whirlwind': 'พายุหมุน',
  'Warhammer': 'ค้อนสงคราม', 'Divine Smite': 'ฟาดศักดิ์สิทธิ์', 'Lay on Hands': 'สัมผัสเยียวยา', 'Sharp Note': 'โน้ตแหลมคม', 'Inspire': 'เร้าใจ', 'Soothing Song': 'บทเพลงปลอบประโลม',
  // monsters
  'Goblin': 'ก็อบลิน', 'Goblin Archer': 'ก็อบลินนักธนู', 'Wolf': 'หมาป่า', 'Skeleton': 'โครงกระดูก', 'Zombie': 'ซอมบี้', 'Acid Slime': 'สไลม์กรด', 'Fire Imp': 'อิมป์ไฟ', 'Orc': 'ออร์ค',
  'Goblin King': 'ก็อบลินคิง', 'Lich Lord': 'ลิชลอร์ด', 'Ember Dragon': 'มังกรเอมเบอร์',
  'Rusty Blade': 'ดาบสนิม', 'Crude Bow': 'ธนูหยาบ', 'Bite': 'กัด', 'Bone Blade': 'ดาบกระดูก', 'Rotten Slam': 'ทุบเน่าๆ', 'Acid Touch': 'สัมผัสกรด', 'Claw': 'กรงเล็บ', 'Firebolt': 'ลูกไฟจิ๋ว',
  'Battle Axe': 'ขวานศึก', 'Savage Swing': 'ฟาดโหด', 'Spiked Mace': 'กระบองหนาม', 'War Stomp': 'กระทืบสงคราม', 'Rally Cry': 'เสียงปลุกใจ', 'Grave Touch': 'สัมผัสหลุมศพ', 'Shadow Bolt': 'ลูกเวทเงามืด',
  'Death Nova': 'โนวาแห่งความตาย', 'Drain Life': 'ดูดชีวิต', 'Fire Breath': 'พ่นไฟ', 'Tail Sweep': 'หางกวาด',
  // items
  'Gold': 'เหรียญทอง', 'Healing Potion': 'ยาฟื้นฟู HP', 'Mana Potion': 'ยาฟื้นฟู MP', 'Stamina Tonic': 'ยาบำรุงกำลัง',
  'Restores 2d6+4 HP': 'ฟื้นฟู HP 2d6+4', 'Restores 10 MP': 'ฟื้นฟู MP 10', 'Restores 10 SP': 'ฟื้นฟู SP 10',
  'Sharp Edge': 'ใบดาบคมกริบ', 'Chain Vest': 'เสื้อเกราะโซ่', 'Vitality Charm': 'เครื่องรางพลังชีวิต', 'Lucky Ring': 'แหวนนำโชค', 'Iron Buckler': 'โล่เหล็กเล็ก', 'Whetstone': 'หินลับดาบ',
  'Dragonfang Blade': 'ดาบเขี้ยวมังกร', 'Mythril Mail': 'เกราะมิธริล', 'Archmage Orb': 'ลูกแก้วจอมเวท', 'Crown of Valor': 'มงกุฎแห่งความกล้า',
  // campaigns
  'Goblin Camp': 'ค่ายก็อบลิน', 'Crypt of the Forgotten': 'สุสานแห่งผู้ถูกลืม', "Dragon's Peak": 'ยอดเขามังกร'
};

const TXT = {
  en: {
    'title': 'Dice & Dungeons – Auto Battle', 'sub': 'Auto-battle demo · no backend',
    'step.party': '1 · Party', 'step.campaign': '2 · Campaign', 'step.story': '3 · Story', 'step.battle': '4 · Battle',
    'view.model': '🧍 Model', 'view.chip': '⚪ Chip',
    'party.h': 'Choose your party', 'party.p': 'Pick up to 4 heroes. Mix tanks, healers and damage dealers.',
    'btn.rand': '🎲 Random party', 'btn.clear': 'Clear', 'btn.toCamp': 'Choose campaign →', 'btn.backParty': '← Party', 'btn.start': '⚔ Start adventure',
    'camp.h': 'Choose a campaign', 'camp.p': 'A story awaits. Then your party fights automatically — roll the dice and watch.',
    'story.begin': '⚔ Begin battle ▶', 'story.back': '← Campaign', 'story.heroes': 'Your party',
    'btn.quit': '✕ Quit', 'h.party': 'Party', 'h.enemies': 'Enemies', 'h.inv': 'Inventory', 'h.log': 'Battle log',
    'round': 'Round {n}', 'remove': 'Click to remove',
    'stats': 'AC {ac} · ATK +{atk} · DMG +{mod} · MOVE {mv}', 'buff': 'buff', 'aoe': 'AoE', 'diff': 'Difficulty', 'boss': 'BOSS:',
    'dm': 'DM', 'dm.wait': 'The Dungeon Master takes a breath…',
    'd.vs': 'Attack roll vs AC {ac}', 'd.crit': 'CRITICAL HIT!', 'd.fumble': 'FUMBLE!', 'd.hit': 'HIT!', 'd.miss': 'MISS', 'd.dmg': 'DMG', 'd.heal': 'HEAL',
    'f.miss': 'MISS', 'f.fumble': 'FUMBLE', 'f.crit': 'CRITICAL!', 'f.hold': '💤', 'f.stunned': '💫 Stunned',
    'st.stun': 'Stunned', 'st.burn': 'Burning', 'st.poison': 'Poisoned', 'st.guard': 'Guarded', 'st.inspire': 'Inspired',
    'dot.burn': 'burn', 'dot.poison': 'poison',
    'ban.win': '🏆 VICTORY!', 'ban.lose': '💀 DEFEAT', 'ban.retreat': '⌛ RETREAT',
    'res.win': '🏆 Victory!', 'res.lose': '💀 Defeat', 'res.retreat': '⌛ The party retreated', 'res.sub': '{c} · {r} rounds · 💰 {g} gold',
    'res.hero': 'Hero', 'res.status': 'Status', 'res.dmg': 'Damage', 'res.healed': 'Healed', 'res.kills': 'Kills', 'res.gear': 'Gear', 'res.fallen': '🪦 fallen',
    'res.loot': 'Loot collected', 'res.none': 'Nothing collected', 'res.newparty': 'New party', 'res.othercamp': 'Other campaign', 'res.again': '⚔ Play again', 'mvp': '★ MVP',
    'log.start': '⚔ {c}: {h} vs {n} foes.', 'log.init': 'Initiative rolled!', 'log.order': 'Order: {l}', 'log.round': '— Round {n} —',
    'log.loot': '{u} looted {i}.', 'log.lootEq': '{u} looted {i} (equipped).', 'log.dead': '{u} is defeated!',
    'log.buff': '{u} uses {s}.', 'log.heal': '{u} casts {s}.', 'log.aoe': '{u} unleashes {s}!',
    'log.miss': "{u}'s {s} misses {t} ({r}+{b}={tot} vs AC {ac}).", 'log.fumble': "{u}'s {s} fumbles against {t} ({r}+{b}={tot} vs AC {ac}).",
    'log.hit': '{u} hits {t} with {s} for {d} damage.', 'log.crit': '{u} CRITS {t} with {s} for {d} damage!',
    'log.resist': '{t} resists the stun!', 'log.stunned': '{t} is stunned!', 'log.burning': '{t} is burning!', 'log.poisoned': '{t} is poisoned!',
    'log.potion': '{u} drinks a {p}.', 'log.dot': '{u} suffers {d} {k} damage.', 'log.stunskip': '{u} is stunned and loses the turn.',
    'log.advance': '{u} advances.', 'log.loothead': '{u} heads for loot.', 'log.support': '{u} moves to support allies.', 'log.hold': '{u} holds position.',
    'log.spoils': 'The party gathers the spoils.', 'log.drop': '{u} dropped {i}.'
  },
  th: {
    'title': 'Dice & Dungeons – ต่อสู้อัตโนมัติ', 'sub': 'เดโมต่อสู้อัตโนมัติ · ไม่ต้องมีแบ็กเอนด์',
    'step.party': '1 · ปาร์ตี้', 'step.campaign': '2 · แคมเปญ', 'step.story': '3 · เรื่องราว', 'step.battle': '4 · ต่อสู้',
    'view.model': '🧍 โมเดล', 'view.chip': '⚪ ชิป',
    'party.h': 'เลือกปาร์ตี้ของคุณ', 'party.p': 'เลือกฮีโร่ได้สูงสุด 4 คน ผสมแทงค์ ผู้รักษา และสายดาเมจให้สมดุล',
    'btn.rand': '🎲 สุ่มปาร์ตี้', 'btn.clear': 'ล้าง', 'btn.toCamp': 'เลือกแคมเปญ →', 'btn.backParty': '← ปาร์ตี้', 'btn.start': '⚔ เริ่มการผจญภัย',
    'camp.h': 'เลือกแคมเปญ', 'camp.p': 'เรื่องราวกำลังรออยู่ จากนั้นปาร์ตี้จะต่อสู้เองอัตโนมัติ — ทอยเต๋าแล้วนั่งชมได้เลย',
    'story.begin': '⚔ เริ่มต่อสู้ ▶', 'story.back': '← แคมเปญ', 'story.heroes': 'ปาร์ตี้ของคุณ',
    'btn.quit': '✕ ออก', 'h.party': 'ปาร์ตี้', 'h.enemies': 'ศัตรู', 'h.inv': 'กระเป๋า', 'h.log': 'บันทึกการต่อสู้',
    'round': 'รอบที่ {n}', 'remove': 'คลิกเพื่อเอาออก',
    'stats': 'AC {ac} · โจมตี +{atk} · ดาเมจ +{mod} · เดิน {mv}', 'buff': 'บัฟ', 'aoe': 'วงกว้าง', 'diff': 'ความยาก', 'boss': 'บอส:',
    'dm': 'DM', 'dm.wait': 'ดันเจี้ยนมาสเตอร์กำลังหายใจลึกๆ…',
    'd.vs': 'ทอยโจมตี เทียบ AC {ac}', 'd.crit': 'คริติคอล!', 'd.fumble': 'พลาดหนัก!', 'd.hit': 'โดน!', 'd.miss': 'พลาด', 'd.dmg': 'ดาเมจ', 'd.heal': 'ฮีล',
    'f.miss': 'พลาด', 'f.fumble': 'พลาดหนัก', 'f.crit': 'คริติคอล!', 'f.hold': '💤', 'f.stunned': '💫 มึนงง',
    'st.stun': 'มึนงง', 'st.burn': 'ไฟลวก', 'st.poison': 'ติดพิษ', 'st.guard': 'ตั้งการ์ด', 'st.inspire': 'ฮึกเหิม',
    'dot.burn': 'ไฟลวก', 'dot.poison': 'พิษ',
    'ban.win': '🏆 ชัยชนะ!', 'ban.lose': '💀 พ่ายแพ้', 'ban.retreat': '⌛ ถอยทัพ',
    'res.win': '🏆 ชัยชนะ!', 'res.lose': '💀 พ่ายแพ้', 'res.retreat': '⌛ ปาร์ตี้ถอยทัพ', 'res.sub': '{c} · {r} รอบ · 💰 {g} ทอง',
    'res.hero': 'ฮีโร่', 'res.status': 'สถานะ', 'res.dmg': 'ดาเมจ', 'res.healed': 'ฮีล', 'res.kills': 'สังหาร', 'res.gear': 'อุปกรณ์', 'res.fallen': '🪦 ล้มลง',
    'res.loot': 'ของที่เก็บได้', 'res.none': 'ไม่ได้เก็บอะไรเลย', 'res.newparty': 'เลือกปาร์ตี้ใหม่', 'res.othercamp': 'แคมเปญอื่น', 'res.again': '⚔ เล่นอีกครั้ง', 'mvp': '★ MVP',
    'log.start': '⚔ {c}: {h} ปะทะศัตรู {n} ตัว', 'log.init': 'ทอยอินิเชียทีฟ!', 'log.order': 'ลำดับ: {l}', 'log.round': '— รอบที่ {n} —',
    'log.loot': '{u} เก็บ {i} ได้', 'log.lootEq': '{u} เก็บ {i} และสวมใส่ทันที', 'log.dead': '{u} พ่ายแพ้แล้ว!',
    'log.buff': '{u} ใช้ {s}', 'log.heal': '{u} ร่าย {s}', 'log.aoe': '{u} ปล่อย {s}!',
    'log.miss': '{s} ของ {u} พลาด {t} ({r}+{b}={tot} เทียบ AC {ac})', 'log.fumble': '{u} ใช้ {s} พลาดหนักใส่ {t} ({r}+{b}={tot} เทียบ AC {ac})',
    'log.hit': '{u} ใช้ {s} โจมตี {t} เสียหาย {d}', 'log.crit': '{u} คริติคอลใส่ {t} ด้วย {s} เสียหาย {d}!',
    'log.resist': '{t} ต้านทานการมึนงงได้!', 'log.stunned': '{t} มึนงง!', 'log.burning': '{t} ถูกไฟลวก!', 'log.poisoned': '{t} ติดพิษ!',
    'log.potion': '{u} ดื่ม {p}', 'log.dot': '{u} ได้รับความเสียหาย {d} จาก{k}', 'log.stunskip': '{u} มึนงงและเสียเทิร์น',
    'log.advance': '{u} รุกเข้าไป', 'log.loothead': '{u} มุ่งไปเก็บของ', 'log.support': '{u} เข้าไปช่วยเพื่อน', 'log.hold': '{u} ยืนหยัดอยู่กับที่',
    'log.spoils': 'ปาร์ตี้เก็บของรางวัล', 'log.drop': '{u} ทำ {i} หล่น'
  }
};
// longer descriptive texts (Thai only; English comes from data.js)
const TXT_TH_DESC = {
  'cls.knight': 'นักรบเกราะหนักแนวหน้า ทนทาน และใช้โล่กระแทกให้ศัตรูมึนงง',
  'cls.mage': 'ดาเมจสูงแต่เปราะบาง ลูกไฟถล่มเป็นกลุ่ม เวทน้ำแข็งแรงสะใจ',
  'cls.rogue': 'ตัวเร็วที่คริติคอลง่าย พร้อมใบมีดอาบพิษ',
  'cls.cleric': 'คอยรักษาปาร์ตี้ให้รอด และลงทัณฑ์ศัตรูด้วยพลังศักดิ์สิทธิ์',
  'cls.ranger': 'สายดาเมจระยะไกล เดินถอยยิงและโปรยห่าธนู',
  'cls.barbarian': 'เลือดเยอะ ขวานใหญ่ พายุหมุนฟาดทุกคนรอบตัว',
  'cls.paladin': 'นักรบสายประชิดที่ทนทาน ทั้งโจมตีศักดิ์สิทธิ์และรักษาเพื่อนได้',
  'cls.bard': 'ปลุกใจเพื่อน (+2 โจมตี/ดาเมจ) และรักษาด้วยบทเพลง',
  'camp.goblin': 'กองโจรก็อบลินตั้งค่ายอยู่ข้างถนนเก่า ฝ่าฝูงลิ่วล้อไปล้มราชาของพวกมัน',
  'camp.crypt': 'ที่นี่ผู้ตายไม่ได้หลับใหล ลิชลอร์ดบัญชาโครงกระดูก ซอมบี้ และอิมป์ต้องคำสาป',
  'camp.dragon': 'ออร์ค ปีศาจ และหมาป่าเฝ้ารังของมังกรเอมเบอร์ เตรียมทีมที่แกร่งที่สุดไปด้วย'
};

/* helpers */
function tr(s) { return LANG === 'th' && TH[s] ? TH[s] : s; }
function t(k, v) {
  let s = (TXT[LANG] && TXT[LANG][k]) || TXT.en[k] || k;
  if (v) s = s.replace(/\{(\w+)\}/g, (m, a) => v[a] != null ? v[a] : m);
  return s;
}
const tdesc = (key, fb) => (LANG === 'th' && TXT_TH_DESC[key]) || fb;
const dn = u => tr(u.base) + (u.suffix || '');
const itemName = it => it.kind === 'gold' ? `${it.amount} ${tr('Gold')}` : tr(it.name);
function setLangValue(l) { LANG = l; try { localStorage.setItem('dd_lang', l); } catch (e) { } }
