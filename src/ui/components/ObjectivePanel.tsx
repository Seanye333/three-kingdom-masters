import { useMemo } from 'react';
import { SCENARIO_OBJECTIVES } from '../../game/data';
import { evaluateGoal, findObjectiveFor } from '../../game/systems/objectives';
import { useGameStore } from '../../game/state/store';

export function ObjectivePanel() {
  const scenarioId = useGameStore((s) => s.scenarioId);
  const playerForceId = useGameStore((s) => s.playerForceId);
  const cities = useGameStore((s) => s.cities);
  const officers = useGameStore((s) => s.officers);
  const forces = useGameStore((s) => s.forces);
  const year = useGameStore((s) => s.date.year);

  const objective = useMemo(
    () => findObjectiveFor(scenarioId, playerForceId, SCENARIO_OBJECTIVES),
    [scenarioId, playerForceId],
  );

  const ctx = useMemo(() => {
    const liveForceIds = new Set<string>();
    for (const c of Object.values(cities)) {
      if (c.ownerForceId) liveForceIds.add(c.ownerForceId);
    }
    return {
      scenarioId,
      playerForceId,
      cities,
      officers,
      year,
      liveForceIds,
      isEmperor: playerForceId ? forces[playerForceId]?.imperialRank === 'emperor' : false,
    };
  }, [scenarioId, playerForceId, cities, officers, year, forces]);

  if (!objective) return null;
  const primaryRes = evaluateGoal(objective.primary.goal, ctx);

  return (
    <div
      style={{
        background: '#1a1410',
        border: '1px solid #4a3520',
        padding: '0.5rem 0.8rem',
        fontSize: '0.78rem',
        color: '#c0a878',
        fontFamily: '"Songti SC", serif',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.2rem',
        minWidth: 260,
      }}
    >
      <div style={{ fontSize: '0.6rem', letterSpacing: '0.2rem', color: '#8a7050', textTransform: 'uppercase' }}>
        Objective · 目標
      </div>
      <div style={{ fontSize: '0.95rem', color: primaryRes.status === 'success' ? '#7ed68a' : primaryRes.status === 'failure' ? '#b8442e' : '#d4a84a' }}>
        {objective.primary.title.zh}{' '}
        <span style={{ fontSize: '0.7rem', color: '#8a7050', fontStyle: 'italic' }}>
          {objective.primary.title.en}
        </span>
      </div>
      <div style={{ fontSize: '0.7rem', fontFamily: 'ui-monospace, monospace' }}>
        {primaryRes.status === 'success' && '✓ 達成 Achieved'}
        {primaryRes.status === 'failure' && '✗ 失敗 Failed'}
        {primaryRes.status === 'pending' && (primaryRes.progress ?? 'in progress…')}
      </div>
    </div>
  );
}
