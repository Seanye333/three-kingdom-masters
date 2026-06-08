import { describe, it, expect } from 'vitest';
import { bestPrestige, prestigeEffects } from './prestige';
import { mkOfficer } from '../../test/factories';

const stats = (over: Partial<{ war: number; leadership: number; intelligence: number; politics: number; charisma: number }>) =>
  ({ war: 50, leadership: 50, intelligence: 50, politics: 50, charisma: 50, ...over });

describe('prestige (威名)', () => {
  it('awards 虎將 to a peerless warrior, with a duel bonus', () => {
    const o = mkOfficer({ stats: stats({ war: 95 }) });
    expect(bestPrestige(o)!.id).toBe('tiger-general');
    expect(prestigeEffects(o).duelBonus).toBeGreaterThan(0);
  });

  it('awards 能臣 to a master administrator, with an income multiplier', () => {
    const o = mkOfficer({ stats: stats({ politics: 90 }) });
    expect(bestPrestige(o)!.id).toBe('able-minister');
    expect(prestigeEffects(o).incomeMul).toBeGreaterThan(1);
  });

  it('gates 名將 behind a battle record (deeds)', () => {
    const o = mkOfficer({ stats: stats({ war: 85 }) }); // ≥84 but <90
    expect(bestPrestige(o)!.id).toBe('fierce-general'); // no deeds → 猛將
    expect(bestPrestige(o, { battlesWon: 10 } as never)!.id).toBe('famed-general'); // deeds → 名將
  });

  it('gives a mediocre officer no prestige and neutral effects', () => {
    const o = mkOfficer({ stats: stats({}) });
    expect(bestPrestige(o)).toBeNull();
    expect(prestigeEffects(o)).toEqual({ duelBonus: 0, combatPowerMul: 1, incomeMul: 1 });
  });
});
