import { useMemo, useState } from 'react';
import { useGameStore } from '../../game/state/store';
import { COMMAND_DEFS } from '../../game/systems/commands';
import { BattlePrepModal } from './BattlePrepModal';
import type { EntityId } from '../../game/types';
import { OfficerHoverCard } from './OfficerHoverCard';
import styles from './MarchPicker.module.css';

interface Props {
  cityId: EntityId;
  onClose: () => void;
}

export function MarchPicker({ cityId, onClose }: Props) {
  const def = COMMAND_DEFS['march'];
  const issueMarch = useGameStore((s) => s.issueMarch);
  const source = useGameStore((s) => s.cities[cityId]);
  const cities = useGameStore((s) => s.cities);
  const forces = useGameStore((s) => s.forces);
  const officersMap = useGameStore((s) => s.officers);
  const [showPrep, setShowPrep] = useState(false);

  const officers = useMemo(
    () =>
      Object.values(officersMap)
        .filter(
          (o) =>
            o.locationCityId === cityId &&
            o.forceId === source?.ownerForceId &&
            o.status === 'idle' &&
            !o.task,
        )
        .sort((a, b) => b.stats.leadership - a.stats.leadership),
    [officersMap, cityId, source?.ownerForceId],
  );

  const adjacentCities = useMemo(
    () =>
      (source?.adjacentCityIds ?? [])
        .map((id) => cities[id])
        .filter((c) => !!c),
    [source?.adjacentCityIds, cities],
  );

  const [targetId, setTargetId] = useState<EntityId | null>(
    adjacentCities[0]?.id ?? null,
  );
  const [officerId, setOfficerId] = useState<EntityId | null>(
    officers[0]?.id ?? null,
  );
  const [additionalIds, setAdditionalIds] = useState<EntityId[]>([]);
  const [troops, setTroops] = useState<number>(
    Math.min(2000, source?.troops ?? 0),
  );

  const toggleAdditional = (id: EntityId) => {
    setAdditionalIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return prev; // cap at 2
      return [...prev, id];
    });
  };

  if (!source) return null;
  const target = targetId ? cities[targetId] : null;
  const targetForce = target?.ownerForceId
    ? forces[target.ownerForceId]
    : null;
  const isHostile =
    !!target && target.ownerForceId !== source.ownerForceId;
  const officer = officerId ? officersMap[officerId] : null;
  const maxTroops = source.troops;
  const canAfford = source.gold >= def.goldCost;
  const valid =
    !!targetId &&
    !!officerId &&
    troops > 0 &&
    troops <= maxTroops &&
    canAfford;

  const handleConfirm = () => {
    if (!valid || !targetId || !officerId) return;
    const extras = additionalIds.filter((id) => id !== officerId);
    const r = issueMarch(cityId, targetId, officerId, troops, extras);
    if (r.ok) onClose();
  };

  const handleTactical = () => {
    if (!valid || !targetId || !officerId || !target) return;
    setShowPrep(true);
  };

  const adjustTroops = (delta: number) => {
    setTroops((t) => Math.max(0, Math.min(maxTroops, t + delta)));
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div>
            <div className={styles.titleZh}>{def.label.zh}</div>
            <div className={styles.titleEn}>{def.label.en}</div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </header>

        <div className={styles.row}>
          <span className={styles.rowLabel}>From</span>
          <span className={styles.rowValue}>
            {source.name.zh} {source.name.en}
            <span className={styles.muted}>
              {' '}· {source.troops.toLocaleString()} troops · {source.gold.toLocaleString()} gold
            </span>
          </span>
        </div>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Target 目標</h3>
          {adjacentCities.length === 0 ? (
            <div className={styles.empty}>No adjacent cities.</div>
          ) : (
            <ul className={styles.targetList}>
              {adjacentCities.map((c) => {
                const f = c.ownerForceId ? forces[c.ownerForceId] : null;
                const hostile = c.ownerForceId !== source.ownerForceId;
                return (
                  <li key={c.id}>
                    <button
                      className={`${styles.targetButton} ${targetId === c.id ? styles.targetSelected : ''}`}
                      onClick={() => setTargetId(c.id)}
                    >
                      <span
                        className={styles.colorDot}
                        style={{ background: f?.color ?? '#5a4530' }}
                      />
                      <span className={styles.targetText}>
                        <span className={styles.targetNameZh}>{c.name.zh}</span>
                        <span className={styles.targetNameEn}>
                          {c.name.en} · {f?.name.en ?? 'Neutral'}
                        </span>
                      </span>
                      <span className={styles.targetMeta}>
                        {hostile ? (
                          <span className={styles.hostile}>ATK</span>
                        ) : (
                          <span className={styles.friendly}>MOVE</span>
                        )}
                        <span className={styles.muted}>
                          {c.troops.toLocaleString()}t · D{c.defense}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Commander 大将</h3>
          {officers.length === 0 ? (
            <div className={styles.empty}>No available officers.</div>
          ) : (
            <div className={styles.officerGrid}>
              {officers.map((o) => (
                <OfficerHoverCard key={o.id} officer={o}>
                  <button
                    className={`${styles.officerButton} ${officerId === o.id ? styles.officerSelected : ''}`}
                    onClick={() => setOfficerId(o.id)}
                  >
                    <span className={styles.officerNameZh}>{o.name.zh}</span>
                    <span className={styles.officerNameEn}>{o.name.en}</span>
                    <span className={styles.officerWar}>
                      LED <strong>{o.stats.leadership}</strong> · WAR{' '}
                      <strong>{o.stats.war}</strong>
                    </span>
                  </button>
                </OfficerHoverCard>
              ))}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Accompanying Officers 副将 — {additionalIds.length} / 2
          </h3>
          <div className={styles.officerGrid}>
            {officers
              .filter((o) => o.id !== officerId)
              .map((o) => {
                const picked = additionalIds.includes(o.id);
                const disabled = !picked && additionalIds.length >= 2;
                return (
                  <OfficerHoverCard key={o.id} officer={o}>
                    <button
                      className={`${styles.officerButton} ${picked ? styles.officerSelected : ''}`}
                      onClick={() => toggleAdditional(o.id)}
                      disabled={disabled}
                      style={disabled ? { opacity: 0.35, cursor: 'not-allowed' } : undefined}
                    >
                      <span className={styles.officerNameZh}>
                        {picked ? '✓ ' : ''}
                        {o.name.zh}
                      </span>
                      <span className={styles.officerNameEn}>{o.name.en}</span>
                      <span className={styles.officerWar}>
                        LED <strong>{o.stats.leadership}</strong> · WAR{' '}
                        <strong>{o.stats.war}</strong>
                      </span>
                    </button>
                  </OfficerHoverCard>
                );
              })}
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            Troops 兵力 — {troops.toLocaleString()} / {maxTroops.toLocaleString()}
          </h3>
          <div className={styles.troopRow}>
            <button onClick={() => adjustTroops(-1000)}>−1k</button>
            <button onClick={() => adjustTroops(-100)}>−100</button>
            <input
              type="range"
              min={0}
              max={maxTroops}
              step={100}
              value={troops}
              onChange={(e) => setTroops(Number(e.target.value))}
              className={styles.slider}
            />
            <button onClick={() => adjustTroops(100)}>+100</button>
            <button onClick={() => adjustTroops(1000)}>+1k</button>
            <button
              className={styles.allButton}
              onClick={() => setTroops(maxTroops)}
            >
              ALL
            </button>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.footerMeta}>
            Cost: <strong>{def.goldCost}g</strong>
            {target && officer && (
              <>
                {' '}· {isHostile ? 'Attack' : 'Transfer'}{' '}
                <strong>{target.name.en}</strong>
                {targetForce && (
                  <span className={styles.muted}>
                    {' '}({targetForce.name.en})
                  </span>
                )}
              </>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {isHostile && (
              <button
                className={styles.confirmButton}
                onClick={handleTactical}
                disabled={!valid}
                style={{ background: '#3a2d20', borderColor: '#88b7e8', color: '#88b7e8' }}
                title="Resolve as turn-based tactical battle"
              >
                戰術 Tactical
              </button>
            )}
            <button
              className={styles.confirmButton}
              onClick={handleConfirm}
              disabled={!valid}
            >
              {isHostile ? '出陣 March!' : '移動 Move'}
            </button>
          </div>
        </footer>
      </div>
      {showPrep && targetId && officerId && (
        <BattlePrepModal
          sourceCityId={cityId}
          targetCityId={targetId}
          commanderId={officerId}
          companionIds={additionalIds.filter((id) => id !== officerId)}
          totalTroops={troops}
          onClose={() => {
            setShowPrep(false);
            onClose();
          }}
        />
      )}
    </div>
  );
}
