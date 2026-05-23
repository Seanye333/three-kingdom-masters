import { useGameStore } from '../../game/state/store';
import styles from './VictoryModal.module.css';

export function VictoryModal() {
  const victoryStatus = useGameStore((s) => s.victoryStatus);
  const date = useGameStore((s) => s.date);
  const playerForceId = useGameStore((s) => s.playerForceId);
  const playerForce = useGameStore((s) =>
    playerForceId ? s.forces[playerForceId] : null,
  );
  const acknowledge = useGameStore((s) => s.acknowledgeVictory);
  const reset = useGameStore((s) => s.reset);

  if (victoryStatus !== 'victory' && victoryStatus !== 'defeat') return null;
  const isVictory = victoryStatus === 'victory';

  return (
    <div className={styles.backdrop}>
      <div className={`${styles.modal} ${isVictory ? styles.victory : styles.defeat}`}>
        <div className={styles.banner}>
          {isVictory ? (
            <>
              <div className={styles.bannerZh}>天下統一</div>
              <div className={styles.bannerEn}>The Realm United</div>
            </>
          ) : (
            <>
              <div className={styles.bannerZh}>滅亡</div>
              <div className={styles.bannerEn}>Annihilation</div>
            </>
          )}
        </div>

        <p className={styles.body}>
          {isVictory ? (
            <>
              In the {date.season} of <strong>{date.year} AD</strong>, every city
              of the empire flies the banner of{' '}
              <strong style={{ color: playerForce?.color }}>
                {playerForce?.name.zh} {playerForce?.name.en}
              </strong>
              . The Three Kingdoms era ends — your name shall be written in the
              records of the Han successor.
            </>
          ) : (
            <>
              In the {date.season} of <strong>{date.year} AD</strong>, the last
              city of{' '}
              <strong style={{ color: playerForce?.color }}>
                {playerForce?.name.zh} {playerForce?.name.en}
              </strong>{' '}
              fell. Your campaign is over.
            </>
          )}
        </p>

        <div className={styles.actions}>
          {isVictory && (
            <button
              className={styles.continueButton}
              onClick={acknowledge}
              title="Continue managing the unified realm"
            >
              Continue Reign
            </button>
          )}
          <button className={styles.titleButton} onClick={reset}>
            Return to Title
          </button>
        </div>
      </div>
    </div>
  );
}
