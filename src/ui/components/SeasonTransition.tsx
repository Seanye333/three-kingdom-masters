import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../../game/state/store';
import { SEASON_LABEL, type Season } from '../../game/types';
import styles from './SeasonTransition.module.css';

/** Seasonal accents — jade spring, warm summer, jin autumn, cold winter. */
const SEASON_ACCENT: Record<Season, string> = {
  spring: '#6fbf9f',
  summer: '#e0784a',
  autumn: '#e6c473',
  winter: '#8fb6e0',
};

const SEASON_TINT: Record<Season, string> = {
  spring: 'rgba(111,191,159,0.16)',
  summer: 'rgba(224,120,74,0.16)',
  autumn: 'rgba(230,196,115,0.16)',
  winter: 'rgba(143,182,224,0.16)',
};

/**
 * 季度過場 — washes a water-ink season card over the realm whenever the season
 * turns. Watches the campaign date; on a season (or year) change it shows the
 * card for ~1.5s, then clears itself. A click skips early. Suppressed in
 * spectator mode so the auto-sim isn't gated by 1.5s cards.
 */
export function SeasonTransition() {
  const year = useGameStore((s) => s.date.year);
  const season = useGameStore((s) => s.date.season);
  const observing = useGameStore((s) => s.playerForceId === null);
  const [card, setCard] = useState<{ year: number; season: Season } | null>(null);
  const prevKey = useRef<string | null>(null);
  const timer = useRef(0);

  useEffect(() => {
    const key = `${year}-${season}`;
    // Skip the very first render (campaign load) — only turns should fire it.
    if (prevKey.current === null) {
      prevKey.current = key;
      return;
    }
    if (prevKey.current !== key) {
      prevKey.current = key;
      if (observing) return;
      setCard({ year, season });
      window.clearTimeout(timer.current);
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      timer.current = window.setTimeout(() => setCard(null), reduce ? 800 : 1500);
    }
  }, [year, season, observing]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (!card) return null;

  const accent = SEASON_ACCENT[card.season];
  const label = SEASON_LABEL[card.season];

  return (
    <div
      className={styles.root}
      data-testid="season-transition"
      style={{ background: `radial-gradient(ellipse 70% 60% at 50% 48%, ${SEASON_TINT[card.season]} 0%, rgba(8,11,14,0.82) 72%)` }}
      onClick={() => { window.clearTimeout(timer.current); setCard(null); }}
      role="presentation"
    >
      <div className={styles.card} style={{ color: accent }}>
        <div className={styles.bigChar}>{label.zh}</div>
        <div className={styles.line} />
        <div className={styles.year}>{card.year}年</div>
        <div className={styles.en}>{label.en} · {card.year} AD</div>
      </div>
    </div>
  );
}
