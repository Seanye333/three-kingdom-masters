/**
 * 大局計略 — the named schemes that move FORCES, not officers (officer-
 * level 離間 already lives in espionage):
 *
 *  驅虎吞狼 — goad force A into war with force B: their relation craters
 *    and A receives a 討伐 mark against B (+10% combat power toward
 *    them while it lasts). Easiest when they already despise each other.
 *  二虎競食 — set two neighbouring rivals at each other's throats: both
 *    relations drop, both get marks. Costlier, blunter.
 *  遠交近攻 — court the distant power: relations warm with a force that
 *    shares no border with you (distance makes friends cheap).
 *
 * Success rides your best mind. Pure planning here; the store applies.
 */
import type { City, EntityId, Officer } from '../types';
import type { DiplomaticState } from '../types/diplomacy';
import { getRelation } from '../types/diplomacy';

export type SchemeId = 'tiger-wolf' | 'two-tigers' | 'far-friend';

export interface SchemeDef {
  id: SchemeId;
  zh: string;
  en: string;
  hintZh: string;
  goldCost: number;
  /** Two targets (A vs B) or one (the distant friend). */
  targets: 1 | 2;
}

export const SCHEME_DEFS: SchemeDef[] = [
  { id: 'tiger-wolf', zh: '驅虎吞狼', en: 'Drive the Tiger', hintZh: '挑動甲勢力攻伐乙 — 兩家本有嫌隙則事半功倍', goldCost: 600, targets: 2 },
  { id: 'two-tigers', zh: '二虎競食', en: 'Two Tigers, One Prey', hintZh: '使相鄰兩強互啄 — 雙方交惡並互相得討伐之名', goldCost: 800, targets: 2 },
  { id: 'far-friend', zh: '遠交近攻', en: 'Befriend the Far', hintZh: '結好無接壤之國 — 遠人之好,近敵之憂', goldCost: 300, targets: 1 },
];

/** Do two forces share a border (any adjacent city pair)? */
export function forcesAdjacent(cities: Record<EntityId, City>, a: EntityId, b: EntityId): boolean {
  for (const c of Object.values(cities)) {
    if (c.ownerForceId !== a) continue;
    for (const adj of c.adjacentCityIds ?? []) {
      if (cities[adj]?.ownerForceId === b) return true;
    }
  }
  return false;
}

export function schemeOdds(
  scheme: SchemeId,
  diplomacy: DiplomaticState,
  strategist: Officer | null,
  a: EntityId,
  b?: EntityId,
): number {
  const iq = strategist?.stats.intelligence ?? 50;
  if (scheme === 'far-friend') return Math.min(0.95, 0.55 + iq / 300);
  const rel = b ? getRelation(diplomacy, a, b).score : 0;
  // The worse they get along, the easier the push.
  const base = scheme === 'tiger-wolf' ? 0.35 : 0.28;
  return Math.max(0.05, Math.min(0.9, base + iq / 280 - rel / 180));
}

export function validateScheme(
  scheme: SchemeId,
  cities: Record<EntityId, City>,
  playerForceId: EntityId,
  a: EntityId,
  b?: EntityId,
): string | null {
  if (a === playerForceId || b === playerForceId) return 'cannot target yourself';
  if (scheme === 'far-friend') {
    if (forcesAdjacent(cities, playerForceId, a)) return '遠交者不可接壤';
    return null;
  }
  if (!b || a === b) return 'need two distinct targets';
  if (!forcesAdjacent(cities, a, b)) return '兩家無接壤,驅之不動';
  return null;
}
