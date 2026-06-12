import { useMemo } from 'react';
import { useGameStore } from '../../game/state/store';
import { useT } from '../i18n';

/**
 * 大勢 — the realm as lines: one per living force, power over time.
 * Rises tell you who to court; bleeds tell you who to eat.
 */
export function PowerGraphModal({ onClose }: { onClose: () => void }) {
  const t = useT();
  const history = useGameStore((s) => s.powerHistory ?? []);
  const forces = useGameStore((s) => s.forces);
  const cities = useGameStore((s) => s.cities);
  const playerForceId = useGameStore((s) => s.playerForceId);

  const W = 560;
  const H = 300;
  const PAD = 34;

  const { lines, maxP, years } = useMemo(() => {
    const living = new Set(Object.values(cities).map((c) => c.ownerForceId).filter(Boolean) as string[]);
    // Every force that EVER appears in history still draws (fallen lines
    // flatline to zero — that's the story).
    const ids = new Set<string>();
    for (const snap of history) Object.keys(snap.byForce).forEach((id) => ids.add(id));
    let max = 1;
    for (const snap of history) for (const v of Object.values(snap.byForce)) max = Math.max(max, v);
    const n = Math.max(1, history.length - 1);
    const ls = [...ids].map((fid) => {
      const pts = history.map((snap, i) => {
        const x = PAD + (i / n) * (W - PAD * 2);
        const y = H - PAD - ((snap.byForce[fid] ?? 0) / max) * (H - PAD * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');
      return {
        fid,
        pts,
        color: forces[fid]?.color ?? '#777',
        name: forces[fid]?.name.zh ?? fid,
        alive: living.has(fid),
        latest: history[history.length - 1]?.byForce[fid] ?? 0,
      };
    }).sort((a, b) => b.latest - a.latest);
    return {
      lines: ls,
      maxP: max,
      years: history.length > 0 ? [history[0].year, history[history.length - 1].year] : null,
    };
  }, [history, forces, cities]);

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'grid', placeItems: 'center', zIndex: 900, padding: '1rem' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(160deg,#2a1f15,#1a1410)', border: '1px solid #5a4530',
          width: 'min(640px,100%)', color: '#e8d9b0',
          fontFamily: '"Songti SC","Noto Serif SC",serif', padding: '1rem 1.3rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '1.2rem', color: '#d4a84a', letterSpacing: '0.25rem' }}>📈 {t('天下大勢', 'Balance of Power')}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#d4a84a', fontSize: '1.4rem', cursor: 'pointer' }}>×</button>
        </div>
        {history.length < 2 ? (
          <div style={{ color: '#8a7050', fontSize: '0.85rem', padding: '1.5rem 0' }}>
            {t('史官尚在磨墨 — 過幾旬再來看曲線。', 'The historians are still grinding ink — give it a few seasons.')}
          </div>
        ) : (
          <>
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ background: '#14100a', border: '1px solid #2a2014' }}>
              {/* Frame + axis labels */}
              {[0.25, 0.5, 0.75].map((f) => (
                <line key={f} x1={PAD} x2={W - PAD} y1={H - PAD - f * (H - PAD * 2)} y2={H - PAD - f * (H - PAD * 2)} stroke="#241c12" />
              ))}
              {lines.map((l) => (
                <polyline
                  key={l.fid}
                  points={l.pts}
                  fill="none"
                  stroke={l.color}
                  strokeWidth={l.fid === playerForceId ? 2.6 : 1.4}
                  opacity={l.alive ? 0.95 : 0.35}
                />
              ))}
              {years && (
                <>
                  <text x={PAD} y={H - 10} fontSize={11} fill="#8a7050">{years[0]}年</text>
                  <text x={W - PAD} y={H - 10} fontSize={11} fill="#8a7050" textAnchor="end">{years[1]}年</text>
                  <text x={PAD} y={16} fontSize={10} fill="#6a5a45">{t('國力(城+兵+財)峰值', 'Power (cities+troops+gold), peak')} {Math.round(maxP / 1000)}k</text>
                </>
              )}
            </svg>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8, fontSize: '0.75rem' }}>
              {lines.map((l) => (
                <span key={l.fid} style={{ color: l.color, opacity: l.alive ? 1 : 0.45 }}>
                  ■ {l.name}{l.fid === playerForceId ? '(我)' : ''}{!l.alive ? t('(亡)', ' (fallen)') : ''}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
