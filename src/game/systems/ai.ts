import type {
  City,
  Command,
  DiplomaticState,
  EntityId,
  Force,
  GameDate,
  InternalAffairsCommand,
  InternalAffairsType,
  MarchCommand,
  Officer,
  OfficerStats,
  ReportEntry,
} from '../types';
import { getRelation, isHostilePermitted, pairKey } from '../types';
import type { Difficulty } from '../state/gameState';
import { OATH_BONDS, type OathBond } from '../data/bonds';
import { COMMAND_DEFS } from './commands';
import {
  NAP_PROPOSAL_COST,
  computeTotalTroops,
  proposeNonAggression,
} from './diplomacy';
import {
  FREE_AGENT_COST,
  attemptFreeAgentRecruit,
} from './officerFate';
import type { Building, PolicyId } from '../types';
import {
  academyCapacity,
  academyLevel,
  cityHasAcademy,
  eligiblePolicies,
  policyTier,
  trainingCost,
  trainingDurationSeasons,
  trainingsInCity,
  type PendingTraining,
  eligibleTactics,
  tacticTier,
  tacticTrainingCost,
  tacticDurationSeasons,
} from './training';
import { TACTIC_DEFS, type TacticId } from '../data/officerAttributes';
import { commandFitMultiplier, isCombatLiability } from './traitEffects';

export interface AIPlanInput {
  cities: Record<EntityId, City>;
  officers: Record<EntityId, Officer>;
  forces: Record<EntityId, Force>;
  playerForceId: EntityId | null;
  pendingCommands: Record<EntityId, Command>;
  pendingTrainings: PendingTraining[];
  buildings: Building[];
  diplomacy: DiplomaticState;
  runtimeBonds: OathBond[];
  date: GameDate;
  difficulty?: Difficulty;
  rng?: () => number;
}

export interface AIPlanOutput {
  cities: Record<EntityId, City>;
  officers: Record<EntityId, Officer>;
  pendingCommands: Record<EntityId, Command>;
  /** Trainings the AI started this turn (to be merged into state.pendingTrainings). */
  newTrainings: PendingTraining[];
  diplomacy: DiplomaticState;
  runtimeBonds: OathBond[];
  entries: ReportEntry[];
}

/**
 * Plan one season of commands for every non-player force.
 * Mutates copies and returns the merged result so resolveSeason can run
 * over the combined player + AI pendingCommands.
 */
export function planAITurn(input: AIPlanInput): AIPlanOutput {
  const rng = input.rng ?? Math.random;
  const difficulty = input.difficulty ?? 'normal';
  const cities = { ...input.cities };
  const officers = { ...input.officers };
  const pendingCommands = { ...input.pendingCommands };
  const newTrainings: PendingTraining[] = [];
  let diplomacy = input.diplomacy;
  const runtimeBonds = [...input.runtimeBonds];
  const entries: ReportEntry[] = [];

  // Group cities by owning force.
  const citiesByForce = new Map<EntityId, City[]>();
  for (const city of Object.values(cities)) {
    if (!city.ownerForceId) continue;
    if (city.ownerForceId === input.playerForceId) continue;
    const arr = citiesByForce.get(city.ownerForceId) ?? [];
    arr.push(city);
    citiesByForce.set(city.ownerForceId, arr);
  }

  for (const [forceId, forceCities] of citiesByForce) {
    for (const city of forceCities) {
      if (pendingCommands[city.id]) continue; // shouldn't happen but safe
      const officersHere = Object.values(officers).filter(
        (o) =>
          o.locationCityId === city.id &&
          o.forceId === forceId &&
          o.status === 'idle' &&
          !o.task,
      );
      if (officersHere.length === 0) continue;

      const decision = decideCommand(
        city,
        officersHere,
        cities,
        forceId,
        difficulty,
        input.diplomacy,
        rng,
      );
      if (!decision) continue;

      // Apply: debit gold, mark officer (and companions) busy, store command.
      cities[city.id] = {
        ...cities[city.id],
        gold:
          cities[city.id].gold - COMMAND_DEFS[decision.command.type].goldCost,
      };
      officers[decision.officer.id] = {
        ...officers[decision.officer.id],
        task: decision.command.type,
      };
      if (decision.companions) {
        for (const cid of decision.companions) {
          if (officers[cid]) {
            officers[cid] = { ...officers[cid], task: decision.command.type };
          }
        }
      }
      pendingCommands[city.id] = decision.command;
    }
  }

  // ── AI hires free agents in its cities
  for (const [forceId, forceCities] of citiesByForce) {
    const force = input.forces[forceId];
    if (!force) continue;
    const ruler = officers[force.rulerOfficerId];
    if (!ruler || ruler.status === 'dead') continue;

    for (const city of forceCities) {
      const updatedCity = cities[city.id];
      if (!updatedCity || updatedCity.gold < FREE_AGENT_COST) continue;
      const agents = Object.values(officers).filter(
        (o) =>
          o.locationCityId === city.id &&
          o.status === 'idle' &&
          o.forceId === null,
      );
      if (agents.length === 0) continue;
      // Prefer highest-total free agent.
      const target = [...agents].sort(
        (a, b) =>
          b.stats.leadership + b.stats.war + b.stats.intelligence + b.stats.politics + b.stats.charisma -
          (a.stats.leadership + a.stats.war + a.stats.intelligence + a.stats.politics + a.stats.charisma),
      )[0];
      const result = attemptFreeAgentRecruit({
        officer: target,
        city: updatedCity,
        recruiterForce: force,
        recruiterRuler: ruler,
        rng,
      });
      cities[city.id] = {
        ...updatedCity,
        gold: updatedCity.gold - FREE_AGENT_COST,
      };
      if (result.ok && result.recruitedOfficer) {
        officers[target.id] = result.recruitedOfficer;
        entries.push({
          cityId: city.id,
          kind: 'note',
          text: `${target.name.en} enters service under ${force.name.en} at ${city.name.en}.`,
          textZh: `${target.name.zh}於${city.name.zh}投效${force.name.zh}。`,
        });
      }
    }
  }

  // ── AI-initiated diplomacy: weak AI forces seek NAPs with much
  //    stronger neighbors (player included) to buy time.
  const aiForceIds = Array.from(citiesByForce.keys());
  for (const forceId of aiForceIds) {
    if (rng() > 0.25) continue; // 25% chance per AI per season

    const force = input.forces[forceId];
    const ruler = force ? officers[force.rulerOfficerId] : null;
    if (!force || !ruler || ruler.status === 'dead') continue;
    const capital = cities[force.capitalCityId];
    if (!capital || capital.gold < NAP_PROPOSAL_COST) continue;

    const myTroops = computeTotalTroops(forceId, cities);
    // Find a stronger neighbor we don't already have a treaty with.
    const neighbors = new Set<EntityId>();
    for (const c of citiesByForce.get(forceId) ?? []) {
      for (const adjId of c.adjacentCityIds) {
        const adj = cities[adjId];
        if (adj?.ownerForceId && adj.ownerForceId !== forceId) {
          neighbors.add(adj.ownerForceId);
        }
      }
    }
    const candidates = [...neighbors]
      .map((nid) => ({
        id: nid,
        troops: computeTotalTroops(nid, cities),
        rel: getRelation(diplomacy, forceId, nid),
      }))
      .filter(
        (n) =>
          n.rel.status === 'neutral' &&
          n.troops > myTroops * 1.4, // only seek peace from much stronger
      )
      .sort((a, b) => b.troops - a.troops);

    const target = candidates[0];
    if (!target) continue;
    const targetForce = input.forces[target.id];
    if (!targetForce) continue;

    const outcome = proposeNonAggression({
      player: force,
      playerRulerCharisma: ruler.stats.charisma,
      target: targetForce,
      targetTotalTroops: target.troops,
      playerTotalTroops: myTroops,
      diplomacy,
      date: input.date,
      rng,
    });
    if (outcome.ok) {
      cities[capital.id] = {
        ...capital,
        gold: capital.gold - NAP_PROPOSAL_COST,
      };
      diplomacy = outcome.diplomacy;
      entries.push({
        cityId: null,
        kind: 'note',
        text: outcome.accepted
          ? `${force.name.en} sues for peace with ${targetForce.name.en} — non-aggression pact signed.`
          : `${force.name.en} sought peace with ${targetForce.name.en}, but was rebuffed.`,
        textZh: outcome.accepted
          ? `${force.name.zh}向${targetForce.name.zh}求和，互不侵犯之盟既立。`
          : `${force.name.zh}遣使向${targetForce.name.zh}議和，遭其婉拒。`,
      });
    }
  }

  // ── AI marriage diplomacy: forces with high positive relations may
  //    propose marriages to cement the bond. 8% chance per friendly pair.
  for (const forceId of aiForceIds) {
    const force = input.forces[forceId];
    if (!force) continue;
    const capital = cities[force.capitalCityId];
    if (!capital || capital.gold < 1000) continue;

    for (const otherId of aiForceIds) {
      if (otherId === forceId || otherId <= forceId) continue; // avoid dup
      const other = input.forces[otherId];
      if (!other) continue;
      const rel = getRelation(diplomacy, forceId, otherId);
      if (rel.score < 60) continue;
      if (rng() > 0.08) continue;

      // Already a marriage between these forces? Skip.
      const officersA = Object.values(officers).filter(
        (o) => o.forceId === forceId && o.status === 'idle',
      );
      const officersB = Object.values(officers).filter(
        (o) => o.forceId === otherId && o.status === 'idle',
      );
      if (officersA.length === 0 || officersB.length === 0) continue;

      const aIds = new Set(officersA.map((o) => o.id));
      const bIds = new Set(officersB.map((o) => o.id));
      const alreadyMarried = runtimeBonds.some(
        (b) =>
          (aIds.has(b.officerA) && bIds.has(b.officerB)) ||
          (aIds.has(b.officerB) && bIds.has(b.officerA)),
      );
      if (alreadyMarried) continue;

      // Pick highest-charisma officer from each side.
      const aPick = [...officersA].sort(
        (a, b) => b.stats.charisma - a.stats.charisma,
      )[0];
      const bPick = [...officersB].sort(
        (a, b) => b.stats.charisma - a.stats.charisma,
      )[0];

      cities[capital.id] = { ...capital, gold: capital.gold - 1000 };
      runtimeBonds.push({
        officerA: aPick.id,
        officerB: bPick.id,
        floor: 80,
        kind: 'oath',
        label: `${aPick.name.en} ⚭ ${bPick.name.en} Marriage`,
      });

      // Boost relations.
      const key = pairKey(forceId, otherId);
      const current = getRelation(diplomacy, forceId, otherId);
      diplomacy = {
        relations: {
          ...diplomacy.relations,
          [key]: { ...current, score: Math.min(100, current.score + 50) },
        },
      };
      entries.push({
        cityId: null,
        kind: 'note',
        text: `Marriage forged: ${aPick.name.en} (${force.name.en}) ⚭ ${bPick.name.en} (${other.name.en}). Relations deepen.`,
        textZh: `聯姻既成：${aPick.name.zh}（${force.name.zh}）⚭ ${bPick.name.zh}（${other.name.zh}），兩家情誼日深。`,
      });
      break; // only one marriage per force per season
    }
  }

  // ── AI academy training ─────────────────────────────────────────
  // For each AI force: cap concurrent trainings at ceil(numCities/3),
  // clamped 1–5. Bigger empires train more policies in parallel; tiny
  // ones stay restrained so they don't blow the war chest.
  // Same per-turn capacity per academy still applies via the city-side
  // capacity check below.
  for (const [forceId, forceCities] of citiesByForce) {
    const inFlightCount = input.pendingTrainings.reduce((n, t) => {
      const o = officers[t.officerId];
      return o?.forceId === forceId ? n + 1 : n;
    }, 0);
    const concurrentCap = Math.max(1, Math.min(5, Math.ceil(forceCities.length / 3)));
    if (inFlightCount >= concurrentCap) continue;
    let trainedThisTurn = 0;
    const slotsOpen = concurrentCap - inFlightCount;

    for (const city of forceCities) {
      if (trainedThisTurn >= slotsOpen) break;
      const updated = cities[city.id];
      if (!updated) continue;
      if (!cityHasAcademy(updated, input.buildings)) continue;

      const aLvl = academyLevel(updated, input.buildings);
      const cap = academyCapacity(aLvl);
      const inUse =
        trainingsInCity(updated.id, input.pendingTrainings) +
        trainingsInCity(updated.id, newTrainings);
      // For lv3 (instant) capacity is Infinity, so this is safe.
      if (aLvl < 3 && inUse >= cap) continue;

      const officersHere = Object.values(officers).filter(
        (o) =>
          o.locationCityId === updated.id &&
          o.forceId === forceId &&
          o.status === 'idle' &&
          !o.task &&
          !pendingCommands[o.id] &&
          (o.policies?.length ?? 0) < 5 && // AI restraint: stops at 5 to leave gold for war
          !newTrainings.some((nt) => nt.officerId === o.id),
      );
      if (officersHere.length === 0) continue;

      // Pick the officer with the highest intelligence (best ROI).
      const officer = [...officersHere].sort(
        (a, b) => b.stats.intelligence - a.stats.intelligence,
      )[0];

      // N3 — 33% chance the AI trains a TACTIC instead of a policy this turn.
      // Only when the officer has tactics to learn + enough gold.
      const wantsTactic = rng() < 0.33;
      const { available: avTac } = wantsTactic ? eligibleTactics(officer) : { available: [] as TacticId[] };
      if (wantsTactic && avTac.length > 0) {
        const tacticCost = tacticTrainingCost(officer);
        if (updated.gold >= tacticCost + 300) {
          // Prefer tier-1/2 tactics to keep AI growing broadly.
          const filteredTac = avTac.filter((tt) => tacticTier(tt) <= 2);
          const tacPool = filteredTac.length > 0 ? filteredTac : avTac;
          const tacticId = tacPool[Math.floor(rng() * tacPool.length)];
          const tacDur = tacticDurationSeasons(officer, updated, tacticId, input.buildings);
          cities[updated.id] = { ...updated, gold: updated.gold - tacticCost };
          if (tacDur <= 0) {
            const haveT = officer.tactics ?? [];
            if (!haveT.includes(tacticId)) {
              officers[officer.id] = { ...officer, tactics: [...haveT, tacticId] };
            }
          } else {
            newTrainings.push({
              officerId: officer.id,
              cityId: updated.id,
              kind: 'tactic',
              policyId: 'tuntian' as never,
              tacticId,
              seasonsLeft: tacDur,
              goldSpent: tacticCost,
            });
          }
          trainedThisTurn += 1;
          void TACTIC_DEFS; // suppress unused-import warning if no entry triggers
          continue; // move to next city
        }
      }

      const cost = trainingCost(officer);
      if (updated.gold < cost + 300) continue; // keep 300g buffer for ops

      const { available } = eligiblePolicies(officer);
      // Prefer base/advanced policies to keep AI building broad foundations.
      const filtered = available.filter((p) => policyTier(p) <= 2);
      const pool = filtered.length > 0 ? filtered : available;
      if (pool.length === 0) continue;

      const policyId: PolicyId = pool[Math.floor(rng() * pool.length)];
      const duration = trainingDurationSeasons(
        officer,
        updated,
        policyId,
        input.buildings,
      );

      // Debit gold.
      cities[updated.id] = { ...updated, gold: updated.gold - cost };

      if (duration <= 0) {
        // Imperial Academy — apply policy immediately, no queue entry.
        const have = officer.policies ?? [];
        if (!have.includes(policyId)) {
          officers[officer.id] = {
            ...officer,
            policies: [...have, policyId],
          };
        }
      } else {
        newTrainings.push({
          officerId: officer.id,
          cityId: updated.id,
          policyId,
          seasonsLeft: duration,
          goldSpent: cost,
        });
      }
      trainedThisTurn += 1;
    }
  }

  return { cities, officers, pendingCommands, newTrainings, diplomacy, runtimeBonds, entries };
}

interface Decision {
  command: Command;
  officer: Officer;
  companions?: EntityId[];
}

function isBondedTo(a: EntityId, b: EntityId): boolean {
  return OATH_BONDS.some(
    (bond) =>
      (bond.officerA === a && bond.officerB === b) ||
      (bond.officerA === b && bond.officerB === a),
  );
}

function decideCommand(
  city: City,
  officersHere: Officer[],
  allCities: Record<EntityId, City>,
  forceId: EntityId,
  difficulty: Difficulty,
  diplomacy: DiplomaticState,
  rng: () => number,
): Decision | null {
  // 1. Food crisis — develop agriculture
  if (city.food < city.troops * 0.6) {
    const o = bestForCommand(officersHere, 'politics', 'develop-agriculture');
    if (o && canAfford(city, 'develop-agriculture')) {
      return internalDecision('develop-agriculture', city, o);
    }
  }

  // 2. Troop crisis — recruit
  if (city.troops < 3000) {
    const o = bestForCommand(officersHere, 'charisma', 'recruit-troops');
    if (o && canAfford(city, 'recruit-troops') && city.population > 50_000) {
      return internalDecision('recruit-troops', city, o);
    }
  }

  // 3. Loyalty crisis — pacify
  if (city.loyalty < 40) {
    const o = bestForCommand(officersHere, 'charisma', 'improve-loyalty');
    if (o && canAfford(city, 'improve-loyalty')) {
      return internalDecision('improve-loyalty', city, o);
    }
  }

  // 4. Opportunity to attack a weaker neighbor
  if (city.troops >= 5000 && city.gold >= COMMAND_DEFS['march'].goldCost) {
    const targets = city.adjacentCityIds
      .map((id) => allCities[id])
      .filter(
        (c): c is City =>
          !!c &&
          c.ownerForceId !== forceId &&
          (c.ownerForceId === null ||
            isHostilePermitted(diplomacy, forceId, c.ownerForceId)),
      )
      .sort((a, b) => a.troops - b.troops);

    const attackThreshold =
      difficulty === 'easy' ? 0.4 : difficulty === 'hard' ? 0.8 : 0.6;
    for (const target of targets) {
      // Effective defender strength factors in city defense: a fortress at
      // defense 88 (Tongguan) counts as if the garrison were ~60% larger.
      const defenseMultiplier = 1 + target.defense / 200;
      const effectiveDefenderTroops = target.troops * defenseMultiplier;
      const ratio = effectiveDefenderTroops / Math.max(1, city.troops);
      if (ratio > attackThreshold) continue;
      // P4 — exclude cowardly/frail officers from leading marches.
      const marchPool = officersHere.filter((c) => !isCombatLiability(c));
      const o = bestForCommand(marchPool, 'war', 'march');
      if (!o || o.stats.war < 60) continue;
      const sendTroops = Math.floor(city.troops * 0.7);
      if (sendTroops < 1000) continue;

      // Multi-officer: pick up to 2 companions. Score uses 60% war + 40%
      // leadership (matching the battle blended-stat formula) plus a
      // sizeable bonus for officers bonded to the commander, and a smaller
      // bonus for officers bonded to each other (so picking the third
      // creates double-bond stacks like Liu/Guan/Zhang or Cao+Xiahou).
      const scoreFor = (c: Officer, alreadyPicked: Officer[]): number => {
        const blended = c.stats.war * 0.6 + c.stats.leadership * 0.4;
        const cmdBond = isBondedTo(o.id, c.id) ? 30 : 0;
        const peerBonds = alreadyPicked.reduce(
          (s, p) => s + (isBondedTo(p.id, c.id) ? 15 : 0),
          0,
        );
        return blended + cmdBond + peerBonds;
      };
      const companionPool = officersHere.filter((c) => c.id !== o.id && !isCombatLiability(c));
      const picked: Officer[] = [];
      while (picked.length < 2 && companionPool.length > picked.length) {
        const remaining = companionPool.filter(
          (c) => !picked.includes(c),
        );
        const next = remaining.sort(
          (a, b) => scoreFor(b, picked) - scoreFor(a, picked),
        )[0];
        if (!next) break;
        picked.push(next);
      }
      const companions = picked.map((c) => c.id);

      const cmd: MarchCommand = {
        type: 'march',
        cityId: city.id,
        officerId: o.id,
        targetCityId: target.id,
        troops: sendTroops,
        additionalOfficerIds: companions.length > 0 ? companions : undefined,
      };
      return { command: cmd, officer: o, companions };
    }
  }

  // 5. Routine — develop the lowest of agriculture/commerce/defense
  const devType = lowestDevCommand(city);
  const o = bestBy(officersHere, 'politics');
  if (o && canAfford(city, devType)) {
    return internalDecision(devType, city, o);
  }

  // 6. Pacify if we can afford it (cheap fallback)
  if (city.loyalty < 90) {
    const fb = bestBy(officersHere, 'charisma');
    if (fb && canAfford(city, 'improve-loyalty')) {
      return internalDecision('improve-loyalty', city, fb);
    }
  }

  // No command this turn.
  void rng; // reserved for future randomness
  return null;
}

function internalDecision(
  type: InternalAffairsType,
  city: City,
  officer: Officer,
): Decision {
  const cmd: InternalAffairsCommand = {
    type,
    cityId: city.id,
    officerId: officer.id,
  };
  return { command: cmd, officer };
}

function canAfford(city: City, type: InternalAffairsType | 'march'): boolean {
  return city.gold >= COMMAND_DEFS[type].goldCost;
}

function bestBy(
  officers: Officer[],
  stat: keyof OfficerStats,
): Officer | null {
  if (officers.length === 0) return null;
  return [...officers].sort((a, b) => b.stats[stat] - a.stats[stat])[0];
}

/** P3 — fit-aware picker. Score = stat × trait fit multiplier. Higher
 *  is better. Falls back to base stat when no fit modifier applies. */
function bestForCommand(
  officers: Officer[],
  stat: keyof OfficerStats,
  type: InternalAffairsType | 'march',
): Officer | null {
  if (officers.length === 0) return null;
  return [...officers].sort(
    (a, b) =>
      b.stats[stat] * commandFitMultiplier(b, type) -
      a.stats[stat] * commandFitMultiplier(a, type),
  )[0];
}

function lowestDevCommand(
  city: City,
): 'develop-agriculture' | 'develop-commerce' | 'build-defense' {
  const stats: Array<[
    'develop-agriculture' | 'develop-commerce' | 'build-defense',
    number,
  ]> = [
    ['develop-agriculture', city.agriculture],
    ['develop-commerce', city.commerce],
    ['build-defense', city.defense],
  ];
  stats.sort((a, b) => a[1] - b[1]);
  return stats[0][0];
}
