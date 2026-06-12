/** Mod 數據包 — locks parsing, namespacing and start-of-game merging. */
import { describe, expect, it } from 'vitest';
import { modEventsForStart, modOfficersForStart, parseModBundle, type ModBundle } from './mods';

const rawBundle = JSON.stringify({
  kind: 'tkm-mod',
  name: '水滸傳包',
  officers: [
    { id: 'song-jiang', name: { zh: '宋江', en: 'Song Jiang' }, stats: { leadership: 85, war: 60, intelligence: 80, politics: 88, charisma: 95 } },
    { id: 'lin-chong', name: { zh: '林沖' }, stats: { leadership: 88, war: 999, intelligence: 70, politics: 40, charisma: 60 }, forceId: 'cao' },
  ],
  events: [
    { id: 'liangshan', name: { zh: '梁山聚義', en: 'Liangshan' }, yearMin: 195, yearMax: 210, description: 'x', effects: [] },
  ],
});

describe('parseModBundle', () => {
  it('namespaces ids, clamps stats, fills en names', () => {
    const r = parseModBundle(rawBundle);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.bundle.officers?.[0].id).toBe('mod-song-jiang');
    expect(r.bundle.officers?.[1].stats.war).toBe(100); // 999 clamped
    expect(r.bundle.officers?.[1].name.en).toBe('林沖'); // en fallback
    expect(r.bundle.events?.[0].id).toBe('mod-liangshan');
  });

  it('rejects garbage and empty bundles', () => {
    expect(parseModBundle('nope').ok).toBe(false);
    expect(parseModBundle('{"kind":"tkm-mod","name":"x"}').ok).toBe(false);
  });
});

describe('start-of-game merging', () => {
  const bundle = (parseModBundle(rawBundle) as { ok: true; bundle: ModBundle }).bundle;

  it('officers join their force when it exists, else wait unsearched', () => {
    const officers = modOfficersForStart([bundle], 200, new Set(['cao']));
    const song = officers.find((o) => o.id === 'mod-song-jiang')!;
    const lin = officers.find((o) => o.id === 'mod-lin-chong')!;
    expect(song.status).toBe('unsearched');
    expect(song.forceId).toBeNull();
    expect(lin.forceId).toBe('cao');
    expect(lin.status).toBe('idle');
    expect(song.birthYear).toBe(175); // startYear - 25 default
  });

  it('events dedupe across bundles by id', () => {
    expect(modEventsForStart([bundle, bundle])).toHaveLength(1);
  });
});
