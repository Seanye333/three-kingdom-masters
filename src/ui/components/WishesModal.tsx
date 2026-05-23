import { useGameStore } from '../../game/state/store';

interface Props {
  onClose: () => void;
}

export function WishesModal({ onClose }: Props) {
  const wishes = useGameStore((s) => s.officerWishes);
  const officers = useGameStore((s) => s.officers);
  const grant = useGameStore((s) => s.grantWish);
  const reject = useGameStore((s) => s.rejectWish);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.65)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 900,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(160deg,#2a1f15 0%,#1a1410 100%)',
          border: '1px solid #5a4530',
          width: 'min(620px,100%)',
          maxHeight: '88vh',
          overflow: 'auto',
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
            <div style={{ fontSize: '1.4rem', color: '#d4a84a', letterSpacing: '0.2rem' }}>書信</div>
            <div style={{ fontSize: '0.85rem', color: '#8a7050', fontStyle: 'italic' }}>
              Officer Letters
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#d4a84a', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            ×
          </button>
        </header>
        <div style={{ padding: '1rem 1.5rem' }}>
          {wishes.length === 0 ? (
            <div style={{ color: '#6a5238', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>
              No pending letters.
            </div>
          ) : (
            wishes.map((w) => {
              const o = officers[w.officerId];
              return (
                <div
                  key={w.id}
                  style={{
                    background: '#1a1410',
                    border: '1px solid #4a3520',
                    padding: '0.75rem 1rem',
                    marginBottom: '0.5rem',
                  }}
                >
                  <div style={{ fontSize: '0.9rem', color: '#d4a84a' }}>
                    {o?.name.zh} {o?.name.en}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#c0a878', marginTop: '0.2rem', lineHeight: 1.5 }}>
                    {w.text.zh}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#8a7050', fontStyle: 'italic', marginTop: '0.2rem' }}>
                    {w.text.en}
                  </div>
                  <div
                    style={{
                      fontFamily: 'ui-monospace, monospace',
                      fontSize: '0.7rem',
                      color: '#8a7050',
                      marginTop: '0.3rem',
                    }}
                  >
                    Grant: <span style={{ color: '#7ed68a' }}>+{w.grantBonus} loyalty</span> · Reject:{' '}
                    <span style={{ color: '#b8442e' }}>−{w.rejectPenalty} loyalty</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      onClick={() => grant(w.id)}
                      style={{
                        background: '#3a2d20',
                        border: '1px solid #7ed68a',
                        color: '#7ed68a',
                        padding: '0.3rem 0.8rem',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                      }}
                    >
                      準許 Grant
                    </button>
                    <button
                      onClick={() => reject(w.id)}
                      style={{
                        background: 'none',
                        border: '1px solid #b8442e',
                        color: '#b8442e',
                        padding: '0.3rem 0.8rem',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                      }}
                    >
                      却下 Reject
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
