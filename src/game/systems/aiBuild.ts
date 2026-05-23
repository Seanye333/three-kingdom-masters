import type {
  Building,
  BuildingId,
  City,
  EntityId,
  Force,
  ReportEntry,
  RulerPersonality,
} from '../types';
import { BUILDING_DEFS_BY_ID } from '../data/buildings';

/**
 * AI building priorities per ruler personality. The list is consulted top-down;
 * the first building that isn't already at max level (and that the city can
 * afford) is started.
 */
const BUILD_PRIORITIES: Record<RulerPersonality, BuildingId[]> = {
  aggressive:   ['barracks', 'foundry', 'wall',     'farm',    'market', 'academy', 'temple'],
  defensive:    ['wall',     'farm',    'temple',   'barracks','market', 'academy', 'foundry'],
  opportunist:  ['market',   'barracks','farm',     'foundry', 'temple', 'academy', 'wall'],
  hesitant:     ['market',   'farm',    'academy',  'temple',  'wall',   'barracks','foundry'],
  tyrant:       ['barracks', 'foundry', 'wall',     'barracks','farm',   'market',  'temple'],
  scholar:      ['academy',  'market',  'farm',     'temple',  'wall',   'barracks','foundry'],
  expansionist: ['barracks', 'market',  'farm',     'foundry', 'temple', 'academy', 'wall'],
  cautious:     ['wall',     'farm',    'market',   'temple',  'academy','barracks','foundry'],
};

export interface AIBuildContext {
  cities: Record<EntityId, City>;
  buildings: Building[];
  forces: Record<EntityId, Force>;
  playerForceId: EntityId | null;
}

export interface AIBuildOutput {
  cities: Record<EntityId, City>;
  buildings: Building[];
  entries: ReportEntry[];
}

/**
 * Each season, every AI-controlled city with no building in progress starts
 * one based on its force's personality.
 */
export function planAIBuildOrders(ctx: AIBuildContext): AIBuildOutput {
  const cities = { ...ctx.cities };
  let buildings = [...ctx.buildings];
  const entries: ReportEntry[] = [];

  for (const city of Object.values(cities)) {
    if (!city.ownerForceId) continue;
    if (city.ownerForceId === ctx.playerForceId) continue;
    // Skip if anything in-progress in this city.
    if (buildings.some((b) => b.cityId === city.id && b.progress > 0)) continue;

    const force = ctx.forces[city.ownerForceId];
    const personality = force?.personality ?? 'opportunist';
    const priorities = BUILD_PRIORITIES[personality];

    // Pick the first building they can afford that isn't maxed.
    for (const bid of priorities) {
      const def = BUILDING_DEFS_BY_ID[bid];
      if (!def) continue;
      const existing = buildings.find((b) => b.cityId === city.id && b.id === bid);
      if (existing && existing.level >= def.maxLevel) continue;
      // Don't spend the city dry — keep at least 200 gold reserve.
      if (city.gold < def.goldPerLevel + 200) continue;
      // Start it.
      cities[city.id] = { ...city, gold: city.gold - def.goldPerLevel };
      if (existing) {
        buildings = buildings.map((b) =>
          b.id === bid && b.cityId === city.id ? { ...b, progress: 1 } : b,
        );
      } else {
        buildings = [...buildings, { id: bid, cityId: city.id, level: 0, progress: 1 }];
      }
      entries.push({
        cityId: city.id,
        kind: 'note',
        text: `${force?.name.en ?? 'AI'} begins building a ${def.name.en} at ${city.name.en}.`,
      });
      break;
    }
  }
  return { cities, buildings, entries };
}
