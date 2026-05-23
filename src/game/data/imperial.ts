import type { EdictDef, ImperialRankDef } from '../types';

export const IMPERIAL_RANKS: ImperialRankDef[] = [
  {
    id: 'commoner',
    name: { en: 'Commoner', zh: '庶民' },
    tier: 0,
    recruitBonus: 0,
    internalMultiplier: 1.0,
  },
  {
    id: 'marquis',
    name: { en: 'Marquis', zh: '侯' },
    tier: 1,
    recruitBonus: 0.05,
    internalMultiplier: 1.05,
  },
  {
    id: 'duke',
    name: { en: 'Duke', zh: '公' },
    tier: 2,
    recruitBonus: 0.1,
    internalMultiplier: 1.1,
  },
  {
    id: 'king',
    name: { en: 'King', zh: '王' },
    tier: 3,
    recruitBonus: 0.15,
    internalMultiplier: 1.2,
  },
  {
    id: 'emperor',
    name: { en: 'Emperor', zh: '帝' },
    tier: 4,
    recruitBonus: 0.25,
    internalMultiplier: 1.35,
  },
];

export const IMPERIAL_RANKS_BY_ID: Record<string, ImperialRankDef> =
  Object.fromEntries(IMPERIAL_RANKS.map((r) => [r.id, r]));

export const EDICTS: EdictDef[] = [
  {
    kind: 'tax-amnesty',
    name: { en: 'Grand Amnesty', zh: '大赦' },
    description: '+10 loyalty in every city you own. Costs 1000 gold.',
    minRank: 'duke',
    goldCost: 1000,
    cooldownSeasons: 8,
  },
  {
    kind: 'denounce',
    name: { en: 'Denounce Rival', zh: '討伐令' },
    description: 'Publicly brand a rival a traitor. Damages their officer loyalty; you gain casus belli.',
    minRank: 'duke',
    goldCost: 500,
    cooldownSeasons: 4,
  },
  {
    kind: 'levy-tribute',
    name: { en: 'Levy Tribute', zh: '朝貢' },
    description: 'Demand tribute from a vassal or weaker force. Yields gold if they comply.',
    minRank: 'king',
    goldCost: 200,
    cooldownSeasons: 4,
  },
  {
    kind: 'declare-vassal',
    name: { en: 'Bestow Vassalage', zh: '冊封' },
    description: 'Recognize a force as your vassal — establishes legal subordination.',
    minRank: 'king',
    goldCost: 0,
    cooldownSeasons: 12,
  },
  {
    kind: 'enthronement',
    name: { en: 'Proclaim Emperor', zh: '即位' },
    description: 'Declare yourself Emperor. All non-vassal forces lose loyalty toward you. Permanent.',
    minRank: 'king',
    goldCost: 5000,
    cooldownSeasons: 99,
  },
];

export const EDICTS_BY_KIND: Record<string, EdictDef> = Object.fromEntries(
  EDICTS.map((e) => [e.kind, e]),
);
