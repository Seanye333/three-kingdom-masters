import { useMemo, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../game/state/store';
import {
  DEFENSE_BUILDINGS,
  type DefenseBuildingId,
  aggregateSlotEffects,
} from '../../game/data/defenseBuildings';
import { previewBattlefield } from '../../game/systems/tactical';
import { citySize } from '../../game/systems/citySize';
import type { EntityId, BuildingId, TacticalTile, TerrainKind } from '../../game/types';
import { useLanguage } from '../i18n';

/**
 * 3D version of CityMapScreen — renders the same hex battlefield where
 * defense structures will land when the city is sieged, but in Three.js
 * with terrain heights, building meshes, walls, and orbit camera.
 */

const R = 1;
const COL_STEP = 1.5 * R;
const ROW_STEP = Math.sqrt(3) * R;
function hexWorld(col: number, row: number): [number, number] {
  const x = col * COL_STEP;
  const z = row * ROW_STEP + (col & 1 ? ROW_STEP / 2 : 0);
  return [x, z];
}

const TERRAIN_HEIGHT: Record<TerrainKind, number> = {
  river:    -0.08, road:  0.04, plain: 0.10, forest: 0.14, mountain: 0.20,
};
const TERRAIN_COLOR: Record<TerrainKind, string> = {
  river:    '#2c5882', road: '#7a6038', plain: '#4a5e30',
  forest:   '#2a4220', mountain: '#5a4838',
};

const INSIDE_BUILDING_DEF: Record<BuildingId, { glyph: string; color: string; height: number }> = {
  barracks: { glyph: '營', color: '#a87858', height: 0.9 },
  market:   { glyph: '市', color: '#d4a84a', height: 0.7 },
  foundry:  { glyph: '鐵', color: '#7a6750', height: 1.0 },
  academy:  { glyph: '書', color: '#88b7e8', height: 1.1 },
  temple:   { glyph: '寺', color: '#c19a3b', height: 1.2 },
  farm:     { glyph: '田', color: '#b8c87a', height: 0.4 },
  wall:     { glyph: '壁', color: '#5a4530', height: 0.6 },
  shipyard: { glyph: '渠', color: '#3a6a98', height: 0.7 },
};

/* ─── Single hex tile mesh ──────────────────────────────────────────── */
function HexTile3D({ tile, hovered, onHover, onClick, slotIndex, isWall }: {
  tile: TacticalTile;
  hovered: boolean;
  onHover: (hovering: boolean) => void;
  onClick: () => void;
  slotIndex: number | null;
  isWall: boolean;
}) {
  const [x, z] = hexWorld(tile.coord.col, tile.coord.row);
  const h = TERRAIN_HEIGHT[tile.terrain];
  const baseColor = TERRAIN_COLOR[tile.terrain];
  const color = hovered ? '#d4a84a' : isWall ? '#3a2818' : slotIndex !== null ? '#b8a070' : baseColor;
  return (
    <group position={[x, 0, z]}>
      <mesh
        position={[0, h / 2, 0]}
        rotation={[0, Math.PI / 6, 0]}
        onPointerOver={(e) => { e.stopPropagation(); onHover(true); }}
        onPointerOut={(e) => { e.stopPropagation(); onHover(false); }}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <cylinderGeometry args={[R, R, Math.max(0.02, h), 6]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* Outline ring on top */}
      <mesh position={[0, h + 0.01, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 6]}>
        <ringGeometry args={[R * 0.95, R * 0.99, 6]} />
        <meshBasicMaterial
          color={hovered ? '#ffd060' : slotIndex !== null ? '#d4a84a' : '#1a1208'}
          transparent
          opacity={hovered ? 0.9 : slotIndex !== null ? 0.6 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ─── Defense structure visual (icon glyph on hex) ──────────────────── */
function DefenseStructureMesh({ coord, def, level }: {
  coord: { col: number; row: number };
  def: typeof DEFENSE_BUILDINGS[DefenseBuildingId];
  level: number;
}) {
  const [x, z] = hexWorld(coord.col, coord.row);
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    // gentle bob
    groupRef.current.position.y = 0.3 + Math.sin(clock.elapsedTime * 1.5 + x) * 0.04;
  });
  const heightByLevel = 0.5 + level * 0.25;
  return (
    <group ref={groupRef} position={[x, 0.3, z]}>
      {/* Base block */}
      <mesh>
        <boxGeometry args={[0.7, heightByLevel, 0.7]} />
        <meshStandardMaterial color={def.color} roughness={0.7} />
      </mesh>
      {/* Roof / cap */}
      <mesh position={[0, heightByLevel / 2 + 0.12, 0]}>
        <coneGeometry args={[0.55, 0.22, 4]} />
        <meshStandardMaterial color={def.color} roughness={0.7} />
      </mesh>
      {/* Floating glyph + level chips */}
      <Html center distanceFactor={8} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(20, 14, 8, 0.85)',
          border: `1px solid ${def.color}`,
          color: def.color,
          fontFamily: 'Songti SC, serif',
          fontSize: '14px',
          padding: '0.15rem 0.4rem',
          letterSpacing: '0.1rem',
          whiteSpace: 'nowrap',
          textShadow: '0 0 4px #000',
        }}>
          {def.name.zh} <span style={{ opacity: 0.7, fontSize: '11px' }}>lv{level}</span>
        </div>
      </Html>
    </group>
  );
}

/* ─── Inside-city building (taller block with glyph) ─────────────────── */
function InsideBuilding3D({ coord, buildingId, level }: {
  coord: { col: number; row: number };
  buildingId: BuildingId;
  level: number;
}) {
  const [x, z] = hexWorld(coord.col, coord.row);
  const def = INSIDE_BUILDING_DEF[buildingId];
  const h = def.height + level * 0.15;
  return (
    <group position={[x, h / 2, z]}>
      <mesh>
        <boxGeometry args={[0.85, h, 0.85]} />
        <meshStandardMaterial color={def.color} roughness={0.6} />
      </mesh>
      <mesh position={[0, h / 2 + 0.1, 0]}>
        <coneGeometry args={[0.65, 0.2, 4]} />
        <meshStandardMaterial color={def.color} roughness={0.6} />
      </mesh>
      <Html center distanceFactor={8} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
        <div style={{
          background: 'rgba(20, 14, 8, 0.8)',
          border: `1px solid ${def.color}`,
          color: def.color,
          fontFamily: 'Songti SC, serif',
          fontSize: '15px',
          padding: '0.1rem 0.3rem',
          letterSpacing: '0.1rem',
          whiteSpace: 'nowrap',
        }}>
          {def.glyph}{level}
        </div>
      </Html>
    </group>
  );
}

/* ─── City wall slab along the rightmost column ─────────────────────── */
function CityWall3D({ col, rowMax, color, wallTier }: {
  col: number; rowMax: number; color: string; wallTier: 1 | 2 | 3;
}) {
  const slabs: React.JSX.Element[] = [];
  const wallHeight = wallTier === 3 ? 1.4 : wallTier === 2 ? 1.0 : 0.7;
  for (let r = 0; r < rowMax; r++) {
    const [x, z] = hexWorld(col, r);
    slabs.push(
      <group key={r} position={[x + 0.5, wallHeight / 2, z]}>
        <mesh>
          <boxGeometry args={[0.4, wallHeight, ROW_STEP * 1.05]} />
          <meshStandardMaterial color="#3a2a1a" roughness={0.85} />
        </mesh>
        {/* Crenellations */}
        <mesh position={[0, wallHeight / 2 + 0.1, 0]}>
          <boxGeometry args={[0.4, 0.18, ROW_STEP * 1.05]} />
          <meshStandardMaterial color="#2a1f15" roughness={0.85} />
        </mesh>
      </group>
    );
  }
  // Banner above the wall midpoint
  const midRow = Math.floor(rowMax / 2);
  const [bx, bz] = hexWorld(col, midRow);
  slabs.push(
    <group key="banner" position={[bx + 0.5, wallHeight + 0.7, bz]}>
      <mesh>
        <cylinderGeometry args={[0.04, 0.04, 1.4, 6]} />
        <meshStandardMaterial color="#2a1f15" />
      </mesh>
      <mesh position={[0.3, 0.15, 0]}>
        <planeGeometry args={[0.6, 0.9]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
  return <>{slabs}</>;
}

/* ─── Tower range ring (gold circle on the ground) ──────────────────── */
function RangeRing3D({ coord, range, color }: {
  coord: { col: number; row: number };
  range: number;
  color: string;
}) {
  const [x, z] = hexWorld(coord.col, coord.row);
  // Range in hex distance → approximate world radius
  const radius = range * ROW_STEP * 0.95;
  return (
    <mesh position={[x, 0.18, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.05, radius, 48]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ─── The full 3D scene ─────────────────────────────────────────────── */
function CityScene({
  preview, slots, buildings, cityWallCol, wallTier, bannerColor,
  hovered, onHover, onClick, showOverlays,
}: {
  preview: ReturnType<typeof previewBattlefield>;
  slots: ReturnType<typeof useGameStore.getState>['cities'][string]['buildSlots'];
  buildings: Array<{ coord: { col: number; row: number }; buildingId: BuildingId; level: number }>;
  cityWallCol: number;
  wallTier: 1 | 2 | 3;
  bannerColor: string;
  hovered: { col: number; row: number } | null;
  onHover: (c: { col: number; row: number } | null) => void;
  onClick: (c: { col: number; row: number }) => void;
  showOverlays: boolean;
}) {
  const slotIndexAtHex = new Map<string, number>();
  preview.slotPositions.forEach((pos, idx) => slotIndexAtHex.set(`${pos.col},${pos.row}`, idx));

  // Compute tower range rings
  const towerRanges: Array<{ coord: { col: number; row: number }; range: number; color: string }> = [];
  for (const s of slots ?? []) {
    if (!s.buildingId) continue;
    const pos = preview.slotPositions[s.slot];
    if (!pos) continue;
    let range = 0; let color = '#d4a84a';
    switch (s.buildingId) {
      case 'watchtower':     range = 4; color = '#d4a84a'; break;
      case 'arrow-platform': range = 5; color = '#c19a3b'; break;
      case 'rockfall':       range = 1; color = '#4a3a30'; break;
      case 'caltrops':       range = 1; color = '#7a6750'; break;
      case 'iron-chains':    range = 1; color = '#3a6a98'; break;
    }
    if (range > 0) towerRanges.push({ coord: pos, range, color });
  }

  return (
    <>
      {/* Ground + sky */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[12, 18, 8]} intensity={1.1} color="#fff5e0" castShadow />
      <directionalLight position={[-8, 6, -6]} intensity={0.3} color="#a0c0ff" />
      <fog attach="fog" args={['#b0a080', 28, 70]} />

      {/* Terrain tiles */}
      {preview.tiles.map((tile) => {
        const slotIdx = slotIndexAtHex.get(`${tile.coord.col},${tile.coord.row}`) ?? null;
        const isWall = tile.coord.col === cityWallCol;
        const isHovered = !!hovered && hovered.col === tile.coord.col && hovered.row === tile.coord.row;
        return (
          <HexTile3D
            key={`${tile.coord.col},${tile.coord.row}`}
            tile={tile}
            hovered={isHovered}
            slotIndex={slotIdx}
            isWall={isWall}
            onHover={(h) => onHover(h ? tile.coord : null)}
            onClick={() => onClick(tile.coord)}
          />
        );
      })}

      {/* City walls along rightmost column */}
      <CityWall3D col={cityWallCol} rowMax={preview.height} color={bannerColor} wallTier={wallTier} />

      {/* Inside buildings */}
      {buildings.map((b) => (
        <InsideBuilding3D
          key={`${b.coord.col},${b.coord.row}`}
          coord={b.coord}
          buildingId={b.buildingId}
          level={b.level}
        />
      ))}

      {/* Defense structures on slots */}
      {(slots ?? []).map((s) => {
        if (!s.buildingId) return null;
        const pos = preview.slotPositions[s.slot];
        if (!pos) return null;
        return (
          <DefenseStructureMesh
            key={s.slot}
            coord={pos}
            def={DEFENSE_BUILDINGS[s.buildingId]}
            level={s.level}
          />
        );
      })}

      {/* Range rings */}
      {showOverlays && towerRanges.map((tr, i) => (
        <RangeRing3D key={i} coord={tr.coord} range={tr.range} color={tr.color} />
      ))}
    </>
  );
}

/* ─── Top-level screen ──────────────────────────────────────────────── */
export function CityMapScreen3D({ cityId, onClose, onSwitch2D }: {
  cityId: EntityId;
  onClose: () => void;
  onSwitch2D: () => void;
}) {
  const city = useGameStore((s) => s.cities[cityId]);
  const playerForceId = useGameStore((s) => s.playerForceId);
  const forces = useGameStore((s) => s.forces);
  const allBuildings = useGameStore((s) => s.buildings);
  const buildAction = useGameStore((s) => s.buildDefenseStructure);
  const upgradeAction = useGameStore((s) => s.upgradeDefenseStructure);
  const demolishAction = useGameStore((s) => s.demolishDefenseStructure);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [hovered, setHovered] = useState<{ col: number; row: number } | null>(null);
  const [showOverlays, setShowOverlays] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lang = useLanguage();

  const preview = useMemo(
    () => previewBattlefield(cityId, {
      terrain: city?.terrain, port: city?.port,
      x: city?.coords.x, y: city?.coords.y,
    }),
    [cityId, city?.terrain, city?.port, city?.coords.x, city?.coords.y],
  );

  if (!city) return null;
  const isPlayer = city.ownerForceId === playerForceId;
  const slots = city.buildSlots ?? [];
  const size = citySize(city);
  const total = aggregateSlotEffects(slots);
  const builtCount = slots.filter((s) => s.buildingId).length;
  const cityWallCol = preview.width - 1;
  const ownerForce = city.ownerForceId ? forces[city.ownerForceId] : null;
  const bannerColor = ownerForce?.color ?? '#5a4530';

  // Inside-city buildings (placed on the wall column rows)
  const cityBuildings = useMemo(
    () => allBuildings.filter((b) => b.cityId === cityId && b.level > 0),
    [allBuildings, cityId],
  );
  const insideBuildings: Array<{ coord: { col: number; row: number }; buildingId: BuildingId; level: number }> = useMemo(() => {
    const occupiedRows = new Set(
      preview.slotPositions.filter((p) => p.col === cityWallCol).map((p) => p.row),
    );
    const freeRows: number[] = [];
    for (let r = 0; r < preview.height; r++) if (!occupiedRows.has(r)) freeRows.push(r);
    return cityBuildings.map((b, i) => ({
      coord: { col: cityWallCol, row: freeRows[i] ?? 0 },
      buildingId: b.id, level: b.level,
    })).filter((b) => b.coord.row !== undefined);
  }, [cityBuildings, preview, cityWallCol]);

  // Map slot coord → index for click handling
  const slotIndexAtHex = useMemo(() => {
    const m = new Map<string, number>();
    preview.slotPositions.forEach((p, i) => m.set(`${p.col},${p.row}`, i));
    return m;
  }, [preview]);

  const handleTileClick = (coord: { col: number; row: number }) => {
    if (!isPlayer) return;
    const slotIdx = slotIndexAtHex.get(`${coord.col},${coord.row}`);
    if (slotIdx === undefined) {
      setSelectedSlot(null);
      return;
    }
    setSelectedSlot(slotIdx);
    setError(null);
  };

  const tryBuild = (slot: number, id: DefenseBuildingId) => {
    setError(null);
    const r = buildAction(cityId, slot, id);
    if (!r.ok) setError(r.reason ?? 'Failed');
    else setSelectedSlot(null);
  };
  const tryUpgrade = (slot: number) => {
    setError(null);
    const r = upgradeAction(cityId, slot);
    if (!r.ok) setError(r.reason ?? 'Failed');
  };
  const tryDemolish = (slot: number) => {
    demolishAction(cityId, slot);
    setSelectedSlot(null);
  };

  // Center the camera on the map
  const centerX = (preview.width * COL_STEP) / 2;
  const centerZ = (preview.height * ROW_STEP) / 2;

  const ALL_BUILDINGS: DefenseBuildingId[] = [
    'watchtower', 'beacon', 'caltrops', 'lookout',
    'barracks-out', 'granary-out',
    'iron-chains', 'rockfall', 'arrow-platform',
  ];

  const wallTier = (city.wallTier ?? 1) as 1 | 2 | 3;
  const currentSlot = selectedSlot !== null ? slots.find((s) => s.slot === selectedSlot) : null;

  // ESC closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#0a0805', zIndex: 320,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header bar */}
      <header style={{
        padding: '0.6rem 1rem',
        background: 'linear-gradient(180deg, #1f1610 0%, rgba(31,22,16,0.85) 100%)',
        borderBottom: '1px solid #4a3520',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 10,
      }}>
        <div style={{ color: '#d4a84a', fontFamily: 'Songti SC, serif', letterSpacing: '0.3rem' }}>
          <span style={{ fontSize: '1.3rem' }}>{city.name.zh}</span>
          <span style={{ fontSize: '0.85rem', color: size.color, marginLeft: '0.6rem' }}>{size.name.zh}</span>
          <span style={{ fontSize: '0.7rem', color: '#8a7050', marginLeft: '0.8rem' }}>
            {builtCount}/8 防禦
            {total.defenseBonus > 0 && ` · +${total.defenseBonus} 守備`}
            {total.rangedPrestrike > 0 && ` · 預射 ${total.rangedPrestrike}`}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            style={{
              background: showOverlays ? 'rgba(212, 168, 74, 0.2)' : 'transparent',
              border: '1px solid #5a4530',
              color: showOverlays ? '#d4a84a' : '#8a7050',
              padding: '0.3rem 0.6rem',
              fontFamily: 'Songti SC, serif', fontSize: '0.7rem', cursor: 'pointer',
              letterSpacing: '0.1rem',
            }}
          >
            {showOverlays ? '✓' : ''} 戰術疊加
          </button>
          <button
            onClick={onSwitch2D}
            style={{
              background: '#1a3a5a', color: '#88b7e8',
              border: '1px solid #88b7e8', padding: '0.3rem 0.7rem',
              cursor: 'pointer', fontFamily: 'Songti SC, serif', fontSize: '0.7rem',
              letterSpacing: '0.1rem',
            }}
          >
            ⇄ 切換 2D
          </button>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', color: '#d4a84a',
            fontSize: '1.5rem', cursor: 'pointer', padding: '0 0.5rem',
          }}>×</button>
        </div>
      </header>

      {/* 3D canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas
          camera={{ position: [centerX, 14, centerZ + 14], fov: 50 }}
          shadows
          style={{ background: 'linear-gradient(180deg, #1a2440 0%, #5a8acf 100%)' }}
        >
          <CityScene
            preview={preview}
            slots={slots}
            buildings={insideBuildings}
            cityWallCol={cityWallCol}
            wallTier={wallTier}
            bannerColor={bannerColor}
            hovered={hovered}
            onHover={setHovered}
            onClick={handleTileClick}
            showOverlays={showOverlays}
          />
          <OrbitControls
            target={[centerX, 0, centerZ]}
            enablePan
            maxPolarAngle={Math.PI / 2.2}
            minDistance={6}
            maxDistance={40}
          />
        </Canvas>

        {/* Slot editor overlay */}
        {selectedSlot !== null && isPlayer && (
          <div
            style={{
              position: 'absolute', right: 12, top: 12, width: 320,
              background: 'rgba(20, 14, 8, 0.95)',
              border: '1px solid #d4a84a',
              padding: '0.8rem',
              color: '#c0a878',
              fontFamily: 'Songti SC, serif',
              fontSize: '0.78rem',
              maxHeight: 'calc(100vh - 80px)',
              overflow: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <div style={{ color: '#d4a84a', letterSpacing: '0.2rem' }}>
                {lang === 'en' ? `Slot ${selectedSlot + 1}` : `第 ${selectedSlot + 1} 號位`}
              </div>
              <button onClick={() => setSelectedSlot(null)} style={{
                background: 'transparent', border: 'none', color: '#8a7050', cursor: 'pointer',
              }}>×</button>
            </div>
            {currentSlot?.buildingId ? (
              <div>
                <div style={{ color: DEFENSE_BUILDINGS[currentSlot.buildingId].color, marginBottom: '0.3rem' }}>
                  {DEFENSE_BUILDINGS[currentSlot.buildingId].name.zh} lv{currentSlot.level}
                </div>
                <div style={{ color: '#8a7050', fontSize: '0.72rem', marginBottom: '0.5rem' }}>
                  {DEFENSE_BUILDINGS[currentSlot.buildingId].description}
                </div>
                {currentSlot.level < DEFENSE_BUILDINGS[currentSlot.buildingId].maxLevel && (
                  <button
                    onClick={() => tryUpgrade(selectedSlot)}
                    style={{
                      width: '100%', padding: '0.4rem',
                      background: '#1a3a5a', color: '#88b7e8',
                      border: '1px solid #88b7e8', marginBottom: '0.3rem',
                      fontFamily: 'inherit', cursor: 'pointer',
                    }}
                  >
                    升級 → lv{currentSlot.level + 1}
                  </button>
                )}
                <button
                  onClick={() => tryDemolish(selectedSlot)}
                  style={{
                    width: '100%', padding: '0.4rem',
                    background: '#3a1a1a', color: '#b8442e',
                    border: '1px solid #b8442e',
                    fontFamily: 'inherit', cursor: 'pointer',
                  }}
                >
                  拆除
                </button>
              </div>
            ) : (
              <div>
                <div style={{ color: '#8a7050', marginBottom: '0.4rem' }}>選擇建築:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  {ALL_BUILDINGS.map((id) => {
                    const def = DEFENSE_BUILDINGS[id];
                    return (
                      <button
                        key={id}
                        onClick={() => tryBuild(selectedSlot, id)}
                        title={def.description}
                        style={{
                          padding: '0.35rem 0.5rem',
                          background: 'rgba(212, 168, 74, 0.08)',
                          border: `1px solid ${def.color}`,
                          color: def.color,
                          fontFamily: 'inherit', fontSize: '0.75rem',
                          cursor: 'pointer', textAlign: 'left',
                        }}
                      >
                        {def.name.zh} <span style={{ float: 'right', opacity: 0.7 }}>{def.goldCost}g</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {error && (
              <div style={{ color: '#b8442e', marginTop: '0.4rem', fontSize: '0.72rem' }}>{error}</div>
            )}
          </div>
        )}

        {/* Hint when nothing selected */}
        {!selectedSlot && isPlayer && (
          <div style={{
            position: 'absolute', bottom: 14, left: 14,
            background: 'rgba(20, 14, 8, 0.8)',
            border: '1px solid #5a4530',
            padding: '0.3rem 0.6rem',
            color: '#8a7050', fontFamily: 'Songti SC, serif',
            fontSize: '0.7rem', letterSpacing: '0.15rem',
          }}>
            點擊地圖上的金色八角位 → 建造城外防禦
          </div>
        )}
      </div>
    </div>
  );
}
