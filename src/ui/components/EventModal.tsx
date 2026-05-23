import { useGameStore } from '../../game/state/store';
import { SEASON_LABEL } from '../../game/types';
import styles from './EventModal.module.css';

export function EventModal() {
  const pending = useGameStore((s) => s.pendingEvent);
  const dismiss = useGameStore((s) => s.dismissEvent);
  if (!pending) return null;
  const { event, year, season } = pending;
  const seasonLabel = SEASON_LABEL[season];
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.scrollDecoration} />
        <div className={styles.eyebrow}>Historical Event · 史実</div>
        <div className={styles.titleZh}>{event.name.zh}</div>
        <div className={styles.titleEn}>{event.name.en}</div>
        <div className={styles.dateLine}>
          {year} AD · {seasonLabel.zh} {seasonLabel.en}
        </div>
        <hr className={styles.divider} />
        <p className={styles.description}>{event.description}</p>
        <div className={styles.actions}>
          <button className={styles.ackButton} onClick={dismiss}>
            承知 Continue
          </button>
        </div>
      </div>
    </div>
  );
}
