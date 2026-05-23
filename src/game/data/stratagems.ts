import type { Stratagem } from '../types';

export const STRATAGEMS: Stratagem[] = [
  {
    id: 'fire-attack',
    name: { en: 'Fire Attack', zh: '火計' },
    description:
      'Set the enemy unit alight. Burning units lose 8% troops per turn for 3 turns. Doubled in wind, halved in rain.',
    minIntelligence: 70,
    range: 3,
    cooldown: 0,
  },
  {
    id: 'confusion',
    name: { en: 'Confusion', zh: '計略' },
    description:
      'Mislead an enemy commander. Confused units have AP halved for 2 turns.',
    minIntelligence: 75,
    range: 4,
    cooldown: 0,
  },
  {
    id: 'charge',
    name: { en: 'Charge', zh: '突撃' },
    description:
      'A devastating melee attack: +50% damage on this strike, but spends all remaining AP.',
    minIntelligence: 0,
    range: 1,
    cooldown: 2,
  },
  {
    id: 'defend',
    name: { en: 'Defend', zh: '防御' },
    description:
      'Brace for impact. Incoming damage halved until your next turn.',
    minIntelligence: 0,
    range: 0,
    cooldown: 0,
  },
  {
    id: 'rally',
    name: { en: 'Rally', zh: '鼓舞' },
    description:
      'Inspire troops in an adjacent friendly unit, restoring 5% morale and 15% troops (capped at max).',
    minIntelligence: 60,
    range: 2,
    cooldown: 2,
  },
  {
    id: 'rain-of-arrows',
    name: { en: 'Rain of Arrows', zh: '矢雨齊發' },
    description:
      'A volley at range 2–4 dealing 12% damage to one enemy unit. Range halved at night.',
    minIntelligence: 0,
    range: 4,
    cooldown: 1,
  },
  {
    id: 'chain-ships',
    name: { en: 'Chain Ships', zh: '連環' },
    description:
      'Link the target and its neighbors with chains for 4 turns. Damage to any chained enemy spreads 50% to the others. Devastating with fire.',
    minIntelligence: 80,
    range: 3,
    cooldown: 0,
  },
  {
    id: 'false-retreat',
    name: { en: 'False Retreat', zh: '偽計' },
    description:
      'Pretend to break and flee. Closest enemy pursues — and arrives confused, losing AP next turn.',
    minIntelligence: 70,
    range: 0,
    cooldown: 0,
  },
  {
    id: 'precognition',
    name: { en: 'Precognition', zh: '神算' },
    description:
      'See all enemy AP, status, and cooldowns for 2 turns. Reveals their next move intent.',
    minIntelligence: 90,
    range: 0,
    cooldown: 0,
  },
  {
    id: 'lightning',
    name: { en: 'Heaven\'s Lightning', zh: '落雷' },
    description:
      'A bolt strikes a tile within 4 hexes for 15% damage. 30% chance to confuse the struck unit.',
    minIntelligence: 85,
    range: 4,
    cooldown: 0,
  },
  {
    id: 'supply-strike',
    name: { en: 'Supply Strike', zh: '兵糧攻' },
    description:
      'Burn the enemy supply train. Every enemy unit on the map becomes demoralized: −20% damage dealt for 3 turns.',
    minIntelligence: 75,
    range: 0,
    cooldown: 0,
  },
  {
    id: 'gallop',
    name: { en: "Flying General's Gallop", zh: '飛将' },
    description:
      "Lü Bu's signature. Charge up to 3 hexes in a straight line, attacking the first enemy you reach for +75% damage.",
    minIntelligence: 0,
    range: 3,
    cooldown: 3,
  },
  {
    id: 'dragon-veil',
    name: { en: "Zilong's Dragon Veil", zh: '龍威' },
    description:
      "Zhao Yun's signature. Make a free attack on every adjacent enemy with no AP cost.",
    minIntelligence: 0,
    range: 0,
    cooldown: 3,
  },
];

export const STRATAGEMS_BY_ID: Record<string, Stratagem> = Object.fromEntries(
  STRATAGEMS.map((s) => [s.id, s]),
);
