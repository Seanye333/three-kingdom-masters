import { useGameStore } from '../../game/state/store';

/**
 * In-transit forces overview — lists the player's marching armies (the
 * persistent Army layer) with commander, troops, destination and ETA.
 * A read-only window onto the unit-on-the-map model.
 */
export function ArmiesPanel() {
  const playerForceId = useGameStore((s) => s.playerForceId);
  const armies = useGameStore((s) => s.armies);
  const officers = useGameStore((s) => s.officers);
  const cities = useGameStore((s) => s.cities);

  const mine = Object.values(armies).filter((a) => a.forceId === playerForceId);
  if (mine.length === 0) return null;

  return (
    <div style={{
      background: 'rgba(20, 14, 9, 0.86)',
      border: '1px solid #6a5536',
      padding: '0.35rem 0.5rem',
      fontFamily: '"Songti SC", serif',
      fontSize: '0.72rem',
      color: '#e8d9b0',
      minWidth: 150,
      maxWidth: 210,
      boxShadow: '0 0 10px rgba(0,0,0,0.6)',
      pointerEvents: 'none',
    }}>
      <div style={{ fontSize: '0.62rem', letterSpacing: '0.15rem', color: '#8a7050', textTransform: 'uppercase', marginBottom: 3 }}>
        在途部隊 · Armies
      </div>
      {mine.map((a) => {
        const cmdr = officers[a.commanderId];
        const target = cities[a.targetCityId];
        const remaining = Math.max(1, Math.round((1 - a.progress) * a.totalSeasons));
        const troopLabel = a.troops >= 1000 ? `${(a.troops / 1000).toFixed(1)}k` : `${a.troops}`;
        return (
          <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 6, lineHeight: 1.5 }}>
            <span style={{ color: '#ffe9a8', whiteSpace: 'nowrap' }}>
              {cmdr?.name.zh ?? '？'}
              <span style={{ color: '#8a7050', marginLeft: 4, fontSize: '0.62rem', fontFamily: 'ui-monospace, monospace' }}>{troopLabel}</span>
            </span>
            <span style={{ color: '#c0a878', whiteSpace: 'nowrap' }}>
              ▸{target?.name.zh ?? '?'} {a.totalSeasons > 1 ? `${remaining}季` : ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}
