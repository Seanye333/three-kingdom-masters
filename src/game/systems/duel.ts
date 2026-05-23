import type { Officer } from '../types';
import { ITEMS_BY_ID } from '../data/items';
import { SKILLS_BY_ID } from '../data/skills';

/**
 * One-on-one duel resolution between two officers.
 *
 * Score = war + weapon-war-bonus + skill duelChanceBonus×30 + trait bonus + d100.
 * The higher score wins. The loser dies. A win-margin under 10 means both
 * are wounded but neither dies (a draw); the encounter ends.
 */

export interface DuelInput {
  attacker: Officer;
  defender: Officer;
  rng?: () => number;
}

export interface DuelRoll {
  officerId: string;
  base: number;        // war stat
  itemBonus: number;
  skillBonus: number;  // from skill duelChanceBonus
  traitBonus: number;
  diceRoll: number;
  total: number;
}

export interface DuelResult {
  attackerRoll: DuelRoll;
  defenderRoll: DuelRoll;
  /** Margin = winner.total - loser.total. */
  margin: number;
  /** Who won the duel, or 'draw' if margin < 10 (both wounded). */
  winner: 'attacker' | 'defender' | 'draw';
  /** Set to the loser's officer id when winner != 'draw'. */
  killedId?: string;
}

export function canDuel(o: Officer): { ok: boolean; reason?: string } {
  if (o.status === 'dead' || o.status === 'imprisoned')
    return { ok: false, reason: 'unavailable' };
  if (o.stats.war < 60) return { ok: false, reason: 'war stat too low' };
  if (o.traits?.includes('frail')) return { ok: false, reason: 'too frail' };
  return { ok: true };
}

export function resolveDuel(input: DuelInput): DuelResult {
  const rng = input.rng ?? Math.random;
  const a = rollOne(input.attacker, rng);
  const d = rollOne(input.defender, rng);
  const margin = Math.abs(a.total - d.total);
  if (margin < 10) {
    return { attackerRoll: a, defenderRoll: d, margin, winner: 'draw' };
  }
  if (a.total > d.total) {
    return { attackerRoll: a, defenderRoll: d, margin, winner: 'attacker', killedId: input.defender.id };
  }
  return { attackerRoll: a, defenderRoll: d, margin, winner: 'defender', killedId: input.attacker.id };
}

function rollOne(o: Officer, rng: () => number): DuelRoll {
  let itemBonus = 0;
  for (const id of o.equipment) {
    const it = ITEMS_BY_ID[id];
    if (it?.effects.war) itemBonus += it.effects.war;
  }
  let skillBonus = 0;
  for (const sid of o.skills) {
    const s = SKILLS_BY_ID[sid];
    if (s?.combat?.duelChanceBonus) skillBonus += s.combat.duelChanceBonus * 30;
    if (s?.combat?.warBonus) skillBonus += (s.combat.warBonus ?? 0) * 0.5;
  }
  let traitBonus = 0;
  for (const t of o.traits ?? []) {
    if (t === 'matchless') traitBonus += 25;
    else if (t === 'martial-valor') traitBonus += 12;
    else if (t === 'wrathful') traitBonus += 8;
    else if (t === 'reckless') traitBonus += 6;
    else if (t === 'one-eyed') traitBonus += 6;
    else if (t === 'cowardly') traitBonus -= 15;
    else if (t === 'frail') traitBonus -= 30;
    else if (t === 'sickly') traitBonus -= 5;
    else if (t === 'cautious') traitBonus -= 4;
  }
  const diceRoll = Math.floor(rng() * 30);
  const total = o.stats.war + itemBonus + skillBonus + traitBonus + diceRoll;
  return {
    officerId: o.id,
    base: o.stats.war,
    itemBonus,
    skillBonus: Math.round(skillBonus),
    traitBonus: Math.round(traitBonus),
    diceRoll,
    total: Math.round(total),
  };
}
