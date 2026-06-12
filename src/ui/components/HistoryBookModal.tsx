import { useMemo } from 'react';
import { useGameStore } from '../../game/state/store';
import { composeHistoryBook, historyBookToText } from '../../game/systems/historyBook';
import { useT } from '../i18n';

/**
 * 本朝史書 — the compiled scroll, readable mid-campaign (annals so far)
 * and definitive at the end. 導出 downloads the plain-text scroll.
 */
export function HistoryBookModal({ onClose }: { onClose: () => void }) {
  const t = useT();
  const playerForceId = useGameStore((s) => s.playerForceId);
  const forces = useGameStore((s) => s.forces);
  const officers = useGameStore((s) => s.officers);
  const cities = useGameStore((s) => s.cities);
  const deeds = useGameStore((s) => s.deeds);
  const battleHistory = useGameStore((s) => s.battleHistory);
  const chronicle = useGameStore((s) => s.chronicle ?? []);
  const victoryStatus = useGameStore((s) => s.victoryStatus);
  const year = useGameStore((s) => s.date.year);
  // Start year: the earliest annal (campaigns chronicle from tick one).
  const scenarioStartYear = chronicle.length > 0 ? Math.min(...chronicle.map((e) => e.year)) : year;

  const sections = useMemo(() => composeHistoryBook({
    playerForceId, forces, officers, cities, deeds, battleHistory,
    chronicle, victoryStatus, startYear: scenarioStartYear, currentYear: year,
  }), [playerForceId, forces, officers, cities, deeds, battleHistory, chronicle, victoryStatus, scenarioStartYear, year]);

  const forceName = playerForceId ? forces[playerForceId]?.name.zh ?? '本朝' : '本朝';

  const exportText = () => {
    const blob = new Blob([historyBookToText(sections, forceName)], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${forceName}本紀-${year}年.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', display: 'grid', placeItems: 'center', zIndex: 900, padding: '1rem' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(160deg,#2e2418,#1a1410)', border: '1px solid #c19a3b',
          width: 'min(680px,100%)', maxHeight: '88vh', display: 'flex', flexDirection: 'column',
          color: '#e8d9b0', fontFamily: '"Songti SC","Noto Serif SC",serif',
        }}
      >
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '1rem 1.4rem', borderBottom: '1px solid #4a3520' }}>
          <div>
            <div style={{ fontSize: '1.35rem', color: '#d4a84a', letterSpacing: '0.3rem' }}>📜 《{forceName}本紀》</div>
            <div style={{ fontSize: '0.72rem', color: '#8a7050', fontStyle: 'italic' }}>
              {victoryStatus === 'playing' ? t('未完之卷 — 至今實錄', 'The unfinished scroll — annals so far') : t('定本', 'Definitive edition')}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={exportText}
              style={{ background: '#2a1f15', border: '1px solid #5a4530', color: '#d4a84a', padding: '0.3rem 0.8rem', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.78rem' }}
            >⬇ {t('導出', 'Export')}</button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#d4a84a', fontSize: '1.4rem', cursor: 'pointer' }}>×</button>
          </div>
        </header>
        <div style={{ overflowY: 'auto', padding: '1rem 1.6rem', flex: 1 }}>
          {sections.map((sec) => (
            <div key={sec.title} style={{ marginBottom: '1.1rem' }}>
              <div style={{
                fontSize: '0.95rem', color: '#c19a3b', letterSpacing: '0.4rem',
                borderBottom: '1px dashed #4a3520', paddingBottom: 4, marginBottom: 8,
              }}>{sec.title}</div>
              {sec.lines.map((l, i) => (
                <p key={i} style={{ margin: '0 0 0.4rem', fontSize: '0.85rem', lineHeight: 1.9, color: '#cdb88f' }}>{l}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
