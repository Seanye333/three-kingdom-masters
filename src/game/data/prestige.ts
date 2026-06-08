import type { Officer } from '../types';
import type { HeroicDeeds } from '../types/deeds';

/**
 * 威名 (Prestige) — a reputation "class" an officer earns from their talents and
 * record, separate from civic rank. It confers passive perks: martial prestige
 * sharpens single combat and battlefield power; civil prestige fattens a city's
 * coffers. (RTK13's command-changing / private-force layer belongs with the
 * officer-career RPG and is deliberately left out here.)
 */
export type PrestigePath = 'military' | 'strategist' | 'official' | 'merchant';

export interface PrestigeEffects {
  duelBonus: number;      // flat prowess added in single combat
  combatPowerMul: number; // multiplier on the officer's battle power
  incomeMul: number;      // multiplier on their city's gold income
}

export interface PrestigeTitle {
  id: string;
  name: { zh: string; en: string };
  path: PrestigePath;
  effects: PrestigeEffects;
  qualifies: (o: Officer, deeds?: HeroicDeeds) => boolean;
}

const eff = (over: Partial<PrestigeEffects>): PrestigeEffects =>
  ({ duelBonus: 0, combatPowerMul: 1, incomeMul: 1, ...over });

// Priority order — the FIRST title an officer qualifies for is their prestige,
// so the most impressive titles are listed first.
export const PRESTIGE_TITLES: PrestigeTitle[] = [
  { id: 'tiger-general', name: { zh: '虎將', en: 'Tiger General' }, path: 'military',
    effects: eff({ duelBonus: 12, combatPowerMul: 1.08 }), qualifies: (o) => o.stats.war >= 90 },
  { id: 'royal-aide', name: { zh: '王佐之才', en: 'Royal Aide' }, path: 'strategist',
    effects: eff({ combatPowerMul: 1.06, incomeMul: 1.06 }), qualifies: (o) => o.stats.intelligence >= 92 },
  { id: 'able-minister', name: { zh: '能臣', en: 'Able Minister' }, path: 'official',
    effects: eff({ incomeMul: 1.15 }), qualifies: (o) => o.stats.politics >= 88 },
  { id: 'famed-general', name: { zh: '名將', en: 'Famed General' }, path: 'military',
    effects: eff({ duelBonus: 9, combatPowerMul: 1.05 }),
    qualifies: (o, d) => o.stats.war >= 84 && (d?.battlesWon ?? 0) >= 8 },
  { id: 'fierce-general', name: { zh: '猛將', en: 'Fierce General' }, path: 'military',
    effects: eff({ duelBonus: 7, combatPowerMul: 1.04 }), qualifies: (o) => o.stats.war >= 82 },
  { id: 'strategist', name: { zh: '軍師', en: 'Strategist' }, path: 'strategist',
    effects: eff({ combatPowerMul: 1.03, incomeMul: 1.03 }), qualifies: (o) => o.stats.intelligence >= 85 },
  { id: 'steward', name: { zh: '良吏', en: 'Steward' }, path: 'official',
    effects: eff({ incomeMul: 1.07 }), qualifies: (o) => o.stats.politics >= 80 },
  { id: 'great-merchant', name: { zh: '巨賈', en: 'Great Merchant' }, path: 'merchant',
    effects: eff({ incomeMul: 1.10 }), qualifies: (o) => o.stats.politics >= 72 && o.stats.charisma >= 75 },
];

/** The single most prestigious title an officer holds, or null. */
export function bestPrestige(o: Officer, deeds?: HeroicDeeds): PrestigeTitle | null {
  for (const title of PRESTIGE_TITLES) if (title.qualifies(o, deeds)) return title;
  return null;
}

const NO_EFFECTS = eff({});
/** An officer's prestige effects (neutral defaults when they hold no title). */
export function prestigeEffects(o: Officer | undefined, deeds?: HeroicDeeds): PrestigeEffects {
  if (!o) return NO_EFFECTS;
  return bestPrestige(o, deeds)?.effects ?? NO_EFFECTS;
}
