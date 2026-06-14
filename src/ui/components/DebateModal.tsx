import { useState } from 'react';
import { DEBATE_CARDS, createDebate, pickAiCard, playRound, type DebateCard, type DebateState } from '../../game/systems/debate';
import type { Officer } from '../../game/types';
import { playSfx } from '../../game/systems/sound';
import { OfficerAvatar } from './OfficerAvatar';
import { useT } from '../i18n';

/**
 * 舌戰 — the interactive war of words: pick your argument, watch the
 * simultaneous reveal, break their composure before they break yours.
 */
export function DebateModal({ me, foe, onDone }: {
  me: Officer;
  foe: Officer;
  onDone: (result: { won: boolean; collapse: boolean }) => void;
}) {
  const t = useT();
  const [state, setState] = useState<DebateState>(() => createDebate(me, foe));
  const [lastCard, setLastCard] = useState<DebateCard | null>(null);

  const play = (card: DebateCard) => {
    if (state.winner) return;
    const aiCard = pickAiCard(state, lastCard, Math.random);
    const next = playRound(state, card, aiCard, Math.random);
    setLastCard(card);
    setState(next);
    playSfx(next.winner ? (next.winner === 'a' ? 'victory' : 'defeat') : 'shout');
  };

  const bar = (v: number, color: string) => (
    <div style={{ height: 8, background: '#10161e', border: '1px solid #26323e', borderRadius: 3 }}>
      <div style={{ height: '100%', width: `${Math.max(0, Math.min(100, v))}%`, background: color, borderRadius: 3, transition: 'width 0.4s' }} />
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)', display: 'grid', placeItems: 'center', zIndex: 1100, padding: '1rem' }}>
      <div style={{
        background: 'linear-gradient(160deg,#1b2531,#0e141b)', border: '1px solid #c9a64e',
        width: 'min(620px,100%)', maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        color: '#e6edf3', fontFamily: '"Songti SC","Noto Serif SC",serif', padding: '1rem 1.3rem',
      }}>
        <div style={{ textAlign: 'center', fontSize: '1.2rem', color: '#e6c473', letterSpacing: '0.35rem', marginBottom: '0.7rem' }}>
          💬 {t('舌戰', 'War of Words')}
        </div>
        {/* The two minds */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: '0.6rem' }}>
          {([['a', me], ['b', foe]] as const).map(([side, o]) => (
            <div key={side} style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexDirection: side === 'b' ? 'row-reverse' : 'row' }}>
                <OfficerAvatar officer={o} size={44} />
                <div style={{ textAlign: side === 'b' ? 'right' : 'left' }}>
                  <div style={{ color: '#f2dd9a' }}>{o.name.zh}</div>
                  <div style={{ fontSize: '0.65rem', color: '#7a8893' }}>{t('氣勢', 'Composure')} {Math.max(0, state[side].composure)}</div>
                </div>
              </div>
              {bar(state[side].composure, side === 'a' ? '#7ed68a' : '#ff7050')}
            </div>
          ))}
        </div>
        {/* The record of exchanges */}
        <div style={{
          flex: 1, minHeight: 110, maxHeight: 180, overflowY: 'auto',
          background: '#14100a', border: '1px solid #18212b', padding: '0.5rem 0.7rem',
          fontSize: '0.78rem', lineHeight: 1.8, color: '#cdb88f', marginBottom: '0.7rem',
        }}>
          {state.log.map((l, i) => <div key={i}>{l}</div>)}
        </div>
        {/* The four arguments — or the verdict */}
        {state.winner ? (
          <button
            onClick={() => onDone({ won: state.winner === 'a', collapse: state.collapse })}
            style={{
              background: 'linear-gradient(180deg,#3a2d18,#2a1f10)', border: '1px solid #e6c473',
              color: '#f2dd9a', padding: '0.5rem', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.25rem',
            }}
          >{state.winner === 'a' ? t('✓ 舌戰得勝', '✓ Victory') : t('敗下陣來…', 'Defeated…')}</button>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {DEBATE_CARDS.map((c) => (
              <button
                key={c.id}
                onClick={() => play(c.id)}
                title={c.line}
                style={{
                  background: '#241c12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#e6edf3',
                  padding: '0.5rem 0.4rem', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem',
                }}
              >{c.zh}</button>
            ))}
          </div>
        )}
        <div style={{ fontSize: '0.62rem', color: '#5f6c76', marginTop: 6, textAlign: 'center' }}>
          {t('相剋:大義→激將→折服→詭辯→大義(剋者傷倍,被剋傷半)', 'Counters: righteous→taunt→logic→sophistry→righteous')}
        </div>
      </div>
    </div>
  );
}
