import { useGameStore } from '../../game/state/store';
import { CHALLENGES, totalStars, type Challenge } from '../../game/data/challenges';
import { SCENARIOS } from '../../game/data';
import { useT, useLanguage } from '../i18n';

interface Props {
  onClose: () => void;
}

const DIFF_LABEL: Record<Challenge['difficulty'], { zh: string; en: string; color: string }> = {
  easy: { zh: '初級', en: 'Easy', color: '#6aa84f' },
  normal: { zh: '中級', en: 'Normal', color: '#d4a84a' },
  hard: { zh: '上級', en: 'Hard', color: '#c0504a' },
};

/**
 * Hero Mode (英雄模式) — pick a timed challenge scenario. Each challenge
 * locks a force + win condition + deadline; the season-end check scores it
 * pass/fail. Launching one calls startChallenge, which loads the underlying
 * scenario at the recommended difficulty and arms the check.
 */
export function HeroModeModal({ onClose }: Props) {
  const startChallenge = useGameStore((s) => s.startChallenge);
  const records = useGameStore((s) => s.challengeRecords);
  const t = useT();
  const lang = useLanguage();

  const doneCount = CHALLENGES.filter((c) => records[c.id]).length;
  const earned = totalStars(records);
  const maxStars = CHALLENGES.length * 3;

  const sorted = [...CHALLENGES].sort((a, b) => {
    const ya = SCENARIOS.find((s) => s.id === a.scenarioId)?.startDate.year ?? 0;
    const yb = SCENARIOS.find((s) => s.id === b.scenarioId)?.startDate.year ?? 0;
    return ya - yb;
  });

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        display: 'grid', placeItems: 'center', zIndex: 900, padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(160deg,#2a1f15,#1a1410)',
          border: '1px solid #5a4530',
          width: 'min(760px,100%)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          color: '#e8d9b0',
          fontFamily: '"Songti SC","Noto Serif SC",serif',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <header
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            padding: '1rem 1.5rem', borderBottom: '1px solid #4a3520',
          }}
        >
          <div>
            <div style={{ fontSize: '1.4rem', color: '#d4a84a', letterSpacing: '0.2rem' }}>{t('英雄模式', 'Hero Mode')}</div>
            <div style={{ fontSize: '0.82rem', color: '#8a7050', fontStyle: 'italic' }}>
              {t('限時挑戰 — 達成目標方得功成', 'Timed challenges — meet the goal before the clock runs out')}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ textAlign: 'right', fontSize: '0.78rem', color: '#c0a878' }}>
              <div>{t('已通關', 'Cleared')} <b style={{ color: '#d4a84a' }}>{doneCount}/{CHALLENGES.length}</b></div>
              <div style={{ color: '#d96a4a' }}>★ {earned}<span style={{ color: '#6a5238' }}>/{maxStars}</span></div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#d4a84a', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
          </div>
        </header>

        <div style={{ padding: '1rem 1.5rem', overflowY: 'auto', flex: 1, display: 'grid', gap: '0.7rem' }}>
          {sorted.map((c) => {
            const scn = SCENARIOS.find((s) => s.id === c.scenarioId);
            const year = scn?.startDate.year ?? '';
            const diff = DIFF_LABEL[c.difficulty];
            const rec = records[c.id];
            return (
              <div
                key={c.id}
                style={{
                  background: '#1a1410', border: '1px solid #4a3520',
                  borderLeft: `3px solid ${rec ? '#7ed68a' : '#d4a84a'}`,
                  padding: '0.85rem 1rem', display: 'flex', gap: '1rem', alignItems: 'center',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.05rem', color: '#d4a84a' }}>
                      {lang === 'en' ? c.name.en : c.name.zh}
                    </span>
                    {rec && (
                      <span style={{ fontSize: '0.74rem', color: '#7ed68a' }}>
                        ✓ {t('通關', 'Cleared')} <span style={{ color: '#d96a4a' }}>{'★'.repeat(rec.bestStars)}</span>
                        <span style={{ color: '#8a7050' }}> · {rec.bestYear} AD</span>
                      </span>
                    )}
                    <span style={{ color: '#c0504a', letterSpacing: '0.1rem', fontSize: '0.85rem' }}>
                      {'★'.repeat(c.star)}<span style={{ color: '#4a3520' }}>{'★'.repeat(3 - c.star)}</span>
                    </span>
                    <span style={{ fontSize: '0.7rem', color: diff.color, border: `1px solid ${diff.color}`, padding: '0.05rem 0.35rem', borderRadius: 2 }}>
                      {lang === 'en' ? diff.en : diff.zh}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#8a7050' }}>
                      {scn ? (lang === 'en' ? scn.name.en : scn.name.zh) : c.scenarioId} · {year} AD
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#a08c6a', marginTop: '0.35rem', lineHeight: 1.5 }}>
                    {lang === 'en' ? c.blurb.en : c.blurb.zh}
                  </div>
                </div>
                <button
                  onClick={() => { startChallenge(c.id); onClose(); }}
                  style={{
                    flexShrink: 0, alignSelf: 'center',
                    background: '#3a2818', border: '1px solid #d4a84a', color: '#d4a84a',
                    padding: '0.5rem 1rem', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem',
                    letterSpacing: '0.1rem',
                  }}
                >
                  {rec ? t('重挑', 'Replay') : t('挑戰', 'Take it')}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
