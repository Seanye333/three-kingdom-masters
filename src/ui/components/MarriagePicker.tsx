import { useMemo, useState } from 'react';
import { useGameStore } from '../../game/state/store';
import type { EntityId, Officer } from '../../game/types';
import styles from './MarriagePicker.module.css';

interface Props {
  targetForceId: EntityId;
  onClose: () => void;
}

const MARRIAGE_COST = 1000;

export function MarriagePicker({ targetForceId, onClose }: Props) {
  const playerForceId = useGameStore((s) => s.playerForceId);
  const forces = useGameStore((s) => s.forces);
  const officers = useGameStore((s) => s.officers);
  const cities = useGameStore((s) => s.cities);
  const proposeMarriage = useGameStore((s) => s.proposeMarriage);
  const playerCapitalGold = useGameStore((s) => {
    const f = playerForceId ? s.forces[playerForceId] : null;
    const c = f ? s.cities[f.capitalCityId] : null;
    return c?.gold ?? 0;
  });

  const [yourPick, setYourPick] = useState<EntityId | null>(null);
  const [theirPick, setTheirPick] = useState<EntityId | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  const yourOfficers = useMemo(
    () =>
      Object.values(officers)
        .filter((o) => o.forceId === playerForceId && o.status === 'idle')
        .sort((a, b) => b.stats.charisma - a.stats.charisma),
    [officers, playerForceId],
  );
  const theirOfficers = useMemo(
    () =>
      Object.values(officers)
        .filter((o) => o.forceId === targetForceId && o.status === 'idle')
        .sort((a, b) => b.stats.charisma - a.stats.charisma),
    [officers, targetForceId],
  );

  const playerForce = playerForceId ? forces[playerForceId] : null;
  const targetForce = forces[targetForceId];

  const handleSubmit = () => {
    if (!yourPick || !theirPick) return;
    const r = proposeMarriage(targetForceId, yourPick, theirPick);
    setFeedback({ ok: r.ok, text: r.message });
    if (r.ok) {
      setYourPick(null);
      setTheirPick(null);
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div>
            <div className={styles.titleZh}>婚姻外交</div>
            <div className={styles.titleEn}>
              Marriage Diplomacy with {targetForce?.name.en}
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </header>

        <div className={styles.meta}>
          Cost: <strong>{MARRIAGE_COST}g</strong> from capital · Your gold:{' '}
          <strong>{playerCapitalGold}g</strong>
        </div>

        <div className={styles.columns}>
          <Column
            label={`${playerForce?.name.zh ?? 'You'} 自軍`}
            color={playerForce?.color ?? '#5a4530'}
            officers={yourOfficers}
            cities={cities}
            picked={yourPick}
            onPick={setYourPick}
          />
          <div className={styles.linkIcon}>⚭</div>
          <Column
            label={`${targetForce?.name.zh ?? 'Target'} 相手軍`}
            color={targetForce?.color ?? '#5a4530'}
            officers={theirOfficers}
            cities={cities}
            picked={theirPick}
            onPick={setTheirPick}
          />
        </div>

        {feedback && (
          <div
            className={`${styles.feedback} ${feedback.ok ? styles.feedbackOk : styles.feedbackFail}`}
          >
            {feedback.text}
          </div>
        )}

        <footer className={styles.footer}>
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={
              !yourPick || !theirPick || playerCapitalGold < MARRIAGE_COST
            }
          >
            締結 Forge Marriage Bond
          </button>
        </footer>
      </div>
    </div>
  );
}

interface ColumnProps {
  label: string;
  color: string;
  officers: Officer[];
  cities: Record<EntityId, { name: { zh: string; en: string } }>;
  picked: EntityId | null;
  onPick: (id: EntityId) => void;
}

function Column({ label, color, officers, cities, picked, onPick }: ColumnProps) {
  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <span
          className={styles.colorDot}
          style={{ background: color }}
        />
        <span>{label}</span>
      </div>
      {officers.length === 0 ? (
        <div className={styles.empty}>No available officers.</div>
      ) : (
        <ul className={styles.officerList}>
          {officers.map((o) => {
            const city = o.locationCityId ? cities[o.locationCityId] : null;
            return (
              <li key={o.id}>
                <button
                  className={`${styles.officerButton} ${picked === o.id ? styles.officerSelected : ''}`}
                  onClick={() => onPick(o.id)}
                >
                  <span className={styles.officerNameZh}>{o.name.zh}</span>
                  <span className={styles.officerNameEn}>{o.name.en}</span>
                  <span className={styles.officerCha}>
                    CHA <strong>{o.stats.charisma}</strong>
                  </span>
                  {city && (
                    <span className={styles.officerCity}>{city.name.zh}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
