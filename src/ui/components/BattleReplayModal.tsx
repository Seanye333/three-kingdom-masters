import { useEffect, useMemo, useState } from 'react';
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
  // Playback controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<0.5 | 1 | 2 | 4>(1);
  const [filter, setFilter] = useState('');

  const snapshot = replay && replay.snapshots[turnIdx] ? replay.snapshots[turnIdx] : replay?.finalBattle ?? null;
  const totalSnaps = replay?.snapshots.length ?? 0;

  // Auto-advance turn while playing.
  useEffect(() => {
    if (!isPlaying || !replay || totalSnaps === 0) return;
    if (turnIdx >= totalSnaps - 1) { setIsPlaying(false); return; }
    const interval = 900 / speed; // base 900ms per turn
    const id = window.setTimeout(() => setTurnIdx((i) => i + 1), interval);
    return () => window.clearTimeout(id);
  }, [isPlaying, turnIdx, speed, totalSnaps, replay]);

  // Filtered list of replays by city/year search.
  const filteredReplays = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return replays;
    return replays.filter((r) =>
      r.cityName.zh.includes(filter) ||
      r.cityName.en.toLowerCase().includes(q) ||
      String(r.year).includes(q),
    );
  }, [replays, filter]);

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
            {replays.length > 0 && (
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="搜尋… (城名/年份)"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: '#1a1410', border: '1px solid #4a3520',
                  color: '#e8d9b0', padding: '0.35rem 0.5rem',
                  fontFamily: 'inherit', fontSize: '0.78rem',
                  marginBottom: '0.4rem',
                }}
              />
            )}
            {replays.length === 0 && (
              <div style={{ color: '#6a5238', fontStyle: 'italic', padding: '1rem', textAlign: 'center' }}>
                No replays yet. Tactical battles auto-save here.
              </div>
            )}
            {filteredReplays.map((r) => {
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
                    {/* Playback controls row */}
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <button
                        onClick={() => { setTurnIdx(0); setIsPlaying(false); }}
                        style={btn(false)}
                        title="Restart"
                      >⏮</button>
                      <button
                        onClick={() => setTurnIdx((i) => Math.max(0, i - 1))}
                        disabled={turnIdx === 0}
                        style={btn(turnIdx === 0)}
                      >←</button>
                      <button
                        onClick={() => {
                          if (turnIdx >= totalSnaps - 1) { setTurnIdx(0); setIsPlaying(true); }
                          else setIsPlaying((p) => !p);
                        }}
                        disabled={totalSnaps === 0}
                        style={{ ...btn(totalSnaps === 0), minWidth: '2.5rem' }}
                        title={isPlaying ? 'Pause' : 'Play'}
                      >{isPlaying ? '⏸' : '▶'}</button>
                      <button
                        onClick={() => setTurnIdx((i) => Math.min(Math.max(0, totalSnaps - 1), i + 1))}
                        disabled={totalSnaps === 0 || turnIdx >= totalSnaps - 1}
                        style={btn(totalSnaps === 0 || turnIdx >= totalSnaps - 1)}
                      >→</button>
                      <div style={{ flex: 1, textAlign: 'center', fontFamily: 'ui-monospace, monospace', fontSize: '0.8rem' }}>
                        Turn {snapshot.turn} / {replay.finalBattle.turn}
                      </div>
                      {/* Speed selector */}
                      {([0.5, 1, 2, 4] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => setSpeed(s)}
                          style={{
                            background: speed === s ? '#3a2818' : 'transparent',
                            border: '1px solid ' + (speed === s ? '#d4a84a' : '#4a3520'),
                            color: speed === s ? '#d4a84a' : '#8a7050',
                            padding: '0.15rem 0.4rem',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontSize: '0.72rem',
                          }}
                        >{s}×</button>
                      ))}
                    </div>
                    {/* Scrubber — drag to jump to any turn */}
                    {totalSnaps > 1 && (
                      <input
                        type="range"
                        min={0}
                        max={totalSnaps - 1}
                        value={turnIdx}
                        onChange={(e) => { setTurnIdx(Number(e.target.value)); setIsPlaying(false); }}
                        style={{
                          width: '100%', accentColor: '#d4a84a',
                          marginBottom: '0.5rem',
                        }}
                      />
                    )}
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
