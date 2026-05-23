import { useState } from 'react';
import { useGameStore } from '../../game/state/store';
import { SEASON_LABEL } from '../../game/types';
import type { HistoricBattle, Season } from '../../game/types';
import { BattleDetailModal } from './BattleDetailModal';
import styles from './BattleHistoryModal.module.css';

interface Props {
  onClose: () => void;
}

export function BattleHistoryModal({ onClose }: Props) {
  const battles = useGameStore((s) => s.battleHistory);
  const cities = useGameStore((s) => s.cities);
  const officers = useGameStore((s) => s.officers);
  const forces = useGameStore((s) => s.forces);
  const [selected, setSelected] = useState<HistoricBattle | null>(null);

  // Newest first
  const sorted = [...battles].reverse();

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div>
            <div className={styles.titleZh}>戰史</div>
            <div className={styles.titleEn}>
              Battle History — {battles.length} battle{battles.length === 1 ? '' : 's'} recorded
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </header>

        {sorted.length === 0 ? (
          <div className={styles.empty}>
            No battles yet. March on an enemy city to start the record.
          </div>
        ) : (
          <ul className={styles.list}>
            {sorted.map((b) => {
              const city = cities[b.cityId];
              const aForce = b.attacker.forceId ? forces[b.attacker.forceId] : null;
              const dForce = b.defender.forceId ? forces[b.defender.forceId] : null;
              const aCommander = officers[b.attacker.commanderId];
              const dCommander = officers[b.defender.commanderId];
              const season = SEASON_LABEL[b.date.season as Season];
              const outcome = b.cityFalls
                ? 'Conquest'
                : b.attackerWins
                  ? 'Field won'
                  : 'Repulsed';
              const outcomeClass = b.cityFalls
                ? styles.outcomeConquest
                : b.attackerWins
                  ? styles.outcomeWon
                  : styles.outcomeRepulsed;
              return (
                <li
                  key={b.id}
                  className={styles.row}
                  onClick={() => setSelected(b)}
                >
                  <span className={styles.dateCell}>
                    {b.date.year} {season.en.slice(0, 3)}
                  </span>
                  <span className={styles.cityCell}>
                    {city?.name.zh ?? b.cityId}
                  </span>
                  <span className={styles.sidesCell}>
                    <span className={styles.sideTag}>
                      {aForce && (
                        <span
                          className={styles.dot}
                          style={{ background: aForce.color }}
                        />
                      )}
                      {aCommander?.name.en ?? '?'}
                    </span>
                    <span className={styles.versus}>vs</span>
                    <span className={styles.sideTag}>
                      {dForce && (
                        <span
                          className={styles.dot}
                          style={{ background: dForce.color }}
                        />
                      )}
                      {dCommander?.name.en ?? '?'}
                    </span>
                  </span>
                  <span className={`${styles.outcomeCell} ${outcomeClass}`}>
                    {outcome}
                  </span>
                  <span className={styles.casualtiesCell}>
                    {b.attackerLosses.toLocaleString()} / {b.defenderLosses.toLocaleString()}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {selected && (
          <BattleDetailModal
            battle={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
}
