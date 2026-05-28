/**
 * Historical officers from dynasties OTHER than the Three Kingdoms.
 *
 * These are opt-in via per-dynasty toggles on the title screen — when
 * enabled, the matching officers join the scenario as 'unsearched' free
 * agents at the TKM city closest to their historical birthplace.
 *
 * Stats follow Koei conventions (LED/WAR/INT/POL/CHA, 0–100 each).
 * Birth years are intentionally fictionalised so each officer is 25–45 in
 * the 184 AD scenario — this is a fantasy crossover, not a historical sim.
 */
import type { Dynasty } from './dynasties';

export interface HistoricalOfficerTemplate {
  id: string;
  name: { en: string; zh: string };
  courtesyName?: { en: string; zh: string };
  birthYear: number;
  /** Mapped from historical birthplace to the closest TKM city. */
  hometownCityId: string;
  stats: {
    leadership: number;
    war: number;
    intelligence: number;
    politics: number;
    charisma: number;
  };
  dynasty: Dynasty;
  female?: boolean;
}

export const HISTORICAL_OFFICER_TEMPLATES: HistoricalOfficerTemplate[] = [
  // ─── 春秋 Spring & Autumn ────────────────────────────────────────
  { id: 'hist-sun-wu',     dynasty: 'spring-autumn', name: { en: 'Sun Wu',     zh: '孫武'   }, courtesyName: { en: 'Changqing', zh: '長卿' }, birthYear: 145, hometownCityId: 'linzi',     stats: { leadership: 95, war: 78, intelligence: 100, politics: 78, charisma: 88 } },
  { id: 'hist-wu-zixu',    dynasty: 'spring-autumn', name: { en: 'Wu Zixu',    zh: '伍子胥' }, courtesyName: { en: 'Zixu',       zh: '子胥' }, birthYear: 142, hometownCityId: 'wancheng',  stats: { leadership: 88, war: 90, intelligence: 88,  politics: 78, charisma: 80 } },
  { id: 'hist-guan-zhong', dynasty: 'spring-autumn', name: { en: 'Guan Zhong', zh: '管仲'   }, courtesyName: { en: 'Yiwu',       zh: '夷吾' }, birthYear: 138, hometownCityId: 'linzi',     stats: { leadership: 72, war: 50, intelligence: 95,  politics: 99, charisma: 88 } },
  { id: 'hist-bao-shuya',  dynasty: 'spring-autumn', name: { en: 'Bao Shuya',  zh: '鮑叔牙' },                                                  birthYear: 140, hometownCityId: 'linzi',     stats: { leadership: 60, war: 50, intelligence: 85,  politics: 90, charisma: 92 } },
  { id: 'hist-fan-li',     dynasty: 'spring-autumn', name: { en: 'Fan Li',     zh: '范蠡'   }, courtesyName: { en: 'Shaobo',     zh: '少伯' }, birthYear: 144, hometownCityId: 'wancheng',  stats: { leadership: 80, war: 70, intelligence: 95,  politics: 92, charisma: 88 } },
  { id: 'hist-wen-zhong',  dynasty: 'spring-autumn', name: { en: 'Wen Zhong',  zh: '文種'   }, courtesyName: { en: 'Ziqin',      zh: '子禽' }, birthYear: 145, hometownCityId: 'wancheng',  stats: { leadership: 65, war: 50, intelligence: 92,  politics: 88, charisma: 70 } },
  { id: 'hist-zi-chan',    dynasty: 'spring-autumn', name: { en: 'Zi Chan',    zh: '子產'   },                                                  birthYear: 138, hometownCityId: 'xuchang',   stats: { leadership: 60, war: 40, intelligence: 92,  politics: 95, charisma: 85 } },
  { id: 'hist-yan-ying',   dynasty: 'spring-autumn', name: { en: 'Yan Ying',   zh: '晏嬰'   }, courtesyName: { en: 'Pingzhong',  zh: '平仲' }, birthYear: 137, hometownCityId: 'linzi',     stats: { leadership: 50, war: 35, intelligence: 90,  politics: 95, charisma: 92 } },

  // ─── 戰國 Warring States ─────────────────────────────────────────
  { id: 'hist-sun-bin',    dynasty: 'warring-states', name: { en: 'Sun Bin',    zh: '孫臏'   },                                                 birthYear: 148, hometownCityId: 'linzi',    stats: { leadership: 90, war: 70, intelligence: 99,  politics: 75, charisma: 80 } },
  { id: 'hist-pang-juan',  dynasty: 'warring-states', name: { en: 'Pang Juan',  zh: '龐涓'   },                                                 birthYear: 149, hometownCityId: 'ye',       stats: { leadership: 85, war: 85, intelligence: 82,  politics: 65, charisma: 70 } },
  { id: 'hist-lian-po',    dynasty: 'warring-states', name: { en: 'Lian Po',    zh: '廉頗'   },                                                 birthYear: 146, hometownCityId: 'ye',       stats: { leadership: 92, war: 92, intelligence: 80,  politics: 65, charisma: 85 } },
  { id: 'hist-zhao-she',   dynasty: 'warring-states', name: { en: 'Zhao She',   zh: '趙奢'   },                                                 birthYear: 144, hometownCityId: 'ye',       stats: { leadership: 88, war: 88, intelligence: 85,  politics: 70, charisma: 78 } },
  { id: 'hist-li-mu',      dynasty: 'warring-states', name: { en: 'Li Mu',      zh: '李牧'   },                                                 birthYear: 152, hometownCityId: 'yanmen',   stats: { leadership: 95, war: 92, intelligence: 88,  politics: 72, charisma: 85 } },
  { id: 'hist-yue-yi',     dynasty: 'warring-states', name: { en: 'Yue Yi',     zh: '樂毅'   },                                                 birthYear: 147, hometownCityId: 'beiping',  stats: { leadership: 92, war: 85, intelligence: 92,  politics: 78, charisma: 88 } },
  { id: 'hist-tian-dan',   dynasty: 'warring-states', name: { en: 'Tian Dan',   zh: '田單'   },                                                 birthYear: 148, hometownCityId: 'linzi',    stats: { leadership: 88, war: 80, intelligence: 92,  politics: 75, charisma: 80 } },
  { id: 'hist-bai-qi',     dynasty: 'warring-states', name: { en: 'Bai Qi',     zh: '白起'   }, courtesyName: { en: 'Gongsun',    zh: '公孫' }, birthYear: 150, hometownCityId: 'mei',      stats: { leadership: 95, war: 96, intelligence: 90,  politics: 55, charisma: 72 } },
  { id: 'hist-wang-jian',  dynasty: 'warring-states', name: { en: 'Wang Jian',  zh: '王翦'   },                                                 birthYear: 142, hometownCityId: 'mei',      stats: { leadership: 95, war: 90, intelligence: 92,  politics: 85, charisma: 85 } },
  { id: 'hist-su-qin',     dynasty: 'warring-states', name: { en: 'Su Qin',     zh: '蘇秦'   }, courtesyName: { en: 'Jizi',       zh: '季子' }, birthYear: 152, hometownCityId: 'luoyang',  stats: { leadership: 50, war: 30, intelligence: 95,  politics: 88, charisma: 95 } },
  { id: 'hist-zhang-yi',   dynasty: 'warring-states', name: { en: 'Zhang Yi',   zh: '張儀'   },                                                 birthYear: 153, hometownCityId: 'luoyang',  stats: { leadership: 50, war: 30, intelligence: 96,  politics: 88, charisma: 95 } },
  { id: 'hist-shang-yang', dynasty: 'warring-states', name: { en: 'Shang Yang', zh: '商鞅'   }, courtesyName: { en: 'Gongsun',    zh: '公孫' }, birthYear: 144, hometownCityId: 'puyang',   stats: { leadership: 70, war: 60, intelligence: 95,  politics: 99, charisma: 65 } },

  // ─── 秦 Qin ──────────────────────────────────────────────────────
  { id: 'hist-meng-tian',  dynasty: 'qin', name: { en: 'Meng Tian',  zh: '蒙恬'   },                                                            birthYear: 150, hometownCityId: 'changan',  stats: { leadership: 92, war: 90, intelligence: 80,  politics: 75, charisma: 85 } },
  { id: 'hist-wang-ben',   dynasty: 'qin', name: { en: 'Wang Ben',   zh: '王賁'   },                                                            birthYear: 152, hometownCityId: 'mei',      stats: { leadership: 88, war: 88, intelligence: 80,  politics: 70, charisma: 80 } },
  { id: 'hist-zhang-han',  dynasty: 'qin', name: { en: 'Zhang Han',  zh: '章邯'   },                                                            birthYear: 148, hometownCityId: 'changan',  stats: { leadership: 85, war: 86, intelligence: 78,  politics: 65, charisma: 75 } },
  { id: 'hist-li-si',      dynasty: 'qin', name: { en: 'Li Si',      zh: '李斯'   },                                                            birthYear: 145, hometownCityId: 'wancheng', stats: { leadership: 60, war: 35, intelligence: 95,  politics: 95, charisma: 78 } },
  { id: 'hist-zhao-tuo',   dynasty: 'qin', name: { en: 'Zhao Tuo',   zh: '趙佗'   },                                                            birthYear: 152, hometownCityId: 'ye',       stats: { leadership: 80, war: 75, intelligence: 80,  politics: 85, charisma: 78 } },

  // ─── 楚漢 Chu-Han ────────────────────────────────────────────────
  { id: 'hist-xiang-yu',   dynasty: 'chu-han', name: { en: 'Xiang Yu',    zh: '項羽'   }, courtesyName: { en: 'Yu',         zh: '羽' },   birthYear: 159, hometownCityId: 'xiapi',    stats: { leadership: 96, war: 100, intelligence: 60, politics: 30, charisma: 90 } },
  { id: 'hist-han-xin',    dynasty: 'chu-han', name: { en: 'Han Xin',     zh: '韓信'   },                                                  birthYear: 158, hometownCityId: 'shouchun', stats: { leadership: 99, war: 88,  intelligence: 99, politics: 70, charisma: 78 } },
  { id: 'hist-zhang-liang',dynasty: 'chu-han', name: { en: 'Zhang Liang', zh: '張良'   }, courtesyName: { en: 'Zifang',     zh: '子房' }, birthYear: 155, hometownCityId: 'xuchang',  stats: { leadership: 60, war: 30,  intelligence: 100, politics: 90, charisma: 92 } },
  { id: 'hist-xiao-he',    dynasty: 'chu-han', name: { en: 'Xiao He',     zh: '蕭何'   },                                                  birthYear: 138, hometownCityId: 'xiaopei',  stats: { leadership: 60, war: 25,  intelligence: 92, politics: 99, charisma: 88 } },
  { id: 'hist-fan-zeng',   dynasty: 'chu-han', name: { en: 'Fan Zeng',    zh: '范增'   },                                                  birthYear: 135, hometownCityId: 'shouchun', stats: { leadership: 50, war: 25,  intelligence: 95, politics: 80, charisma: 70 } },
  { id: 'hist-ying-bu',    dynasty: 'chu-han', name: { en: 'Ying Bu',     zh: '英布'   },                                                  birthYear: 156, hometownCityId: 'shouchun', stats: { leadership: 88, war: 92,  intelligence: 60, politics: 50, charisma: 70 } },
  { id: 'hist-peng-yue',   dynasty: 'chu-han', name: { en: 'Peng Yue',    zh: '彭越'   },                                                  birthYear: 154, hometownCityId: 'puyang',   stats: { leadership: 88, war: 86,  intelligence: 78, politics: 60, charisma: 75 } },
  { id: 'hist-long-qu',    dynasty: 'chu-han', name: { en: 'Long Qu',     zh: '龍且'   },                                                  birthYear: 158, hometownCityId: 'wancheng', stats: { leadership: 80, war: 92,  intelligence: 50, politics: 40, charisma: 70 } },
  { id: 'hist-zhongli-mei',dynasty: 'chu-han', name: { en: 'Zhongli Mei', zh: '鐘離昧' },                                                  birthYear: 156, hometownCityId: 'xiapi',    stats: { leadership: 78, war: 88,  intelligence: 70, politics: 55, charisma: 72 } },
  { id: 'hist-ji-bu',      dynasty: 'chu-han', name: { en: 'Ji Bu',       zh: '季布'   },                                                  birthYear: 155, hometownCityId: 'wancheng', stats: { leadership: 80, war: 88,  intelligence: 70, politics: 60, charisma: 88 } },
  { id: 'hist-ji-xin',     dynasty: 'chu-han', name: { en: 'Ji Xin',      zh: '紀信'   },                                                  birthYear: 152, hometownCityId: 'ye',       stats: { leadership: 70, war: 80,  intelligence: 65, politics: 50, charisma: 92 } },
  { id: 'hist-chen-ping',  dynasty: 'chu-han', name: { en: 'Chen Ping',   zh: '陳平'   },                                                  birthYear: 148, hometownCityId: 'puyang',   stats: { leadership: 60, war: 40,  intelligence: 95, politics: 88, charisma: 82 } },

  // ─── 西漢 Western Han ────────────────────────────────────────────
  { id: 'hist-wei-qing',   dynasty: 'western-han', name: { en: 'Wei Qing',     zh: '衛青'   }, courtesyName: { en: 'Zhongqing', zh: '仲卿' }, birthYear: 156, hometownCityId: 'taiyuan', stats: { leadership: 95, war: 92, intelligence: 88, politics: 75, charisma: 85 } },
  { id: 'hist-huo-qubing', dynasty: 'western-han', name: { en: 'Huo Qubing',   zh: '霍去病' },                                                 birthYear: 165, hometownCityId: 'taiyuan', stats: { leadership: 96, war: 96, intelligence: 85, politics: 60, charisma: 85 } },
  { id: 'hist-li-guang',   dynasty: 'western-han', name: { en: 'Li Guang',     zh: '李廣'   },                                                 birthYear: 144, hometownCityId: 'longxi',  stats: { leadership: 90, war: 95, intelligence: 75, politics: 60, charisma: 88 } },
  { id: 'hist-zhou-yafu',  dynasty: 'western-han', name: { en: 'Zhou Yafu',    zh: '周亞夫' },                                                 birthYear: 142, hometownCityId: 'xiaopei', stats: { leadership: 92, war: 85, intelligence: 85, politics: 70, charisma: 78 } },
  { id: 'hist-chen-tang',  dynasty: 'western-han', name: { en: 'Chen Tang',    zh: '陳湯'   }, courtesyName: { en: 'Ziqi',     zh: '子奇' }, birthYear: 152, hometownCityId: 'puyang',  stats: { leadership: 88, war: 85, intelligence: 90, politics: 70, charisma: 75 } },
  { id: 'hist-zhao-chongguo', dynasty: 'western-han', name: { en: 'Zhao Chongguo', zh: '趙充國' },                                            birthYear: 138, hometownCityId: 'longxi',  stats: { leadership: 92, war: 85, intelligence: 90, politics: 80, charisma: 78 } },
  { id: 'hist-zhufu-yan',  dynasty: 'western-han', name: { en: 'Zhufu Yan',    zh: '主父偃' },                                                 birthYear: 150, hometownCityId: 'linzi',   stats: { leadership: 50, war: 30, intelligence: 90, politics: 92, charisma: 70 } },
  { id: 'hist-dong-zhongshu', dynasty: 'western-han', name: { en: 'Dong Zhongshu', zh: '董仲舒' },                                            birthYear: 140, hometownCityId: 'ye',      stats: { leadership: 30, war: 20, intelligence: 95, politics: 90, charisma: 80 } },
  { id: 'hist-ban-chao',   dynasty: 'western-han', name: { en: 'Ban Chao',     zh: '班超'   }, courtesyName: { en: 'Zhongsheng', zh: '仲升' }, birthYear: 155, hometownCityId: 'changan', stats: { leadership: 92, war: 80, intelligence: 90, politics: 85, charisma: 90 } },
  { id: 'hist-ma-yuan',    dynasty: 'western-han', name: { en: 'Ma Yuan',      zh: '馬援'   }, courtesyName: { en: 'Wenyuan',   zh: '文淵' }, birthYear: 140, hometownCityId: 'changan', stats: { leadership: 90, war: 88, intelligence: 85, politics: 80, charisma: 85 } },

  // ─── 兩晉 Jin ────────────────────────────────────────────────────
  { id: 'hist-du-yu',      dynasty: 'jin', name: { en: 'Du Yu',     zh: '杜預' }, courtesyName: { en: 'Yuankai',   zh: '元凱' }, birthYear: 148, hometownCityId: 'changan',  stats: { leadership: 90, war: 80, intelligence: 92, politics: 88, charisma: 80 } },
  { id: 'hist-wang-jun',   dynasty: 'jin', name: { en: 'Wang Jun',  zh: '王濬' }, courtesyName: { en: 'Shizhi',    zh: '士治' }, birthYear: 146, hometownCityId: 'luoyang',  stats: { leadership: 88, war: 80, intelligence: 82, politics: 70, charisma: 75 } },
  { id: 'hist-wang-dao',   dynasty: 'jin', name: { en: 'Wang Dao',  zh: '王導' }, courtesyName: { en: 'Maohong',   zh: '茂弘' }, birthYear: 144, hometownCityId: 'langya',   stats: { leadership: 60, war: 40, intelligence: 92, politics: 95, charisma: 90 } },
  { id: 'hist-xie-an',     dynasty: 'jin', name: { en: 'Xie An',    zh: '謝安' }, courtesyName: { en: 'Anshi',     zh: '安石' }, birthYear: 142, hometownCityId: 'xuchang',  stats: { leadership: 80, war: 50, intelligence: 95, politics: 95, charisma: 95 } },
  { id: 'hist-xie-xuan',   dynasty: 'jin', name: { en: 'Xie Xuan',  zh: '謝玄' }, courtesyName: { en: 'Youdu',     zh: '幼度' }, birthYear: 156, hometownCityId: 'xuchang',  stats: { leadership: 92, war: 85, intelligence: 88, politics: 78, charisma: 85 } },
  { id: 'hist-huan-wen',   dynasty: 'jin', name: { en: 'Huan Wen',  zh: '桓溫' }, courtesyName: { en: 'Yuanzi',    zh: '元子' }, birthYear: 148, hometownCityId: 'xiaopei',  stats: { leadership: 88, war: 82, intelligence: 85, politics: 80, charisma: 78 } },
  { id: 'hist-zu-ti',      dynasty: 'jin', name: { en: 'Zu Ti',     zh: '祖逖' }, courtesyName: { en: 'Shizhi',    zh: '士稚' }, birthYear: 150, hometownCityId: 'beiping',  stats: { leadership: 90, war: 85, intelligence: 82, politics: 75, charisma: 88 } },

  // ─── 南北朝 Southern & Northern ───────────────────────────────────
  { id: 'hist-lanlingwang',dynasty: 'southern-northern', name: { en: 'Lanlingwang', zh: '蘭陵王' }, courtesyName: { en: 'Changgong', zh: '長恭' }, birthYear: 162, hometownCityId: 'ye',       stats: { leadership: 88, war: 92, intelligence: 80, politics: 70, charisma: 95 } },
  { id: 'hist-gao-huan',   dynasty: 'southern-northern', name: { en: 'Gao Huan',    zh: '高歡'   }, courtesyName: { en: 'Heliuhun',  zh: '賀六渾' }, birthYear: 144, hometownCityId: 'ye',       stats: { leadership: 92, war: 85, intelligence: 88, politics: 82, charisma: 85 } },
  { id: 'hist-yuwen-tai',  dynasty: 'southern-northern', name: { en: 'Yuwen Tai',   zh: '宇文泰' }, courtesyName: { en: 'Heita',      zh: '黑獺' }, birthYear: 146, hometownCityId: 'changan',  stats: { leadership: 92, war: 85, intelligence: 90, politics: 88, charisma: 85 } },
  { id: 'hist-murong-chui',dynasty: 'southern-northern', name: { en: 'Murong Chui', zh: '慕容垂' }, courtesyName: { en: 'Daoming',    zh: '道明' }, birthYear: 142, hometownCityId: 'liaodong', stats: { leadership: 95, war: 92, intelligence: 90, politics: 80, charisma: 85 } },
  { id: 'hist-tuoba-gui',  dynasty: 'southern-northern', name: { en: 'Tuoba Gui',   zh: '拓跋珪' }, courtesyName: { en: 'Sheguai',    zh: '涉珪' }, birthYear: 156, hometownCityId: 'yanmen',   stats: { leadership: 90, war: 88, intelligence: 85, politics: 82, charisma: 85 } },
  { id: 'hist-wei-xiaokuan',dynasty: 'southern-northern', name: { en: 'Wei Xiaokuan',zh: '韋孝寬' },                                                 birthYear: 148, hometownCityId: 'changan',  stats: { leadership: 92, war: 80, intelligence: 95, politics: 80, charisma: 80 } },
  { id: 'hist-chen-qingzhi',dynasty: 'southern-northern', name: { en: 'Chen Qingzhi',zh: '陳慶之' }, courtesyName: { en: 'Ziyun',      zh: '子雲' }, birthYear: 150, hometownCityId: 'wuxi',     stats: { leadership: 95, war: 80, intelligence: 92, politics: 70, charisma: 90 } },
  { id: 'hist-wang-meng',  dynasty: 'southern-northern', name: { en: 'Wang Meng',   zh: '王猛'   }, courtesyName: { en: 'Jinglue',    zh: '景略' }, birthYear: 140, hometownCityId: 'beihai',   stats: { leadership: 88, war: 70, intelligence: 96, politics: 95, charisma: 85 } },

  // ─── 隋 Sui ──────────────────────────────────────────────────────
  { id: 'hist-yang-su',    dynasty: 'sui', name: { en: 'Yang Su',     zh: '楊素'   }, courtesyName: { en: 'Chudao',  zh: '處道' }, birthYear: 146, hometownCityId: 'luoyang',  stats: { leadership: 92, war: 85, intelligence: 92, politics: 82, charisma: 80 } },
  { id: 'hist-han-qinhu',  dynasty: 'sui', name: { en: 'Han Qinhu',   zh: '韓擒虎' }, courtesyName: { en: 'Zitong',  zh: '子通' }, birthYear: 150, hometownCityId: 'luoyang',  stats: { leadership: 88, war: 90, intelligence: 80, politics: 70, charisma: 78 } },
  { id: 'hist-he-ruobi',   dynasty: 'sui', name: { en: 'He Ruobi',    zh: '賀若弼' }, courtesyName: { en: 'Fuwei',   zh: '輔伯' }, birthYear: 152, hometownCityId: 'luoyang',  stats: { leadership: 88, war: 85, intelligence: 82, politics: 70, charisma: 75 } },
  { id: 'hist-shi-wansui', dynasty: 'sui', name: { en: 'Shi Wansui',  zh: '史萬歲' },                                                birthYear: 154, hometownCityId: 'changan',  stats: { leadership: 85, war: 90, intelligence: 75, politics: 65, charisma: 75 } },
  { id: 'hist-mai-tiezhang',dynasty: 'sui', name: { en: 'Mai Tiezhang', zh: '麥鐵杖' },                                              birthYear: 158, hometownCityId: 'guiyang',  stats: { leadership: 78, war: 92, intelligence: 55, politics: 45, charisma: 70 } },
  { id: 'hist-lai-huer',   dynasty: 'sui', name: { en: 'Lai Huer',    zh: '來護兒' }, courtesyName: { en: 'Chongshan',zh: '崇善' }, birthYear: 152, hometownCityId: 'guangling',stats: { leadership: 85, war: 85, intelligence: 75, politics: 65, charisma: 75 } },

  // ─── 唐 Tang ─────────────────────────────────────────────────────
  { id: 'hist-li-jing',    dynasty: 'tang', name: { en: 'Li Jing',     zh: '李靖'   }, courtesyName: { en: 'Yaoshi',  zh: '藥師' }, birthYear: 144, hometownCityId: 'changan',  stats: { leadership: 99, war: 88, intelligence: 96, politics: 82, charisma: 88 } },
  { id: 'hist-li-ji',      dynasty: 'tang', name: { en: 'Li Ji',       zh: '李勣'   }, courtesyName: { en: 'Maogong', zh: '懋功' }, birthYear: 148, hometownCityId: 'puyang',   stats: { leadership: 92, war: 85, intelligence: 88, politics: 85, charisma: 85 } },
  { id: 'hist-qin-qiong',  dynasty: 'tang', name: { en: 'Qin Qiong',   zh: '秦瓊'   }, courtesyName: { en: 'Shubao',  zh: '叔寶' }, birthYear: 150, hometownCityId: 'linzi',    stats: { leadership: 88, war: 95, intelligence: 78, politics: 65, charisma: 88 } },
  { id: 'hist-yuchi-gong', dynasty: 'tang', name: { en: 'Yuchi Gong',  zh: '尉遲恭' }, courtesyName: { en: 'Jingde',  zh: '敬德' }, birthYear: 152, hometownCityId: 'shuofang', stats: { leadership: 88, war: 96, intelligence: 72, politics: 65, charisma: 88 } },
  { id: 'hist-cheng-yaojin',dynasty: 'tang', name: { en: 'Cheng Yaojin',zh: '程咬金' }, courtesyName: { en: 'Zhijie',  zh: '知節' }, birthYear: 154, hometownCityId: 'puyang',   stats: { leadership: 80, war: 88, intelligence: 65, politics: 60, charisma: 92 } },
  { id: 'hist-luo-cheng',  dynasty: 'tang', name: { en: 'Luo Cheng',   zh: '羅成'   },                                                birthYear: 160, hometownCityId: 'beiping',  stats: { leadership: 85, war: 92, intelligence: 80, politics: 65, charisma: 85 } },
  { id: 'hist-su-dingfang',dynasty: 'tang', name: { en: 'Su Dingfang', zh: '蘇定方' }, courtesyName: { en: 'Lie',     zh: '烈' }, birthYear: 148, hometownCityId: 'ye',       stats: { leadership: 92, war: 90, intelligence: 85, politics: 75, charisma: 80 } },
  { id: 'hist-xue-rengui', dynasty: 'tang', name: { en: 'Xue Rengui',  zh: '薛仁貴' }, courtesyName: { en: 'Rengui',  zh: '仁貴' }, birthYear: 154, hometownCityId: 'taiyuan',  stats: { leadership: 92, war: 95, intelligence: 80, politics: 68, charisma: 88 } },
  { id: 'hist-guo-ziyi',   dynasty: 'tang', name: { en: 'Guo Ziyi',    zh: '郭子儀' }, courtesyName: { en: 'Ziyi',    zh: '子儀' }, birthYear: 140, hometownCityId: 'changan',  stats: { leadership: 95, war: 88, intelligence: 92, politics: 92, charisma: 95 } },
  { id: 'hist-li-guangbi', dynasty: 'tang', name: { en: 'Li Guangbi',  zh: '李光弼' },                                                birthYear: 146, hometownCityId: 'liaodong', stats: { leadership: 92, war: 85, intelligence: 92, politics: 78, charisma: 80 } },
  { id: 'hist-gao-xianzhi',dynasty: 'tang', name: { en: 'Gao Xianzhi', zh: '高仙芝' },                                                birthYear: 150, hometownCityId: 'liaodong', stats: { leadership: 92, war: 85, intelligence: 85, politics: 70, charisma: 78 } },
  { id: 'hist-geshu-han',  dynasty: 'tang', name: { en: 'Geshu Han',   zh: '哥舒翰' },                                                birthYear: 148, hometownCityId: 'dunhuang', stats: { leadership: 88, war: 88, intelligence: 80, politics: 65, charisma: 78 } },
  { id: 'hist-fang-xuanling',dynasty: 'tang', name: { en: 'Fang Xuanling', zh: '房玄齡' }, courtesyName: { en: 'Qiao', zh: '喬' }, birthYear: 138, hometownCityId: 'linzi',    stats: { leadership: 60, war: 30, intelligence: 95, politics: 95, charisma: 88 } },
  { id: 'hist-du-ruhui',   dynasty: 'tang', name: { en: 'Du Ruhui',    zh: '杜如晦' }, courtesyName: { en: 'Keming',  zh: '克明' }, birthYear: 142, hometownCityId: 'changan',  stats: { leadership: 60, war: 40, intelligence: 95, politics: 92, charisma: 85 } },
  { id: 'hist-wei-zheng',  dynasty: 'tang', name: { en: 'Wei Zheng',   zh: '魏徵'   }, courtesyName: { en: 'Xuancheng',zh: '玄成' }, birthYear: 138, hometownCityId: 'ye',       stats: { leadership: 50, war: 30, intelligence: 92, politics: 95, charisma: 90 } },
  { id: 'hist-di-renjie',  dynasty: 'tang', name: { en: 'Di Renjie',   zh: '狄仁傑' }, courtesyName: { en: 'Huaiying',zh: '懷英' }, birthYear: 144, hometownCityId: 'taiyuan',  stats: { leadership: 70, war: 35, intelligence: 95, politics: 95, charisma: 92 } },

  // ─── 五代 Five Dynasties ─────────────────────────────────────────
  { id: 'hist-li-cunxiao', dynasty: 'five-dynasties', name: { en: 'Li Cunxiao',   zh: '李存孝' },                                                  birthYear: 162, hometownCityId: 'yanmen',  stats: { leadership: 88, war: 99, intelligence: 70, politics: 50, charisma: 80 } },
  { id: 'hist-zhou-dewei', dynasty: 'five-dynasties', name: { en: 'Zhou Dewei',   zh: '周德威' }, courtesyName: { en: 'Zhenyuan', zh: '鎮遠' }, birthYear: 148, hometownCityId: 'yanmen',  stats: { leadership: 92, war: 88, intelligence: 82, politics: 70, charisma: 78 } },
  { id: 'hist-wang-yanzhang',dynasty: 'five-dynasties', name: { en: 'Wang Yanzhang', zh: '王彥章' }, courtesyName: { en: 'Xianming', zh: '賢明' }, birthYear: 150, hometownCityId: 'puyang',  stats: { leadership: 85, war: 95, intelligence: 70, politics: 60, charisma: 75 } },
  { id: 'hist-ge-congzhou',dynasty: 'five-dynasties', name: { en: 'Ge Congzhou',  zh: '葛從周' }, courtesyName: { en: 'Tongmei', zh: '通美' }, birthYear: 148, hometownCityId: 'puyang',  stats: { leadership: 88, war: 85, intelligence: 80, politics: 70, charisma: 75 } },
  { id: 'hist-chai-rong',  dynasty: 'five-dynasties', name: { en: 'Chai Rong',    zh: '柴榮'   },                                                  birthYear: 144, hometownCityId: 'ye',       stats: { leadership: 92, war: 85, intelligence: 90, politics: 92, charisma: 92 } },
  { id: 'hist-gao-huaide', dynasty: 'five-dynasties', name: { en: 'Gao Huaide',   zh: '高懷德' }, courtesyName: { en: 'Cangqi', zh: '藏器' }, birthYear: 150, hometownCityId: 'ye',       stats: { leadership: 85, war: 88, intelligence: 78, politics: 75, charisma: 80 } },

  // ─── 宋 Song ─────────────────────────────────────────────────────
  { id: 'hist-zhao-kuangyin',dynasty: 'song', name: { en: 'Zhao Kuangyin', zh: '趙匡胤' }, courtesyName: { en: 'Yuanlang', zh: '元朗' }, birthYear: 145, hometownCityId: 'beiping',  stats: { leadership: 92, war: 90, intelligence: 88, politics: 88, charisma: 92 } },
  { id: 'hist-cao-bin',    dynasty: 'song', name: { en: 'Cao Bin',     zh: '曹彬'   }, courtesyName: { en: 'Guohua', zh: '國華' }, birthYear: 142, hometownCityId: 'ye',       stats: { leadership: 90, war: 82, intelligence: 88, politics: 85, charisma: 88 } },
  { id: 'hist-pan-mei',    dynasty: 'song', name: { en: 'Pan Mei',     zh: '潘美'   }, courtesyName: { en: 'Zhongxun', zh: '仲詢' }, birthYear: 146, hometownCityId: 'ye',       stats: { leadership: 85, war: 80, intelligence: 82, politics: 78, charisma: 75 } },
  { id: 'hist-yang-ye',    dynasty: 'song', name: { en: 'Yang Ye',     zh: '楊業'   },                                              birthYear: 146, hometownCityId: 'shuofang', stats: { leadership: 90, war: 92, intelligence: 78, politics: 70, charisma: 88 } },
  { id: 'hist-yang-yanzhao',dynasty: 'song', name: { en: 'Yang Yanzhao',zh: '楊延昭' },                                              birthYear: 158, hometownCityId: 'shuofang', stats: { leadership: 88, war: 90, intelligence: 80, politics: 70, charisma: 85 } },
  { id: 'hist-di-qing',    dynasty: 'song', name: { en: 'Di Qing',     zh: '狄青'   }, courtesyName: { en: 'Hanchen', zh: '漢臣' }, birthYear: 150, hometownCityId: 'taiyuan',  stats: { leadership: 92, war: 92, intelligence: 85, politics: 70, charisma: 88 } },
  { id: 'hist-zong-ze',    dynasty: 'song', name: { en: 'Zong Ze',     zh: '宗澤'   }, courtesyName: { en: 'Ruling', zh: '汝霖' }, birthYear: 140, hometownCityId: 'kuaiji',   stats: { leadership: 88, war: 78, intelligence: 85, politics: 85, charisma: 90 } },
  { id: 'hist-yue-fei',    dynasty: 'song', name: { en: 'Yue Fei',     zh: '岳飛'   }, courtesyName: { en: 'Pengju', zh: '鵬舉' }, birthYear: 154, hometownCityId: 'ye',       stats: { leadership: 99, war: 99, intelligence: 92, politics: 75, charisma: 95 } },
  { id: 'hist-han-shizhong',dynasty: 'song', name: { en: 'Han Shizhong',zh: '韓世忠' }, courtesyName: { en: 'Liangchen', zh: '良臣' }, birthYear: 150, hometownCityId: 'changan', stats: { leadership: 92, war: 92, intelligence: 80, politics: 75, charisma: 85 } },
  { id: 'hist-liu-qi',     dynasty: 'song', name: { en: 'Liu Qi',      zh: '劉錡'   }, courtesyName: { en: 'Xinshu', zh: '信叔' }, birthYear: 152, hometownCityId: 'tianshui', stats: { leadership: 92, war: 88, intelligence: 85, politics: 70, charisma: 78 } },
  { id: 'hist-wu-jie',     dynasty: 'song', name: { en: 'Wu Jie',      zh: '吳玠'   }, courtesyName: { en: 'Jinqing', zh: '晉卿' }, birthYear: 152, hometownCityId: 'tianshui', stats: { leadership: 90, war: 85, intelligence: 85, politics: 75, charisma: 78 } },
  { id: 'hist-yu-yunwen',  dynasty: 'song', name: { en: 'Yu Yunwen',   zh: '虞允文' }, courtesyName: { en: 'Binfu',  zh: '彬甫' }, birthYear: 146, hometownCityId: 'chengdu',  stats: { leadership: 92, war: 70, intelligence: 92, politics: 88, charisma: 88 } },
  { id: 'hist-meng-gong',  dynasty: 'song', name: { en: 'Meng Gong',   zh: '孟珙'   }, courtesyName: { en: 'Pushan', zh: '璞玉' }, birthYear: 152, hometownCityId: 'wancheng', stats: { leadership: 90, war: 85, intelligence: 88, politics: 78, charisma: 80 } },
  { id: 'hist-fan-zhongyan',dynasty: 'song', name: { en: 'Fan Zhongyan',zh: '范仲淹' }, courtesyName: { en: 'Xiwen', zh: '希文' }, birthYear: 138, hometownCityId: 'wuxi',     stats: { leadership: 78, war: 60, intelligence: 92, politics: 95, charisma: 92 } },
  { id: 'hist-bao-zheng',  dynasty: 'song', name: { en: 'Bao Zheng',   zh: '包拯'   }, courtesyName: { en: 'Xiren', zh: '希仁' }, birthYear: 138, hometownCityId: 'hefei',    stats: { leadership: 50, war: 30, intelligence: 92, politics: 99, charisma: 95 } },
  { id: 'hist-wen-tianxiang',dynasty: 'song', name: { en: 'Wen Tianxiang', zh: '文天祥' }, courtesyName: { en: 'Songrui', zh: '宋瑞' }, birthYear: 154, hometownCityId: 'luling',   stats: { leadership: 80, war: 60, intelligence: 90, politics: 88, charisma: 99 } },

  // ─── 元 Yuan ─────────────────────────────────────────────────────
  { id: 'hist-muqali',     dynasty: 'yuan', name: { en: 'Muqali',     zh: '木華黎' },                                              birthYear: 144, hometownCityId: 'wuhuan',  stats: { leadership: 95, war: 92, intelligence: 85, politics: 78, charisma: 85 } },
  { id: 'hist-subutai',    dynasty: 'yuan', name: { en: 'Subutai',    zh: '速不台' },                                              birthYear: 148, hometownCityId: 'wuhuan',  stats: { leadership: 95, war: 92, intelligence: 95, politics: 75, charisma: 80 } },
  { id: 'hist-jebe',       dynasty: 'yuan', name: { en: 'Jebe',       zh: '哲別'   },                                              birthYear: 146, hometownCityId: 'wuhuan',  stats: { leadership: 90, war: 95, intelligence: 82, politics: 65, charisma: 80 } },
  { id: 'hist-tolui',      dynasty: 'yuan', name: { en: 'Tolui',      zh: '拖雷'   },                                              birthYear: 158, hometownCityId: 'wuhuan',  stats: { leadership: 90, war: 90, intelligence: 85, politics: 75, charisma: 82 } },
  { id: 'hist-bayan',      dynasty: 'yuan', name: { en: 'Bayan',      zh: '伯顏'   },                                              birthYear: 148, hometownCityId: 'wuhuan',  stats: { leadership: 92, war: 88, intelligence: 90, politics: 82, charisma: 80 } },
  { id: 'hist-shi-tianze', dynasty: 'yuan', name: { en: 'Shi Tianze', zh: '史天澤' }, courtesyName: { en: 'Runfu', zh: '潤甫' }, birthYear: 146, hometownCityId: 'beiping', stats: { leadership: 88, war: 80, intelligence: 85, politics: 80, charisma: 78 } },

  // ─── 明 Ming ─────────────────────────────────────────────────────
  { id: 'hist-zhu-yuanzhang',dynasty: 'ming', name: { en: 'Zhu Yuanzhang', zh: '朱元璋' }, courtesyName: { en: 'Guorui', zh: '國瑞' }, birthYear: 142, hometownCityId: 'shouchun', stats: { leadership: 92, war: 80, intelligence: 92, politics: 92, charisma: 92 } },
  { id: 'hist-xu-da',      dynasty: 'ming', name: { en: 'Xu Da',         zh: '徐達'   }, courtesyName: { en: 'Tiande', zh: '天德' }, birthYear: 146, hometownCityId: 'shouchun', stats: { leadership: 95, war: 92, intelligence: 88, politics: 82, charisma: 88 } },
  { id: 'hist-chang-yuchun',dynasty: 'ming', name: { en: 'Chang Yuchun', zh: '常遇春' }, courtesyName: { en: 'Boren',  zh: '伯仁' }, birthYear: 152, hometownCityId: 'shouchun', stats: { leadership: 90, war: 96, intelligence: 78, politics: 65, charisma: 85 } },
  { id: 'hist-li-wenzhong',dynasty: 'ming', name: { en: 'Li Wenzhong',  zh: '李文忠' }, courtesyName: { en: 'Sigong', zh: '思本' }, birthYear: 156, hometownCityId: 'shouchun', stats: { leadership: 88, war: 85, intelligence: 82, politics: 75, charisma: 80 } },
  { id: 'hist-feng-sheng', dynasty: 'ming', name: { en: 'Feng Sheng',   zh: '馮勝'   },                                              birthYear: 148, hometownCityId: 'shouchun', stats: { leadership: 88, war: 85, intelligence: 82, politics: 72, charisma: 78 } },
  { id: 'hist-mu-ying',    dynasty: 'ming', name: { en: 'Mu Ying',      zh: '沐英'   }, courtesyName: { en: 'Wenying',zh: '文英' }, birthYear: 158, hometownCityId: 'shouchun', stats: { leadership: 88, war: 85, intelligence: 82, politics: 80, charisma: 82 } },
  { id: 'hist-qi-jiguang', dynasty: 'ming', name: { en: 'Qi Jiguang',   zh: '戚繼光' }, courtesyName: { en: 'Yuanjing', zh: '元敬' }, birthYear: 148, hometownCityId: 'beihai',  stats: { leadership: 95, war: 88, intelligence: 95, politics: 82, charisma: 90 } },
  { id: 'hist-yu-dayou',   dynasty: 'ming', name: { en: 'Yu Dayou',     zh: '俞大猷' }, courtesyName: { en: 'Zhifu',  zh: '志輔' }, birthYear: 142, hometownCityId: 'kuaiji',   stats: { leadership: 92, war: 92, intelligence: 88, politics: 75, charisma: 80 } },
  { id: 'hist-li-chengliang',dynasty: 'ming', name: { en: 'Li Chengliang', zh: '李成梁' }, courtesyName: { en: 'Ruqi', zh: '汝契' }, birthYear: 146, hometownCityId: 'liaodong', stats: { leadership: 90, war: 85, intelligence: 82, politics: 75, charisma: 78 } },
  { id: 'hist-yuan-chonghuan',dynasty: 'ming', name: { en: 'Yuan Chonghuan', zh: '袁崇煥' }, courtesyName: { en: 'Yuansu', zh: '元素' }, birthYear: 150, hometownCityId: 'guangling',stats: { leadership: 92, war: 80, intelligence: 92, politics: 75, charisma: 88 } },
  { id: 'hist-lu-xiangsheng',dynasty: 'ming', name: { en: 'Lu Xiangsheng',  zh: '盧象昇' }, courtesyName: { en: 'Jianyuan',zh: '建鬥' }, birthYear: 152, hometownCityId: 'wuxi',     stats: { leadership: 90, war: 88, intelligence: 85, politics: 78, charisma: 88 } },
  { id: 'hist-zheng-chenggong',dynasty: 'ming', name: { en: 'Zheng Chenggong', zh: '鄭成功' }, courtesyName: { en: 'Mingyan', zh: '明儼' }, birthYear: 154, hometownCityId: 'cangwu',   stats: { leadership: 92, war: 85, intelligence: 88, politics: 80, charisma: 92 } },
  { id: 'hist-wang-shouren',dynasty: 'ming', name: { en: 'Wang Shouren',  zh: '王守仁' }, courtesyName: { en: 'Boan',   zh: '伯安' }, birthYear: 142, hometownCityId: 'kuaiji',   stats: { leadership: 88, war: 75, intelligence: 99, politics: 92, charisma: 92 } },
  { id: 'hist-yu-qian',    dynasty: 'ming', name: { en: 'Yu Qian',       zh: '于謙'   }, courtesyName: { en: 'Tingyi', zh: '廷益' }, birthYear: 144, hometownCityId: 'kuaiji',   stats: { leadership: 88, war: 70, intelligence: 92, politics: 92, charisma: 92 } },

  // ─── 清 Qing ─────────────────────────────────────────────────────
  { id: 'hist-dorgon',     dynasty: 'qing', name: { en: 'Dorgon',     zh: '多爾袞' },                                              birthYear: 154, hometownCityId: 'liaodong', stats: { leadership: 92, war: 88, intelligence: 92, politics: 88, charisma: 85 } },
  { id: 'hist-dodo',       dynasty: 'qing', name: { en: 'Dodo',       zh: '多鐸'   },                                              birthYear: 158, hometownCityId: 'liaodong', stats: { leadership: 88, war: 90, intelligence: 80, politics: 70, charisma: 80 } },
  { id: 'hist-ajige',      dynasty: 'qing', name: { en: 'Ajige',      zh: '阿濟格' },                                              birthYear: 152, hometownCityId: 'liaodong', stats: { leadership: 85, war: 90, intelligence: 72, politics: 60, charisma: 75 } },
  { id: 'hist-oboi',       dynasty: 'qing', name: { en: 'Oboi',       zh: '鰲拜'   },                                              birthYear: 150, hometownCityId: 'liaodong', stats: { leadership: 80, war: 92, intelligence: 70, politics: 60, charisma: 75 } },
  { id: 'hist-shi-lang',   dynasty: 'qing', name: { en: 'Shi Lang',   zh: '施琅'   }, courtesyName: { en: 'Zunhou',  zh: '尊侯' }, birthYear: 146, hometownCityId: 'kuaiji',   stats: { leadership: 88, war: 85, intelligence: 85, politics: 75, charisma: 78 } },
  { id: 'hist-zhou-peigong',dynasty: 'qing', name: { en: 'Zhou Peigong', zh: '周培公' },                                            birthYear: 148, hometownCityId: 'wancheng', stats: { leadership: 80, war: 65, intelligence: 92, politics: 85, charisma: 80 } },
  { id: 'hist-nian-gengyao',dynasty: 'qing', name: { en: 'Nian Gengyao', zh: '年羹堯' }, courtesyName: { en: 'Liangchen', zh: '亮工' }, birthYear: 150, hometownCityId: 'mei',      stats: { leadership: 88, war: 82, intelligence: 85, politics: 80, charisma: 75 } },
  { id: 'hist-zuo-zongtang',dynasty: 'qing', name: { en: 'Zuo Zongtang', zh: '左宗棠' }, courtesyName: { en: 'Jigao',  zh: '季高' }, birthYear: 144, hometownCityId: 'changsha', stats: { leadership: 92, war: 78, intelligence: 92, politics: 88, charisma: 88 } },
  { id: 'hist-zeng-guofan',dynasty: 'qing', name: { en: 'Zeng Guofan', zh: '曾國藩' }, courtesyName: { en: 'Bohan',  zh: '伯涵' }, birthYear: 140, hometownCityId: 'changsha', stats: { leadership: 88, war: 70, intelligence: 92, politics: 92, charisma: 90 } },
  { id: 'hist-lin-zexu',   dynasty: 'qing', name: { en: 'Lin Zexu',   zh: '林則徐' }, courtesyName: { en: 'Yuanfu', zh: '元撫' }, birthYear: 138, hometownCityId: 'cangwu',   stats: { leadership: 75, war: 50, intelligence: 92, politics: 92, charisma: 92 } },
];

export const HISTORICAL_OFFICER_IDS = HISTORICAL_OFFICER_TEMPLATES.map((t) => t.id);
