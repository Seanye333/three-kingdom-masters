import { useGameStore } from '../../game/state/store';

interface Props {
  onClose: () => void;
}

/**
 * Consolidated settings menu — gathers every toggle the player can flip
 * during a campaign in one place.
 */
export function SettingsModal({ onClose }: Props) {
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const setSoundEnabled = useGameStore((s) => s.setSoundEnabled);
  const fogOfWar = useGameStore((s) => s.fogOfWar);
  const setFogOfWar = useGameStore((s) => s.setFogOfWar);
  const romanceMode = useGameStore((s) => s.romanceMode);
  const setRomanceMode = useGameStore((s) => s.setRomanceMode);
  const roguelikeMode = useGameStore((s) => s.roguelikeMode);
  const setRoguelikeMode = useGameStore((s) => s.setRoguelikeMode);
  const careerMode = useGameStore((s) => s.careerMode);
  const battleSpeed = useGameStore((s) => s.battleSpeed);
  const setBattleSpeed = useGameStore((s) => s.setBattleSpeed);
  const musicTrack = useGameStore((s) => s.musicTrack);
  const setMusicTrack = useGameStore((s) => s.setMusicTrack);

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.65)',
        display: 'grid', placeItems: 'center',
        zIndex: 900, padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(160deg,#2a1f15,#1a1410)',
          border: '1px solid #5a4530',
          width: 'min(520px,100%)',
          maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          color: '#e8d9b0',
          fontFamily: '"Songti SC","Noto Serif SC",serif',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <header
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            padding: '1rem 1.5rem', borderBottom: '1px solid #4a3520',
          }}
        >
          <div>
            <div style={{ fontSize: '1.4rem', color: '#d4a84a', letterSpacing: '0.2rem' }}>設定</div>
            <div style={{ fontSize: '0.85rem', color: '#8a7050', fontStyle: 'italic' }}>Settings</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#d4a84a', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
        </header>
        <div style={{ padding: '1rem 1.5rem', overflowY: 'auto', flex: 1 }}>
          <Section title="音響 Audio">
            <Toggle label="音響 Sound effects" hint="UI clicks, swords, horns" checked={soundEnabled} onChange={setSoundEnabled} />
            <Row label="背景音楽 Music">
              <select
                value={musicTrack ?? 'auto'}
                onChange={(e) => setMusicTrack(e.target.value === 'auto' ? null : e.target.value)}
                style={selectStyle}
              >
                <option value="auto">自動 Auto (by scene)</option>
                <option value="peace">平時 Peace</option>
                <option value="tension">緊張 Tension</option>
                <option value="battle">戰闘 Battle</option>
                <option value="victory">勝利 Victory</option>
                <option value="defeat">敗北 Defeat</option>
              </select>
            </Row>
          </Section>

          <Section title="画面 Display">
            <Toggle label="戰霧 Fog of war" hint="Hide unscouted cities" checked={fogOfWar} onChange={setFogOfWar} />
          </Section>

          <Section title=" Gameplay">
            <Toggle
              label="演義 Romance mode"
              hint="Historical events fire 100% on schedule"
              checked={romanceMode}
              onChange={setRomanceMode}
            />
            <Toggle
              label=" Roguelike"
              hint={careerMode ? 'Career officer death ends the campaign' : 'Requires Career mode'}
              checked={roguelikeMode}
              onChange={setRoguelikeMode}
              disabled={!careerMode}
            />
          </Section>

          <Section title="戰闘 Combat">
            <Row label="戰闘速度 Battle speed">
              <div style={{ display: 'flex', gap: 4 }}>
                {[1, 2, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => setBattleSpeed(s)}
                    style={{
                      background: battleSpeed === s ? '#3a2d20' : 'transparent',
                      border: '1px solid ' + (battleSpeed === s ? '#d4a84a' : '#4a3520'),
                      color: battleSpeed === s ? '#d4a84a' : '#8a7050',
                      padding: '0.25rem 0.7rem',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </Row>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: import('react').ReactNode }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.25rem', color: '#c19a3b', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Toggle({ label, hint, checked, onChange, disabled }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0.65rem',
        background: '#1a1410',
        border: '1px solid #3a2d20',
        marginBottom: '0.3rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span>
        <span style={{ fontSize: '0.9rem', color: '#d4a84a' }}>{label}</span>
        {hint && (
          <span style={{ display: 'block', fontSize: '0.7rem', color: '#8a7050', fontStyle: 'italic' }}>
            {hint}
          </span>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
    </label>
  );
}

function Row({ label, children }: { label: string; children: import('react').ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0.65rem',
        background: '#1a1410',
        border: '1px solid #3a2d20',
        marginBottom: '0.3rem',
      }}
    >
      <span style={{ fontSize: '0.9rem', color: '#d4a84a' }}>{label}</span>
      {children}
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  background: '#0a0805',
  border: '1px solid #4a3520',
  color: '#d4a84a',
  padding: '0.3rem',
  fontFamily: 'inherit',
};
