import { useMemo } from 'react';
import { useGameStore } from '../../game/state/store';
import { COMMAND_DEFS } from '../../game/systems/commands';
import type { EntityId, InternalAffairsType } from '../../game/types';
import { OfficerHoverCard } from './OfficerHoverCard';
import styles from './OfficerPicker.module.css';
import { useT, useLanguage, useDesc } from '../i18n';
import { commandFitMultiplier } from '../../game/systems/traitEffects';

interface Props {
  cityId: EntityId;
  commandType: InternalAffairsType;
  onClose: () => void;
}

export function OfficerPicker({ cityId, commandType, onClose }: Props) {
  const def = COMMAND_DEFS[commandType];
  const issueCommand = useGameStore((s) => s.issueCommand);
  const city = useGameStore((s) => s.cities[cityId]);
  const officersMap = useGameStore((s) => s.officers);
  const pendingTrainings = useGameStore((s) => s.pendingTrainings);
  const t = useT();
  const lang = useLanguage();
  const desc = useDesc();
  const trainingIds = useMemo(
    () => new Set(pendingTrainings.map((tr) => tr.officerId)),
    [pendingTrainings],
  );
  const officers = useMemo(
    () =>
      Object.values(officersMap)
        .filter(
          (o) =>
            o.locationCityId === cityId &&
            o.forceId === city?.ownerForceId &&
            o.status === 'idle' &&
            !o.task,
        )
        .sort((a, b) => {
          // Push training officers to the end so the live picks are first.
          const aT = trainingIds.has(a.id) ? 1 : 0;
          const bT = trainingIds.has(b.id) ? 1 : 0;
          if (aT !== bT) return aT - bT;
          // Trait-aware sort: stat × fit multiplier
          return (b.stats[def.stat] * commandFitMultiplier(b, commandType)) -
                 (a.stats[def.stat] * commandFitMultiplier(a, commandType));
        }),
    [officersMap, cityId, city?.ownerForceId, def.stat, trainingIds],
  );

  const handlePick = (officerId: EntityId) => {
    if (trainingIds.has(officerId)) return;
    const result = issueCommand(cityId, commandType, officerId);
    if (result.ok) onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div>
            {lang !== 'en' && <div className={styles.titleZh}>{def.label.zh}</div>}
            {lang !== 'zh' && <div className={styles.titleEn}>{def.label.en}</div>}
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </header>

        <div className={styles.meta}>
          <span>
            {t('耗費', 'Cost')}: <strong>{def.goldCost} {t('金', 'gold')}</strong>
          </span>
          <span>
            {t('使用屬性', 'Stat used')}: <strong>{def.stat}</strong>
          </span>
        </div>

        <p className={styles.desc}>{desc(def)}</p>

        <h3 className={styles.sectionTitle}>{t('選擇武將', 'Select officer')}</h3>
        {officers.length === 0 ? (
          <div className={styles.empty}>
            {t('此城無可用武將。', 'No available officers in this city.')}
          </div>
        ) : (
          <ul className={styles.officerList}>
            {officers.map((o) => {
              const isTraining = trainingIds.has(o.id);
              const fit = commandFitMultiplier(o, commandType);
              const recommended = fit >= 1.15;
              const liability = fit <= 0.85;
              return (
                <li key={o.id}>
                  <OfficerHoverCard officer={o}>
                    <button
                      className={styles.officerButton}
                      onClick={() => handlePick(o.id)}
                      disabled={isTraining}
                      title={
                        isTraining
                          ? t('武將正在書院培訓中,無法指派。', 'Officer is training at the academy — unavailable.')
                          : recommended
                            ? t('個性與此命令相宜 — 效果加成', 'Personality fits this command — bonus effect')
                            : liability
                              ? t('個性與此命令相剋 — 效果折扣', 'Personality clashes with this command — reduced effect')
                              : undefined
                      }
                      style={isTraining ? { opacity: 0.45, cursor: 'not-allowed', filter: 'grayscale(0.4)' } : undefined}
                    >
                      <span className={styles.officerNameZh}>
                        {recommended && <span style={{ color: '#d4a84a', marginRight: 4 }}>⭐</span>}
                        {liability && <span style={{ color: '#b8442e', marginRight: 4 }}>⚠</span>}
                        {o.name.zh}
                        {isTraining && <span style={{ marginLeft: '0.4rem', fontSize: '0.7rem', color: '#88b7e8', fontStyle: 'italic' }}>⏳ {t('培訓中', 'training')}</span>}
                      </span>
                      <span className={styles.officerNameEn}>{o.name.en}</span>
                      <span className={styles.officerStat}>
                        {def.stat.toUpperCase().slice(0, 3)}{' '}
                        <strong>{o.stats[def.stat]}</strong>
                      </span>
                    </button>
                  </OfficerHoverCard>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
