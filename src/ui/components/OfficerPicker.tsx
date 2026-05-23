import { useMemo } from 'react';
import { useGameStore } from '../../game/state/store';
import { COMMAND_DEFS } from '../../game/systems/commands';
import type { EntityId, InternalAffairsType } from '../../game/types';
import { OfficerHoverCard } from './OfficerHoverCard';
import styles from './OfficerPicker.module.css';

interface Props {
  cityId: EntityId;
  commandType: InternalAffairsType;
  onClose: () => void;
}

export function OfficerPicker({ cityId, commandType, onClose }: Props) {
  const def = COMMAND_DEFS[commandType];
  const issueCommand = useGameStore((s) => s.issueCommand);
  const city = useGameStore((s) => s.cities[cityId]);
  const officersMap = useGameStore((s) => s.officers);
  const officers = useMemo(
    () =>
      Object.values(officersMap)
        .filter(
          (o) =>
            o.locationCityId === cityId &&
            o.forceId === city?.ownerForceId &&
            o.status === 'idle' &&
            !o.task,
        )
        .sort((a, b) => b.stats[def.stat] - a.stats[def.stat]),
    [officersMap, cityId, city?.ownerForceId, def.stat],
  );

  const handlePick = (officerId: EntityId) => {
    const result = issueCommand(cityId, commandType, officerId);
    if (result.ok) onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div>
            <div className={styles.titleZh}>{def.label.zh}</div>
            <div className={styles.titleEn}>{def.label.en}</div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </header>

        <div className={styles.meta}>
          <span>
            Cost: <strong>{def.goldCost} gold</strong>
          </span>
          <span>
            Stat used: <strong>{def.stat}</strong>
          </span>
        </div>

        <p className={styles.desc}>{def.description}</p>

        <h3 className={styles.sectionTitle}>Select officer</h3>
        {officers.length === 0 ? (
          <div className={styles.empty}>
            No available officers in this city.
          </div>
        ) : (
          <ul className={styles.officerList}>
            {officers.map((o) => (
              <li key={o.id}>
                <OfficerHoverCard officer={o}>
                  <button
                    className={styles.officerButton}
                    onClick={() => handlePick(o.id)}
                  >
                    <span className={styles.officerNameZh}>{o.name.zh}</span>
                    <span className={styles.officerNameEn}>{o.name.en}</span>
                    <span className={styles.officerStat}>
                      {def.stat.toUpperCase().slice(0, 3)}{' '}
                      <strong>{o.stats[def.stat]}</strong>
                    </span>
                  </button>
                </OfficerHoverCard>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
