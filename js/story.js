'use strict';
/* ============ Campaign stories (EN / TH). dm = Dungeon Master narration cues ============ */
const STORY = {
  goblin: {
    en: {
      chapter: 'Chapter 1 — The Burning Road',
      intro: [
        'Smoke rises over the village of Hollowmere. A goblin war-band has seized the old crossroads and torched every farm along the road.',
        'The villagers say their leader, the Goblin King, wears a crown forged from stolen church bells — and he is not planning to stop.',
        'Your party arrives at dusk. Campfires glow ahead. Somewhere in the dark, a drum begins to beat.',
        'Roll for initiative.'],
      win: 'The Goblin King falls with a clang of bells. His war-band scatters into the woods. By dawn, the fires of Hollowmere are out — and the villagers are already singing your names.',
      lose: 'The drums grow louder as your party falls. Hollowmere burns through the night. Perhaps another band of heroes will finish what you started…',
      dm: {
        start: 'The drums pound. Goblins pour out between the tents — the {boss} watches from his throne of crates.',
        bossIntro: '“Little heroes! I will wear your helmets as my cups!” cackles the Goblin King.',
        firstKill: 'First blood! A goblin tumbles into the dust and the camp falls silent for a heartbeat.',
        heroFall: ['{hero} collapses! The goblins howl with glee.', '{hero} is down — the party must fight on!'],
        heroCrit: ['{hero} spots the perfect opening — a devastating blow!', 'Fortune smiles on {hero}!'],
        bossHalf: 'The Goblin King staggers. “Guards! GUARDS!” he shrieks, spit flying.',
        bossLow: 'The crown tilts over one eye. The Goblin King is desperate — and desperate kings are dangerous.',
        lastStand: 'Only {hero} remains standing. Every die roll now could decide the tale.',
        rareLoot: 'Something gleams in the dust — a treasure worthy of a king!',
        victory: 'The crown clatters to the ground. The Goblin King is no more!',
        defeat: 'Darkness closes in. The goblin drums echo over the fallen party.' }
    },
    th: {
      chapter: 'บทที่ 1 — ถนนที่ลุกเป็นไฟ',
      intro: [
        'ควันโขมงลอยเหนือหมู่บ้านฮอลโลว์เมียร์ กองโจรก็อบลินยึดทางแยกเก่าและเผาไร่นาตลอดสองข้างทางจนวอดวาย',
        'ชาวบ้านเล่าว่าหัวหน้าของพวกมัน คือก็อบลินคิง สวมมงกุฎที่หล่อจากระฆังโบสถ์ที่ปล้นมา และมันไม่คิดจะหยุดเพียงเท่านี้',
        'ปาร์ตี้ของคุณมาถึงตอนพลบค่ำ กองไฟลุกโชนอยู่เบื้องหน้า และที่ไหนสักแห่งในความมืด เสียงกลองเริ่มดังขึ้น',
        'ทอยหาอินิเชียทีฟได้เลย!'],
      win: 'ก็อบลินคิงล้มลงพร้อมเสียงระฆังกังวาน กองโจรแตกกระเจิงเข้าป่า เมื่อรุ่งสาง ไฟในฮอลโลว์เมียร์ก็มอดดับ และชาวบ้านต่างขับขานชื่อของพวกคุณ',
      lose: 'เสียงกลองดังกึกก้องขึ้นเมื่อปาร์ตี้ของคุณล้มลง ฮอลโลว์เมียร์ลุกไหม้ตลอดคืน บางทีอาจมีกลุ่มผู้กล้าอีกกลุ่มมาสานต่อสิ่งที่พวกคุณเริ่มไว้…',
      dm: {
        start: 'เสียงกลองกระหึ่ม ก็อบลินทะลักออกมาจากระหว่างเต็นท์ — {boss} จ้องมองจากบัลลังก์ลังไม้',
        bossIntro: '“เหล่าผู้กล้าตัวจิ๋ว! ข้าจะเอาหมวกเหล็กของพวกเจ้าไปทำเป็นแก้วเหล้า!” ก็อบลินคิงหัวเราะคิกคัก',
        firstKill: 'เลือดหยดแรก! ก็อบลินตัวหนึ่งล้มลงกับพื้น ค่ายเงียบกริบไปชั่วอึดใจ',
        heroFall: ['{hero} ล้มลง! เหล่าก็อบลินโห่ร้องด้วยความสะใจ', '{hero} ไม่ไหวแล้ว — ปาร์ตี้ต้องสู้ต่อไป!'],
        heroCrit: ['{hero} เห็นช่องโหว่พอดี — ฟาดเข้าอย่างสุดแรง!', 'โชคชะตายิ้มให้ {hero}!'],
        bossHalf: 'ก็อบลินคิงเซถอย “ทหาร! ทหารรรร!” มันกรีดร้องน้ำลายกระเซ็น',
        bossLow: 'มงกุฎเอียงปิดตาข้างหนึ่ง ก็อบลินคิงสิ้นไร้ไม้ตอก — และราชาที่จนตรอกนั้นอันตรายที่สุด',
        lastStand: 'เหลือเพียง {hero} ที่ยังยืนอยู่ ลูกเต๋าทุกลูกจากนี้อาจตัดสินชะตาเรื่องราว',
        rareLoot: 'บางอย่างส่องประกายในฝุ่น — สมบัติที่คู่ควรกับราชา!',
        victory: 'มงกุฎตกกระทบพื้นดังกริ๊ง ก็อบลินคิงสิ้นชีพแล้ว!',
        defeat: 'ความมืดโรยตัวเข้ามา เสียงกลองก็อบลินก้องเหนือปาร์ตี้ที่ล้มลง' }
    }
  },
  crypt: {
    en: {
      chapter: 'Chapter 2 — The Silent Crypt',
      intro: [
        'Beneath the ruined abbey of Saint Veria lies a crypt that has been silent for three hundred years. Last week, the silence ended.',
        'Graves have opened. Skeletons march at night. The monks who fled speak of a Lich Lord, Morvane the Pale, who seeks the Moonstone buried below.',
        'The crypt door groans open at your touch. Cold air, candlelight lit by no living hand, and the clatter of bones in the dark.',
        'The dead are waiting.'],
      win: "Morvane's phylactery cracks and the crypt exhales for the first time in centuries. The candles go out, one by one — and this time, they stay out.",
      lose: 'Your names are added to the long list carved on the crypt walls. The dead have gained new recruits.',
      dm: {
        start: 'Candles flicker as bones rattle to life. At the far end of the crypt, the {boss} raises a pale hand.',
        bossIntro: '“Another tomb-robber… how delightful,” whispers Morvane. “You will serve me well.”',
        firstKill: 'A skeleton crumbles into dust. The crypt echoes with a hollow, mocking laugh.',
        heroFall: ['{hero} falls — and the shadows lean in closer.', '{hero} drops to the cold stone. The dead cheer in silence.'],
        heroCrit: ['{hero} strikes true — bone splinters and dark magic hisses!', 'A perfect blow from {hero}!'],
        bossHalf: "Morvane's robes tatter and green flame burns in his eye sockets. “Enough games!”",
        bossLow: "The Lich Lord's form flickers. He is nearly spent — finish him!",
        lastStand: 'Only {hero} remains standing. Every die roll now could decide the tale.',
        rareLoot: 'A relic glints in the ash — blessed steel, untouched by the curse.',
        victory: "The Lich Lord's skull cracks and the green fire dies. The crypt falls silent.",
        defeat: "The candles gutter. Morvane's laughter fills the crypt." }
    },
    th: {
      chapter: 'บทที่ 2 — สุสานแห่งความเงียบ',
      intro: [
        'ใต้ซากอารามเซนต์เวเรียมีสุสานที่เงียบสงัดมาสามร้อยปี แต่เมื่อสัปดาห์ก่อน ความเงียบนั้นก็จบลง',
        'หลุมศพเปิดออก โครงกระดูกเดินพาเหรดยามค่ำคืน เหล่าพระที่หนีรอดมาเล่าถึงลิชลอร์ด มอร์เวนผู้ซีดเผือด ผู้ตามหามูนสโตนที่ฝังอยู่เบื้องล่าง',
        'ประตูสุสานลั่นเอี๊ยดเมื่อคุณแตะ ลมเย็นเยียบ แสงเทียนที่ไม่มีมือคนจุด และเสียงกระดูกกระทบกันในความมืด',
        'เหล่าผู้ตายกำลังรออยู่'],
      win: 'กรอบวิญญาณของมอร์เวนแตกร้าว สุสานถอนหายใจเป็นครั้งแรกในรอบหลายศตวรรษ เทียนดับลงทีละเล่ม — และครั้งนี้มันดับไปตลอดกาล',
      lose: 'ชื่อของพวกคุณถูกสลักต่อท้ายรายชื่อยาวเหยียดบนผนังสุสาน เหล่าผู้ตายได้พลพรรคใหม่',
      dm: {
        start: 'เปลวเทียนไหววูบเมื่อกระดูกขยับตื่น ที่ปลายสุสาน {boss} ยกมือซีดเซียวขึ้น',
        bossIntro: '“นักขุดสุสานอีกแล้วรึ… น่ายินดีนัก” มอร์เวนกระซิบ “เจ้าจะเป็นข้ารับใช้ที่ดี”',
        firstKill: 'โครงกระดูกตัวหนึ่งสลายเป็นผุยผง สุสานสะท้อนเสียงหัวเราะกลวงโบ๋เยาะเย้ย',
        heroFall: ['{hero} ล้มลง — และเงามืดก็เข้ามาใกล้กว่าเดิม', '{hero} ทรุดลงบนพื้นหินเย็นเฉียบ เหล่าผู้ตายส่งเสียงเชียร์อย่างเงียบงัน'],
        heroCrit: ['{hero} ฟาดเข้าเต็มแรง — กระดูกแตกกระจาย มนตร์ดำส่งเสียงฟู่!', 'การโจมตีสมบูรณ์แบบจาก {hero}!'],
        bossHalf: 'เสื้อคลุมของมอร์เวนขาดวิ่น เปลวไฟสีเขียวลุกในเบ้าตา “พอกันที!”',
        bossLow: 'ร่างของลิชลอร์ดกะพริบวูบวาบ มันใกล้หมดแรงแล้ว — จัดการเลย!',
        lastStand: 'เหลือเพียง {hero} ที่ยังยืนอยู่ ลูกเต๋าทุกลูกจากนี้อาจตัดสินชะตาเรื่องราว',
        rareLoot: 'ของล้ำค่าส่องแสงในเถ้าถ่าน — อาวุธศักดิ์สิทธิ์ที่คำสาปแตะต้องไม่ได้',
        victory: 'กะโหลกของลิชลอร์ดแตกร้าว เปลวเขียวมอดดับ สุสานกลับสู่ความเงียบ',
        defeat: 'เปลวเทียนริบหรี่ เสียงหัวเราะของมอร์เวนก้องไปทั่วสุสาน' }
    }
  },
  dragon: {
    en: {
      chapter: "Chapter 3 — The Dragon's Peak",
      intro: [
        'For a hundred winters the mountain Karn Ashtor slept. Then the sky turned red, and three villages vanished in a single night.',
        "Orc warbands now march under the dragon's shadow, hellspawn crawl from the lava vents, and wolves run wild with burning eyes.",
        'At the summit waits Pyrrhax, the Ember Dragon, coiled on a hoard that has never been counted.',
        'Few who climb Dragon\'s Peak come back. Check your gear — and your courage.'],
      win: 'Pyrrhax crashes down in a shower of sparks, and the mountain trembles one final time. When the ash settles, the sky is blue again. Bards will sing of this day for a thousand years.',
      lose: 'The mountain swallows your party in fire and ash. The sky stays red, and another village prepares to vanish…',
      dm: {
        start: 'Heat shimmers over the ridge. Orcs bellow, imps cackle — and above them, the {boss} unfurls vast wings.',
        bossIntro: '“Mortals dare climb MY mountain?” Pyrrhax\'s voice rumbles like a landslide.',
        firstKill: 'The first foe falls! Pyrrhax narrows burning golden eyes.',
        heroFall: ['{hero} is struck down in a burst of flame!', '{hero} collapses in the ashes. The mountain seems to laugh.'],
        heroCrit: ['{hero} lands a legendary blow — even the dragon flinches!', 'What a strike from {hero}!'],
        bossHalf: 'Scales crack and ember-blood drips from the wound. Pyrrhax inhales deeply — a firestorm is coming!',
        bossLow: 'The Ember Dragon staggers, wings dragging. One more push!',
        lastStand: 'Only {hero} remains standing. Every die roll now could decide the tale.',
        rareLoot: "Among the cinders: a piece of the dragon's legendary hoard!",
        victory: 'With a final roar, the Ember Dragon crashes to the earth!',
        defeat: "Fire swallows the summit. Pyrrhax's roar echoes across the valley." }
    },
    th: {
      chapter: 'บทที่ 3 — ยอดเขามังกร',
      intro: [
        'ร้อยฤดูหนาวที่ภูเขาคาร์นแอชเตอร์หลับใหล จนกระทั่งท้องฟ้าเปลี่ยนเป็นสีแดง และหมู่บ้านสามแห่งหายไปในคืนเดียว',
        'ตอนนี้กองทัพออร์คเดินทัพใต้เงามังกร เหล่าปีศาจคลานขึ้นจากปล่องลาวา และหมาป่าตาลุกเป็นไฟวิ่งพล่านไปทั่ว',
        'บนยอดเขา ไพร์แร็กซ์ มังกรเอมเบอร์ ขดตัวอยู่บนกองสมบัติที่ไม่เคยมีใครนับได้',
        'น้อยคนนักที่ขึ้นยอดเขามังกรแล้วได้กลับลงมา ตรวจอุปกรณ์ให้พร้อม — และเตรียมความกล้าไว้ด้วย'],
      win: 'ไพร์แร็กซ์ร่วงลงพร้อมประกายไฟ ภูเขาสั่นสะเทือนเป็นครั้งสุดท้าย เมื่อเถ้าถ่านจางลง ท้องฟ้าก็กลับเป็นสีฟ้า เหล่าบาร์ดจะขับขานเรื่องราววันนี้ไปอีกพันปี',
      lose: 'ภูเขากลืนปาร์ตี้ของคุณในเปลวไฟและเถ้าถ่าน ท้องฟ้ายังคงแดงฉาน และหมู่บ้านอีกแห่งกำลังจะหายไป…',
      dm: {
        start: 'ไอร้อนระอุเหนือสันเขา ออร์คคำราม อิมป์หัวเราะคิก — และเหนือพวกมัน {boss} กางปีกกว้าง',
        bossIntro: '“มนุษย์กล้าปีนภูเขาของข้าหรือ?” เสียงของไพร์แร็กซ์ดังกระหึ่มราวดินถล่ม',
        firstKill: 'ศัตรูตัวแรกล้มลง! ไพร์แร็กซ์หรี่ตาสีทองที่ลุกโชน',
        heroFall: ['{hero} ถูกเปลวไฟระเบิดใส่จนล้มลง!', '{hero} ทรุดลงกลางเถ้าถ่าน ภูเขาราวกับกำลังหัวเราะ'],
        heroCrit: ['{hero} ฟาดแจ๊กพอต — แม้แต่มังกรยังสะดุ้ง!', 'ช่างเป็นการโจมตีที่ยอดเยี่ยมจาก {hero}!'],
        bossHalf: 'เกล็ดร้าวและเลือดร้อนหยดจากบาดแผล ไพร์แร็กซ์สูดหายใจลึก — พายุไฟกำลังมา!',
        bossLow: 'มังกรเอมเบอร์เซถลา ปีกลากพื้น อีกนิดเดียว!',
        lastStand: 'เหลือเพียง {hero} ที่ยังยืนอยู่ ลูกเต๋าทุกลูกจากนี้อาจตัดสินชะตาเรื่องราว',
        rareLoot: 'ท่ามกลางเถ้าถ่าน: ชิ้นส่วนจากกองสมบัติในตำนานของมังกร!',
        victory: 'ด้วยเสียงคำรามครั้งสุดท้าย มังกรเอมเบอร์ร่วงลงสู่พื้นดิน!',
        defeat: 'ไฟกลืนยอดเขา เสียงคำรามของไพร์แร็กซ์ก้องไปทั่วหุบเขา' }
    }
  }
};
const story = id => (STORY[id] && STORY[id][LANG]) || (STORY[id] && STORY[id].en) || null;
