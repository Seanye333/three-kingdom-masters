import type { HeroicDeeds } from '../types/deeds';

/**
 * Officer-career standing (一代記) — the RTK13 "rise from nobody" ladder. The
 * career officer accumulates 功績 (merit) from their deeds, which advances them
 * up a 9→1 rank and through statuses: 武官 → 大臣 → 太守 → 都督 → 一方諸侯.
 * Derived purely from the deeds the game already tracks, so it needs no extra
 * persisted state.
 */
export interface CareerStanding {
  merit: number;
  rank: number; // 9 (lowest) … 1 (highest)
  status: { zh: string; en: string };
  /** Merit needed for the next rank up (null at rank 1). */
  nextRankMerit: number | null;
}

export function meritFromDeeds(d: HeroicDeeds | undefined): number {
  if (!d) return 0;
  return (
    Math.floor((d.killsTroops ?? 0) / 100) +
    (d.battlesWon ?? 0) * 5 +
    (d.citiesTaken ?? 0) * 30 +
    (d.captured ?? 0) * 8 +
    (d.duelsWon ?? 0) * 4 +
    (d.espionageSuccess ?? 0) * 5 +
    (d.civicWorks ?? 0) * 3
  );
}

// Merit at which each rank (9→1) is reached. Index 0 = rank 9's floor.
const RANK_FLOORS = [0, 10, 30, 70, 130, 210, 320, 460, 600];

export function rankForMerit(merit: number): number {
  // Walk from the top rank (1) down; the highest floor we clear is our rank.
  for (let i = RANK_FLOORS.length - 1; i >= 0; i--) {
    if (merit >= RANK_FLOORS[i]) return 9 - i;
  }
  return 9;
}

function statusForRank(rank: number): { zh: string; en: string } {
  if (rank === 1) return { zh: '一方諸侯', en: 'Grand Marshal' };
  if (rank <= 3) return { zh: '都督', en: 'Viceroy' };
  if (rank <= 5) return { zh: '太守', en: 'Governor' };
  if (rank <= 7) return { zh: '大臣', en: 'Minister' };
  return { zh: '武官', en: 'Officer' };
}

export function careerStanding(deeds: HeroicDeeds | undefined): CareerStanding {
  const merit = meritFromDeeds(deeds);
  const rank = rankForMerit(merit);
  const nextFloorIdx = 9 - rank + 1; // floor index for the next rank up
  const nextRankMerit = rank > 1 && nextFloorIdx < RANK_FLOORS.length ? RANK_FLOORS[nextFloorIdx] : null;
  return { merit, rank, status: statusForRank(rank), nextRankMerit };
}

/** Career status is senior enough to inherit/command a force (都督 and above). */
export function canInheritForce(standing: CareerStanding): boolean {
  return standing.rank <= 3;
}
