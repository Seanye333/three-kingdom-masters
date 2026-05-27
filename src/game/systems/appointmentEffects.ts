import type { Appointment, EntityId, Officer } from '../types';
import { CIVIC_TITLES_BY_ID, MILITARY_RANKS_BY_ID } from '../data/titles';

export interface AppointmentBonus {
  internalMultiplier: number;
  recruitBonus: number;
  powerMultiplier: number;
  diplomacyMultiplier: number;
  loyaltyDriftPerSeason: number;
  advisorMultiplier: number;
}

const ZERO: AppointmentBonus = {
  internalMultiplier: 1,
  recruitBonus: 0,
  powerMultiplier: 1,
  diplomacyMultiplier: 1,
  loyaltyDriftPerSeason: 0,
  advisorMultiplier: 1,
};

/**
 * Aggregate civic-title force bonuses for a force, optionally scoped to a
 * single city (prefect bonuses only apply at their seat). Skips titles
 * whose holder is dead or imprisoned.
 */
export function appointmentBonusFor(
  forceId: EntityId | null,
  appointments: Appointment[],
  officers: Record<EntityId, Officer>,
  cityId?: EntityId,
): AppointmentBonus {
  if (!forceId) return { ...ZERO };
  const out: AppointmentBonus = { ...ZERO };
  for (const a of appointments) {
    if (a.forceId !== forceId) continue;
    const o = officers[a.officerId];
    if (!o || o.status === 'dead' || o.status === 'imprisoned') continue;
    const def = CIVIC_TITLES_BY_ID[a.titleId];
    if (!def) continue;
    // Prefect: only contributes when the city matches its seat.
    if (a.titleId === 'prefect') {
      if (cityId && a.cityId !== cityId) continue;
      if (!cityId && !a.cityId) continue;
    }
    const fb = def.forceBonus;
    if (fb.internalMultiplier)  out.internalMultiplier  *= fb.internalMultiplier;
    if (fb.recruitBonus)        out.recruitBonus        += fb.recruitBonus;
    if (fb.powerMultiplier)     out.powerMultiplier     *= fb.powerMultiplier;
    if (fb.diplomacyMultiplier) out.diplomacyMultiplier *= fb.diplomacyMultiplier;
    if (fb.loyaltyDrift)        out.loyaltyDriftPerSeason += fb.loyaltyDrift;
    if (fb.advisorMultiplier)   out.advisorMultiplier   *= fb.advisorMultiplier;
  }
  return out;
}

/**
 * Total military stipend owed per season by a force — sum of all officers'
 * rank stipends. Deducted from the force's capital at season-end.
 */
export function totalStipendForForce(
  forceId: EntityId | null,
  officers: Record<EntityId, Officer>,
): number {
  if (!forceId) return 0;
  let sum = 0;
  for (const o of Object.values(officers)) {
    if (o.forceId !== forceId) continue;
    if (o.status === 'dead' || o.status === 'imprisoned') continue;
    const rank = MILITARY_RANKS_BY_ID[o.rank];
    if (rank) sum += rank.stipend;
  }
  return sum;
}
