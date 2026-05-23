import { useState } from 'react';
import { useGameStore } from '../../game/state/store';
import { SEASON_LABEL } from '../../game/types';
import type { BattleDetail, Season } from '../../game/types';
import { BattleDetailModal } from './BattleDetailModal';
import styles from './SeasonReportModal.module.css';

export function SeasonReportModal() {
  const report = useGameStore((s) => s.lastReport);
  const dismiss = useGameStore((s) => s.dismissReport);
  const playerForceId = useGameStore((s) => s.playerForceId);
  const cities = useGameStore((s) => s.cities);
  const [selectedBattle, setSelectedBattle] = useState<BattleDetail | null>(null);

  if (!report) return null;
  const season = SEASON_LABEL[report.date.season as Season];

  // Show entries for player-owned cities, plus newsworthy events anywhere
  // (battles, conquests, defeats, deaths, talent appearances, etc.).
  const NEWSWORTHY = new Set([
    'battle',
    'conquest',
    'defeat',
    'march',
    'death',
    'succession',
    'dissolution',
    'rebellion',
    'talent',
  ]);
  const playerEntries = report.entries.filter((e) => {
    if (!e.cityId) return true;
    if (NEWSWORTHY.has(e.kind)) return true;
    return cities[e.cityId]?.ownerForceId === playerForceId;
  });

  return (
    <div className={styles.backdrop} onClick={dismiss}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div className={styles.titleBlock}>
            <div className={styles.titleZh}>季報</div>
            <div className={styles.titleEn}>
              Season Report — {season.en} {report.date.year} AD
            </div>
          </div>
        </header>

        {playerEntries.length === 0 ? (
          <div className={styles.empty}>
            A quiet season. Nothing of note in your domain.
          </div>
        ) : (
          <ul className={styles.entries}>
            {playerEntries.map((e, i) => {
              const clickable = !!e.battle;
              return (
                <li
                  key={i}
                  className={`${styles.entry} ${styles[kindClass(e.kind)]}`}
                  onClick={
                    clickable && e.battle
                      ? () => setSelectedBattle(e.battle!)
                      : undefined
                  }
                  style={clickable ? { cursor: 'pointer' } : undefined}
                >
                  <span className={styles.kindTag}>{kindLabel(e.kind)}</span>
                  <span className={styles.text}>{e.text}</span>
                </li>
              );
            })}
          </ul>
        )}

        <footer className={styles.footer}>
          <button className={styles.closeButton} onClick={dismiss}>
            Continue
          </button>
        </footer>

        {selectedBattle && (
          <BattleDetailModal
            battle={selectedBattle}
            onClose={() => setSelectedBattle(null)}
          />
        )}
      </div>
    </div>
  );
}

function kindClass(kind: string): string {
  return `kind_${kind.replace('-', '_')}`;
}

function kindLabel(kind: string): string {
  switch (kind) {
    case 'income':           return 'INCOME';
    case 'upkeep':           return 'UPKEEP';
    case 'desertion':        return 'DESERTION';
    case 'command-success':  return 'ORDER';
    case 'command-failure':  return 'ORDER';
    case 'march':            return 'MARCH';
    case 'battle':           return 'BATTLE';
    case 'conquest':         return 'CONQUEST';
    case 'defeat':           return 'DEFEAT';
    case 'death':            return 'DEATH';
    case 'succession':       return 'SUCCESSION';
    case 'dissolution':      return 'DISSOLUTION';
    case 'rebellion':        return 'REVOLT';
    case 'harvest':          return 'HARVEST';
    case 'famine':           return 'FAMINE';
    case 'plague':           return 'PLAGUE';
    case 'talent':           return 'TALENT';
    default:                 return 'NOTE';
  }
}
