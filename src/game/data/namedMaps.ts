import type { NamedBattleMap } from '../types';

/**
 * Pre-designed maps for specific city IDs. When a tactical battle is
 * launched against one of these cities, the named map's terrain layout,
 * weather, and special tiles override the procedural generation.
 */
export const NAMED_BATTLE_MAPS: NamedBattleMap[] = [
  {
    id: 'map-red-cliffs',
    name: { en: 'Red Cliffs', zh: '赤壁' },
    description:
      'A long Yangtze front. The northern fleet chained at the bank; the southern allies upstream. A wind from the south is the only hope.',
    width: 15,
    height: 11,
    weather: 'wind',
    timeOfDay: 'dusk',
    terrainOverrides: (() => {
      // Build a wide river slicing diagonally with bridges/fords.
      const out: Record<string, 'plain' | 'forest' | 'mountain' | 'river' | 'road'> = {};
      // River along rows 3-4
      for (let col = 0; col < 12; col++) {
        out[`${col},3`] = 'river';
        out[`${col},4`] = 'river';
      }
      // Forested cliffs to the south
      for (let col = 1; col < 11; col += 3) {
        out[`${col},6`] = 'forest';
        out[`${col + 1},7`] = 'forest';
      }
      // Mountain on the far western edge
      out['0,0'] = 'mountain';
      out['0,7'] = 'mountain';
      return out;
    })(),
    specialTiles: [
      { coord: { col: 5, row: 3 }, label: { en: 'Bridge', zh: '橋' }, role: 'bridge' },
      { coord: { col: 8, row: 3 }, label: { en: 'Ford', zh: '渡' }, role: 'bridge' },
    ],
  },
  {
    id: 'map-hulao-pass',
    name: { en: 'Hulao Pass', zh: '虎牢關' },
    description:
      'The mountain chokepoint where Liu, Guan, and Zhang faced Lü Bu. A narrow road runs between sheer cliffs.',
    width: 14,
    height: 10,
    weather: 'clear',
    timeOfDay: 'day',
    terrainOverrides: (() => {
      const out: Record<string, 'plain' | 'forest' | 'mountain' | 'river' | 'road'> = {};
      // Mountains on top and bottom rows
      for (let col = 0; col < 11; col++) {
        out[`${col},0`] = 'mountain';
        out[`${col},5`] = 'mountain';
      }
      // Road through the middle
      for (let col = 0; col < 11; col++) {
        out[`${col},2`] = 'road';
        out[`${col},3`] = 'road';
      }
      // Forest patches on the flanks
      out['3,1'] = 'forest';
      out['7,4'] = 'forest';
      return out;
    })(),
    specialTiles: [
      { coord: { col: 5, row: 2 }, label: { en: 'The Pass', zh: '關門' }, role: 'flag' },
    ],
  },
  {
    id: 'map-changban',
    name: { en: 'Changban Bridge', zh: '長坂橋' },
    description:
      'Liu Bei flees south; Zhang Fei holds the bridge alone, Zhao Yun rides through the Cao army. Civilians fill the road.',
    width: 13,
    height: 10,
    weather: 'clear',
    timeOfDay: 'day',
    terrainOverrides: (() => {
      const out: Record<string, 'plain' | 'forest' | 'mountain' | 'river' | 'road'> = {};
      // River along row 4 with a bridge in the middle
      for (let col = 0; col < 10; col++) {
        out[`${col},4`] = 'river';
      }
      out['5,4'] = 'road'; // bridge
      // Road north-south through col 5
      for (let row = 0; row < 7; row++) {
        if (row !== 4) out[`5,${row}`] = 'road';
      }
      // Forest patches
      out['1,1'] = 'forest';
      out['8,6'] = 'forest';
      return out;
    })(),
    specialTiles: [
      { coord: { col: 5, row: 4 }, label: { en: 'Changban Bridge', zh: '長坂橋' }, role: 'bridge' },
      { coord: { col: 5, row: 6 }, label: { en: 'Civilian Wagons', zh: '民之車' }, role: 'wagon' },
    ],
  },
  {
    id: 'map-wuzhang-plains',
    name: { en: 'Wuzhang Plains', zh: '五丈原' },
    description:
      "Zhuge Liang's last campaign. A wide plain with the Wei river to the north. Sima Yi refuses every challenge.",
    width: 14,
    height: 10,
    weather: 'clear',
    timeOfDay: 'day',
    terrainOverrides: (() => {
      const out: Record<string, 'plain' | 'forest' | 'mountain' | 'river' | 'road'> = {};
      // Wei river on top
      for (let col = 0; col < 11; col++) out[`${col},0`] = 'river';
      // Mountain ridge to the south
      for (let col = 3; col < 8; col++) out[`${col},6`] = 'mountain';
      out['5,5'] = 'mountain';
      // Forest patches
      out['1,2'] = 'forest';
      out['9,3'] = 'forest';
      return out;
    })(),
    specialTiles: [
      { coord: { col: 5, row: 3 }, label: { en: 'Star Hill', zh: '星之丘' }, role: 'hill' },
    ],
  },
  {
    id: 'map-guandu',
    name: { en: 'Guandu', zh: '官渡' },
    description:
      "Cao Cao's smaller host faces Yuan Shao's massive army. Granaries at Wuchao are the key.",
    width: 15,
    height: 10,
    weather: 'clear',
    timeOfDay: 'day',
    terrainOverrides: (() => {
      const out: Record<string, 'plain' | 'forest' | 'mountain' | 'river' | 'road'> = {};
      // Some forest cover
      out['2,1'] = 'forest';
      out['9,5'] = 'forest';
      out['5,5'] = 'forest';
      return out;
    })(),
    specialTiles: [
      { coord: { col: 10, row: 3 }, label: { en: 'Wuchao Granary', zh: '烏巣之倉' }, role: 'supply' },
    ],
  },

  // ─── Phase 35 additional maps ──────────────────────────────
  {
    id: 'map-maicheng',
    name: { en: 'Maicheng', zh: '麥城' },
    description:
      "Guan Yu's last stand. A small walled town encircled by Wu forces; his only path west is cut by Lü Meng's cavalry.",
    width: 12,
    height: 9,
    weather: 'rain',
    timeOfDay: 'dusk',
    terrainOverrides: (() => {
      const out: Record<string, 'plain' | 'forest' | 'mountain' | 'river' | 'road'> = {};
      // Forest cordons everywhere
      for (const [c, r] of [[1, 1], [2, 4], [6, 0], [7, 3], [3, 5]] as Array<[number, number]>) {
        out[`${c},${r}`] = 'forest';
      }
      // The road west — but with a forest ambush right at the exit
      out['0,2'] = 'road'; out['1,2'] = 'road'; out['2,2'] = 'road';
      out['1,3'] = 'forest';   // ambush hex
      return out;
    })(),
    specialTiles: [
      { coord: { col: 0, row: 2 }, label: { en: 'West Gate (escape)', zh: '西門' }, role: 'flag' },
    ],
  },
  {
    id: 'map-fancheng',
    name: { en: 'Fancheng', zh: '樊城' },
    description:
      "Guan Yu's siege of Cao's general Cao Ren. The Han river overflowed; Guan dammed it to drown Yu Jin's seven armies.",
    width: 14,
    height: 10,
    weather: 'rain',
    timeOfDay: 'day',
    terrainOverrides: (() => {
      const out: Record<string, 'plain' | 'forest' | 'mountain' | 'river' | 'road'> = {};
      // Han river slashes diagonally
      for (let c = 0; c < 11; c++) {
        out[`${c},3`] = 'river';
      }
      // The city of Fancheng is at the far right
      out['9,3'] = 'road';
      out['10,3'] = 'road';
      out['10,4'] = 'road';
      return out;
    })(),
    specialTiles: [
      { coord: { col: 10, row: 3 }, label: { en: 'Fancheng', zh: '樊城' }, role: 'flag' },
      { coord: { col: 5, row: 2 }, label: { en: 'Han Dam (Guan Yu)', zh: '漢水堰' }, role: 'bridge' },
    ],
  },
  {
    id: 'map-dingjun',
    name: { en: 'Mt. Dingjun', zh: '定軍山' },
    description:
      "Huang Zhong's miracle. A tall mountain over the Hanzhong corridor where the old general struck down Xiahou Yuan in a single charge.",
    width: 13,
    height: 11,
    weather: 'clear',
    timeOfDay: 'dawn',
    terrainOverrides: (() => {
      const out: Record<string, 'plain' | 'forest' | 'mountain' | 'river' | 'road'> = {};
      // Mountain massif center
      for (let c = 3; c <= 6; c++) {
        for (let r = 2; r <= 5; r++) out[`${c},${r}`] = 'mountain';
      }
      out['4,3'] = 'plain'; out['5,3'] = 'plain'; // High plateau (clear shot)
      // Roads
      for (let c = 0; c < 10; c++) out[`${c},7`] = 'road';
      return out;
    })(),
    specialTiles: [
      { coord: { col: 4, row: 3 }, label: { en: 'High Plateau', zh: '山頂' }, role: 'hill' },
    ],
  },
  {
    id: 'map-jieting',
    name: { en: 'Jieting', zh: '街亭' },
    description:
      'The strategic chokepoint Ma Su lost — by camping atop the hill instead of holding the road below. Sima Yi cut off his water and broke him.',
    width: 13,
    height: 9,
    weather: 'clear',
    timeOfDay: 'day',
    terrainOverrides: (() => {
      const out: Record<string, 'plain' | 'forest' | 'mountain' | 'river' | 'road'> = {};
      // Central hill (the fatal one Ma Su climbed)
      for (const k of ['4,2', '4,3', '5,2', '5,3']) {
        out[k] = 'mountain';
      }
      // Vital road
      for (let c = 0; c < 10; c++) out[`${c},4`] = 'road';
      // The spring (water)
      out['3,3'] = 'river';
      return out;
    })(),
    specialTiles: [
      { coord: { col: 4, row: 2 }, label: { en: 'Lone Hill (Ma Su\'s mistake)', zh: '孤山' }, role: 'hill' },
      { coord: { col: 3, row: 3 }, label: { en: 'Spring', zh: '水源' }, role: 'supply' },
    ],
  },
];

export const NAMED_MAPS_BY_CITY: Record<string, string> = {
  // Phase 35 additions.
  'city-fancheng': 'map-fancheng',
  'city-jiangling': 'map-maicheng',
  'city-hanzhong': 'map-dingjun',
  'city-tianshui': 'map-jieting',
  // Map specific city IDs to a named map ID.
  'city-chibi': 'map-red-cliffs',
  'city-jingzhou': 'map-changban',
  'city-changan': 'map-hulao-pass',
  'city-luoyang': 'map-hulao-pass',
  'city-wuzhang': 'map-wuzhang-plains',
  'city-guandu': 'map-guandu',
};

export const NAMED_MAPS_BY_ID: Record<string, NamedBattleMap> =
  Object.fromEntries(NAMED_BATTLE_MAPS.map((m) => [m.id, m]));
