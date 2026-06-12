/**
 * Mod 數據包 — user-authored content as plain JSON, no code.
 *
 * A bundle can ship extra officers (joining as unsearched free agents at
 * a chosen city, or straight into a force) and custom events (the same
 * shape the in-game Event Editor produces — they ride the existing
 * customEvents pipeline). Bundles install into localStorage and apply
 * on every NEW game until removed; ids are namespaced (mod-…) so a
 * crafted file can't overwrite 關羽.
 *
 * 別人也能做「水滸傳包」— that's the whole point.
 */
import type { EntityId, HistoricalEvent, Officer } from '../types';

const MODS_KEY = 'tkm-mods-v1';

export interface ModBundle {
  kind: 'tkm-mod';
  version: number;
  name: string;
  officers?: ModOfficer[];
  events?: HistoricalEvent[];
}

export interface ModOfficer {
  id: string;
  name: { zh: string; en: string };
  birthYear?: number;
  stats: { leadership: number; war: number; intelligence: number; politics: number; charisma: number };
  /** Where they wait to be found (default: wanderer pool). */
  locationCityId?: string | null;
  /** Join this force at game start instead of waiting in the wild. */
  forceId?: string | null;
}

const clampStat = (v: unknown): number => Math.max(1, Math.min(100, Math.round(Number(v) || 1)));

/** Validate + normalize a raw bundle. Ids get the mod- namespace. */
export function parseModBundle(raw: string): { ok: true; bundle: ModBundle } | { ok: false; reason: string } {
  let p: unknown;
  try {
    p = JSON.parse(raw);
  } catch {
    return { ok: false, reason: 'not-json' };
  }
  const b = p as Partial<ModBundle>;
  if (b?.kind !== 'tkm-mod' || typeof b.name !== 'string' || !b.name.trim()) {
    return { ok: false, reason: 'not-a-mod-bundle' };
  }
  const officers: ModOfficer[] = [];
  for (const o of b.officers ?? []) {
    if (!o || typeof o.id !== 'string' || !o.name?.zh) continue;
    officers.push({
      id: o.id.startsWith('mod-') ? o.id : `mod-${o.id}`,
      name: { zh: String(o.name.zh), en: String(o.name.en ?? o.name.zh) },
      birthYear: typeof o.birthYear === 'number' ? o.birthYear : undefined,
      stats: {
        leadership: clampStat(o.stats?.leadership),
        war: clampStat(o.stats?.war),
        intelligence: clampStat(o.stats?.intelligence),
        politics: clampStat(o.stats?.politics),
        charisma: clampStat(o.stats?.charisma),
      },
      locationCityId: o.locationCityId ?? null,
      forceId: o.forceId ?? null,
    });
  }
  const events: HistoricalEvent[] = [];
  for (const e of b.events ?? []) {
    if (!e || typeof e.id !== 'string' || !e.name?.zh || typeof e.yearMin !== 'number') continue;
    events.push({ ...e, id: e.id.startsWith('mod-') ? e.id : `mod-${e.id}` });
  }
  if (officers.length === 0 && events.length === 0) return { ok: false, reason: 'empty' };
  return { ok: true, bundle: { kind: 'tkm-mod', version: 1, name: b.name.trim(), officers, events } };
}

export function loadMods(): ModBundle[] {
  try {
    const raw = localStorage.getItem(MODS_KEY);
    const arr = raw ? (JSON.parse(raw) as ModBundle[]) : [];
    return Array.isArray(arr) ? arr.filter((m) => m?.kind === 'tkm-mod') : [];
  } catch {
    return [];
  }
}

export function installMod(bundle: ModBundle): void {
  const mods = loadMods().filter((m) => m.name !== bundle.name); // same name replaces
  mods.push(bundle);
  try { localStorage.setItem(MODS_KEY, JSON.stringify(mods)); } catch { /* quota */ }
}

export function removeMod(name: string): void {
  try { localStorage.setItem(MODS_KEY, JSON.stringify(loadMods().filter((m) => m.name !== name))); } catch { /* quota */ }
}

/** Officers all installed mods contribute to a new game. */
export function modOfficersForStart(mods: ModBundle[], startYear: number, validForceIds: ReadonlySet<string>): Officer[] {
  const out: Officer[] = [];
  const seen = new Set<EntityId>();
  for (const m of mods) {
    for (const o of m.officers ?? []) {
      if (seen.has(o.id)) continue;
      seen.add(o.id);
      const forceOk = o.forceId && validForceIds.has(o.forceId);
      out.push({
        id: o.id,
        name: o.name,
        birthYear: o.birthYear ?? startYear - 25,
        stats: o.stats,
        loyalty: forceOk ? 90 : 0,
        locationCityId: o.locationCityId ?? null,
        forceId: forceOk ? o.forceId! : null,
        status: forceOk ? 'idle' : 'unsearched',
        task: null,
        equipment: [],
        skills: [],
        rank: 'soldier',
      } as Officer);
    }
  }
  return out;
}

/** Events all installed mods contribute (ride the customEvents pipeline). */
export function modEventsForStart(mods: ModBundle[]): HistoricalEvent[] {
  const out: HistoricalEvent[] = [];
  const seen = new Set<string>();
  for (const m of mods) {
    for (const e of m.events ?? []) {
      if (seen.has(e.id)) continue;
      seen.add(e.id);
      out.push(e);
    }
  }
  return out;
}
