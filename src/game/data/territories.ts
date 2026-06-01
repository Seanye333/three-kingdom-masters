/**
 * Phase 3a — Territory grid layer (visual only, no gameplay impact yet).
 *
 * For each city we synthesise 3 small sub-territories at deterministic
 * radial offsets. The owner of each territory is just inherited from its
 * parent city, so this file adds *visual* granularity (~350 cells across
 * the map) without changing any game logic. Phases 3b/3c will graduate
 * these from "render hints" into real gameplay state.
 */

import type { City } from '../types';

export interface Territory {
  id: string;
  /** Owning city — controls who controls this cell for now. */
  parentCityId: string;
  /** World-space centroid on the 1000×720 canvas. */
  coords: { x: number; y: number };
}

// Stable hash → deterministic offsets per city id. We don't want the
// territories to jitter across sessions, so the generator is pure.
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 0xffffffff;
}

const TERRITORIES_PER_CITY = 3;
const SATELLITE_RADIUS = 28;

/**
 * Build the full territory list from the current city catalog. Returns
 * (cities.length × TERRITORIES_PER_CITY) entries. Cities of strategic
 * importance (capitals etc) could later get more cells; for 3a we keep
 * it uniform.
 */
export function generateTerritories(cities: City[]): Territory[] {
  const out: Territory[] = [];
  for (const city of cities) {
    // Cell 0: the city itself.
    out.push({
      id: `${city.id}-0`,
      parentCityId: city.id,
      coords: { x: city.coords.x, y: city.coords.y },
    });
    // Cells 1..N-1: satellites at fixed angular offsets, deterministic
    // per-city rotation so the layout is stable but cities don't all align.
    const baseAngle = hash(city.id) * Math.PI * 2;
    for (let i = 1; i < TERRITORIES_PER_CITY; i++) {
      const angle = baseAngle + (i / TERRITORIES_PER_CITY) * Math.PI * 2;
      const r = SATELLITE_RADIUS * (0.7 + hash(city.id + '/' + i) * 0.5);
      out.push({
        id: `${city.id}-${i}`,
        parentCityId: city.id,
        coords: {
          x: city.coords.x + Math.cos(angle) * r,
          y: city.coords.y + Math.sin(angle) * r,
        },
      });
    }
  }
  return out;
}
