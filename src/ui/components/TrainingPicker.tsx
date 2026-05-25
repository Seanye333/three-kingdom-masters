import { useMemo, useState } from 'react';
import { useGameStore } from '../../game/state/store';
import { POLICY_DEFS } from '../../game/data/officerAttributes';
import { trainingCost, eligiblePolicies, cityHasAcademy } from '../../game/systems/training';
import type { EntityId, Officer, PolicyId } from '../../game/types';
import { useT, useLanguage } from '../i18n';
import styles from './OfficerPicker.module.css';

interface Props {
  cityId: EntityId;
  onClose: () => void;
}

/**
 * Academy training picker — pick an idle officer in this city, then pick a
 * policy they're eligible to learn. Locked policies are visible (so the
 * player can plan ahead) but greyed out with the missing-prereq listed.
 */
export function TrainingPicker({ cityId, onClose }: Props) {
  const city = useGameStore((s) => s.cities[cityId]);
  const officers = useGameStore((s) => s.officers);
  const buildings = useGameStore((s) => s.buildings);
  const pendingTrainings = useGameStore((s) => s.pendingTrainings);
  const startTraining = useGameStore((s) => s.startTraining);
  const t = useT();
  const lang = useLanguage();

  const eligibleOfficers = useMemo(
    () =>
      Object.values(officers).filter(
        (o) =>
          o.locationCityId === cityId &&
          o.forceId === city?.ownerForceId &&
          o.status === 'idle' &&
          !o.task &&
          !pendingTrainings.some((p) => p.officerId === o.id),
      ),
    [officers, cityId, city?.ownerForceId, pendingTrainings],
  );

  const [pickedOfficer, setPickedOfficer] = useState<Officer | null>(
    eligibleOfficers[0] ?? null,
  );
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!city) return null;
  if (!cityHasAcademy(city, buildings)) {
    return (
      <div className={styles.backdrop} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <header className={styles.header}>
            <div className={styles.titleZh}>{t('書院培訓', 'Academy Training')}</div>
            <button className={styles.closeButton} onClick={onClose}>×</button>
          </header>
          <div style={{ padding: '1rem 1.25rem', color: '#c0a878' }}>
            {t('此城尚未建造書院。先建一座再來。', 'No academy built in this city. Build one first.')}
          </div>
        </div>
      </div>
    );
  }

  const cost = pickedOfficer ? trainingCost(pickedOfficer) : 0;
  const { available, locked } = pickedOfficer
    ? eligiblePolicies(pickedOfficer)
    : { available: [] as PolicyId[], locked: [] as Array<{ id: PolicyId; missing: PolicyId[] }> };

  const handlePick = (policyId: PolicyId) => {
    if (!pickedOfficer) return;
    const r = startTraining(pickedOfficer.id, cityId, policyId);
    if (r.ok) {
      setFeedback(t('培訓開始,1 季後完成。', 'Training begun — completes in 1 season.'));
      setTimeout(onClose, 1000);
    } else {
      setFeedback(r.reason ?? t('無法開始培訓。', 'Cannot start training.'));
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div>
            <div className={styles.titleZh}>{t('書院培訓', 'Academy Training')}</div>
            <div className={styles.titleEn}>
              {lang === 'en' ? city.name.en : city.name.zh} · {t('金錢', 'Gold')} {city.gold}
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </header>

        <div style={{ padding: '0.5rem 1.25rem', background: '#1a1410', borderBottom: '1px solid #4a3520' }}>
          <div style={{ fontSize: '0.7rem', color: '#8a7050', marginBottom: '0.3rem' }}>
            {t('選武將', 'Pick officer')}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {eligibleOfficers.length === 0 && (
              <span style={{ color: '#8a7050', fontStyle: 'italic', fontSize: '0.78rem' }}>
                {t('無閒置武將', 'No idle officers')}
              </span>
            )}
            {eligibleOfficers.map((o) => (
              <button
                key={o.id}
                onClick={() => { setPickedOfficer(o); setFeedback(null); }}
                style={{
                  background: pickedOfficer?.id === o.id ? '#3a2d20' : 'transparent',
                  border: '1px solid ' + (pickedOfficer?.id === o.id ? '#d4a84a' : '#4a3520'),
                  color: pickedOfficer?.id === o.id ? '#d4a84a' : '#c0a878',
                  padding: '0.25rem 0.6rem',
                  fontFamily: 'inherit', fontSize: '0.8rem',
                  letterSpacing: '0.1rem', cursor: 'pointer',
                }}
              >
                {lang === 'en' ? o.name.en : o.name.zh}
                <span style={{ marginLeft: 4, fontSize: '0.65rem', color: '#8a7050' }}>
                  ({(o.policies ?? []).length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {pickedOfficer && (
          <>
            <div style={{ padding: '0.5rem 1.25rem', fontSize: '0.78rem', color: '#c0a878' }}>
              {t('費用', 'Cost')}: <strong style={{ color: city.gold >= cost ? '#d4a84a' : '#b8442e' }}>{cost} {t('金', 'gold')}</strong>
              {' · '}{t('時程', 'Duration')}: 1 {t('季', 'season')}
              {' · '}{t('政策', 'Policies')}: {(pickedOfficer.policies ?? []).length} / 8
            </div>

            <div style={{ overflow: 'auto', maxHeight: '50vh', padding: '0.5rem 1.25rem' }}>
              {available.length === 0 && (
                <div style={{ color: '#8a7050', fontStyle: 'italic', fontSize: '0.78rem', padding: '0.5rem 0' }}>
                  {t('此武將已掌握所有基礎政策,先學進階前置才能繼續。', 'Officer already knows all base policies — needs upstream learnings to unlock more.')}
                </div>
              )}
              {available.length > 0 && (
                <>
                  <div style={{ fontSize: '0.7rem', color: '#7ed68a', letterSpacing: '0.15rem', margin: '0.3rem 0' }}>
                    {t('可學', 'Available')} ({available.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {available.map((pid) => {
                      const p = POLICY_DEFS[pid];
                      return (
                        <button
                          key={pid}
                          onClick={() => handlePick(pid)}
                          disabled={city.gold < cost}
                          style={{
                            background: '#1a1410',
                            border: '1px solid #7a9a5a',
                            color: '#7a9a5a',
                            padding: '0.3rem 0.55rem',
                            fontFamily: 'inherit', fontSize: '0.78rem',
                            letterSpacing: '0.1rem',
                            cursor: city.gold >= cost ? 'pointer' : 'not-allowed',
                            opacity: city.gold >= cost ? 1 : 0.5,
                          }}
                        >
                          {lang === 'en' ? p?.en : p?.zh}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {locked.length > 0 && (
                <>
                  <div style={{ fontSize: '0.7rem', color: '#8a7050', letterSpacing: '0.15rem', margin: '0.6rem 0 0.3rem' }}>
                    🔒 {t('需先學前置', 'Locked — need prerequisite')} ({locked.length})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {locked.slice(0, 30).map(({ id, missing }) => {
                      const p = POLICY_DEFS[id];
                      const missLabel = missing.map((m) => POLICY_DEFS[m]?.zh ?? m).join('、');
                      return (
                        <span
                          key={id}
                          title={t(`需先學:${missLabel}`, `Needs: ${missing.map((m) => POLICY_DEFS[m]?.en ?? m).join(', ')}`)}
                          style={{
                            background: 'rgba(90, 70, 60, 0.4)',
                            border: '1px dashed rgba(138, 112, 80, 0.6)',
                            color: '#8a7050',
                            padding: '0.3rem 0.55rem', fontSize: '0.78rem',
                            letterSpacing: '0.1rem',
                          }}
                        >
                          🔒 {lang === 'en' ? p?.en : p?.zh}
                        </span>
                      );
                    })}
                    {locked.length > 30 && (
                      <span style={{ color: '#8a7050', fontSize: '0.7rem', alignSelf: 'center' }}>
                        +{locked.length - 30} {t('項', 'more')}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {feedback && (
          <div style={{ padding: '0.5rem 1.25rem', color: '#d4a84a', fontSize: '0.85rem', textAlign: 'center' }}>
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
}
