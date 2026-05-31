import type {
  Building,
  BuildingId,
  City,
  EntityId,
  ReportEntry,
  TradeRoute,
} from '../types';
import { BUILDING_DEFS_BY_ID } from '../data/buildings';
import { PROVINCE_BY_CITY } from '../data/provinces';

/**
 * Per-season building progression: each in-progress building accrues 1
 * season of progress, and any that fill complete one level.
 */
export interface BuildingTickContext {
  buildings: Building[];
  cities: Record<EntityId, City>;
}

export interface BuildingTickOutput {
  buildings: Building[];
  cities: Record<EntityId, City>;
  entries: ReportEntry[];
}

/**
 * Wall building level → wallTier mapping. Lv.3 city wall becomes inner-wall
 * tier 2; Lv.4 becomes citadel tier 3 (like 合肥/長安/洛陽).
 */
function wallTierForLevel(level: number): 1 | 2 | 3 {
  if (level >= 4) return 3;
  if (level >= 3) return 2;
  return 1;
}

export function tickBuildings(ctx: BuildingTickContext): BuildingTickOutput {
  const entries: ReportEntry[] = [];
  let cities = ctx.cities;
  const updated = ctx.buildings.map((b) => {
    const def = BUILDING_DEFS_BY_ID[b.id];
    if (!def) return b;
    if (b.level >= def.maxLevel) return b;
    const nextProgress = b.progress + 1;
    if (nextProgress >= def.seasonsPerLevel) {
      const city = cities[b.cityId];
      const newLevel = b.level + 1;
      entries.push({
        cityId: b.cityId,
        kind: 'command-success',
        text: `${def.name.en} in ${city?.name.en ?? '?'} reached level ${newLevel}.`,
        textZh: `${city?.name.zh ?? '?'}的${def.name.zh}達到 ${newLevel} 級。`,
      });
      // Wall completion may bump the city's wallTier (Lv.3 → tier 2, Lv.4 → tier 3).
      if (b.id === 'wall' && city) {
        const nextTier = wallTierForLevel(newLevel);
        const curTier = city.wallTier ?? 1;
        if (nextTier > curTier) {
          cities = { ...cities, [city.id]: { ...city, wallTier: nextTier } };
          const tierLabel = nextTier === 3 ? '堅城 (citadel)' : '內城 (inner wall)';
          entries.push({
            cityId: city.id,
            kind: 'command-success',
            text: `${city.name.en} walls upgraded to tier ${nextTier} — ${tierLabel}.`,
            textZh: `${city.name.zh}城壁升為 ${nextTier} 級 — ${nextTier === 3 ? '堅城' : '內城'}。`,
          });
        }
      }
      return { ...b, level: newLevel, progress: 0 };
    }
    return { ...b, progress: nextProgress };
  });
  return { buildings: updated, cities, entries };
}

/**
 * Aggregate building bonuses for a city. Returns multiplicative bonuses
 * indexed by effect category.
 */
export function buildingBonuses(
  cityId: EntityId,
  buildings: Building[],
): {
  recruitMul: number;
  commerceMul: number;
  agricultureMul: number;
  loyaltyPerSeason: number;
  defenseAdd: number;
  xpMul: number;
  instigateResistance: number;
  troopCapMul: number;
  shipyardLevel: number;
} {
  const inCity = buildings.filter((b) => b.cityId === cityId);
  let recruitMul = 1;
  let commerceMul = 1;
  let agricultureMul = 1;
  let loyaltyPerSeason = 0;
  let defenseAdd = 0;
  let xpMul = 1;
  let instigateResistance = 0;
  let troopCapMul = 1;
  let shipyardLevel = 0;
  for (const b of inCity) {
    const l = b.level;
    if (l === 0) continue;
    switch (b.id) {
      case 'barracks':
        recruitMul *= 1 + 0.2 * l;
        troopCapMul *= 1 + 0.08 * l;
        break;
      case 'market':
        commerceMul *= 1 + 0.2 * l;
        break;
      case 'foundry':
        recruitMul *= 1 + 0.12 * l;
        commerceMul *= 1 + 0.05 * l;
        break;
      case 'academy':
        xpMul *= 1 + 0.2 * l;
        break;
      case 'temple':
        loyaltyPerSeason += 3 * l;
        instigateResistance += 0.35 * l;
        break;
      case 'farm':
        agricultureMul *= 1 + 0.2 * l;
        break;
      case 'wall':
        defenseAdd += 15 * l;
        break;
      case 'shipyard':
        shipyardLevel = Math.max(shipyardLevel, l);
        break;
    }
  }
  return {
    recruitMul,
    commerceMul,
    agricultureMul,
    loyaltyPerSeason,
    defenseAdd,
    xpMul,
    instigateResistance,
    troopCapMul,
    shipyardLevel,
  };
}

/**
 * Per-season trade route income. Each route generates income for both ends
 * when same-owner (or in alliance — caller decides).
 */
export function tradeRouteIncome(
  routes: TradeRoute[],
  cities: Record<EntityId, City>,
  sameSide: (a: EntityId | null, b: EntityId | null) => boolean,
): Array<{ cityId: EntityId; income: number }> {
  const out: Array<{ cityId: EntityId; income: number }> = [];
  for (const r of routes) {
    const a = cities[r.cityAId];
    const b = cities[r.cityBId];
    if (!a || !b) continue;
    if (sameSide(a.ownerForceId, b.ownerForceId)) {
      out.push({ cityId: a.id, income: r.baseIncome });
      out.push({ cityId: b.id, income: r.baseIncome });
    }
  }
  return out;
}

/**
 * Auto-create trade routes within each province for cities that share a
 * province AND are adjacent.
 */
export function generateProvincialTradeRoutes(
  cities: Record<EntityId, City>,
): TradeRoute[] {
  const out: TradeRoute[] = [];
  const seen = new Set<string>();
  for (const c of Object.values(cities)) {
    const prov = PROVINCE_BY_CITY[c.id];
    if (!prov) continue;
    for (const adj of c.adjacentCityIds) {
      if (PROVINCE_BY_CITY[adj] !== prov) continue;
      const key = [c.id, adj].sort().join('::');
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        id: `route-${key}`,
        cityAId: c.id,
        cityBId: adj,
        baseIncome: 30,
      });
    }
  }
  return out;
}

/**
 * Cost to start a new building project.
 */
export function buildingCost(id: BuildingId): number {
  return BUILDING_DEFS_BY_ID[id]?.goldPerLevel ?? 0;
}
