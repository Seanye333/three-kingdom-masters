import type { BilingualName, EntityId } from './common';

export interface CityCoords {
  x: number;
  y: number;
}

export interface City {
  id: EntityId;
  name: BilingualName;
  coords: CityCoords;
  adjacentCityIds: EntityId[];

  ownerForceId: EntityId | null;

  population: number;
  gold: number;
  food: number;
  troops: number;
  agriculture: number;
  commerce: number;
  defense: number;
  loyalty: number;

  /** Terrain category — see TERRAIN_DEFS in cities.ts. */
  terrain?: import('../data/cities').Terrain;
  /** Has river/sea port — unlocks naval movement to other ports. */
  port?: boolean;
  /**
   * Wall fortification tier (1 = village wall, 2 = inner-walled city,
   * 3 = three-tier citadel like Hefei/Luoyang/Chang'an).
   * Each tier multiplies city defense and increases siege duration.
   */
  wallTier?: 1 | 2 | 3;
}
