import type { BilingualName, EntityId } from './common';
import type { City } from './city';
import type { Force } from './force';
import type { Officer } from './officer';
import type { GameDate } from './common';

export interface Scenario {
  id: EntityId;
  name: BilingualName;
  description: string;
  startDate: GameDate;
  cities: City[];
  forces: Force[];
  officers: Officer[];
}
