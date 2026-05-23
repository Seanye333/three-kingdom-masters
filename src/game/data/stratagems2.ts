/**
 * 計策 — Battle-phase stratagems the commander may deploy.
 *
 * Each stratagem has gating conditions, an INT-based success roll, and a
 * combat effect. Selected pre-battle when conditions are met.
 *
 * Note: file named stratagems2 to avoid colliding with the older
 * pre-existing stratagems.ts (cosmetic display only).
 */
import type { Officer, City } from '../types';
import type { Weather } from '../systems/weather';

export type BattleStratagemId =
  | 'fire-attack'        // 火攻 — wind required, devastating
  | 'flood-attack'       // 水攻 — river-adjacent, drowning
  | 'ambush'             // 埋伏 — terrain forest/mountain, surprise damage
  | 'feigned-retreat'    // 偽退 — INT-roll, leads enemy out of fortifications
  | 'sow-discord'        // 反間 — pre-battle bond debuff to enemy
  | 'night-raid'         // 偷營 — surprise + low defense
  | 'cut-supply'         // 截糧 — drains enemy troops gradually next 3 seasons
  | 'false-surrender';   // 詐降 — lure enemy ruler in, then betray

export interface StratagemDef {
  id: BattleStratagemId;
  name: { zh: string; en: string };
  description: string;
  /** Officer INT threshold to even attempt. */
  minIntelligence: number;
  /** Per-condition gate — returns true if usable in this battle context. */
  isApplicable: (ctx: StratagemContext) => boolean;
  /** Returns combat effect multipliers when stratagem succeeds. */
  successEffect: StratagemEffect;
  /** Cost if stratagem fails (still rolls). */
  failurePenalty?: { attackerPowerMul?: number; ownLossMul?: number };
}

export interface StratagemContext {
  attacker: Officer;
  defender: Officer | null;
  attackerTroops: number;
  defenderTroops: number;
  city: City;
  weather: Weather;
  /** Sum INT of attacker + companions, averaged. */
  attackerIntelligence: number;
  /** Same for defender side. */
  defenderIntelligence: number;
  /** Average defender loyalty (for 詐降). */
  defenderAvgLoyalty: number;
}

export interface StratagemEffect {
  attackerPowerMul?: number;     // boost attacker raw power
  defenderPowerMul?: number;     // reduce defender power
  ownLossMul?: number;           // reduce attacker losses
  enemyLossMul?: number;         // increase defender losses
  surpriseRoll?: number;         // tilt win roll toward attacker
  /** Captures opportunity (if win): increase capture chance multiplier. */
  captureBonus?: number;
  /** Special: applies a delayed effect across N future seasons. */
  delayedDrain?: { seasons: number; troopsPerSeason: number };
}

export const STRATAGEM_DEFS: Record<BattleStratagemId, StratagemDef> = {
  'fire-attack': {
    id: 'fire-attack',
    name: { zh: '火攻', en: 'Fire Attack' },
    description: '借風縱火 — only viable with strong wind, no rain. Devastating if successful.',
    minIntelligence: 75,
    isApplicable: (ctx) =>
      ctx.weather.windPower >= 2 &&
      ctx.weather.kind !== 'rain' &&
      ctx.weather.kind !== 'snow',
    successEffect: {
      attackerPowerMul: 1.40,
      enemyLossMul: 1.50,
      surpriseRoll: 0.15,
    },
    failurePenalty: { ownLossMul: 1.15 }, // backfires on attacker
  },
  'flood-attack': {
    id: 'flood-attack',
    name: { zh: '水攻', en: 'Flood Attack' },
    description: '掘堤淹城 — port/river city required. Reduces defender troops outright.',
    minIntelligence: 80,
    isApplicable: (ctx) => !!ctx.city.port || ctx.city.terrain === 'plain',
    successEffect: {
      defenderPowerMul: 0.65,
      enemyLossMul: 1.35,
    },
    failurePenalty: { ownLossMul: 1.10 },
  },
  'ambush': {
    id: 'ambush',
    name: { zh: '埋伏', en: 'Ambush' },
    description: '林中設伏 — forest/mountain terrain only. Surprise damage + low own losses.',
    minIntelligence: 70,
    isApplicable: (ctx) =>
      ctx.city.terrain === 'mountain' || ctx.city.terrain === 'forest',
    successEffect: {
      attackerPowerMul: 1.25,
      ownLossMul: 0.65,
      surpriseRoll: 0.12,
    },
  },
  'feigned-retreat': {
    id: 'feigned-retreat',
    name: { zh: '偽退', en: 'Feigned Retreat' },
    description: '誘敵深入 — needs attacker INT > defender INT. Reduces defender bonus.',
    minIntelligence: 78,
    isApplicable: (ctx) =>
      ctx.attackerIntelligence > ctx.defenderIntelligence + 10,
    successEffect: {
      defenderPowerMul: 0.75,
      attackerPowerMul: 1.15,
      enemyLossMul: 1.25,
    },
  },
  'sow-discord': {
    id: 'sow-discord',
    name: { zh: '反間', en: 'Sow Discord' },
    description: '反間之計 — works on any defender. Reduces enemy bond bonuses + power.',
    minIntelligence: 82,
    isApplicable: () => true,
    successEffect: {
      defenderPowerMul: 0.85,
    },
  },
  'night-raid': {
    id: 'night-raid',
    name: { zh: '偷營', en: 'Night Raid' },
    description: '夜襲敵營 — attacker INT roll. Bypasses city defense partially.',
    minIntelligence: 70,
    isApplicable: (ctx) => ctx.attackerTroops >= 1000,
    successEffect: {
      surpriseRoll: 0.20,
      enemyLossMul: 1.30,
      // City defense effectively halved — implemented in resolver
    },
    failurePenalty: { ownLossMul: 1.20 },
  },
  'cut-supply': {
    id: 'cut-supply',
    name: { zh: '截糧', en: 'Cut Supply Line' },
    description: '斷其糧道 — drains enemy troops next 3 seasons (delayed effect).',
    minIntelligence: 75,
    isApplicable: (ctx) => ctx.defenderTroops > 3000,
    successEffect: {
      delayedDrain: { seasons: 3, troopsPerSeason: 500 },
      defenderPowerMul: 0.90,
    },
  },
  'false-surrender': {
    id: 'false-surrender',
    name: { zh: '詐降', en: 'False Surrender' },
    description: '詐降之計 — defender loyalty < 50 required. Surprise hit + capture chance.',
    minIntelligence: 80,
    isApplicable: (ctx) => ctx.defenderAvgLoyalty < 50,
    successEffect: {
      attackerPowerMul: 1.30,
      enemyLossMul: 1.40,
      captureBonus: 1.5,
      surpriseRoll: 0.18,
    },
  },
};

/**
 * Pick the best applicable stratagem for a side. Returns null if none apply.
 * Prefers higher-effect ones when multiple qualify.
 */
export function pickAutoStratagem(
  ctx: StratagemContext,
): BattleStratagemId | null {
  const candidates = Object.values(STRATAGEM_DEFS).filter(
    (s) => ctx.attackerIntelligence >= s.minIntelligence && s.isApplicable(ctx),
  );
  if (candidates.length === 0) return null;
  // Highest min-INT requirement = generally more powerful effect → pick it
  candidates.sort((a, b) => b.minIntelligence - a.minIntelligence);
  return candidates[0].id;
}

/**
 * Roll whether a stratagem succeeds. Higher attacker INT = better odds;
 * defender INT contests.
 */
export function rollStratagemSuccess(
  strat: StratagemDef,
  ctx: StratagemContext,
  rng: () => number,
): boolean {
  const base = 0.55 + (ctx.attackerIntelligence - strat.minIntelligence) * 0.015;
  const contest = ctx.defenderIntelligence > 80 ? 0.10 : 0;
  return rng() < Math.max(0.25, Math.min(0.92, base - contest));
}
