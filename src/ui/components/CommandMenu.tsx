import { useState } from 'react';
import { useGameStore } from '../../game/state/store';
import { COMMAND_DEFS } from '../../game/systems/commands';
import type { EntityId, InternalAffairsType } from '../../game/types';
import { MarchPicker } from './MarchPicker';
import { OfficerPicker } from './OfficerPicker';
import styles from './CommandMenu.module.css';

interface Props {
  cityId: EntityId;
}

const INTERNAL_ORDER: InternalAffairsType[] = [
  'develop-agriculture',
  'develop-commerce',
  'build-defense',
  'recruit-troops',
  'improve-loyalty',
  'search',
];

type ModalState =
  | { kind: 'closed' }
  | { kind: 'internal'; type: InternalAffairsType }
  | { kind: 'march' };

export function CommandMenu({ cityId }: Props) {
  const [modal, setModal] = useState<ModalState>({ kind: 'closed' });
  const city = useGameStore((s) => s.cities[cityId]);
  const pending = useGameStore((s) => s.pendingCommands[cityId]);
  const officer = useGameStore((s) =>
    pending ? s.officers[pending.officerId] : null,
  );
  const targetCity = useGameStore((s) =>
    pending && pending.type === 'march'
      ? s.cities[pending.targetCityId]
      : null,
  );
  const cancelCommand = useGameStore((s) => s.cancelCommand);

  if (!city) return null;

  if (pending && officer) {
    const def = COMMAND_DEFS[pending.type];
    return (
      <div className={styles.activeCmd}>
        <div className={styles.activeRow}>
          <div className={styles.activeText}>
            <span className={styles.activeLabel}>
              {def.label.zh} · {def.label.en}
            </span>
            <span className={styles.activeOfficer}>
              by {officer.name.zh} {officer.name.en}
              {pending.type === 'march' && targetCity && (
                <>
                  {' → '}
                  <strong>{targetCity.name.zh}</strong>
                  {' with '}
                  {pending.troops.toLocaleString()} troops
                </>
              )}
            </span>
          </div>
          <button
            className={styles.cancelButton}
            onClick={() => cancelCommand(cityId)}
            title="Cancel command (refund gold)"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  const marchDef = COMMAND_DEFS['march'];
  const canMarch = city.gold >= marchDef.goldCost && city.troops > 0;

  return (
    <>
      <div className={styles.menu}>
        {INTERNAL_ORDER.map((type) => {
          const def = COMMAND_DEFS[type];
          const canAfford = city.gold >= def.goldCost;
          return (
            <button
              key={type}
              className={styles.cmdButton}
              onClick={() => setModal({ kind: 'internal', type })}
              disabled={!canAfford}
              title={!canAfford ? 'Not enough gold' : def.description}
            >
              <span className={styles.cmdLabelZh}>{def.label.zh}</span>
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
