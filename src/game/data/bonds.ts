import type { EntityId } from '../types';

export interface OathBond {
  officerA: EntityId;
  officerB: EntityId;
  floor: number; // loyalty floor when both serve the same force
  kind: 'oath' | 'clan' | 'sibling' | 'cousin' | 'parent';
  label: string;
}

export const OATH_BONDS: OathBond[] = [
  // Peach Garden Oath — sworn brotherhood
  { officerA: 'liu-bei',     officerB: 'guan-yu',     floor: 95, kind: 'oath',    label: 'Peach Garden Oath' },
  { officerA: 'liu-bei',     officerB: 'zhang-fei',   floor: 95, kind: 'oath',    label: 'Peach Garden Oath' },
  { officerA: 'guan-yu',     officerB: 'zhang-fei',   floor: 95, kind: 'oath',    label: 'Peach Garden Oath' },

  // Cao + Xiahou clan (the Cao family is a fusion of two surname lines)
  { officerA: 'cao-cao',     officerB: 'xiahou-dun',  floor: 92, kind: 'clan',    label: 'Cao–Xiahou Clan' },
  { officerA: 'cao-cao',     officerB: 'xiahou-yuan', floor: 90, kind: 'clan',    label: 'Cao–Xiahou Clan' },
  { officerA: 'cao-cao',     officerB: 'cao-ren',     floor: 92, kind: 'cousin',  label: 'Cao Cousins' },
  { officerA: 'cao-cao',     officerB: 'cao-hong',    floor: 88, kind: 'cousin',  label: 'Cao Cousins' },
  { officerA: 'xiahou-dun',  officerB: 'xiahou-yuan', floor: 90, kind: 'cousin',  label: 'Xiahou Cousins' },
  { officerA: 'cao-ren',     officerB: 'cao-hong',    floor: 88, kind: 'cousin',  label: 'Cao Cousins' },

  // Sun brothers
  { officerA: 'sun-ce',      officerB: 'sun-quan',    floor: 95, kind: 'sibling', label: 'Sun Brothers' },
  { officerA: 'sun-ce',      officerB: 'sun-yi',      floor: 90, kind: 'sibling', label: 'Sun Brothers' },
  { officerA: 'sun-quan',    officerB: 'sun-yi',      floor: 88, kind: 'sibling', label: 'Sun Brothers' },

  // Ma family
  { officerA: 'ma-teng',     officerB: 'ma-chao',     floor: 92, kind: 'parent',  label: 'Ma Father–Son' },
  { officerA: 'ma-chao',     officerB: 'ma-dai',      floor: 90, kind: 'cousin',  label: 'Ma Cousins' },

  // Yuan brothers (historically fractious — weaker bond)
  { officerA: 'yuan-tan',    officerB: 'yuan-shang',  floor: 75, kind: 'sibling', label: 'Yuan Brothers' },

  // Zhuge brothers (across factions historically — bond rarely active)
  { officerA: 'zhuge-liang', officerB: 'zhuge-jin',   floor: 85, kind: 'sibling', label: 'Zhuge Brothers' },

  // Sima clan
  { officerA: 'sima-yi',     officerB: 'sima-shi',    floor: 92, kind: 'parent',  label: 'Sima Father–Son' },
  { officerA: 'sima-yi',     officerB: 'sima-zhao',   floor: 92, kind: 'parent',  label: 'Sima Father–Son' },
  { officerA: 'sima-shi',    officerB: 'sima-zhao',   floor: 90, kind: 'sibling', label: 'Sima Brothers' },
  { officerA: 'sima-zhao',   officerB: 'sima-yan',    floor: 90, kind: 'parent',  label: 'Sima Father–Son' },
];
