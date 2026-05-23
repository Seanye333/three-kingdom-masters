import type {
  City,
  EntityId,
  EventEffect,
  Force,
  GameDate,
  HistoricalEvent,
  Officer,
} from '../types';
import { HISTORICAL_EVENTS } from '../data/events';

export interface HistoricalEventContext {
  date: GameDate;
  cities: Record<EntityId, City>;
  officers: Record<EntityId, Officer>;
  forces: Record<EntityId, Force>;
  eventFlags: Record<string, boolean>;
  firedEventIds: EntityId[];
  /** Romance mode: always fire eligible events. Default behavior fires
   *  with a smaller per-season probability so non-Romance runs feel
   *  "alternate-history". */
  romanceMode?: boolean;
  rng?: () => number;
}

/**
 * Picks the first historical event whose conditions match the current state.
 * Returns null when none fire. Each event fires at most once per game.
 */
export function findFiringEvent(
  ctx: HistoricalEventContext,
): HistoricalEvent | null {
  const fired = new Set(ctx.firedEventIds);
  const rng = ctx.rng ?? Math.random;
  for (const evt of HISTORICAL_EVENTS) {
    if (fired.has(evt.id)) continue;
    if (ctx.date.year < evt.yearMin || ctx.date.year > evt.yearMax) continue;
    if (evt.season && ctx.date.season !== evt.season) continue;
    if (!conditionsMet(evt, ctx)) continue;
    // Romance mode: fire every eligible event. Default: 60% per season
    // (so the next eligible season has another chance, but the campaign
    // doesn't get a monolithic event-list overlay).
    if (!ctx.romanceMode && rng() > 0.6) continue;
    return evt;
  }
  return null;
}

function conditionsMet(evt: HistoricalEvent, ctx: HistoricalEventContext): boolean {
  for (const req of evt.requires ?? []) {
    switch (req.kind) {
      case 'force-alive': {
        const f = ctx.forces[req.forceId];
        if (!f) return false;
        // A force is "alive" if it still owns any city.
        const hasCity = Object.values(ctx.cities).some(
          (c) => c.ownerForceId === req.forceId,
        );
        if (!hasCity) return false;
        break;
      }
      case 'officer-alive': {
        const o = ctx.officers[req.officerId];
        if (!o || o.status === 'dead') return false;
        break;
      }
      case 'officer-active': {
        const o = ctx.officers[req.officerId];
        if (!o) return false;
        if (o.status !== 'idle' && o.status !== 'active') return false;
        break;
      }
      case 'flag-set':
        if (!ctx.eventFlags[req.key]) return false;
        break;
      case 'flag-unset':
        if (ctx.eventFlags[req.key]) return false;
        break;
    }
  }
  return true;
}

export interface EventApplyOutput {
  cities: Record<EntityId, City>;
  officers: Record<EntityId, Officer>;
  forces: Record<EntityId, Force>;
  eventFlags: Record<string, boolean>;
}

/**
 * Applies the effects of a historical event to game state, returning the
 * mutated cities/officers/forces/flags. Pure function.
 */
export function applyEventEffects(
  evt: HistoricalEvent,
  ctx: HistoricalEventContext,
): EventApplyOutput {
  const cities = { ...ctx.cities };
  const officers = { ...ctx.officers };
  const forces = { ...ctx.forces };
  const eventFlags = { ...ctx.eventFlags };

  for (const e of evt.effects) {
    applySingleEffect(e, { cities, officers, forces, eventFlags });
  }
  return { cities, officers, forces, eventFlags };
}

function applySingleEffect(
  e: EventEffect,
  mut: EventApplyOutput,
): void {
  switch (e.kind) {
    case 'force-troops-multiplier': {
      // Multiply troops in every city owned by this force.
      for (const c of Object.values(mut.cities)) {
        if (c.ownerForceId === e.forceId) {
          mut.cities[c.id] = {
            ...c,
            troops: Math.max(100, Math.floor(c.troops * e.multiplier)),
          };
        }
      }
      break;
    }
    case 'force-gold': {
      // Gold is held per-city. Deposit into the force's capital.
      const f = mut.forces[e.forceId];
      if (f) {
        const capital = mut.cities[f.capitalCityId];
        if (capital) {
          mut.cities[f.capitalCityId] = {
            ...capital,
            gold: Math.max(0, capital.gold + e.delta),
          };
        }
      }
      break;
    }
    case 'city-loyalty': {
      const c = mut.cities[e.cityId];
      if (c) {
        mut.cities[e.cityId] = {
          ...c,
          loyalty: Math.max(0, Math.min(100, c.loyalty + e.delta)),
        };
      }
      break;
    }
    case 'officer-loyalty': {
      const o = mut.officers[e.officerId];
      if (o) {
        mut.officers[e.officerId] = {
          ...o,
          loyalty: Math.max(0, Math.min(100, o.loyalty + e.delta)),
        };
      }
      break;
    }
    case 'officer-status': {
      const o = mut.officers[e.officerId];
      if (o) {
        mut.officers[e.officerId] = {
          ...o,
          status: e.status,
          forceId: e.status === 'dead' ? null : o.forceId,
          task: null,
        };
      }
      break;
    }
    case 'officer-join': {
      const o = mut.officers[e.officerId];
      const f = mut.forces[e.forceId];
      if (o && f) {
        mut.officers[e.officerId] = {
          ...o,
          status: 'idle',
          forceId: e.forceId,
          locationCityId: f.capitalCityId,
          loyalty: Math.max(o.loyalty, 90),
          task: null,
        };
      }
      break;
    }
    case 'spawn-rebel-force': {
      // Flip a city to neutral (rebel) and reduce troops.
      const c = mut.cities[e.cityId];
      if (c) {
        mut.cities[e.cityId] = {
          ...c,
          ownerForceId: null,
          troops: e.troops,
          loyalty: 30,
        };
      }
      break;
    }
    case 'flag':
      mut.eventFlags[e.key] = true;
      break;
  }
}
