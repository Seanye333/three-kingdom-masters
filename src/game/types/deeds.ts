import type { EntityId } from './common';

/**
 * Per-officer heroic deeds tracker — accumulates over a campaign.
 * Used by the 武功榜 leaderboard and end-of-game scoring.
 */
export interface HeroicDeeds {
  officerId: EntityId;
  /** Total enemy troops their armies have killed. */
  killsTroops: number;
  /** Number of enemy commanders defeated in duels. */
  duelsWon: number;
  /** Number of named officers personally captured. */
  captured: number;
  /** Cities they personally led the conquest of. */
  citiesTaken: number;
  /** Successful espionage ops they ran. */
  espionageSuccess: number;
  /** Internal-affairs commands successfully executed. */
  civicWorks: number;
  /** Times they have survived a battle as commander. */
  battlesWon: number;
  /** Tactical battles they lost. */
  battlesLost: number;
}

export function createDeeds(officerId: EntityId): HeroicDeeds {
  return {
    officerId,
    killsTroops: 0,
    duelsWon: 0,
    captured: 0,
    citiesTaken: 0,
    espionageSuccess: 0,
    civicWorks: 0,
    battlesWon: 0,
    battlesLost: 0,
  };
}
