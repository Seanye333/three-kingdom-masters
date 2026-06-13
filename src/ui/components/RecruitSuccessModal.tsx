import { useGameStore } from '../../game/state/store';
import { TRAIT_DEFS_BY_ID } from '../../game/data/personality';
import type { Officer } from '../../game/types';
import { OfficerPortrait } from './OfficerPortrait';
import { useT, useLanguage } from '../i18n';

/**
 * 入幕之慶 — the celebratory card when an officer joins your banner
 * (recruited from captivity or invited from the wild): portrait, the
 * five stats, traits, and a victorious line. Shared by both flows.
 */
export function RecruitSuccessModal({ officer, onClose }: { officer: Officer; onClose: () => void }) {
  const t = useT();
  const lang = useLanguage();
  const forces = useGameStore((s) => s.forces);
  const year = useGameStore((s) => s.date.year);
  const force = officer.forceId ? forces[officer.forceId] : null;
  const accent = force?.color ?? '#d4a84a';

  const stats: Array<[string, number, string]> = [
    ['統', officer.stats.leadership, 'LDR'],
    ['武', officer.stats.war, 'WAR'],
    ['智', officer.stats.intelligence, 'INT'],
    ['政', officer.stats.politics, 'POL'],
    ['魅', officer.stats.charisma, 'CHA'],
  ];
  const best = Math.max(...stats.map((s) => s[1]));

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)', display: 'grid', placeItems: 'center', zIndex: 1200, padding: '1rem' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(165deg,#2e2417,#15100a)', border: `1px solid ${accent}`,
          width: 'min(380px,100%)', padding: '1.2rem 1.3rem', textAlign: 'center',
          color: '#e8d9b0', fontFamily: '"Songti SC","Noto Serif SC",serif',
          boxShadow: `0 0 30px ${accent}44`,
        }}
      >
        <div style={{ fontSize: '0.95rem', letterSpacing: '0.4rem', color: accent, marginBottom: '0.1rem' }}>
          🎉 {t('招攬成功', 'Recruited!')}
        </div>
        <div style={{ fontSize: '0.72rem', color: '#8a7050', marginBottom: '0.8rem' }}>
          {force ? t(`${force.name.zh} 喜得一員`, `Joins ${force.name.en}`) : t('入我麾下', 'Joins your banner')}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.6rem' }}>
          <OfficerPortrait officer={officer} size={96} forceColor={accent} year={year} />
        </div>

        <div style={{ fontSize: '1.4rem', color: '#f0d98a' }}>
          {officer.name.zh}
          {officer.courtesyName && <span style={{ fontSize: '0.8rem', color: '#8a7050', marginLeft: 6 }}>字 {officer.courtesyName.zh}</span>}
        </div>
        <div style={{ fontSize: '0.78rem', color: '#a89070', fontStyle: 'italic', marginBottom: '0.7rem' }}>{officer.name.en}</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4, marginBottom: '0.7rem' }}>
          {stats.map(([zh, v, en]) => (
            <div key={en} style={{ background: '#1a1410', border: '1px solid #3a2d20', padding: '0.35rem 0' }}>
              <div style={{ fontSize: '0.62rem', color: '#8a7050' }}>{lang === 'en' ? en : zh}</div>
              <div style={{ fontSize: '1.05rem', color: v === best ? accent : '#e8d9b0', fontWeight: v === best ? 700 : 400 }}>{v}</div>
            </div>
          ))}
        </div>

        {officer.traits && officer.traits.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center', marginBottom: '0.8rem' }}>
            {officer.traits.map((tid) => {
              const d = TRAIT_DEFS_BY_ID[tid];
              if (!d) return null;
              return (
                <span key={tid} style={{
                  fontSize: '0.68rem', padding: '1px 7px', borderRadius: 2,
                  border: `1px solid ${d.color}`, color: d.color,
                }}>{lang === 'en' ? d.name.en : d.name.zh}</span>
              );
            })}
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '0.5rem', cursor: 'pointer',
            background: 'linear-gradient(180deg,#3a2d18,#2a1f10)', border: `1px solid ${accent}`,
            color: '#f0d98a', fontFamily: 'inherit', letterSpacing: '0.3rem',
          }}
        >{t('善', 'Excellent')}</button>
      </div>
    </div>
  );
}
