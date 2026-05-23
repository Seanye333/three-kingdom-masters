import { TACTIC_DEFS } from '../../game/data/officerAttributes';
import { CatalogModal, type CatalogItem, type CatalogCategory } from './CatalogModal';

// Classify 24 tactics into 4 categories.
const TACTIC_CATEGORY: Record<string, string> = {
  charge:         'melee',
  rouse:          'melee',
  ambush:         'melee',
  'last-stand':   'melee',
  'iron-wall':    'melee',
  rush:           'melee',
  volley:         'ranged',
  crossbow:       'ranged',
  catapult:       'ranged',
  'fire-arrow':   'ranged',
  meteor:         'ranged',
  'fire-attack':  'mystic',
  'water-attack': 'mystic',
  thunder:        'mystic',
  'borrow-wind':  'mystic',
  'eight-gates':  'mystic',
  ruse:           'disrupt',
  disorder:       'disrupt',
  pitfall:        'disrupt',
  curse:          'disrupt',
  beauty:         'disrupt',
  chain:          'disrupt',
  'self-injury':  'disrupt',
  retreat:        'disrupt',
};

const TACTIC_DESC: Record<string, string> = {
  charge:         '突擊 — 騎兵衝鋒突破敵陣。對未防禦的密集步兵殺傷尤甚。',
  rouse:          '鼓舞 — 提振士氣，使己方部隊一回合內 +20% 戰力。',
  ambush:         '急襲 — 出其不意，繞至敵後造成 25% 額外傷害。',
  volley:         '齊射 — 弓兵集體射擊，遠程齊發。對輕甲尤其有效。',
  crossbow:       '連弩 — 連發弩箭，穿透重甲。射程 +1。',
  catapult:       '投石 — 巨石投擲，攻城專用。對城牆造成額外損害。',
  'fire-attack':  '火計 — 火攻燒營，乘風縱火。順風時威力 +35%。',
  'water-attack': '水計 — 掘堤淹城，水攻陣地。要求臨水城池。',
  ruse:           '偽計 — 詐降詐敗誘敵深入，敵 INT <70 時必中。',
  disorder:       '撹亂 — 散布謠言使敵軍陷入混亂，−1 行動點。',
  pitfall:        '落穴 — 設伏陷阱，林地 / 山地專用，造成數倍傷害。',
  curse:          '罵聲 — 陣前痛罵激怒對方主將，引發魯莽行動。',
  // ── Phase 54 expansion ──
  'last-stand':   '死戰 — 兵力降至 30% 以下時觸發。武力 +30，自損 −20%。背水一戰之勢。',
  'iron-wall':    '鐵壁 — 重甲列陣，全員防御 +50%。對近戰傷害減半，但機動 −2。',
  rush:           '突進 — 騎兵兩段衝鋒。第一回合移動 +2，貫穿後排弱兵。',
  'fire-arrow':   '火矢 — 弓箭裹油點燃。命中時 30% 機率使目標 burning 3 回合。',
  meteor:         '流星 — 巨石抛射，落點殺傷一片。+20% 範圍傷害，攻城傷害翻倍。',
  thunder:        '雷震 — 道家雷法。命中目標暈眩 1 回合（−1 AP），對甲胄單位效果加倍。',
  'borrow-wind':  '借東風 — 七星壇求風，秋冬之季可成。次 2 回合內天氣強制為東風強勁。',
  'eight-gates':  '八門遁甲 — 道家陣門遁形。己方一回合內隱形難擊中，順便驅散敵方所有 buff。',
  beauty:         '美人計 — 美人遣往敵陣。敵將魅力 <70 時，10% 機率倒戈到我方。',
  chain:          '連環計 — 多重計策串接，破陣後敵全軍受三段 debuff（−攻 / −防 / −士氣）。',
  'self-injury':  '苦肉計 — 黃蓋詐降之術。犧牲己方一員，敵主將被引入致命陷阱。',
  retreat:        '走為上 — 安全撤退。我方部隊 0 損失退出戰場，但放棄當前目標。',
};

const CATEGORIES: CatalogCategory[] = [
  { key: 'melee',   zh: '近戰', en: 'Melee',   color: '#b8442e' },
  { key: 'ranged',  zh: '遠程', en: 'Ranged',  color: '#b8c87a' },
  { key: 'mystic',  zh: '奇門', en: 'Mystic',  color: '#c178c7' },
  { key: 'disrupt', zh: '擾亂', en: 'Disrupt', color: '#88b7e8' },
];

interface Props { onClose: () => void; }

export function TacticsModal({ onClose }: Props) {
  const items: CatalogItem[] = Object.entries(TACTIC_DEFS).map(([id, def]) => ({
    id,
    zh: def.zh,
    en: def.en,
    description: TACTIC_DESC[id] ?? '',
    category: TACTIC_CATEGORY[id] ?? 'melee',
  }));
  return (
    <CatalogModal
      onClose={onClose}
      title={{ zh: '戰法', en: 'Tactics' }}
      items={items}
      categories={CATEGORIES}
    />
  );
}
