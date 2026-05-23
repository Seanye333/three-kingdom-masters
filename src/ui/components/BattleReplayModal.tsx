import { useState } from 'react';
import { useGameStore } from '../../game/state/store';
import { SEASON_LABEL } from '../../game/types';

interface Props {
  onClose: () => void;
}

export function BattleReplayModal({ onClose }: Props) {
  const replays = useGameStore((s) => s.battleReplays);
  const officers = useGameStore((s) => s.officers);
  const [selectedId, setSelectedId] = useState<string | null>(replays[0]?.id ?? null);
  const replay = selectedId ? replays.find((r) => r.id === selectedId) : null;
  const [turnIdx, setTurnIdx] = useState(0);

  const snapshot = replay && replay.snapshots[turnIdx] ? replay.snapshots[turnIdx] : replay?.finalBattle ?? null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 900,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(160deg,#2a1f15,#1a1410)',
          border: '1px solid #5a4530',
          width: 'min(820px,100%)',
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
            display: 'flex',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #4a3520',
            alignItems: 'baseline',
          }}
        >
          <div>
            <div style={{ fontSize: '1.4rem', color: '#d4a84a', letterSpacing: '0.2rem' }}>戰史</div>
            <div style={{ fontSize: '0.85rem', color: '#8a7050', fontStyle: 'italic' }}>Battle Replays</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#d4a84a', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
        </header>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', overflow: 'hidden', flex: 1 }}>
          <div style={{ overflowY: 'auto', borderRight: '1px solid #4a3520', padding: '0.5rem' }}>
            {replays.length === 0 && (
              <div style={{ color: '#6a5238', fontStyle: 'italic', padding: '1rem', textAlign: 'center' }}>
                No replays yet. Tactical battles auto-save here.
              </div>
            )}
            {replays.map((r) => {
              const season = SEASON_LABEL[r.season];
              return (
                <button
                  key={r.id}
                  onClick={() => { setSelectedId(r.id); setTurnIdx(0); }}
                  style={{
                    width: '100%',
                    background: r.id === selectedId ? '#2a1f15' : 'transparent',
                    border: '1px solid ' + (r.id === selectedId ? '#d4a84a' : '#3a2d20'),
                    color: '#e8d9b0',
                    padding: '0.5rem 0.6rem',
                    margin: '0.25rem 0',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <div style={{ color: '#d4a84a', fontSize: '0.9rem' }}>{r.cityName.zh}</div>
                  <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.7rem', color: '#8a7050' }}>
                    {r.year} {season.en}
                  </div>
                </button>
              );
            })}
          </div>

          <div style={{ overflowY: 'auto', padding: '1rem 1.5rem' }}>
            {replay ? (
              <>
                <div style={{ fontSize: '1.2rem', color: '#d4a84a', letterSpacing: '0.2rem' }}>
                  {replay.cityName.zh} {replay.cityName.en}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#8a7050', marginBottom: '1rem' }}>
                  {replay.year} {SEASON_LABEL[replay.season].zh} ·{' '}
                  {replay.attackerForceName?.en ?? 'Attacker'} vs {replay.defenderForceName?.en ?? 'Defender'}
                </div>
                {snapshot && (
                  <>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <button
                        onClick={() => setTurnIdx((i) => Math.max(0, i - 1))}
                        disabled={turnIdx === 0}
                        style={btn(turnIdx === 0)}
                      >
                        ←
                      </button>
                      <div style={{ flex: 1, textAlign: 'center', fontFamily: 'ui-monospace, monospace' }}>
                        Turn {snapshot.turn} / {replay.finalBattle.turn}
                      </div>
                      <button
                        onClick={() => setTurnIdx((i) => Math.min((replay.snapshots.length || 1) - 1, i + 1))}
                        disabled={replay.snapshots.length === 0 || turnIdx >= replay.snapshots.length - 1}
                        style={btn(replay.snapshots.length === 0 || turnIdx >= replay.snapshots.length - 1)}
                      >
                        →
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <div style={{ background: '#1a1410', border: '1px solid #4a3520', padding: '0.5rem' }}>
                        <div style={{ color: '#b8442e', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                          Attacker
                        </div>
                        {snapshot.units.filter((u) => u.side === 'attacker').map((u) => {
                          const o = officers[u.officerId];
                          return (
                            <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                              <span>{o?.name.zh ?? u.officerId}</span>
                              <span style={{ fontFamily: 'ui-monospace, monospace' }}>{u.troops.toLocaleString()}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ background: '#1a1410', border: '1px solid #4a3520', padding: '0.5rem' }}>
                        <div style={{ color: '#3a7dd9', fontSize: '0.78rem', marginBottom: '0.25rem' }}>
                          Defender
                        </div>
                        {snapshot.units.filter((u) => u.side === 'defender').map((u) => {
                          const o = officers[u.officerId];
                          return (
                            <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                              <span>{o?.name.zh ?? u.officerId}</span>
                              <span style={{ fontFamily: 'ui-monospace, monospace' }}>{u.troops.toLocaleString()}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
                <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: '#c0a878' }}>
                  <span style={{ color: '#b8442e' }}>Attacker losses: {replay.finalBattle.attackerLosses.toLocaleString()}</span>
                  {' · '}
                  <span style={{ color: '#3a7dd9' }}>Defender: {replay.finalBattle.defenderLosses.toLocaleString()}</span>
                  {' · '}
                  Winner: <strong style={{ color: '#d4a84a' }}>{replay.finalBattle.winner ?? '-'}</strong>
                </div>
              </>
            ) : (
              <div style={{ color: '#6a5238', fontStyle: 'italic', padding: '2rem', textAlign: 'center' }}>
                Pick a battle to replay.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function btn(disabled: boolean) {
  return {
    background: '#3a2d20',
    border: '1px solid #4a3520',
    color: disabled ? '#6a5238' : '#d4a84a',
    padding: '0.35rem 0.8rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    opacity: disabled ? 0.5 : 1,
  } as const;
}
