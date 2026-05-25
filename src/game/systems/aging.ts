import type {
  City,
  EntityId,
  Force,
  Officer,
  ReportEntry,
} from '../types';
import { getDeathPoem } from '../data/deathPoems';

export interface AgingInput {
  year: number;
  cities: Record<EntityId, City>;
  officers: Record<EntityId, Officer>;
  forces: Record<EntityId, Force>;
  rng: () => number;
}

export interface AgingOutput {
  cities: Record<EntityId, City>;
  officers: Record<EntityId, Officer>;
  forces: Record<EntityId, Force>;
  entries: ReportEntry[];
}

/** Run yearly aging — call this once per year, at end of winter. */
export function processAging(input: AgingInput): AgingOutput {
  const cities = { ...input.cities };
  let officers = { ...input.officers };
  let forces = { ...input.forces };
  const entries: ReportEntry[] = [];

  for (const officer of Object.values(officers)) {
    if (officer.status === 'dead' || officer.status === 'unsearched') continue;
    const age = input.year - officer.birthYear;
    const chance = deathChance(officer, input.year, age);
    if (input.rng() >= chance) continue;

    // Officer dies.
    officers = {
      ...officers,
      [officer.id]: {
        ...officer,
        status: 'dead',
        forceId: null,
        locationCityId: null,
        task: null,
      },
    };
    const poem = getDeathPoem(officer.id);
    const poemTail = poem ? ` — 絕命詩：「${poem.zh}」` : '';
    entries.push({
      cityId: officer.locationCityId,
      kind: 'death',
      text: `${officer.name.en} (${officer.name.zh}) has died, aged ${age}.${poemTail}`,
      textZh: `${officer.name.zh}卒，享年 ${age} 歲。${poemTail}`,
    });

    // Was this officer the ruler of any force?
    const ruledForce = Object.values(forces).find(
      (f) => f.rulerOfficerId === officer.id,
    );
    if (ruledForce) {
      const succession = succeedRuler(
        ruledForce,
        officers,
        cities,
        forces,
        entries,
      );
      forces = succession.forces;
      officers = succession.officers;
      Object.assign(cities, succession.cities);
    }
  }

  return { cities, officers, forces, entries };
}

function deathChance(officer: Officer, year: number, age: number): number {
  if (officer.deathYear !== undefined) {
    // Cluster death around historical year.
    if (year < officer.deathYear) return 0;
    return Math.min(1, 0.3 + (year - officer.deathYear) * 0.15);
  }
  // Age-based fallback for fictional officers.
  if (age < 60) return 0;
  return Math.min(1, (age - 60) * 0.05);
}

interface SuccessionResult {
  cities: Record<EntityId, City>;
  officers: Record<EntityId, Officer>;
  forces: Record<EntityId, Force>;
}

function succeedRuler(
  force: Force,
  officersIn: Record<EntityId, Officer>,
  citiesIn: Record<EntityId, City>,
  forcesIn: Record<EntityId, Force>,
  entries: ReportEntry[],
): SuccessionResult {
  const candidates = Object.values(officersIn).filter(
    (o) =>
      o.forceId === force.id &&
      o.status !== 'dead' &&
      o.status !== 'imprisoned' &&
      o.status !== 'unsearched',
  );

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.stats.charisma - a.stats.charisma);
    const successor = candidates[0];
    const newName = {
      en: successor.name.en,
      zh: `${successor.name.zh}軍`,
    };
    entries.push({
      cityId: null,
      kind: 'succession',
      text: `${successor.name.en} succeeds as ruler of ${force.name.en}. The force is now known as ${newName.en}.`,
      textZh: `${successor.name.zh}繼${force.name.zh}之主位，自此號為${newName.zh}。`,
    });
    return {
      cities: citiesIn,
      officers: officersIn,
      forces: {
        ...forcesIn,
        [force.id]: {
          ...force,
          rulerOfficerId: successor.id,
          name: newName,
        },
      },
    };
  }

  // Force dissolves — cities become neutral, remaining officers go free.
  const newCities: Record<EntityId, City> = { ...citiesIn };
  const newOfficers: Record<EntityId, Officer> = { ...officersIn };
  for (const c of Object.values(newCities)) {
    if (c.ownerForceId === force.id) {
      newCities[c.id] = { ...c, ownerForceId: null, loyalty: 30 };
    }
  }
  for (const o of Object.values(newOfficers)) {
    if (o.forceId === force.id && o.status !== 'dead') {
      newOfficers[o.id] = { ...o, forceId: null, task: null };
    }
  }
  entries.push({
    cityId: null,
    kind: 'dissolution',
    text: `${force.name.en} (${force.name.zh}) has dissolved — no successor remains.`,
    textZh: `${force.name.zh}既無後嗣可繼，遂分崩離析。`,
  });
  return {
    cities: newCities,
    officers: newOfficers,
    forces: {
      ...forcesIn,
      [force.id]: { ...force, rulerOfficerId: '' },
    },
  };
}
