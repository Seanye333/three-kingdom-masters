import { POLICY_DEFS } from '../../game/data/officerAttributes';
import { CatalogModal, type CatalogItem, type CatalogCategory } from './CatalogModal';

const POLICY_CATEGORY: Record<string, string> = {
  // ── economy ──
  tuntian:             'economy',
  hydraulics:          'economy',
  commerce:            'economy',
  'salt-monopoly':     'economy',
  'iron-monopoly':     'economy',
  coinage:             'economy',
  'silk-trade':        'economy',
  'tea-trade':         'economy',
  'land-reform':       'economy',
  'poor-relief':       'economy',
  // ── civil ──
  scholarship:         'civil',
  legalism:            'civil',
  rites:               'civil',
  medicine:            'civil',
  'nine-grade':        'civil',
  inspection:          'civil',
  'ancestor-rites':    'civil',
  astronomy:           'civil',
  'calendar-reform':   'civil',
  // ── military ──
  engineering:         'military',
  recruitment:         'military',
  smithing:            'military',
  'horse-stewardship': 'military',
  'military-theory':   'military',
  'naval-academy':     'military',
  'crossbow-corps':    'military',
  'border-garrison':   'military',
  'siege-school':      'military',
  // ── diplomacy / intel ──
  'alliance-marriage': 'diplomacy',
  'tribute-system':    'diplomacy',
  'spy-network':       'diplomacy',
  propaganda:          'diplomacy',
  'frontier-pacification': 'diplomacy',
  // ── new economy ──
  granary:             'economy',
  'maritime-trade':    'economy',
  'silk-loom':         'economy',
  'ox-plowing':        'economy',
  'fish-salt':         'economy',
  // ── new military ──
  fortifications:      'military',
  'ambush-corps':      'military',
  'mountain-warfare':  'military',
  conscription:        'military',
  'elite-guards':      'military',
  arsenal:             'military',
  // ── new civil ──
  'imperial-academy':  'civil',
  'post-roads':        'civil',
  'community-granary': 'civil',
  'court-music':       'civil',
  buddhism:            'civil',
  taoism:              'civil',
  divination:          'civil',
  // ── new diplomacy / intel ──
  'hostage-system':    'diplomacy',
  assassins:           'diplomacy',
  'counter-intel':     'diplomacy',
  'defector-reward':   'diplomacy',
};

const POLICY_DESC: Record<string, string> = {
  // ── economy ──
  tuntian:             '屯田 — 兵農合一，駐軍墾荒。糧食產量 +25%，募兵 +10%。',
  hydraulics:          '治水 — 修堤築壩，灌溉農田。農業上限 +15，水攻防 +20%。',
  commerce:            '商業 — 興市通商，鼓勵交易。商業上限 +15，金收入 +20%。',
  'salt-monopoly':     '鹽政 — 國家專營食鹽。每季金 +60，民忠 −1 (官鹽價貴)。',
  'iron-monopoly':     '鐵政 — 國家專營鐵器。武器產量 +30%，城防 +10%。',
  coinage:             '鑄幣 — 整頓貨幣，鑄造五銖。商業收入 +15%，通膨控制。',
  'silk-trade':        '絲綢之路 — 西域商道暢通。金收入 +25%，與西涼諸夷外交 +1。',
  'tea-trade':         '茶馬貿易 — 與羌人換馬。馬政效率 +15%，邊境穩定 +1。',
  'land-reform':       '均田 — 重新分配田地。民忠 +5，農業 +10%，世族敵意 +1。',
  'poor-relief':       '賑災 — 設立常平倉，凶年放糧。瘟疫機率 −30%，民忠每季 +1。',
  // ── civil ──
  scholarship:         '學問 — 興建學館，培育人才。武將招募成功率 +20%，新生 INT +5。',
  legalism:            '法治 — 嚴明法令，重典治世。城市忠誠 +10，叛亂概率減半。',
  rites:               '禮樂 — 制禮作樂，安撫民心。民忠每季 +1，文官效率 +15%。',
  medicine:            '醫術 — 軍醫進駐，療傷救命。瘟疫概率 −50%，負傷恢復 −1 季。',
  'nine-grade':        '九品中正 — 陳群所創。優秀世族子弟自動晉陞 (HIGH INT)，但寒門上升困難。',
  inspection:          '監察 — 設御史台稽查吏治。腐敗 −50%，金庫不漏。',
  'ancestor-rites':    '宗廟祭祀 — 帝王正統的禮制。皇族忠誠 +10，建國儀典加分。',
  astronomy:           '天文 — 觀象授時。徵兆預測 +1，奇門遁甲類戰法增強。',
  'calendar-reform':   '曆法 — 頒布新曆。農時準確 +5%，朝廷威信 +5。',
  // ── military ──
  engineering:         '工兵 — 攻城器械研發。攻城傷害 +25%，城防 +10%。',
  recruitment:         '養兵 — 練兵備戰，訓練精銳。兵力上限 +20%，士兵素質 +1。',
  smithing:            '鍛造 — 鑄造兵刃。武器物品銳氣 +5，武將攻擊 +5。',
  'horse-stewardship': '馬政 — 養馬育駒，騎兵改革。騎兵戰力 +20%，新馬獲取率 +10%。',
  'military-theory':   '軍學 — 設兵書院，研讀兵法。陣形效果 +15%，計策成功率 +10%。',
  'naval-academy':     '水軍 — 訓練水兵戰船。水戰能力 +30%，沿江沿海守備強化。',
  'crossbow-corps':    '弩兵 — 諸葛連弩量產。弓兵射程 +1，齊射傷害 +20%。',
  'border-garrison':   '邊防 — 邊境永久駐軍。邊城防禦 +25%，異族入侵 −30%。',
  'siege-school':      '攻城 — 工程兵專業化。攻城速度 +30%，城牆減耗 −20%。',
  // ── diplomacy / intel ──
  'alliance-marriage': '和親 — 與鄰國通婚。與目標勢力外交關係 +30，盟約穩定。',
  'tribute-system':    '朝貢 — 確立宗主地位。附屬勢力每季貢金 +50。',
  'spy-network':       '細作 — 培訓間諜。敵情可視範圍 +1 城，計謀成功率 +15%。',
  propaganda:          '檄文 — 起草檄文討伐。戰前敵兵叛逃率 +5%，盟友參戰意願 +15。',
  'frontier-pacification': '撫夷 — 攻心為上，南撫蠻夷。南方/西涼異族叛亂 −60%，可徵召蠻兵。',
  // ── new economy ──
  granary:             '倉廩 — 設常平倉。糧價穩定，凶年無饑民，金庫每季 −20 維護。',
  'maritime-trade':    '海貿 — 沿海港口開放。每季金 +80，需港口城。東吳特色。',
  'silk-loom':         '蠶桑 — 推廣蠶絲。商業 +10，可生產絲綢進貢/外銷。',
  'ox-plowing':        '牛耕 — 鼓勵牛拉重犁。農業上限 +12，農時 −15%。',
  'fish-salt':         '漁鹽 — 沿海漁鹽兼營。糧 +15%，金 +40/季，需沿海城。',
  // ── new military ──
  fortifications:      '城防 — 加固城牆建箭樓。城防 +30%，攻城時間 +30%。',
  'ambush-corps':      '伏兵營 — 林山伏擊訓練。伏兵戰法成功率 +25%，森林/山地戰力 +15%。',
  'mountain-warfare':  '山戰 — 山地行軍與作戰。山地移動 ×2，山地傷害 +20%。',
  conscription:        '徵兵 — 大規模強徵。兵力上限 +35%，但民忠 −1/季、農業 −10%。',
  'elite-guards':      '親衛 — 培訓親衛精銳。主將護衛 +40 兵，主將戰死率 −50%。',
  arsenal:             '軍械庫 — 設中央軍械庫。出征自動配發兵器，每月 −15g 維護。',
  // ── new civil ──
  'imperial-academy':  '太學 — 設立太學。學者武將每季 INT +1，可培養儒生官吏。',
  'post-roads':        '驛站 — 全國驛站。命令傳達 +1 城/季，行軍速度 +10%。',
  'community-granary': '義倉 — 鄉社互助糧倉。災情自動賑濟，民忠 +3，金庫 −30/季。',
  'court-music':       '雅樂 — 朝廷正樂。文官效率 +10%，外賓禮節分 +5。',
  // ── cultural / religious ──
  buddhism:            '佛教 — 建寺度僧。民忠 +3/季，少部分人口出家不耕戰 (−5%)。',
  taoism:              '道教 — 設道觀。瘟疫 −30%，秘術系戰法 +10% 成功率。',
  divination:          '卜筮 — 太卜署。重大決策前可窺天意，戰前資訊 +1 條。',
  // ── new diplomacy / intel ──
  'hostage-system':    '質子 — 收他國貴族為質。盟約穩定 ×2，對方背叛代價 ×3。',
  assassins:           '刺客 — 培養死士。可派遣刺殺敵將，成功率隨 INT 提升。',
  'counter-intel':     '反間 — 反查細作。敵方間諜成功率 −50%，可植入假情報。',
  'defector-reward':   '招降 — 厚賞降將。敵將戰敗投降概率 +20%。',
};

const CATEGORIES: CatalogCategory[] = [
  { key: 'economy',   zh: '民政', en: 'Economy',   color: '#b8c87a' },
  { key: 'civil',     zh: '文教', en: 'Civil',     color: '#88b7e8' },
  { key: 'military',  zh: '兵備', en: 'Military',  color: '#b8442e' },
  { key: 'diplomacy', zh: '外交', en: 'Diplomacy', color: '#d4a84a' },
];

interface Props { onClose: () => void; }

export function PoliciesModal({ onClose }: Props) {
  const items: CatalogItem[] = Object.entries(POLICY_DEFS).map(([id, def]) => ({
    id,
    zh: def.zh,
    en: def.en,
    description: POLICY_DESC[id] ?? '',
    category: POLICY_CATEGORY[id] ?? 'civil',
  }));
  return (
    <CatalogModal
      onClose={onClose}
      title={{ zh: '政策', en: 'Policies' }}
      items={items}
      categories={CATEGORIES}
    />
  );
}
