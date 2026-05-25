import type {
  City,
  EntityId,
  GameDate,
  ReportEntry,
  Tribe,
  TribeId,
  TribeState,
} from '../types';
import { TRIBES } from '../data/tribes';

export interface TribeContext {
  state: TribeState;
  cities: Record<EntityId, City>;
  date: GameDate;
  rng: () => number;
}

export interface TribeOutput {
  state: TribeState;
  cities: Record<EntityId, City>;
  entries: ReportEntry[];
}

/**
 * Per-season tribe check. Each tribe with aggression high enough may launch
 * a raid on one of its raidable cities. Raid impact:
 *   - Damages city troops (battle resolves abstractly)
 *   - Loots gold / food
 *   - If city's defenders lose, city loyalty crashes; troops crater
 *   - Tribe aggression drops after a raid (cool-down)
 */
export function resolveTribeRaids(ctx: TribeContext): TribeOutput {
  const cities = { ...ctx.cities };
  const aggression = { ...ctx.state.aggression };
  const lastRaidYear = { ...ctx.state.lastRaidYear };
  const entries: ReportEntry[] = [];

  for (const tribe of TRIBES) {
    const ag = aggression[tribe.id] ?? tribe.baseAggression;
    // Aggression drift up over time.
    aggression[tribe.id] = Math.min(1, ag + 0.015);

    const last = lastRaidYear[tribe.id] ?? 0;
    if (ctx.date.year - last < 1) continue; // at most one raid per year per tribe

    const roll = ctx.rng();
    if (roll > ag) continue;

    // Pick a raidable city this tribe still owns/can reach.
    const target = pickTarget(tribe, cities, ctx.rng);
    if (!target) continue;

    const c = cities[target];
    if (!c) continue;

    const raidTroops = Math.floor(
      (1500 + ctx.rng() * 4500) * tribe.strengthMul,
    );
    const defenseTroops = c.troops;

    // Simple resolution: defender wins if defender > raidTroops × 0.7, else raid breaks through.
    const defWins = defenseTroops > raidTroops * 0.7;
    const defLoss = Math.floor(raidTroops * (defWins ? 0.4 : 0.7));
    const raidLoss = Math.floor(raidTroops * (defWins ? 0.7 : 0.3));

    if (defWins) {
      cities[target] = {
        ...c,
        troops: Math.max(0, c.troops - defLoss),
        loyalty: Math.min(100, c.loyalty + 3),
      };
      entries.push({
        cityId: target,
        kind: 'tribe-raid',
        text: `${tribe.name.en} raiders attacked ${c.name.en} but were repulsed. ${defLoss.toLocaleString()} defenders lost.`,
        textZh: `${tribe.name.zh}入寇${c.name.zh}，為守軍所卻。折守兵 ${defLoss.toLocaleString()}。`,
      });
    } else {
      const goldLoot = Math.floor(c.gold * (0.2 + ctx.rng() * 0.3));
      const foodLoot = Math.floor(c.food * (0.2 + ctx.rng() * 0.3));
      cities[target] = {
        ...c,
        troops: Math.max(0, c.troops - defLoss),
        gold: Math.max(0, c.gold - goldLoot),
        food: Math.max(0, c.food - foodLoot),
        loyalty: Math.max(0, c.loyalty - 15),
      };
      entries.push({
        cityId: target,
        kind: 'tribe-raid',
        text: `${tribe.name.en} raiders sacked ${c.name.en}! ${defLoss.toLocaleString()} troops, ${goldLoot} gold, ${foodLoot.toLocaleString()} food lost.`,
        textZh: `${tribe.name.zh}襲掠${c.name.zh}，城破！折兵 ${defLoss.toLocaleString()}、失金 ${goldLoot}、糧 ${foodLoot.toLocaleString()}。`,
      });
    }

    // Aggression cool-down regardless of outcome (they retreated).
    aggression[tribe.id] = Math.max(
      tribe.baseAggression * 0.5,
      (aggression[tribe.id] ?? tribe.baseAggression) - 0.15 - raidLoss / 30000,
    );
    lastRaidYear[tribe.id] = ctx.date.year;
  }

  return {
    state: {
      aggression: aggression as Record<TribeId, number>,
      lastRaidYear,
    },
    cities,
    entries,
  };
}

function pickTarget(
  tribe: Tribe,
  cities: Record<EntityId, City>,
  rng: () => number,
): EntityId | null {
  const valid = tribe.raidableCityIds.filter((id) => {
    const c = cities[id];
    return c && c.ownerForceId !== null;
  });
  if (valid.length === 0) return null;
  return valid[Math.floor(rng() * valid.length)];
}

export function createInitialTribeState(): TribeState {
  const aggression: Record<TribeId, number> = {} as Record<TribeId, number>;
  for (const t of TRIBES) aggression[t.id] = t.baseAggression;
  return { aggression, lastRaidYear: {} };
}
