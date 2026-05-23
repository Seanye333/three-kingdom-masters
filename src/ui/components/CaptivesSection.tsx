import { useMemo, useState } from 'react';
import { useGameStore } from '../../game/state/store';
import { RECRUIT_COST } from '../../game/systems/officerFate';
import { playSfx } from '../../game/systems/sound';
import type { EntityId } from '../../game/types';
import { OfficerHoverCard } from './OfficerHoverCard';
import styles from './CaptivesSection.module.css';

interface Props {
  cityId: EntityId;
}

export function CaptivesSection({ cityId }: Props) {
  const officersMap = useGameStore((s) => s.officers);
  const cityGold = useGameStore((s) => s.cities[cityId]?.gold ?? 0);
  const recruitOfficer = useGameStore((s) => s.recruitOfficer);
  const executeOfficer = useGameStore((s) => s.executeOfficer);
  const releaseOfficer = useGameStore((s) => s.releaseOfficer);
  const [feedback, setFeedback] = useState<{
    officerId: EntityId;
    text: string;
    ok: boolean;
  } | null>(null);

  const captives = useMemo(
    () =>
      Object.values(officersMap).filter(
        (o) => o.locationCityId === cityId && o.status === 'imprisoned',
      ),
    [officersMap, cityId],
  );

  if (captives.length === 0) return null;

  const handleRecruit = (officerId: EntityId) => {
    const result = recruitOfficer(officerId, cityId);
    setFeedback({ officerId, text: result.message, ok: result.ok });
    playSfx(result.ok ? 'bell' : 'defeat');
  };

  return (
    <section className={styles.root}>
      <h3 className={styles.title}>Captives 捕虜 ({captives.length})</h3>
      <ul className={styles.list}>
        {captives.map((o) => (
          <li key={o.id} className={styles.row}>
            <OfficerHoverCard officer={o}>
              <div className={styles.head}>
                <span className={styles.nameZh}>{o.name.zh}</span>
                <span className={styles.nameEn}>{o.name.en}</span>
                <span className={styles.stats}>
                  W{o.stats.war} I{o.stats.intelligence} P{o.stats.politics} C
                  {o.stats.charisma} · Loyalty {o.loyalty}
                </span>
              </div>
            </OfficerHoverCard>
            {feedback?.officerId === o.id && (
              <div
                className={`${styles.feedback} ${feedback.ok ? styles.feedbackOk : styles.feedbackFail}`}
              >
                {feedback.text}
              </div>
            )}
            <div className={styles.actions}>
              <button
                className={styles.recruitBtn}
                onClick={() => handleRecruit(o.id)}
                disabled={cityGold < RECRUIT_COST}
                title={
                  cityGold < RECRUIT_COST
                    ? `Need ${RECRUIT_COST} gold`
                    : `Persuade ${o.name.en} to join (${RECRUIT_COST}g)`
                }
              >
                招降 Recruit ({RECRUIT_COST}g)
              </button>
              <button
                className={styles.releaseBtn}
                onClick={() => releaseOfficer(o.id)}
              >
                釋放 Release
              </button>
              <button
                className={styles.executeBtn}
                onClick={() => executeOfficer(o.id)}
              >
                斬首 Execute
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
