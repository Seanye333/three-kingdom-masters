import type { FamilyRelation } from '../types/family';

/**
 * Historical family lineages — populated into `state.family` at scenario
 * load so famous Three Kingdoms officers start with their canonical
 * father/mother/son/spouse/sibling relations already in place.
 *
 * Format:
 *   - parent-child: officerA is the PARENT, officerB is the CHILD
 *   - spouse: order doesn't matter
 *   - sibling: order doesn't matter
 *
 * Only relations where BOTH officers exist in the playable roster are
 * eventually applied (filtered at load time).
 */
export const FAMILY_LINEAGE: FamilyRelation[] = [
  // ═══════════════════════════════════════════════════════════════════
  // 三曹 / 曹氏 (House of Cao)
  // ═══════════════════════════════════════════════════════════════════
  // Cao Cao + his sons (Cao Pi, Cao Zhang, Cao Zhi, Cao Xiong, Cao Ang, Cao Chong, Cao Yu, Cao Gun, Cao Lin)
  { officerA: 'cao-cao',    officerB: 'cao-pi',     kind: 'parent-child' },
  { officerA: 'cao-cao',    officerB: 'cao-zhang',  kind: 'parent-child' },
  { officerA: 'cao-cao',    officerB: 'cao-zhi',    kind: 'parent-child' },
  { officerA: 'cao-cao',    officerB: 'cao-ang',    kind: 'parent-child' },
  { officerA: 'cao-cao',    officerB: 'cao-chong',  kind: 'parent-child' },
  { officerA: 'cao-cao',    officerB: 'cao-yu',     kind: 'parent-child' },
  { officerA: 'cao-cao',    officerB: 'cao-gun',    kind: 'parent-child' },
  { officerA: 'cao-cao',    officerB: 'cao-lin',    kind: 'parent-child' },
  { officerA: 'cao-cao',    officerB: 'cao-hua',    kind: 'parent-child' }, // Princess Qinghe
  // Cao Pi's son Cao Rui (Emperor Ming of Wei) and his son Cao Fang
  { officerA: 'cao-pi',     officerB: 'cao-rui',    kind: 'parent-child' },
  { officerA: 'cao-rui',    officerB: 'cao-fang',   kind: 'parent-child' }, // adopted, but functional
  // Cao Rui's other son Cao Mao + Cao Huan (later emperors via different branches)
  // Cao siblings & cousins
  { officerA: 'cao-pi',     officerB: 'cao-zhang',  kind: 'sibling' },
  { officerA: 'cao-pi',     officerB: 'cao-zhi',    kind: 'sibling' },
  { officerA: 'cao-pi',     officerB: 'cao-ang',    kind: 'sibling' },
  { officerA: 'cao-zhang',  officerB: 'cao-zhi',    kind: 'sibling' },
  { officerA: 'cao-chong',  officerB: 'cao-pi',     kind: 'sibling' },
  { officerA: 'cao-chong',  officerB: 'cao-zhi',    kind: 'sibling' },
  // Cao Cao's cousins / clan members: Cao Ren, Cao Hong, Cao Xiu, Cao Zhen
  { officerA: 'cao-cao',    officerB: 'cao-ren',    kind: 'sibling' }, // first cousins; close enough
  { officerA: 'cao-cao',    officerB: 'cao-hong',   kind: 'sibling' },
  { officerA: 'cao-ren',    officerB: 'cao-chun',   kind: 'sibling' },
  { officerA: 'cao-ren',    officerB: 'cao-hong',   kind: 'sibling' },
  { officerA: 'cao-zhen',   officerB: 'cao-shuang', kind: 'parent-child' },
  // Cao Cao's wives
  { officerA: 'cao-cao',    officerB: 'bian-shi',   kind: 'spouse' },     // Empress Bian
  { officerA: 'cao-cao',    officerB: 'ding-shi',   kind: 'spouse' },     // Lady Ding (first)
  { officerA: 'cao-cao',    officerB: 'zou-shi',    kind: 'spouse' },     // Lady Zou
  { officerA: 'bian-shi',   officerB: 'cao-pi',     kind: 'parent-child' },
  { officerA: 'bian-shi',   officerB: 'cao-zhang',  kind: 'parent-child' },
  { officerA: 'bian-shi',   officerB: 'cao-zhi',    kind: 'parent-child' },
  // Cao Pi's wife Empress Zhen + son Cao Rui
  { officerA: 'cao-pi',     officerB: 'zhen-shi',   kind: 'spouse' },     // Lady Zhen
  { officerA: 'zhen-shi',   officerB: 'cao-rui',    kind: 'parent-child' },
  // Cao Pi later married Empress Guo
  { officerA: 'cao-pi',     officerB: 'guo-nuwang', kind: 'spouse' },

  // ═══════════════════════════════════════════════════════════════════
  // 夏侯氏 (House of Xiahou — Cao Cao's clan by adoption)
  // ═══════════════════════════════════════════════════════════════════
  { officerA: 'xiahou-dun', officerB: 'xiahou-yuan', kind: 'sibling' },   // cousins; close enough
  { officerA: 'xiahou-dun', officerB: 'xiahou-mao',  kind: 'parent-child' },
  { officerA: 'xiahou-yuan',officerB: 'xiahou-ba',   kind: 'parent-child' },
  { officerA: 'xiahou-yuan',officerB: 'xiahou-wei',  kind: 'parent-child' },
  { officerA: 'xiahou-yuan',officerB: 'xiahou-he',   kind: 'parent-child' },
  { officerA: 'xiahou-yuan',officerB: 'xiahou-rong', kind: 'parent-child' },
  { officerA: 'xiahou-ba',  officerB: 'xiahou-wei',  kind: 'sibling' },
  { officerA: 'xiahou-ba',  officerB: 'xiahou-he',   kind: 'sibling' },

  // ═══════════════════════════════════════════════════════════════════
  // 司馬氏 (House of Sima — would eventually rule as Jin)
  // ═══════════════════════════════════════════════════════════════════
  { officerA: 'sima-yi',    officerB: 'sima-shi',   kind: 'parent-child' },
  { officerA: 'sima-yi',    officerB: 'sima-zhao',  kind: 'parent-child' },
  { officerA: 'sima-yi',    officerB: 'sima-fu',    kind: 'sibling' },
  { officerA: 'sima-shi',   officerB: 'sima-zhao',  kind: 'sibling' },
  { officerA: 'sima-zhao',  officerB: 'sima-yan',   kind: 'parent-child' }, // founder of Jin
  { officerA: 'sima-zhao',  officerB: 'sima-you',   kind: 'parent-child' },
  { officerA: 'sima-yi',    officerB: 'zhang-chunhua', kind: 'spouse' },   // Lady Zhang Chunhua
  { officerA: 'zhang-chunhua', officerB: 'sima-shi', kind: 'parent-child' },
  { officerA: 'zhang-chunhua', officerB: 'sima-zhao', kind: 'parent-child' },

  // ═══════════════════════════════════════════════════════════════════
  // 諸葛氏 (House of Zhuge — split across three kingdoms!)
  // ═══════════════════════════════════════════════════════════════════
  { officerA: 'zhuge-liang',officerB: 'zhuge-jin',  kind: 'sibling' },    // brothers, Shu vs Wu
  { officerA: 'zhuge-liang',officerB: 'zhuge-jun',  kind: 'sibling' },
  { officerA: 'zhuge-jin',  officerB: 'zhuge-ke',   kind: 'parent-child' },
  { officerA: 'zhuge-jin',  officerB: 'zhuge-rong', kind: 'parent-child' },
  { officerA: 'zhuge-liang',officerB: 'zhuge-zhan', kind: 'parent-child' },
  { officerA: 'zhuge-zhan', officerB: 'zhuge-shang',kind: 'parent-child' },
  { officerA: 'zhuge-liang',officerB: 'huang-yueying', kind: 'spouse' },  // Lady Huang
  { officerA: 'huang-yueying', officerB: 'zhuge-zhan', kind: 'parent-child' },
  // Cousin in Wei: Zhuge Dan
  { officerA: 'zhuge-liang',officerB: 'zhuge-dan',  kind: 'sibling' },    // distant cousin
  { officerA: 'zhuge-jin',  officerB: 'zhuge-dan',  kind: 'sibling' },

  // ═══════════════════════════════════════════════════════════════════
  // 孫氏 (House of Sun — Eastern Wu)
  // ═══════════════════════════════════════════════════════════════════
  { officerA: 'sun-jian',   officerB: 'sun-ce',     kind: 'parent-child' },
  { officerA: 'sun-jian',   officerB: 'sun-quan',   kind: 'parent-child' },
  { officerA: 'sun-jian',   officerB: 'sun-yi',     kind: 'parent-child' },
  { officerA: 'sun-jian',   officerB: 'sun-kuang',  kind: 'parent-child' },
  { officerA: 'sun-jian',   officerB: 'sun-shangxiang', kind: 'parent-child' }, // Lady Sun → marries Liu Bei
  { officerA: 'sun-ce',     officerB: 'sun-quan',   kind: 'sibling' },
  { officerA: 'sun-ce',     officerB: 'sun-yi',     kind: 'sibling' },
  { officerA: 'sun-ce',     officerB: 'sun-shangxiang', kind: 'sibling' },
  { officerA: 'sun-quan',   officerB: 'sun-yi',     kind: 'sibling' },
  { officerA: 'sun-quan',   officerB: 'sun-shangxiang', kind: 'sibling' },
  { officerA: 'sun-quan',   officerB: 'sun-deng',   kind: 'parent-child' },
  { officerA: 'sun-quan',   officerB: 'sun-he',     kind: 'parent-child' },
  { officerA: 'sun-quan',   officerB: 'sun-liang',  kind: 'parent-child' },
  { officerA: 'sun-quan',   officerB: 'sun-xiu',    kind: 'parent-child' },
  { officerA: 'sun-quan',   officerB: 'sun-ba',     kind: 'parent-child' },
  { officerA: 'sun-he',     officerB: 'sun-hao',    kind: 'parent-child' }, // last emperor of Wu
  // Sun Jian's wife Lady Wu
  { officerA: 'sun-jian',   officerB: 'wu-furen',   kind: 'spouse' },
  { officerA: 'wu-furen',   officerB: 'sun-ce',     kind: 'parent-child' },
  { officerA: 'wu-furen',   officerB: 'sun-quan',   kind: 'parent-child' },
  // Sun Ce's wife Da Qiao; Sun Quan's wife Bu Lianshi
  { officerA: 'sun-ce',     officerB: 'da-qiao',    kind: 'spouse' },
  { officerA: 'sun-quan',   officerB: 'bu-lianshi', kind: 'spouse' },
  // Zhou Yu + Xiao Qiao (Da Qiao's sister)
  { officerA: 'zhou-yu',    officerB: 'xiao-qiao',  kind: 'spouse' },
  { officerA: 'da-qiao',    officerB: 'xiao-qiao',  kind: 'sibling' },    // famous "Two Qiaos"
  { officerA: 'zhou-yu',    officerB: 'zhou-xun',   kind: 'parent-child' },
  { officerA: 'zhou-yu',    officerB: 'zhou-yin',   kind: 'parent-child' },
  // Sun's general family: Sun Yi → Sun Jun → Sun Chen
  { officerA: 'sun-jun',    officerB: 'sun-chen',   kind: 'sibling' },

  // ═══════════════════════════════════════════════════════════════════
  // 劉氏 (House of Liu — Shu Han imperial family)
  // ═══════════════════════════════════════════════════════════════════
  { officerA: 'liu-bei',    officerB: 'liu-shan',   kind: 'parent-child' },
  { officerA: 'liu-bei',    officerB: 'liu-feng',   kind: 'parent-child' }, // adopted son
  { officerA: 'liu-bei',    officerB: 'liu-yong',   kind: 'parent-child' },
  { officerA: 'liu-bei',    officerB: 'liu-li',     kind: 'parent-child' },
  { officerA: 'liu-shan',   officerB: 'liu-xuan',   kind: 'parent-child' },
  { officerA: 'liu-shan',   officerB: 'liu-yao-sh', kind: 'parent-child' },
  { officerA: 'liu-shan',   officerB: 'liu-zong',   kind: 'parent-child' },
  { officerA: 'liu-shan',   officerB: 'liu-zan-sh', kind: 'parent-child' },
  // Liu Bei's wives
  { officerA: 'liu-bei',    officerB: 'gan-furen',  kind: 'spouse' },     // mother of Liu Shan
  { officerA: 'liu-bei',    officerB: 'mi-furen',   kind: 'spouse' },     // Lady Mi (sister of Mi Zhu)
  { officerA: 'liu-bei',    officerB: 'sun-shangxiang', kind: 'spouse' }, // famous political marriage
  { officerA: 'liu-bei',    officerB: 'wu-shi',     kind: 'spouse' },     // Empress Wu
  { officerA: 'gan-furen',  officerB: 'liu-shan',   kind: 'parent-child' },
  // Mi Zhu + Lady Mi (siblings)
  { officerA: 'mi-zhu',     officerB: 'mi-furen',   kind: 'sibling' },
  { officerA: 'mi-zhu',     officerB: 'mi-fang',    kind: 'sibling' },
  // Liu Biao + family (rival Liu)
  { officerA: 'liu-biao',   officerB: 'liu-qi',     kind: 'parent-child' },
  { officerA: 'liu-biao',   officerB: 'liu-cong',   kind: 'parent-child' },
  { officerA: 'liu-qi',     officerB: 'liu-cong',   kind: 'sibling' },
  { officerA: 'liu-biao',   officerB: 'cai-furen',  kind: 'spouse' },
  // Liu Yan + Liu Zhang (Yi province)
  { officerA: 'liu-yan',    officerB: 'liu-zhang',  kind: 'parent-child' },
  { officerA: 'liu-yan',    officerB: 'liu-fan',    kind: 'parent-child' },
  { officerA: 'liu-yan',    officerB: 'liu-mao',    kind: 'parent-child' },
  { officerA: 'liu-zhang',  officerB: 'liu-xun',    kind: 'parent-child' },
  { officerA: 'liu-zhang',  officerB: 'liu-fan',    kind: 'sibling' },

  // ═══════════════════════════════════════════════════════════════════
  // 關 / 張 / 趙 / 馬 (Shu's Five Tigers + descendants)
  // ═══════════════════════════════════════════════════════════════════
  // Guan Yu + sons Guan Ping (adopted), Guan Xing; grandson Guan Yi
  { officerA: 'guan-yu',    officerB: 'guan-ping',  kind: 'parent-child' },
  { officerA: 'guan-yu',    officerB: 'guan-xing',  kind: 'parent-child' },
  { officerA: 'guan-yu',    officerB: 'guan-suo',   kind: 'parent-child' },
  { officerA: 'guan-ping',  officerB: 'guan-xing',  kind: 'sibling' },
  { officerA: 'guan-ping',  officerB: 'guan-suo',   kind: 'sibling' },
  { officerA: 'guan-xing',  officerB: 'guan-yi',    kind: 'parent-child' },
  { officerA: 'guan-xing',  officerB: 'guan-tong',  kind: 'parent-child' },
  // Zhang Fei + sons Zhang Bao, Zhang Shao (Empress Zhang)
  { officerA: 'zhang-fei',  officerB: 'zhang-bao-sf', kind: 'parent-child' },
  { officerA: 'zhang-fei',  officerB: 'zhang-shao', kind: 'parent-child' },
  { officerA: 'zhang-fei',  officerB: 'zhang-ji',   kind: 'parent-child' },
  // Lady Xiahou (cousin captured by Zhang Fei → wife) → Zhang Bao
  { officerA: 'zhang-fei',  officerB: 'xiahou-shi', kind: 'spouse' },
  // Ma Chao + brother Ma Dai
  { officerA: 'ma-teng',    officerB: 'ma-chao',    kind: 'parent-child' },
  { officerA: 'ma-teng',    officerB: 'ma-tie',     kind: 'parent-child' },
  { officerA: 'ma-teng',    officerB: 'ma-xiu',     kind: 'parent-child' },
  { officerA: 'ma-chao',    officerB: 'ma-tie',     kind: 'sibling' },
  { officerA: 'ma-chao',    officerB: 'ma-xiu',     kind: 'sibling' },
  { officerA: 'ma-chao',    officerB: 'ma-dai',     kind: 'sibling' },  // cousins
  { officerA: 'ma-liang',   officerB: 'ma-su',      kind: 'sibling' },  // "Five Chang" Ma brothers
  // Zhao Yun + sons
  { officerA: 'zhao-yun',   officerB: 'zhao-tong',  kind: 'parent-child' },
  { officerA: 'zhao-yun',   officerB: 'zhao-guang', kind: 'parent-child' },
  { officerA: 'zhao-tong',  officerB: 'zhao-guang', kind: 'sibling' },
  // Huang Zhong (no sons in record); Wei Yan (no canonical son)

  // ═══════════════════════════════════════════════════════════════════
  // 袁 / 董 / 呂 family
  // ═══════════════════════════════════════════════════════════════════
  { officerA: 'yuan-shao',  officerB: 'yuan-tan',   kind: 'parent-child' },
  { officerA: 'yuan-shao',  officerB: 'yuan-xi',    kind: 'parent-child' },
  { officerA: 'yuan-shao',  officerB: 'yuan-shang', kind: 'parent-child' },
  { officerA: 'yuan-tan',   officerB: 'yuan-xi',    kind: 'sibling' },
  { officerA: 'yuan-tan',   officerB: 'yuan-shang', kind: 'sibling' },
  { officerA: 'yuan-xi',    officerB: 'yuan-shang', kind: 'sibling' },
  // Yuan Shao + Lady Liu
  { officerA: 'yuan-shao',  officerB: 'liu-furen',  kind: 'spouse' },
  // Yuan Shao + Yuan Shu (half-brothers — same father Yuan Feng)
  { officerA: 'yuan-shao',  officerB: 'yuan-shu',   kind: 'sibling' },
  { officerA: 'yuan-shu',   officerB: 'yuan-yao',   kind: 'parent-child' },
  // Dong Zhuo + Diao Chan (adopted) + Lü Bu (adopted son) — complex
  { officerA: 'dong-zhuo',  officerB: 'diao-chan',  kind: 'parent-child' },  // adopted
  { officerA: 'lu-bu',      officerB: 'diao-chan',  kind: 'spouse' },        // famous love triangle
  { officerA: 'lu-bu',      officerB: 'lu-furen',   kind: 'spouse' },        // formal wife
  { officerA: 'lu-bu',      officerB: 'lu-lingqi',  kind: 'parent-child' },  // daughter
  // Dong's daughter Dong Bai
  { officerA: 'dong-zhuo',  officerB: 'dong-bai',   kind: 'parent-child' },  // niece-granddaughter

  // ═══════════════════════════════════════════════════════════════════
  // 蔡 family (Cai Yong, Cai Yan)
  // ═══════════════════════════════════════════════════════════════════
  { officerA: 'cai-yong',   officerB: 'cai-yan',    kind: 'parent-child' },
  { officerA: 'cai-yong',   officerB: 'cai-wenji',  kind: 'parent-child' },  // Wenji = Yan; both ids may exist
  // Cai Mao + sister Cai Furen
  { officerA: 'cai-mao',    officerB: 'cai-furen',  kind: 'sibling' },

  // ═══════════════════════════════════════════════════════════════════
  // Wei generals' families
  // ═══════════════════════════════════════════════════════════════════
  // Xun Yu (Wei's "Zhang Liang") + cousin Xun You
  { officerA: 'xun-yu',     officerB: 'xun-you',    kind: 'sibling' },
  // Zhong Yao + son Zhong Hui
  { officerA: 'zhong-yao',  officerB: 'zhong-hui',  kind: 'parent-child' },
  { officerA: 'zhong-yao',  officerB: 'zhong-yu',   kind: 'parent-child' },
  { officerA: 'zhong-hui',  officerB: 'zhong-yu',   kind: 'sibling' },
  // Jia Xu + son Jia Mu
  { officerA: 'jia-xu',     officerB: 'jia-mu',     kind: 'parent-child' },
  // Zhang Liao no canonical son in major roster
  // Cao Cao's other clan: Xiahou Dun's daughter married Zhang Fei → Zhang Bao etc. (already above)

  // ═══════════════════════════════════════════════════════════════════
  // 鄧 (Deng Ai) + 姜 (Jiang Wei) generation
  // ═══════════════════════════════════════════════════════════════════
  { officerA: 'deng-ai',    officerB: 'deng-zhong', kind: 'parent-child' },

  // ═══════════════════════════════════════════════════════════════════
  // 陸 (Lu Xun) Wu family
  // ═══════════════════════════════════════════════════════════════════
  { officerA: 'lu-xun',     officerB: 'lu-kang',    kind: 'parent-child' },
  { officerA: 'lu-kang',    officerB: 'lu-ji-sh',   kind: 'parent-child' },
  // Lu Xun's wife Lady Sun (Sun Ce's daughter)
  { officerA: 'lu-xun',     officerB: 'sun-lu-ban', kind: 'spouse' }, // some accounts disagree but historical
  // Lu Su (no famous descendants in roster)

  // ═══════════════════════════════════════════════════════════════════
  // 王朗 / 鍾 / 程 / etc.
  // ═══════════════════════════════════════════════════════════════════
  { officerA: 'wang-lang',  officerB: 'wang-su',    kind: 'parent-child' },
  { officerA: 'wang-su',    officerB: 'wang-yuanji',kind: 'parent-child' },  // → mother of Sima Yan
  { officerA: 'sima-zhao',  officerB: 'wang-yuanji',kind: 'spouse' },
  // Chen Qun
  { officerA: 'chen-qun',   officerB: 'chen-tai',   kind: 'parent-child' },

  // ═══════════════════════════════════════════════════════════════════
  // 姓朱 / 趙範 / 賈 / others
  // ═══════════════════════════════════════════════════════════════════
  { officerA: 'zhao-fan',   officerB: 'fan-shi',    kind: 'sibling' },   // sister Lady Fan

  // ═══════════════════════════════════════════════════════════════════
  // 公孫 family
  // ═══════════════════════════════════════════════════════════════════
  { officerA: 'gongsun-du', officerB: 'gongsun-kang', kind: 'parent-child' },
  { officerA: 'gongsun-kang', officerB: 'gongsun-yuan', kind: 'parent-child' },
  { officerA: 'gongsun-kang', officerB: 'gongsun-huang', kind: 'parent-child' },
  { officerA: 'gongsun-yuan', officerB: 'gongsun-huang', kind: 'sibling' },
];
