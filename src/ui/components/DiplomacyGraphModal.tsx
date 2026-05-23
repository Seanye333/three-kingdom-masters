import { useMemo } from 'react';
import { useGameStore } from '../../game/state/store';
import { getRelation, pairKey } from '../../game/types';

interface Props {
  onClose: () => void;
}

/**
 * Visual diplomacy graph: forces around a circle, lines colored by status.
 */
export function DiplomacyGraphModal({ onClose }: Props) {
  const forces = useGameStore((s) => s.forces);
  const cities = useGameStore((s) => s.cities);
  const diplomacy = useGameStore((s) => s.diplomacy);

  const liveForces = useMemo(
    () => Object.values(forces).filter((f) => Object.values(cities).some((c) => c.ownerForceId === f.id)),
    [forces, cities],
  );

  const cx = 350;
  const cy = 300;
  const r = 220;

  const positions = liveForces.map((f, i) => {
    const angle = (Math.PI * 2 * i) / liveForces.length - Math.PI / 2;
    return {
      force: f,
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
    };
  });

  // Build pairs.
  const pairs: Array<{ a: typeof positions[0]; b: typeof positions[0]; status: string; score: number }> = [];
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const rel = getRelation(diplomacy, positions[i].force.id, positions[j].force.id);
      pairs.push({ a: positions[i], b: positions[j], status: rel.status, score: rel.score });
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'grid', placeItems: 'center',
        zIndex: 900, padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(160deg,#2a1f15,#1a1410)',
          border: '1px solid #5a4530',
          width: 'min(820px,100%)',
          color: '#e8d9b0',
          fontFamily: '"Songti SC","Noto Serif SC",serif',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid #4a3520', alignItems: 'baseline' }}>
          <div>
            <div style={{ fontSize: '1.4rem', color: '#d4a84a', letterSpacing: '0.2rem' }}>関係図</div>
            <div style={{ fontSize: '0.85rem', color: '#8a7050', fontStyle: 'italic' }}>Diplomacy Web</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#d4a84a', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
        </header>
        <svg viewBox="0 0 700 600" style={{ width: '100%', maxHeight: '70vh', display: 'block' }}>
          {/* Edges */}
          {pairs.map((p, i) => {
            const color =
              p.status === 'allied' ? '#d4a84a' :
              p.status === 'non-aggression' ? '#88b7e8' :
              p.score < -30 ? '#b8442e' : '#5a4530';
            const dash =
              p.status === 'non-aggression' ? '6 4' :
              undefined;
            return (
              <line
                key={i}
                x1={p.a.x} y1={p.a.y} x2={p.b.x} y2={p.b.y}
                stroke={color}
                strokeWidth={p.status === 'allied' ? 3 : p.status === 'non-aggression' ? 2 : p.score < -30 ? 2 : 1}
                strokeDasharray={dash}
                opacity={p.status === 'allied' || p.status === 'non-aggression' || p.score < -30 ? 0.85 : 0.25}
              />
            );
          })}
          {/* Force nodes */}
          {positions.map((p) => (
            <g key={p.force.id}>
              <circle cx={p.x} cy={p.y} r="40" fill={p.force.color} stroke="#1a1410" strokeWidth="2" />
              <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="20" fontWeight="bold" fill="#fff" fontFamily="Songti SC, serif">
                {p.force.name.zh.charAt(0)}
              </text>
              <text x={p.x} y={p.y + 58} textAnchor="middle" fontSize="12" fill="#e8d9b0" fontFamily="Songti SC, serif">
                {p.force.name.zh}
              </text>
              <text x={p.x} y={p.y + 72} textAnchor="middle" fontSize="9" fill="#8a7050" fontStyle="italic" fontFamily="ui-monospace, monospace">
                {p.force.name.en}
              </text>
            </g>
          ))}
        </svg>
        <div style={{ display: 'flex', gap: '1rem', padding: '0.75rem 1.5rem', fontSize: '0.78rem', borderTop: '1px solid #4a3520' }}>
          <span><span style={{ background: '#d4a84a', display: 'inline-block', width: 14, height: 3, marginRight: 4 }} /> Allied 同盟</span>
          <span><span style={{ background: '#88b7e8', display: 'inline-block', width: 14, height: 3, marginRight: 4 }} /> Non-Aggression 不戦</span>
          <span><span style={{ background: '#b8442e', display: 'inline-block', width: 14, height: 3, marginRight: 4 }} /> Hostile 敵対</span>
        </div>
      </div>
    </div>
  );
}

// Make pairKey importable (used elsewhere).
void pairKey;
