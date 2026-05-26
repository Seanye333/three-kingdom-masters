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

  // ════════ Expanded sworn brothers / sworn sisters ════════
  { a: 'cao-cao',     b: 'yuan-shao',   kind: 'sworn-brothers',
    note: { zh: '少時知交', en: 'Childhood friends before turning rivals' } },
  { a: 'sun-ce',      b: 'lu-su',       kind: 'sworn-brothers',
    note: { zh: '誓共大業', en: 'Sworn allies of great cause' } },
  { a: 'cao-ang',     b: 'cao-anmin',   kind: 'sworn-brothers',
    note: { zh: '同為宛城殉父', en: 'Died together protecting their father at Wancheng' } },
  { a: 'xiahou-dun',  b: 'cao-cao',     kind: 'sworn-brothers',
    note: { zh: '從征生死', en: 'Inseparable through campaigns' } },
  { a: 'liu-bei',     b: 'gongsun-zan', kind: 'sworn-brothers',
    note: { zh: '幽州同窗', en: 'Friends from their school days under Lu Zhi' } },
  { a: 'liu-yao',     b: 'liu-biao',    kind: 'sworn-brothers',
    note: { zh: '同宗兄弟', en: 'Clansmen of the Han Liu line' } },

  // ════════ Expanded mentor-student relations ════════
  { a: 'cai-yong',    b: 'cao-cao',     kind: 'mentor-student',
    note: { zh: '蔡邕讚操', en: 'Recognized Cao Cao\'s talent early' } },
  { a: 'sima-hui',    b: 'pang-tong',   kind: 'mentor-student',
    note: { zh: '水鏡薦鳳雛', en: 'Recommended Pang Tong as the "Fledgling Phoenix"' } },
  { a: 'sima-hui',    b: 'xu-shu',      kind: 'mentor-student',
    note: { zh: '水鏡門下', en: 'Studied under Master Water-Mirror' } },
  { a: 'sima-hui',    b: 'sima-yi',     kind: 'mentor-student',
    note: { zh: '族中前輩', en: 'Clan elder and instructor' } },
  { a: 'xu-shu',      b: 'zhuge-liang', kind: 'mentor-student',
    note: { zh: '元直薦孔明', en: 'Recommended Zhuge to Liu Bei before leaving' } },
  { a: 'huang-chengyan', b: 'zhuge-liang', kind: 'mentor-student',
    note: { zh: '岳丈授學', en: 'Father-in-law and scholarly mentor' } },
  { a: 'pang-degong', b: 'zhuge-liang', kind: 'mentor-student',
    note: { zh: '臥龍因之而名', en: 'Coined the title "Sleeping Dragon"' } },
  { a: 'pang-degong', b: 'pang-tong',   kind: 'mentor-student',
    note: { zh: '德公叔父', en: 'Uncle and scholarly mentor' } },
  { a: 'cao-cao',     b: 'guo-jia',     kind: 'mentor-student',
    note: { zh: '視之為股肱', en: 'Mentor and pillar of Wei' } },
  { a: 'jiang-wei',   b: 'liao-hua',    kind: 'mentor-student',
    note: { zh: '北伐共事', en: 'Sworn under the Sleeping Dragon\'s legacy' } },
  { a: 'lu-su',       b: 'lu-meng',     kind: 'mentor-student',
    note: { zh: '吳下阿蒙', en: '"No longer the unread Meng of Wu"' } },
  { a: 'zhou-yu',     b: 'lu-meng',     kind: 'mentor-student',
    note: { zh: '少年將才', en: 'Taught the young general the arts of war' } },
  { a: 'lu-su',       b: 'lu-xun',      kind: 'mentor-student',
    note: { zh: '舉薦伯言', en: 'Recommended the young Lu Xun' } },

  // ════════ Expanded master-servant relations ════════
  { a: 'liu-bei',     b: 'zhao-yun',    kind: 'master-servant',
    note: { zh: '長坂救主', en: 'Saved his lord\'s son at Changban' } },
  { a: 'liu-bei',     b: 'mi-zhu',      kind: 'master-servant',
    note: { zh: '糜竺傾家相助', en: 'Pledged his entire fortune to Liu Bei' } },
  { a: 'liu-bei',     b: 'zhuge-liang', kind: 'master-servant',
    note: { zh: '三顧茅廬', en: 'Three visits to the thatched hut' } },
  { a: 'cao-cao',     b: 'xiahou-dun',  kind: 'master-servant',
    note: { zh: '從征左右', en: 'Constant companion in every campaign' } },
  { a: 'cao-cao',     b: 'xu-zhu',      kind: 'master-servant',
    note: { zh: '虎癡護主', en: 'Tiger-Madman bodyguard' } },
  { a: 'sun-quan',    b: 'lu-su',       kind: 'master-servant',
    note: { zh: '榻上對策', en: 'The "Couch-side Counsel"' } },
  { a: 'sun-quan',    b: 'zhou-yu',     kind: 'master-servant',
    note: { zh: '長兄之友', en: 'Inherited from his brother Sun Ce' } },
  { a: 'lu-bu',       b: 'zhang-liao',  kind: 'master-servant',
    note: { zh: '隨呂奉先', en: 'Zhang Liao served under Lü Bu' } },
  { a: 'yuan-shao',   b: 'ju-shou',     kind: 'master-servant',
    note: { zh: '謀主沮授', en: 'Chief strategist (unheeded)' } },
  { a: 'dong-zhuo',   b: 'lu-bu',       kind: 'master-servant',
    note: { zh: '螟蛉之子', en: 'Adopted son (later betrayer)' } },
  { a: 'cao-cao',     b: 'sima-yi',     kind: 'master-servant',
    note: { zh: '不得已而仕', en: 'Reluctantly served, biding his time' } },

  // ════════ Expanded rivals ════════
  { a: 'guan-yu',     b: 'huang-zhong', kind: 'rival',
    note: { zh: '長沙之戰', en: 'The duel at Changsha — mutual respect' } },
  { a: 'zhao-yun',    b: 'jiang-wei',   kind: 'rival',
    note: { zh: '槍法相得', en: 'Met as foes, recognized as kin in arms' } },
  { a: 'lu-bu',       b: 'guan-yu',     kind: 'rival',
    note: { zh: '虎牢關之戰', en: 'Three-on-one at Hulao Pass' } },
  { a: 'lu-bu',       b: 'zhang-fei',   kind: 'rival',
    note: { zh: '三英戰呂布', en: 'The "Three Heroes" duel' } },
  { a: 'ma-chao',     b: 'xu-chu',      kind: 'rival',
    note: { zh: '裸戰許褚', en: 'Stripped-armor duel at the Wei river' } },
  { a: 'ma-chao',     b: 'zhang-fei',   kind: 'rival',
    note: { zh: '葭萌關鏖戰', en: 'All-night duel at Jiameng Pass' } },
  { a: 'sun-ce',      b: 'tai-shi-ci',  kind: 'rival',
    note: { zh: '神亭嶺英雄相惜', en: 'Dueled at Shenting; later sworn allies' } },
  { a: 'pang-tong',   b: 'zhuge-liang', kind: 'rival',
    note: { zh: '鳳雛臥龍', en: 'Fledgling Phoenix vs. Sleeping Dragon' } },
  { a: 'deng-ai',     b: 'jiang-wei',   kind: 'rival',
    note: { zh: '九伐中原宿敵', en: 'Matched at every Northern Expedition' } },
  { a: 'lu-xun',      b: 'liu-bei',     kind: 'rival',
    note: { zh: '夷陵之戰', en: 'Crushed Liu Bei at Yiling' } },
  { a: 'zhou-yu',     b: 'cao-cao',     kind: 'rival',
    note: { zh: '赤壁敗操', en: 'Defeated Cao Cao at Red Cliffs' } },
  { a: 'cao-cao',     b: 'sun-quan',    kind: 'rival',
    note: { zh: '生子當如孫仲謀', en: '"A son should be like Sun Zhongmou"' } },

  // ════════ Expanded romantic ════════
  { a: 'liu-bei',     b: 'sun-shangxiang', kind: 'romantic',
    note: { zh: '吳國太定姻', en: 'Political marriage at the temple' } },
  { a: 'dong-zhuo',   b: 'diao-chan',   kind: 'romantic',
    note: { zh: '連環計', en: 'Pawn in Wang Yun\'s scheme' } },
  { a: 'cao-pi',      b: 'zhen-shi',    kind: 'romantic',
    note: { zh: '甄洛之夫', en: 'Married Lady Zhen after Yuan Xi\'s fall' } },
  { a: 'cao-zhi',     b: 'zhen-shi',    kind: 'romantic',
    note: { zh: '洛神賦傳說', en: 'Inspiration for the "Goddess of the Luo"' } },
  { a: 'lu-su',       b: 'lu-bu',       kind: 'romantic',
    note: { zh: '?', en: '?' } }, // placeholder — will be filtered out if invalid

  // ════════ Expanded enemies ════════
  { a: 'cao-cao',     b: 'liu-bei',     kind: 'enemy',
    note: { zh: '青梅煮酒識英雄', en: '"Heroes of the realm — you and I alone"' } },
  { a: 'sun-quan',    b: 'guan-yu',     kind: 'enemy',
    note: { zh: '荊州背盟', en: 'Backstabbed at Jingzhou' } },
  { a: 'cao-pi',      b: 'cao-zhi',     kind: 'enemy',
    note: { zh: '七步詩之爭', en: 'Forced his brother to recite the "Seven Pace Poem"' } },
  { a: 'sima-yi',     b: 'cao-shuang',  kind: 'enemy',
    note: { zh: '高平陵之變', en: 'Coup at the Gaoping Mausoleum' } },
  { a: 'sun-quan',    b: 'liu-bei',     kind: 'enemy',
    note: { zh: '夷陵興兵', en: 'Bid for vengeance after Guan Yu' } },
  { a: 'cao-cao',     b: 'lu-bu',       kind: 'enemy',
    note: { zh: '白門樓殞命', en: 'Executed at White Gate Tower' } },
  { a: 'yuan-shao',   b: 'gongsun-zan', kind: 'enemy',
    note: { zh: '河北爭霸', en: 'War for the North' } },
  { a: 'dong-zhuo',   b: 'wang-yun',    kind: 'enemy',
    note: { zh: '王允除奸', en: 'Wang Yun\'s plot to remove the tyrant' } },
];
