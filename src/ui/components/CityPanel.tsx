import { useMemo, useState } from 'react';
import { useGameStore } from '../../game/state/store';
import { COMMAND_DEFS } from '../../game/systems/commands';
import { cityPolicyEffects } from '../../game/systems/policyEffects';
import type { EntityId, Officer } from '../../game/types';
import { BuildingsPanel } from './BuildingsPanel';
import { CaptivesSection } from './CaptivesSection';
import { CommandMenu } from './CommandMenu';
import { FreeAgentsSection } from './FreeAgentsSection';
import { OfficerHoverCard } from './OfficerHoverCard';
import { TERRAIN_DEFS } from '../../game/data/cities';
import { PROVINCE_BY_CITY, PROVINCES_BY_ID } from '../../game/data';
import styles from './CityPanel.module.css';

export function CityPanel() {
  const selectedCityId = useGameStore((s) => s.selectedCityId);
  const playerForceId = useGameStore((s) => s.playerForceId);
  const city = useGameStore((s) =>
    selectedCityId ? s.cities[selectedCityId] : null,
  );
  const force = useGameStore((s) =>
    city?.ownerForceId ? s.forces[city.ownerForceId] : null,
  );
  const officersMap = useGameStore((s) => s.officers);
  const officers = useMemo(
    () =>
      Object.values(officersMap).filter(
        (o) =>
          o.locationCityId === selectedCityId &&
          o.forceId === city?.ownerForceId &&
          o.status !== 'imprisoned' &&
          o.status !== 'dead',
      ),
    [officersMap, selectedCityId, city?.ownerForceId],
  );

  if (!city) {
    return (
      <aside className={styles.root}>
        <div className={styles.empty}>Select a city on the map</div>
      </aside>
    );
  }

  const isPlayerCity = city.ownerForceId === playerForceId;

  return (
    <aside className={styles.root}>
      <header className={styles.header}>
        <div className={styles.nameZh}>{city.name.zh}</div>
        <div className={styles.nameEn}>{city.name.en}</div>
        <div className={styles.owner}>
          {force ? (
            <>
              <span
                className={styles.colorDot}
                style={{ background: force.color }}
              />
              {force.name.zh}
              <span className={styles.ownerEn}>· {force.name.en}</span>
              {isPlayerCity && <span className={styles.playerTag}>YOU</span>}
            </>
          ) : (
            <span className={styles.neutral}>Neutral</span>
          )}
        </div>
        {(() => {
          const terrainKey = city.terrain ?? 'plain';
          const terrain = TERRAIN_DEFS[terrainKey];
          const provinceId = PROVINCE_BY_CITY[city.id];
          const province = provinceId ? PROVINCES_BY_ID[provinceId] : null;
          return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem', fontSize: '0.72rem' }}>
              <span style={{ background: '#1a1410', border: `1px solid ${terrain.color}`, color: terrain.color, padding: '0.15rem 0.4rem', letterSpacing: '0.1rem' }}>
                {terrain.zh} <span style={{ fontSize: '0.6rem', color: '#8a7050', fontStyle: 'italic' }}>{terrain.en}</span>
              </span>
              {city.port && (
                <span style={{ background: '#1a1410', border: '1px solid #88b7e8', color: '#88b7e8', padding: '0.15rem 0.4rem', letterSpacing: '0.1rem' }}>
                  港 <span style={{ fontSize: '0.6rem', color: '#5a7090', fontStyle: 'italic' }}>Port</span>
                </span>
              )}
              {province && (
                <span style={{ background: '#1a1410', border: `1px solid ${province.color}`, color: province.color, padding: '0.15rem 0.4rem', letterSpacing: '0.1rem' }}>
                  {province.name.zh} <span style={{ fontSize: '0.6rem', color: '#8a7050', fontStyle: 'italic' }}>{province.name.en}</span>
                </span>
              )}
            </div>
          );
        })()}
      </header>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Resources</h3>
        <Stat label="Population" zh="人口" value={city.population.toLocaleString()} />
        <Stat label="Gold" zh="金" value={city.gold.toLocaleString()} />
        <Stat label="Food" zh="兵糧" value={city.food.toLocaleString()} />
        <Stat label="Troops" zh="兵士" value={city.troops.toLocaleString()} />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Development</h3>
        <Bar label="Agriculture" zh="農業" value={city.agriculture} />
        <Bar label="Commerce" zh="商業" value={city.commerce} />
        <Bar label="Defense" zh="守備" value={city.defense} />
        <Bar label="Loyalty" zh="民忠" value={city.loyalty} />
      </section>

      {/* Active policy effects from resident officers — REAL gameplay impact */}
      <PolicyEffectsSection city={city} cityOfficers={officers} />

      {isPlayerCity && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Orders 命令</h3>
          <CommandMenu cityId={city.id} />
        </section>
      )}

      {isPlayerCity && <BuildingsPanel cityId={city.id} />}

      <FreeAgentsSection cityId={city.id} isPlayerCity={isPlayerCity} />

      {isPlayerCity && <CaptivesSection cityId={city.id} />}

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          Officers ({officers.length})
        </h3>
        {officers.length === 0 ? (
          <div className={styles.muted}>No officers stationed.</div>
        ) : (
          <ul className={styles.officerList}>
            {officers.map((o) => (
              <OfficerListItem
                key={o.id}
                officer={o}
                cityId={city.id}
                isPlayerCity={isPlayerCity}
              />
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}

function OfficerListItem({
  officer: o,
  cityId,
  isPlayerCity,
}: {
  officer: Officer;
  cityId: EntityId;
  isPlayerCity: boolean;
}) {
  const [transferOpen, setTransferOpen] = useState(false);
  const allCities = useGameStore((s) => s.cities);
  const playerForceId = useGameStore((s) => s.playerForceId);
  const adjacent = useMemo(() => {
    const city = allCities[cityId];
    if (!city) return [];
    return city.adjacentCityIds
      .map((id) => allCities[id])
      .filter((c) => c?.ownerForceId === playerForceId);
  }, [allCities, cityId, playerForceId]);
  const transferOfficer = useGameStore((s) => s.transferOfficer);
  const cityGold = useGameStore((s) => s.cities[cityId]?.gold ?? 0);
  const taskDef = o.task ? COMMAND_DEFS[o.task] : null;
  const canTransfer = isPlayerCity && !o.task && o.status === 'idle';

  return (
    <li className={styles.officerRow}>
      <OfficerHoverCard officer={o}>
        <span className={styles.officerNameZh}>{o.name.zh}</span>
        <span className={styles.officerNameEn}>{o.name.en}</span>
      </OfficerHoverCard>
      <span className={styles.officerStats}>
        {taskDef ? (
          <span className={styles.officerTask}>▸ {taskDef.label.zh}</span>
        ) : canTransfer ? (
          <button
            onClick={() => setTransferOpen((v) => !v)}
            title={`Transfer to adjacent city (50g)`}
            style={{
              background: 'transparent',
              border: '1px solid #4a3520',
              color: cityGold >= 50 ? '#d4a84a' : '#5a4530',
              padding: '0.05rem 0.4rem',
              fontFamily: 'inherit',
              fontSize: '0.65rem',
              cursor: cityGold >= 50 ? 'pointer' : 'not-allowed',
              letterSpacing: '0.05rem',
            }}
            disabled={cityGold < 50}
          >
            移送 ⇨
          </button>
        ) : (
          `W${o.stats.war} I${o.stats.intelligence} P${o.stats.politics} C${o.stats.charisma}`
        )}
      </span>
      {transferOpen && canTransfer && (
        <div
          style={{
            gridColumn: '1 / -1',
            marginTop: '0.25rem',
            padding: '0.3rem',
            background: '#1a1410',
            border: '1px solid #4a3520',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.25rem',
          }}
        >
          {adjacent.length === 0 ? (
            <span
              style={{
                color: '#8a7050',
                fontSize: '0.7rem',
                fontStyle: 'italic',
              }}
            >
              No adjacent friendly cities
            </span>
          ) : (
            adjacent.map((dest) => (
              <button
                key={dest.id}
                onClick={() => {
                  transferOfficer(o.id, dest.id);
                  setTransferOpen(false);
                }}
                style={{
                  background: '#2a1f15',
                  border: '1px solid #3a2d20',
                  color: '#d4a84a',
                  padding: '0.2rem 0.5rem',
                  fontFamily: 'inherit',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                → {dest.name.zh}
              </button>
            ))
          )}
        </div>
      )}
    </li>
  );
}

function Stat({ label, zh, value }: { label: string; zh: string; value: string }) {
  return (
    <div className={styles.statRow}>
      <span className={styles.statLabel}>
        {label} <span className={styles.statZh}>{zh}</span>
      </span>
      <span className={styles.statValue}>{value}</span>
    </div>
  );
}

function Bar({ label, zh, value }: { label: string; zh: string; value: number }) {
  return (
    <div className={styles.barRow}>
      <div className={styles.barHeader}>
        <span className={styles.statLabel}>
          {label} <span className={styles.statZh}>{zh}</span>
        </span>
        <span className={styles.barValue}>{value}</span>
      </div>
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}

function PolicyEffectsSection({
  city, cityOfficers,
}: { city: import('../../game/types').City; cityOfficers: Officer[] }) {
  const eff = cityPolicyEffects(city, cityOfficers);
  if (eff.badges.length === 0) return null;
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>★ 政策效果 Policy Effects</h3>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '0.3rem',
        fontSize: '0.7rem',
      }}>
        {eff.badges.map((b, i) => (
          <span
            key={i}
            style={{
              padding: '0.18rem 0.45rem',
              background: 'rgba(212, 168, 74, 0.12)',
              border: '1px solid rgba(212, 168, 74, 0.4)',
              color: '#d4a84a',
              borderRadius: '2px',
              letterSpacing: '0.05rem',
              fontFamily: 'var(--tkm-font-zh)',
            }}
          >
            {b}
          </span>
        ))}
      </div>
      <div style={{
        marginTop: '0.4rem', fontSize: '0.65rem', color: '#8a7050',
        letterSpacing: '0.1rem',
      }}>
        {cityOfficers.length} 武將在城 · 政策由其個人專業聚合而成
      </div>
    </section>
  );
}
