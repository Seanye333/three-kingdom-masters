import type { Skill } from '../types';

/**
 * RTK-style innate skills. Each officer carries 0–4 of these and the combat
 * system reads them off the (commander + companions) side to apply bonuses.
 *
 * Naming follows RTK14 conventions; effects are tuned so a single elite skill
 * is worth roughly +10 raw stat points in the blended battle score.
 */
export const SKILLS: Skill[] = [
  // ─────────── Tier-S combat (defining skills of legendary warriors) ───────────
  {
    id: 'god-of-war',
    name: { en: 'God of War', zh: '武神' },
    category: 'combat',
    description:
      'A peerless warrior. +15 war in melee, +20% chance to win a duel.',
    combat: { warBonus: 15, duelChanceBonus: 0.2 },
  },
  {
    id: 'flying-general',
    name: { en: 'Flying General', zh: '飛将' },
    category: 'combat',
    description:
      'No mortal can stand against them. +18 war and a 15% chance to triple losses inflicted on the enemy.',
    combat: { warBonus: 18, enemyLossMultiplier: 1.15 },
  },
  {
    id: 'sage-of-war',
    name: { en: 'Sage of War', zh: '兵聖' },
    category: 'combat',
    description: 'Mastery of every battlefield. +12 war, +8 leadership.',
    combat: { warBonus: 12, leadershipBonus: 8 },
  },
  {
    id: 'tiger-vanguard',
    name: { en: 'Tiger Vanguard', zh: '虎臣' },
    category: 'combat',
    description: 'Spearhead of any host. +10 war and a 10% boost to attack power.',
    combat: { warBonus: 10, powerMultiplier: 1.1 },
  },
  {
    id: 'iron-vow',
    name: { en: 'Iron Vow', zh: '鉄誓' },
    category: 'combat',
    description: 'Sworn to victory or death. +8 war and 10% lower own losses.',
    combat: { warBonus: 8, ownLossMultiplier: 0.9 },
  },

  // ─────────── Command (formation, troop discipline) ───────────
  {
    id: 'celestial-tactician',
    name: { en: 'Celestial Tactician', zh: '神算' },
    category: 'wisdom',
    description:
      'Reads every move before it is made. +12 leadership and +10% power on this side.',
    combat: { leadershipBonus: 12, powerMultiplier: 1.1 },
  },
  {
    id: 'crouching-dragon',
    name: { en: 'Crouching Dragon', zh: '臥龍' },
    category: 'wisdom',
    description:
      'Strategies that move heaven. +15 leadership; enemy stratagem effects halved.',
    combat: { leadershipBonus: 15, defenseMultiplier: 1.1 },
  },
  {
    id: 'young-phoenix',
    name: { en: 'Young Phoenix', zh: '鳳雛' },
    category: 'wisdom',
    description: 'Genius equal to the Dragon. +13 leadership and +10% power.',
    combat: { leadershipBonus: 13, powerMultiplier: 1.1 },
  },
  {
    id: 'iron-formation',
    name: { en: 'Iron Formation', zh: '鉄壁' },
    category: 'command',
    description: 'Defensive lines unbreakable. +10 leadership and 15% less own losses.',
    combat: { leadershipBonus: 10, ownLossMultiplier: 0.85 },
  },
  {
    id: 'imposing-host',
    name: { en: 'Imposing Host', zh: '威風' },
    category: 'command',
    description: 'Sheer presence shakes the enemy. +8 leadership and +5% power.',
    combat: { leadershipBonus: 8, powerMultiplier: 1.05 },
  },
  {
    id: 'siegemaster',
    name: { en: 'Siegemaster', zh: '攻城' },
    category: 'command',
    description: 'City walls hold no fear. +20% power when attacking a city.',
    combat: { powerMultiplier: 1.2 },
  },
  {
    id: 'wallwarden',
    name: { en: 'Wallwarden', zh: '守城' },
    category: 'command',
    description: 'A garrison commander without peer. Defending city defense ×1.3.',
    combat: { defenseMultiplier: 1.3 },
  },

  // ─────────── Wisdom / stratagems ───────────
  {
    id: 'fire-master',
    name: { en: 'Fire Master', zh: '火神' },
    category: 'wisdom',
    description: 'Master of fire attacks. Enemy losses ×1.2.',
    combat: { enemyLossMultiplier: 1.2 },
  },
  {
    id: 'ambush-master',
    name: { en: 'Ambush Master', zh: '伏兵' },
    category: 'wisdom',
    description: 'Sets impossible traps. Enemy losses ×1.15 and +5 leadership.',
    combat: { enemyLossMultiplier: 1.15, leadershipBonus: 5 },
  },
  {
    id: 'iron-will',
    name: { en: 'Iron Will', zh: '剛胆' },
    category: 'wisdom',
    description: 'Immune to enemy stratagems. Defense ×1.15.',
    combat: { defenseMultiplier: 1.15 },
  },

  // ─────────── Civil & charismatic ───────────
  {
    id: 'benevolent',
    name: { en: 'Benevolent', zh: '仁徳' },
    category: 'civil',
    description: 'Beloved of the people. +5 city loyalty per season; +15% recruit success.',
    civil: { loyaltyAura: 5, recruitBonus: 0.15 },
  },
  {
    id: 'silver-tongue',
    name: { en: 'Silver Tongue', zh: '弁舌' },
    category: 'civil',
    description: 'Persuasion is power. +20% recruit success.',
    civil: { recruitBonus: 0.2 },
  },
  {
    id: 'eye-for-talent',
    name: { en: 'Eye for Talent', zh: '識才' },
    category: 'civil',
    description: 'Knows every gem. +15% recruit success, +5 loyalty aura.',
    civil: { recruitBonus: 0.15, loyaltyAura: 5 },
  },
  {
    id: 'administrator',
    name: { en: 'Administrator', zh: '内政' },
    category: 'civil',
    description: 'A master of the granaries. Internal affairs effects ×1.3.',
    civil: { internalMultiplier: 1.3 },
  },
  {
    id: 'tax-genius',
    name: { en: 'Tax Genius', zh: '財政' },
    category: 'civil',
    description: 'Coin flows wherever they walk. Commerce effects ×1.4.',
    civil: { internalMultiplier: 1.25 },
  },
  {
    id: 'farmer',
    name: { en: 'Farmer', zh: '農政' },
    category: 'civil',
    description: 'Knows every grain. Agriculture effects ×1.35.',
    civil: { internalMultiplier: 1.2 },
  },

  // ─────────── Special / unique ───────────
  {
    id: 'archer-master',
    name: { en: 'Archer Master', zh: '弓神' },
    category: 'combat',
    description: 'A bow that does not miss. +10 war, enemy losses ×1.1.',
    combat: { warBonus: 10, enemyLossMultiplier: 1.1 },
  },
  {
    id: 'cavalry-master',
    name: { en: 'Cavalry Master', zh: '騎神' },
    category: 'combat',
    description: 'Born in the saddle. +10 war and +10% power on field battles.',
    combat: { warBonus: 10, powerMultiplier: 1.1 },
  },
  {
    id: 'navy-master',
    name: { en: 'Navy Master', zh: '水神' },
    category: 'combat',
    description: 'Lord of the rivers. +12 leadership on water; +5% power.',
    combat: { leadershipBonus: 12, powerMultiplier: 1.05 },
  },
  {
    id: 'brave',
    name: { en: 'Brave', zh: '勇猛' },
    category: 'combat',
    description: 'Courage that inspires. +6 war.',
    combat: { warBonus: 6 },
  },
  {
    id: 'tireless',
    name: { en: 'Tireless', zh: '不屈' },
    category: 'combat',
    description: 'Cannot be ground down. Own losses ×0.92.',
    combat: { ownLossMultiplier: 0.92 },
  },
  {
    id: 'pursuit',
    name: { en: 'Pursuit', zh: '追撃' },
    category: 'combat',
    description: 'Routed enemies are finished. Enemy losses ×1.12.',
    combat: { enemyLossMultiplier: 1.12 },
  },
  {
    id: 'rear-guard',
    name: { en: 'Rear Guard', zh: '殿軍' },
    category: 'combat',
    description: 'Steady in defeat. Own losses ×0.85.',
    combat: { ownLossMultiplier: 0.85 },
  },
  {
    id: 'tiger-of-jiangdong',
    name: { en: 'Tiger of Jiangdong', zh: '江東之虎' },
    category: 'combat',
    description: 'The tiger who founded a dynasty. +12 war, +5 leadership.',
    combat: { warBonus: 12, leadershipBonus: 5 },
  },
  {
    id: 'little-conqueror',
    name: { en: 'Little Conqueror', zh: '小覇王' },
    category: 'combat',
    description: 'A conqueror in his youth. +14 war.',
    combat: { warBonus: 14 },
  },
];

export const SKILLS_BY_ID: Record<string, Skill> = Object.fromEntries(
  SKILLS.map((s) => [s.id, s]),
);
