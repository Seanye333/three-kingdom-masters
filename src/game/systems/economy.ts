import type { City, Season } from '../types';

export const FOOD_PER_TROOP_PER_SEASON = 0.25;

export interface CityEconomyTick {
  goldIncome: number;
  foodIncome: number;
  foodUpkeep: number;
  desertion: number;
}

export function tickCityEconomy(city: City, season: Season): CityEconomyTick {
  const goldIncome = Math.floor(city.commerce * (city.population / 5000));
  const foodIncome =
    season === 'autumn'
      ? Math.floor(city.agriculture * (city.population / 1000))
      : 0;
  const foodUpkeep = Math.ceil(city.troops * FOOD_PER_TROOP_PER_SEASON);

  let desertion = 0;
  const netFood = city.food + foodIncome - foodUpkeep;
  if (netFood < 0) {
    desertion = Math.min(city.troops, Math.ceil(-netFood / FOOD_PER_TROOP_PER_SEASON));
  }

  return { goldIncome, foodIncome, foodUpkeep, desertion };
}
