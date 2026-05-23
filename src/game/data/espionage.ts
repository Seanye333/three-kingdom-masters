import type { EspionageDef } from '../types';

export const ESPIONAGE_DEFS: EspionageDef[] = [
  {
    kind: 'gather-intel',
    name: { en: 'Gather Intelligence', zh: '諜報' },
    description: 'Send a spy to survey enemy resources, troop counts, and officer placements.',
    goldCost: 80,
    minIntelligence: 50,
    targetsOfficer: false,
    baseSuccess: 0.75,
  },
  {
    kind: 'instigate',
    name: { en: 'Incite Rebellion', zh: '煽動' },
    description: 'Stir unrest in a target city, dropping its loyalty by 15–30. May trigger revolt if loyalty falls below 30.',
    goldCost: 250,
    minIntelligence: 70,
    targetsOfficer: false,
    baseSuccess: 0.45,
  },
  {
    kind: 'sabotage',
    name: { en: 'Sabotage Stores', zh: '破壊' },
    description: 'Burn enemy food stocks. Destroys 30–50% of food at the targeted city.',
    goldCost: 200,
    minIntelligence: 60,
    targetsOfficer: false,
    baseSuccess: 0.55,
  },
  {
    kind: 'assassinate',
    name: { en: 'Assassinate', zh: '暗殺' },
    description: 'Send a killer after a specific enemy officer. Catastrophic if exposed.',
    goldCost: 500,
    minIntelligence: 80,
    targetsOfficer: true,
    baseSuccess: 0.25,
  },
  {
    kind: 'defect',
    name: { en: 'Turn Officer', zh: '寝返' },
    description: 'Offer gold, position, and protection to an enemy officer. Works best on those with low loyalty.',
    goldCost: 400,
    minIntelligence: 70,
    targetsOfficer: true,
    baseSuccess: 0.30,
  },
  {
    kind: 'frame',
    name: { en: 'Frame & Slander', zh: '離間' },
    description: 'Plant evidence that an enemy officer is conspiring with you. Their loyalty drops by 15–25.',
    goldCost: 150,
    minIntelligence: 65,
    targetsOfficer: true,
    baseSuccess: 0.55,
  },
];

export const ESPIONAGE_DEFS_BY_KIND: Record<string, EspionageDef> =
  Object.fromEntries(ESPIONAGE_DEFS.map((d) => [d.kind, d]));
