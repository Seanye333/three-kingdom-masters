/**
 * Academy training system.
 *
 * Officer stationed at a city with an Academy (書院) building can spend a
 * season learning a new policy. The new policy must either be a base policy
 * (no prereqs) or have all its prereqs already in the officer's repertoire.
 *
 * State lives in `gameState.pendingTrainings`. The season-end tick decrements
 * `seasonsLeft`; at zero, the officer's `policies` array gains the new one.
 */
import type { Building, City, EntityId, Officer, PolicyId } from '../types';
import { POLICY_DEFS, POLICY_PREREQ } from '../data/officerAttributes';

export const TRAINING_BASE_COST = 200;
export const TRAINING_COST_PER_EXTRA = 50;
export const TRAINING_SEASONS = 1;
export const TRAINING_POLICY_CAP = 8;

export interface PendingTraining {
  officerId: EntityId;
  cityId: EntityId;
  policyId: PolicyId;
  seasonsLeft: number;
  goldSpent: number;
}

/** Cost grows with how many policies the officer already has, so deep
 *  specialists pay more for each new specialty. */
export function trainingCost(officer: Officer): number {
  const have = officer.policies?.length ?? 0;
  return TRAINING_BASE_COST + TRAINING_COST_PER_EXTRA * have;
}

/** Does this city have an Academy that can host training? */
export function cityHasAcademy(city: City, buildings: Building[]): boolean {
  return buildings.some(
    (b) => b.cityId === city.id && b.id === 'academy' && (b.level ?? 0) >= 1,
  );
}

/** Result of `canTrain` — either OK, or a reason it can't proceed. */
export type TrainCheck =
  | { ok: true }
  | { ok: false; reason: string; reasonZh: string };

export function canTrain(
  officer: Officer,
  city: City,
  policyId: PolicyId,
  buildings: Building[],
  pendingTrainings: PendingTraining[],
): TrainCheck {
  if (!cityHasAcademy(city, buildings)) {
    return { ok: false, reason: 'No academy in this city.', reasonZh: '此城無書院。' };
  }
  if (city.gold < trainingCost(officer)) {
    return { ok: false, reason: 'Not enough gold.', reasonZh: '金錢不足。' };
  }
  if (officer.status !== 'idle' || officer.task) {
    return { ok: false, reason: 'Officer is busy.', reasonZh: '該武將另有任務。' };
  }
  if (officer.locationCityId !== city.id) {
    return { ok: false, reason: 'Officer is not in this city.', reasonZh: '該武將不在此城。' };
  }
  const have = officer.policies ?? [];
  if (have.length >= TRAINING_POLICY_CAP) {
    return {
      ok: false,
      reason: `Officer already has ${TRAINING_POLICY_CAP} policies (cap).`,
      reasonZh: `武將政策已達上限 ${TRAINING_POLICY_CAP} 個。`,
    };
  }
  if (have.includes(policyId)) {
    return { ok: false, reason: 'Officer already knows this policy.', reasonZh: '武將已通此政策。' };
  }
  // Already in queue?
  if (pendingTrainings.some((t) => t.officerId === officer.id)) {
    return { ok: false, reason: 'Officer is already training.', reasonZh: '武將正在培訓中。' };
  }
  // Prereqs must already be on the officer.
  const prereqs = POLICY_PREREQ[policyId] ?? [];
  const missing = prereqs.filter((p) => !have.includes(p));
  if (missing.length > 0) {
    const zhList = missing.map((m) => POLICY_DEFS[m]?.zh ?? m).join('、');
    const enList = missing.map((m) => POLICY_DEFS[m]?.en ?? m).join(', ');
    return {
      ok: false,
      reason: `Needs prerequisite: ${enList}.`,
      reasonZh: `需先學:${zhList}。`,
    };
  }
  return { ok: true };
}

/** Which policies the officer is currently eligible to start learning?
 *  Pure UI helper — derives from POLICY_DEFS and the prereq map. */
export function eligiblePolicies(officer: Officer): {
  available: PolicyId[];
  locked: Array<{ id: PolicyId; missing: PolicyId[] }>;
} {
  const have = new Set(officer.policies ?? []);
  const available: PolicyId[] = [];
  const locked: Array<{ id: PolicyId; missing: PolicyId[] }> = [];
  for (const idStr of Object.keys(POLICY_DEFS)) {
    const id = idStr as PolicyId;
    if (have.has(id)) continue;
    const prereqs = POLICY_PREREQ[id] ?? [];
    const missing = prereqs.filter((p) => !have.has(p));
    if (missing.length === 0) available.push(id);
    else locked.push({ id, missing });
  }
  return { available, locked };
}

/** Advance all in-flight trainings by one season. Returns the new list
 *  plus completed entries so the caller can apply policy mutations. */
export function tickTrainings(
  trainings: PendingTraining[],
): { remaining: PendingTraining[]; completed: PendingTraining[] } {
  const remaining: PendingTraining[] = [];
  const completed: PendingTraining[] = [];
  for (const t of trainings) {
    const next = { ...t, seasonsLeft: t.seasonsLeft - 1 };
    if (next.seasonsLeft <= 0) completed.push(next);
    else remaining.push(next);
  }
  return { remaining, completed };
}
