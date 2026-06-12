import { useMemo, useState } from 'react';
import { useGameStore } from '../../game/state/store';
import { COMMAND_DEFS, meetsMinSize } from '../../game/systems/commands';
import { citySize, CITY_SIZES_BY_ID } from '../../game/systems/citySize';
import type { EntityId, InternalAffairsType } from '../../game/types';
import { MarchPicker } from './MarchPicker';
import { TrainingPicker } from './TrainingPicker';
import { cityHasAcademy, cityHasMentors } from '../../game/systems/training';
import { OfficerPicker } from './OfficerPicker';
import styles from './CommandMenu.module.css';
import { useT, useLanguage, useDesc } from '../i18n';

interface Props {
  cityId: EntityId;
}

const EMPTY_DELEGATIONS: Record<string, string> = {};

const INTERNAL_ORDER: InternalAffairsType[] = [
  // ── Basic (always available) ──
  'develop-agriculture',
  'develop-commerce',
  'build-defense',
  'recruit-troops',
  'improve-loyalty',
  'garrison',
  'search',
  'encourage-migration',
  // ── Tier-2 (requires 城 tier+) ──
  'major-agriculture',
  'major-commerce',
  'major-defense',
  'upgrade-wall',
];

type ModalState =
  | { kind: 'closed' }
  | { kind: 'internal'; type: InternalAffairsType }
  | { kind: 'march' }
  | { kind: 'training' }
  | { kind: 'drill' };

export function CommandMenu({ cityId }: Props) {
  const [modal, setModal] = useState<ModalState>({ kind: 'closed' });
  const city = useGameStore((s) => s.cities[cityId]);
  // Select the map by reference (stable) — filter inside useMemo to avoid creating
  // a new array on every render (which would trigger an infinite re-render loop).
  const allPending = useGameStore((s) => s.pendingCommands);
  const pendingInCity = useMemo(
    () => Object.values(allPending).filter((c) => c.cityId === cityId),
    [allPending, cityId],
  );
  const officersMap = useGameStore((s) => s.officers);
  const citiesMap = useGameStore((s) => s.cities);
  const cancelCommand = useGameStore((s) => s.cancelCommand);
  const buildings = useGameStore((s) => s.buildings);
  const delegations = useGameStore((s) => s.cityDelegations ?? EMPTY_DELEGATIONS);
  const delegateCity = useGameStore((s) => s.delegateCity);
  const pendingTrainings = useGameStore((s) => s.pendingTrainings);
  const playerForceId = useGameStore((s) => s.playerForceId);
  const t = useT();
  const lang = useLanguage();
  const desc = useDesc();

  // 演習 — needs at least one stationed officer to take the field.
  const garrisonCount = useMemo(
    () => Object.values(officersMap).filter(
      (o) => o.locationCityId === cityId && o.forceId === playerForceId
        && o.status !== 'dead' && o.status !== 'unsearched' && o.status !== 'imprisoned',
    ).length,
    [officersMap, cityId, playerForceId],
  );

  if (!city) return null;

  const marchDef = COMMAND_DEFS['march'];
  const canMarch = city.gold >= marchDef.goldCost && city.troops > 0;

  const stationed = Object.values(officersMap).filter(
    (o) => o.locationCityId === cityId && o.forceId === playerForceId
      && o.status !== 'dead' && o.status !== 'unsearched' && o.status !== 'imprisoned',
  );
  const governorId = delegations[cityId];
  const governor = governorId ? officersMap[governorId] : null;

  return (
    <>
      {/* 委任太守 — hand the city to a governor; every tick they file one
          internal command for you through the normal pipeline. */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
        background: governor ? 'rgba(126, 214, 138, 0.08)' : 'rgba(20, 14, 8, 0.5)',
        border: `1px solid ${governor ? '#5a8a50' : '#3a2d20'}`,
        padding: '0.35rem 0.6rem', marginBottom: '0.5rem',
        fontFamily: 'Songti SC, serif', fontSize: '0.78rem', color: '#c0a878',
      }}>
        <span>
          {t('太守', 'Governor')}{governor ? `:${lang === 'en' ? governor.name.en : governor.name.zh}` : ''}
          <span style={{ display: 'block', fontSize: '0.6rem', color: '#8a7050' }}>
            {governor
              ? t('已委任 — 每旬自動施政', 'Delegated — auto-governs each tick')
              : t('委任後此城自動內政', 'Delegate to auto-run internal affairs')}
          </span>
        </span>
        <select
          value={governorId ?? ''}
          onChange={(e) => delegateCity(cityId, e.target.value || null)}
          style={{
            background: '#0a0805', border: '1px solid #4a3520', color: '#d4a84a',
            padding: '0.2rem', fontFamily: 'inherit', fontSize: '0.72rem', maxWidth: 130,
          }}
        >
          <option value="">{t('親自治理', 'Rule directly')}</option>
          {stationed.map((o) => (
            <option key={o.id} value={o.id}>
              {lang === 'en' ? o.name.en : o.name.zh}({t('政', 'P')}{o.stats.politics})
            </option>
          ))}
        </select>
      </div>
      {/* Currently pending commands in this city — one per assigned officer */}
      {pendingInCity.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '0.5rem' }}>
          {pendingInCity.map((cmd) => {
            const officer = officersMap[cmd.officerId];
            if (!officer) return null;
            const def = COMMAND_DEFS[cmd.type];
            const targetCity = cmd.type === 'march' ? citiesMap[cmd.targetCityId] : null;
            return (
              <div key={cmd.officerId} className={styles.activeCmd}>
                <div className={styles.activeRow}>
                  <div className={styles.activeText}>
                    <span className={styles.activeLabel}>
                      {lang === 'en' ? def.label.en : lang === 'both' ? `${def.label.zh} · ${def.label.en}` : def.label.zh}
                    </span>
                    <span className={styles.activeOfficer}>
                      {t('由', 'by')} {lang === 'en' ? officer.name.en : officer.name.zh}
                      {cmd.type === 'march' && targetCity && (
                        <>
                          {' → '}
                          <strong>{lang === 'en' ? targetCity.name.en : targetCity.name.zh}</strong>
                          {' '}{t('率', 'with')}{' '}
                          {cmd.troops.toLocaleString()} {t('兵', 'troops')}
                        </>
                      )}
                    </span>
                  </div>
                  <button
                    className={styles.cancelButton}
                    onClick={() => cancelCommand(cmd.officerId)}
                    title={t('取消命令 (退還金錢)', 'Cancel command (refund gold)')}
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.menu}>
        {INTERNAL_ORDER.map((type) => {
          const def = COMMAND_DEFS[type];
          const canAfford = city.gold >= def.goldCost;
          const currentSize = citySize(city);
          const tierOk = meetsMinSize(currentSize.id, def.minSize);
          const minSizeDef = def.minSize ? CITY_SIZES_BY_ID[def.minSize] : null;
          const lockedReason = !tierOk && minSizeDef
            ? t(`需要 ${minSizeDef.name.zh}+ 級城市`, `Requires ${minSizeDef.name.en}+ tier`)
            : null;
          const reason = lockedReason ?? (!canAfford ? t('金錢不足', 'Not enough gold') : desc(def));
          if (!tierOk) return null;
          return (
            <button
              key={type}
              className={styles.cmdButton}
              onClick={() => setModal({ kind: 'internal', type })}
              disabled={!canAfford}
              title={reason}
            >
              <span className={styles.cmdLabelZh}>
                {lang === 'en' ? def.label.en : def.label.zh}
                {def.minSize && <span style={{ fontSize: '0.55rem', color: '#8a7050', marginLeft: 4 }}>★{lang === 'en' ? minSizeDef?.name.en : minSizeDef?.name.zh}+</span>}
              </span>
              {lang === 'both' && <span className={styles.cmdLabelEn}>{def.label.en}</span>}
              <span className={styles.cmdCost}>{def.goldCost}g</span>
            </button>
          );
        })}
        <button
          className={`${styles.cmdButton} ${styles.marchButton}`}
          onClick={() => setModal({ kind: 'march' })}
          disabled={!canMarch}
          title={
            !canMarch
              ? city.troops === 0
                ? t('無兵可出', 'No troops to march')
                : t('金錢不足', 'Not enough gold')
              : desc(marchDef)
          }
        >
          <span className={styles.cmdLabelZh}>{lang === 'en' ? marchDef.label.en : marchDef.label.zh}</span>
          {lang === 'both' && <span className={styles.cmdLabelEn}>{marchDef.label.en}</span>}
          <span className={styles.cmdCost}>{marchDef.goldCost}g</span>
        </button>
        <button
          className={styles.cmdButton}
          onClick={() => setModal({ kind: 'drill' })}
          disabled={garrisonCount === 0}
          title={
            garrisonCount === 0
              ? t('需有武將駐城方可演習', 'Need a stationed officer to drill')
              : t('守城演習 — 在本城真實戰場(城牆+你建的箭樓拒馬)上操演守備,不損兵將', 'Siege drill — defend this city\'s real battlefield (walls + the towers/traps you built). No losses; practice only.')
          }
          style={{ borderColor: '#7ed68a' }}
        >
          <span className={styles.cmdLabelZh}>{t('演習', 'Drill')}</span>
          {lang === 'both' && <span className={styles.cmdLabelEn}>Drill</span>}
          <span className={styles.cmdCost}>{t('練', 'free')}</span>
        </button>
        {(cityHasAcademy(city, buildings) || cityHasMentors(city, officersMap, pendingTrainings)) && (() => {
          const hasAcad = cityHasAcademy(city, buildings);
          const label = hasAcad ? t('書院培訓', 'Academy Training') : t('師徒傳授', 'Mentor Teaching');
          const labelEn = hasAcad ? 'Academy' : 'Mentor';
          const tip = hasAcad
            ? t('書院培訓 — 武將學一個新政策(費用視政策難度而定)', 'Academy training — train an officer in a new policy (cost varies by tier)')
            : t('師徒傳授 — 同城武將傳授其已通政策,無需書院,免費但較慢', 'Mentor teaching — a senior officer teaches a policy they know, no academy needed, free but slower');
          return (
            <button
              className={styles.cmdButton}
              onClick={() => setModal({ kind: 'training' })}
              title={tip}
              style={{ borderColor: hasAcad ? '#88b7e8' : '#7ed68a' }}
            >
              <span className={styles.cmdLabelZh}>{lang === 'en' ? labelEn : label}</span>
              {lang === 'both' && <span className={styles.cmdLabelEn}>{labelEn}</span>}
              <span className={styles.cmdCost}>{t('政', 'policy')}</span>
            </button>
          );
        })()}
      </div>

      {modal.kind === 'internal' && (
        <OfficerPicker
          cityId={cityId}
          commandType={modal.type}
          onClose={() => setModal({ kind: 'closed' })}
        />
      )}
      {modal.kind === 'march' && (
        <MarchPicker
          cityId={cityId}
          onClose={() => setModal({ kind: 'closed' })}
        />
      )}
      {modal.kind === 'training' && (
        <TrainingPicker
          cityId={cityId}
          onClose={() => setModal({ kind: 'closed' })}
        />
      )}
      {modal.kind === 'drill' && (
        <DrillPicker
          cityId={cityId}
          onClose={() => setModal({ kind: 'closed' })}
        />
      )}
    </>
  );
}

/** 演習點將 — pick which stationed officers take the field for the drill
 *  (the garrison's best six come pre-checked; cap six per side). */
function DrillPicker({ cityId, onClose }: { cityId: EntityId; onClose: () => void }) {
  const officersMap = useGameStore((s) => s.officers);
  const playerForceId = useGameStore((s) => s.playerForceId);
  const startPracticeBattle = useGameStore((s) => s.startPracticeBattle);
  const t = useT();
  const lang = useLanguage();
  const garrison = useMemo(
    () => Object.values(officersMap)
      .filter((o) => o.locationCityId === cityId && o.forceId === playerForceId
        && o.status !== 'dead' && o.status !== 'unsearched' && o.status !== 'imprisoned')
      .sort((a, b) => (b.stats.war * 0.6 + b.stats.leadership * 0.4) - (a.stats.war * 0.6 + a.stats.leadership * 0.4)),
    [officersMap, cityId, playerForceId],
  );
  const [picked, setPicked] = useState<Set<string>>(
    () => new Set(garrison.slice(0, 6).map((o) => o.id)),
  );
  const toggle = (id: string) => setPicked((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else if (next.size < 6) next.add(id);
    return next;
  });
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        display: 'grid', placeItems: 'center', zIndex: 240,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#1a1410', border: '1px solid #7ed68a', padding: '1rem 1.2rem',
          minWidth: 320, maxWidth: 440, maxHeight: '80vh', overflow: 'auto',
          fontFamily: 'Songti SC, serif', color: '#e8d9b0',
        }}
      >
        <div style={{ color: '#9ed68a', letterSpacing: '0.25rem', marginBottom: '0.3rem' }}>
          ⚔ {t('演習點將', 'Drill Roster')}
        </div>
        <div style={{ color: '#8a7050', fontSize: '0.72rem', marginBottom: '0.6rem' }}>
          {t(`選至多 6 員上場(已選 ${picked.size})— 不損兵將,純為練兵`,
             `Pick up to 6 to take the field (${picked.size} picked) — no losses, practice only`)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {garrison.map((o) => {
            const on = picked.has(o.id);
            return (
              <button
                key={o.id}
                onClick={() => toggle(o.id)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: on ? 'rgba(126, 214, 138, 0.12)' : 'transparent',
                  border: `1px solid ${on ? '#7ed68a' : '#3a2d20'}`,
                  color: on ? '#d8f0c8' : '#a08a60', cursor: 'pointer',
                  padding: '0.35rem 0.6rem', fontFamily: 'inherit', fontSize: '0.8rem',
                }}
              >
                <span>{on ? '☑' : '☐'} {lang === 'en' ? o.name.en : o.name.zh}</span>
                <span style={{ color: '#8a7050', fontSize: '0.7rem' }}>
                  {t('武', 'W')}{o.stats.war} {t('統', 'L')}{o.stats.leadership}
                </span>
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem' }}>
          <button
            onClick={() => {
              if (picked.size === 0) return;
              if (startPracticeBattle(cityId, 0, [...picked])) onClose();
            }}
            disabled={picked.size === 0}
            style={{
              flex: 1, padding: '0.45rem', cursor: picked.size > 0 ? 'pointer' : 'not-allowed',
              background: 'linear-gradient(180deg, #2a3a20, #1d2a16)',
              color: '#9ed68a', border: '1px solid #7ed68a', fontFamily: 'inherit',
              letterSpacing: '0.15rem',
            }}
          >{t('開始演習', 'Start Drill')}</button>
          <button
            onClick={onClose}
            style={{
              padding: '0.45rem 0.8rem', cursor: 'pointer', background: 'transparent',
              color: '#8a7050', border: '1px solid #4a3520', fontFamily: 'inherit',
            }}
          >{t('取消', 'Cancel')}</button>
        </div>
      </div>
    </div>
  );
}
