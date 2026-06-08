import type { EntityId } from '../types';
import { pairKey } from '../types/diplomacy';
import type { OathBond } from '../data/bonds';

/**
 * Rapport (好感) — a pairwise 0–100 affinity the player grows through social
 * actions (結交/宴請/贈禮). When a pair reaches the threshold they swear a bond
 * (義結金蘭), which the rest of the game already understands (loyalty floor,
 * battle synergy, no defection). This is the RTK13 "rapport → bond" loop.
 */
export const RAPPORT_BOND_THRESHOLD = 100;

export function getRapport(rapport: Record<string, number>, a: EntityId, b: EntityId): number {
  return rapport[pairKey(a, b)] ?? 0;
}

/**
 * Raise the rapport between two officers. If it reaches the threshold and they
 * aren't already bonded, return a freshly-forged 義結 bond to push into
 * runtimeBonds. Rapport is capped at the threshold.
 */
export function addRapport(
  rapport: Record<string, number>,
  a: EntityId,
  b: EntityId,
  amount: number,
  alreadyBonded: boolean,
  label = '義結金蘭 Sworn Bond',
): { rapport: Record<string, number>; forged: OathBond | null } {
  if (a === b) return { rapport, forged: null };
  const key = pairKey(a, b);
  const next = Math.min(RAPPORT_BOND_THRESHOLD, (rapport[key] ?? 0) + amount);
  const out = { ...rapport, [key]: next };
  const forged: OathBond | null =
    next >= RAPPORT_BOND_THRESHOLD && !alreadyBonded
      ? { officerA: a, officerB: b, floor: 75, kind: 'oath', label }
      : null;
  return { rapport: out, forged };
}

/** Pairwise rapport bump across a set of officers (e.g. everyone at a banquet). */
export function mingleRapport(
  rapport: Record<string, number>,
  officerIds: EntityId[],
  amount: number,
): Record<string, number> {
  let out = rapport;
  for (let i = 0; i < officerIds.length; i++) {
    for (let j = i + 1; j < officerIds.length; j++) {
      const key = pairKey(officerIds[i], officerIds[j]);
      out = { ...out, [key]: Math.min(RAPPORT_BOND_THRESHOLD, (out[key] ?? 0) + amount) };
    }
  }
  return out;
}
