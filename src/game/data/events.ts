import type { HistoricalEvent } from '../types';

/**
 * Scripted historical events. The event runner checks these every season and
 * fires the first one whose conditions match. Each event can fire at most once
 * (tracked via state.firedEvents).
 *
 * Effects are deliberately moderate — narrative reinforcement, not game-breaking
 * power swings.
 */
export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  {
    id: 'evt-yellow-turban-defeated',
    name: { en: 'The Yellow Turbans Crushed', zh: '黄巾の乱、平定' },
    yearMin: 190,
    yearMax: 191,
    description:
      'Word reaches the courts that the Yellow Turban Rebellion has been broken in the southern provinces. Loyal generals are rewarded with promotions.',
    effects: [],
  },
  {
    id: 'evt-dong-zhuo-burns-luoyang',
    name: { en: 'Dong Zhuo Burns Luoyang', zh: '董卓、洛陽を焚く' },
    yearMin: 190,
    yearMax: 191,
    season: 'summer',
    requires: [{ kind: 'force-alive', forceId: 'force-dong-zhuo' }],
    description:
      'Pressed by the coalition, Dong Zhuo torches the imperial capital and flees with the boy emperor to Chang\'an. Luoyang lies in ruins; loyalty collapses across the Central Plain.',
    effects: [
      { kind: 'city-loyalty', cityId: 'city-luoyang', delta: -40 },
      { kind: 'flag', key: 'luoyang-burned' },
    ],
  },
  {
    id: 'evt-dong-zhuo-assassinated',
    name: { en: 'Dong Zhuo Assassinated', zh: '董卓、暗殺さる' },
    yearMin: 192,
    yearMax: 193,
    requires: [
      { kind: 'force-alive', forceId: 'force-dong-zhuo' },
      { kind: 'officer-active', officerId: 'wang-yun' },
    ],
    description:
      'Wang Yun and Diaochan turn Lü Bu against his foster father. Dong Zhuo dies under his own ward\'s halberd, and the tyrant\'s force fractures.',
    effects: [
      { kind: 'officer-status', officerId: 'dong-zhuo', status: 'dead' },
      { kind: 'force-troops-multiplier', forceId: 'force-dong-zhuo', multiplier: 0.5 },
    ],
  },
  {
    id: 'evt-coalition-dissolves',
    name: { en: 'The Coalition Dissolves', zh: '反董卓連合、解散' },
    yearMin: 191,
    yearMax: 193,
    description:
      'With the tyrant chased to Chang\'an, the warlords return to their own holdings. The coalition that once united them is at an end, and the warring states period begins in earnest.',
    effects: [{ kind: 'flag', key: 'coalition-dissolved' }],
  },
  {
    id: 'evt-yuan-shao-takes-jizhou',
    name: { en: 'Yuan Shao Takes Jizhou', zh: '袁紹、冀州を取る' },
    yearMin: 191,
    yearMax: 193,
    requires: [{ kind: 'force-alive', forceId: 'force-yuan-shao' }],
    description:
      'Yuan Shao maneuvers Han Fu out of Jizhou and adds its grain and men to his own. The largest warlord in the north now commands the richest province.',
    effects: [
      { kind: 'force-troops-multiplier', forceId: 'force-yuan-shao', multiplier: 1.15 },
    ],
  },
  {
    id: 'evt-cao-cao-shelters-emperor',
    name: { en: 'Cao Cao Shelters the Emperor', zh: '曹操、天子を奉ず' },
    yearMin: 196,
    yearMax: 197,
    requires: [
      { kind: 'force-alive', forceId: 'force-cao-cao' },
      { kind: 'flag-set', key: 'luoyang-burned' },
    ],
    description:
      'Cao Cao escorts Emperor Xian from the ruins of Luoyang to Xuchang. Whoever holds the emperor commands legitimacy: edicts issued in Cao\'s name will be obeyed across the realm.',
    effects: [
      { kind: 'force-gold', forceId: 'force-cao-cao', delta: 500 },
      { kind: 'flag', key: 'emperor-with-cao' },
    ],
  },
  {
    id: 'evt-sun-ce-conquers-jiangdong',
    name: { en: 'Sun Ce Conquers Jiangdong', zh: '孫策、江東を征す' },
    yearMin: 195,
    yearMax: 199,
    requires: [
      { kind: 'force-alive', forceId: 'force-sun-ce' },
      { kind: 'officer-active', officerId: 'sun-ce' },
    ],
    description:
      'The Little Conqueror sweeps through the south, breaking Liu Yao, Yan Baihu, and Wang Lang in turn. Jiangdong is unified under the Sun banner.',
    effects: [
      { kind: 'force-troops-multiplier', forceId: 'force-sun-ce', multiplier: 1.2 },
    ],
  },
  {
    id: 'evt-battle-of-guandu',
    name: { en: 'The Battle of Guandu', zh: '官渡の戦い' },
    yearMin: 200,
    yearMax: 201,
    requires: [
      { kind: 'force-alive', forceId: 'force-cao-cao' },
      { kind: 'force-alive', forceId: 'force-yuan-shao' },
    ],
    description:
      'A small Cao Cao army defies the massive host of Yuan Shao on the Yellow River. Through a daring raid on the granaries at Wuchao, Cao breaks the back of the north — and inherits its lands.',
    effects: [
      { kind: 'force-troops-multiplier', forceId: 'force-yuan-shao', multiplier: 0.6 },
      { kind: 'force-troops-multiplier', forceId: 'force-cao-cao', multiplier: 1.1 },
    ],
  },
  {
    id: 'evt-sun-ce-assassinated',
    name: { en: 'Sun Ce Assassinated', zh: '孫策、刺客に倒る' },
    yearMin: 200,
    yearMax: 201,
    requires: [{ kind: 'officer-active', officerId: 'sun-ce' }],
    description:
      'Out hunting, the Little Conqueror is ambushed by retainers of Xu Gong, whom he had executed. He dies of his wounds, naming his young brother Sun Quan as successor.',
    effects: [
      { kind: 'officer-status', officerId: 'sun-ce', status: 'dead' },
      { kind: 'officer-loyalty', officerId: 'sun-quan', delta: 20 },
    ],
  },
  {
    id: 'evt-three-visits-to-thatched-cottage',
    name: { en: 'Three Visits to the Thatched Cottage', zh: '三顧の礼' },
    yearMin: 207,
    yearMax: 208,
    requires: [
      { kind: 'force-alive', forceId: 'force-liu-bei' },
      { kind: 'officer-alive', officerId: 'zhuge-liang' },
    ],
    description:
      'Liu Bei visits the hermit Zhuge Liang three times, finally winning his service. The Sleeping Dragon rises — and presents the Longzhong Plan, mapping out the path to a divided empire.',
    effects: [
      { kind: 'officer-join', officerId: 'zhuge-liang', forceId: 'force-liu-bei' },
      { kind: 'officer-loyalty', officerId: 'zhuge-liang', delta: 30 },
      { kind: 'flag', key: 'three-visits-done' },
    ],
  },
  {
    id: 'evt-battle-of-red-cliffs',
    name: { en: 'The Battle of Red Cliffs', zh: '赤壁の戦い' },
    yearMin: 208,
    yearMax: 209,
    season: 'winter',
    requires: [
      { kind: 'force-alive', forceId: 'force-cao-cao' },
      { kind: 'force-alive', forceId: 'force-sun-quan' },
    ],
    description:
      'On the Yangtze, the allied fleets of Sun Quan and Liu Bei break the host of Cao Cao with a chained-ship fire attack. The dream of unification dies in the river\'s reflection.',
    effects: [
      { kind: 'force-troops-multiplier', forceId: 'force-cao-cao', multiplier: 0.55 },
      { kind: 'force-troops-multiplier', forceId: 'force-sun-quan', multiplier: 1.05 },
      { kind: 'force-troops-multiplier', forceId: 'force-liu-bei', multiplier: 1.1 },
      { kind: 'flag', key: 'three-kingdoms-formed' },
    ],
  },
  {
    id: 'evt-liu-bei-takes-shu',
    name: { en: 'Liu Bei Takes Shu', zh: '劉備、蜀を取る' },
    yearMin: 213,
    yearMax: 215,
    requires: [
      { kind: 'force-alive', forceId: 'force-liu-bei' },
      { kind: 'officer-active', officerId: 'liu-bei' },
    ],
    description:
      'Invited as a defender and turning conqueror, Liu Bei seizes Yi province from his kinsman Liu Zhang. Chengdu is now the capital of a third great power.',
    effects: [
      { kind: 'force-troops-multiplier', forceId: 'force-liu-bei', multiplier: 1.2 },
      { kind: 'force-gold', forceId: 'force-liu-bei', delta: 1000 },
    ],
  },
  {
    id: 'evt-fan-castle-guan-yu',
    name: { en: 'The Fall of Guan Yu', zh: '関羽、麦城に死す' },
    yearMin: 219,
    yearMax: 220,
    requires: [{ kind: 'officer-active', officerId: 'guan-yu' }],
    description:
      'Drowning the seven armies and besieging Fan, Guan Yu shakes the realm. Then Lü Meng of Wu crosses the river in white, takes Jiangling behind him, and the God of War falls at Maicheng.',
    effects: [
      { kind: 'officer-status', officerId: 'guan-yu', status: 'dead' },
      { kind: 'officer-loyalty', officerId: 'zhang-fei', delta: -10 },
      { kind: 'officer-loyalty', officerId: 'liu-bei', delta: -10 },
    ],
  },
  {
    id: 'evt-cao-cao-dies',
    name: { en: 'Cao Cao Dies', zh: '曹操、世を去る' },
    yearMin: 220,
    yearMax: 220,
    requires: [{ kind: 'officer-active', officerId: 'cao-cao' }],
    description:
      'The Hero of Chaos closes his eyes. His son Cao Pi will not wait long before deposing the Han and proclaiming Wei.',
    effects: [
      { kind: 'officer-status', officerId: 'cao-cao', status: 'dead' },
      { kind: 'officer-loyalty', officerId: 'cao-pi', delta: 20 },
    ],
  },
  {
    id: 'evt-battle-of-yiling',
    name: { en: 'The Battle of Yiling', zh: '夷陵の戦い' },
    yearMin: 222,
    yearMax: 223,
    requires: [
      { kind: 'force-alive', forceId: 'force-liu-bei' },
      { kind: 'force-alive', forceId: 'force-sun-quan' },
    ],
    description:
      'Liu Bei marches east to avenge Guan Yu. Lu Xun, fresh-faced and underestimated, lets him exhaust himself, then burns his camps across seven hundred li. The Shu host is annihilated.',
    effects: [
      { kind: 'force-troops-multiplier', forceId: 'force-liu-bei', multiplier: 0.5 },
    ],
  },
  {
    id: 'evt-liu-bei-dies',
    name: { en: 'Liu Bei Dies at Baidicheng', zh: '劉備、白帝城に没す' },
    yearMin: 223,
    yearMax: 223,
    requires: [{ kind: 'officer-active', officerId: 'liu-bei' }],
    description:
      'Heartbroken in defeat, Liu Bei dies at the White Emperor City, entrusting his son and his cause to Zhuge Liang.',
    effects: [
      { kind: 'officer-status', officerId: 'liu-bei', status: 'dead' },
      { kind: 'officer-loyalty', officerId: 'zhuge-liang', delta: 30 },
    ],
  },
  {
    id: 'evt-northern-campaigns',
    name: { en: 'The Northern Campaigns Begin', zh: '出師の表' },
    yearMin: 227,
    yearMax: 228,
    season: 'spring',
    requires: [
      { kind: 'force-alive', forceId: 'force-liu-bei' },
      { kind: 'officer-active', officerId: 'zhuge-liang' },
    ],
    description:
      'Zhuge Liang presents his memorial to the second emperor and marches north. Six campaigns will follow; none will reach Chang\'an. But the cause is kept alive in the marching.',
    effects: [{ kind: 'flag', key: 'northern-campaigns-begun' }],
  },
  {
    id: 'evt-zhuge-liang-dies',
    name: { en: 'A Star Falls at Wuzhang Plains', zh: '五丈原に星墜つ' },
    yearMin: 234,
    yearMax: 234,
    season: 'autumn',
    requires: [{ kind: 'officer-active', officerId: 'zhuge-liang' }],
    description:
      'In the field opposite Sima Yi, the Prime Minister of Shu finally breaks. A great star falls from the southwestern sky. The age of giants ends.',
    effects: [
      { kind: 'officer-status', officerId: 'zhuge-liang', status: 'dead' },
    ],
  },

  // ─────────── Special officer events ───────────────────────────────
  {
    id: 'evt-diaochan-intrigue',
    name: { en: "Diaochan's Snare", zh: '貂蝉の連環の計' },
    yearMin: 191,
    yearMax: 192,
    requires: [
      { kind: 'officer-active', officerId: 'wang-yun' },
      { kind: 'officer-active', officerId: 'diaochan' },
      { kind: 'officer-active', officerId: 'lu-bu' },
    ],
    description:
      'Wang Yun sets the perfect trap. Promising the maiden Diaochan to both Dong Zhuo and his ward Lü Bu, he weaves the Chain Stratagem — and the bond between tyrant and warrior cracks under it.',
    effects: [
      { kind: 'officer-loyalty', officerId: 'lu-bu', delta: -30 },
      { kind: 'flag', key: 'chain-stratagem' },
    ],
  },
  {
    id: 'evt-lu-bu-betrayal',
    name: { en: "Lü Bu's Betrayal", zh: '呂布の裏切り' },
    yearMin: 191,
    yearMax: 193,
    requires: [
      { kind: 'force-alive', forceId: 'force-dong-zhuo' },
      { kind: 'officer-active', officerId: 'lu-bu' },
      { kind: 'flag-set', key: 'chain-stratagem' },
    ],
    description:
      'In the throne hall of Mei, the Flying General puts his halberd through Dong Zhuo. The tyrant\'s blood spills, the court erupts, and Lü Bu flees east — a kingmaker now adrift.',
    effects: [
      { kind: 'officer-status', officerId: 'dong-zhuo', status: 'dead' },
      { kind: 'flag', key: 'dong-zhuo-killed-by-lubu' },
    ],
  },
  {
    id: 'evt-cao-pi-seven-step-poem',
    name: { en: 'Seven Steps to Spare a Brother', zh: '七歩詩' },
    yearMin: 220,
    yearMax: 221,
    requires: [
      { kind: 'officer-active', officerId: 'cao-pi' },
      { kind: 'officer-active', officerId: 'cao-zhi' },
    ],
    description:
      'Cao Pi orders his brother Cao Zhi to compose a poem within seven paces or die. Cao Zhi answers: "Beans burn in the fire / boiled by their own stalks / both grew from one root — / why must we devour each other?" The poet lives.',
    effects: [
      { kind: 'officer-loyalty', officerId: 'cao-zhi', delta: -30 },
      { kind: 'flag', key: 'seven-step-poem' },
    ],
  },
  {
    id: 'evt-liu-bei-mourns-guan-yu',
    name: { en: 'Liu Bei Mourns Guan Yu', zh: '劉備、関羽を哭す' },
    yearMin: 220,
    yearMax: 221,
    requires: [
      { kind: 'officer-active', officerId: 'liu-bei' },
      { kind: 'officer-alive', officerId: 'guan-yu' },
    ],
    description:
      'Word reaches Chengdu of the death at Maicheng. Liu Bei collapses; for days he cannot speak. A vow against Wu hardens in his grief — and behind him, Zhuge Liang sees the path ahead darken.',
    effects: [
      { kind: 'officer-loyalty', officerId: 'liu-bei', delta: -15 },
      { kind: 'flag', key: 'mourning-guan-yu' },
    ],
  },
  {
    id: 'evt-zhang-fei-murdered',
    name: { en: 'Zhang Fei Murdered in His Tent', zh: '張飛、帳中に死す' },
    yearMin: 221,
    yearMax: 221,
    requires: [
      { kind: 'officer-active', officerId: 'zhang-fei' },
      { kind: 'flag-set', key: 'mourning-guan-yu' },
    ],
    description:
      'Drunken with grief and rage, Zhang Fei beats his own officers Fan Qiang and Zhang Da. They slip into his tent at night and take his head to Wu. The Three Brothers are no more.',
    effects: [
      { kind: 'officer-status', officerId: 'zhang-fei', status: 'dead' },
    ],
  },
  {
    id: 'evt-yi-zhi-promotion',
    name: { en: 'Sima Yi Rises in Wei', zh: '司馬懿、台閣に登る' },
    yearMin: 226,
    yearMax: 228,
    requires: [
      { kind: 'officer-active', officerId: 'sima-yi' },
      { kind: 'force-alive', forceId: 'force-cao-cao' },
    ],
    description:
      'With Cao Pi gone, the new emperor Cao Rui needs hands. Sima Yi steps forward — quiet, capable, watchful. Wei does not yet know it is feeding the dragon that will swallow it.',
    effects: [
      { kind: 'officer-loyalty', officerId: 'sima-yi', delta: 10 },
      { kind: 'flag', key: 'sima-yi-rising' },
    ],
  },
  {
    id: 'evt-meng-huo-seven-captures',
    name: { en: 'Seven Captures of Meng Huo', zh: '七擒孟獲' },
    yearMin: 225,
    yearMax: 225,
    requires: [
      { kind: 'force-alive', forceId: 'force-liu-bei' },
      { kind: 'officer-active', officerId: 'zhuge-liang' },
    ],
    description:
      'Zhuge Liang campaigns into the south. Seven times he captures the Nanman king Meng Huo; seven times he releases him. On the seventh, Meng Huo kneels, and the south is pacified — not by sword but by sincerity.',
    effects: [
      { kind: 'force-troops-multiplier', forceId: 'force-liu-bei', multiplier: 1.05 },
      { kind: 'flag', key: 'nanman-pacified' },
    ],
  },
  {
    id: 'evt-empty-fort-stratagem',
    name: { en: 'The Empty Fort Stratagem', zh: '空城の計' },
    yearMin: 228,
    yearMax: 230,
    requires: [
      { kind: 'officer-active', officerId: 'zhuge-liang' },
      { kind: 'officer-active', officerId: 'sima-yi' },
    ],
    description:
      'Outflanked at Xicheng with no army to defend, Zhuge Liang throws open the gates, sweeps the courtyard, and plays the qin atop the wall. Sima Yi sees the trap that isn\'t there, and turns his fifteen-thousand back. The Sleeping Dragon wakes another day.',
    effects: [
      { kind: 'officer-loyalty', officerId: 'zhuge-liang', delta: 10 },
      { kind: 'flag', key: 'empty-fort-stratagem' },
    ],
  },
  {
    id: 'evt-zhou-yu-laments',
    name: { en: '"Why Did Heaven Make Liang?"', zh: '既生瑜何生亮' },
    yearMin: 210,
    yearMax: 210,
    requires: [
      { kind: 'officer-active', officerId: 'zhou-yu' },
      { kind: 'officer-active', officerId: 'zhuge-liang' },
    ],
    description:
      'Outwitted one last time by his rival, Zhou Yu coughs blood and dies at Baqiu, crying to heaven: "Since you sent Yu into the world, why also Liang?" Wu loses its great architect.',
    effects: [
      { kind: 'officer-status', officerId: 'zhou-yu', status: 'dead' },
    ],
  },
  {
    id: 'evt-zhao-yun-changban',
    name: { en: 'Zhao Yun at Changban', zh: '長坂の趙雲' },
    yearMin: 208,
    yearMax: 208,
    requires: [
      { kind: 'officer-active', officerId: 'zhao-yun' },
      { kind: 'officer-active', officerId: 'liu-bei' },
    ],
    description:
      'Through the Cao army at Changban, Zhao Yun rides alone — once, twice, seven times, slaying fifty-one named commanders to bring Liu Bei\'s infant son out alive. The cape over his shoulder bears the boy emperor of tomorrow.',
    effects: [
      { kind: 'officer-loyalty', officerId: 'zhao-yun', delta: 15 },
    ],
  },

  // ─── Phase 35: officer-specific iconic events ──────────────
  {
    id: 'evt-lu-bu-halberd-shot',
    name: { en: 'Lü Bu Shoots the Halberd', zh: '轅門射戟' },
    yearMin: 195,
    yearMax: 197,
    requires: [
      { kind: 'officer-active', officerId: 'lu-bu' },
      { kind: 'officer-active', officerId: 'liu-bei' },
      { kind: 'officer-active', officerId: 'ji-ling' },
    ],
    description:
      'To stop a war between Liu Bei and Yuan Shu, Lü Bu plants his halberd 150 paces out and declares: "If I split the side blade, lay down arms." His arrow finds the mark. Both armies stand down.',
    effects: [
      { kind: 'officer-loyalty', officerId: 'lu-bu', delta: 10 },
    ],
  },
  {
    id: 'evt-guan-yu-five-passes',
    name: { en: "Past Five Passes, Six Generals", zh: '過五関斬六将' },
    yearMin: 200,
    yearMax: 201,
    requires: [
      { kind: 'officer-active', officerId: 'guan-yu' },
      { kind: 'officer-active', officerId: 'liu-bei' },
      { kind: 'flag-set', key: 'guan-yu-with-cao' },
    ],
    description:
      'Learning his brother lives, Guan Yu rides a thousand li to rejoin him. Five passes bar his way; six famed Wei commanders try to stop him. The Green Dragon Blade rises six times, and the road opens.',
    effects: [
      { kind: 'officer-loyalty', officerId: 'guan-yu', delta: 20 },
      { kind: 'flag', key: 'guan-yu-returned' },
    ],
  },
  {
    id: 'evt-zhang-fei-drunk',
    name: { en: 'Zhang Fei Loses Xuzhou', zh: '張飛、徐州を失う' },
    yearMin: 196,
    yearMax: 197,
    season: 'autumn',
    requires: [
      { kind: 'officer-active', officerId: 'zhang-fei' },
      { kind: 'officer-active', officerId: 'lu-bu' },
    ],
    description:
      'Liu Bei leaves Zhang Fei in charge of Xiapi and goes to fight Yuan Shu. Zhang Fei drinks. He beats Cao Bao the night before. Cao Bao opens the city gates to Lü Bu. Xuzhou falls in a single night.',
    effects: [
      { kind: 'officer-loyalty', officerId: 'zhang-fei', delta: -15 },
      { kind: 'city-loyalty', cityId: 'city-xiapi', delta: -30 },
    ],
  },
  {
    id: 'evt-cao-cao-wancheng',
    name: { en: 'Disaster at Wancheng', zh: '宛城の変' },
    yearMin: 197,
    yearMax: 197,
    requires: [
      { kind: 'officer-active', officerId: 'cao-cao' },
      { kind: 'officer-active', officerId: 'dian-wei' },
    ],
    description:
      'Cao Cao takes Zhang Xiu\'s aunt to his bed. Zhang Xiu, humiliated, mutinies in the night. Dian Wei dies guarding the gate so his lord may escape. Cao Ang, the eldest son, dies giving his father a horse. Cao Cao loses more at Wancheng than at any battle.',
    effects: [
      { kind: 'officer-status', officerId: 'dian-wei', status: 'dead' },
      { kind: 'officer-status', officerId: 'cao-ang', status: 'dead' },
      { kind: 'officer-loyalty', officerId: 'cao-cao', delta: -10 },
    ],
  },
  {
    id: 'evt-zhuge-borrows-wind',
    name: { en: 'Borrowing the East Wind', zh: '借東風' },
    yearMin: 208,
    yearMax: 209,
    season: 'winter',
    requires: [
      { kind: 'officer-active', officerId: 'zhuge-liang' },
      { kind: 'officer-active', officerId: 'zhou-yu' },
    ],
    description:
      'Atop the Seven-Star Altar at Nanping Hill, Zhuge Liang prays for three days and three nights. On the third the south-east wind rises against all season. Zhou Yu\'s fire ships scream into the chained fleet at Red Cliffs.',
    effects: [
      { kind: 'flag', key: 'east-wind-borrowed' },
    ],
  },
  {
    id: 'evt-guan-yu-flooded-armies',
    name: { en: 'Flooding the Seven Armies', zh: '水淹七軍' },
    yearMin: 219,
    yearMax: 219,
    season: 'autumn',
    requires: [
      { kind: 'officer-active', officerId: 'guan-yu' },
      { kind: 'officer-active', officerId: 'yu-jin' },
    ],
    description:
      'The Han river runs high. Guan Yu dams it upstream until Yu Jin\'s seven encamped armies drown in the night. Pang De refuses to surrender and is beheaded. Yu Jin bends the knee. All China shakes at Guan Yu\'s name.',
    effects: [
      { kind: 'officer-status', officerId: 'yu-jin', status: 'imprisoned' },
      { kind: 'officer-status', officerId: 'pang-de', status: 'dead' },
      { kind: 'flag', key: 'fan-castle-flooded' },
    ],
  },
];

export const EVENTS_BY_ID: Record<string, HistoricalEvent> = Object.fromEntries(
  HISTORICAL_EVENTS.map((e) => [e.id, e]),
);
