import type {
  City,
  CommandType,
  EntityId,
  InternalAffairsType,
  Officer,
  ReportEntry,
} from '../types';
import { ITEMS_BY_ID } from '../data/items';
import { citySize, CITY_SIZES, type CitySize } from './citySize';
import { internalAffairsMultiplier } from './traitEffects';

export interface CommandDef {
  type: CommandType;
  label: { en: string; zh: string };
  stat: keyof Officer['stats'];
  goldCost: number;
  description: string;
  /** Minimum city size tier required to issue this command. Default: hamlet (all). */
  minSize?: CitySize;
}

/** Index of city sizes (邑=0 ... 都=4) for tier comparisons. */
const SIZE_RANK: Record<CitySize, number> = Object.fromEntries(
  CITY_SIZES.map((s, i) => [s.id, i]),
) as Record<CitySize, number>;
export function meetsMinSize(citySizeId: CitySize, minSize?: CitySize): boolean {
  if (!minSize) return true;
  return SIZE_RANK[citySizeId] >= SIZE_RANK[minSize];
}

export const COMMAND_DEFS: Record<CommandType, CommandDef> = {
  'recruit-troops': {
    type: 'recruit-troops',
    label: { en: 'Recruit Troops', zh: '徴兵' },
    stat: 'charisma',
    goldCost: 500,
    description:
      'Recruit soldiers from the population. Number scales with Charisma. Reduces population.',
  },
  'improve-loyalty': {
    type: 'improve-loyalty',
    label: { en: 'Pacify People', zh: '民忠安撫' },
    stat: 'charisma',
    goldCost: 200,
    description:
      'Distribute aid to raise public loyalty. Effect scales with Charisma.',
  },
  search: {
    type: 'search',
    label: { en: 'Search for Talent', zh: '人材探訪' },
    stat: 'charisma',
    goldCost: 250,
    description:
      'Send the officer to scour the city for unknown talent. Charisma decides success. Discovered officers appear as free agents in this city.',
  },
  'encourage-migration': {
    type: 'encourage-migration',
    label: { en: 'Encourage Migration', zh: '招撫流民' },
    stat: 'charisma',
    goldCost: 400,
    description:
      '招撫流民 — Welcome refugees and migrants. Boosts population, which advances the city size tier when thresholds are crossed.',
  },
  march: {
    type: 'march',
    label: { en: 'March', zh: '出陣' },
    stat: 'leadership',
    goldCost: 100,
    description:
      'March troops to an adjacent city. If enemy-held, battle ensues. Leadership commands the army; War wins the fight.',
  },
};

export interface CommandResult {
  success: boolean;
  delta: Partial<{
    troops: number;
    population: number;
    loyalty: number;
  }>;
  message: string;
  messageZh: string;
}

export function resolveInternalAffairs(
  type: Exclude<InternalAffairsType, 'search'>,
  officer: Officer,
  city: City,
  rng: () => number,
  bonus?: { internalMultiplier?: number; recruitBonus?: number },
): CommandResult {
  const def = COMMAND_DEFS[type];
  // Trait multiplier (diligent +20%, lazy −20%, specialist +20% for matching
  // category, etc.) scales the effective stat so the output gain reflects it.
  const traitMul = internalAffairsMultiplier(officer, type);
  // Civic-title force bonus: 太守/丞相/司徒 multiply the effective stat for
  // internal-affairs commands; 刺史/丞相 add a flat recruit bonus.
  const titleMul = type === 'recruit-troops'
    ? 1 + (bonus?.recruitBonus ?? 0)
    : (bonus?.internalMultiplier ?? 1);
  const statValue = Math.round(officer.stats[def.stat] * traitMul * titleMul);

  const size = citySize(city);

  switch (type) {
    case 'recruit-troops': {
      const max = Math.floor(statValue * 20) + 200;
      // City size also limits the per-action max so a Hamlet can't recruit huge armies.
      const sizeMax = Math.floor(size.troopCap / 10);
      const fromPop = Math.min(max, sizeMax, Math.floor(city.population / 100));
      return {
        success: fromPop > 0,
        delta: { troops: fromPop, population: -fromPop * 2 },
        message: `${officer.name.en} recruited ${fromPop} troops (${size.name.zh} cap ${sizeMax}/turn; population −${fromPop * 2}).`,
        messageZh: `${officer.name.zh}徵兵 ${fromPop} 卒 (${size.name.zh}每季上限 ${sizeMax};民減 ${fromPop * 2})。`,
      };
    }
    case 'improve-loyalty': {
      const gain = Math.min(
        100 - city.loyalty,
        Math.max(1, Math.floor(statValue / 20) + Math.floor(rng() * 3)),
      );
      return {
        success: gain > 0,
        delta: { loyalty: gain },
        message: `${officer.name.en} raised Loyalty by ${gain} (now ${city.loyalty + gain}).`,
        messageZh: `${officer.name.zh}撫民,民忠 +${gain} (現 ${city.loyalty + gain})。`,
      };
    }
    case 'encourage-migration': {
      // Population boost proportional to charisma + small random.
      const base = Math.floor(statValue * 80) + 2000;
      const variance = Math.floor(rng() * 1500);
      const popGain = base + variance;
      return {
        success: true,
        delta: { population: popGain, loyalty: 1 },
        message: `${officer.name.en} 招撫流民: +${popGain.toLocaleString()} population (loyalty +1).`,
        messageZh: `${officer.name.zh}招撫流民:民眾 +${popGain.toLocaleString()} (民忠 +1)。`,
      };
    }
  }
}

export interface LostItemRef {
  itemId: EntityId;
  cityId: EntityId;
}

export interface SearchInput {
  officer: Officer;
  city: City;
  officers: Record<EntityId, Officer>;
  lostItems: LostItemRef[];
  rng: () => number;
}

export interface SearchOutput {
  officers: Record<EntityId, Officer>;
  lostItems: LostItemRef[];
  entry: ReportEntry;
}

export function handleSearch(input: SearchInput): SearchOutput {
  const { officer, city, officers, lostItems, rng } = input;
  const successChance = Math.min(0.85, officer.stats.charisma / 100);
  const succeeded = rng() < successChance;

  if (!succeeded) {
    return {
      officers,
      lostItems,
      entry: {
        cityId: city.id,
        kind: 'command-failure',
        text: `${officer.name.en} found nothing of note in ${city.name.en}.`,
        textZh: `${officer.name.zh}於${city.name.zh}遍尋無獲。`,
      },
    };
  }

  // Items hidden in *this* city — 35% chance to find one when search succeeds.
  // Intelligence bumps the find rate.
  const itemsHere = lostItems.filter((li) => li.cityId === city.id);
  const itemFindRoll = rng();
  const itemFindChance = 0.35 + Math.max(0, (officer.stats.intelligence - 60) * 0.005);
  if (itemsHere.length > 0 && itemFindRoll < itemFindChance) {
    const found = itemsHere[Math.floor(rng() * itemsHere.length)];
    // Equip to the searching officer in the right slot if free; otherwise
    // it stays in the city as a free find (player can assign via Armoury).
    const item = ITEMS_BY_ID[found.itemId];
    const updatedOfficers = { ...officers };
    let equippedNote = '';
    let equippedNoteZh = '';
    if (item && officer.forceId !== null) {
      // No slot cap — the searcher simply keeps anything they find.
      updatedOfficers[officer.id] = {
        ...officer,
        equipment: [...officer.equipment, found.itemId],
      };
      equippedNote = ` ${officer.name.en} keeps it for themselves.`;
      equippedNoteZh = `${officer.name.zh}遂自珍藏之。`;
    }
    return {
      officers: updatedOfficers,
      lostItems: lostItems.filter((li) => li.itemId !== found.itemId),
      entry: {
        cityId: city.id,
        kind: 'talent',
        text: `${officer.name.en} unearthed ${item?.name.en ?? found.itemId} (${item?.name.zh ?? ''}) in ${city.name.en}!${equippedNote}`,
        textZh: `${officer.name.zh}於${city.name.zh}得${item?.name.zh ?? found.itemId}！${equippedNoteZh}`,
      },
    };
  }

  // Prefer officers whose historical hometown matches this city.
  // Officers without a hometown (locationCityId === null) form the fallback
  // pool — they can be discovered anywhere as before.
  const allUnsearched = Object.values(officers).filter(
    (o) => o.status === 'unsearched',
  );
  const localUnsearched = allUnsearched.filter((o) => o.locationCityId === city.id);
  const rootlessUnsearched = allUnsearched.filter((o) => o.locationCityId === null);

  // Pick from local hometown pool first; fall back to rootless wanderers.
  // If both empty, we may be in a fully-known region — give up gracefully.
  const pool = localUnsearched.length > 0 ? localUnsearched : rootlessUnsearched;
  if (pool.length === 0) {
    return {
      officers,
      lostItems,
      entry: {
        cityId: city.id,
        kind: 'command-failure',
        text: `${officer.name.en} searched ${city.name.en} but found no hidden talent here.`,
        textZh: `${officer.name.zh}於${city.name.zh}訪查，未得隱才。`,
      },
    };
  }

  const discovered = pool[Math.floor(rng() * pool.length)];
  const updated: Officer = {
    ...discovered,
    status: 'idle',
    locationCityId: city.id,
    forceId: null,
    loyalty: 0,
  };
  const localFlavor = discovered.locationCityId === city.id
    ? ` ${discovered.name.en} hails from ${city.name.en}!`
    : '';
  const localFlavorZh = discovered.locationCityId === city.id
    ? `${discovered.name.zh}本${city.name.zh}人士也！`
    : '';
  return {
    officers: { ...officers, [discovered.id]: updated },
    lostItems,
    entry: {
      cityId: city.id,
      kind: 'talent',
      text: `${officer.name.en} discovered ${discovered.name.en} (${discovered.name.zh}) in ${city.name.en}!${localFlavor}`,
      textZh: `${officer.name.zh}於${city.name.zh}訪得賢才${discovered.name.zh}！${localFlavorZh}`,
    },
  };
}
