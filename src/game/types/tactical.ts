import type { BilingualName, EntityId } from './common';

// ─── Weather, time of day, formations, objectives ────────────────────

export type Weather = 'clear' | 'rain' | 'wind' | 'fog' | 'snow';
export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';

export type FormationId =
  | 'none'           // no formation
  | 'fish-scale'     // 魚鱗 — +defense to adjacent allies (Cao Cao style)
  | 'eight-trigrams' // 八陣 — heal aura, slows enemies (Zhuge Liang)
  | 'arrow-tip'      // 鋒矢 — +charge damage, +1 cavalry move
  | 'crane-wing'     // 鶴翼 — encircling, +range bonus
  | 'spread-out'     // 散開 — fire/aoe resistance
  | 'awl'            // 錐行 — first-strike piercing
  | 'wheel'          // 車懸 — rotating attack, lower own losses each turn
  | 'square'         // 方圓 — all-side defense, reduced move
  | 'crescent-moon'  // 偃月 — anti-flank
  | 'wild-goose'     // 雁行 — balanced archer/cavalry
  | 'trinity'        // 三才 — bonus when 3+ allied officers grouped
  | 'back-to-water'  // 背水 — Han Xin death-or-victory
  | 'ten-ambush'     // 十面埋伏 — Han Xin's surround
  | 'long-snake'     // 長蛇 — column for mountain/pass
  | 'crescent-withdraw'; // 却月 — Liu Yu's cart-crossbow circle

export interface FormationDef {
  id: FormationId;
  name: BilingualName;
  description: string;
  minIntelligence: number;
}

/**
 * A battle objective other than annihilating the enemy commander. Each side
 * may have a primary objective; the battle ends when one side's objective
 * resolves (success or failure).
 */
export type ObjectiveKind =
  | 'destroy-commander'  // default — kill the enemy commander
  | 'hold-tile'          // hold a specific hex for N turns
  | 'escape'             // get the commander to an edge
  | 'survive-turns'      // last N turns alive (defender win condition)
  | 'escort'             // protect a non-commander unit to an edge
  | 'capture-supply';    // reach a supply tile and hold it 2 turns

export interface BattleObjective {
  kind: ObjectiveKind;
  /** Hex coord for hold/capture objectives. */
  tileCoord?: HexCoord;
  /** Unit ID for escort objectives. */
  protectedUnitId?: EntityId;
  /** Turn count for hold / survive objectives. */
  turnsRequired?: number;
  /** Current progress (turns held / turns survived). */
  progress?: number;
  /** Resolution. */
  resolved?: 'success' | 'failure';
}

/** A pending unit arrival mid-battle. */
export interface Reinforcement {
  arriveTurn: number;
  side: 'attacker' | 'defender';
  officerId: EntityId;
  troops: number;
  unitType: UnitType;
  /** Edge to spawn from. */
  edge: 'north' | 'south' | 'east' | 'west';
  /** Announcement banner text — shown when they arrive. */
  announcement?: string;
}

/** A famous-battle map preset. */
export interface NamedBattleMap {
  id: EntityId;
  name: BilingualName;
  description: string;
  width: number;
  height: number;
  /** Special terrain overrides keyed by `col,row`. */
  terrainOverrides: Record<string, TerrainKind>;
  /** Default weather and time. */
  weather: Weather;
  timeOfDay: TimeOfDay;
  /** Optional scripted reinforcements. */
  reinforcements?: Reinforcement[];
  /** Special hex tags for objectives (e.g. supply, bridge). */
  specialTiles?: Array<{
    coord: HexCoord;
    label: BilingualName;
    role: 'supply' | 'bridge' | 'hill' | 'wagon' | 'flag';
  }>;
}

/** A floating damage popup spawned by a hit. */
export interface DamagePopup {
  id: string;
  coord: HexCoord;
  text: string;
  color: string;
  spawnedAt: number;
}

/**
 * Tactical battle: a separate hex-grid skirmish screen that resolves a
 * single field engagement before falling back to the strategic map.
 *
 * Coordinates use offset (col, row) for a "flat-top" hex grid.
 */
export interface HexCoord {
  col: number;
  row: number;
}

export type TerrainKind = 'plain' | 'forest' | 'mountain' | 'river' | 'road';

/**
 * Unit specialty types. Each has a counter / counter-by relationship:
 *   spearmen   > cavalry > archers > spearmen (RPS)
 *   siege      > city defense  (irrelevant in field)
 *   navy       only effective on rivers
 *   infantry   neutral baseline
 */
export type UnitType =
  | 'infantry'  // 歩兵 — generalist, no bonus, no penalty
  | 'spearmen'  // 槍兵 — strong vs cavalry
  | 'cavalry'   // 騎兵 — fast, strong vs archers
  | 'archers'   // 弓兵 — ranged, strong vs spearmen
  | 'siege'     // 攻城 — slow, strong vs walls
  | 'navy';     // 水軍 — only effective on river tiles

export interface TacticalTile {
  coord: HexCoord;
  terrain: TerrainKind;
}

/** A unit on the tactical map — corresponds to one officer + their troop allotment. */
export interface TacticalUnit {
  id: EntityId;
  officerId: EntityId;
  side: 'attacker' | 'defender';
  coord: HexCoord;
  /** Current troop count (HP). */
  troops: number;
  maxTroops: number;
  /** Action points remaining this turn. Refilled at start of turn. */
  ap: number;
  maxAp: number;
  /** "morale" — drops on damage; if 0, unit routs and is removed. */
  morale: number;
  /** True if this is the army commander — eliminating them = side defeat. */
  isCommander: boolean;
  /** Active status effects, e.g. "burning", "confused", "defending". */
  effects: TacticalStatus[];
  /** Unit type (combat arm). */
  unitType: UnitType;
}

export type TacticalStatus =
  | { kind: 'burning'; turnsLeft: number }
  | { kind: 'confused'; turnsLeft: number }
  | { kind: 'defending'; turnsLeft: number }
  | { kind: 'chained'; turnsLeft: number; chainedWith: EntityId[] }
  | { kind: 'revealed'; turnsLeft: number }
  | { kind: 'demoralized'; turnsLeft: number };

/** Stratagem types — single-use special actions during the battle. */
export type StratagemId =
  | 'fire-attack'   // 火計
  | 'confusion'     // 計略
  | 'charge'        // 突撃
  | 'defend'        // 防御
  | 'rally'         // 鼓舞
  | 'rain-of-arrows' // 矢雨齊發
  | 'chain-ships'   // 連環 — link enemies so they share damage
  | 'false-retreat' // 偽計 — fake rout to lure pursuers into a kill zone
  | 'precognition'  // 神算 — reveal enemy AP & cooldowns next turn
  | 'lightning'     // 落雷 — direct damage with chance to confuse
  | 'supply-strike' // 兵糧攻 — sap morale of all enemies on map
  | 'gallop'        // 飛将 — Lü Bu's signature: charge 3 hexes + strike
  | 'dragon-veil';  // 龍威 — Zhao Yun's signature: free hit on every adjacent enemy

export interface Stratagem {
  id: StratagemId;
  name: BilingualName;
  description: string;
  /** Min intelligence to use. */
  minIntelligence: number;
  /** Range in hexes (Chebyshev). */
  range: number;
  /** Cooldown in turns (0 = once per battle). */
  cooldown: number;
}

export interface TacticalBattle {
  id: EntityId;
  /** The strategic-map city we're fighting over. */
  cityId: EntityId;
  attackerForceId: EntityId | null;
  defenderForceId: EntityId | null;
  width: number;
  height: number;
  tiles: TacticalTile[];
  units: TacticalUnit[];
  turn: number;
  /** Whose phase it is. */
  activeSide: 'attacker' | 'defender';
  /** Stratagem cooldowns per unit (key: unitId-stratagemId → turn when usable again). */
  stratagemCooldowns: Record<string, number>;
  /** Set when one side is eliminated. */
  winner?: 'attacker' | 'defender';
  /** Casualty totals, computed at end. */
  attackerLosses: number;
  defenderLosses: number;
  /** Per-side primary objective. */
  attackerObjective?: BattleObjective;
  defenderObjective?: BattleObjective;
  /** Per-side formation. */
  attackerFormation?: FormationId;
  defenderFormation?: FormationId;
  /** Weather & time of day. */
  weather: Weather;
  timeOfDay: TimeOfDay;
  /** Scripted reinforcements (consumed when they arrive). */
  reinforcements?: Reinforcement[];
  /** Special tiles for objectives (supply, bridge, etc). */
  specialTiles?: Array<{
    coord: HexCoord;
    label: BilingualName;
    role: 'supply' | 'bridge' | 'hill' | 'wagon' | 'flag';
  }>;
  /** Floating damage popups (UI-only, cleared per frame). */
  damagePopups?: DamagePopup[];
  /** Battle log entries (voice lines, milestones). */
  log?: Array<{
    turn: number;
    text: string;
    speaker?: EntityId;
    kind: 'voice' | 'event' | 'arrival';
  }>;
  /** Captured officer IDs after victory. */
  capturedOfficerIds?: EntityId[];
  /** Loot computed at end (gold, items). */
  loot?: {
    gold: number;
    itemId?: EntityId;
  };
}
