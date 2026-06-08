import { describe, it, expect } from 'vitest';
import { addRapport, getRapport, mingleRapport, RAPPORT_BOND_THRESHOLD } from './rapport';

describe('rapport (好感 → 義結)', () => {
  it('accumulates and reads back symmetrically', () => {
    let r: Record<string, number> = {};
    r = addRapport(r, 'a', 'b', 30, false).rapport;
    r = addRapport(r, 'b', 'a', 20, false).rapport; // order-independent
    expect(getRapport(r, 'a', 'b')).toBe(50);
  });

  it('forges a bond once the threshold is reached', () => {
    const r = { [Object.keys(addRapport({}, 'a', 'b', 80, false).rapport)[0]]: 80 };
    const res = addRapport(r, 'a', 'b', 25, false);
    expect(getRapport(res.rapport, 'a', 'b')).toBe(RAPPORT_BOND_THRESHOLD); // capped
    expect(res.forged).not.toBeNull();
    expect([res.forged!.officerA, res.forged!.officerB].sort()).toEqual(['a', 'b']);
  });

  it('does not forge when already bonded', () => {
    const res = addRapport({}, 'a', 'b', 100, true);
    expect(res.forged).toBeNull();
  });

  it('mingle raises every pair at a gathering', () => {
    const r = mingleRapport({}, ['a', 'b', 'c'], 10);
    expect(getRapport(r, 'a', 'b')).toBe(10);
    expect(getRapport(r, 'a', 'c')).toBe(10);
    expect(getRapport(r, 'b', 'c')).toBe(10);
  });
});
