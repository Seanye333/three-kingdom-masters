import type { FormationDef } from '../types';

export const FORMATIONS: FormationDef[] = [
  {
    id: 'none',
    name: { en: 'No Formation', zh: '無陣' },
    description: 'Standard loose deployment. No bonuses, no penalties.',
    minIntelligence: 0,
  },
  {
    id: 'fish-scale',
    name: { en: 'Fish Scale', zh: '魚鱗' },
    description:
      'Tight overlapping ranks. Adjacent friendly units share +15% defense. Cao Cao\'s favored formation.',
    minIntelligence: 60,
  },
  {
    id: 'eight-trigrams',
    name: { en: 'Eight Trigrams', zh: '八陣' },
    description:
      'Zhuge Liang\'s masterwork. Allies in formation heal 4% troops per turn; enemies adjacent to two formation units lose 1 AP.',
    minIntelligence: 90,
  },
  {
    id: 'arrow-tip',
    name: { en: 'Arrow Tip', zh: '鋒矢' },
    description:
      'Spearhead deployment. Charge stratagem deals +25% damage; cavalry get +1 movement.',
    minIntelligence: 65,
  },
  {
    id: 'crane-wing',
    name: { en: 'Crane Wing', zh: '鶴翼' },
    description:
      'Wide encircling deployment. Archers and rain-of-arrows gain +1 range.',
    minIntelligence: 70,
  },
  {
    id: 'spread-out',
    name: { en: 'Loose Order', zh: '散開' },
    description:
      'Wide spacing. −40% damage from fire-attack, lightning, and arrow volleys; −10% damage dealt.',
    minIntelligence: 50,
  },
  // ── Attack ──
  {
    id: 'awl',
    name: { en: 'Awl', zh: '錐行' },
    description:
      'V-shaped piercing spearhead. First-turn melee strikes deal +35% damage. Best for ambush opens; loses edge after sustained combat.',
    minIntelligence: 65,
  },
  {
    id: 'wheel',
    name: { en: 'Cart-Wheel', zh: '車懸' },
    description:
      'Front rank rotates back after each charge. Each turn, own losses reduced by an additional 5% (compounding) as fresh ranks engage.',
    minIntelligence: 75,
  },
  // ── Defense ──
  {
    id: 'square',
    name: { en: 'Hollow Square', zh: '方圓' },
    description:
      'Defensive box facing all four sides. +20% defense from any direction, but movement −20%. Cannot be flanked.',
    minIntelligence: 55,
  },
  {
    id: 'crescent-moon',
    name: { en: 'Crescent Moon', zh: '偃月' },
    description:
      'Crescent arc, wings curving back. Immune to encirclement; flank defense +15%. Guan Yu\'s namesake blade.',
    minIntelligence: 70,
  },
  // ── Balance ──
  {
    id: 'wild-goose',
    name: { en: 'Wild Goose', zh: '雁行' },
    description:
      'V-formation of mixed archers and cavalry. Archers +15% damage, all units +10% morale.',
    minIntelligence: 65,
  },
  {
    id: 'trinity',
    name: { en: 'Heaven-Earth-Human', zh: '三才' },
    description:
      'Three coordinated detachments — sky, ground, man. When 3+ allied officers fight together on this side, all stats +10%.',
    minIntelligence: 70,
  },
  // ── High-INT exclusive ──
  {
    id: 'back-to-water',
    name: { en: 'Back to the Water', zh: '背水陣' },
    description:
      'Han Xin\'s death-or-victory deployment at Jingxing. +30% morale, +20% damage, −30% own losses. CANNOT retreat — must win or fall.',
    minIntelligence: 80,
  },
  {
    id: 'ten-ambush',
    name: { en: 'Ten-Sided Ambush', zh: '十面埋伏' },
    description:
      'Han Xin\'s masterpiece at Gaixia. Multi-axis simultaneous strike. +25% surprise damage. Each enemy unit has 20% chance to lose 1 AP per turn (panic).',
    minIntelligence: 95,
  },
  // ── Historical specialty ──
  {
    id: 'long-snake',
    name: { en: 'Long Snake', zh: '長蛇' },
    description:
      'Single-file column for narrow passes and mountain roads. Front damage +25% in mountain/pass terrain, but side attacks deal +20% extra losses.',
    minIntelligence: 60,
  },
  {
    id: 'crescent-withdraw',
    name: { en: 'Crescent Withdrawal', zh: '却月陣' },
    description:
      'Liu Yu\'s riverside formation: armored carts ring a crossbow corps. Archer range +1, archer damage +25%. Movement halved.',
    minIntelligence: 85,
  },
  // ── Anti-cavalry / specialist ──
  {
    id: 'yoke',
    name: { en: 'Yoke', zh: '衡軛' },
    description:
      'V-shaped pikes locked at the joint. +50% damage vs cavalry; no effect vs infantry/archers.',
    minIntelligence: 65,
  },
  {
    id: 'armored-cart',
    name: { en: 'Armored Cart Line', zh: '武剛車' },
    description:
      "Han Wudi's anti-Xiongnu deployment — iron-plated war carts linked in line. +50% defense vs cavalry; movement halved.",
    minIntelligence: 70,
  },
  // ── Daoist / mystical ──
  {
    id: 'seven-star',
    name: { en: 'Seven Star', zh: '七星' },
    description:
      "Beidou ritual deployment after the Northern Dipper. Stratagem range +1 and stratagem success rate +20%. Zhuge Liang's altar layout.",
    minIntelligence: 88,
  },
  {
    id: 'five-elements',
    name: { en: 'Five Elements', zh: '五行' },
    description:
      "Metal / wood / water / fire / earth rotation. Each turn a different element auto-buffs your side: weapons / defense / move / archers / loss-reduction.",
    minIntelligence: 85,
  },
  {
    id: 'four-symbols',
    name: { en: 'Four Symbols', zh: '四象' },
    description:
      "Azure Dragon east attack + White Tiger west defense + Vermilion Bird south fire + Black Tortoise north water. +15% in all directions, capped.",
    minIntelligence: 80,
  },
  // ── Special / regional ──
  {
    id: 'rattan-armor',
    name: { en: 'Rattan-Armor Line', zh: '藤甲' },
    description:
      "Wuge tribesmen in oil-cured rattan. Arrows skid off (−60% archer damage taken), but fire deals 2× damage. Wutugu's signature.",
    minIntelligence: 50,
  },
  {
    id: 'stacked',
    name: { en: 'Layered Shield-Wall', zh: '疊陣' },
    description:
      "Song-era anti-cavalry: front shields, middle pikes, rear crossbows. −40% frontal damage taken; movement −1.",
    minIntelligence: 70,
  },
  {
    id: 'mandarin-duck',
    name: { en: 'Mandarin Duck', zh: '鴛鴦' },
    description:
      "Qi Jiguang's 11-man anti-pirate squad — shield, langxian, pike, fork in one unit. Melee damage +25%, but requires close coordination.",
    minIntelligence: 75,
  },
];

export const FORMATIONS_BY_ID: Record<string, FormationDef> =
  Object.fromEntries(FORMATIONS.map((f) => [f.id, f]));
