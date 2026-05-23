import type {
  City,
  EntityId,
  Officer,
  ReportEntry,
  Season,
} from '../types';

export interface EventsInput {
  season: Season;
  cities: Record<EntityId, City>;
  officers: Record<EntityId, Officer>;
  rng: () => number;
}

export interface EventsOutput {
  cities: Record<EntityId, City>;
  officers: Record<EntityId, Officer>;
  entries: ReportEntry[];
}

const REBELLION_CHANCE = 0.12; // when loyalty < 30
const HARVEST_BOON_CHANCE = 0.12; // autumn only
const FAMINE_CHANCE = 0.02;
const PLAGUE_CHANCE = 0.01;
const WANDERING_TALENT_CHANCE = 0.18; // overall, per season

export function rollEvents(input: EventsInput): EventsOutput {
  const cities = { ...input.cities };
  let officers = { ...input.officers };
  const entries: ReportEntry[] = [];

  // Per-city rolls.
  for (const c of Object.values(cities)) {
    // Rebellion: unrest pushes the city to neutrality.
    if (c.ownerForceId && c.loyalty < 30 && input.rng() < REBELLION_CHANCE) {
      cities[c.id] = {
        ...c,
        ownerForceId: null,
        loyalty: 20,
        troops: Math.floor(c.troops * 0.5),
      };
      entries.push({
        cityId: c.id,
        kind: 'rebellion',
        text: `${c.name.en} rises in revolt! The city throws off its ruler and becomes independent.`,
      });
      continue; // skip other events this turn
    }

    // Bumper harvest: autumn only.
    if (
      input.season === 'autumn' &&
      c.agriculture > 0 &&
      input.rng() < HARVEST_BOON_CHANCE
    ) {
      const bonus = Math.floor((c.agriculture * c.population) / 1500);
      cities[c.id] = { ...cities[c.id], food: cities[c.id].food + bonus };
      entries.push({
        cityId: c.id,
        kind: 'harvest',
        text: `Bumper harvest at ${c.name.en}! +${bonus} bonus food.`,
      });
      continue;
    }

    // Famine: spoiled stores / drought.
    if (cities[c.id].food > 0 && input.rng() < FAMINE_CHANCE) {
      const lost = Math.floor(cities[c.id].food * 0.4);
      cities[c.id] = {
        ...cities[c.id],
        food: cities[c.id].food - lost,
        loyalty: Math.max(0, cities[c.id].loyalty - 5),
      };
      entries.push({
        cityId: c.id,
        kind: 'famine',
        text: `Famine strikes ${c.name.en}. ${lost.toLocaleString()} food lost; loyalty −5.`,
      });
      continue;
    }

    // Plague: hits population & troops.
    if (cities[c.id].population > 50_000 && input.rng() < PLAGUE_CHANCE) {
      const popLost = Math.floor(cities[c.id].population * 0.1);
      const troopLost = Math.floor(cities[c.id].troops * 0.05);
      cities[c.id] = {
        ...cities[c.id],
        population: cities[c.id].population - popLost,
        troops: Math.max(0, cities[c.id].troops - troopLost),
        loyalty: Math.max(0, cities[c.id].loyalty - 5),
      };
      entries.push({
        cityId: c.id,
        kind: 'plague',
        text: `Plague at ${c.name.en}. −${popLost.toLocaleString()} population, −${troopLost.toLocaleString()} troops.`,
      });
    }
  }

  // Global event: wandering talent appears at an inn / tavern / market.
  if (input.rng() < WANDERING_TALENT_CHANCE) {
    const unsearched = Object.values(officers).filter(
      (o) => o.status === 'unsearched',
    );
    const occupiedCities = Object.values(cities).filter(
      (c) => c.ownerForceId !== null,
    );
    if (unsearched.length > 0 && occupiedCities.length > 0) {
      const officer = unsearched[Math.floor(input.rng() * unsearched.length)];
      const city =
        occupiedCities[Math.floor(input.rng() * occupiedCities.length)];
      officers = {
        ...officers,
        [officer.id]: {
          ...officer,
          status: 'idle',
          locationCityId: city.id,
          forceId: null,
          loyalty: 0,
        },
      };
      entries.push({
        cityId: city.id,
        kind: 'talent',
        text: rollInnEncounter(officer, city, input.rng),
      });
    }
  }

  return { cities, officers, entries };
}

// ── Inn / tavern / wandering-swordsman flavor variations ──
// Picks a vignette based on the officer's stat profile so a strategist gets
// a teahouse meeting and a warrior gets a tavern brawl.
function rollInnEncounter(
  officer: Officer,
  city: City,
  rng: () => number,
): string {
  const w = officer.stats.war;
  const i = officer.stats.intelligence;
  const c = officer.stats.charisma;
  const profile: 'warrior' | 'strategist' | 'gentry' | 'wanderer' =
    w >= 80 ? 'warrior' :
    i >= 80 ? 'strategist' :
    c >= 80 ? 'gentry' : 'wanderer';

  const cityZh = city.name.zh;
  const oZh = officer.name.zh;
  const oEn = officer.name.en;

  const variants: Record<typeof profile, string[]> = {
    warrior: [
      `酒家相鬥 — A brawl at a ${cityZh} tavern catches your eye; ${oZh}（${oEn}） stands over three felled bandits. He's now waiting in the city for a patron.`,
      `市井遊俠 — A masked sword-stranger ${oZh}（${oEn}） has appeared in ${cityZh}'s market, looking for service.`,
      `校場試武 — Word reaches ${cityZh} that a wandering swordsman ${oZh}（${oEn}） has bested every challenger at the parade ground. He awaits a recruiter.`,
    ],
    strategist: [
      `茶肆論策 — At a quiet teahouse in ${cityZh}, a young scholar ${oZh}（${oEn}） debates the classics. His arguments draw a crowd.`,
      `客棧夜談 — A traveler ${oZh}（${oEn}） staying at a ${cityZh} inn shares uncanny insight on border affairs.`,
      `書院偶遇 — At the ${cityZh} academy, a recluse ${oZh}（${oEn}） has been quietly tutoring students. He may be persuaded to serve.`,
    ],
    gentry: [
      `名士來訪 — Local elders introduce ${oZh}（${oEn}） — a young man of refinement and family — now lodging in ${cityZh}.`,
      `酒席投帖 — At a ${cityZh} banquet, ${oZh}（${oEn}） presents his card. The host is impressed.`,
    ],
    wanderer: [
      `客棧偶遇 — A traveler ${oZh}（${oEn}） has put up at an inn in ${cityZh}, seeking employment.`,
      `渡頭逢人 — At the ${cityZh} ferry-landing, you meet ${oZh}（${oEn}）, a wanderer of curious bearing.`,
      `市集打聽 — Rumors in the ${cityZh} market speak of a stranger ${oZh}（${oEn}） looking for a lord.`,
    ],
  };
  const pool = variants[profile];
  return pool[Math.floor(rng() * pool.length)];
}
