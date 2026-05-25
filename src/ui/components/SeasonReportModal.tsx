import { useState } from 'react';
import { useGameStore } from '../../game/state/store';
import { SEASON_LABEL } from '../../game/types';
import type { BattleDetail, Season } from '../../game/types';
import { BattleDetailModal } from './BattleDetailModal';
import styles from './SeasonReportModal.module.css';
import { useT, useLanguage } from '../i18n';

export function SeasonReportModal() {
  const report = useGameStore((s) => s.lastReport);
  const dismiss = useGameStore((s) => s.dismissReport);
  const playerForceId = useGameStore((s) => s.playerForceId);
  const cities = useGameStore((s) => s.cities);
  const [selectedBattle, setSelectedBattle] = useState<BattleDetail | null>(null);
  const t = useT();
  const lang = useLanguage();

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
            <div className={styles.titleZh}>{t('季報', 'Season Report')}</div>
            <div className={styles.titleEn}>
              {lang === 'zh'
                ? `${season.zh} ${report.date.year} 年`
                : lang === 'both'
                  ? `${season.zh} · ${season.en} ${report.date.year} AD`
                  : `Season Report — ${season.en} ${report.date.year} AD`}
            </div>
          </div>
        </header>

        {playerEntries.length === 0 ? (
          <div className={styles.empty}>
            {t('季內無事,境內安寧。', 'A quiet season. Nothing of note in your domain.')}
          </div>
        ) : (
          <ul className={styles.entries}>
            {playerEntries.map((e, i) => {
              const clickable = !!e.battle;
              const body = lang === 'zh' ? (e.textZh ?? e.text) : e.text;
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
                  <span className={styles.kindTag}>{kindLabel(e.kind, lang)}</span>
                  <span className={styles.text}>{body}</span>
                </li>
              );
            })}
          </ul>
        )}

        <footer className={styles.footer}>
          <button className={styles.closeButton} onClick={dismiss}>
            {t('繼續', 'Continue')}
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

function kindLabel(kind: string, lang: 'zh' | 'en' | 'both'): string {
  const pair = ((): { zh: string; en: string } => {
    switch (kind) {
      case 'income':           return { zh: '收入', en: 'INCOME' };
      case 'upkeep':           return { zh: '俸給', en: 'UPKEEP' };
      case 'desertion':        return { zh: '逃散', en: 'DESERTION' };
      case 'command-success':  return { zh: '政令', en: 'ORDER' };
      case 'command-failure':  return { zh: '政令', en: 'ORDER' };
      case 'march':            return { zh: '進軍', en: 'MARCH' };
      case 'battle':           return { zh: '戰役', en: 'BATTLE' };
      case 'conquest':         return { zh: '攻佔', en: 'CONQUEST' };
      case 'defeat':           return { zh: '敗北', en: 'DEFEAT' };
      case 'death':            return { zh: '逝世', en: 'DEATH' };
      case 'succession':       return { zh: '繼承', en: 'SUCCESSION' };
      case 'dissolution':      return { zh: '滅亡', en: 'DISSOLUTION' };
      case 'rebellion':        return { zh: '叛亂', en: 'REVOLT' };
      case 'harvest':          return { zh: '豐收', en: 'HARVEST' };
      case 'famine':           return { zh: '饑荒', en: 'FAMINE' };
      case 'plague':           return { zh: '瘟疫', en: 'PLAGUE' };
      case 'talent':           return { zh: '人才', en: 'TALENT' };
      default:                 return { zh: '雜事', en: 'NOTE' };
    }
  })();
  if (lang === 'zh') return pair.zh;
  if (lang === 'both') return `${pair.zh} · ${pair.en}`;
  return pair.en;
}
