import { useState } from 'react';
import { useGameStore } from '../../game/state/store';
import {
  DEFENSE_BUILDINGS,
  SLOT_POSITIONS,
  type DefenseBuildingId,
  type BuildSlotPosition,
  aggregateSlotEffects,
} from '../../game/data/defenseBuildings';
import { citySize } from '../../game/systems/citySize';
import type { City, EntityId } from '../../game/types';

/**
 * Fullscreen modal — top-down view of a city with 8 outer-perimeter
 * slots where the player can build defensive structures.
 *
 * Layout (centered city walls; slots arranged in a compass-rose pattern):
 *
 *           [N]
 *      [NW]      [NE]
 *    [W]   ┌──────┐   [E]
 *          │ CITY │
 *    [SW]  │ WALL │   [SE]
 *          └──────┘
 *      [SW]      [SE]
 *           [S]
 */
export function CityMapScreen({ cityId, onClose }: { cityId: EntityId; onClose: () => void }) {
  const city = useGameStore((s) => s.cities[cityId]);
  const playerForceId = useGameStore((s) => s.playerForceId);
  const buildAction = useGameStore((s) => s.buildDefenseStructure);
  const upgradeAction = useGameStore((s) => s.upgradeDefenseStructure);
  const demolishAction = useGameStore((s) => s.demolishDefenseStructure);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  if (!city) return null;
  const isPlayer = city.ownerForceId === playerForceId;
  const slots = city.buildSlots ?? [];
  const slotMap = new Map(slots.map((s) => [s.slot, s]));
  const size = citySize(city);

  // Slot screen positions (CSS percent within a 600x600 area).
  const SLOT_COORDS: Record<BuildSlotPosition, { left: string; top: string }> = {
    N:  { left: '50%', top: '10%' },
    NE: { left: '78%', top: '22%' },
    E:  { left: '88%', top: '50%' },
    SE: { left: '78%', top: '78%' },
    S:  { left: '50%', top: '90%' },
    SW: { left: '22%', top: '78%' },
    W:  { left: '12%', top: '50%' },
    NW: { left: '22%', top: '22%' },
  };

  const total = aggregateSlotEffects(slots);
  const builtCount = slots.filter((s) => s.buildingId).length;

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

  // List of all building IDs the player can attempt (filter by terrain done at build time).
  const ALL_BUILDINGS: DefenseBuildingId[] = [
    'watchtower', 'beacon', 'caltrops', 'lookout',
    'barracks-out', 'granary-out',
    'iron-chains', 'rockfall', 'arrow-platform',
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.85)',
        zIndex: 320, display: 'grid', placeItems: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--tkm-bg-modal, #1f1610)',
          border: '1px solid var(--tkm-text-h2, #d4a84a)',
          width: 'min(1100px, 96vw)',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          color: 'var(--tkm-text-body, #c9b89a)',
          fontFamily: 'var(--tkm-font-body)',
        }}
      >
        {/* Header */}
        <header style={{
          padding: '0.9rem 1.2rem',
          borderBottom: '1px solid var(--tkm-border-soft)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--tkm-font-zh)',
              fontSize: '1.5rem',
              color: 'var(--tkm-text-h2)',
              letterSpacing: '0.35rem',
            }}>
              {city.name.zh} 城邑 — <span style={{ color: size.color }}>{size.name.zh}</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--tkm-text-muted)', letterSpacing: '0.1rem' }}>
              {city.name.en} City Map · {builtCount}/8 slots built · Defense bonus +{total.defenseBonus}
              {total.rangedPrestrike > 0 && ` · 預射 ${total.rangedPrestrike}`}
              {total.extraGarrison > 0 && ` · 駐軍 +${total.extraGarrison}`}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', color: 'var(--tkm-text-h2)',
            fontSize: '1.5rem', cursor: 'pointer', padding: '0 0.5rem',
          }}>×</button>
        </header>

        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          {/* Map view */}
          <div style={{
            flex: '1.3', position: 'relative',
            minHeight: 500,
            padding: '1rem',
            background:
              'radial-gradient(circle at 50% 50%, rgba(80, 65, 45, 0.15) 0%, transparent 70%), ' +
              'linear-gradient(180deg, #1a1408 0%, #0a0805 100%)',
          }}>
            <div style={{
              position: 'absolute', inset: '8% 8% 8% 8%',
            }}>
              {/* City wall in center */}
              <div style={{
                position: 'absolute',
                left: '38%', top: '38%',
                width: '24%', height: '24%',
                background: 'linear-gradient(160deg, #5a4530, #3a2818)',
                border: '3px solid #d4a84a',
                borderRadius: 4,
                display: 'grid', placeItems: 'center',
                fontFamily: 'var(--tkm-font-zh)',
                fontSize: '1.8rem',
                color: '#f0e0b0',
                letterSpacing: '0.2rem',
                boxShadow: '0 0 24px rgba(212, 168, 74, 0.3)',
              }}>
                {city.name.zh}
              </div>

              {/* Wall tier indicator */}
              <div style={{
                position: 'absolute',
                left: '50%', top: 'calc(50% + 4.5%)',
                transform: 'translateX(-50%)',
                fontSize: '0.7rem', color: '#8a7050',
                letterSpacing: '0.15rem',
              }}>
                城壁 Tier {city.wallTier ?? 1}
              </div>

              {/* 8 build slots */}
              {SLOT_POSITIONS.map((pos, idx) => {
                const coords = SLOT_COORDS[pos];
                const current = slotMap.get(idx);
                const def = current?.buildingId ? DEFENSE_BUILDINGS[current.buildingId] : null;
                const isSel = selectedSlot === idx;
                return (
                  <div
                    key={pos}
                    onClick={() => isPlayer && setSelectedSlot(isSel ? null : idx)}
                    style={{
                      position: 'absolute',
                      left: coords.left, top: coords.top,
                      transform: 'translate(-50%, -50%)',
                      width: 80, height: 80,
                      borderRadius: '50%',
                      background: def
                        ? `radial-gradient(circle, ${def.color} 0%, ${def.color}66 100%)`
                        : 'rgba(58, 45, 32, 0.4)',
                      border: `2px ${def ? 'solid' : 'dashed'} ${isSel ? '#f0e0b0' : def ? def.color : '#5a4530'}`,
                      cursor: isPlayer ? 'pointer' : 'default',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                      boxShadow: isSel ? '0 0 16px #d4a84a' : def ? '0 0 8px rgba(0,0,0,0.5)' : 'none',
                    }}
                  >
                    {def ? (
                      <>
                        <div style={{
                          fontFamily: 'var(--tkm-font-zh)',
                          fontSize: '0.85rem',
                          color: '#fff',
                          textShadow: '0 0 4px rgba(0,0,0,0.9)',
                          letterSpacing: '0.05rem',
                        }}>
                          {def.name.zh}
                        </div>
                        <div style={{
                          fontSize: '0.6rem',
                          color: '#f0e0b0',
                          letterSpacing: '0.05rem',
                          marginTop: 2,
                        }}>
                          Lv {current!.level}/{def.maxLevel}
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{
                          fontSize: '1.2rem',
                          color: isSel ? '#d4a84a' : '#5a4530',
                        }}>+</div>
                        <div style={{
                          fontSize: '0.55rem',
                          color: isSel ? '#d4a84a' : '#5a4530',
                          letterSpacing: '0.1rem',
                        }}>{pos}</div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: build picker */}
          <div style={{
            flex: '0.7', minWidth: 280, padding: '0.8rem 1rem',
            borderLeft: '1px solid var(--tkm-border-soft)',
            overflowY: 'auto', display: 'flex', flexDirection: 'column',
          }}>
            {!isPlayer ? (
              <div style={{ color: 'var(--tkm-text-muted)', fontSize: '0.85rem', padding: '1rem' }}>
                此城非汝所領。Click your own city to build defenses.
              </div>
            ) : selectedSlot === null ? (
              <div style={{ color: 'var(--tkm-text-muted)', fontSize: '0.8rem' }}>
                <div style={{
                  fontSize: '0.7rem', letterSpacing: '0.2rem',
                  color: 'var(--tkm-text-h2)', marginBottom: '0.5rem',
                }}>★ 選擇建築位</div>
                <p>點選地圖上的 8 個建築位（N/E/S/W/NE/NW/SE/SW）來建造或升級防禦工事。</p>
                <p style={{ marginTop: '0.5rem' }}>當此城被圍攻時，所有建築的效果自動疊加到城防：</p>
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem', lineHeight: 1.6 }}>
                  <li>箭樓 → 預射傷害 + 守備</li>
                  <li>烽火台 → 攻方失奇襲</li>
                  <li>拒馬 → 騎兵減速減傷</li>
                  <li>鐵索 → 水師防禦（臨水）</li>
                  <li>落石 / 箭台 → 山地范围杀伤（山地）</li>
                </ul>
                {total.defenseBonus > 0 && (
                  <div style={{
                    marginTop: '0.8rem',
                    padding: '0.4rem 0.6rem',
                    background: 'rgba(212, 168, 74, 0.1)',
                    border: '1px solid rgba(212, 168, 74, 0.3)',
                    fontSize: '0.7rem',
                  }}>
                    現累積：+{total.defenseBonus} 守備
                    {total.rangedPrestrike > 0 && ` · ${total.rangedPrestrike} 預射`}
                    {total.cavalryPenalty > 0 && ` · 騎兵減速 ${Math.round(total.cavalryPenalty * 100)}%`}
                    {total.attackerDamageMul < 1 && ` · 攻方傷害 ×${total.attackerDamageMul.toFixed(2)}`}
                  </div>
                )}
              </div>
            ) : (
              <SlotEditor
                city={city}
                slot={selectedSlot}
                current={slotMap.get(selectedSlot)}
                onBuild={(id) => tryBuild(selectedSlot, id)}
                onUpgrade={() => tryUpgrade(selectedSlot)}
                onDemolish={() => { demolishAction(cityId, selectedSlot); setSelectedSlot(null); }}
                allBuildings={ALL_BUILDINGS}
              />
            )}
            {error && (
              <div style={{
                marginTop: '0.5rem',
                padding: '0.3rem 0.5rem',
                background: 'rgba(184, 68, 46, 0.15)',
                border: '1px solid #b8442e',
                color: '#ffb494',
                fontSize: '0.72rem',
              }}>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SlotEditor({
  city, slot, current, onBuild, onUpgrade, onDemolish, allBuildings,
}: {
  city: City;
  slot: number;
  current?: { buildingId?: DefenseBuildingId; level: number };
  onBuild: (id: DefenseBuildingId) => void;
  onUpgrade: () => void;
  onDemolish: () => void;
  allBuildings: DefenseBuildingId[];
}) {
  const cur = current?.buildingId ? DEFENSE_BUILDINGS[current.buildingId] : null;
  if (cur && current) {
    const eff = cur.effect(current.level);
    const nextLevel = current.level + 1;
    const canUpgrade = nextLevel <= cur.maxLevel;
    const upgradeCost = cur.goldCost * nextLevel;
    return (
      <div>
        <div style={{
          fontSize: '0.7rem', color: 'var(--tkm-text-h2)',
          letterSpacing: '0.2rem', marginBottom: '0.4rem',
        }}>★ {SLOT_POSITIONS[slot]} 位 · Slot {slot}</div>
        <div style={{
          padding: '0.6rem 0.8rem',
          background: `linear-gradient(135deg, ${cur.color}33, transparent)`,
          border: `1px solid ${cur.color}`,
          marginBottom: '0.6rem',
        }}>
          <div style={{
            fontFamily: 'var(--tkm-font-zh)',
            fontSize: '1.1rem', color: cur.color,
            letterSpacing: '0.2rem',
          }}>
            {cur.name.zh} Lv {current.level}/{cur.maxLevel}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--tkm-text-muted)', marginTop: 4 }}>
            {cur.description}
          </div>
          <div style={{
            marginTop: '0.5rem', fontSize: '0.7rem',
            color: 'var(--tkm-text-h1)', display: 'flex', flexWrap: 'wrap', gap: '0.3rem',
          }}>
            {eff.defenseBonus > 0 && <Chip>守備 +{eff.defenseBonus}</Chip>}
            {eff.rangedPrestrike > 0 && <Chip>預射 {eff.rangedPrestrike}</Chip>}
            {eff.attackerDamageMul < 1 && <Chip>攻方傷害 ×{eff.attackerDamageMul.toFixed(2)}</Chip>}
            {eff.cavalryPenalty > 0 && <Chip>騎兵 −{Math.round(eff.cavalryPenalty * 100)}%</Chip>}
            {eff.extraGarrison > 0 && <Chip>駐軍 +{eff.extraGarrison}</Chip>}
            {eff.extraFood > 0 && <Chip>糧 +{eff.extraFood}</Chip>}
            {eff.navalDefense > 0 && <Chip>水軍守 +{eff.navalDefense}</Chip>}
            {eff.mountainBonus > 0 && <Chip>山戰 +{Math.round(eff.mountainBonus * 100)}%</Chip>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            onClick={onUpgrade}
            disabled={!canUpgrade || city.gold < upgradeCost}
            style={{
              flex: 1,
              background: 'linear-gradient(180deg, #5a4530, #3a2d20)',
              border: '1px solid #d4a84a',
              color: canUpgrade && city.gold >= upgradeCost ? '#d4a84a' : '#5a4530',
              padding: '0.4rem 0.6rem',
              fontFamily: 'inherit', fontSize: '0.78rem',
              cursor: canUpgrade && city.gold >= upgradeCost ? 'pointer' : 'not-allowed',
            }}
          >
            升級 → Lv {nextLevel} ({upgradeCost}g)
          </button>
          <button
            onClick={onDemolish}
            style={{
              background: 'transparent', border: '1px solid #5a4530',
              color: '#b8442e', padding: '0.4rem 0.6rem',
              fontFamily: 'inherit', fontSize: '0.78rem', cursor: 'pointer',
            }}
          >
            拆除
          </button>
        </div>
      </div>
    );
  }

  // Empty slot — show available buildings
  return (
    <div>
      <div style={{
        fontSize: '0.7rem', color: 'var(--tkm-text-h2)',
        letterSpacing: '0.2rem', marginBottom: '0.4rem',
      }}>★ {SLOT_POSITIONS[slot]} 位 · Choose Structure</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {allBuildings.map((id) => {
          const def = DEFENSE_BUILDINGS[id];
          const needsRiver = def.requiresTerrain === 'river' && !city.port;
          const needsMountain = def.requiresTerrain === 'mountain' && city.terrain !== 'mountain';
          const locked = needsRiver || needsMountain;
          const lockReason = needsRiver ? '需臨水/港口' : needsMountain ? '需山地' : null;
          const canAfford = city.gold >= def.goldCost;
          return (
            <button
              key={id}
              onClick={() => !locked && canAfford && onBuild(id)}
              disabled={locked || !canAfford}
              style={{
                background: locked ? '#1a1410' : `linear-gradient(135deg, ${def.color}33, #1a1410)`,
                border: `1px solid ${locked ? '#3a2818' : def.color}`,
                color: locked ? '#5a4530' : 'var(--tkm-text-h1)',
                padding: '0.5rem 0.65rem',
                fontFamily: 'inherit', fontSize: '0.75rem',
                cursor: locked || !canAfford ? 'not-allowed' : 'pointer',
                opacity: locked ? 0.5 : canAfford ? 1 : 0.6,
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{
                  fontFamily: 'var(--tkm-font-zh)',
                  color: locked ? '#5a4530' : def.color,
                  letterSpacing: '0.1rem',
                }}>
                  {def.name.zh} <span style={{ fontSize: '0.6rem', color: '#8a7050' }}>{def.name.en}</span>
                </span>
                <span style={{ fontSize: '0.65rem', color: '#c0a878' }}>
                  {def.goldCost}g {lockReason && <span style={{ color: '#b8442e' }}> · {lockReason}</span>}
                </span>
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--tkm-text-muted)', marginTop: 2 }}>
                {def.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      padding: '0.12rem 0.4rem',
      background: 'rgba(212, 168, 74, 0.15)',
      border: '1px solid rgba(212, 168, 74, 0.4)',
      color: '#d4a84a',
      borderRadius: 2,
      fontSize: '0.65rem',
    }}>
      {children}
    </span>
  );
}
