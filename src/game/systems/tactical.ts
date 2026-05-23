import type {
  BattleObjective,
  DamagePopup,
  EntityId,
  FormationId,
  HexCoord,
  NamedBattleMap,
  Officer,
  Reinforcement,
  StratagemId,
  TacticalBattle,
  TacticalStatus,
  TacticalTile,
  TacticalUnit,
  TerrainKind,
  TimeOfDay,
  UnitType,
  Weather,
} from '../types';
import { NAMED_MAPS_BY_CITY, NAMED_MAPS_BY_ID } from '../data/namedMaps';
import { pickVoiceLine } from '../data/voiceLines';

/**
 * Unit-type counter matrix. counterBonus[attacker][defender] = multiplier on
 * damage dealt by attacker to defender. 1.0 = neutral, >1.0 = strong, <1.0 = weak.
 */
const COUNTER_MATRIX: Record<UnitType, Partial<Record<UnitType, number>>> = {
  spearmen: { cavalry: 1.5, archers: 0.75 },
  cavalry: { archers: 1.5, spearmen: 0.75 },
  archers: { spearmen: 1.5, cavalry: 0.75 },
  siege: { spearmen: 0.6, cavalry: 0.5, archers: 0.6 },
  navy: {}, // bonuses come from river terrain
  infantry: {},
};

export function counterMultiplier(a: UnitType, d: UnitType): number {
  return COUNTER_MATRIX[a][d] ?? 1.0;
}

/** Per-terrain multiplier on damage dealt by attacker. */
const TERRAIN_DAMAGE_MOD: Record<UnitType, Partial<Record<TerrainKind, number>>> = {
  cavalry: { forest: 0.6, mountain: 0.4, river: 0.5, road: 1.2, plain: 1.1 },
  archers: { forest: 1.1, mountain: 1.15 },
  navy: { river: 1.6, plain: 0.4, mountain: 0.2, forest: 0.5, road: 0.6 },
  siege: { mountain: 0.5, forest: 0.7, river: 0.5 },
  spearmen: {},
  infantry: {},
};

export function terrainDamageMod(t: UnitType, terrain: TerrainKind): number {
  return TERRAIN_DAMAGE_MOD[t][terrain] ?? 1.0;
}

/**
 * Pick an appropriate unit type for an officer based on their stats
 * and any unit-type signaling skills.
 */
export function inferUnitType(o: Officer | undefined): UnitType {
  if (!o) return 'infantry';
  if (o.skills.includes('cavalry-master')) return 'cavalry';
  if (o.skills.includes('archer-master')) return 'archers';
  if (o.skills.includes('navy-master')) return 'navy';
  if (o.skills.includes('siegemaster')) return 'siege';
  // Stat-based fallback.
  if (o.stats.war >= 88 && o.stats.leadership >= 80) return 'spearmen';
  if (o.stats.war >= 85) return 'cavalry';
  if (o.stats.intelligence >= 80) return 'archers';
  return 'infantry';
}

// ─── Hex grid helpers (offset coordinates, "odd-q" flat-top) ──────────

/** Distance between two hexes in offset coords. */
export function hexDistance(a: HexCoord, b: HexCoord): number {
  const [ax, ay, az] = offsetToCube(a);
  const [bx, by, bz] = offsetToCube(b);
  return Math.max(Math.abs(ax - bx), Math.abs(ay - by), Math.abs(az - bz));
}

function offsetToCube(h: HexCoord): [number, number, number] {
  const x = h.col;
  const z = h.row - (h.col - (h.col & 1)) / 2;
  const y = -x - z;
  return [x, y, z];
}

/** Neighbours in offset coords for odd-q flat-top hexes. */
export function hexNeighbours(h: HexCoord): HexCoord[] {
  const odd = (h.col & 1) === 1;
  const deltas = odd
    ? [
        { col: +1, row: 0 }, { col: +1, row: +1 },
        { col: 0,  row: +1 }, { col: -1, row: +1 },
        { col: -1, row: 0 }, { col: 0,  row: -1 },
      ]
    : [
        { col: +1, row: -1 }, { col: +1, row: 0 },
        { col: 0,  row: +1 },  { col: -1, row: 0 },
        { col: -1, row: -1 }, { col: 0,  row: -1 },
      ];
  return deltas.map((d) => ({ col: h.col + d.col, row: h.row + d.row }));
}

// ─── Battle setup ─────────────────────────────────────────────────────

export interface SetupParams {
  cityId: EntityId;
  width: number;
  height: number;
  attackerForceId: EntityId | null;
  defenderForceId: EntityId | null;
  attackers: Array<{ officer: Officer; troops: number; unitType?: UnitType }>;
  defenders: Array<{ officer: Officer; troops: number; unitType?: UnitType }>;
  attackerFormation?: FormationId;
  defenderFormation?: FormationId;
  attackerObjective?: BattleObjective;
  defenderObjective?: BattleObjective;
  weather?: Weather;
  timeOfDay?: TimeOfDay;
  reinforcements?: Reinforcement[];
  /** Pre-rolled scripted map (overrides city-based lookup). */
  namedMapId?: EntityId;
}

const TERRAIN_RNG_SEED = (cityId: string) => {
  let h = 2166136261;
  for (let i = 0; i < cityId.length; i++) {
    h = Math.imul(h ^ cityId.charCodeAt(i), 16777619);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return ((h >>> 0) % 10000) / 10000;
  };
};

export function setupTacticalBattle(p: SetupParams): TacticalBattle {
  // Named map override?
  const namedMapId = p.namedMapId ?? NAMED_MAPS_BY_CITY[p.cityId];
  const namedMap: NamedBattleMap | undefined = namedMapId
    ? NAMED_MAPS_BY_ID[namedMapId]
    : undefined;
  const width = namedMap?.width ?? p.width;
  const height = namedMap?.height ?? p.height;
  const weather: Weather = namedMap?.weather ?? p.weather ?? 'clear';
  const timeOfDay: TimeOfDay = namedMap?.timeOfDay ?? p.timeOfDay ?? 'day';

  // Deterministic per-city terrain so revisits look the same.
  const rng = TERRAIN_RNG_SEED(p.cityId);
  const tiles: TacticalTile[] = [];
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const key = `${col},${row}`;
      let terrain: TerrainKind = 'plain';
      if (namedMap?.terrainOverrides[key]) {
        terrain = namedMap.terrainOverrides[key];
      } else {
        const r = rng();
        if (r < 0.08) terrain = 'mountain';
        else if (r < 0.22) terrain = 'forest';
        else if (r < 0.28) terrain = 'river';
        else if (row === Math.floor(height / 2) && r < 0.5) terrain = 'road';
      }
      tiles.push({ coord: { col, row }, terrain });
    }
  }

  const placeUnits = (
    pool: Array<{ officer: Officer; troops: number; unitType?: UnitType }>,
    side: 'attacker' | 'defender',
  ): TacticalUnit[] => {
    const startCol = side === 'attacker' ? 0 : width - 1;
    return pool.slice(0, Math.floor(height / 2) + 1).map((entry, i) => {
      const row = Math.floor(height / 2) + (i % 2 === 0 ? -Math.floor(i / 2) : Math.floor((i + 1) / 2));
      const unitType = entry.unitType ?? inferUnitType(entry.officer);
      // Cavalry get extra AP, siege get less.
      const maxAp = unitType === 'cavalry' ? 4 : unitType === 'siege' ? 2 : 3;
      return {
        id: `${side}-${entry.officer.id}`,
        officerId: entry.officer.id,
        side,
        coord: {
          col: startCol,
          row: Math.max(0, Math.min(height - 1, row)),
        },
        troops: entry.troops,
        maxTroops: entry.troops,
        ap: maxAp,
        maxAp,
        morale: 100,
        isCommander: i === 0,
        effects: [],
        unitType,
      };
    });
  };

  const units = [
    ...placeUnits(p.attackers, 'attacker'),
    ...placeUnits(p.defenders, 'defender'),
  ];

  // Generate spawn voice lines for famous officers.
  const log: TacticalBattle['log'] = [];
  for (const u of units) {
    const voice = pickVoiceLine(u.officerId, 'spawn', Math.random);
    if (voice) {
      log.push({ turn: 1, text: voice, speaker: u.officerId, kind: 'voice' });
    }
  }

  return {
    id: `tac-${p.cityId}-${Date.now()}`,
    cityId: p.cityId,
    attackerForceId: p.attackerForceId,
    defenderForceId: p.defenderForceId,
    width,
    height,
    tiles,
    units,
    turn: 1,
    activeSide: 'attacker',
    stratagemCooldowns: {},
    attackerLosses: 0,
    defenderLosses: 0,
    attackerFormation: p.attackerFormation ?? 'none',
    defenderFormation: p.defenderFormation ?? 'none',
    attackerObjective: p.attackerObjective,
    defenderObjective: p.defenderObjective,
    weather,
    timeOfDay,
    reinforcements: [...(namedMap?.reinforcements ?? []), ...(p.reinforcements ?? [])],
    specialTiles: namedMap?.specialTiles ?? [],
    damagePopups: [],
    log,
  };
}

// ─── Action processing ────────────────────────────────────────────────

const TERRAIN_MOVE_COST: Record<TerrainKind, number> = {
  plain: 1,
  road: 1,    // road cost = 1 (no bonus in this simple model)
  forest: 2,
  mountain: 3,
  river: 3,
};

export function tileAt(b: TacticalBattle, c: HexCoord): TacticalTile | undefined {
  return b.tiles.find((t) => t.coord.col === c.col && t.coord.row === c.row);
}

export function unitAt(b: TacticalBattle, c: HexCoord): TacticalUnit | undefined {
  return b.units.find(
    (u) =>
      u.coord.col === c.col &&
      u.coord.row === c.row &&
      u.troops > 0,
  );
}

export function moveCost(b: TacticalBattle, to: HexCoord): number {
  const t = tileAt(b, to);
  if (!t) return Infinity;
  return TERRAIN_MOVE_COST[t.terrain];
}

export function canMove(
  b: TacticalBattle,
  unit: TacticalUnit,
  to: HexCoord,
): boolean {
  if (unit.ap <= 0) return false;
  const dist = hexDistance(unit.coord, to);
  if (dist !== 1) return false;
  const cost = moveCost(b, to);
  if (cost > unit.ap) return false;
  if (unitAt(b, to)) return false;
  return true;
}

export function moveUnit(
  b: TacticalBattle,
  unitId: EntityId,
  to: HexCoord,
): TacticalBattle {
  const unit = b.units.find((u) => u.id === unitId);
  if (!unit || !canMove(b, unit, to)) return b;
  const cost = moveCost(b, to);
  return {
    ...b,
    units: b.units.map((u) =>
      u.id === unitId ? { ...u, coord: to, ap: u.ap - cost } : u,
    ),
  };
}

export function canAttack(
  _b: TacticalBattle,
  unit: TacticalUnit,
  target: TacticalUnit,
): boolean {
  if (unit.ap <= 0 || unit.side === target.side) return false;
  return hexDistance(unit.coord, target.coord) === 1;
}

/**
 * Compute damage as a function of stat × troops modified by terrain, status,
 * formation, weather, and unit-type counters. Also emits damage popups and
 * fires voice lines for the attacker.
 */
export function attackUnits(
  b: TacticalBattle,
  attackerId: EntityId,
  targetId: EntityId,
  officers: Record<EntityId, Officer>,
  rng: () => number,
): TacticalBattle {
  const attacker = b.units.find((u) => u.id === attackerId);
  const target = b.units.find((u) => u.id === targetId);
  if (!attacker || !target) return b;
  if (!canAttack(b, attacker, target)) return b;

  const ao = officers[attacker.officerId];
  const To = officers[target.officerId];
  const aWar = ao?.stats.war ?? 50;
  const dLead = To?.stats.leadership ?? 50;

  // Defending status halves incoming damage.
  const targetDefending = target.effects.some((e) => e.kind === 'defending');
  // Burning status: 5% troops of attacker added to damage (the flames keep eating).
  const attackerBurning = attacker.effects.some((e) => e.kind === 'burning');
  const attackerDemoralized = attacker.effects.some((e) => e.kind === 'demoralized');

  const counter = counterMultiplier(attacker.unitType, target.unitType);
  const aTerrainTile = tileAt(b, attacker.coord);
  const aTerrainMod = aTerrainTile ? terrainDamageMod(attacker.unitType, aTerrainTile.terrain) : 1;

  // Formation effects on defense.
  const targetFormation =
    target.side === 'attacker' ? b.attackerFormation : b.defenderFormation;
  const defenseMul = defensiveFormationBonus(b, target, targetFormation ?? 'none');

  // Weather effects.
  const weatherMul = weatherDamageMul(b.weather, attacker.unitType);

  const base =
    Math.floor((attacker.troops * (aWar + 30) * (0.85 + rng() * 0.3)) / (dLead + 50));
  let damage = Math.floor(
    base * counter * aTerrainMod * weatherMul * defenseMul,
  );
  if (targetDefending) damage = Math.floor(damage / 2);
  if (attackerBurning) damage = Math.floor(damage * 0.9);
  if (attackerDemoralized) damage = Math.floor(damage * 0.8);

  // Critical hit on natural high roll.
  const isCrit = rng() < 0.12;
  if (isCrit) damage = Math.floor(damage * 1.6);

  const newTroops = Math.max(0, target.troops - damage);
  const moraleLoss = Math.floor((damage / Math.max(1, target.maxTroops)) * 50);

  // Counter-attack: target deals back ~40% if still alive.
  let counterTroops = attacker.troops;
  let counterDamage = 0;
  if (newTroops > 0) {
    const dWar = To?.stats.war ?? 50;
    const aLead = ao?.stats.leadership ?? 50;
    const counterBase = Math.floor(
      (target.troops * (dWar + 30) * (0.85 + rng() * 0.3) * 0.4) / (aLead + 50),
    );
    counterTroops = Math.max(0, attacker.troops - counterBase);
    counterDamage = counterBase;
  }

  // Damage popups.
  const popups: DamagePopup[] = [
    {
      id: `dmg-${Date.now()}-1`,
      coord: target.coord,
      text: `-${damage.toLocaleString()}${isCrit ? '!' : ''}`,
      color: isCrit ? '#ffce4a' : '#ff6a4a',
      spawnedAt: Date.now(),
    },
  ];
  if (counterDamage > 0) {
    popups.push({
      id: `dmg-${Date.now()}-2`,
      coord: attacker.coord,
      text: `-${counterDamage.toLocaleString()}`,
      color: '#88b7e8',
      spawnedAt: Date.now() + 1,
    });
  }

  // Voice lines.
  const log = b.log ? [...b.log] : [];
  const attackVoice = pickVoiceLine(attacker.officerId, isCrit ? 'critical' : 'attack', rng);
  if (attackVoice) {
    log.push({ turn: b.turn, text: attackVoice, speaker: attacker.officerId, kind: 'voice' });
  }
  if (newTroops === 0) {
    const killVoice = pickVoiceLine(attacker.officerId, 'kill', rng);
    if (killVoice) {
      log.push({ turn: b.turn, text: killVoice, speaker: attacker.officerId, kind: 'voice' });
    }
  } else if (newTroops < target.maxTroops * 0.3) {
    const lowVoice = pickVoiceLine(target.officerId, 'lowHp', rng);
    if (lowVoice) {
      log.push({ turn: b.turn, text: lowVoice, speaker: target.officerId, kind: 'voice' });
    }
  }

  // Chained-unit damage spread.
  const chainEffect = target.effects.find((e) => e.kind === 'chained') as
    | { kind: 'chained'; turnsLeft: number; chainedWith: EntityId[] }
    | undefined;
  const chainSpread = Math.floor(damage * 0.5);
  const units = b.units.map((u) => {
    if (u.id === targetId) {
      return {
        ...u,
        troops: newTroops,
        morale: Math.max(0, u.morale - moraleLoss),
      };
    }
    if (u.id === attackerId) {
      return { ...u, ap: u.ap - 1, troops: counterTroops };
    }
    // Chain damage to linked units.
    if (chainEffect && chainEffect.chainedWith.includes(u.id) && u.side === target.side) {
      const tr = Math.max(0, u.troops - chainSpread);
      popups.push({
        id: `dmg-${Date.now()}-chain-${u.id}`,
        coord: u.coord,
        text: `-${chainSpread.toLocaleString()}`,
        color: '#ff9070',
        spawnedAt: Date.now() + 2,
      });
      return { ...u, troops: tr };
    }
    return u;
  });

  return {
    ...b,
    units,
    damagePopups: [...(b.damagePopups ?? []), ...popups],
    log,
  };
}

function defensiveFormationBonus(
  b: TacticalBattle,
  target: TacticalUnit,
  formation: FormationId,
): number {
  if (formation === 'fish-scale') {
    const adjAllies = b.units.filter(
      (u) =>
        u.side === target.side &&
        u.id !== target.id &&
        hexDistance(u.coord, target.coord) === 1,
    );
    if (adjAllies.length > 0) return 0.85; // 15% damage reduction
  }
  if (formation === 'spread-out') return 0.9;
  return 1.0;
}

function weatherDamageMul(w: Weather, unitType: UnitType): number {
  if (w === 'rain' && unitType === 'archers') return 0.75;
  if (w === 'fog' && unitType === 'archers') return 0.7;
  if (w === 'snow') return 0.9;
  if (w === 'wind' && unitType === 'navy') return 1.15;
  return 1.0;
}

// ─── Stratagems ──────────────────────────────────────────────────────

export function applyStratagem(
  b: TacticalBattle,
  unitId: EntityId,
  stratagem: StratagemId,
  targetCoord: HexCoord,
  officers: Record<EntityId, Officer>,
): { battle: TacticalBattle; ok: boolean; reason?: string } {
  const unit = b.units.find((u) => u.id === unitId);
  if (!unit) return { battle: b, ok: false, reason: 'no unit' };
  const cooldownKey = `${unitId}-${stratagem}`;
  const onCd = (b.stratagemCooldowns[cooldownKey] ?? 0) > b.turn;
  if (onCd) return { battle: b, ok: false, reason: 'on cooldown' };
  if (unit.ap < 1) return { battle: b, ok: false, reason: 'no AP' };

  const off = officers[unit.officerId];
  switch (stratagem) {
    case 'fire-attack': {
      if ((off?.stats.intelligence ?? 0) < 70)
        return { battle: b, ok: false, reason: 'requires INT 70' };
      if (hexDistance(unit.coord, targetCoord) > 3)
        return { battle: b, ok: false, reason: 'out of range' };
      const target = unitAt(b, targetCoord);
      if (!target || target.side === unit.side)
        return { battle: b, ok: false, reason: 'invalid target' };
      // Wind doubles fire duration; rain halves it.
      const turns = b.weather === 'wind' ? 5 : b.weather === 'rain' ? 1 : 3;
      const updated = setStatus(b, target.id, { kind: 'burning', turnsLeft: turns });
      return finalize(updated, unitId, stratagem, 0);
    }
    case 'confusion': {
      if ((off?.stats.intelligence ?? 0) < 75)
        return { battle: b, ok: false, reason: 'requires INT 75' };
      if (hexDistance(unit.coord, targetCoord) > 4)
        return { battle: b, ok: false, reason: 'out of range' };
      const target = unitAt(b, targetCoord);
      if (!target || target.side === unit.side)
        return { battle: b, ok: false, reason: 'invalid target' };
      const updated = setStatus(b, target.id, { kind: 'confused', turnsLeft: 2 });
      return finalize(updated, unitId, stratagem, 0);
    }
    case 'defend': {
      const updated = setStatus(b, unit.id, { kind: 'defending', turnsLeft: 1 });
      return finalize(updated, unitId, stratagem, 0);
    }
    case 'rally': {
      if ((off?.stats.intelligence ?? 0) < 60)
        return { battle: b, ok: false, reason: 'requires INT 60' };
      if (hexDistance(unit.coord, targetCoord) > 2)
        return { battle: b, ok: false, reason: 'out of range' };
      const target = unitAt(b, targetCoord);
      if (!target || target.side !== unit.side)
        return { battle: b, ok: false, reason: 'must be friendly' };
      const restored = Math.floor(target.maxTroops * 0.15);
      const updated: TacticalBattle = {
        ...b,
        units: b.units.map((u) =>
          u.id === target.id
            ? {
                ...u,
                troops: Math.min(u.maxTroops, u.troops + restored),
                morale: Math.min(100, u.morale + 25),
              }
            : u,
        ),
      };
      return finalize(updated, unitId, stratagem, 2);
    }
    case 'charge': {
      if (hexDistance(unit.coord, targetCoord) > 1)
        return { battle: b, ok: false, reason: 'adjacent only' };
      const target = unitAt(b, targetCoord);
      if (!target || target.side === unit.side)
        return { battle: b, ok: false, reason: 'invalid target' };
      // Charge: +50% damage, spend all AP.
      const aWar = off?.stats.war ?? 50;
      const dLead = officers[target.officerId]?.stats.leadership ?? 50;
      const damage = Math.floor(
        (unit.troops * (aWar + 30) * 1.5) / (dLead + 50),
      );
      const updated: TacticalBattle = {
        ...b,
        units: b.units.map((u) => {
          if (u.id === target.id)
            return { ...u, troops: Math.max(0, u.troops - damage), morale: Math.max(0, u.morale - 25) };
          if (u.id === unit.id) return { ...u, ap: 0 };
          return u;
        }),
      };
      return finalize(updated, unitId, stratagem, 2);
    }
    case 'rain-of-arrows': {
      const maxRange = b.timeOfDay === 'night' ? 2 : 4;
      const d = hexDistance(unit.coord, targetCoord);
      if (d > maxRange || d < 2)
        return { battle: b, ok: false, reason: `range 2–${maxRange}` };
      const target = unitAt(b, targetCoord);
      if (!target || target.side === unit.side)
        return { battle: b, ok: false, reason: 'invalid target' };
      const damage = Math.floor(target.troops * 0.12);
      const popup: DamagePopup = {
        id: `dmg-${Date.now()}-arrows`,
        coord: target.coord,
        text: `-${damage.toLocaleString()}`,
        color: '#88b7e8',
        spawnedAt: Date.now(),
      };
      const updated: TacticalBattle = {
        ...b,
        units: b.units.map((u) => {
          if (u.id === target.id)
            return { ...u, troops: Math.max(0, u.troops - damage) };
          if (u.id === unit.id) return { ...u, ap: u.ap - 1 };
          return u;
        }),
        damagePopups: [...(b.damagePopups ?? []), popup],
      };
      return finalize(updated, unitId, stratagem, 1);
    }
    case 'chain-ships': {
      if ((off?.stats.intelligence ?? 0) < 80)
        return { battle: b, ok: false, reason: 'requires INT 80' };
      if (hexDistance(unit.coord, targetCoord) > 3)
        return { battle: b, ok: false, reason: 'out of range' };
      const target = unitAt(b, targetCoord);
      if (!target || target.side === unit.side)
        return { battle: b, ok: false, reason: 'invalid target' };
      // Chain target + its adjacent allies.
      const chained = b.units.filter(
        (u) => u.side === target.side && hexDistance(u.coord, target.coord) <= 1,
      );
      const chainedIds = chained.map((u) => u.id);
      let next = b;
      for (const c of chained) {
        next = setStatus(next, c.id, {
          kind: 'chained',
          turnsLeft: 4,
          chainedWith: chainedIds.filter((id) => id !== c.id),
        });
      }
      return finalize(next, unitId, stratagem, 0);
    }
    case 'false-retreat': {
      if ((off?.stats.intelligence ?? 0) < 70)
        return { battle: b, ok: false, reason: 'requires INT 70' };
      // Confuse the closest enemy.
      const enemies = b.units
        .filter((u) => u.side !== unit.side)
        .sort((a, c) => hexDistance(unit.coord, a.coord) - hexDistance(unit.coord, c.coord));
      const closest = enemies[0];
      if (!closest) return { battle: b, ok: false, reason: 'no enemies' };
      const next = setStatus(b, closest.id, { kind: 'confused', turnsLeft: 2 });
      return finalize(next, unitId, stratagem, 0);
    }
    case 'precognition': {
      if ((off?.stats.intelligence ?? 0) < 90)
        return { battle: b, ok: false, reason: 'requires INT 90' };
      let next = b;
      for (const e of b.units.filter((u) => u.side !== unit.side)) {
        next = setStatus(next, e.id, { kind: 'revealed', turnsLeft: 2 });
      }
      return finalize(next, unitId, stratagem, 0);
    }
    case 'lightning': {
      if ((off?.stats.intelligence ?? 0) < 85)
        return { battle: b, ok: false, reason: 'requires INT 85' };
      if (hexDistance(unit.coord, targetCoord) > 4)
        return { battle: b, ok: false, reason: 'out of range' };
      const target = unitAt(b, targetCoord);
      if (!target) return { battle: b, ok: false, reason: 'no target' };
      const damage = Math.floor(target.troops * 0.15);
      const confuse = Math.random() < 0.3;
      let next: TacticalBattle = {
        ...b,
        units: b.units.map((u) =>
          u.id === target.id ? { ...u, troops: Math.max(0, u.troops - damage) } : u,
        ),
        damagePopups: [
          ...(b.damagePopups ?? []),
          {
            id: `dmg-${Date.now()}-lightning`,
            coord: target.coord,
            text: `-${damage.toLocaleString()}⚡`,
            color: '#e0d090',
            spawnedAt: Date.now(),
          },
        ],
      };
      if (confuse) next = setStatus(next, target.id, { kind: 'confused', turnsLeft: 2 });
      return finalize(next, unitId, stratagem, 0);
    }
    case 'supply-strike': {
      if ((off?.stats.intelligence ?? 0) < 75)
        return { battle: b, ok: false, reason: 'requires INT 75' };
      let next = b;
      for (const e of b.units.filter((u) => u.side !== unit.side)) {
        next = setStatus(next, e.id, { kind: 'demoralized', turnsLeft: 3 });
      }
      return finalize(next, unitId, stratagem, 0);
    }
    case 'gallop': {
      // Lü Bu's signature: charge up to 3 hexes in a straight line.
      if (hexDistance(unit.coord, targetCoord) > 3 || hexDistance(unit.coord, targetCoord) < 1)
        return { battle: b, ok: false, reason: 'range 1–3' };
      const target = unitAt(b, targetCoord);
      if (!target || target.side === unit.side)
        return { battle: b, ok: false, reason: 'invalid target' };
      // Move adjacent to target, deal 1.75× damage.
      const neighbours = hexNeighbours(target.coord);
      const landing = neighbours.find(
        (c) => tileAt(b, c) && !unitAt(b, c),
      );
      const aWar = off?.stats.war ?? 80;
      const dLead = officers[target.officerId]?.stats.leadership ?? 50;
      const damage = Math.floor(
        (unit.troops * (aWar + 30) * 1.75) / (dLead + 50),
      );
      const next: TacticalBattle = {
        ...b,
        units: b.units.map((u) => {
          if (u.id === unit.id && landing) {
            return { ...u, coord: landing, ap: 0 };
          }
          if (u.id === target.id) {
            return { ...u, troops: Math.max(0, u.troops - damage) };
          }
          return u;
        }),
        damagePopups: [
          ...(b.damagePopups ?? []),
          {
            id: `dmg-${Date.now()}-gallop`,
            coord: target.coord,
            text: `-${damage.toLocaleString()}!`,
            color: '#ff6a4a',
            spawnedAt: Date.now(),
          },
        ],
        log: [
          ...(b.log ?? []),
          {
            turn: b.turn,
            text: '飛将，突貫!',
            speaker: unit.officerId,
            kind: 'voice',
          },
        ],
      };
      return finalize(next, unitId, stratagem, 3);
    }
    case 'dragon-veil': {
      // Zhao Yun's signature: hit every adjacent enemy.
      const adjEnemies = b.units.filter(
        (u) => u.side !== unit.side && hexDistance(u.coord, unit.coord) === 1,
      );
      if (adjEnemies.length === 0)
        return { battle: b, ok: false, reason: 'no adjacent enemies' };
      const aWar = off?.stats.war ?? 80;
      const popups: DamagePopup[] = [];
      const next: TacticalBattle = {
        ...b,
        units: b.units.map((u) => {
          const enemy = adjEnemies.find((e) => e.id === u.id);
          if (enemy) {
            const dLead = officers[u.officerId]?.stats.leadership ?? 50;
            const dmg = Math.floor(
              (unit.troops * (aWar + 30) * 0.6) / (dLead + 50),
            );
            popups.push({
              id: `dmg-${Date.now()}-veil-${u.id}`,
              coord: u.coord,
              text: `-${dmg.toLocaleString()}`,
              color: '#ff6a4a',
              spawnedAt: Date.now(),
            });
            return { ...u, troops: Math.max(0, u.troops - dmg) };
          }
          return u;
        }),
        damagePopups: [...(b.damagePopups ?? []), ...popups],
        log: [
          ...(b.log ?? []),
          {
            turn: b.turn,
            text: '龍威在此!',
            speaker: unit.officerId,
            kind: 'voice',
          },
        ],
      };
      return finalize(next, unitId, stratagem, 3);
    }
  }
}

function setStatus(
  b: TacticalBattle,
  unitId: EntityId,
  status: TacticalStatus,
): TacticalBattle {
  return {
    ...b,
    units: b.units.map((u) => {
      if (u.id !== unitId) return u;
      const filtered = u.effects.filter((e) => e.kind !== status.kind);
      return { ...u, effects: [...filtered, status] };
    }),
  };
}

function finalize(
  b: TacticalBattle,
  unitId: EntityId,
  stratagem: StratagemId,
  cooldownTurns: number,
): { battle: TacticalBattle; ok: boolean } {
  const unit = b.units.find((u) => u.id === unitId);
  if (!unit) return { battle: b, ok: false };
  const newAp = stratagem === 'charge' ? 0 : Math.max(0, unit.ap - 1);
  const next: TacticalBattle = {
    ...b,
    units: b.units.map((u) => (u.id === unitId ? { ...u, ap: newAp } : u)),
    stratagemCooldowns: {
      ...b.stratagemCooldowns,
      [`${unitId}-${stratagem}`]: b.turn + cooldownTurns,
    },
  };
  return { battle: next, ok: true };
}

// ─── Turn end ────────────────────────────────────────────────────────

export function endTurn(b: TacticalBattle): TacticalBattle {
  // Eight-trigrams aura: friendly units in formation regen 4% per turn.
  const inFormation = (side: 'attacker' | 'defender') =>
    (side === 'attacker' ? b.attackerFormation : b.defenderFormation) === 'eight-trigrams';

  // Apply ongoing effects (burning), tick durations, then flip side.
  const tickedUnits = b.units.map((u) => {
    let troops = u.troops;
    const newEffects: TacticalStatus[] = [];
    for (const e of u.effects) {
      if (e.kind === 'burning') {
        const burn = Math.floor(u.maxTroops * 0.08);
        troops = Math.max(0, troops - burn);
      }
      if (e.turnsLeft > 1) {
        newEffects.push({ ...e, turnsLeft: e.turnsLeft - 1 });
      }
    }
    // Eight Trigrams heal.
    if (inFormation(u.side)) {
      troops = Math.min(u.maxTroops, troops + Math.floor(u.maxTroops * 0.04));
    }
    return { ...u, troops, effects: newEffects, ap: u.maxAp };
  });

  // Spawn reinforcements scheduled for this turn.
  const arrivedUnits: TacticalUnit[] = [];
  const arrivalLog: NonNullable<TacticalBattle['log']> = [];
  const remaining = (b.reinforcements ?? []).filter((r) => {
    if (r.arriveTurn !== b.turn + 1) return true;
    // Spawn one unit at the chosen edge.
    const spawnCol =
      r.edge === 'west' ? 0
      : r.edge === 'east' ? b.width - 1
      : Math.floor(b.width / 2);
    const spawnRow =
      r.edge === 'north' ? 0
      : r.edge === 'south' ? b.height - 1
      : Math.floor(b.height / 2);
    arrivedUnits.push({
      id: `${r.side}-reinforce-${r.officerId}-t${b.turn + 1}`,
      officerId: r.officerId,
      side: r.side,
      coord: { col: spawnCol, row: spawnRow },
      troops: r.troops,
      maxTroops: r.troops,
      ap: r.unitType === 'cavalry' ? 4 : r.unitType === 'siege' ? 2 : 3,
      maxAp: r.unitType === 'cavalry' ? 4 : r.unitType === 'siege' ? 2 : 3,
      morale: 100,
      isCommander: false,
      effects: [],
      unitType: r.unitType,
    });
    if (r.announcement) {
      arrivalLog.push({
        turn: b.turn + 1,
        text: r.announcement,
        kind: 'arrival',
      });
    }
    return false;
  });

  // Remove routed units (troops 0 or morale 0).
  const allUnits = [...tickedUnits, ...arrivedUnits];
  const surviving = allUnits.filter((u) => u.troops > 0 && u.morale > 0);
  const removed = allUnits.filter((u) => u.troops <= 0 || u.morale <= 0);
  const newAttackerLoss = removed
    .filter((u) => u.side === 'attacker')
    .reduce((s, u) => s + u.maxTroops, 0);
  const newDefenderLoss = removed
    .filter((u) => u.side === 'defender')
    .reduce((s, u) => s + u.maxTroops, 0);

  // Objective progress.
  let attackerObj = b.attackerObjective;
  let defenderObj = b.defenderObjective;
  attackerObj = tickObjective(attackerObj, surviving, 'attacker', b.turn + 1);
  defenderObj = tickObjective(defenderObj, surviving, 'defender', b.turn + 1);

  // Winner check.
  const attackerLeft = surviving.some((u) => u.side === 'attacker');
  const defenderLeft = surviving.some((u) => u.side === 'defender');
  const attackerCommanderDown = !surviving.some(
    (u) => u.side === 'attacker' && u.isCommander,
  );
  const defenderCommanderDown = !surviving.some(
    (u) => u.side === 'defender' && u.isCommander,
  );

  let winner: 'attacker' | 'defender' | undefined;
  if (attackerObj?.resolved === 'success') winner = 'attacker';
  else if (defenderObj?.resolved === 'success') winner = 'defender';
  else if (!attackerLeft || attackerCommanderDown) winner = 'defender';
  else if (!defenderLeft || defenderCommanderDown) winner = 'attacker';

  return {
    ...b,
    units: surviving,
    turn: b.turn + 1,
    activeSide: b.activeSide === 'attacker' ? 'defender' : 'attacker',
    attackerLosses: b.attackerLosses + newAttackerLoss,
    defenderLosses: b.defenderLosses + newDefenderLoss,
    winner: winner ?? b.winner,
    attackerObjective: attackerObj,
    defenderObjective: defenderObj,
    reinforcements: remaining,
    log: [...(b.log ?? []), ...arrivalLog],
    damagePopups: [], // clear per turn
  };
}

function tickObjective(
  obj: BattleObjective | undefined,
  units: TacticalUnit[],
  side: 'attacker' | 'defender',
  _nextTurn: number,
): BattleObjective | undefined {
  if (!obj || obj.resolved) return obj;
  if (obj.kind === 'hold-tile' && obj.tileCoord) {
    const holding = units.some(
      (u) =>
        u.side === side &&
        u.coord.col === obj.tileCoord!.col &&
        u.coord.row === obj.tileCoord!.row,
    );
    const progress = (obj.progress ?? 0) + (holding ? 1 : 0);
    if (progress >= (obj.turnsRequired ?? 5)) {
      return { ...obj, progress, resolved: 'success' };
    }
    return { ...obj, progress };
  }
  if (obj.kind === 'survive-turns') {
    const progress = (obj.progress ?? 0) + 1;
    if (progress >= (obj.turnsRequired ?? 8)) {
      return { ...obj, progress, resolved: 'success' };
    }
    return { ...obj, progress };
  }
  if (obj.kind === 'escape') {
    const cmd = units.find((u) => u.side === side && u.isCommander);
    if (!cmd) return { ...obj, resolved: 'failure' };
    const atEdge = cmd.coord.col === 0 || cmd.coord.col === cmd.coord.col; // placeholder
    if (atEdge) return { ...obj, resolved: 'success' };
  }
  return obj;
}

// ─── AI ───────────────────────────────────────────────────────────────

/**
 * Compute the post-battle resolution: surviving officer IDs by side,
 * captured officers (defeated commanders kept alive), loot.
 */
export interface BattleResolution {
  winner: 'attacker' | 'defender' | null;
  attackerSurvivors: EntityId[];
  defenderSurvivors: EntityId[];
  attackerDead: EntityId[];
  defenderDead: EntityId[];
  capturedOfficerIds: EntityId[];
  attackerLosses: number;
  defenderLosses: number;
  lootGold: number;
}

export function resolveBattleEnd(
  battle: TacticalBattle,
  officers: Record<EntityId, Officer>,
): BattleResolution {
  const surviving = battle.units;
  const startingIds = new Set([
    ...(battle.units.map((u) => u.officerId)),
  ]);
  // Capture logic: officers who lost their unit but the *side* won are captured.
  const winner = battle.winner ?? null;
  const survivorsBySide = (side: 'attacker' | 'defender') =>
    surviving.filter((u) => u.side === side).map((u) => u.officerId);
  const attackerSurvivors = survivorsBySide('attacker');
  const defenderSurvivors = survivorsBySide('defender');

  const captured: EntityId[] = [];
  const dead: EntityId[] = [];

  // Loser-side: each missing officer is captured (with charisma roll), else killed.
  const lostOfficers = (side: 'attacker' | 'defender') => {
    const survivingSet = new Set(survivorsBySide(side));
    return battle.units
      .filter((u) => u.side === side && !survivingSet.has(u.officerId))
      .map((u) => u.officerId);
  };
  void startingIds;

  if (winner === 'attacker') {
    for (const id of lostOfficers('defender')) {
      const o = officers[id];
      if (!o) continue;
      // Capture chance based on attacker's charisma (commander).
      const acc = surviving.find((u) => u.side === 'attacker' && u.isCommander);
      const cmdCha = acc ? (officers[acc.officerId]?.stats.charisma ?? 60) : 60;
      if (Math.random() < cmdCha / 130) captured.push(id);
      else dead.push(id);
    }
  } else if (winner === 'defender') {
    for (const id of lostOfficers('attacker')) {
      const dc = surviving.find((u) => u.side === 'defender' && u.isCommander);
      const cmdCha = dc ? (officers[dc.officerId]?.stats.charisma ?? 60) : 60;
      if (Math.random() < cmdCha / 130) captured.push(id);
      else dead.push(id);
    }
  }

  // Loot: 10–25% of loser's troop value as gold-equivalent.
  const lootGold = winner
    ? Math.floor(
        ((winner === 'attacker' ? battle.defenderLosses : battle.attackerLosses) *
          (0.1 + Math.random() * 0.15)) /
          10,
      )
    : 0;

  return {
    winner,
    attackerSurvivors,
    defenderSurvivors,
    attackerDead: winner === 'attacker' ? [] : dead,
    defenderDead: winner === 'defender' ? [] : dead,
    capturedOfficerIds: captured,
    attackerLosses: battle.attackerLosses,
    defenderLosses: battle.defenderLosses,
    lootGold,
  };
}

export function aiTakeTurn(
  b: TacticalBattle,
  officers: Record<EntityId, Officer>,
  rng: () => number,
): TacticalBattle {
  let cur = b;
  let safety = 30;
  while (safety-- > 0) {
    const myUnits = cur.units.filter((u) => u.side === cur.activeSide && u.ap > 0);
    if (myUnits.length === 0) break;
    let acted = false;
    for (const unit of myUnits) {
      // Find nearest enemy.
      const enemies = cur.units.filter((u) => u.side !== unit.side);
      if (enemies.length === 0) break;
      enemies.sort(
        (a, b1) => hexDistance(unit.coord, a.coord) - hexDistance(unit.coord, b1.coord),
      );
      const target = enemies[0];
      const dist = hexDistance(unit.coord, target.coord);
      if (dist === 1) {
        cur = attackUnits(cur, unit.id, target.id, officers, rng);
        acted = true;
        break;
      }
      // Try to step closer along neighbours.
      const candidates = hexNeighbours(unit.coord)
        .filter((c) => canMove(cur, unit, c))
        .sort((a, b1) => hexDistance(a, target.coord) - hexDistance(b1, target.coord));
      if (candidates.length > 0) {
        cur = moveUnit(cur, unit.id, candidates[0]);
        acted = true;
        break;
      }
    }
    if (!acted) break;
  }
  return endTurn(cur);
}
