import { describe, it, expect } from 'vitest';
import { generateTerrain, type BattleGeo } from './battlefieldTerrain';
import { buildInitialCities } from '../data/cities';
import { cityPos } from '../data/cityGeo';

const cities = buildInitialCities({});
const byId = Object.fromEntries(cities.map((c) => [c.id, c]));

const W = 18, H = 12;
const siegeGeo = (fromId: string, toId: string): BattleGeo => {
  const sp = cityPos(byId[fromId]);
  const tp = cityPos(byId[toId]);
  return { x: tp.x, y: tp.y, bearing: Math.atan2(tp.y - sp.y, tp.x - sp.x), anchorCol: W - 2 };
};
/** Water blocking the approach LANE (central rows of the mid-field) —
 *  distinguishes a true crossing from a river hugging one flank. */
const laneWater = (tiles: ReturnType<typeof generateTerrain>) =>
  tiles.filter((t) =>
    (t.terrain === 'river' || t.terrain === 'bridge')
    && t.coord.col >= 4 && t.coord.col <= 13
    && t.coord.row >= 3 && t.coord.row <= 8).length;

describe('real-geography battlefields (战斗地图写实)', () => {
  it('storming 襄陽 from the north crosses the 漢水; from the south the lane is open', () => {
    const target = byId['xiangyang'];
    const hint = { terrain: target.terrain, port: target.port, x: target.coords.x, y: target.coords.y };
    const fromNorth = generateTerrain('xiangyang', W, H, hint, undefined, siegeGeo('xinye', 'xiangyang'));
    const fromSouth = generateTerrain('xiangyang', W, H, hint, undefined, siegeGeo('jiangling', 'xiangyang'));
    expect(laneWater(fromNorth), '北面来攻应有汉水拦路').toBeGreaterThanOrEqual(8);
    expect(laneWater(fromSouth), '南面来攻中路应开阔').toBeLessThanOrEqual(4);
  });

  it('a battle in the Qinling passes is walled by real mountains', () => {
    // 漢中→陳倉: the approach crosses the Qinling — expect heavy mountain mass.
    const geo = siegeGeo('hanzhong', 'chencang');
    const tiles = generateTerrain('chencang', W, H, { terrain: byId['chencang'].terrain }, undefined, geo);
    const mountains = tiles.filter((t) => t.terrain === 'mountain' || t.terrain === 'hill').length;
    expect(mountains).toBeGreaterThanOrEqual(30);
  });

  it('an open-plains clash (許昌↔陳留) stays mostly open ground', () => {
    const a = cityPos(byId['xuchang']);
    const b = cityPos(byId['chenliu']);
    const geo: BattleGeo = {
      x: (a.x + b.x) / 2, y: (a.y + b.y) / 2,
      bearing: Math.atan2(b.y - a.y, b.x - a.x),
    };
    const tiles = generateTerrain('xuchang', W, H, {}, undefined, geo);
    const blocked = tiles.filter((t) => t.terrain === 'mountain' || t.terrain === 'river').length;
    expect(blocked).toBeLessThan(W * H * 0.2);
    // The march road runs along the centre row.
    const roadRow = tiles.filter((t) => t.coord.row === Math.floor(H / 2) && (t.terrain === 'road' || t.terrain === 'chokepoint'));
    expect(roadRow.length).toBeGreaterThanOrEqual(W / 2);
  });

  it('pass cities keep their corridor guarantee on real ground', () => {
    const geo = siegeGeo('jiameng', 'jianmen');
    const tiles = generateTerrain('jianmen', W, H, { terrain: 'pass' }, undefined, geo);
    const top = tiles.filter((t) => t.coord.row === 0 && t.terrain === 'mountain').length;
    const bottom = tiles.filter((t) => t.coord.row === H - 1 && t.terrain === 'mountain').length;
    expect(top).toBe(W);
    expect(bottom).toBe(W);
    expect(tiles.some((t) => t.terrain === 'chokepoint')).toBe(true);
  });

  it('is deterministic for the same battle and varies across battles', () => {
    const geo = siegeGeo('xinye', 'xiangyang');
    const a = generateTerrain('xiangyang', W, H, {}, undefined, geo);
    const b = generateTerrain('xiangyang', W, H, {}, undefined, geo);
    expect(a).toEqual(b);
    const c = generateTerrain('xiangyang', W, H, {}, undefined, siegeGeo('jiangling', 'xiangyang'));
    expect(a).not.toEqual(c);
  });
});
