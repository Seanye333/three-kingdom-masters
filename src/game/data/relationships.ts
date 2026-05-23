import type { EntityId } from '../types';

/**
 * Inter-officer relationships beyond marriage/family. Used by event
 * triggers and (in future) AI defection logic.
 */
export type RelationshipKind =
  | 'sworn-brothers'   // Peach Garden Oath, etc.
  | 'rival'            // Lifelong rivals
  | 'mentor-student'   // Master / apprentice
  | 'master-servant'   // Lord / sworn follower
  | 'romantic'         // Romantic interest (NOT spouse — that's family)
  | 'enemy';           // Personal feud

export interface OfficerRelationship {
  a: EntityId;
  b: EntityId;
  kind: RelationshipKind;
  /** +description text shown in encyclopedia / hover. */
  note: { zh: string; en: string };
}

export const OFFICER_RELATIONSHIPS: OfficerRelationship[] = [
  // Sworn brothers
  { a: 'liu-bei',     b: 'guan-yu',     kind: 'sworn-brothers',
    note: { zh: '桃園の誓い', en: 'Peach Garden Oath' } },
  { a: 'liu-bei',     b: 'zhang-fei',   kind: 'sworn-brothers',
    note: { zh: '桃園の誓い', en: 'Peach Garden Oath' } },
  { a: 'guan-yu',     b: 'zhang-fei',   kind: 'sworn-brothers',
    note: { zh: '桃園の誓い', en: 'Peach Garden Oath' } },
  { a: 'sun-ce',      b: 'zhou-yu',     kind: 'sworn-brothers',
    note: { zh: '断金の交わり', en: 'A bond beyond gold' } },

  // Mentor / student
  { a: 'lu-zhi',      b: 'liu-bei',     kind: 'mentor-student',
    note: { zh: '盧植の門下', en: 'Studied under Lu Zhi' } },
  { a: 'lu-zhi',      b: 'gongsun-zan', kind: 'mentor-student',
    note: { zh: '同門', en: 'Fellow students under Lu Zhi' } },
  { a: 'zheng-xuan',  b: 'lu-zhi',      kind: 'mentor-student',
    note: { zh: '鄭玄の門下', en: 'Studied under Zheng Xuan' } },
  { a: 'zhuge-liang', b: 'jiang-wei',   kind: 'mentor-student',
    note: { zh: '武侯の弟子', en: 'Heir to Zhuge\'s art of war' } },
  { a: 'sima-hui',    b: 'zhuge-liang', kind: 'mentor-student',
    note: { zh: '水鏡の薦め', en: 'Recommended by Master Water-Mirror' } },

  // Master / servant — sworn followers
  { a: 'cao-cao',     b: 'dian-wei',    kind: 'master-servant',
    note: { zh: '主公への忠誠', en: 'Devoted personal guard' } },
  { a: 'cao-cao',     b: 'xu-chu',      kind: 'master-servant',
    note: { zh: '主公への忠誠', en: 'Devoted personal guard' } },
  { a: 'lu-bu',       b: 'gao-shun',    kind: 'master-servant',
    note: { zh: '高順、呂布に従う', en: 'Sworn to Lü Bu\'s flag' } },
  { a: 'sun-quan',    b: 'zhou-tai',    kind: 'master-servant',
    note: { zh: '九死に一生を君に', en: 'Bore wounds shielding his lord' } },

  // Rivals
  { a: 'zhou-yu',     b: 'zhuge-liang', kind: 'rival',
    note: { zh: '既生瑜何生亮', en: 'Why did heaven make Liang?' } },
  { a: 'zhuge-liang', b: 'sima-yi',     kind: 'rival',
    note: { zh: '北伐の対手', en: 'The matched mind across the Wei lines' } },
  { a: 'guan-yu',     b: 'lu-meng',     kind: 'rival',
    note: { zh: '白衣渡江', en: 'The white-robed crossing of the river' } },
  { a: 'liu-bei',     b: 'cao-cao',     kind: 'rival',
    note: { zh: '天下の英雄,君と操', en: 'Heroes of the realm, none else' } },
  { a: 'cao-cao',     b: 'yuan-shao',   kind: 'rival',
    note: { zh: '官渡の戦い', en: 'Childhood friends, enemies at Guandu' } },

  // Romantic
  { a: 'lu-bu',       b: 'diaochan',    kind: 'romantic',
    note: { zh: '貂蝉の連環', en: 'Caught in the Chain Stratagem' } },
  { a: 'zhuge-liang', b: 'huang-yueying',kind: 'romantic',
    note: { zh: '黄夫人の智', en: 'Wedded to the cleverest woman of Jingzhou' } },
  { a: 'sun-ce',      b: 'da-qiao',     kind: 'romantic',
    note: { zh: '大喬を娶る', en: 'Married Da Qiao' } },
  { a: 'zhou-yu',     b: 'xiao-qiao',   kind: 'romantic',
    note: { zh: '小喬を娶る', en: 'Married Xiao Qiao' } },

  // Personal enemies
  { a: 'lu-bu',       b: 'dong-zhuo',   kind: 'enemy',
    note: { zh: '父子の恩讐', en: 'Foster father betrayed' } },
  { a: 'guan-yu',     b: 'cao-cao',     kind: 'enemy',
    note: { zh: '恩義と離別', en: 'Owed favor but parted ways' } },
  { a: 'liu-bei',     b: 'lu-bu',       kind: 'enemy',
    note: { zh: '徐州を奪われる', en: 'Robbed of Xuzhou' } },
  { a: 'cao-cao',     b: 'ma-chao',     kind: 'enemy',
    note: { zh: '父の仇', en: 'Father\'s killer' } },
];
