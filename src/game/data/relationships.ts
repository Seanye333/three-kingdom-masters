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
    note: { zh: '桃園結義', en: 'Peach Garden Oath' } },
  { a: 'liu-bei',     b: 'zhang-fei',   kind: 'sworn-brothers',
    note: { zh: '桃園結義', en: 'Peach Garden Oath' } },
  { a: 'guan-yu',     b: 'zhang-fei',   kind: 'sworn-brothers',
    note: { zh: '桃園結義', en: 'Peach Garden Oath' } },
  { a: 'sun-ce',      b: 'zhou-yu',     kind: 'sworn-brothers',
    note: { zh: '斷金之交', en: 'A bond beyond gold' } },

  // Mentor / student
  { a: 'lu-zhi',      b: 'liu-bei',     kind: 'mentor-student',
    note: { zh: '盧植門下', en: 'Studied under Lu Zhi' } },
  { a: 'lu-zhi',      b: 'gongsun-zan', kind: 'mentor-student',
    note: { zh: '同門', en: 'Fellow students under Lu Zhi' } },
  { a: 'zheng-xuan',  b: 'lu-zhi',      kind: 'mentor-student',
    note: { zh: '鄭玄門下', en: 'Studied under Zheng Xuan' } },
  { a: 'zhuge-liang', b: 'jiang-wei',   kind: 'mentor-student',
    note: { zh: '武侯弟子', en: 'Heir to Zhuge\'s art of war' } },
  { a: 'sima-hui',    b: 'zhuge-liang', kind: 'mentor-student',
    note: { zh: '水鏡舉薦', en: 'Recommended by Master Water-Mirror' } },

  // Master / servant — sworn followers
  { a: 'cao-cao',     b: 'dian-wei',    kind: 'master-servant',
    note: { zh: '誓死護主', en: 'Devoted personal guard' } },
  { a: 'cao-cao',     b: 'xu-chu',      kind: 'master-servant',
    note: { zh: '誓死護主', en: 'Devoted personal guard' } },
  { a: 'lu-bu',       b: 'gao-shun',    kind: 'master-servant',
    note: { zh: '高順，呂布従', en: 'Sworn to Lü Bu\'s flag' } },
  { a: 'sun-quan',    b: 'zhou-tai',    kind: 'master-servant',
    note: { zh: '九死一生捨身護主', en: 'Bore wounds shielding his lord' } },

  // Rivals
  { a: 'zhou-yu',     b: 'zhuge-liang', kind: 'rival',
    note: { zh: '既生瑜何生亮', en: 'Why did heaven make Liang?' } },
  { a: 'zhuge-liang', b: 'sima-yi',     kind: 'rival',
    note: { zh: '北伐宿敵', en: 'The matched mind across the Wei lines' } },
  { a: 'guan-yu',     b: 'lu-meng',     kind: 'rival',
    note: { zh: '白衣渡江', en: 'The white-robed crossing of the river' } },
  { a: 'liu-bei',     b: 'cao-cao',     kind: 'rival',
    note: { zh: '天下英雄，唯君與操', en: 'Heroes of the realm, none else' } },
  { a: 'cao-cao',     b: 'yuan-shao',   kind: 'rival',
    note: { zh: '官渡之戰', en: 'Childhood friends, enemies at Guandu' } },

  // Romantic
  { a: 'lu-bu',       b: 'diaochan',    kind: 'romantic',
    note: { zh: '貂蟬連環計', en: 'Caught in the Chain Stratagem' } },
  { a: 'zhuge-liang', b: 'huang-yueying',kind: 'romantic',
    note: { zh: '黃夫人之智', en: 'Wedded to the cleverest woman of Jingzhou' } },
  { a: 'sun-ce',      b: 'da-qiao',     kind: 'romantic',
    note: { zh: '娶大喬', en: 'Married Da Qiao' } },
  { a: 'zhou-yu',     b: 'xiao-qiao',   kind: 'romantic',
    note: { zh: '娶小喬', en: 'Married Xiao Qiao' } },

  // Personal enemies
  { a: 'lu-bu',       b: 'dong-zhuo',   kind: 'enemy',
    note: { zh: '父子恩仇', en: 'Foster father betrayed' } },
  { a: 'guan-yu',     b: 'cao-cao',     kind: 'enemy',
    note: { zh: '恩義離別', en: 'Owed favor but parted ways' } },
  { a: 'liu-bei',     b: 'lu-bu',       kind: 'enemy',
    note: { zh: '奪徐州', en: 'Robbed of Xuzhou' } },
  { a: 'cao-cao',     b: 'ma-chao',     kind: 'enemy',
    note: { zh: '殺父之仇', en: 'Father\'s killer' } },
];
