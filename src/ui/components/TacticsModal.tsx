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
  feint:          'strategy',
  'besiege-wei':  'strategy',
  'wait-tired':   'strategy',
  'sneak-cross':  'strategy',
  'probe-snake':  'strategy',
  'lure-tiger':   'strategy',
  'loose-catch':  'strategy',
  'kill-king':    'strategy',
  'cut-supply':   'strategy',
  cicada:         'strategy',
  'far-near':     'strategy',
  'borrow-arrow': 'ranged',
  'deceive-sky':  'strategy',
  'loot-fire':    'strategy',
  'from-nothing': 'strategy',
  'watch-fire':   'strategy',
  'hide-knife':   'disrupt',
  'brick-jade':   'strategy',
  'muddy-fish':   'strategy',
  'door-thief':   'strategy',
  'tree-flower':  'disrupt',
  'guest-host':   'strategy',
  'feign-mad':    'disrupt',
  'pull-ladder':  'strategy',
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
  // ── Phase 55: 三十六計 ──
  feint:          '聲東擊西 — 攻其無備。一回合內擾亂敵防線，使其判斷錯誤，主攻方向 +30% 傷害。',
  'besiege-wei':  '圍魏救趙 — 攻其必救。對敵主城施壓，引敵回援，解我方城被圍之困。',
  'wait-tired':   '以逸待勞 — 養精蓄銳。一回合不動，下回合所有反擊傷害 +50%。',
  'sneak-cross':  '暗渡陳倉 — 明修棧道暗渡之計。看似強攻一處，實則從未防之側突入。',
  'probe-snake':  '打草驚蛇 — 試探敵情。揭示敵下回合所有行動意圖。',
  'lure-tiger':   '調虎離山 — 誘使敵主力出城。敵守將 War ≥ 85 時優先離開原位。',
  'loose-catch':  '欲擒故縱 — 七擒之術。佯敗誘敵深入，敵追擊時觸發致命反伏。',
  'kill-king':    '擒賊擒王 — 直取主將。突襲敵主將，無視前排（要求 War ≥ 90）。',
  'cut-supply':   '釜底抽薪 — 斷其糧道。敵兵每回合自損 5%，持續 3 回合。',
  cicada:         '金蟬脫殼 — 偽裝替身脫身。我方留下虛位，主力悄然轉移。',
  'far-near':     '遠交近攻 — 範睢戰國之計。+30% 與遠方勢力建交成功率，鄰國敵意 +10。',
  'borrow-arrow': '草船借箭 — 諸葛之妙。霧天用草船誘敵射箭，反獲敵箭萬支，下回合弓兵 +50%。',
  'deceive-sky':  '瞞天過海 — 大智若愚之術。明擺於眾目，反而被忽略。本回合行動敵方視而不見。',
  'loot-fire':    '趁火打劫 — 乘敵內亂之機。敵勢力陷入叛亂 / 瘟疫時，攻擊傷害 +40%。',
  'from-nothing': '無中生有 — 虛實相生。製造假象兵力，使敵將判斷錯誤，分兵應對。',
  'watch-fire':   '隔岸觀火 — 坐山觀虎鬥。當敵國互相內戰時，本方資源每回合 +15%。',
  'hide-knife':   '笑裡藏刀 — 假意修好暗中圖之。對盟友突襲時，敵方無防備傷害 +50%。',
  'brick-jade':   '拋磚引玉 — 以小換大。捨棄一座低價值城池，換取敵主力深入後的反包圍。',
  'muddy-fish':   '渾水摸魚 — 亂中取勝。戰場混亂回合中，所有計策成功率 +25%。',
  'door-thief':   '關門捉賊 — 圍而不攻。包圍小股敵軍後，每回合敵 −10% 兵，逼降。',
  'tree-flower':  '樹上開花 — 借勢嚇敵。借盟軍旗號威懾，敵方士氣 −20%。',
  'guest-host':   '反客為主 — 漸進蠶食。在敵境內駐留 3 回合後，反過來掌控當地。',
  'feign-mad':    '假癡不癲 — 大智若愚。假裝平庸無能，使敵放鬆警惕，反擊時 War +20。',
  'pull-ladder':  '上屋抽梯 — 斷其退路。誘敵深入後切斷退路，敵全軍每回合 −15% 士氣。',
};

const CATEGORIES: CatalogCategory[] = [
  { key: 'melee',    zh: '近戰', en: 'Melee',    color: '#b8442e' },
  { key: 'ranged',   zh: '遠程', en: 'Ranged',   color: '#b8c87a' },
  { key: 'mystic',   zh: '奇門', en: 'Mystic',   color: '#c178c7' },
  { key: 'disrupt',  zh: '擾亂', en: 'Disrupt',  color: '#88b7e8' },
  { key: 'strategy', zh: '策略', en: 'Strategy', color: '#d4a84a' },
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
