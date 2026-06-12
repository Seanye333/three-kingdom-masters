/** 每日挑戰 — locks determinism and best-run recording. */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Scenario } from '../types';
import { dailyShareString, loadDailyResults, recordDailyResult, rollDailyChallenge, seededRng } from './dailyChallenge';

const scenarios = [
  { id: 's1', forces: [{ id: 'a' }, { id: 'b' }], cities: [] },
  { id: 's2', forces: [{ id: 'c' }], cities: [] },
] as unknown as Scenario[];

describe('rollDailyChallenge', () => {
  it('same date → identical challenge; different date → can differ', () => {
    const x = rollDailyChallenge('2026-06-12', scenarios);
    const y = rollDailyChallenge('2026-06-12', scenarios);
    expect(x).toEqual(y);
    expect(x?.modifiers.map((m) => m.id)).toContain('hard');
    expect(x?.modifiers.map((m) => m.id)).toContain('fog');
    // Determinism of the underlying stream:
    const r1 = seededRng('abc');
    const r2 = seededRng('abc');
    expect([r1(), r1(), r1()]).toEqual([r2(), r2(), r2()]);
  });
});

describe('daily results', () => {
  beforeEach(() => {
    const map = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => map.get(k) ?? null,
      setItem: (k: string, v: string) => { map.set(k, v); },
    });
  });

  it('keeps the best run of the day', () => {
    recordDailyResult('2026-06-12', { victory: false, seasons: 30 });
    recordDailyResult('2026-06-12', { victory: true, seasons: 80 });
    recordDailyResult('2026-06-12', { victory: true, seasons: 99 });  // worse — ignored
    recordDailyResult('2026-06-12', { victory: true, seasons: 50 });  // better — kept
    expect(loadDailyResults()['2026-06-12']).toEqual({ victory: true, seasons: 50 });
  });

  it('share string reads like a brag', () => {
    const c = rollDailyChallenge('2026-06-12', scenarios)!;
    expect(dailyShareString(c, '曹操軍', { victory: true, seasons: 42 })).toContain('42旬制霸');
  });
});
