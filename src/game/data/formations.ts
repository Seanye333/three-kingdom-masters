import type { FormationDef } from '../types';

export const FORMATIONS: FormationDef[] = [
  {
    id: 'none',
    name: { en: 'No Formation', zh: '無陣' },
    description: 'Standard loose deployment. No bonuses, no penalties.',
    minIntelligence: 0,
  },
  {
    id: 'fish-scale',
    name: { en: 'Fish Scale', zh: '魚鱗' },
    description:
      'Tight overlapping ranks. Adjacent friendly units share +15% defense. Cao Cao\'s favored formation.',
    minIntelligence: 60,
  },
  {
    id: 'eight-trigrams',
    name: { en: 'Eight Trigrams', zh: '八陣' },
    description:
      'Zhuge Liang\'s masterwork. Allies in formation heal 4% troops per turn; enemies adjacent to two formation units lose 1 AP.',
    minIntelligence: 90,
  },
  {
    id: 'arrow-tip',
    name: { en: 'Arrow Tip', zh: '鋒矢' },
    description:
      'Spearhead deployment. Charge stratagem deals +25% damage; cavalry get +1 movement.',
    minIntelligence: 65,
  },
  {
    id: 'crane-wing',
    name: { en: 'Crane Wing', zh: '鶴翼' },
    description:
      'Wide encircling deployment. Archers and rain-of-arrows gain +1 range.',
    minIntelligence: 70,
  },
  {
    id: 'spread-out',
    name: { en: 'Loose Order', zh: '散開' },
    description:
      'Wide spacing. −40% damage from fire-attack, lightning, and arrow volleys; −10% damage dealt.',
    minIntelligence: 50,
  },
];

export const FORMATIONS_BY_ID: Record<string, FormationDef> =
  Object.fromEntries(FORMATIONS.map((f) => [f.id, f]));
