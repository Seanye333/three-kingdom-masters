import { useMemo, useState } from 'react';
import { useGameStore } from '../../game/state/store';
import { FREE_AGENT_COST } from '../../game/systems/officerFate';
import { playSfx } from '../../game/systems/sound';
import type { EntityId } from '../../game/types';
import { OfficerHoverCard } from './OfficerHoverCard';
import styles from './FreeAgentsSection.module.css';

interface Props {
  cityId: EntityId;
  isPlayerCity: boolean;
}

export function FreeAgentsSection({ cityId, isPlayerCity }: Props) {
  const officersMap = useGameStore((s) => s.officers);
  const cityGold = useGameStore((s) => s.cities[cityId]?.gold ?? 0);
  const recruitFreeAgent = useGameStore((s) => s.recruitFreeAgent);
  const [feedback, setFeedback] = useState<{
    officerId: EntityId;
    text: string;
    ok: boolean;
  } | null>(null);

  const agents = useMemo(
    () =>
      Object.values(officersMap).filter(
        (o) =>
          o.locationCityId === cityId &&
          o.status === 'idle' &&
          o.forceId === null,
      ),
    [officersMap, cityId],
  );

  if (agents.length === 0) return null;

  const handleRecruit = (officerId: EntityId) => {
    const result = recruitFreeAgent(officerId, cityId);
    setFeedback({ officerId, text: result.message, ok: result.ok });
    playSfx(result.ok ? 'bell' : 'defeat');
  };

  return (
    <section className={styles.root}>
      <h3 className={styles.title}>Free Agents 浪人 ({agents.length})</h3>
      <ul className={styles.list}>
        {agents.map((o) => (
          <li key={o.id} className={styles.row}>
            <OfficerHoverCard officer={o}>
              <div className={styles.head}>
                <span className={styles.nameZh}>{o.name.zh}</span>
                <span className={styles.nameEn}>
                  {o.name.en}
                  {o.courtesyName && (
                    <span className={styles.courtesy}>
                      {' '}({o.courtesyName.en})
                    </span>
                  )}
                </span>
                <span className={styles.stats}>
                  W{o.stats.war} I{o.stats.intelligence} P{o.stats.politics} C
                  {o.stats.charisma}
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
            {isPlayerCity && (
              <div className={styles.actions}>
                <button
                  className={styles.recruitBtn}
                  onClick={() => handleRecruit(o.id)}
                  disabled={cityGold < FREE_AGENT_COST}
                  title={
                    cityGold < FREE_AGENT_COST
                      ? `Need ${FREE_AGENT_COST} gold`
                      : `Offer service (${FREE_AGENT_COST}g)`
                  }
                >
                  招聘 Hire ({FREE_AGENT_COST}g)
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
