import type { Force, Scenario } from '../types';
import { buildInitialCities } from './cities';
import { buildInitialOfficers } from './officers';

// ──────────────────────────────────────────────────────────────────────
// Scenario 0 — 184 AD The Yellow Turban Rebellion
// ──────────────────────────────────────────────────────────────────────

const FORCES_184: Force[] = [
  { id: 'han',         name: { en: 'Han Court',       zh: '漢室'     }, rulerOfficerId: 'lu-zhi',      capitalCityId: 'luoyang',  color: '#d4a84a', isPlayer: false },
  { id: 'yellow-turban',name:{ en: 'Yellow Turbans',  zh: '黃巾'     }, rulerOfficerId: 'zhang-jiao',  capitalCityId: 'julu',     color: '#c19a3b', isPlayer: false },
  { id: 'huangfu',     name: { en: 'Huangfu Song',    zh: '皇甫嵩軍' }, rulerOfficerId: 'huangfu-song',capitalCityId: 'chenliu',  color: '#3a7dd9', isPlayer: false },
  { id: 'zhujun',      name: { en: 'Zhu Jun',         zh: '朱儁軍'   }, rulerOfficerId: 'zhu-jun',     capitalCityId: 'wancheng', color: '#5a9bb8', isPlayer: false },
  { id: 'dong-184',    name: { en: 'Dong Zhuo',       zh: '董卓軍'   }, rulerOfficerId: 'dong-zhuo',   capitalCityId: 'changan',  color: '#6b4a8a', isPlayer: false },
];

const CITY_OWNERSHIP_184: Record<string, string> = {
  luoyang:   'han',
  // Yellow Turbans control the troubled provinces.
  julu:      'yellow-turban',
  ye:        'yellow-turban',
  pingyuan:  'yellow-turban',
  beihai:    'yellow-turban',
  bohai:     'yellow-turban',
  // Loyalists hold the rest.
  chenliu:   'huangfu',
  pengcheng: 'huangfu',
  xiapi:     'huangfu',
  wancheng:  'zhujun',
  xiangyang: 'zhujun',
  // Dong Zhuo in the west.
  changan:   'dong-184',
  wuwei:     'dong-184',
  jincheng:  'dong-184',
  anding:    'dong-184',
  // Han loyalist outposts.
  xuchang:   'han',
  taiyuan:   'han',
  beiping:   'han',
  yanmen:    'han',
  shouchun:  'han',
  hefei:     'han',
  jianye:    'han',
  wu:        'han',
  changsha:  'han',
  chengdu:   'han',
  jiangxia:  'han',
  // Misc unowned cities default to null in buildInitialCities.
};

const OFFICER_ASSIGNMENTS_184: Record<string, { forceId: string; cityId: string }> = {
  // Han court loyalists
  'lu-zhi':       { forceId: 'han',          cityId: 'luoyang' },
  'wang-yun':     { forceId: 'han',          cityId: 'luoyang' },
  'huangfu-song': { forceId: 'huangfu',      cityId: 'chenliu' },
  'zhu-jun':      { forceId: 'zhujun',       cityId: 'wancheng' },
  // Yellow Turban core
  'zhang-jiao':   { forceId: 'yellow-turban',cityId: 'julu' },
  'zhang-bao-yt': { forceId: 'yellow-turban',cityId: 'pingyuan' },
  'zhang-liang-yt':{forceId: 'yellow-turban',cityId: 'ye' },
  'guan-hai':     { forceId: 'yellow-turban',cityId: 'beihai' },
  'pei-yuanshao': { forceId: 'yellow-turban',cityId: 'bohai' },
  'sun-zhong':    { forceId: 'yellow-turban',cityId: 'pingyuan' },
  'bo-cai':       { forceId: 'yellow-turban',cityId: 'ye' },
  'ma-yuanyi':    { forceId: 'yellow-turban',cityId: 'julu' },
  // Dong Zhuo (still a general at this point)
  'dong-zhuo':    { forceId: 'dong-184',     cityId: 'changan' },
  'li-jue':       { forceId: 'dong-184',     cityId: 'changan' },
  'guo-si':       { forceId: 'dong-184',     cityId: 'wuwei' },
  'ma-teng':      { forceId: 'dong-184',     cityId: 'jincheng' },
  // Future giants serving the Han at the start of their careers
  'cao-cao':      { forceId: 'huangfu',      cityId: 'chenliu' },
  'liu-bei':      { forceId: 'zhujun',       cityId: 'wancheng' },
  'guan-yu':      { forceId: 'zhujun',       cityId: 'wancheng' },
  'zhang-fei':    { forceId: 'zhujun',       cityId: 'wancheng' },
  'sun-jian':     { forceId: 'zhujun',       cityId: 'wancheng' },
  'yuan-shao':    { forceId: 'han',          cityId: 'luoyang' },
  'yuan-shu':     { forceId: 'han',          cityId: 'luoyang' },
};

const DEAD_BY_184: string[] = [];

export const SCENARIO_184_YELLOW_TURBAN: Scenario = {
  id: 'scn-184-yellow-turban',
  name: { en: 'The Yellow Turban Rebellion', zh: '黃巾之亂' },
  description:
    'Spring 184 AD. The Yellow Turbans rise across five provinces under Zhang Jiao\'s Way of Great Peace. ' +
    'The Han court rallies Huangfu Song, Lu Zhi, and Zhu Jun. Among their volunteers: a young Cao Cao, ' +
    'a sworn band of three brothers from Zhuo, and a tiger of Jiangdong named Sun Jian. The age of heroes begins.',
  startDate: { year: 184, season: 'spring' },
  cities: buildInitialCities(CITY_OWNERSHIP_184),
  forces: FORCES_184,
  officers: buildInitialOfficers(OFFICER_ASSIGNMENTS_184, DEAD_BY_184, 184),
};

// ──────────────────────────────────────────────────────────────────────
// Scenario 1 — 190 AD Anti-Dong Zhuo Coalition (30 cities, 11 forces)
// ──────────────────────────────────────────────────────────────────────

const FORCES_190: Force[] = [
  { id: 'cao',       name: { en: 'Cao Cao',     zh: '曹操軍'   }, rulerOfficerId: 'cao-cao',     capitalCityId: 'xuchang',  color: '#3a7dd9', isPlayer: false },
  { id: 'yuan-shao', name: { en: 'Yuan Shao',   zh: '袁紹軍'   }, rulerOfficerId: 'yuan-shao',   capitalCityId: 'ye',       color: '#b8442e', isPlayer: false },
  { id: 'yuan-shu',  name: { en: 'Yuan Shu',    zh: '袁術軍'   }, rulerOfficerId: 'yuan-shu',    capitalCityId: 'shouchun', color: '#a85d8a', isPlayer: false },
  { id: 'sun',       name: { en: 'Sun Jian',    zh: '孫堅軍'   }, rulerOfficerId: 'sun-jian',    capitalCityId: 'jianye',   color: '#2f8e6f', isPlayer: false },
  { id: 'dong',      name: { en: 'Dong Zhuo',   zh: '董卓軍'   }, rulerOfficerId: 'dong-zhuo',   capitalCityId: 'luoyang',  color: '#6b4a8a', isPlayer: false },
  { id: 'liu-biao',  name: { en: 'Liu Biao',    zh: '劉表軍'   }, rulerOfficerId: 'liu-biao',    capitalCityId: 'xiangyang',color: '#c19a3b', isPlayer: false },
  { id: 'liu-yan',   name: { en: 'Liu Yan',     zh: '劉焉軍'   }, rulerOfficerId: 'liu-yan',     capitalCityId: 'chengdu',  color: '#d9803a', isPlayer: false },
  { id: 'gongsun',   name: { en: 'Gongsun Zan', zh: '公孫瓚軍' }, rulerOfficerId: 'gongsun-zan', capitalCityId: 'beiping',  color: '#5a9bb8', isPlayer: false },
  { id: 'tao',       name: { en: 'Tao Qian',    zh: '陶謙軍'   }, rulerOfficerId: 'tao-qian',    capitalCityId: 'pengcheng',color: '#8a8a3a', isPlayer: false },
  { id: 'kong-rong', name: { en: 'Kong Rong',   zh: '孔融軍'   }, rulerOfficerId: 'kong-rong',   capitalCityId: 'beihai',   color: '#d97a3a', isPlayer: false },
  { id: 'ma-teng',   name: { en: 'Ma Teng',     zh: '馬騰軍'   }, rulerOfficerId: 'ma-teng',     capitalCityId: 'wuwei',    color: '#a8703a', isPlayer: false },
];

const CITY_OWNERSHIP_190: Record<string, string> = {
  // Cao Cao
  xuchang:   'cao',
  // Yuan Shao
  ye:        'yuan-shao',
  bohai:     'yuan-shao',
  // Yuan Shu (Nanyang + Huainan)
  shouchun:  'yuan-shu',
  wancheng:  'yuan-shu',
  runan:     'yuan-shu',
  hefei:     'yuan-shu',
  // Sun Jian
  jianye:    'sun',
  changsha:  'sun',
  yuzhang:   'sun',
  // Dong Zhuo
  luoyang:   'dong',
  changan:   'dong',
  // Liu Biao
  xiangyang: 'liu-biao',
  jiangxia:  'liu-biao',
  lingling:  'liu-biao',
  xinye:     'liu-biao',
  // Liu Yan
  chengdu:   'liu-yan',
  yongan:    'liu-yan',
  // Gongsun Zan
  beiping:   'gongsun',
  liaodong:  'gongsun',
  // Tao Qian
  pengcheng: 'tao',
  xiapi:     'tao',
  // Kong Rong
  beihai:    'kong-rong',
  // Ma Teng
  wuwei:     'ma-teng',
  // Cao Cao historical home base (Phase 12 addition)
  chenliu:   'cao',
  // Gongsun Zan / Liu Bei historical seat
  pingyuan:  'gongsun',
  // Liu Biao southern Jing
  wuling:    'liu-biao',
  // Liu Yan's east Sichuan
  jiangzhou: 'liu-yan',
  // Neutral: taiyuan, yanmen, jincheng, hanzhong, wu, jiaozhi,
  //          anding, shangdang, guiyang, nanhai, hepu, wudu
};

const OFFICER_ASSIGNMENTS_190: Record<string, { forceId: string; cityId: string }> = {
  // Cao
  'cao-cao':     { forceId: 'cao',       cityId: 'xuchang' },
  'xiahou-dun':  { forceId: 'cao',       cityId: 'xuchang' },
  'xiahou-yuan': { forceId: 'cao',       cityId: 'xuchang' },
  'cao-ren':     { forceId: 'cao',       cityId: 'xuchang' },
  'cao-hong':    { forceId: 'cao',       cityId: 'xuchang' },
  'yu-jin':      { forceId: 'cao',       cityId: 'xuchang' },
  'le-jin':      { forceId: 'cao',       cityId: 'xuchang' },
  'xun-yu':      { forceId: 'cao',       cityId: 'xuchang' },
  'guo-jia':     { forceId: 'cao',       cityId: 'xuchang' },
  // Gongsun (Liu Bei serves him in 190)
  'liu-bei':     { forceId: 'gongsun',   cityId: 'beiping' },
  'guan-yu':     { forceId: 'gongsun',   cityId: 'beiping' },
  'zhang-fei':   { forceId: 'gongsun',   cityId: 'beiping' },
  'gongsun-zan': { forceId: 'gongsun',   cityId: 'beiping' },
  // Yuan Shao
  'yuan-shao':   { forceId: 'yuan-shao', cityId: 'ye' },
  'yan-liang':   { forceId: 'yuan-shao', cityId: 'ye' },
  'wen-chou':    { forceId: 'yuan-shao', cityId: 'ye' },
  'zhang-he':    { forceId: 'yuan-shao', cityId: 'bohai' },
  'tian-feng':   { forceId: 'yuan-shao', cityId: 'ye' },
  // Yuan Shu
  'yuan-shu':    { forceId: 'yuan-shu',  cityId: 'shouchun' },
  'ji-ling':     { forceId: 'yuan-shu',  cityId: 'wancheng' },
  // Sun
  'sun-jian':    { forceId: 'sun',       cityId: 'jianye' },
  'cheng-pu':    { forceId: 'sun',       cityId: 'jianye' },
  'huang-gai':   { forceId: 'sun',       cityId: 'changsha' },
  'zhou-tai':    { forceId: 'sun',       cityId: 'jianye' },
  'han-dang':    { forceId: 'sun',       cityId: 'yuzhang' },
  // Dong
  'dong-zhuo':   { forceId: 'dong',      cityId: 'luoyang' },
  'lu-bu':       { forceId: 'dong',      cityId: 'luoyang' },
  'li-ru':       { forceId: 'dong',      cityId: 'changan' },
  // Liu Biao
  'liu-biao':    { forceId: 'liu-biao',  cityId: 'xiangyang' },
  // Liu Yan
  'liu-yan':     { forceId: 'liu-yan',   cityId: 'chengdu' },
  // Tao
  'tao-qian':    { forceId: 'tao',       cityId: 'pengcheng' },
  // Kong Rong
  'kong-rong':   { forceId: 'kong-rong', cityId: 'beihai' },
  // Ma Teng
  'ma-teng':     { forceId: 'ma-teng',   cityId: 'wuwei' },
};

export const SCENARIO_190_ANTI_DONG_ZHUO: Scenario = {
  id: 'scn-190-anti-dong-zhuo',
  name: { en: 'Anti-Dong Zhuo Coalition', zh: '反董卓聯軍' },
  description:
    'Spring 190 AD. Dong Zhuo controls the Han court at Luoyang and rules through terror. ' +
    'A coalition of regional lords assembles to depose him. 30 cities, 11 warlords vie for the empire.',
  startDate: { year: 190, season: 'spring' },
  cities: buildInitialCities(CITY_OWNERSHIP_190),
  forces: FORCES_190,
  officers: buildInitialOfficers(OFFICER_ASSIGNMENTS_190),
};

// ──────────────────────────────────────────────────────────────────────
// Scenario 2 — 200 AD Battle of Guandu (30 cities, 7 forces)
// ──────────────────────────────────────────────────────────────────────

const FORCES_200: Force[] = [
  { id: 'cao',       name: { en: 'Cao Cao',     zh: '曹操軍' }, rulerOfficerId: 'cao-cao',  capitalCityId: 'xuchang',   color: '#3a7dd9', isPlayer: false },
  { id: 'yuan-shao', name: { en: 'Yuan Shao',   zh: '袁紹軍' }, rulerOfficerId: 'yuan-shao',capitalCityId: 'ye',        color: '#b8442e', isPlayer: false },
  { id: 'sun',       name: { en: 'Sun Ce',      zh: '孫策軍' }, rulerOfficerId: 'sun-ce',   capitalCityId: 'jianye',    color: '#2f8e6f', isPlayer: false },
  { id: 'liu-bei',   name: { en: 'Liu Bei',     zh: '劉備軍' }, rulerOfficerId: 'liu-bei',  capitalCityId: 'pengcheng', color: '#a85d8a', isPlayer: false },
  { id: 'liu-biao',  name: { en: 'Liu Biao',    zh: '劉表軍' }, rulerOfficerId: 'liu-biao', capitalCityId: 'xiangyang', color: '#c19a3b', isPlayer: false },
  { id: 'liu-zhang', name: { en: 'Liu Zhang',   zh: '劉璋軍' }, rulerOfficerId: 'liu-zhang',capitalCityId: 'chengdu',   color: '#d9803a', isPlayer: false },
  { id: 'ma-teng',   name: { en: 'Ma Teng',     zh: '馬騰軍' }, rulerOfficerId: 'ma-teng',  capitalCityId: 'wuwei',     color: '#a8703a', isPlayer: false },
  { id: 'wuhuan',    name: { en: 'Wuhuan',      zh: '烏丸'   }, rulerOfficerId: 'tadun',    capitalCityId: 'wuhuan',    color: '#7a5a3a', isPlayer: false },
];

const CITY_OWNERSHIP_200: Record<string, string> = {
  // Cao Cao (consolidated)
  xuchang:   'cao',
  luoyang:   'cao',
  wancheng:  'cao',
  runan:     'cao',
  xinye:     'cao',
  // Yuan Shao (absorbed Gongsun Zan + Kong Rong + Han north)
  ye:        'yuan-shao',
  beiping:   'yuan-shao',
  taiyuan:   'yuan-shao',
  bohai:     'yuan-shao',
  yanmen:    'yuan-shao',
  beihai:    'yuan-shao',
  // Sun Ce (Yuan Shu's south + Jiangdong)
  jianye:    'sun',
  shouchun:  'sun',
  wu:        'sun',
  changsha:  'sun',
  hefei:     'sun',
  yuzhang:   'sun',
  // Liu Bei
  pengcheng: 'liu-bei',
  xiapi:     'liu-bei',
  // Liu Biao
  xiangyang: 'liu-biao',
  jiangxia:  'liu-biao',
  lingling:  'liu-biao',
  // Liu Zhang
  chengdu:   'liu-zhang',
  yongan:    'liu-zhang',
  // Ma Teng
  wuwei:     'ma-teng',
  jincheng:  'ma-teng',
  anding:    'ma-teng',
  // Cao gained Chenliu / Pingyuan area
  chenliu:   'cao',
  pingyuan:  'yuan-shao', // Yuan Shao took it from Gongsun Zan
  shangdang: 'yuan-shao',
  // Liu Biao consolidated southern Jing
  wuling:    'liu-biao',
  // Liu Zhang's east Sichuan
  jiangzhou: 'liu-zhang',
  // Sun Ce expanded south
  guiyang:   'sun',
  // Wuhuan — Tadun's tribe on the northeast frontier
  wuhuan:    'wuhuan',
  // Neutral: liaodong, changan, hanzhong, jiaozhi, nanhai, hepu, wudu
};

const OFFICER_ASSIGNMENTS_200: Record<string, { forceId: string; cityId: string }> = {
  // Cao
  'cao-cao':     { forceId: 'cao',       cityId: 'xuchang' },
  'xiahou-dun':  { forceId: 'cao',       cityId: 'xuchang' },
  'xiahou-yuan': { forceId: 'cao',       cityId: 'luoyang' },
  'cao-ren':     { forceId: 'cao',       cityId: 'wancheng' },
  'cao-hong':    { forceId: 'cao',       cityId: 'xuchang' },
  'yu-jin':      { forceId: 'cao',       cityId: 'runan' },
  'le-jin':      { forceId: 'cao',       cityId: 'xuchang' },
  'xun-yu':      { forceId: 'cao',       cityId: 'xuchang' },
  'guo-jia':     { forceId: 'cao',       cityId: 'xuchang' },
  // Yuan Shao
  'yuan-shao':   { forceId: 'yuan-shao', cityId: 'ye' },
  'yan-liang':   { forceId: 'yuan-shao', cityId: 'ye' },
  'wen-chou':    { forceId: 'yuan-shao', cityId: 'ye' },
  'zhang-he':    { forceId: 'yuan-shao', cityId: 'bohai' },
  'tian-feng':   { forceId: 'yuan-shao', cityId: 'ye' },
  // Sun
  'sun-ce':      { forceId: 'sun',       cityId: 'jianye' },
  'sun-quan':    { forceId: 'sun',       cityId: 'jianye' },
  'cheng-pu':    { forceId: 'sun',       cityId: 'jianye' },
  'huang-gai':   { forceId: 'sun',       cityId: 'shouchun' },
  'zhou-tai':    { forceId: 'sun',       cityId: 'jianye' },
  'han-dang':    { forceId: 'sun',       cityId: 'changsha' },
  // Liu Bei
  'liu-bei':     { forceId: 'liu-bei',   cityId: 'pengcheng' },
  'guan-yu':     { forceId: 'liu-bei',   cityId: 'pengcheng' },
  'zhang-fei':   { forceId: 'liu-bei',   cityId: 'xiapi' },
  // Liu Biao
  'liu-biao':    { forceId: 'liu-biao',  cityId: 'xiangyang' },
  // Liu Zhang
  'liu-zhang':   { forceId: 'liu-zhang', cityId: 'chengdu' },
  // Ma Teng
  'ma-teng':     { forceId: 'ma-teng',   cityId: 'wuwei' },
  // Wuhuan
  'tadun':       { forceId: 'wuhuan',    cityId: 'wuhuan' },
};

const DEAD_BY_200 = [
  'yuan-shu',
  'ji-ling',
  'sun-jian',
  'dong-zhuo',
  'lu-bu',
  'li-ru',
  'liu-yan',
  'gongsun-zan',
  'tao-qian',
  'kong-rong', // historically alive until 208 but force is absorbed by 200
];

export const SCENARIO_200_GUANDU: Scenario = {
  id: 'scn-200-guandu',
  name: { en: 'Battle of Guandu', zh: '官渡之戰' },
  description:
    'Autumn 200 AD. Yuan Shao musters 100,000 troops at Ye to crush the upstart Cao Cao. ' +
    'In the south, Sun Ce holds the Jiangdong; Liu Bei has fled to Xuzhou. ' +
    'Dong Zhuo and Lu Bu are long dead. Ma Teng watches from Liang.',
  startDate: { year: 200, season: 'autumn' },
  cities: buildInitialCities(CITY_OWNERSHIP_200),
  forces: FORCES_200,
  officers: buildInitialOfficers(OFFICER_ASSIGNMENTS_200, DEAD_BY_200),
};

// ──────────────────────────────────────────────────────────────────────
// Scenario 3 — Gathering of Heroes 英雄集結 (RTK XIV PK what-if)
// Every warlord alive, every iconic ruler in their canonical seat.
// Matches RTK XIV PK's 17-force layout.
// ──────────────────────────────────────────────────────────────────────

const FORCES_GATHERING: Force[] = [
  { id: 'cao',         name: { en: 'Cao Cao',     zh: '曹操軍'   }, rulerOfficerId: 'cao-cao',     capitalCityId: 'xuchang',  color: '#3a7dd9', isPlayer: false },
  { id: 'liu-bei',     name: { en: 'Liu Bei',     zh: '劉備軍'   }, rulerOfficerId: 'liu-bei',     capitalCityId: 'pingyuan', color: '#a85d8a', isPlayer: false },
  { id: 'sun',         name: { en: 'Sun Ce',      zh: '孫策軍'   }, rulerOfficerId: 'sun-ce',      capitalCityId: 'jianye',   color: '#2f8e6f', isPlayer: false },
  { id: 'yuan-shao',   name: { en: 'Yuan Shao',   zh: '袁紹軍'   }, rulerOfficerId: 'yuan-shao',   capitalCityId: 'ye',       color: '#b8442e', isPlayer: false },
  { id: 'yuan-shu',    name: { en: 'Yuan Shu',    zh: '袁術軍'   }, rulerOfficerId: 'yuan-shu',    capitalCityId: 'shouchun', color: '#a85d8a', isPlayer: false },
  { id: 'dong',        name: { en: 'Dong Zhuo',   zh: '董卓軍'   }, rulerOfficerId: 'dong-zhuo',   capitalCityId: 'changan',  color: '#6b4a8a', isPlayer: false },
  { id: 'lubu',        name: { en: 'Lu Bu',       zh: '呂布軍'   }, rulerOfficerId: 'lu-bu',       capitalCityId: 'xiapi',    color: '#9b3a3a', isPlayer: false },
  { id: 'liu-biao',    name: { en: 'Liu Biao',    zh: '劉表軍'   }, rulerOfficerId: 'liu-biao',    capitalCityId: 'xiangyang',color: '#c19a3b', isPlayer: false },
  { id: 'liu-yan',     name: { en: 'Liu Yan',     zh: '劉焉軍'   }, rulerOfficerId: 'liu-yan',     capitalCityId: 'chengdu',  color: '#d9803a', isPlayer: false },
  { id: 'zhang-lu',    name: { en: 'Zhang Lu',    zh: '張魯軍'   }, rulerOfficerId: 'zhang-lu',    capitalCityId: 'hanzhong', color: '#6b8a6b', isPlayer: false },
  { id: 'gongsun',     name: { en: 'Gongsun Zan', zh: '公孫瓚軍' }, rulerOfficerId: 'gongsun-zan', capitalCityId: 'beiping',  color: '#5a9bb8', isPlayer: false },
  { id: 'gongsun-du',  name: { en: 'Gongsun Du',  zh: '公孫度軍' }, rulerOfficerId: 'gongsun-du',  capitalCityId: 'liaodong', color: '#3a7d9b', isPlayer: false },
  { id: 'ma-teng',     name: { en: 'Ma Teng',     zh: '馬騰軍'   }, rulerOfficerId: 'ma-teng',     capitalCityId: 'wuwei',    color: '#a8703a', isPlayer: false },
  { id: 'han-sui',     name: { en: 'Han Sui',     zh: '韓遂軍'   }, rulerOfficerId: 'han-sui',     capitalCityId: 'jincheng', color: '#8a503a', isPlayer: false },
  { id: 'kong-rong',   name: { en: 'Kong Rong',   zh: '孔融軍'   }, rulerOfficerId: 'kong-rong',   capitalCityId: 'beihai',   color: '#d97a3a', isPlayer: false },
  { id: 'tao',         name: { en: 'Tao Qian',    zh: '陶謙軍'   }, rulerOfficerId: 'tao-qian',    capitalCityId: 'pengcheng',color: '#8a8a3a', isPlayer: false },
  { id: 'shi-xie',     name: { en: 'Shi Xie',     zh: '士燮軍'   }, rulerOfficerId: 'shi-xie',     capitalCityId: 'jiaozhi',  color: '#5a8a3a', isPlayer: false },
];

const CITY_OWNERSHIP_GATHERING: Record<string, string> = {
  // ── Cao Cao (5): central plain ──
  xuchang:   'cao',
  luoyang:   'cao',
  wancheng:  'cao',
  chenliu:   'cao',
  runan:     'cao',
  // ── Liu Bei (2): refugee warlord ──
  pingyuan:  'liu-bei',
  xinye:     'liu-bei',
  // ── Sun Ce (5): Jiangdong ──
  jianye:    'sun',
  wu:        'sun',
  yuzhang:   'sun',
  changsha:  'sun',
  hefei:     'sun',
  // ── Yuan Shao (5): northern overlord ──
  ye:        'yuan-shao',
  bohai:     'yuan-shao',
  yanmen:    'yuan-shao',
  shangdang: 'yuan-shao',
  taiyuan:   'yuan-shao',
  // ── Yuan Shu (1): Shouchun ──
  shouchun:  'yuan-shu',
  // ── Dong Zhuo (1): Han west ──
  changan:   'dong',
  // ── Lü Bu (1): Xiapi ──
  xiapi:     'lubu',
  // ── Liu Biao (4): Jing ──
  xiangyang: 'liu-biao',
  jiangxia:  'liu-biao',
  wuling:    'liu-biao',
  lingling:  'liu-biao',
  // ── Liu Yan (3): Yi province (his son Liu Zhang serves him) ──
  chengdu:   'liu-yan',
  yongan:    'liu-yan',
  jiangzhou: 'liu-yan',
  // ── Zhang Lu (1): Hanzhong (Daoist theocracy) ──
  hanzhong:  'zhang-lu',
  // ── Gongsun Zan (1): Beiping ──
  beiping:   'gongsun',
  // ── Gongsun Du (1): Liaodong ──
  liaodong:  'gongsun-du',
  // ── Ma Teng (2): Liang ──
  wuwei:     'ma-teng',
  anding:    'ma-teng',
  // ── Han Sui (2): also Liang, west of Ma Teng ──
  jincheng:  'han-sui',
  wudu:      'han-sui',
  // ── Kong Rong (1): Beihai ──
  beihai:    'kong-rong',
  // ── Tao Qian (1): Xu province ──
  pengcheng: 'tao',
  // ── Shi Xie (3): Jiao province ──
  jiaozhi:   'shi-xie',
  nanhai:    'shi-xie',
  hepu:      'shi-xie',
  // ── Neutral (1): Guiyang (between Sun and Liu Biao) ──
};

const OFFICER_ASSIGNMENTS_GATHERING: Record<string, { forceId: string; cityId: string }> = {
  // ── Gongsun Du (Liaodong, newly added force) ──
  'gongsun-du':  { forceId: 'gongsun-du', cityId: 'liaodong' },
  'gongsun-kang':{ forceId: 'gongsun-du', cityId: 'liaodong' },

  // ── Zhang Lu (Hanzhong Daoist theocracy) ──
  'zhang-lu':    { forceId: 'zhang-lu', cityId: 'hanzhong' },
  'yang-song':   { forceId: 'zhang-lu', cityId: 'hanzhong' },

  // ── Shi Xie (Jiaozhi) ──
  'shi-xie':     { forceId: 'shi-xie', cityId: 'jiaozhi' },

  // ── Tao Qian (Xu, revived) ──
  'tao-qian':    { forceId: 'tao', cityId: 'pengcheng' },
  'cao-bao':     { forceId: 'tao', cityId: 'pengcheng' },

  // ── Kong Rong (Beihai, revived) ──
  'kong-rong':   { forceId: 'kong-rong', cityId: 'beihai' },

  // ── Han Sui (split from Ma Teng into own force) ──
  'han-sui':     { forceId: 'han-sui', cityId: 'jincheng' },
  'cheng-yi':    { forceId: 'han-sui', cityId: 'jincheng' },
  'hou-xuan':    { forceId: 'han-sui', cityId: 'jincheng' },
  'liang-xing':  { forceId: 'han-sui', cityId: 'wudu' },
  'yang-qiu':    { forceId: 'han-sui', cityId: 'wudu' },

  // ── Cao Cao force ──
  'cao-cao':     { forceId: 'cao', cityId: 'xuchang' },
  'cao-pi':      { forceId: 'cao', cityId: 'xuchang' },
  'cao-zhi':     { forceId: 'cao', cityId: 'xuchang' },
  'cao-zhang':   { forceId: 'cao', cityId: 'luoyang' },
  'cao-ang':     { forceId: 'cao', cityId: 'xuchang' },
  'cao-anmin':   { forceId: 'cao', cityId: 'xuchang' },
  'cao-chun':    { forceId: 'cao', cityId: 'chenliu' },
  'cao-ren':     { forceId: 'cao', cityId: 'wancheng' },
  'cao-hong':    { forceId: 'cao', cityId: 'xuchang' },
  'cao-xiu':     { forceId: 'cao', cityId: 'chenliu' },
  'cao-zhen':    { forceId: 'cao', cityId: 'luoyang' },
  'cao-rui':     { forceId: 'cao', cityId: 'xuchang' },
  'cao-shuang':  { forceId: 'cao', cityId: 'xuchang' },
  'cao-yu':      { forceId: 'cao', cityId: 'runan' },
  'xiahou-dun':  { forceId: 'cao', cityId: 'xuchang' },
  'xiahou-yuan': { forceId: 'cao', cityId: 'chenliu' },
  'xiahou-ba':   { forceId: 'cao', cityId: 'luoyang' },
  'xiahou-shang':{ forceId: 'cao', cityId: 'wancheng' },
  'xun-yu':      { forceId: 'cao', cityId: 'xuchang' },
  'xun-you':     { forceId: 'cao', cityId: 'xuchang' },
  'guo-jia':     { forceId: 'cao', cityId: 'xuchang' },
  'cheng-yu':    { forceId: 'cao', cityId: 'xuchang' },
  'liu-ye':      { forceId: 'cao', cityId: 'xuchang' },
  'jia-xu':      { forceId: 'cao', cityId: 'wancheng' },
  'xi-zhicai':   { forceId: 'cao', cityId: 'chenliu' },
  'sima-yi':     { forceId: 'cao', cityId: 'luoyang' },
  'sima-shi':    { forceId: 'cao', cityId: 'luoyang' },
  'sima-zhao':   { forceId: 'cao', cityId: 'luoyang' },
  'sima-lang':   { forceId: 'cao', cityId: 'xuchang' },
  'deng-ai':     { forceId: 'cao', cityId: 'luoyang' },
  'zhong-hui':   { forceId: 'cao', cityId: 'runan' },
  'xu-huang':    { forceId: 'cao', cityId: 'wancheng' },
  'yu-jin':      { forceId: 'cao', cityId: 'runan' },
  'le-jin':      { forceId: 'cao', cityId: 'xuchang' },
  'li-dian':     { forceId: 'cao', cityId: 'runan' },
  'zhang-liao':  { forceId: 'cao', cityId: 'luoyang' },
  'dian-wei':    { forceId: 'cao', cityId: 'xuchang' },
  'xu-chu':      { forceId: 'cao', cityId: 'xuchang' },
  'pang-de':     { forceId: 'cao', cityId: 'wancheng' },
  'man-chong':   { forceId: 'cao', cityId: 'runan' },
  'hao-zhao':    { forceId: 'cao', cityId: 'chenliu' },
  'zang-ba':     { forceId: 'cao', cityId: 'chenliu' },
  'wen-pin':     { forceId: 'cao', cityId: 'wancheng' },
  'guo-huai':    { forceId: 'cao', cityId: 'luoyang' },
  'chen-tai':    { forceId: 'cao', cityId: 'luoyang' },
  'chen-qun':    { forceId: 'cao', cityId: 'xuchang' },
  'hua-xin':     { forceId: 'cao', cityId: 'xuchang' },
  'wang-lang':   { forceId: 'cao', cityId: 'xuchang' },
  'mao-jie':     { forceId: 'cao', cityId: 'xuchang' },
  'han-hao':     { forceId: 'cao', cityId: 'wancheng' },
  'shi-huan':    { forceId: 'cao', cityId: 'chenliu' },
  'yang-hu':     { forceId: 'cao', cityId: 'luoyang' },
  'jia-kui':     { forceId: 'cao', cityId: 'runan' },
  'yang-fu':     { forceId: 'cao', cityId: 'chenliu' },
  'tian-yu':     { forceId: 'cao', cityId: 'runan' },
  'zhao-yan':    { forceId: 'cao', cityId: 'wancheng' },
  'du-xi':       { forceId: 'cao', cityId: 'runan' },
  'chen-jiao':   { forceId: 'cao', cityId: 'xuchang' },
  'wang-bi':     { forceId: 'cao', cityId: 'xuchang' },

  // ── Liu Bei force (small, at Pingyuan + Xinye) ──
  'liu-bei':     { forceId: 'liu-bei', cityId: 'pingyuan' },
  'guan-yu':     { forceId: 'liu-bei', cityId: 'pingyuan' },
  'zhang-fei':   { forceId: 'liu-bei', cityId: 'pingyuan' },
  'liu-shan':    { forceId: 'liu-bei', cityId: 'pingyuan' },
  'liu-feng':    { forceId: 'liu-bei', cityId: 'xinye' },
  'liu-yong':    { forceId: 'liu-bei', cityId: 'pingyuan' },
  'zhuge-liang': { forceId: 'liu-bei', cityId: 'xinye' },
  'pang-tong':   { forceId: 'liu-bei', cityId: 'xinye' },
  'fa-zheng':    { forceId: 'liu-bei', cityId: 'xinye' },
  'ma-liang':    { forceId: 'liu-bei', cityId: 'xinye' },
  'ma-su':       { forceId: 'liu-bei', cityId: 'xinye' },
  'zhao-yun':    { forceId: 'liu-bei', cityId: 'pingyuan' },
  'huang-zhong': { forceId: 'liu-bei', cityId: 'xinye' },
  'wei-yan':     { forceId: 'liu-bei', cityId: 'xinye' },
  'liao-hua':    { forceId: 'liu-bei', cityId: 'pingyuan' },
  'guan-ping':   { forceId: 'liu-bei', cityId: 'pingyuan' },
  'guan-xing':   { forceId: 'liu-bei', cityId: 'pingyuan' },
  'zhang-bao':   { forceId: 'liu-bei', cityId: 'pingyuan' },
  'zhou-cang':   { forceId: 'liu-bei', cityId: 'pingyuan' },
  'jian-yong':   { forceId: 'liu-bei', cityId: 'pingyuan' },
  'sun-qian':    { forceId: 'liu-bei', cityId: 'pingyuan' },
  'mi-zhu':      { forceId: 'liu-bei', cityId: 'pingyuan' },
  'mi-fang':     { forceId: 'liu-bei', cityId: 'pingyuan' },
  'fu-shi-ren':  { forceId: 'liu-bei', cityId: 'xinye' },
  'liu-ba':      { forceId: 'liu-bei', cityId: 'xinye' },
  'jiang-wei':   { forceId: 'liu-bei', cityId: 'pingyuan' },
  'deng-zhi':    { forceId: 'liu-bei', cityId: 'xinye' },
  'fei-yi':      { forceId: 'liu-bei', cityId: 'xinye' },
  'jiang-wan':   { forceId: 'liu-bei', cityId: 'xinye' },
  'dong-yun':    { forceId: 'liu-bei', cityId: 'xinye' },
  'wang-ping':   { forceId: 'liu-bei', cityId: 'pingyuan' },
  'ma-zhong':    { forceId: 'liu-bei', cityId: 'pingyuan' },
  'zhang-yi':    { forceId: 'liu-bei', cityId: 'pingyuan' },
  'yang-yi':     { forceId: 'liu-bei', cityId: 'xinye' },
  'li-yan':      { forceId: 'liu-bei', cityId: 'xinye' },
  'huo-yi':      { forceId: 'liu-bei', cityId: 'pingyuan' },
  'lady-sun':    { forceId: 'liu-bei', cityId: 'pingyuan' },
  'lady-gan':    { forceId: 'liu-bei', cityId: 'pingyuan' },
  'lady-mi':     { forceId: 'liu-bei', cityId: 'pingyuan' },

  // ── Sun Quan force ──
  'sun-jian':    { forceId: 'sun', cityId: 'jianye' },
  'sun-ce':      { forceId: 'sun', cityId: 'jianye' },
  'sun-quan':    { forceId: 'sun', cityId: 'jianye' },
  'sun-yi':      { forceId: 'sun', cityId: 'wu' },
  'sun-kuang':   { forceId: 'sun', cityId: 'jianye' },
  'zhou-yu':     { forceId: 'sun', cityId: 'jianye' },
  'lu-su':       { forceId: 'sun', cityId: 'jianye' },
  'lu-meng':     { forceId: 'sun', cityId: 'hefei' },
  'lu-xun':      { forceId: 'sun', cityId: 'wu' },
  'lu-kang':     { forceId: 'sun', cityId: 'wu' },
  'cheng-pu':    { forceId: 'sun', cityId: 'jianye' },
  'huang-gai':   { forceId: 'sun', cityId: 'changsha' },
  'han-dang':    { forceId: 'sun', cityId: 'yuzhang' },
  'zhou-tai':    { forceId: 'sun', cityId: 'jianye' },
  'taishi-ci':   { forceId: 'sun', cityId: 'jianye' },
  'gan-ning':    { forceId: 'sun', cityId: 'changsha' },
  'ling-tong'   : { forceId: 'sun', cityId: 'changsha' }, // Ling Tong (legacy id)
  'jiang-qin':   { forceId: 'sun', cityId: 'wu' },
  'zhu-ran':     { forceId: 'sun', cityId: 'jianye' },
  'ding-feng':   { forceId: 'sun', cityId: 'jianye' },
  'pan-zhang':   { forceId: 'sun', cityId: 'hefei' },
  'xu-sheng-wu':     { forceId: 'sun', cityId: 'jianye' }, // Xu Sheng (legacy id)
  'zhu-zhi':     { forceId: 'sun', cityId: 'wu' },
  'zhu-huan':    { forceId: 'sun', cityId: 'yuzhang' },
  'zhang-zhao':  { forceId: 'sun', cityId: 'jianye' },
  'zhang-hong':  { forceId: 'sun', cityId: 'jianye' },
  'gu-yong':     { forceId: 'sun', cityId: 'wu' },
  'bu-zhi':      { forceId: 'sun', cityId: 'yuzhang' },
  'zhuge-jin':   { forceId: 'sun', cityId: 'jianye' },
  'zhuge-ke':    { forceId: 'sun', cityId: 'jianye' },
  'da-qiao':     { forceId: 'sun', cityId: 'jianye' },
  'xiao-qiao':   { forceId: 'sun', cityId: 'jianye' },
  'pan-jun':     { forceId: 'sun', cityId: 'changsha' },
  'he-qi':       { forceId: 'sun', cityId: 'wu' },
  'lu-dai':      { forceId: 'sun', cityId: 'yuzhang' },
  'zhuge-dan':   { forceId: 'sun', cityId: 'hefei' },
  'pan-lin':     { forceId: 'sun', cityId: 'changsha' },
  'quan-cong':   { forceId: 'sun', cityId: 'jianye' },
  'quan-yi':     { forceId: 'sun', cityId: 'jianye' },
  'yu-fan':      { forceId: 'sun', cityId: 'jianye' },
  'hu-zong':     { forceId: 'sun', cityId: 'wu' },
  'chen-wu':     { forceId: 'sun', cityId: 'jianye' },
  'dong-xi':     { forceId: 'sun', cityId: 'hefei' },
  'lu-fan':      { forceId: 'sun', cityId: 'jianye' },
  'su-fei':      { forceId: 'sun', cityId: 'changsha' },
  'zhang-wen':   { forceId: 'sun', cityId: 'jianye' },

  // ── Yuan Shao force ──
  'yuan-shao':   { forceId: 'yuan-shao', cityId: 'ye' },
  'yuan-tan':    { forceId: 'yuan-shao', cityId: 'bohai' },
  'yuan-shang':  { forceId: 'yuan-shao', cityId: 'ye' },
  'yuan-xi':     { forceId: 'yuan-shao', cityId: 'shangdang' },
  'yan-liang':   { forceId: 'yuan-shao', cityId: 'ye' },
  'wen-chou':    { forceId: 'yuan-shao', cityId: 'ye' },
  'zhang-he':    { forceId: 'yuan-shao', cityId: 'bohai' },
  'gao-lan':     { forceId: 'yuan-shao', cityId: 'taiyuan' },
  'tian-feng':   { forceId: 'yuan-shao', cityId: 'ye' },
  'ju-shou':     { forceId: 'yuan-shao', cityId: 'ye' },
  'shen-pei':    { forceId: 'yuan-shao', cityId: 'bohai' },
  'guo-tu':      { forceId: 'yuan-shao', cityId: 'ye' },
  'feng-ji':     { forceId: 'yuan-shao', cityId: 'ye' },

  // ── Yuan Shu ──
  'yuan-shu':    { forceId: 'yuan-shu', cityId: 'shouchun' },
  'ji-ling':     { forceId: 'yuan-shu', cityId: 'shouchun' },

  // ── Dong Zhuo force ──
  'dong-zhuo':   { forceId: 'dong', cityId: 'changan' },
  'li-ru':       { forceId: 'dong', cityId: 'changan' },
  'hua-xiong':   { forceId: 'dong', cityId: 'changan' },
  'xu-rong':     { forceId: 'dong', cityId: 'changan' },
  'niu-fu':      { forceId: 'dong', cityId: 'changan' },
  'wang-yun':    { forceId: 'dong', cityId: 'changan' },
  'diaochan':    { forceId: 'dong', cityId: 'changan' },

  // ── Lu Bu force ──
  'lu-bu':       { forceId: 'lubu', cityId: 'xiapi' },
  'chen-gong':   { forceId: 'lubu', cityId: 'xiapi' },
  'gao-shun':    { forceId: 'lubu', cityId: 'xiapi' },
  'cao-xing':    { forceId: 'lubu', cityId: 'xiapi' },
  'song-xian':   { forceId: 'lubu', cityId: 'xiapi' },
  'hou-cheng':   { forceId: 'lubu', cityId: 'xiapi' },

  // ── Liu Biao force ──
  'liu-biao':    { forceId: 'liu-biao', cityId: 'xiangyang' },
  'liu-qi':      { forceId: 'liu-biao', cityId: 'jiangxia' },
  'cai-mao':     { forceId: 'liu-biao', cityId: 'xiangyang' },
  'zhang-yun':   { forceId: 'liu-biao', cityId: 'xiangyang' },
  'kuai-liang':  { forceId: 'liu-biao', cityId: 'xiangyang' },
  'kuai-yue':    { forceId: 'liu-biao', cityId: 'xiangyang' },
  'huang-zu':    { forceId: 'liu-biao', cityId: 'jiangxia' },
  'yi-ji'      :  { forceId: 'liu-biao', cityId: 'wuling' }, // Yi Ji (legacy id)
  'han-xuan':    { forceId: 'liu-biao', cityId: 'wuling' },
  'liu-du':      { forceId: 'liu-biao', cityId: 'lingling' },
  'zhao-fan':    { forceId: 'liu-biao', cityId: 'wuling' },
  'jin-xuan':    { forceId: 'liu-biao', cityId: 'wuling' },

  // ── Liu Yan force (Yi province; Liu Zhang serves as his son) ──
  'liu-yan':     { forceId: 'liu-yan', cityId: 'chengdu' },
  'liu-zhang':   { forceId: 'liu-yan', cityId: 'chengdu' },
  'zhang-ren':   { forceId: 'liu-yan', cityId: 'chengdu' },
  'yan-yan':     { forceId: 'liu-yan', cityId: 'jiangzhou' },
  'meng-da':     { forceId: 'liu-yan', cityId: 'yongan' },
  'wu-yi':       { forceId: 'liu-yan', cityId: 'chengdu' },
  'wu-lan':      { forceId: 'liu-yan', cityId: 'yongan' },
  'leigh-tong':  { forceId: 'liu-yan', cityId: 'jiangzhou' }, // Lei Tong
  'wu-ban':      { forceId: 'liu-yan', cityId: 'chengdu' },

  // ── Gongsun Zan force ──
  'gongsun-zan': { forceId: 'gongsun', cityId: 'beiping' },
  'tian-kai':    { forceId: 'gongsun', cityId: 'beiping' },

  // ── Ma Teng force (Wuwei + Anding only — Han Sui split off) ──
  'ma-teng':     { forceId: 'ma-teng', cityId: 'wuwei' },
  'ma-chao':     { forceId: 'ma-teng', cityId: 'wuwei' },
  'ma-dai':      { forceId: 'ma-teng', cityId: 'wuwei' },
  'pang-de-ye':  { forceId: 'ma-teng', cityId: 'anding' }, // Yan Xing
  'wang-yi':     { forceId: 'ma-teng', cityId: 'wuwei' },
};

export const SCENARIO_GATHERING_OF_HEROES: Scenario = {
  id: 'scn-gathering-of-heroes',
  name: { en: 'Gathering of Heroes', zh: '英雄集結' },
  description:
    'The RTK XIV PK fantasy convergence. Seventeen warlords stand simultaneously across the realm — ' +
    'Cao Cao at Xuchang, Sun Ce on the Yangtze, Dong Zhuo holding Chang\'an, Lu Bu at Xiapi, Zhang Lu in Hanzhong, ' +
    'Liu Yan ruling Yi, Han Sui in Liang, Gongsun Du in Liaodong, Shi Xie at Jiao. ' +
    'Time is unmoored; every officer who ever drew breath now serves a banner. The realm awaits a single conqueror.',
  startDate: { year: 200, season: 'spring' },
  cities: buildInitialCities(CITY_OWNERSHIP_GATHERING),
  forces: FORCES_GATHERING,
  officers: buildInitialOfficers(OFFICER_ASSIGNMENTS_GATHERING),
};

// ──────────────────────────────────────────────────────────────────────
// Scenario 4 — 208 Battle of Red Cliffs / Chibi 赤壁之戰
// Cao Cao has crushed the north and marches south. Liu Biao dies; his
// son surrenders. Liu Bei flees with Zhuge Liang. Sun Quan and Liu Bei
// must ally or perish.
// ──────────────────────────────────────────────────────────────────────

const FORCES_208: Force[] = [
  { id: 'cao',       name: { en: 'Cao Cao',     zh: '曹操軍' }, rulerOfficerId: 'cao-cao',   capitalCityId: 'xuchang',  color: '#3a7dd9', isPlayer: false },
  { id: 'liu-bei',   name: { en: 'Liu Bei',     zh: '劉備軍' }, rulerOfficerId: 'liu-bei',   capitalCityId: 'jiangxia', color: '#a85d8a', isPlayer: false },
  { id: 'sun',       name: { en: 'Sun Quan',    zh: '孫權軍' }, rulerOfficerId: 'sun-quan',  capitalCityId: 'jianye',   color: '#2f8e6f', isPlayer: false },
  { id: 'liu-biao',  name: { en: 'Liu Cong',    zh: '劉琮軍' }, rulerOfficerId: 'liu-biao',  capitalCityId: 'xiangyang',color: '#c19a3b', isPlayer: false },
  { id: 'liu-zhang', name: { en: 'Liu Zhang',   zh: '劉璋軍' }, rulerOfficerId: 'liu-zhang', capitalCityId: 'chengdu',  color: '#d9803a', isPlayer: false },
  { id: 'zhang-lu',  name: { en: 'Zhang Lu',    zh: '張魯軍' }, rulerOfficerId: 'zhang-lu',  capitalCityId: 'hanzhong', color: '#6b8a6b', isPlayer: false },
  { id: 'ma-teng',   name: { en: 'Ma Teng',     zh: '馬騰軍' }, rulerOfficerId: 'ma-teng',   capitalCityId: 'wuwei',    color: '#a8703a', isPlayer: false },
  { id: 'shi-xie',   name: { en: 'Shi Xie',     zh: '士燮軍' }, rulerOfficerId: 'shi-xie',   capitalCityId: 'jiaozhi',  color: '#5a8a3a', isPlayer: false },
];

const CITY_OWNERSHIP_208: Record<string, string> = {
  // ── Cao Cao — colossal northern empire ──
  xuchang:   'cao',
  luoyang:   'cao',
  wancheng:  'cao',
  chenliu:   'cao',
  runan:     'cao',
  pingyuan:  'cao',
  ye:        'cao',
  bohai:     'cao',
  beihai:    'cao',
  beiping:   'cao',
  yanmen:    'cao',
  shangdang: 'cao',
  taiyuan:   'cao',
  pengcheng: 'cao',
  xiapi:     'cao',
  shouchun:  'cao',
  changan:   'cao',
  liaodong:  'cao',
  xinye:     'cao',
  guandu:    'cao',
  hulao:     'cao',
  tongguan:  'cao',
  linzi:     'cao',
  lujiang:   'cao',
  // ── Liu Bei — refugee on the Yangtze ──
  jiangxia:  'liu-bei',
  // ── Sun Quan — Jiangdong ──
  jianye:    'sun',
  wu:        'sun',
  hefei:     'sun',
  yuzhang:   'sun',
  changsha:  'sun',
  wuxi:      'sun',
  // ── Liu Cong (succeeded Liu Biao) — about to fold ──
  xiangyang: 'liu-biao',
  jiangling: 'liu-biao',
  wuling:    'liu-biao',
  lingling:  'liu-biao',
  // ── Liu Zhang — Yi province ──
  chengdu:   'liu-zhang',
  yongan:    'liu-zhang',
  jiangzhou: 'liu-zhang',
  // ── Zhang Lu — Hanzhong ──
  hanzhong:  'zhang-lu',
  // ── Ma Teng — Liang ──
  wuwei:     'ma-teng',
  jincheng:  'ma-teng',
  anding:    'ma-teng',
  wudu:      'ma-teng',
  mei:       'ma-teng',
  // ── Shi Xie — Jiao ──
  jiaozhi:   'shi-xie',
  nanhai:    'shi-xie',
  hepu:      'shi-xie',
  // Neutral: guiyang
};

const OFFICER_ASSIGNMENTS_208: Record<string, { forceId: string; cityId: string }> = {
  // Cao Cao at peak power
  'cao-cao':     { forceId: 'cao', cityId: 'xuchang' },
  'cao-pi':      { forceId: 'cao', cityId: 'xuchang' },
  'cao-zhi':     { forceId: 'cao', cityId: 'xuchang' },
  'cao-zhang':   { forceId: 'cao', cityId: 'ye' },
  'cao-ren':     { forceId: 'cao', cityId: 'wancheng' },
  'cao-hong':    { forceId: 'cao', cityId: 'luoyang' },
  'cao-chun':    { forceId: 'cao', cityId: 'chenliu' },
  'cao-xiu':     { forceId: 'cao', cityId: 'pengcheng' },
  'cao-zhen':    { forceId: 'cao', cityId: 'changan' },
  'xiahou-dun':  { forceId: 'cao', cityId: 'xuchang' },
  'xiahou-yuan': { forceId: 'cao', cityId: 'changan' },
  'xun-yu':      { forceId: 'cao', cityId: 'xuchang' },
  'xun-you':     { forceId: 'cao', cityId: 'xuchang' },
  'guo-jia':     { forceId: 'cao', cityId: 'luoyang' }, // dies 207 historically but we keep alive
  'cheng-yu':    { forceId: 'cao', cityId: 'xuchang' },
  'jia-xu':      { forceId: 'cao', cityId: 'wancheng' },
  'sima-yi':     { forceId: 'cao', cityId: 'luoyang' },
  'xu-huang':    { forceId: 'cao', cityId: 'wancheng' },
  'zhang-liao':  { forceId: 'cao', cityId: 'shouchun' },
  'yu-jin':      { forceId: 'cao', cityId: 'wancheng' },
  'le-jin':      { forceId: 'cao', cityId: 'shouchun' },
  'li-dian':     { forceId: 'cao', cityId: 'shouchun' },
  'zhang-he':    { forceId: 'cao', cityId: 'ye' },
  'xu-chu':      { forceId: 'cao', cityId: 'xuchang' },
  'pang-de':     { forceId: 'cao', cityId: 'changan' },
  'man-chong':   { forceId: 'cao', cityId: 'shouchun' },
  'zang-ba':     { forceId: 'cao', cityId: 'pengcheng' },
  'liu-ye':      { forceId: 'cao', cityId: 'xuchang' },
  'chen-qun':    { forceId: 'cao', cityId: 'xuchang' },

  // Liu Bei
  'liu-bei':     { forceId: 'liu-bei', cityId: 'jiangxia' },
  'guan-yu':     { forceId: 'liu-bei', cityId: 'jiangxia' },
  'zhang-fei':   { forceId: 'liu-bei', cityId: 'jiangxia' },
  'zhao-yun':    { forceId: 'liu-bei', cityId: 'jiangxia' },
  'zhuge-liang': { forceId: 'liu-bei', cityId: 'jiangxia' },
  'mi-zhu':      { forceId: 'liu-bei', cityId: 'jiangxia' },
  'mi-fang':     { forceId: 'liu-bei', cityId: 'jiangxia' },
  'sun-qian':    { forceId: 'liu-bei', cityId: 'jiangxia' },
  'jian-yong':   { forceId: 'liu-bei', cityId: 'jiangxia' },
  'liu-feng':    { forceId: 'liu-bei', cityId: 'jiangxia' },
  'liu-shan':    { forceId: 'liu-bei', cityId: 'jiangxia' },
  'liu-qi':      { forceId: 'liu-bei', cityId: 'jiangxia' }, // Liu Biao's son joins Liu Bei

  // Sun Quan
  'sun-quan':    { forceId: 'sun', cityId: 'jianye' },
  'zhou-yu':     { forceId: 'sun', cityId: 'jianye' },
  'lu-su':       { forceId: 'sun', cityId: 'jianye' },
  'cheng-pu':    { forceId: 'sun', cityId: 'jianye' },
  'huang-gai':   { forceId: 'sun', cityId: 'changsha' },
  'han-dang':    { forceId: 'sun', cityId: 'yuzhang' },
  'zhou-tai':    { forceId: 'sun', cityId: 'jianye' },
  'taishi-ci':   { forceId: 'sun', cityId: 'wu' },
  'gan-ning':    { forceId: 'sun', cityId: 'jianye' },
  'ling-tong'   : { forceId: 'sun', cityId: 'wu' }, // Ling Tong (legacy id)
  'jiang-qin':   { forceId: 'sun', cityId: 'wu' },
  'zhang-zhao':  { forceId: 'sun', cityId: 'jianye' },
  'zhang-hong':  { forceId: 'sun', cityId: 'jianye' },
  'lu-meng':     { forceId: 'sun', cityId: 'hefei' },
  'lu-xun':      { forceId: 'sun', cityId: 'wu' },
  'zhuge-jin':   { forceId: 'sun', cityId: 'jianye' },
  'sun-yi':      { forceId: 'sun', cityId: 'wuxi' },

  // Liu Biao (Liu Cong succeeded)
  'liu-biao':    { forceId: 'liu-biao', cityId: 'xiangyang' },
  'cai-mao':     { forceId: 'liu-biao', cityId: 'xiangyang' },
  'zhang-yun':   { forceId: 'liu-biao', cityId: 'xiangyang' },
  'kuai-liang':  { forceId: 'liu-biao', cityId: 'xiangyang' },
  'kuai-yue':    { forceId: 'liu-biao', cityId: 'xiangyang' },
  'wen-pin':     { forceId: 'liu-biao', cityId: 'jiangling' },
  'han-xuan':    { forceId: 'liu-biao', cityId: 'wuling' },
  'liu-du':      { forceId: 'liu-biao', cityId: 'lingling' },

  // Liu Zhang
  'liu-zhang':   { forceId: 'liu-zhang', cityId: 'chengdu' },
  'zhang-ren':   { forceId: 'liu-zhang', cityId: 'chengdu' },
  'yan-yan':     { forceId: 'liu-zhang', cityId: 'jiangzhou' },
  'meng-da':     { forceId: 'liu-zhang', cityId: 'yongan' },
  'wu-yi':       { forceId: 'liu-zhang', cityId: 'chengdu' },
  'fa-zheng':    { forceId: 'liu-zhang', cityId: 'chengdu' }, // serves Liu Zhang before defecting

  // Zhang Lu
  'zhang-lu':    { forceId: 'zhang-lu', cityId: 'hanzhong' },
  'yang-song':   { forceId: 'zhang-lu', cityId: 'hanzhong' },

  // Ma Teng
  'ma-teng':     { forceId: 'ma-teng', cityId: 'wuwei' },
  'ma-chao':     { forceId: 'ma-teng', cityId: 'wuwei' },
  'ma-dai':      { forceId: 'ma-teng', cityId: 'jincheng' },
  'han-sui':     { forceId: 'ma-teng', cityId: 'jincheng' },
  'wang-yi':     { forceId: 'ma-teng', cityId: 'wuwei' },

  // Shi Xie
  'shi-xie':     { forceId: 'shi-xie', cityId: 'jiaozhi' },
};

const DEAD_BY_208 = [
  'sun-jian',    // d. 191
  'sun-ce',      // d. 200
  'dong-zhuo',   // d. 192
  'lu-bu',       // d. 198
  'li-ru',       // d. 192
  'yuan-shao',   // d. 202
  'yuan-shu',    // d. 199
  'ji-ling',     // d. ~196
  'yan-liang',   // d. 200
  'wen-chou',    // d. 200
  'tian-feng',   // d. 200
  'yuan-tan',    // d. 205
  'yuan-shang',  // d. 207
  'yuan-xi',     // d. 207
  'gongsun-zan', // d. 199
  'gongsun-du',  // d. 204
  'kong-rong',   // d. 208 (executed by Cao Cao)
  'tao-qian',    // d. 194
  'liu-yan',     // d. 194
  'cao-bao',     // d. ~196
  'cao-ang',     // d. 197 (Wancheng)
  'cao-anmin',   // d. 197
  'dian-wei',    // d. 197
  'hua-xiong',   // d. 191
  'xu-rong',     // d. 192
  'niu-fu',      // d. 192
  'gao-shun',    // d. 198
  'cao-xing',    // d. 198
  'song-xian',   // d. 200
  'hou-cheng',   // d. 200
  'wang-yun',    // d. 192
  'chen-gong',   // d. 198
  'han-fu',      // d. 191
  'bo-cai',      // d. 184
  'zhang-mancheng', // d. 184
  'zhang-jiao',  // d. 184
  'zhang-bao-yt',// d. 184
  'zhang-liang-yt', // d. 184
  'yang-feng',   // d. 197
  'han-xian',    // d. 197
  'sun-xia',     // d. 184
  'liu-he',      // d. 195
  'bao-xin',     // d. 192
];

export const SCENARIO_208_CHIBI: Scenario = {
  id: 'scn-208-chibi',
  name: { en: 'Battle of Red Cliffs', zh: '赤壁之戰' },
  description:
    'Autumn 208 AD. Cao Cao has crushed every northern rival and now marches south with 800,000 men. ' +
    'Liu Biao is dead; his son Liu Cong surrendered Jing without a fight. Liu Bei has fled to Jiangxia ' +
    'with Zhuge Liang. Sun Quan must decide: surrender, or join Liu Bei at the Red Cliffs.',
  startDate: { year: 208, season: 'autumn' },
  cities: buildInitialCities(CITY_OWNERSHIP_208),
  forces: FORCES_208,
  officers: buildInitialOfficers(OFFICER_ASSIGNMENTS_208, DEAD_BY_208),
};

// ──────────────────────────────────────────────────────────────────────
// Scenario 5 — 234 Wuzhang Plains 五丈原 (Zhuge Liang's last campaign)
// Three Kingdoms era proper: Wei (Cao Rui), Shu Han (Liu Shan), Wu
// (Sun Quan). Zhuge Liang marches north for the final time; Sima Yi
// defends the Wei frontier.
// ──────────────────────────────────────────────────────────────────────

const FORCES_234: Force[] = [
  { id: 'cao',     name: { en: 'Wei',     zh: '魏'   }, rulerOfficerId: 'cao-rui',   capitalCityId: 'luoyang', color: '#3a7dd9', isPlayer: false },
  { id: 'liu-bei', name: { en: 'Shu Han', zh: '蜀漢' }, rulerOfficerId: 'liu-shan',  capitalCityId: 'chengdu', color: '#a85d8a', isPlayer: false },
  { id: 'sun',     name: { en: 'Wu',      zh: '吳'   }, rulerOfficerId: 'sun-quan',  capitalCityId: 'jianye',  color: '#2f8e6f', isPlayer: false },
];

const CITY_OWNERSHIP_234: Record<string, string> = {
  // Wei — most of the realm
  xuchang:   'cao',
  luoyang:   'cao',
  wancheng:  'cao',
  chenliu:   'cao',
  runan:     'cao',
  pingyuan:  'cao',
  ye:        'cao',
  bohai:     'cao',
  beihai:    'cao',
  beiping:   'cao',
  yanmen:    'cao',
  shangdang: 'cao',
  taiyuan:   'cao',
  pengcheng: 'cao',
  xiapi:     'cao',
  shouchun:  'cao',
  changan:   'cao',
  liaodong:  'cao',
  xinye:     'cao',
  guandu:    'cao',
  hulao:     'cao',
  tongguan:  'cao',
  linzi:     'cao',
  lujiang:   'cao',
  jincheng:  'cao',
  wuwei:     'cao',
  anding:    'cao',
  mei:       'cao',
  wudu:      'cao',
  // Shu Han — Yi province + Hanzhong
  chengdu:   'liu-bei',
  yongan:    'liu-bei',
  jiangzhou: 'liu-bei',
  hanzhong:  'liu-bei',
  // Wu — Jiangdong + Jing south
  jianye:    'sun',
  wu:        'sun',
  wuxi:      'sun',
  hefei:     'sun', // Wu held Hefei briefly — for game purposes
  yuzhang:   'sun',
  changsha:  'sun',
  jiangling: 'sun',
  jiangxia:  'sun',
  wuling:    'sun',
  lingling:  'sun',
  xiangyang: 'cao',
  // Far south Shi Xie's lands — neutral by 234 (Shi Xie d. 226)
  // jiaozhi, nanhai, hepu, guiyang stay neutral
};

const OFFICER_ASSIGNMENTS_234: Record<string, { forceId: string; cityId: string }> = {
  // ── Wei ──
  'cao-rui':     { forceId: 'cao', cityId: 'luoyang' },
  'sima-yi':     { forceId: 'cao', cityId: 'changan' }, // commanding the west
  'sima-shi':    { forceId: 'cao', cityId: 'luoyang' },
  'sima-zhao':   { forceId: 'cao', cityId: 'luoyang' },
  'cao-zhen':    { forceId: 'cao', cityId: 'luoyang' },
  'cao-xiu':     { forceId: 'cao', cityId: 'shouchun' },
  'cao-shuang':  { forceId: 'cao', cityId: 'luoyang' },
  'cao-yu':      { forceId: 'cao', cityId: 'xuchang' },
  'xiahou-shang':{ forceId: 'cao', cityId: 'xiangyang' },
  'xiahou-ba':   { forceId: 'cao', cityId: 'changan' },
  'xiahou-mao':  { forceId: 'cao', cityId: 'xuchang' },
  'xu-huang':    { forceId: 'cao', cityId: 'wancheng' },
  'zhang-liao':  { forceId: 'cao', cityId: 'shouchun' },
  'man-chong':   { forceId: 'cao', cityId: 'shouchun' },
  'hao-zhao':    { forceId: 'cao', cityId: 'tongguan' },
  'guo-huai':    { forceId: 'cao', cityId: 'changan' },
  'sun-li':      { forceId: 'cao', cityId: 'tongguan' },
  'wang-ling':   { forceId: 'cao', cityId: 'shouchun' },
  'guanqiu-jian':{ forceId: 'cao', cityId: 'liaodong' },
  'jia-kui':     { forceId: 'cao', cityId: 'xiangyang' },
  'tian-yu':     { forceId: 'cao', cityId: 'beiping' },
  'liu-ye':      { forceId: 'cao', cityId: 'luoyang' },
  'chen-qun':    { forceId: 'cao', cityId: 'luoyang' },
  'liu-fang':    { forceId: 'cao', cityId: 'luoyang' },
  'sun-zi':      { forceId: 'cao', cityId: 'luoyang' },
  'cai-wenji':   { forceId: 'cao', cityId: 'xuchang' },
  'chen-jiao':   { forceId: 'cao', cityId: 'xuchang' },
  'du-xi':       { forceId: 'cao', cityId: 'wancheng' },
  'zhao-yan':    { forceId: 'cao', cityId: 'xuchang' },
  'wang-su':     { forceId: 'cao', cityId: 'luoyang' },
  'hu-zhi':      { forceId: 'cao', cityId: 'pingyuan' },
  'cao-lin':     { forceId: 'cao', cityId: 'luoyang' },
  'yang-fu':     { forceId: 'cao', cityId: 'changan' },
  'wang-mai':    { forceId: 'cao', cityId: 'wuwei' },

  // ── Shu Han ──
  'liu-shan':    { forceId: 'liu-bei', cityId: 'chengdu' },
  'zhuge-liang': { forceId: 'liu-bei', cityId: 'hanzhong' }, // at the front
  'jiang-wei':   { forceId: 'liu-bei', cityId: 'hanzhong' },
  'wei-yan':     { forceId: 'liu-bei', cityId: 'hanzhong' },
  'wang-ping':   { forceId: 'liu-bei', cityId: 'hanzhong' },
  'ma-dai':      { forceId: 'liu-bei', cityId: 'hanzhong' },
  'liao-hua':    { forceId: 'liu-bei', cityId: 'yongan' },
  'zhang-yi':    { forceId: 'liu-bei', cityId: 'jiangzhou' },
  'ma-zhong':    { forceId: 'liu-bei', cityId: 'chengdu' },
  'guan-xing':   { forceId: 'liu-bei', cityId: 'chengdu' },
  'zhang-bao':   { forceId: 'liu-bei', cityId: 'chengdu' },
  'fei-yi':      { forceId: 'liu-bei', cityId: 'chengdu' },
  'jiang-wan':   { forceId: 'liu-bei', cityId: 'chengdu' },
  'dong-yun':    { forceId: 'liu-bei', cityId: 'chengdu' },
  'yang-yi':     { forceId: 'liu-bei', cityId: 'hanzhong' },
  'deng-zhi':    { forceId: 'liu-bei', cityId: 'chengdu' },
  'zhou-cang':   { forceId: 'liu-bei', cityId: 'yongan' },
  'liu-yong':    { forceId: 'liu-bei', cityId: 'chengdu' },
  'du-qiong':    { forceId: 'liu-bei', cityId: 'chengdu' },
  'qiao-zhou':   { forceId: 'liu-bei', cityId: 'chengdu' },
  'yang-hong':   { forceId: 'liu-bei', cityId: 'jiangzhou' },

  // ── Wu ──
  'sun-quan':    { forceId: 'sun', cityId: 'jianye' },
  'lu-xun':      { forceId: 'sun', cityId: 'jianye' },
  'lu-kang':     { forceId: 'sun', cityId: 'jiangling' },
  'zhuge-jin':   { forceId: 'sun', cityId: 'jianye' },
  'zhuge-ke':    { forceId: 'sun', cityId: 'jianye' },
  'ding-feng':   { forceId: 'sun', cityId: 'jianye' },
  'zhu-ran':     { forceId: 'sun', cityId: 'jiangxia' },
  'zhu-huan':    { forceId: 'sun', cityId: 'yuzhang' },
  'pan-zhang':   { forceId: 'sun', cityId: 'hefei' },
  'xu-sheng-wu':     { forceId: 'sun', cityId: 'wu' }, // Xu Sheng (legacy id)
  'gu-yong':     { forceId: 'sun', cityId: 'jianye' },
  'bu-zhi':      { forceId: 'sun', cityId: 'jianye' },
  'he-qi':       { forceId: 'sun', cityId: 'changsha' },
  'lu-dai':      { forceId: 'sun', cityId: 'jiaozhi' }, // pacifying the south
  'quan-cong':   { forceId: 'sun', cityId: 'jianye' },
  'pan-jun':     { forceId: 'sun', cityId: 'changsha' },
  'zhang-wen':   { forceId: 'sun', cityId: 'jianye' },
};

export const SCENARIO_234_WUZHANG: Scenario = {
  id: 'scn-234-wuzhang',
  name: { en: 'Wuzhang Plains', zh: '五丈原' },
  description:
    'Summer 234 AD. Zhuge Liang launches his fifth and final northern expedition, ' +
    'encamped on the Wuzhang Plains opposite Sima Yi. Cao Rui rules Wei from Luoyang; ' +
    'Liu Shan from Chengdu; Sun Quan from Jianye. The realm has settled into three kingdoms — ' +
    'but Zhuge Liang seeks one last chance to restore the Han.',
  startDate: { year: 234, season: 'summer' },
  cities: buildInitialCities(CITY_OWNERSHIP_234),
  forces: FORCES_234,
  // Auto-compute dead officers by year (anyone whose deathYear < 234).
  officers: buildInitialOfficers(OFFICER_ASSIGNMENTS_234, [], 234),
};

// ──────────────────────────────────────────────────────────────────────
// Scenario 6 — 220 AD Three Kingdoms Declaration 三國鼎立
// Cao Cao has just died; Cao Pi succeeds him and declares the Wei
// dynasty. Liu Bei holds Yi + Hanzhong. Sun Quan has just taken
// Jingzhou from Liu Bei (Guan Yu killed in 220).
// ──────────────────────────────────────────────────────────────────────

const FORCES_220: Force[] = [
  { id: 'cao',     name: { en: 'Wei',     zh: '魏'    }, rulerOfficerId: 'cao-pi',   capitalCityId: 'luoyang',  color: '#3a7dd9', isPlayer: false },
  { id: 'liu-bei', name: { en: 'Shu Han', zh: '蜀漢'  }, rulerOfficerId: 'liu-bei',  capitalCityId: 'chengdu',  color: '#a85d8a', isPlayer: false },
  { id: 'sun',     name: { en: 'Wu',      zh: '吳'    }, rulerOfficerId: 'sun-quan', capitalCityId: 'jianye',   color: '#2f8e6f', isPlayer: false },
  { id: 'shi-xie', name: { en: 'Shi Xie', zh: '士燮'  }, rulerOfficerId: 'shi-xie',  capitalCityId: 'jiaozhi',  color: '#5a8a3a', isPlayer: false },
  { id: 'xianbei', name: { en: 'Xianbei', zh: '鮮卑'  }, rulerOfficerId: 'kebi-neng',capitalCityId: 'wuhuan',   color: '#7a5a3a', isPlayer: false },
  { id: 'nanman',  name: { en: 'Nanman',  zh: '南蛮'  }, rulerOfficerId: 'meng-huo', capitalCityId: 'jianning', color: '#6e8a2a', isPlayer: false },
];

const CITY_OWNERSHIP_220: Record<string, string> = {
  // Wei — sprawling northern + central + Liang empire
  xuchang:   'cao',
  luoyang:   'cao',
  wancheng:  'cao',
  chenliu:   'cao',
  runan:     'cao',
  pingyuan:  'cao',
  ye:        'cao',
  bohai:     'cao',
  beihai:    'cao',
  beiping:   'cao',
  yanmen:    'cao',
  shangdang: 'cao',
  taiyuan:   'cao',
  pengcheng: 'cao',
  xiapi:     'cao',
  shouchun:  'cao',
  changan:   'cao',
  liaodong:  'cao',
  xinye:     'cao',
  guandu:    'cao',
  hulao:     'cao',
  tongguan:  'cao',
  linzi:     'cao',
  lujiang:   'cao',
  jincheng:  'cao',
  wuwei:     'cao',
  anding:    'cao',
  mei:       'cao',
  xiangyang: 'cao',
  hefei:     'cao',
  // Shu Han — Yi province + Hanzhong
  chengdu:   'liu-bei',
  yongan:    'liu-bei',
  jiangzhou: 'liu-bei',
  hanzhong:  'liu-bei',
  wudu:      'liu-bei',
  // Wu — Jiangdong + freshly taken Jingzhou
  jianye:    'sun',
  wu:        'sun',
  wuxi:      'sun',
  yuzhang:   'sun',
  changsha:  'sun',
  jiangling: 'sun', // taken from Liu Bei by Lu Meng 219
  jiangxia:  'sun',
  wuling:    'sun',
  lingling:  'sun',
  // Shi Xie — Jiao
  jiaozhi:   'shi-xie',
  nanhai:    'shi-xie',
  hepu:      'shi-xie',
  // Xianbei — Kebi Neng's confederacy
  wuhuan:    'xianbei',
  // Nanman — Meng Huo's tribes
  jianning:  'nanman',
  yunnan:    'nanman',
  yongchang: 'nanman',
  yuexi:     'nanman',
  // Neutral: guiyang
};

const OFFICER_ASSIGNMENTS_220: Record<string, { forceId: string; cityId: string }> = {
  // ── Wei (Cao Pi succeeds Cao Cao) ──
  'cao-pi':      { forceId: 'cao', cityId: 'luoyang' },
  'cao-zhi':     { forceId: 'cao', cityId: 'xuchang' },
  'cao-zhang':   { forceId: 'cao', cityId: 'ye' },
  'cao-ren':     { forceId: 'cao', cityId: 'wancheng' }, // alive until 223
  'cao-xiu':     { forceId: 'cao', cityId: 'shouchun' },
  'cao-zhen':    { forceId: 'cao', cityId: 'changan' },
  'cao-chun':    { forceId: 'cao', cityId: 'chenliu' }, // d. 210 actually, but kept
  'xiahou-dun':  { forceId: 'cao', cityId: 'luoyang' }, // d. 220 — included
  'xiahou-shang':{ forceId: 'cao', cityId: 'xiangyang' },
  'xiahou-ba':   { forceId: 'cao', cityId: 'changan' },
  'xiahou-mao':  { forceId: 'cao', cityId: 'mei' },
  'xu-huang':    { forceId: 'cao', cityId: 'wancheng' },
  'zhang-liao':  { forceId: 'cao', cityId: 'hefei' },
  'zhang-he':    { forceId: 'cao', cityId: 'ye' },
  'yu-jin':      { forceId: 'cao', cityId: 'wancheng' }, // captured & shamed but alive
  'le-jin':      { forceId: 'cao', cityId: 'shouchun' },
  'li-dian':     { forceId: 'cao', cityId: 'shouchun' },
  'man-chong':   { forceId: 'cao', cityId: 'shouchun' },
  'hao-zhao':    { forceId: 'cao', cityId: 'tongguan' },
  'zang-ba':     { forceId: 'cao', cityId: 'pengcheng' },
  'wen-pin':     { forceId: 'cao', cityId: 'wancheng' },
  'guo-huai':    { forceId: 'cao', cityId: 'changan' },
  'sun-li':      { forceId: 'cao', cityId: 'tongguan' },
  'tian-yu':     { forceId: 'cao', cityId: 'beiping' },
  'sima-yi':     { forceId: 'cao', cityId: 'luoyang' },
  'sima-shi':    { forceId: 'cao', cityId: 'luoyang' },
  'sima-zhao':   { forceId: 'cao', cityId: 'luoyang' },
  'jia-xu':      { forceId: 'cao', cityId: 'luoyang' }, // d. 223
  'liu-ye':      { forceId: 'cao', cityId: 'luoyang' },
  'chen-qun':    { forceId: 'cao', cityId: 'xuchang' },
  'liu-fang':    { forceId: 'cao', cityId: 'luoyang' },
  'sun-zi':      { forceId: 'cao', cityId: 'luoyang' },
  'jia-kui':     { forceId: 'cao', cityId: 'xiangyang' },
  'yang-fu':     { forceId: 'cao', cityId: 'changan' },
  'wang-su':     { forceId: 'cao', cityId: 'luoyang' },
  'hu-zhi':      { forceId: 'cao', cityId: 'pingyuan' },
  'cai-wenji':   { forceId: 'cao', cityId: 'xuchang' },
  'wang-ling':   { forceId: 'cao', cityId: 'shouchun' },

  // ── Shu Han ──
  'liu-bei':     { forceId: 'liu-bei', cityId: 'chengdu' },
  'liu-shan':    { forceId: 'liu-bei', cityId: 'chengdu' },
  'liu-feng':    { forceId: 'liu-bei', cityId: 'yongan' }, // d. 220 — included
  'liu-yong':    { forceId: 'liu-bei', cityId: 'chengdu' },
  'zhang-fei':   { forceId: 'liu-bei', cityId: 'yongan' }, // d. 221
  'zhao-yun':    { forceId: 'liu-bei', cityId: 'chengdu' },
  'ma-chao':     { forceId: 'liu-bei', cityId: 'jiangzhou' }, // d. 222 — included
  'ma-dai':      { forceId: 'liu-bei', cityId: 'hanzhong' },
  'wei-yan':     { forceId: 'liu-bei', cityId: 'hanzhong' },
  'wang-ping':   { forceId: 'liu-bei', cityId: 'hanzhong' },
  'liao-hua':    { forceId: 'liu-bei', cityId: 'yongan' },
  'guan-xing':   { forceId: 'liu-bei', cityId: 'chengdu' },
  'zhang-bao':   { forceId: 'liu-bei', cityId: 'chengdu' },
  'zhou-cang':   { forceId: 'liu-bei', cityId: 'yongan' }, // d. 219 — but in 220 included as recent
  'zhuge-liang': { forceId: 'liu-bei', cityId: 'chengdu' },
  'fa-zheng':    { forceId: 'liu-bei', cityId: 'chengdu' }, // d. 220 — included
  'ma-liang':    { forceId: 'liu-bei', cityId: 'chengdu' }, // d. 222
  'ma-su':       { forceId: 'liu-bei', cityId: 'hanzhong' },
  'jiang-wan':   { forceId: 'liu-bei', cityId: 'chengdu' },
  'fei-yi':      { forceId: 'liu-bei', cityId: 'chengdu' },
  'dong-yun':    { forceId: 'liu-bei', cityId: 'chengdu' },
  'jian-yong':   { forceId: 'liu-bei', cityId: 'chengdu' }, // d. 222
  'sun-qian':    { forceId: 'liu-bei', cityId: 'chengdu' },
  'mi-zhu':      { forceId: 'liu-bei', cityId: 'chengdu' }, // d. 220 (mi-fang's defection)
  'liu-ba':      { forceId: 'liu-bei', cityId: 'chengdu' }, // d. 222
  'li-yan':      { forceId: 'liu-bei', cityId: 'yongan' },
  'yang-yi':     { forceId: 'liu-bei', cityId: 'hanzhong' },
  'deng-zhi':    { forceId: 'liu-bei', cityId: 'chengdu' },
  'huo-yi':      { forceId: 'liu-bei', cityId: 'yongan' },
  'yan-yan':     { forceId: 'liu-bei', cityId: 'jiangzhou' },
  'wu-yi':       { forceId: 'liu-bei', cityId: 'chengdu' },
  'wu-ban':      { forceId: 'liu-bei', cityId: 'hanzhong' },
  'yang-hong':   { forceId: 'liu-bei', cityId: 'jiangzhou' },
  'lady-sun':    { forceId: 'liu-bei', cityId: 'chengdu' }, // hmm she went back to Wu actually
  // Liu Bei's wives are dead, lady-mi died 208 already

  // ── Wu (Sun Quan just took Jingzhou) ──
  'sun-quan':    { forceId: 'sun', cityId: 'jianye' },
  'lu-xun':      { forceId: 'sun', cityId: 'jiangling' },
  'lu-meng':     { forceId: 'sun', cityId: 'jiangling' }, // d. 220 — included as just-captured-Jingzhou
  'lu-su':       { forceId: 'sun', cityId: 'jianye' }, // d. 217 — will be marked dead
  'zhou-tai':    { forceId: 'sun', cityId: 'jianye' },
  'cheng-pu':    { forceId: 'sun', cityId: 'jianye' }, // d. 215 — will be dead
  'huang-gai':   { forceId: 'sun', cityId: 'changsha' }, // d. 215
  'han-dang':    { forceId: 'sun', cityId: 'wu' },
  'gan-ning':    { forceId: 'sun', cityId: 'jiangxia' }, // d. 220 — included
  'taishi-ci':   { forceId: 'sun', cityId: 'jianye' }, // d. 206 — will be dead
  'ling-tong'   : { forceId: 'sun', cityId: 'wu' }, // Ling Tong d. 217
  'jiang-qin':   { forceId: 'sun', cityId: 'wu' }, // d. 219
  'pan-zhang':   { forceId: 'sun', cityId: 'wuling' },
  'zhu-ran':     { forceId: 'sun', cityId: 'jianye' },
  'zhu-huan':    { forceId: 'sun', cityId: 'yuzhang' },
  'ding-feng':   { forceId: 'sun', cityId: 'jianye' },
  'xu-sheng-wu':     { forceId: 'sun', cityId: 'jianye' }, // Xu Sheng
  'zhuge-jin':   { forceId: 'sun', cityId: 'jianye' },
  'zhang-zhao':  { forceId: 'sun', cityId: 'jianye' },
  'gu-yong':     { forceId: 'sun', cityId: 'jianye' },
  'bu-zhi':      { forceId: 'sun', cityId: 'wuxi' },
  'he-qi':       { forceId: 'sun', cityId: 'changsha' },
  'lu-dai':      { forceId: 'sun', cityId: 'yuzhang' },
  'quan-cong':   { forceId: 'sun', cityId: 'jianye' },
  'pan-jun':     { forceId: 'sun', cityId: 'changsha' },
  'yu-fan':      { forceId: 'sun', cityId: 'jianye' },

  // ── Shi Xie ──
  'shi-xie':     { forceId: 'shi-xie', cityId: 'jiaozhi' },

  // ── Xianbei (Kebi Neng's confederacy) ──
  'kebi-neng':   { forceId: 'xianbei', cityId: 'wuhuan' },
  'budugen':     { forceId: 'xianbei', cityId: 'wuhuan' },

  // ── Nanman (Meng Huo's host) ──
  'meng-huo':    { forceId: 'nanman', cityId: 'jianning' },
  'meng-you':    { forceId: 'nanman', cityId: 'yongchang' },
  'mangya-chang':{ forceId: 'nanman', cityId: 'jianning' },
  'jinhuan-sanjie':{forceId:'nanman', cityId: 'yongchang' },
  'dongtu-na':   { forceId: 'nanman', cityId: 'yunnan' },
  'ahui-nan':    { forceId: 'nanman', cityId: 'yunnan' },
  'wutugu':      { forceId: 'nanman', cityId: 'yuexi' },
  'zhu-rong':    { forceId: 'nanman', cityId: 'jianning' },
};

export const SCENARIO_220_DECLARATION: Scenario = {
  id: 'scn-220-declaration',
  name: { en: 'Three Kingdoms Declared', zh: '三國鼎立' },
  description:
    'Spring 220 AD. Cao Cao has died; his son Cao Pi prepares to receive the abdication from ' +
    "Emperor Xian and declare the Wei dynasty. Liu Bei holds Yi and Hanzhong but Jingzhou is lost — " +
    'Guan Yu fell, and Lu Meng captured the south for Sun Quan. The realm is split between three rivals.',
  startDate: { year: 220, season: 'spring' },
  cities: buildInitialCities(CITY_OWNERSHIP_220),
  forces: FORCES_220,
  // Auto-compute dead officers by year — anything dying before 220 gets marked dead.
  officers: buildInitialOfficers(OFFICER_ASSIGNMENTS_220, [], 220),
};

// ──────────────────────────────────────────────────────────────────────
// Scenario 7 — 215 AD Battle of Hefei 合肥之戰
// Liu Bei has taken Yi province from Liu Zhang. Sun Quan attacks Hefei
// with 100,000 men against Zhang Liao's 7,000. Cao Cao is at Hanzhong
// dealing with Zhang Lu.
// ──────────────────────────────────────────────────────────────────────

const FORCES_215: Force[] = [
  { id: 'cao',       name: { en: 'Cao Cao',    zh: '曹操軍' }, rulerOfficerId: 'cao-cao',   capitalCityId: 'xuchang',  color: '#3a7dd9', isPlayer: false },
  { id: 'liu-bei',   name: { en: 'Liu Bei',    zh: '劉備軍' }, rulerOfficerId: 'liu-bei',   capitalCityId: 'chengdu',  color: '#a85d8a', isPlayer: false },
  { id: 'sun',       name: { en: 'Sun Quan',   zh: '孫權軍' }, rulerOfficerId: 'sun-quan',  capitalCityId: 'jianye',   color: '#2f8e6f', isPlayer: false },
  { id: 'zhang-lu',  name: { en: 'Zhang Lu',   zh: '張魯軍' }, rulerOfficerId: 'zhang-lu',  capitalCityId: 'hanzhong', color: '#6b8a6b', isPlayer: false },
  { id: 'shi-xie',   name: { en: 'Shi Xie',    zh: '士燮軍' }, rulerOfficerId: 'shi-xie',   capitalCityId: 'jiaozhi',  color: '#5a8a3a', isPlayer: false },
  { id: 'xianbei',   name: { en: 'Xianbei',    zh: '鮮卑'   }, rulerOfficerId: 'kebi-neng', capitalCityId: 'wuhuan',   color: '#7a5a3a', isPlayer: false },
  { id: 'nanman',    name: { en: 'Nanman',     zh: '南蛮'   }, rulerOfficerId: 'meng-huo',  capitalCityId: 'jianning', color: '#6e8a2a', isPlayer: false },
];

const CITY_OWNERSHIP_215: Record<string, string> = {
  // Cao Cao — northern empire
  xuchang:   'cao',
  luoyang:   'cao',
  wancheng:  'cao',
  chenliu:   'cao',
  runan:     'cao',
  pingyuan:  'cao',
  ye:        'cao',
  bohai:     'cao',
  beihai:    'cao',
  beiping:   'cao',
  yanmen:    'cao',
  shangdang: 'cao',
  taiyuan:   'cao',
  pengcheng: 'cao',
  xiapi:     'cao',
  changan:   'cao',
  liaodong:  'cao',
  xinye:     'cao',
  guandu:    'cao',
  hulao:     'cao',
  tongguan:  'cao',
  linzi:     'cao',
  hefei:     'cao',          // Defended by Zhang Liao!
  shouchun:  'cao',
  lujiang:   'cao',
  xiangyang: 'cao',          // From Liu Cong's 208 surrender
  jincheng:  'cao',
  wuwei:     'cao',
  anding:    'cao',
  mei:       'cao',
  // Liu Bei — Yi + Hanzhong's western part
  chengdu:   'liu-bei',
  yongan:    'liu-bei',
  jiangzhou: 'liu-bei',
  yangping:  'liu-bei',
  jiangling: 'liu-bei',      // Borrowed Jingzhou
  changsha:  'liu-bei',
  lingling:  'liu-bei',
  wuling:    'liu-bei',
  // Sun Quan — Jiangdong
  jianye:    'sun',
  wu:        'sun',
  wuxi:      'sun',
  yuzhang:   'sun',
  jiangxia:  'sun',
  // Zhang Lu — Hanzhong (about to fall to Cao Cao late 215)
  hanzhong:  'zhang-lu',
  wudu:      'zhang-lu',
  // Shi Xie — Jiao
  jiaozhi:   'shi-xie',
  nanhai:    'shi-xie',
  hepu:      'shi-xie',
  // Xianbei — Kebi Neng's confederacy on the northern frontier
  wuhuan:    'xianbei',
  // Nanman — Meng Huo's tribes on the southern frontier
  jianning:  'nanman',
  yunnan:    'nanman',
  yongchang: 'nanman',
  yuexi:     'nanman',
};

const OFFICER_ASSIGNMENTS_215: Record<string, { forceId: string; cityId: string }> = {
  // Cao Cao
  'cao-cao':     { forceId: 'cao', cityId: 'xuchang' },
  'cao-pi':      { forceId: 'cao', cityId: 'xuchang' },
  'cao-ren':     { forceId: 'cao', cityId: 'wancheng' },
  'cao-zhang':   { forceId: 'cao', cityId: 'ye' },
  'cao-xiu':     { forceId: 'cao', cityId: 'shouchun' },
  'cao-zhen':    { forceId: 'cao', cityId: 'changan' },
  'cao-hong':    { forceId: 'cao', cityId: 'luoyang' },
  'xiahou-dun':  { forceId: 'cao', cityId: 'xuchang' },
  'xiahou-yuan': { forceId: 'cao', cityId: 'changan' },
  'xiahou-shang':{ forceId: 'cao', cityId: 'xiangyang' },
  'xun-yu':      { forceId: 'cao', cityId: 'xuchang' }, // d. 212 actually; this scenario keeps him alive
  'xun-you':     { forceId: 'cao', cityId: 'xuchang' },
  'guo-jia':     { forceId: 'cao', cityId: 'luoyang' }, // d. 207 actually
  'cheng-yu':    { forceId: 'cao', cityId: 'xuchang' },
  'jia-xu':      { forceId: 'cao', cityId: 'wancheng' },
  'sima-yi':     { forceId: 'cao', cityId: 'luoyang' },
  'liu-ye':      { forceId: 'cao', cityId: 'luoyang' },
  'zhang-liao':  { forceId: 'cao', cityId: 'hefei' }, // The hero of this scenario
  'le-jin':      { forceId: 'cao', cityId: 'hefei' },
  'li-dian':     { forceId: 'cao', cityId: 'hefei' },
  'xu-huang':    { forceId: 'cao', cityId: 'wancheng' },
  'yu-jin':      { forceId: 'cao', cityId: 'wancheng' },
  'xu-chu':      { forceId: 'cao', cityId: 'xuchang' },
  'pang-de':     { forceId: 'cao', cityId: 'changan' },
  'zhang-he':    { forceId: 'cao', cityId: 'ye' },
  'hao-zhao':    { forceId: 'cao', cityId: 'tongguan' },
  'man-chong':   { forceId: 'cao', cityId: 'shouchun' },
  'wen-pin':     { forceId: 'cao', cityId: 'xiangyang' },
  'zang-ba':     { forceId: 'cao', cityId: 'pengcheng' },

  // Liu Bei
  'liu-bei':     { forceId: 'liu-bei', cityId: 'chengdu' },
  'liu-shan':    { forceId: 'liu-bei', cityId: 'chengdu' },
  'guan-yu':     { forceId: 'liu-bei', cityId: 'jiangling' }, // Guarding Jingzhou
  'zhang-fei':   { forceId: 'liu-bei', cityId: 'chengdu' },
  'zhao-yun':    { forceId: 'liu-bei', cityId: 'chengdu' },
  'ma-chao':     { forceId: 'liu-bei', cityId: 'yangping' },
  'huang-zhong': { forceId: 'liu-bei', cityId: 'jiangzhou' },
  'wei-yan':     { forceId: 'liu-bei', cityId: 'yangping' },
  'liao-hua':    { forceId: 'liu-bei', cityId: 'jiangling' },
  'guan-ping':   { forceId: 'liu-bei', cityId: 'jiangling' },
  'zhou-cang':   { forceId: 'liu-bei', cityId: 'jiangling' },
  'zhuge-liang': { forceId: 'liu-bei', cityId: 'chengdu' },
  'pang-tong':   { forceId: 'liu-bei', cityId: 'yangping' }, // d. 214 actually
  'fa-zheng':    { forceId: 'liu-bei', cityId: 'chengdu' },
  'ma-liang':    { forceId: 'liu-bei', cityId: 'jiangling' },
  'jian-yong':   { forceId: 'liu-bei', cityId: 'chengdu' },
  'sun-qian':    { forceId: 'liu-bei', cityId: 'chengdu' },
  'mi-zhu':      { forceId: 'liu-bei', cityId: 'chengdu' },
  'liu-feng':    { forceId: 'liu-bei', cityId: 'yongan' },

  // Sun Quan
  'sun-quan':    { forceId: 'sun', cityId: 'jianye' },
  'lu-meng':     { forceId: 'sun', cityId: 'jianye' },
  'lu-su':       { forceId: 'sun', cityId: 'jianye' },
  'zhou-tai':    { forceId: 'sun', cityId: 'jianye' },
  'huang-gai':   { forceId: 'sun', cityId: 'jiangxia' },
  'cheng-pu':    { forceId: 'sun', cityId: 'jianye' }, // d. 215 — borderline
  'han-dang':    { forceId: 'sun', cityId: 'wu' },
  'gan-ning':    { forceId: 'sun', cityId: 'jiangxia' },
  'taishi-ci':   { forceId: 'sun', cityId: 'jianye' }, // d. 206 — would be marked dead
  'jiang-qin':   { forceId: 'sun', cityId: 'wu' },
  'pan-zhang':   { forceId: 'sun', cityId: 'yuzhang' },
  'lu-xun':      { forceId: 'sun', cityId: 'jianye' },
  'zhuge-jin':   { forceId: 'sun', cityId: 'jianye' },
  'zhang-zhao':  { forceId: 'sun', cityId: 'jianye' },
  'ling-tong'   : { forceId: 'sun', cityId: 'wu' }, // Ling Tong
  'xu-sheng-wu':     { forceId: 'sun', cityId: 'jianye' }, // Xu Sheng
  'zhu-ran':     { forceId: 'sun', cityId: 'jianye' },

  // Zhang Lu
  'zhang-lu':    { forceId: 'zhang-lu', cityId: 'hanzhong' },
  'yang-song':   { forceId: 'zhang-lu', cityId: 'hanzhong' },
  'zhang-wei':   { forceId: 'zhang-lu', cityId: 'hanzhong' },

  // Shi Xie
  'shi-xie':     { forceId: 'shi-xie', cityId: 'jiaozhi' },

  // Xianbei — northern frontier confederacy
  'kebi-neng':   { forceId: 'xianbei', cityId: 'wuhuan' },
  'budugen':     { forceId: 'xianbei', cityId: 'wuhuan' },

  // Nanman — Meng Huo's host (early form)
  'meng-huo':    { forceId: 'nanman', cityId: 'jianning' },
  'meng-you':    { forceId: 'nanman', cityId: 'yongchang' },
  'mangya-chang':{ forceId: 'nanman', cityId: 'jianning' },
  'jinhuan-sanjie':{forceId:'nanman', cityId: 'yongchang' },
  'dongtu-na':   { forceId: 'nanman', cityId: 'yunnan' },
  'ahui-nan':    { forceId: 'nanman', cityId: 'yunnan' },
  'wutugu':      { forceId: 'nanman', cityId: 'yuexi' },
  'zhu-rong':    { forceId: 'nanman', cityId: 'jianning' },
};

export const SCENARIO_215_HEFEI: Scenario = {
  id: 'scn-215-hefei',
  name: { en: 'Battle of Hefei', zh: '合肥之戰' },
  description:
    'Summer 215 AD. Liu Bei has just taken Yi province from Liu Zhang. Cao Cao marches on Zhang Lu at Hanzhong. ' +
    'Sun Quan seizes the moment to attack Hefei with 100,000 men — defended by Zhang Liao\'s 7,000 ' +
    'in the most legendary defensive stand of the era.',
  startDate: { year: 215, season: 'summer' },
  cities: buildInitialCities(CITY_OWNERSHIP_215),
  forces: FORCES_215,
  officers: buildInitialOfficers(OFFICER_ASSIGNMENTS_215, [], 215),
};

// ──────────────────────────────────────────────────────────────────────
// Scenario — 197 AD Bohai Front (Cao vs Yuan early friction)
// ──────────────────────────────────────────────────────────────────────

const FORCES_197: Force[] = [
  { id: 'cao',       name: { en: 'Cao Cao',     zh: '曹操軍'   }, rulerOfficerId: 'cao-cao',     capitalCityId: 'xuchang',  color: '#3a7dd9', isPlayer: false },
  { id: 'yuan-shao', name: { en: 'Yuan Shao',   zh: '袁紹軍'   }, rulerOfficerId: 'yuan-shao',   capitalCityId: 'ye',       color: '#b8442e', isPlayer: false },
  { id: 'yuan-shu',  name: { en: 'Yuan Shu',    zh: '袁術軍'   }, rulerOfficerId: 'yuan-shu',    capitalCityId: 'shouchun', color: '#a85d8a', isPlayer: false },
  { id: 'lu-bu',     name: { en: 'Lü Bu',       zh: '呂布軍'   }, rulerOfficerId: 'lu-bu',       capitalCityId: 'xiapi',    color: '#c19a3b', isPlayer: false },
  { id: 'sun',       name: { en: 'Sun Ce',      zh: '孫策軍'   }, rulerOfficerId: 'sun-ce',      capitalCityId: 'jianye',   color: '#2f8e6f', isPlayer: false },
  { id: 'liu-biao',  name: { en: 'Liu Biao',    zh: '劉表軍'   }, rulerOfficerId: 'liu-biao',    capitalCityId: 'xiangyang',color: '#d9803a', isPlayer: false },
  { id: 'liu-yan',   name: { en: 'Liu Yan',     zh: '劉焉軍'   }, rulerOfficerId: 'liu-yan',     capitalCityId: 'chengdu',  color: '#a8703a', isPlayer: false },
  { id: 'gongsun',   name: { en: 'Gongsun Zan', zh: '公孫瓚軍' }, rulerOfficerId: 'gongsun-zan', capitalCityId: 'beiping',  color: '#5a9bb8', isPlayer: false },
  { id: 'ma-teng',   name: { en: 'Ma Teng',     zh: '馬騰軍'   }, rulerOfficerId: 'ma-teng',     capitalCityId: 'wuwei',    color: '#8a5d3a', isPlayer: false },
];

const CITY_OWNERSHIP_197: Record<string, string> = {
  // Cao's central plain
  xuchang:   'cao',
  luoyang:   'cao',
  chenliu:   'cao',
  runan:     'cao',
  pengcheng: 'cao',
  // Yuan Shao's north
  ye:        'yuan-shao',
  bohai:     'yuan-shao',
  pingyuan:  'yuan-shao',
  beihai:    'yuan-shao',
  // Yuan Shu's south-east
  shouchun:  'yuan-shu',
  hefei:     'yuan-shu',
  wancheng:  'yuan-shu',
  // Lü Bu — wedged in Xuzhou
  xiapi:     'lu-bu',
  // Sun Ce — Jiangdong base
  jianye:    'sun',
  wu:        'sun',
  yuzhang:   'sun',
  changsha:  'sun',
  // Liu Biao
  xiangyang: 'liu-biao',
  jiangxia:  'liu-biao',
  wuling:    'liu-biao',
  lingling:  'liu-biao',
  // Liu Yan — Yi province
  chengdu:   'liu-yan',
  yongan:    'liu-yan',
  jiangzhou: 'liu-yan',
  // Gongsun Zan — northeast
  beiping:   'gongsun',
  yuyang:    'gongsun',
  // Ma Teng — northwest
  wuwei:     'ma-teng',
  jincheng:  'ma-teng',
  anding:    'ma-teng',
  // Han imperial city
  changan:   'cao',
  taiyuan:   'yuan-shao',
  yanmen:    'yuan-shao',
  shangdang: 'yuan-shao',
};

const OFFICER_ASSIGNMENTS_197: Record<string, { forceId: string; cityId: string }> = {
  // Cao force
  'cao-cao':     { forceId: 'cao',       cityId: 'xuchang' },
  'xiahou-dun':  { forceId: 'cao',       cityId: 'xuchang' },
  'xiahou-yuan': { forceId: 'cao',       cityId: 'luoyang' },
  'cao-ren':     { forceId: 'cao',       cityId: 'chenliu' },
  'cao-hong':    { forceId: 'cao',       cityId: 'xuchang' },
  'cao-pi':      { forceId: 'cao',       cityId: 'xuchang' },
  'yu-jin':      { forceId: 'cao',       cityId: 'runan' },
  'le-jin':      { forceId: 'cao',       cityId: 'xuchang' },
  'dian-wei':    { forceId: 'cao',       cityId: 'wancheng' }, // Dies at Wancheng 197 — historical
  'xun-yu':      { forceId: 'cao',       cityId: 'xuchang' },
  'guo-jia':     { forceId: 'cao',       cityId: 'xuchang' },
  'jia-xu':      { forceId: 'cao',       cityId: 'wancheng' },
  // Yuan Shao
  'yuan-shao':   { forceId: 'yuan-shao', cityId: 'ye' },
  'yan-liang':   { forceId: 'yuan-shao', cityId: 'ye' },
  'wen-chou':    { forceId: 'yuan-shao', cityId: 'ye' },
  'zhang-he':    { forceId: 'yuan-shao', cityId: 'bohai' },
  'tian-feng':   { forceId: 'yuan-shao', cityId: 'ye' },
  // Yuan Shu
  'yuan-shu':    { forceId: 'yuan-shu',  cityId: 'shouchun' },
  'ji-ling':     { forceId: 'yuan-shu',  cityId: 'shouchun' },
  // Lü Bu
  'lu-bu':       { forceId: 'lu-bu',     cityId: 'xiapi' },
  'diaochan':    { forceId: 'lu-bu',     cityId: 'xiapi' },
  // Sun
  'sun-ce':      { forceId: 'sun',       cityId: 'jianye' },
  'sun-quan':    { forceId: 'sun',       cityId: 'jianye' },
  'zhou-yu':     { forceId: 'sun',       cityId: 'jianye' },
  'cheng-pu':    { forceId: 'sun',       cityId: 'wu' },
  'huang-gai':   { forceId: 'sun',       cityId: 'changsha' },
  // Liu Biao
  'liu-biao':    { forceId: 'liu-biao',  cityId: 'xiangyang' },
  // Liu Yan
  'liu-yan':     { forceId: 'liu-yan',   cityId: 'chengdu' },
  // Gongsun
  'gongsun-zan': { forceId: 'gongsun',   cityId: 'beiping' },
  // Ma Teng
  'ma-teng':     { forceId: 'ma-teng',   cityId: 'wuwei' },
  'ma-chao':     { forceId: 'ma-teng',   cityId: 'jincheng' },
};

const DEAD_BY_197 = ['sun-jian', 'dong-zhuo', 'li-ru', 'tao-qian', 'kong-rong'];

export const SCENARIO_197_BOHAI: Scenario = {
  id: 'scn-197-bohai',
  name: { en: 'Cao vs Yuan — The Northern Front', zh: '渤海戰線' },
  description:
    'Spring 197 AD. Cao Cao has just escorted Emperor Xian to Xuchang; ' +
    'Yuan Shao broods to the north with twice his strength. ' +
    'Lü Bu holds Xiapi after fleeing Chang\'an; Sun Ce rises in the south. ' +
    'The chessboard is set for the next decade.',
  startDate: { year: 197, season: 'spring' },
  cities: buildInitialCities(CITY_OWNERSHIP_197),
  forces: FORCES_197,
  officers: buildInitialOfficers(OFFICER_ASSIGNMENTS_197, DEAD_BY_197, 197),
};

// ──────────────────────────────────────────────────────────────────────
// Scenario — 219 AD The Hanzhong Campaign
// ──────────────────────────────────────────────────────────────────────

const FORCES_219: Force[] = [
  { id: 'cao',     name: { en: 'Cao Cao',  zh: '曹操軍' }, rulerOfficerId: 'cao-cao', capitalCityId: 'xuchang',  color: '#3a7dd9', isPlayer: false },
  { id: 'liu-bei', name: { en: 'Liu Bei',  zh: '劉備軍' }, rulerOfficerId: 'liu-bei', capitalCityId: 'chengdu',  color: '#a85d8a', isPlayer: false },
  { id: 'sun',     name: { en: 'Sun Quan', zh: '孫權軍' }, rulerOfficerId: 'sun-quan', capitalCityId: 'jianye',  color: '#2f8e6f', isPlayer: false },
  { id: 'xianbei', name: { en: 'Xianbei',  zh: '鮮卑'   }, rulerOfficerId: 'kebi-neng', capitalCityId: 'wuhuan', color: '#7a5a3a', isPlayer: false },
  { id: 'nanman',  name: { en: 'Nanman',   zh: '南蛮'   }, rulerOfficerId: 'meng-huo', capitalCityId: 'jianning', color: '#6e8a2a', isPlayer: false },
];

const CITY_OWNERSHIP_219: Record<string, string> = {
  // Cao Cao consolidated the north
  xuchang: 'cao', luoyang: 'cao', changan: 'cao', ye: 'cao',
  chenliu: 'cao', wancheng: 'cao', runan: 'cao', xinye: 'cao',
  pengcheng: 'cao', xiapi: 'cao', shouchun: 'cao', hefei: 'cao',
  pingyuan: 'cao', taiyuan: 'cao', yanmen: 'cao', shangdang: 'cao',
  beiping: 'cao', yuyang: 'cao', bohai: 'cao', beihai: 'cao',
  wuwei: 'cao', jincheng: 'cao', anding: 'cao',
  // Liu Bei — Shu + Jingzhou portion
  chengdu: 'liu-bei', yongan: 'liu-bei', jiangzhou: 'liu-bei',
  hanzhong: 'liu-bei',         // The 219 campaign just resolved in Liu's favor
  // Jingzhou — Guan Yu still in Jiangling; Cao holds Xiangyang/Fan
  xiangyang: 'cao',
  jiangling: 'liu-bei',
  changsha: 'sun', wuling: 'liu-bei',
  lingling: 'liu-bei',
  // Sun Quan — Jiangdong + recent gains
  jianye: 'sun', wu: 'sun', yuzhang: 'sun', kuaiji: 'sun',
  jiangxia: 'sun',
  // Xianbei — Kebi Neng's confederacy
  wuhuan: 'xianbei',
  // Nanman — Meng Huo's tribes
  jianning: 'nanman', yunnan: 'nanman', yongchang: 'nanman', yuexi: 'nanman',
};

const OFFICER_ASSIGNMENTS_219: Record<string, { forceId: string; cityId: string }> = {
  // Cao
  'cao-cao':     { forceId: 'cao',     cityId: 'xuchang' },
  'cao-pi':      { forceId: 'cao',     cityId: 'xuchang' },
  'cao-ren':     { forceId: 'cao',     cityId: 'xiangyang' },
  'cao-hong':    { forceId: 'cao',     cityId: 'changan' },
  'xiahou-dun':  { forceId: 'cao',     cityId: 'shouchun' },
  'zhang-liao':  { forceId: 'cao',     cityId: 'hefei' },
  'xu-chu':      { forceId: 'cao',     cityId: 'xuchang' },
  'zhang-he':    { forceId: 'cao',     cityId: 'changan' },
  'xu-huang':    { forceId: 'cao',     cityId: 'xiangyang' },
  'yu-jin':      { forceId: 'cao',     cityId: 'xiangyang' },
  'pang-de':     { forceId: 'cao',     cityId: 'xiangyang' },
  'sima-yi':     { forceId: 'cao',     cityId: 'xuchang' },
  'jia-xu':      { forceId: 'cao',     cityId: 'xuchang' },
  // Liu Bei
  'liu-bei':     { forceId: 'liu-bei', cityId: 'chengdu' },
  'zhuge-liang': { forceId: 'liu-bei', cityId: 'chengdu' },
  'guan-yu':     { forceId: 'liu-bei', cityId: 'jiangling' },
  'zhang-fei':   { forceId: 'liu-bei', cityId: 'hanzhong' },
  'zhao-yun':    { forceId: 'liu-bei', cityId: 'chengdu' },
  'ma-chao':     { forceId: 'liu-bei', cityId: 'hanzhong' },
  'huang-zhong': { forceId: 'liu-bei', cityId: 'hanzhong' },
  'wei-yan':     { forceId: 'liu-bei', cityId: 'hanzhong' },
  'fa-zheng':    { forceId: 'liu-bei', cityId: 'chengdu' },
  'liu-feng':    { forceId: 'liu-bei', cityId: 'jiangling' },
  // Sun
  'sun-quan':    { forceId: 'sun',     cityId: 'jianye' },
  'lu-meng':     { forceId: 'sun',     cityId: 'jiangxia' },
  'lu-xun':      { forceId: 'sun',     cityId: 'jianye' },
  'gan-ning':    { forceId: 'sun',     cityId: 'jianye' },
  'taishi-ci':   { forceId: 'sun',     cityId: 'wu' },
  'zhou-tai':    { forceId: 'sun',     cityId: 'jianye' },
  'han-dang':    { forceId: 'sun',     cityId: 'changsha' },

  // Xianbei
  'kebi-neng':   { forceId: 'xianbei', cityId: 'wuhuan' },
  'budugen':     { forceId: 'xianbei', cityId: 'wuhuan' },

  // Nanman — Meng Huo's host
  'meng-huo':    { forceId: 'nanman', cityId: 'jianning' },
  'meng-you':    { forceId: 'nanman', cityId: 'yongchang' },
  'mangya-chang':{ forceId: 'nanman', cityId: 'jianning' },
  'jinhuan-sanjie':{forceId:'nanman', cityId: 'yongchang' },
  'dongtu-na':   { forceId: 'nanman', cityId: 'yunnan' },
  'ahui-nan':    { forceId: 'nanman', cityId: 'yunnan' },
  'wutugu':      { forceId: 'nanman', cityId: 'yuexi' },
  'zhu-rong':    { forceId: 'nanman', cityId: 'jianning' },
};

const DEAD_BY_219 = [
  'sun-jian', 'dong-zhuo', 'li-ru', 'lu-bu', 'cao-ang', 'dian-wei',
  'sun-ce', 'zhou-yu', 'lu-su', 'guo-jia', 'pang-tong', 'ma-teng',
  'yuan-shao', 'yuan-shu', 'tao-qian', 'gongsun-zan',
];

export const SCENARIO_219_HANZHONG: Scenario = {
  id: 'scn-219-hanzhong',
  name: { en: 'The Hanzhong Campaign', zh: '漢中王' },
  description:
    'Autumn 219 AD. Liu Bei has just defeated Cao Cao at Hanzhong and proclaimed himself King. ' +
    'Guan Yu is moving to lay siege to Fancheng — the high tide of Shu. ' +
    'But Sun Quan watches Jingzhou, and Lü Meng has a plan involving white robes.',
  startDate: { year: 219, season: 'autumn' },
  cities: buildInitialCities(CITY_OWNERSHIP_219),
  forces: FORCES_219,
  officers: buildInitialOfficers(OFFICER_ASSIGNMENTS_219, DEAD_BY_219, 219),
};

// ──────────────────────────────────────────────────────────────────────
// Scenario — 222 AD The Battle of Yiling
// ──────────────────────────────────────────────────────────────────────

const FORCES_222: Force[] = [
  { id: 'cao',     name: { en: 'Cao Pi',   zh: '魏'    }, rulerOfficerId: 'cao-pi',   capitalCityId: 'luoyang',  color: '#3a7dd9', isPlayer: false },
  { id: 'liu-bei', name: { en: 'Liu Bei',  zh: '蜀漢'  }, rulerOfficerId: 'liu-bei',  capitalCityId: 'chengdu',  color: '#a85d8a', isPlayer: false },
  { id: 'sun',     name: { en: 'Sun Quan', zh: '吳'    }, rulerOfficerId: 'sun-quan', capitalCityId: 'jianye',   color: '#2f8e6f', isPlayer: false },
  { id: 'xianbei', name: { en: 'Xianbei',  zh: '鮮卑'  }, rulerOfficerId: 'kebi-neng',capitalCityId: 'wuhuan',   color: '#7a5a3a', isPlayer: false },
  { id: 'nanman',  name: { en: 'Nanman',   zh: '南蛮'  }, rulerOfficerId: 'meng-huo', capitalCityId: 'jianning', color: '#6e8a2a', isPlayer: false },
];

const CITY_OWNERSHIP_222: Record<string, string> = {
  // Wei holds the north and Jingzhou's north
  luoyang: 'cao', xuchang: 'cao', changan: 'cao', ye: 'cao',
  chenliu: 'cao', wancheng: 'cao', runan: 'cao', xinye: 'cao',
  pengcheng: 'cao', xiapi: 'cao', shouchun: 'cao', hefei: 'cao',
  pingyuan: 'cao', taiyuan: 'cao', yanmen: 'cao', shangdang: 'cao',
  beiping: 'cao', yuyang: 'cao', bohai: 'cao', beihai: 'cao',
  wuwei: 'cao', jincheng: 'cao', anding: 'cao', xiangyang: 'cao',
  // Shu — Yi province + the Baidi gateway
  chengdu: 'liu-bei', yongan: 'liu-bei', jiangzhou: 'liu-bei',
  hanzhong: 'liu-bei',
  // Wu — just took Jingzhou from Liu, killing Guan Yu in 220
  jianye: 'sun', wu: 'sun', yuzhang: 'sun', kuaiji: 'sun',
  jiangxia: 'sun', jiangling: 'sun', changsha: 'sun',
  wuling: 'sun', lingling: 'sun',
  // Xianbei — Kebi Neng on the northern frontier
  wuhuan: 'xianbei',
  // Nanman — Meng Huo's tribes
  jianning: 'nanman', yunnan: 'nanman', yongchang: 'nanman', yuexi: 'nanman',
};

const OFFICER_ASSIGNMENTS_222: Record<string, { forceId: string; cityId: string }> = {
  // Wei (Cao Pi's young state)
  'cao-pi':      { forceId: 'cao',     cityId: 'luoyang' },
  'cao-ren':     { forceId: 'cao',     cityId: 'xiangyang' },
  'cao-zhen':    { forceId: 'cao',     cityId: 'changan' },
  'cao-xiu':     { forceId: 'cao',     cityId: 'shouchun' },
  'zhang-liao':  { forceId: 'cao',     cityId: 'hefei' },
  'xu-huang':    { forceId: 'cao',     cityId: 'xiangyang' },
  'zhang-he':    { forceId: 'cao',     cityId: 'changan' },
  'sima-yi':     { forceId: 'cao',     cityId: 'luoyang' },
  'jia-xu':      { forceId: 'cao',     cityId: 'luoyang' },
  // Shu (revenge campaign)
  'liu-bei':     { forceId: 'liu-bei', cityId: 'yongan' },
  'zhang-fei':   { forceId: 'liu-bei', cityId: 'yongan' }, // Murdered 221 historically; this scenario "keeps him alive a season".
  'zhuge-liang': { forceId: 'liu-bei', cityId: 'chengdu' },
  'zhao-yun':    { forceId: 'liu-bei', cityId: 'jiangzhou' },
  'huang-zhong': { forceId: 'liu-bei', cityId: 'yongan' },
  'ma-chao':     { forceId: 'liu-bei', cityId: 'hanzhong' },
  'wei-yan':     { forceId: 'liu-bei', cityId: 'hanzhong' },
  // Wu (defending Jingzhou)
  'sun-quan':    { forceId: 'sun',     cityId: 'jianye' },
  'lu-xun':      { forceId: 'sun',     cityId: 'jiangling' },
  'lu-meng':     { forceId: 'sun',     cityId: 'jiangxia' },
  'gan-ning':    { forceId: 'sun',     cityId: 'wu' },
  'zhou-tai':    { forceId: 'sun',     cityId: 'jiangling' },
  'pan-zhang':   { forceId: 'sun',     cityId: 'jiangling' },

  // Xianbei
  'kebi-neng':   { forceId: 'xianbei', cityId: 'wuhuan' },
  'budugen':     { forceId: 'xianbei', cityId: 'wuhuan' },

  // Nanman — Meng Huo's host (about to rebel two years later)
  'meng-huo':    { forceId: 'nanman', cityId: 'jianning' },
  'meng-you':    { forceId: 'nanman', cityId: 'yongchang' },
  'mangya-chang':{ forceId: 'nanman', cityId: 'jianning' },
  'jinhuan-sanjie':{forceId:'nanman', cityId: 'yongchang' },
  'dongtu-na':   { forceId: 'nanman', cityId: 'yunnan' },
  'ahui-nan':    { forceId: 'nanman', cityId: 'yunnan' },
  'wutugu':      { forceId: 'nanman', cityId: 'yuexi' },
  'zhu-rong':    { forceId: 'nanman', cityId: 'jianning' },
};

const DEAD_BY_222 = [
  'sun-jian', 'dong-zhuo', 'li-ru', 'lu-bu', 'cao-ang', 'dian-wei',
  'sun-ce', 'zhou-yu', 'lu-su', 'guo-jia', 'pang-tong', 'ma-teng',
  'yuan-shao', 'yuan-shu', 'tao-qian', 'gongsun-zan',
  'cao-cao', 'guan-yu', 'huang-zhong', // historically — slight artistic license
  'huangfu-song', 'lu-zhi', 'zhu-jun',
];

export const SCENARIO_222_YILING: Scenario = {
  id: 'scn-222-yiling',
  name: { en: 'The Battle of Yiling', zh: '夷陵之戰' },
  description:
    'Summer 222 AD. Liu Bei, mad with grief over Guan Yu\'s death, marches east with 70,000 men to crush Wu. ' +
    'Sun Quan sends Lu Xun — a fresh-faced commander none had heard of — to meet him. ' +
    'A burning camp 700 li long awaits.',
  startDate: { year: 222, season: 'summer' },
  cities: buildInitialCities(CITY_OWNERSHIP_222),
  forces: FORCES_222,
  officers: buildInitialOfficers(OFFICER_ASSIGNMENTS_222, DEAD_BY_222, 222),
};

// ──────────────────────────────────────────────────────────────────────
// Scenario — 225 AD The Southern Campaign (Zhuge Liang vs Meng Huo)
// ──────────────────────────────────────────────────────────────────────

const FORCES_225: Force[] = [
  { id: 'liu-bei', name: { en: 'Shu',     zh: '蜀漢'  }, rulerOfficerId: 'liu-shan', capitalCityId: 'chengdu', color: '#a85d8a', isPlayer: false },
  { id: 'cao',     name: { en: 'Wei',     zh: '魏'    }, rulerOfficerId: 'cao-pi',   capitalCityId: 'luoyang', color: '#3a7dd9', isPlayer: false },
  { id: 'sun',     name: { en: 'Wu',      zh: '吳'    }, rulerOfficerId: 'sun-quan', capitalCityId: 'jianye',  color: '#2f8e6f', isPlayer: false },
  { id: 'nanman',  name: { en: 'Nanman',  zh: '南蛮'  }, rulerOfficerId: 'meng-huo', capitalCityId: 'jianning',color: '#6e8a2a', isPlayer: false },
];

const CITY_OWNERSHIP_225: Record<string, string> = {
  // Wei holds the north
  luoyang: 'cao', xuchang: 'cao', changan: 'cao', ye: 'cao',
  chenliu: 'cao', wancheng: 'cao', runan: 'cao', xinye: 'cao',
  pengcheng: 'cao', xiapi: 'cao', shouchun: 'cao', hefei: 'cao',
  pingyuan: 'cao', taiyuan: 'cao', yanmen: 'cao', shangdang: 'cao',
  beiping: 'cao', yuyang: 'cao', bohai: 'cao', beihai: 'cao',
  wuwei: 'cao', jincheng: 'cao', anding: 'cao', xiangyang: 'cao',
  // Shu (Liu Shan now — Liu Bei died at Baidi in 223)
  chengdu: 'liu-bei', yongan: 'liu-bei', jiangzhou: 'liu-bei',
  hanzhong: 'liu-bei',
  // Wu
  jianye: 'sun', wu: 'sun', yuzhang: 'sun', kuaiji: 'sun',
  jiangxia: 'sun', jiangling: 'sun', changsha: 'sun',
  wuling: 'sun', lingling: 'sun',
  // Nanman — rebelled across the southern frontier
  jianning: 'nanman',
  yongchang: 'nanman',
  yunnan: 'nanman',
  yuexi: 'nanman',
};

const OFFICER_ASSIGNMENTS_225: Record<string, { forceId: string; cityId: string }> = {
  // Shu — the campaign army
  'liu-shan':    { forceId: 'liu-bei', cityId: 'chengdu' },
  'zhuge-liang': { forceId: 'liu-bei', cityId: 'chengdu' },
  'zhao-yun':    { forceId: 'liu-bei', cityId: 'jiangzhou' },
  'ma-chao':     { forceId: 'liu-bei', cityId: 'hanzhong' },
  'ma-dai':      { forceId: 'liu-bei', cityId: 'chengdu' },
  'wei-yan':     { forceId: 'liu-bei', cityId: 'jiangzhou' },
  'wang-ping':   { forceId: 'liu-bei', cityId: 'chengdu' },
  'jiang-wan':   { forceId: 'liu-bei', cityId: 'chengdu' },
  'fei-yi':      { forceId: 'liu-bei', cityId: 'chengdu' },
  'deng-zhi':    { forceId: 'liu-bei', cityId: 'chengdu' },
  'guan-xing':   { forceId: 'liu-bei', cityId: 'hanzhong' },
  'liao-hua':    { forceId: 'liu-bei', cityId: 'hanzhong' },
  'jiang-wei':   { forceId: 'liu-bei', cityId: 'chengdu' },
  // Wei
  'cao-pi':      { forceId: 'cao',     cityId: 'luoyang' },
  'sima-yi':     { forceId: 'cao',     cityId: 'luoyang' },
  'cao-zhen':    { forceId: 'cao',     cityId: 'changan' },
  'cao-xiu':     { forceId: 'cao',     cityId: 'shouchun' },
  'zhang-liao':  { forceId: 'cao',     cityId: 'hefei' },
  'zhang-he':    { forceId: 'cao',     cityId: 'changan' },
  'jia-xu':      { forceId: 'cao',     cityId: 'luoyang' },
  'zhong-yao':   { forceId: 'cao',     cityId: 'luoyang' },
  // Wu
  'sun-quan':    { forceId: 'sun',     cityId: 'jianye' },
  'lu-xun':      { forceId: 'sun',     cityId: 'jiangling' },
  'lu-meng':     { forceId: 'sun',     cityId: 'jiangxia' },
  'zhou-tai':    { forceId: 'sun',     cityId: 'jianling' },
  'zhuge-jin':   { forceId: 'sun',     cityId: 'jianye' },
  // Nanman — Meng Huo's host
  'meng-huo':    { forceId: 'nanman',  cityId: 'jianning' },
  'meng-you':    { forceId: 'nanman',  cityId: 'yongchang' },
  'mangya-chang':{ forceId: 'nanman',  cityId: 'jianning' },
  'jinhuan-sanjie':{forceId: 'nanman', cityId: 'yongchang' },
  'dongtu-na':   { forceId: 'nanman',  cityId: 'yunnan' },
  'ahui-nan':    { forceId: 'nanman',  cityId: 'yunnan' },
  'wutugu':      { forceId: 'nanman',  cityId: 'yuexi' },
  'dailai-dongzhu':{forceId: 'nanman', cityId: 'jianning' },
  'zhu-rong':    { forceId: 'nanman',  cityId: 'jianning' },
};

const DEAD_BY_225 = [
  'sun-jian', 'dong-zhuo', 'li-ru', 'lu-bu', 'cao-ang', 'dian-wei',
  'sun-ce', 'zhou-yu', 'lu-su', 'guo-jia', 'pang-tong', 'ma-teng',
  'yuan-shao', 'yuan-shu', 'tao-qian', 'gongsun-zan',
  'cao-cao', 'guan-yu', 'huang-zhong', 'liu-bei', 'zhang-fei',
  'huangfu-song', 'lu-zhi', 'zhu-jun', 'fa-zheng',
];

export const SCENARIO_225_SOUTHERN: Scenario = {
  id: 'scn-225-southern',
  name: { en: 'The Southern Campaign', zh: '南征之役' },
  description:
    'Spring 225 AD. With Liu Bei gone, the southern tribes under Meng Huo have raised the war banner. ' +
    'Zhuge Liang marches south himself, vowing to win not by force but by surrender of the heart. ' +
    'Seven captures of the tiger-king lie ahead.',
  startDate: { year: 225, season: 'spring' },
  cities: buildInitialCities(CITY_OWNERSHIP_225),
  forces: FORCES_225,
  officers: buildInitialOfficers(OFFICER_ASSIGNMENTS_225, DEAD_BY_225, 225),
};

export const SCENARIOS: Scenario[] = [
  SCENARIO_184_YELLOW_TURBAN,
  SCENARIO_190_ANTI_DONG_ZHUO,
  SCENARIO_197_BOHAI,
  SCENARIO_200_GUANDU,
  SCENARIO_208_CHIBI,
  SCENARIO_215_HEFEI,
  SCENARIO_219_HANZHONG,
  SCENARIO_220_DECLARATION,
  SCENARIO_222_YILING,
  SCENARIO_225_SOUTHERN,
  SCENARIO_234_WUZHANG,
  SCENARIO_GATHERING_OF_HEROES,
];
