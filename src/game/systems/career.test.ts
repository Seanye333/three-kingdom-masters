import { describe, it, expect } from 'vitest';
import { careerStanding, meritFromDeeds, rankForMerit, canInheritForce } from './career';

const deeds = (over: Partial<import('../types/deeds').HeroicDeeds>) =>
  ({ officerId: 'x', killsTroops: 0, duelsWon: 0, captured: 0, citiesTaken: 0,
     espionageSuccess: 0, civicWorks: 0, battlesWon: 0, battlesLost: 0, trainingsCompleted: 0 } as never) && over as never;

describe('career standing (一代記 ladder)', () => {
  it('starts a fresh officer at the lowest rank (9, 武官)', () => {
    const s = careerStanding(undefined);
    expect(s.merit).toBe(0);
    expect(s.rank).toBe(9);
    expect(s.status.en).toBe('Officer');
  });

  it('merit accrues from deeds and lifts the rank', () => {
    const m = meritFromDeeds({ citiesTaken: 5, battlesWon: 10, killsTroops: 5000 } as never);
    // 5*30 + 10*5 + floor(5000/100)=50 → 250
    expect(m).toBe(250);
    expect(rankForMerit(250)).toBe(4); // ≥240 floor → rank 4 (太守)
    expect(careerStanding({ citiesTaken: 5, battlesWon: 10, killsTroops: 5000 } as never).status.en).toBe('Governor');
  });

  it('reaches Grand Marshal (rank 1) at high merit, and may then inherit a force', () => {
    const s = careerStanding({ citiesTaken: 20 } as never); // 600 merit ≥ 480
    expect(s.rank).toBe(1);
    expect(s.nextRankMerit).toBeNull();
    expect(canInheritForce(s)).toBe(true);
  });

  it('reports the merit needed for the next rank', () => {
    const s = careerStanding({ battlesWon: 3 } as never); // 15 merit → rank 8 (floor 10), next is 30
    expect(s.rank).toBe(8);
    expect(s.nextRankMerit).toBe(30);
  });
});

import { applySuccession } from './succession';
import { mkOfficer } from '../../test/factories';

describe('career officer inherits a force when senior enough', () => {
  const force = { id: 'F', rulerOfficerId: 'r', name: { zh: '勢', en: 'Force' }, color: '#fff', capitalCityId: 'c1' } as never;
  const ruler = mkOfficer({ id: 'r', status: 'dead' });
  const career = mkOfficer({ id: 'c', forceId: 'F' });
  const other = mkOfficer({ id: 'f', forceId: 'F', stats: { war: 50, leadership: 50, intelligence: 50, politics: 99, charisma: 50 } });
  (ruler as { forceId?: string }).forceId = 'F';

  it('a 都督+ chronicle officer takes the throne', () => {
    const out = applySuccession({
      forces: { F: force }, officers: { r: ruler, c: career, f: other }, family: [],
      careerOfficerId: 'c', deeds: { c: { citiesTaken: 20 } as never },
    });
    expect(out.forces.F.rulerOfficerId).toBe('c');
  });

  it('a junior chronicle officer does not — the usual heir succeeds', () => {
    const out = applySuccession({
      forces: { F: force }, officers: { r: ruler, c: career, f: other }, family: [],
      careerOfficerId: 'c', deeds: { c: { battlesWon: 1 } as never }, // tiny merit
    });
    expect(out.forces.F.rulerOfficerId).toBe('f'); // highest loyalty+politics fallback
  });
});
