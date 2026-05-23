import type {
  City,
  EntityId,
  EspionageOp,
  EspionageResult,
  Officer,
  ReportEntry,
} from '../types';
import { ESPIONAGE_DEFS_BY_KIND } from '../data/espionage';

export interface EspionageContext {
  ops: EspionageOp[];
  cities: Record<EntityId, City>;
  officers: Record<EntityId, Officer>;
  playerForceId: EntityId | null;
  rng: () => number;
}

export interface EspionageOutput {
  cities: Record<EntityId, City>;
  officers: Record<EntityId, Officer>;
  results: EspionageResult[];
  entries: ReportEntry[];
}

/**
 * Resolves all pending espionage ops at season-end. Each op's success
 * chance is its baseSuccess scaled by:
 *   agent INT / 100
 *   (1 + (agent INT − target avg INT) × 0.5%)
 *   defection only: (100 − target loyalty) / 50  (heavy)
 */
export function resolveEspionage(ctx: EspionageContext): EspionageOutput {
  const cities = { ...ctx.cities };
  const officers = { ...ctx.officers };
  const results: EspionageResult[] = [];
  const entries: ReportEntry[] = [];

  for (const op of ctx.ops) {
    const def = ESPIONAGE_DEFS_BY_KIND[op.kind];
    const agent = officers[op.agentOfficerId];
    if (!def || !agent) continue;

    // Compute success.
    const targetForceOfficers = Object.values(officers).filter(
      (o) => o.forceId === op.targetForceId && o.status !== 'dead',
    );
    const targetAvgInt =
      targetForceOfficers.length > 0
        ? targetForceOfficers.reduce((s, o) => s + o.stats.intelligence, 0) /
          targetForceOfficers.length
        : 60;

    let chance = def.baseSuccess * (agent.stats.intelligence / 100);
    chance += (agent.stats.intelligence - targetAvgInt) * 0.005;

    if (op.kind === 'defect' && op.targetOfficerId) {
      const t = officers[op.targetOfficerId];
      if (t) chance += ((100 - t.loyalty) / 50) - 0.2;
    }

    chance = Math.max(0.02, Math.min(0.95, chance));
    const roll = ctx.rng();
    const success = roll < chance;

    let message = '';

    if (op.kind === 'gather-intel') {
      if (success) {
        const cityList = Object.values(cities)
          .filter((c) => c.ownerForceId === op.targetForceId)
          .map((c) => `${c.name.en} (T:${c.troops.toLocaleString()}, G:${c.gold}, F:${c.food})`)
          .slice(0, 4)
          .join('; ');
        message = `${agent.name.en}'s spies report: ${cityList || '(no cities)'}.`;
      } else {
        message = `${agent.name.en}'s spy ring was uncovered. The agent escaped with nothing.`;
      }
    } else if (op.kind === 'instigate' && op.targetCityId) {
      const c = cities[op.targetCityId];
      if (!c) {
        message = `Target city no longer exists.`;
      } else if (success) {
        const drop = 15 + Math.floor(ctx.rng() * 16);
        cities[op.targetCityId] = {
          ...c,
          loyalty: Math.max(0, c.loyalty - drop),
        };
        message = `Agitators in ${c.name.en} caused loyalty to drop by ${drop}.`;
      } else {
        message = `Plot in ${c.name.en} was exposed. The agitators were executed.`;
      }
    } else if (op.kind === 'sabotage' && op.targetCityId) {
      const c = cities[op.targetCityId];
      if (!c) {
        message = `Target city no longer exists.`;
      } else if (success) {
        const lost = Math.floor(c.food * (0.3 + ctx.rng() * 0.2));
        cities[op.targetCityId] = { ...c, food: Math.max(0, c.food - lost) };
        message = `Granaries at ${c.name.en} put to the torch: ${lost.toLocaleString()} food destroyed.`;
      } else {
        message = `Saboteurs at ${c.name.en} were caught and hanged.`;
      }
    } else if (op.kind === 'assassinate' && op.targetOfficerId) {
      const t = officers[op.targetOfficerId];
      if (!t || t.status === 'dead') {
        message = `Target unavailable.`;
      } else if (success) {
        officers[op.targetOfficerId] = {
          ...t,
          status: 'dead',
          forceId: null,
          task: null,
        };
        message = `${t.name.en} was struck down by an unknown assassin.`;
      } else {
        message = `The assassin failed. ${t.name.en} survives the attempt.`;
        // Modest blowback: drop diplomatic relation handled elsewhere; for now
        // the player simply loses the gold (already deducted).
      }
    } else if (op.kind === 'defect' && op.targetOfficerId) {
      const t = officers[op.targetOfficerId];
      if (!t || t.status === 'dead') {
        message = `Target unavailable.`;
      } else if (success && ctx.playerForceId) {
        officers[op.targetOfficerId] = {
          ...t,
          forceId: ctx.playerForceId,
          loyalty: 60,
          status: 'idle',
          task: null,
        };
        message = `${t.name.en} secretly defected and is now in your service!`;
      } else {
        // Blowback: officer's loyalty to their lord shoots up.
        if (t) {
          officers[op.targetOfficerId] = {
            ...t,
            loyalty: Math.min(100, t.loyalty + 10),
          };
        }
        message = `${t?.name.en ?? 'Target'} reported the bribe. Their loyalty has increased.`;
      }
    } else if (op.kind === 'frame' && op.targetOfficerId) {
      const t = officers[op.targetOfficerId];
      if (!t || t.status === 'dead') {
        message = `Target unavailable.`;
      } else if (success) {
        const drop = 15 + Math.floor(ctx.rng() * 11);
        officers[op.targetOfficerId] = {
          ...t,
          loyalty: Math.max(0, t.loyalty - drop),
        };
        message = `Slander against ${t.name.en} took root: loyalty −${drop}.`;
      } else {
        message = `The slander against ${t.name.en} was disbelieved.`;
      }
    }

    results.push({ op, success, message });
    entries.push({
      cityId: op.targetCityId ?? agent.locationCityId ?? null,
      kind: 'espionage',
      text: `[${def.name.en}] ${message}`,
    });
  }

  return { cities, officers, results, entries };
}
