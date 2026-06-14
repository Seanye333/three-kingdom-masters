import { useMemo, useState } from 'react';
import { FORGE_RECIPES, ITEMS_BY_ID } from '../../game/data';
import { useGameStore } from '../../game/state/store';
import type { EntityId } from '../../game/types';
import { useDesc } from '../i18n';

interface Props {
  onClose: () => void;
}

export function ForgingModal({ onClose }: Props) {
  const cities = useGameStore((s) => s.cities);
  const buildings = useGameStore((s) => s.buildings);
  const lostItems = useGameStore((s) => s.lostItems);
  const playerForceId = useGameStore((s) => s.playerForceId);
  const forgeItem = useGameStore((s) => s.forgeItem);
  const desc = useDesc();

  // Find player cities with a foundry.
  const foundryCities = useMemo(() => {
    return Object.values(cities).filter((c) => {
      if (c.ownerForceId !== playerForceId) return false;
      return buildings.some((b) => b.cityId === c.id && b.id === 'foundry' && b.level > 0);
    });
  }, [cities, buildings, playerForceId]);

  const [pickedCityId, setPickedCityId] = useState<EntityId | null>(
    foundryCities[0]?.id ?? null,
  );

  const pickedCity = pickedCityId ? cities[pickedCityId] : null;
  const foundryLevel = pickedCityId
    ? (buildings.find((b) => b.cityId === pickedCityId && b.id === 'foundry')?.level ?? 0)
    : 0;
  const itemsInCity = pickedCityId
    ? lostItems.filter((li) => li.cityId === pickedCityId).map((li) => li.itemId)
    : [];

  const handle = (recipeId: string) => {
    if (!pickedCityId) return;
    const r = forgeItem(pickedCityId, recipeId);
    if (!r.ok) alert(r.reason);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'grid', placeItems: 'center',
        zIndex: 900, padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(160deg,#1b2531,#10161e)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
          borderTop: '3px solid #f55a20',  // ember orange — 炉火
          width: 'min(820px,100%)',
          maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          color: '#e6edf3',
          fontFamily: 'var(--tkm-font-body)',
          boxShadow: '0 0 16px rgba(245,90,32,0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <header
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            padding: '1rem 1.5rem', borderBottom: '1px solid #2b3845',
          }}
        >
          <div>
            <div style={{ fontSize: '1.4rem', color: '#e6c473', letterSpacing: '0.07rem' }}>鍛造</div>
            <div style={{ fontSize: '0.85rem', color: '#7a8893', fontStyle: 'italic' }}>Forge & Smithy</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#e6c473', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
        </header>

        <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid #2b3845' }}>
          <div style={{ fontSize: '0.7rem', letterSpacing: '0.07rem', color: '#7a8893', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            Foundry City
          </div>
          {foundryCities.length === 0 ? (
            <div style={{ fontSize: '0.85rem', color: '#b8442e', fontStyle: 'italic' }}>
              No city with a Foundry yet. Build one in a city via the City panel.
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {foundryCities.map((c) => {
                const lvl = buildings.find((b) => b.cityId === c.id && b.id === 'foundry')?.level ?? 0;
                return (
                  <button
                    key={c.id}
                    onClick={() => setPickedCityId(c.id)}
                    style={{
                      background: pickedCityId === c.id ? '#26323e' : '#10161e',
                      border: `1px solid ${pickedCityId === c.id ? '#e6c473' : '#2b3845'}`,
                      color: pickedCityId === c.id ? '#e6c473' : '#aab6c0',
                      padding: '0.3rem 0.7rem',
                      fontFamily: 'inherit', cursor: 'pointer', fontSize: '0.85rem',
                    }}
                  >
                    {c.name.zh} <span style={{ fontSize: '0.7rem', color: '#7a8893' }}>Lv{lvl}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ padding: '1rem 1.5rem', overflowY: 'auto', flex: 1 }}>
          {pickedCity && (
            <>
              <div style={{ fontSize: '0.78rem', color: '#7a8893', marginBottom: '0.5rem' }}>
                Treasury at {pickedCity.name.en}: <strong style={{ color: '#c9a64e' }}>{pickedCity.gold}g</strong> ·
                Items here: {itemsInCity.length}
              </div>
              {FORGE_RECIPES.map((r) => {
                const result = ITEMS_BY_ID[r.resultItemId];
                const have = r.ingredients.every((id) => itemsInCity.includes(id));
                const lvlOK = foundryLevel >= r.minFoundryLevel;
                const goldOK = pickedCity.gold >= r.goldCost;
                const canForge = have && lvlOK && goldOK;
                return (
                  <div
                    key={r.id}
                    style={{
                      background: '#10161e',
                      border: '1px solid ' + (canForge ? '#e6c473' : '#2b3845'),
                      padding: '0.7rem 0.85rem',
                      marginBottom: '0.4rem',
                      opacity: canForge ? 1 : 0.65,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div style={{ color: '#e6c473', fontSize: '1rem' }}>
                        → {result?.name.zh}{' '}
                        <span style={{ fontSize: '0.78rem', color: '#7a8893', fontStyle: 'italic' }}>
                          {result?.name.en}
                        </span>
                      </div>
                      <button
                        onClick={() => handle(r.id)}
                        disabled={!canForge}
                        style={{
                          background: '#26323e',
                          border: '1px solid ' + (canForge ? '#e6c473' : '#2b3845'),
                          color: canForge ? '#e6c473' : '#6a5238',
                          padding: '0.3rem 0.8rem',
                          fontFamily: 'inherit', cursor: canForge ? 'pointer' : 'not-allowed',
                        }}
                      >
                        鍛 Forge
                      </button>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#aab6c0', fontStyle: 'italic', marginTop: '0.3rem' }}>
                      {desc(r)}
                    </div>
                    <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.72rem', color: '#7a8893', marginTop: '0.3rem' }}>
                      Ingredients: {r.ingredients.map((id) => (
                        <span key={id} style={{ color: itemsInCity.includes(id) ? '#7ed68a' : '#b8442e', marginRight: '0.5rem' }}>
                          {ITEMS_BY_ID[id]?.name.zh ?? id} {itemsInCity.includes(id) ? '✓' : '✗'}
                        </span>
                      ))}
                    </div>
                    <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.72rem', color: '#7a8893', marginTop: '0.2rem' }}>
                      {r.goldCost}g · req Foundry Lv{r.minFoundryLevel}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
