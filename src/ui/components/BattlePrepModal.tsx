import { useMemo, useState } from 'react';
import { FORMATIONS, NAMED_MAPS_BY_CITY, NAMED_MAPS_BY_ID } from '../../game/data';
import { inferUnitType, setupTacticalBattle } from '../../game/systems/tactical';
import { resolveWordWar, type WordWarResult } from '../../game/systems/wordWar';
import { useGameStore } from '../../game/state/store';
import type {
  EntityId,
  FormationId,
  Officer,
  UnitType,
} from '../../game/types';
import { WordWarModal } from './WordWarModal';
import styles from './BattlePrepModal.module.css';

interface Props {
  sourceCityId: EntityId;
  targetCityId: EntityId;
  commanderId: EntityId;
  companionIds: EntityId[];
  totalTroops: number;
  onClose: () => void;
}

const UNIT_TYPES: UnitType[] = ['infantry', 'spearmen', 'cavalry', 'archers', 'siege', 'navy'];
const UNIT_TYPE_LABEL: Record<UnitType, string> = {
  infantry: '歩 Infantry',
  spearmen: '槍 Spearmen',
  cavalry: '騎 Cavalry',
  archers: '弓 Archers',
  siege: '攻 Siege',
  navy: '水 Navy',
};

export function BattlePrepModal({
  sourceCityId,
  targetCityId,
  commanderId,
  companionIds,
  totalTroops,
  onClose,
}: Props) {
  const officers = useGameStore((s) => s.officers);
  const cities = useGameStore((s) => s.cities);
  const startTactical = useGameStore((s) => s.startTacticalBattle);

  const source = cities[sourceCityId];
  const target = cities[targetCityId];

  const ourOfficers = useMemo(
    () =>
      [commanderId, ...companionIds]
        .map((id) => officers[id])
        .filter((o): o is Officer => !!o),
    [commanderId, companionIds, officers],
  );

  const defenders = useMemo(
    () =>
      Object.values(officers)
        .filter(
          (o) =>
            o.locationCityId === targetCityId &&
            o.forceId === target?.ownerForceId &&
            o.status === 'idle',
        )
        .sort((a, b) => b.stats.war - a.stats.war)
        .slice(0, 4),
    [officers, targetCityId, target?.ownerForceId],
  );

  // Per-officer settings.
  const [unitTypes, setUnitTypes] = useState<Record<EntityId, UnitType>>(() => {
    const init: Record<EntityId, UnitType> = {};
    for (const o of ourOfficers) init[o.id] = inferUnitType(o);
    return init;
  });

  const [troopShares, setTroopShares] = useState<Record<EntityId, number>>(() => {
    const init: Record<EntityId, number> = {};
    const base = Math.floor(totalTroops / ourOfficers.length);
    for (const o of ourOfficers) init[o.id] = base;
    if (ourOfficers.length > 0) {
      init[ourOfficers[0].id] = totalTroops - base * (ourOfficers.length - 1);
    }
    return init;
  });

  const [formation, setFormation] = useState<FormationId>('none');
  const [wordWar, setWordWar] = useState<WordWarResult | null>(null);
  const [pendingBattle, setPendingBattle] = useState<ReturnType<typeof setupTacticalBattle> | null>(null);

  const namedMapId = NAMED_MAPS_BY_CITY[targetCityId];
  const namedMap = namedMapId ? NAMED_MAPS_BY_ID[namedMapId] : undefined;

  const troopSum = useMemo(
    () => Object.values(troopShares).reduce((s, n) => s + n, 0),
    [troopShares],
  );

  const canEngage = troopSum === totalTroops && ourOfficers.length > 0;

  const engage = () => {
    if (!canEngage || !source || !target) return;
    const attackers = ourOfficers.map((o) => ({
      officer: o,
      troops: troopShares[o.id],
      unitType: unitTypes[o.id],
    }));
    const dCount = Math.max(1, defenders.length);
    const dPerOfficer = Math.floor(target.troops / dCount);
    const defenderEntries = defenders.length === 0
      ? []
      : defenders.map((o, i) => ({
          officer: o,
          troops: i === 0 ? target.troops - dPerOfficer * (dCount - 1) : dPerOfficer,
        }));

    const battle = setupTacticalBattle({
      cityId: target.id,
      width: namedMap?.width ?? 10,
      height: namedMap?.height ?? 7,
      attackerForceId: source.ownerForceId,
      defenderForceId: target.ownerForceId,
      attackers,
      defenders: defenderEntries,
      attackerFormation: formation,
    });

    // 舌戰 — if both sides have an officer with INT ≥ 80, run a war of words first.
    const aLead = ourOfficers.find((o) => o.stats.intelligence >= 80);
    const dLead = defenders.find((o) => o.stats.intelligence >= 80);
    if (aLead && dLead) {
      const ww = resolveWordWar(ourOfficers[0], defenders[0], ourOfficers.slice(1), defenders.slice(1));
      // Apply the morale modifier to the battle's units.
      const adjusted = {
        ...battle,
        units: battle.units.map((u) => ({
          ...u,
          morale: Math.max(0, Math.min(100, u.morale + (u.side === 'attacker' ? ww.attackerMoraleDelta : ww.defenderMoraleDelta))),
        })),
      };
      setPendingBattle(adjusted);
      setWordWar(ww);
      return;
    }

    startTactical(battle);
    onClose();
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div>
            <div className={styles.titleZh}>戰闘準備</div>
            <div className={styles.titleEn}>
              Battle Preparation: {source?.name.en} → {target?.name.en}
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </header>

        <div className={styles.body}>
          <div className={styles.context}>
            <div className={styles.ctxCard}>
              <div className={styles.ctxLabel}>Map 戰場</div>
              <div className={styles.ctxValue}>
                {namedMap ? namedMap.name.zh + ' ' + namedMap.name.en : 'Procedural'}
              </div>
            </div>
            <div className={styles.ctxCard}>
              <div className={styles.ctxLabel}>Weather 天候</div>
              <div className={styles.ctxValue}>{namedMap?.weather ?? 'clear'}</div>
            </div>
            <div className={styles.ctxCard}>
              <div className={styles.ctxLabel}>Time 時刻</div>
              <div className={styles.ctxValue}>{namedMap?.timeOfDay ?? 'day'}</div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>
              Officers & unit type — total troops {totalTroops.toLocaleString()}
            </div>
            {ourOfficers.map((o) => (
              <div key={o.id} className={styles.unitRow}>
                <div>
                  <span className={styles.unitName}>{o.name.zh}</span>
                  <span className={styles.unitNameEn}>{o.name.en}</span>
                </div>
                <div className={styles.unitStat}>
                  W{o.stats.war} L{o.stats.leadership} I{o.stats.intelligence}
                </div>
                <select
                  className={styles.typeSelect}
                  value={unitTypes[o.id]}
                  onChange={(e) => setUnitTypes((u) => ({ ...u, [o.id]: e.target.value as UnitType }))}
                >
                  {UNIT_TYPES.map((t) => (
                    <option key={t} value={t}>{UNIT_TYPE_LABEL[t]}</option>
                  ))}
                </select>
                <input
                  className={styles.troopInput}
                  type="number"
                  min={0}
                  max={totalTroops}
                  value={troopShares[o.id]}
                  onChange={(e) => setTroopShares((s) => ({ ...s, [o.id]: Math.max(0, Number(e.target.value) || 0) }))}
                />
              </div>
            ))}
            <div className={styles.unitStat} style={{ textAlign: 'right' }}>
              Allocated: {troopSum.toLocaleString()} / {totalTroops.toLocaleString()}
              {troopSum !== totalTroops && (
                <span style={{ color: '#b8442e', marginLeft: '0.5rem' }}>
                  ({troopSum < totalTroops ? '−' : '+'}{Math.abs(totalTroops - troopSum)})
                </span>
              )}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>Formation 陣形</div>
            <div className={styles.formGrid}>
              {FORMATIONS.map((f) => {
                const cmd = ourOfficers[0];
                const eligible = cmd ? cmd.stats.intelligence >= f.minIntelligence : true;
                return (
                  <button
                    key={f.id}
                    className={`${styles.formCard} ${formation === f.id ? styles.formCardActive : ''}`}
                    disabled={!eligible}
                    onClick={() => setFormation(f.id)}
                    style={!eligible ? { opacity: 0.45 } : undefined}
                  >
                    <div>
                      <span className={styles.formName}>{f.name.zh}</span>
                      <span className={styles.formNameEn}>{f.name.en}</span>
                    </div>
                    <div className={styles.formDesc}>{f.description}</div>
                    <div style={{ fontSize: '0.65rem', color: '#8a7050' }}>
                      req INT {f.minIntelligence}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.engageBtn} onClick={engage} disabled={!canEngage}>
            出陣 Engage
          </button>
        </div>
      </div>
      {wordWar && pendingBattle && (
        <WordWarModal
          result={wordWar}
          onClose={() => {
            startTactical(pendingBattle);
            setWordWar(null);
            setPendingBattle(null);
            onClose();
          }}
        />
      )}
    </div>
  );
}
