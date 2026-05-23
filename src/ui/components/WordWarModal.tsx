import { useState } from 'react';
import type { WordWarResult } from '../../game/systems/wordWar';
import { useGameStore } from '../../game/state/store';

interface Props {
  result: WordWarResult;
  onClose: () => void;
}

export function WordWarModal({ result, onClose }: Props) {
  const officers = useGameStore((s) => s.officers);
  const [idx, setIdx] = useState(0);
  const total = result.lines.length;
  const cur = idx < total ? result.lines[idx] : null;
  const speaker = cur ? officers[cur.speakerId] : null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 950,
      }}
    >
      <div
        style={{
          background: 'linear-gradient(160deg,#2a1f15 0%,#1a1410 100%)',
          border: '2px solid #d4a84a',
          width: 'min(620px, 95vw)',
          padding: '2rem',
          color: '#e8d9b0',
          fontFamily: '"Songti SC","Noto Serif SC",serif',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '0.7rem',
            letterSpacing: '0.4rem',
            color: '#c19a3b',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}
        >
          War of Words · 舌戰
        </div>

        {cur ? (
          <>
            <div style={{ fontSize: '1.1rem', color: '#d4a84a', letterSpacing: '0.2rem' }}>
              {speaker?.name.zh} {speaker?.name.en}
            </div>
            <hr
              style={{
                border: 'none',
                height: 1,
                background: 'linear-gradient(90deg, transparent, #d4a84a, transparent)',
                margin: '1rem 0',
              }}
            />
            <div
              style={{
                fontSize: '1.3rem',
                color: '#e8d9b0',
                lineHeight: 1.8,
                minHeight: 80,
                fontStyle: 'italic',
              }}
            >
              「 {cur.text.zh} 」
            </div>
            <div
              style={{
                fontSize: '0.85rem',
                color: '#8a7050',
                marginTop: '0.5rem',
                fontStyle: 'italic',
              }}
            >
              {cur.text.en}
            </div>
            <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#8a7050' }}>
              {idx + 1} / {total}
            </div>
            <button
              onClick={() => setIdx((i) => i + 1)}
              style={{
                marginTop: '1rem',
                background: '#3a2d20',
                border: '1px solid #d4a84a',
                color: '#d4a84a',
                padding: '0.5rem 2rem',
                fontFamily: 'inherit',
                cursor: 'pointer',
                letterSpacing: '0.2rem',
              }}
            >
              {idx + 1 < total ? '次へ Next' : '見終 Reveal'}
            </button>
          </>
        ) : (
          <>
            <div
              style={{
                fontSize: '2rem',
                color: result.winnerSide === 'draw' ? '#c19a3b' : '#d4a84a',
                letterSpacing: '0.4rem',
                margin: '1.5rem 0',
              }}
            >
              {result.winnerSide === 'attacker' && '攻方勝舌'}
              {result.winnerSide === 'defender' && '守方勝舌'}
              {result.winnerSide === 'draw' && '平分秋色'}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#c0a878', marginBottom: '1rem' }}>
              {result.winnerSide === 'attacker' &&
                'The defenders\' morale wavers — they begin the battle at −10.'}
              {result.winnerSide === 'defender' &&
                'The attackers\' morale wavers — they begin the battle at −10.'}
              {result.winnerSide === 'draw' && 'Neither side concedes. Battle begins as planned.'}
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'linear-gradient(180deg, #5a4530, #3a2d20)',
                border: '1px solid #d4a84a',
                color: '#d4a84a',
                padding: '0.6rem 2rem',
                fontFamily: 'inherit',
                cursor: 'pointer',
                letterSpacing: '0.3rem',
              }}
            >
              開戰 Begin Battle
            </button>
          </>
        )}
      </div>
    </div>
  );
}
