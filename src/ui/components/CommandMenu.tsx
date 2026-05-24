import { useMemo, useState } from 'react';
import { useGameStore } from '../../game/state/store';
import { COMMAND_DEFS, meetsMinSize } from '../../game/systems/commands';
import { citySize, CITY_SIZES_BY_ID } from '../../game/systems/citySize';
import type { EntityId, InternalAffairsType } from '../../game/types';
import { MarchPicker } from './MarchPicker';
import { OfficerPicker } from './OfficerPicker';
import styles from './CommandMenu.module.css';

interface Props {
  cityId: EntityId;
  /** Open the city's outer-perimeter defense map. */
  onOpenCityMap?: () => void;
}

const INTERNAL_ORDER: InternalAffairsType[] = [
  // ── Basic (always available) ──
  'develop-agriculture',
  'develop-commerce',
  'build-defense',
  'recruit-troops',
  'improve-loyalty',
  'search',
  'encourage-migration',
  // ── Tier-2 (requires 城 tier+) ──
  'major-agriculture',
  'major-commerce',
  'major-defense',
  'upgrade-wall',
];

type ModalState =
  | { kind: 'closed' }
  | { kind: 'internal'; type: InternalAffairsType }
  | { kind: 'march' };

export function CommandMenu({ cityId, onOpenCityMap }: Props) {
  const [modal, setModal] = useState<ModalState>({ kind: 'closed' });
  const city = useGameStore((s) => s.cities[cityId]);
  // Select the map by reference (stable) — filter inside useMemo to avoid creating
  // a new array on every render (which would trigger an infinite re-render loop).
  const allPending = useGameStore((s) => s.pendingCommands);
  const pendingInCity = useMemo(
    () => Object.values(allPending).filter((c) => c.cityId === cityId),
    [allPending, cityId],
  );
  const officersMap = useGameStore((s) => s.officers);
  const citiesMap = useGameStore((s) => s.cities);
  const cancelCommand = useGameStore((s) => s.cancelCommand);

  if (!city) return null;

  const marchDef = COMMAND_DEFS['march'];
  const canMarch = city.gold >= marchDef.goldCost && city.troops > 0;

  return (
    <>
      {/* Currently pending commands in this city — one per assigned officer */}
      {pendingInCity.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.5rem' }}>
          {pendingInCity.map((cmd) => {
            const officer = officersMap[cmd.officerId];
            if (!officer) return null;
            const def = COMMAND_DEFS[cmd.type];
            const targetCity = cmd.type === 'march' ? citiesMap[cmd.targetCityId] : null;
            return (
              <div key={cmd.officerId} className={styles.activeCmd}>
                <div className={styles.activeRow}>
                  <div className={styles.activeText}>
                    <span className={styles.activeLabel}>
                      {def.label.zh} · {def.label.en}
                    </span>
                    <span className={styles.activeOfficer}>
                      by {officer.name.zh} {officer.name.en}
                      {cmd.type === 'march' && targetCity && (
                        <>
                          {' → '}
                          <strong>{targetCity.name.zh}</strong>
                          {' with '}
                          {cmd.troops.toLocaleString()} troops
                        </>
                      )}
                    </span>
                  </div>
                  <button
                    className={styles.cancelButton}
                    onClick={() => cancelCommand(cmd.officerId)}
                    title="Cancel command (refund gold)"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.menu}>
        {INTERNAL_ORDER.map((type) => {
          const def = COMMAND_DEFS[type];
          const canAfford = city.gold >= def.goldCost;
          const currentSize = citySize(city);
          const tierOk = meetsMinSize(currentSize.id, def.minSize);
          const minSizeDef = def.minSize ? CITY_SIZES_BY_ID[def.minSize] : null;
          const lockedReason = !tierOk && minSizeDef ? `Requires ${minSizeDef.name.zh}+ tier` : null;
          const reason = lockedReason ?? (!canAfford ? 'Not enough gold' : def.description);
          return (
            <button
              key={type}
              className={styles.cmdButton}
              onClick={() => setModal({ kind: 'internal', type })}
              disabled={!canAfford || !tierOk}
              title={reason}
              style={!tierOk ? { opacity: 0.45 } : undefined}
            >
              <span className={styles.cmdLabelZh}>
                {def.label.zh}
                {def.minSize && <span style={{ fontSize: '0.55rem', color: '#8a7050', marginLeft: 4 }}>★{minSizeDef?.name.zh}+</span>}
              </span>
              <span className={styles.cmdLabelEn}>{def.label.en}</span>
              <span className={styles.cmdCost}>{def.goldCost}g</span>
            </button>
          );
        })}
        <button
          className={`${styles.cmdButton} ${styles.marchButton}`}
          onClick={() => setModal({ kind: 'march' })}
          disabled={!canMarch}
          title={
            !canMarch
              ? city.troops === 0
                ? 'No troops to march'
                : 'Not enough gold'
              : marchDef.description
          }
        >
          <span className={styles.cmdLabelZh}>{marchDef.label.zh}</span>
          <span className={styles.cmdLabelEn}>{marchDef.label.en}</span>
          <span className={styles.cmdCost}>{marchDef.goldCost}g</span>
        </button>
        {onOpenCityMap && (
          <button
            className={styles.cmdButton}
            onClick={onOpenCityMap}
            title="Open city map — build outer defenses (箭樓 / 拒馬 / 鐵索 / 落石…)"
            style={{ borderColor: '#d4a84a' }}
          >
            <span className={styles.cmdLabelZh}>★ 城邑地圖</span>
            <span className={styles.cmdLabelEn}>City Map</span>
            <span className={styles.cmdCost}>open</span>
          </button>
        )}
      </div>

      {modal.kind === 'internal' && (
        <OfficerPicker
          cityId={cityId}
          commandType={modal.type}
          onClose={() => setModal({ kind: 'closed' })}
        />
      )}
      {modal.kind === 'march' && (
        <MarchPicker
          cityId={cityId}
          onClose={() => setModal({ kind: 'closed' })}
        />
      )}
    </>
  );
}
