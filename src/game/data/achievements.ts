import type { Achievement } from '../types';

/**
 * Persistent cross-game achievements.
 */
export const ACHIEVEMENTS: Achievement[] = [
  // ─── Iconic recruits ───────────────────────────────────────────
  {
    id: 'ach-recruit-zhuge',
    name: { en: 'The Sleeping Dragon Roused', zh: '臥龍之出仕' },
    description: 'Recruit Zhuge Liang into your service.',
    tier: 'gold',
    trigger: { kind: 'recruit-officer', targetId: 'zhuge-liang' },
    unlockReward: { type: 'color', value: '#3a7d9a' },
  },
  {
    id: 'ach-recruit-pang-tong',
    name: { en: 'The Phoenix Found', zh: '鳳雛之発見' },
    description: 'Recruit Pang Tong into your service.',
    tier: 'gold',
    trigger: { kind: 'recruit-officer', targetId: 'pang-tong' },
  },
  {
    id: 'ach-recruit-lu-bu',
    name: { en: 'The Flying General Yours', zh: '飛将,我従' },
    description: 'Recruit Lü Bu — the warrior of warriors.',
    tier: 'legendary',
    trigger: { kind: 'recruit-officer', targetId: 'lu-bu' },
    unlockReward: { type: 'archetype', value: 'warrior-elite' },
  },
  {
    id: 'ach-recruit-sima',
    name: { en: 'The Tomb-Tiger Tamed', zh: '冢虎,我降' },
    description: 'Recruit Sima Yi.',
    tier: 'legendary',
    trigger: { kind: 'recruit-officer', targetId: 'sima-yi' },
  },

  // ─── Iconic defeats ────────────────────────────────────────────
  {
    id: 'ach-slay-yan-liang',
    name: { en: 'Slew Yan Liang', zh: '顏良斬殺' },
    description: 'Defeat Yan Liang in single combat or battle.',
    tier: 'silver',
    trigger: { kind: 'defeat-officer', targetId: 'yan-liang' },
  },
  {
    id: 'ach-slay-wen-chou',
    name: { en: 'Slew Wen Chou', zh: '文丑斬殺' },
    description: 'Defeat Wen Chou.',
    tier: 'silver',
    trigger: { kind: 'defeat-officer', targetId: 'wen-chou' },
  },
  {
    id: 'ach-slay-dong-zhuo',
    name: { en: 'Toppled the Tyrant', zh: '董卓，討' },
    description: 'Defeat Dong Zhuo.',
    tier: 'gold',
    trigger: { kind: 'defeat-officer', targetId: 'dong-zhuo' },
  },
  {
    id: 'ach-duel-lu-bu',
    name: { en: 'Duelled the Flying General', zh: '飛将一騎' },
    description: 'Win a duel against Lü Bu.',
    tier: 'legendary',
    trigger: { kind: 'duel-won-vs', targetId: 'lu-bu' },
    unlockReward: { type: 'flair', value: 'lu-bu-slayer' },
  },

  // ─── Iconic city captures ──────────────────────────────────────
  {
    id: 'ach-take-luoyang',
    name: { en: 'Seized the Eastern Capital', zh: '洛陽奪取' },
    description: 'Take Luoyang.',
    tier: 'silver',
    trigger: { kind: 'capture-city', targetId: 'city-luoyang' },
  },
  {
    id: 'ach-take-changan',
    name: { en: 'Seized the Western Capital', zh: '長安奪取' },
    description: "Take Chang'an.",
    tier: 'silver',
    trigger: { kind: 'capture-city', targetId: 'city-changan' },
  },
  {
    id: 'ach-take-xuchang',
    name: { en: 'Took the Court', zh: '許昌奪取' },
    description: 'Take Xuchang — seat of the late-Han court.',
    tier: 'silver',
    trigger: { kind: 'capture-city', targetId: 'city-xuchang' },
  },

  // ─── Famous events ─────────────────────────────────────────────
  {
    id: 'ach-three-visits',
    name: { en: 'Three Visits to the Thatched Cottage', zh: '三顧茅廬' },
    description: 'Witness the Three Visits event.',
    tier: 'gold',
    trigger: { kind: 'fire-event', targetId: 'evt-three-visits-to-thatched-cottage' },
  },
  {
    id: 'ach-chibi',
    name: { en: 'Red Cliffs Survivor', zh: '赤壁之戰' },
    description: 'Be present for the Battle of Red Cliffs.',
    tier: 'gold',
    trigger: { kind: 'fire-event', targetId: 'evt-battle-of-red-cliffs' },
  },
  {
    id: 'ach-empty-fort',
    name: { en: 'The Empty Fort', zh: '空城之計' },
    description: 'Witness the Empty Fort Stratagem.',
    tier: 'silver',
    trigger: { kind: 'fire-event', targetId: 'evt-empty-fort-stratagem' },
  },
  {
    id: 'ach-meng-huo',
    name: { en: 'Seven Captures', zh: '七擒七縦' },
    description: 'Witness the Seven Captures of Meng Huo.',
    tier: 'gold',
    trigger: { kind: 'fire-event', targetId: 'evt-meng-huo-seven-captures' },
  },
  {
    id: 'ach-wuzhang',
    name: { en: 'Star Falls at Wuzhang', zh: '五丈原星墜' },
    description: 'Witness Zhuge Liang\'s death at Wuzhang Plains.',
    tier: 'legendary',
    trigger: { kind: 'fire-event', targetId: 'evt-zhuge-liang-dies' },
  },

  // ─── Endings ───────────────────────────────────────────────────
  {
    id: 'ach-unify',
    name: { en: 'Unifier', zh: '天下統一' },
    description: 'Unify the entire realm.',
    tier: 'legendary',
    trigger: { kind: 'reach-ending', targetId: 'unify' },
    unlockReward: { type: 'color', value: '#ffce4a' },
  },
  {
    id: 'ach-restore-han',
    name: { en: 'The Han Restored', zh: '漢室再興' },
    description: 'Reach the Restore Han ending.',
    tier: 'gold',
    trigger: { kind: 'reach-ending', targetId: 'restore-han' },
  },
  {
    id: 'ach-tripartite',
    name: { en: 'Three Kingdoms', zh: '三国鼎立' },
    description: 'Reach the Tripartite ending.',
    tier: 'gold',
    trigger: { kind: 'reach-ending', targetId: 'tripartite' },
  },
  {
    id: 'ach-recluse',
    name: { en: 'The Hidden Sage', zh: '隠士退隠' },
    description: 'Reach the Recluse ending.',
    tier: 'silver',
    trigger: { kind: 'reach-ending', targetId: 'recluse' },
  },
  {
    id: 'ach-emperor',
    name: { en: 'Son of Heaven', zh: '天子即位' },
    description: 'Reach the Emperor ending.',
    tier: 'legendary',
    trigger: { kind: 'reach-ending', targetId: 'emperor' },
  },

  // ─── Imperial ranks ────────────────────────────────────────────
  {
    id: 'ach-king',
    name: { en: 'King Among Men', zh: '王即位' },
    description: 'Achieve the rank of King.',
    tier: 'gold',
    trigger: { kind: 'reach-imperial-rank', targetId: 'king' },
  },

  // ─── Cumulative ────────────────────────────────────────────────
  {
    id: 'ach-100-kills',
    name: { en: 'Bloody Hands', zh: '百戰錬磨' },
    description: 'Kill 100,000 enemy troops across all campaigns.',
    tier: 'bronze',
    trigger: { kind: 'cumulative-kills', threshold: 100_000 },
  },
  {
    id: 'ach-1m-kills',
    name: { en: 'River of Blood', zh: '百万斬' },
    description: 'Kill one million enemy troops cumulatively.',
    tier: 'legendary',
    trigger: { kind: 'cumulative-kills', threshold: 1_000_000 },
  },
  {
    id: 'ach-50-cities',
    name: { en: 'Conqueror', zh: '攻城五十' },
    description: 'Take 50 cities cumulatively.',
    tier: 'silver',
    trigger: { kind: 'cumulative-cities', threshold: 50 },
  },
  {
    id: 'ach-10-recruits',
    name: { en: 'Eye for Talent', zh: '識才十名' },
    description: 'Recruit 10 officers cumulatively.',
    tier: 'bronze',
    trigger: { kind: 'cumulative-recruits', threshold: 10 },
  },
  {
    id: 'ach-100-battles',
    name: { en: 'Hundred Victories', zh: '百戰百勝' },
    description: 'Win 100 battles cumulatively.',
    tier: 'gold',
    trigger: { kind: 'cumulative-battles-won', threshold: 100 },
  },

  // ─── Skills ────────────────────────────────────────────────────
  {
    id: 'ach-learn-god-of-war',
    name: { en: 'Learned the God of War', zh: '武神，会得' },
    description: 'Have an officer learn the 武神 skill via level-up.',
    tier: 'legendary',
    trigger: { kind: 'learn-skill', targetId: 'god-of-war' },
  },
];

export const ACHIEVEMENTS_BY_ID: Record<string, Achievement> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a]),
);
