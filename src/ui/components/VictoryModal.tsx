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
  const chronicle = useGameStore((s) => s.chronicle ?? []);

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

        {/* 本局戰史 — the campaign chronicle, year by year. */}
        {chronicle.length > 0 && (
          <div style={{
            maxHeight: 260, overflowY: 'auto', margin: '0.8rem 0',
            padding: '0.7rem 1rem',
            background: 'rgba(12, 8, 4, 0.55)',
            border: '1px solid #6a4a20', borderRadius: 4,
            textAlign: 'left',
          }}>
            <div style={{
              fontFamily: '"Ma Shan Zheng", "Songti SC", serif',
              color: '#e6c473', letterSpacing: '0.3em', marginBottom: 6,
            }}>本局戰史 · The Chronicle</div>
            {(() => {
              const ICON: Record<string, string> = {
                conquest: '⚔', works: '🌊', event: '📜', rebellion: '🔥', defense: '🛡',
              };
              let lastYear = 0;
              return chronicle.map((c, i) => (
                <div key={i} style={{ fontSize: '0.82rem', lineHeight: 1.7, color: '#e8d8b0' }}>
                  {c.year !== lastYear && (lastYear = c.year) && (
                    <div style={{ color: '#a08050', marginTop: 6, fontFamily: 'ui-monospace, monospace' }}>— {c.year} —</div>
                  )}
                  <span style={{ marginRight: 6 }}>{ICON[c.kind] ?? '·'}</span>
                  <span style={{ fontFamily: 'var(--tkm-font-body)' }}>{c.zh}</span>
                </div>
              ));
            })()}
          </div>
        )}

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
