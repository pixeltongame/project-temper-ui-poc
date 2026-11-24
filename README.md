# Dice & Dungeons – auto-battle demo

Open `index.html` in a browser. No server, no build, no external assets (art is generated in code).

Flow: pick up to 4 heroes (8 classes) → pick a campaign → watch the party fight automatically.

- Grid map, initiative order, d20 attack rolls vs AC, damage dice, crits/fumbles.
- Units have HP / MP / SP. Moving costs SP; skills cost MP or SP; both regenerate each turn.
- AI picks the best move + action (basic attack, skill, heal, buff, potion, loot run).
- Monsters/bosses drop loot (potions, gold, gear); heroes walk over it to pick it up.
- Toggle **Model** (SVG characters) / **Chip** (emoji token) at the top right. Speed 1×/2×/4×, pause, sound toggle.
- Demo shortcut: `index.html?party=knight,mage,cleric,rogue&camp=goblin&speed=2&view=chip`
  (classes: knight mage rogue cleric ranger barbarian paladin bard · camps: goblin crypt dragon)

Files: `js/data.js` (classes/monsters/campaigns), `js/engine.js` (rules + AI), `js/models.js` (SVG art), `js/ui.js` (animation/dice/FX), `js/main.js` (screens).
