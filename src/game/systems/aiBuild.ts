import type {
  Building,
  BuildingId,
  City,
  DiplomaticState,
  EntityId,
  FacilityKind,
  Force,
  Fort,
  ReportEntry,
  RulerPersonality,
} from '../types';
import { BUILDING_DEFS_BY_ID } from '../data/buildings';
import { FACILITY_DEFS, isHostilePermitted } from '../types';
import { CITY_GEO_OVERRIDES } from '../data/cityGeo';

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
        textZh: `${force?.name.zh ?? '電腦'}於${city.name.zh}興建${def.name.zh}。`,
      });
      break;
    }
  }
  return { cities, buildings, entries };
}

// ─── AI 施設 — strategic facilities ──────────────────────────────────────
export interface AIFacilityContext {
  cities: Record<EntityId, City>;
  forces: Record<EntityId, Force>;
  forts: Record<EntityId, Fort>;
  diplomacy: DiplomaticState;
  playerForceId: EntityId | null;
  rng: () => number;
}
export interface AIFacilityOutput {
  cities: Record<EntityId, City>;
  newForts: Record<EntityId, Fort>;
  entries: ReportEntry[];
}

const AI_FACILITY_CAP = 3;      // facilities a force keeps standing at once
const AI_BUILD_CHANCE = 0.14;   // per eligible force per season

/**
 * AI forces fortify their frontier with strategic facilities — a force that
 * borders a hostile neighbour occasionally raises a 箭樓/投石臺/防壁 near a
 * contested city (paid from its capital), capped so the map can't fill up.
 */
export function planAIFacilities(ctx: AIFacilityContext): AIFacilityOutput {
  const cities = { ...ctx.cities };
  const newForts: Record<EntityId, Fort> = {};
  const entries: ReportEntry[] = [];

  const countByForce: Record<EntityId, number> = {};
  for (const f of Object.values(ctx.forts)) {
    if (f.facility && f.ownerForceId) countByForce[f.ownerForceId] = (countByForce[f.ownerForceId] ?? 0) + 1;
  }

  for (const force of Object.values(ctx.forces)) {
    if (force.id === ctx.playerForceId) continue;
    if ((countByForce[force.id] ?? 0) >= AI_FACILITY_CAP) continue;
    if (ctx.rng() > AI_BUILD_CHANCE) continue;

    // Frontier cities: owned by this force, bordering a hostile-owned city.
    const frontier = Object.values(cities).filter((c) =>
      c.ownerForceId === force.id
      && (c.adjacentCityIds ?? []).some((aid) => {
        const adj = cities[aid];
        return !!adj?.ownerForceId && adj.ownerForceId !== force.id
          && isHostilePermitted(ctx.diplomacy, force.id, adj.ownerForceId);
      }));
    if (frontier.length === 0) continue;

    const capital = cities[force.capitalCityId];
    if (!capital) continue;

    // Pick a kind by temperament + budget, falling back to the cheap 箭樓.
    let kind: FacilityKind = 'tower';
    const pers = force.personality;
    if ((pers === 'aggressive' || pers === 'tyrant' || pers === 'expansionist') && capital.gold > 900) kind = 'catapult';
    else if ((pers === 'defensive' || pers === 'cautious') && ctx.rng() < 0.4) kind = 'wall';
    if (capital.gold < FACILITY_DEFS[kind].cost) kind = 'tower';
    const def = FACILITY_DEFS[kind];
    if (capital.gold < def.cost) continue;

    // Build near the most contested (most-garrisoned) frontier city.
    const host = [...frontier].sort((a, b) => b.troops - a.troops)[0];
    const geo = CITY_GEO_OVERRIDES[host.id];
    const cityLon = geo ? geo[0] : 96 + (host.coords.x / 1000) * 29;
    const cityLat = geo ? geo[1] : 43 - (host.coords.y / 720) * 26;
    const angle = ctx.rng() * Math.PI * 2;
    const id = `ai-fac-${host.id}-${Math.floor(ctx.rng() * 1e9)}`;
    newForts[id] = {
      id,
      name: { zh: def.name.zh, en: def.name.en },
      subtype: 'stockade',
      facility: kind,
      coords: { lon: cityLon + Math.cos(angle) * 0.4, lat: cityLat + Math.sin(angle) * 0.4 },
      ownerForceId: force.id,
      hp: def.hp,
      maxHp: def.hp,
      guards: [host.id],
      seasonsRemaining: def.seasons,
    };
    cities[capital.id] = { ...capital, gold: capital.gold - def.cost };
    countByForce[force.id] = (countByForce[force.id] ?? 0) + 1;

    // Warn the player only when the new work sits on their doorstep.
    const nearPlayer = (host.adjacentCityIds ?? []).some((aid) => cities[aid]?.ownerForceId === ctx.playerForceId);
    if (nearPlayer) {
      entries.push({
        cityId: host.id, kind: 'battle',
        text: `${force.name.en} raised a ${def.name.en} near ${host.name.en}.`,
        textZh: `${force.name.zh}於${host.name.zh}近郊築起${def.name.zh}。`,
      });
    }
  }

  return { cities, newForts, entries };
}
