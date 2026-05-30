/**
 * Officer biographies — short bilingual descriptions sourced from the
 * Records of the Three Kingdoms (三国志) and Romance of the Three Kingdoms
 * (三国演义). Major officers get 3–5 sentences; minor officers, 1–2.
 *
 * Each entry has a Chinese narrative and an English translation. Officers
 * not in this map fall back to a procedural description derived from stats.
 */
import { HISTORICAL_BIOGRAPHIES } from './historicalBiographies';

export interface OfficerBiography {
  zh: string;
  en: string;
  /** Optional era/period label. */
  era?: { zh: string; en: string };
  /** Famous quote attributed to the officer. */
  quote?: { zh: string; en: string };
}

export const BIOGRAPHIES: Record<string, OfficerBiography> = {
  'cao-cao': {
    era: { zh: '魏武帝', en: 'Emperor Wu of Wei' },
    zh: '字孟德,沛国谯县人。汉相曹参之后。少时机警,有权数,任侠放荡;许劭评之曰:"治世之能臣,乱世之奸雄。" 起兵讨董卓,挟天子以令诸侯,北破袁绍,平定北方,奠定魏国基业。诗文俊爽,以《观沧海》《短歌行》传世。',
    en: 'Style name Mengde. A descendant of the Han chancellor Cao Shen. Cunning and unconventional in youth, Xu Shao judged him "a capable minister in peace, a treacherous hero in chaos." He raised troops against Dong Zhuo, took custody of the Han emperor to command the warlords, broke Yuan Shao in the north, and laid the foundation of Wei. His ci poems are first-rate; "Gazing at the Sea" and "Short Song" survive to this day.',
    quote: { zh: '宁我负人,毋人负我。', en: 'Better that I betray the world than the world betray me.' },
  },
  'liu-bei': {
    era: { zh: '蜀汉昭烈帝', en: 'Emperor Zhaolie of Shu Han' },
    zh: '字玄德,涿郡涿县人。汉景帝玄孙,中山靖王刘胜之后。少有大志,与关羽，张飞桃园结义。一生颠沛,屡败屡战,终入蜀建立汉中之业,称帝白帝。仁德爱民,以德服人,与曹操形成天下两极。',
    en: 'Style name Xuande. A descendant of Emperor Jing of Han through Prince Jing of Zhongshan, Liu Sheng. Ambitious from youth, he swore the Peach Garden Oath with Guan Yu and Zhang Fei. Through a lifetime of defeat and flight, he eventually entered Shu, took Hanzhong, and proclaimed himself emperor at Baidicheng. His benevolence drew men to him; with Cao Cao he formed the two poles of the realm.',
    quote: { zh: '勿以善小而不为,勿以恶小而为之。', en: 'Do no good so small it can be neglected; do no evil so small it can be excused.' },
  },
  'sun-quan': {
    era: { zh: '吴大帝', en: 'Emperor Da of Wu' },
    zh: '字仲谋,吴郡富春人。孙坚之子,孙策之弟。十九岁继兄业,内修政理,外结英才,赤壁联刘抗曹,夷陵破刘备,立国江东五十余年。 曹操叹曰:"生子当如孙仲谋。"',
    en: 'Style name Zhongmou. Son of Sun Jian and younger brother of Sun Ce. At nineteen he inherited the south. He cultivated good government, gathered talent, allied with Liu Bei at Red Cliffs, broke Liu Bei at Yiling, and ruled Jiangdong for over fifty years. Cao Cao sighed: "If one must have a son, let him be a Sun Zhongmou."',
  },
  'guan-yu': {
    era: { zh: '武圣', en: 'Saint of War' },
    zh: '字云长,河东解良人。身长九尺,髯长二尺,面如重枣。义薄云天,与刘备，张飞结为兄弟。 千里走单骑,过五关斩六将。水淹七军,威震华夏,败走麦城而死。后世尊为武圣,庙祀遍天下。',
    en: 'Style name Yunchang. Nine chi tall with a two-chi beard and a date-red face. His loyalty stretched higher than the clouds; he was sworn brother to Liu Bei and Zhang Fei. He rode a thousand li alone, slew six commanders at five passes, drowned seven armies at Fancheng, and shook all China — then fell at Maicheng. Later ages worshipped him as the Saint of War; temples to him stand across the realm.',
    quote: { zh: '玉可碎而不可改其白,竹可焚而不可毁其节。', en: 'Jade may shatter but its whiteness will not change; bamboo may burn but its uprightness will not be destroyed.' },
  },
  'zhang-fei': {
    era: { zh: '万人敌', en: 'Match for ten thousand men' },
    zh: '字翼德,涿郡人。豹头环眼,燕颔虎须。声若巨雷,势如奔马。当阳长坂桥头独退曹军百万,曹军莫敢近。粗中有细,义气深重,后为部下所害。',
    en: "Style name Yide. Leopard's head, ring eyes, swallow's jaw, tiger's whiskers. His voice was a thunder-clap, his charge a galloping horse. At the bridge of Changban he held back a million of Cao's troops alone, and none dared approach. Rough but not stupid, fiercely loyal — and in the end murdered by his own lieutenants.",
  },
  'zhao-yun': {
    era: { zh: '常胜将军', en: 'The Ever-Victorious' },
    zh: '字子龙,常山真定人。身长八尺,姿颜雄伟。 长坂坡中七进七出,怀抱阿斗杀出重围。一生未尝败绩,刘备叹曰:"子龙一身都是胆。" 蜀汉五虎之一。',
    en: 'Style name Zilong, of Zhending in Changshan. Eight chi tall, with majestic bearing. At Changban he charged in and out seven times, the infant heir clutched at his breast. He never lost a battle. Liu Bei said of him: "Zilong is courage from head to heel." One of the Five Tiger Generals of Shu.',
    quote: { zh: '臣子今日所为,皆是分内事!', en: "What I have done today is no more than a subject's duty!" },
  },
  'zhuge-liang': {
    era: { zh: '卧龙', en: 'The Sleeping Dragon' },
    zh: '字孔明,琅琊阳都人。身长八尺,容貌甚伟,躬耕于南阳,自比管乐。三顾而出,献《隆中对》,定天下三分之策。火烧博望,赤壁借东风,空城退仲达。鞠躬尽瘁,死而后已,星陨五丈原。',
    en: 'Style name Kongming, of Yangdu in Langya. Eight chi tall, majestic of countenance, he tilled his fields at Nanyang and compared himself to Guan Zhong and Yue Yi. Drawn out after three visits, he proposed the Longzhong Plan and divided the realm in three. He burned the camp at Bowang, called up the east wind at Red Cliffs, drove Sima Yi back with the empty fort. Bowing low, exhausting himself to death — until a star fell at Wuzhang Plains.',
    quote: { zh: '鞠躬尽瘁,死而后已。', en: 'I shall bend my back and exhaust my strength until the day of my death.' },
  },
  'lu-bu': {
    era: { zh: '飞将', en: 'The Flying General' },
    zh: '字奉先,五原九原人。弓马娴熟,有"人中吕布,马中赤兔"之誉。事丁原，董卓，王允,三易其主,世人称"三姓家奴"。辕门射戟,虎牢关战三英。最后败于下邳,白门楼为曹操所缢。',
    en: 'Style name Fengxian, of Jiuyuan in Wuyuan. Master of bow and horse, the saying went: "Among men, Lü Bu; among horses, Red Hare." He served Ding Yuan, Dong Zhuo, and Wang Yun in turn — the world called him "the slave of three surnames." He shot the halberd at Yuanmen and held off the three sworn brothers at Hulao Pass. In the end he was strangled by Cao Cao\'s order at White Gate Tower.',
    quote: { zh: '大丈夫生于天地间,岂能郁郁久居人下!', en: 'A real man between heaven and earth — how can he linger long under another?' },
  },
  'sun-jian': {
    era: { zh: '江东之虎', en: 'Tiger of Jiangdong' },
    zh: '字文台,吴郡富春人。少年时孤身追海盗,声名远播。讨黃巾，伐董卓,首入洛阳,得传国玉玺。征荆州刘表,中流矢而死,年三十七。',
    en: 'Style name Wentai, of Fuchun in Wu. As a boy he chased down pirates alone and made his name. He crushed the Yellow Turbans, led the assault on Dong Zhuo, was first into Luoyang and there found the imperial seal. Campaigning against Liu Biao in Jingzhou, he was struck by an arrow and died at thirty-seven.',
  },
  'sun-ce': {
    era: { zh: '小霸王', en: 'The Little Conqueror' },
    zh: '字伯符,孙坚长子。英气过人,与周瑜结布衣交。借兵袁术,渡江而东,数年之间尽收江东六郡。 二十六岁中刺客之箭,临终托弟孙权。 曹操叹:"狮儿难与争锋!"',
    en: 'Style name Bofu, eldest son of Sun Jian. Fierce of spirit, sworn friend to Zhou Yu. He borrowed troops from Yuan Shu, crossed the Yangtze, and in a few years conquered all six commanderies of Jiangdong. At twenty-six an assassin\'s arrow brought him down; on his deathbed he passed the south to his brother Sun Quan. Cao Cao sighed: "One cannot contend with that lion-cub."',
  },
  'zhou-yu': {
    era: { zh: '美周郎', en: 'The Handsome Zhou Lang' },
    zh: '字公瑾,庐江舒县人。容貌昳丽,精通音律,时人语曰:"曲有误,周郎顾。" 与孙策为总角之交,助平江东。 赤壁火攻大破曹操,奠定三分。 年三十六卒于巴丘,临终叹:"既生瑜,何生亮!"',
    en: 'Style name Gongjin, of Shu in Lujiang. Strikingly handsome and a master of music — they said, "If a note goes wrong, Zhou Lang will look up." Sworn friend to Sun Ce from boyhood, he helped pacify the south. At Red Cliffs his fire attack broke Cao Cao and divided the realm. He died at thirty-six at Baqiu, crying: "Since heaven gave the world Yu, why also Liang?"',
  },
  'sima-yi': {
    era: { zh: '冢虎', en: 'The Tomb-Tiger' },
    zh: '字仲达,河内温县人。隐忍多智,曹操疑其有狼顾之相而忌之。 历事曹操，丕，叡，芳四主。 拒诸葛于五丈原,平辽东公孙渊。 晚年发动高平陵之变,夺曹爽之权,为西晋开基。',
    en: 'Style name Zhongda, of Wen in Henei. Patient and deep-counseled; Cao Cao saw the wolf-glance in him and was wary. He served four lords of Wei in turn. He held Zhuge Liang at Wuzhang Plains and crushed Gongsun Yuan in Liaodong. Late in life he sprang the Gaopingling coup, seized power from Cao Shuang, and laid the foundation of Jin.',
  },
  'zhang-liao': {
    zh: '字文远,雁门马邑人。原从吕布,败后归曹操。 合肥之战率八百死士冲孙权十万军,几擒孙权,江东闻其名小儿不敢夜啼。',
    en: 'Style name Wenyuan, of Mayi in Yanmen. He served Lü Bu first, then went over to Cao Cao after defeat. At Hefei he led eight hundred picked men into Sun Quan\'s host of a hundred thousand and nearly took Sun Quan himself; afterward in Jiangdong children would not cry at night for fear of his name.',
  },
  'huang-zhong': {
    zh: '字汉升,南阳人。 老当益壮,弓马绝伦。 定军山一战斩夏侯渊,蜀汉五虎之一。',
    en: 'Style name Hansheng, of Nanyang. He was old, but the older he grew the stronger he became; none could match him with bow or horse. At Mount Dingjun he cut down Xiahou Yuan. One of the Five Tiger Generals of Shu.',
  },
  'ma-chao': {
    era: { zh: '锦马超', en: 'Brocade Ma Chao' },
    zh: '字孟起,扶风茂陵人。马腾之子,有西凉羌族血脉。骁勇异常,曹操叹"马儿不死,吾无葬地"。后归刘备,蜀汉五虎之一。',
    en: 'Style name Mengqi, of Maoling in Fufeng. Son of Ma Teng, with Qiang blood from the western marches. Cao Cao said, "Until that boy of the Ma family dies, I shall have no place to be buried." He went over to Liu Bei and became one of the Five Tiger Generals of Shu.',
  },
  'jiang-wei': {
    zh: '字伯约,天水冀县人。诸葛亮死后接掌北伐之业,九伐中原而无功。 蜀汉灭后伪降钟会图复国,事败被杀。',
    en: 'Style name Boyue, of Tianshui. After Zhuge Liang\'s death he carried on the northern campaigns — nine of them, all without lasting gain. When Shu fell he pretended to surrender to Zhong Hui in a last bid to restore his kingdom; the plot failed and he was killed.',
  },
  'pang-tong': {
    era: { zh: '凤雏', en: 'The Young Phoenix' },
    zh: '字士元,襄阳人。 与诸葛齐名,水镜先生云:"卧龙凤雏,得一可安天下。" 献连环计于曹营,后归刘备,落凤坡中箭而亡。',
    en: 'Style name Shiyuan, of Xiangyang. Reckoned the equal of Zhuge Liang — Sima Hui said, "Of the Sleeping Dragon and the Young Phoenix, one is enough to settle the realm." He devised the Chain Stratagem for Cao Cao\'s navy; later he served Liu Bei and fell at Phoenix Slope, struck through by an arrow.',
  },
  'dian-wei': {
    zh: '字号"古之恶来",曹操亲卫。 双戟八十斤,有万夫不当之勇。 宛城之变中为护曹操脱身,死战不退,身被数十创而绝。',
    en: 'Nicknamed "the new E Lai" after a legendary brawler of antiquity, he was Cao Cao\'s personal guard. He wielded twin halberds weighing eighty jin and had the courage to face ten thousand. In the mutiny at Wancheng he held the gate so Cao Cao could escape, dying upright under dozens of wounds.',
  },
  'xu-chu': {
    era: { zh: '虎痴', en: 'Tiger Idiot' },
    zh: '字仲康,谯县人。 力大无穷,曾倒拖牛尾百步。 曹操亲卫长。 与马超大战二百合不分胜负,赤膊力斗,以勇名重于世。',
    en: 'Style name Zhongkang, of Qiao. So strong he once dragged a bull a hundred paces by its tail. Captain of Cao Cao\'s personal guard. He fought Ma Chao to a draw for two hundred bouts, stripped to the waist, and was famed throughout the world for sheer brawn.',
  },
  'gan-ning': {
    era: { zh: '锦帆贼', en: 'The Brocade Pirate' },
    zh: '字兴霸,巴郡临江人。 少年游侠,以锦帆系船。 后归孙权。 百骑劫魏营,孙权叹:"孟德有张辽,孤有兴霸,足相敌也!"',
    en: 'Style name Xingba, of Linjiang in Ba. In his youth a river-knight whose boat trailed a banner of brocade. He went over to Sun Quan; with a hundred riders he raided the Wei camp at night. Sun Quan said: "Mengde has Zhang Liao, I have Xingba — we are matched."',
  },
  'taishi-ci': {
    zh: '字子义,东莱黄人。 神射手,与孙策一场酣战至于胫骨皆露。 后归孙策,镇守东莱,病卒。 临终叹:"大丈夫生于乱世,当带三尺剑,立不世之功!"',
    en: 'Style name Ziyi, of Huang in Donglai. A peerless archer who once fought Sun Ce until their leg bones showed through the wounds. He went over to Sun Ce, garrisoned Donglai, and died of illness. His last words: "A man born in a chaotic age should bear a three-foot sword and raise an immortal deed!"',
  },
  'lu-meng': {
    era: { zh: '士别三日,即更刮目相待', en: 'Three days apart, look at him with new eyes' },
    zh: '字子明,汝南富陂人。 少时不学,孙权劝学,刻苦自励,日积月累遂成大器。 白衣渡江,袭取荆州,擒杀关羽。',
    en: 'Style name Ziming, of Fupi in Runan. As a young man he never studied; Sun Quan urged him to read, and he applied himself until he became a great commander. In a white-robed crossing he took Jingzhou by surprise and captured Guan Yu.',
  },
  'lu-xun': {
    zh: '字伯言,吴郡吴县人。 出身江东大族。 夷陵之战,以白面书生之姿火烧连营七百里,大破刘备。 后任丞相,辅佐孙权。',
    en: 'Style name Boyan, of Wu county in Wujun. A young scholar of a great Jiangdong house. At Yiling he burned through seven hundred li of Liu Bei\'s linked camps and crushed the host of Shu. He rose to chancellor and steered the realm under Sun Quan.',
  },
  'diaochan': {
    era: { zh: '貂蝉', en: 'Diaochan' },
    zh: '王允义女,容貌倾国。 司徒以连环之计,使吕布，董卓父子反目。 凤仪亭一变,董卓死,汉室得苏。 四大美人之一。',
    en: 'Adopted daughter of Wang Yun, of nation-toppling beauty. The Minister wove the Chain Stratagem with her, turning the foster-son Lü Bu against the tyrant Dong Zhuo. In the moment at Phoenix Pavilion the tyrant fell and the Han line breathed again. One of the four classical beauties of China.',
  },
  'huang-yueying': {
    zh: '诸葛亮之妻,黄承彦之女。 容貌虽不出众,而才识过人。 善制木牛流马，连弩等机械,助孔明经天纬地。',
    en: "Wife of Zhuge Liang, daughter of Huang Chengyan. Not beautiful in face, but matchless in talent and learning. She devised the Wooden Ox and Flowing Horse carts, the repeating crossbow, and other machines, helping Kongming weave together heaven and earth.",
  },
  'dong-zhuo': {
    zh: '字仲颖,陇西临洮人。 凉州军阀,何进招其入京。 废少帝,立献帝,焚洛阳迁长安。 残暴无道,司徒王允以连环计使吕布手刃之。',
    en: 'Style name Zhongying, of Lintao in Longxi. A warlord of Liang province summoned to the capital by He Jin. He deposed the young emperor, raised Emperor Xian, and burned Luoyang to flee to Chang\'an. So tyrannical that Wang Yun wove the Chain Stratagem to have Lü Bu strike him down.',
  },
  'yuan-shao': {
    zh: '字本初,汝南汝阳人。 四世三公之家。 起兵讨董卓,众推为盟主。 后据河北,势力最盛。 官渡之战为曹操所破,郁郁而终。',
    en: 'Style name Benchu, of Ruyang in Runan. Of a family that held the Three Excellencies for four generations. He led the coalition against Dong Zhuo and was acclaimed its leader. Master of the north and most powerful warlord of his day, he was broken by Cao Cao at Guandu and died in despair.',
  },
  'yuan-shu': {
    zh: '字公路,袁绍异母弟。 据淮南。 得传国玉玺即僭号称帝,众叛亲离,呕血而死。',
    en: 'Style name Gonglu, half-brother of Yuan Shao. Master of Huainan. When the imperial seal came to him he proclaimed himself emperor; the world turned away, and he died vomiting blood.',
  },
  'xiahou-dun': {
    zh: '字元让,曹操族兄弟。 与吕布军战时被流矢射中左眼,自拔之吞食,曰:"父精母血,不可弃也!" 后世称"独眼夏侯"。',
    en: 'Style name Yuanrang, cousin of Cao Cao. Struck in the left eye by a stray arrow in the fight with Lü Bu, he pulled the shaft out — eye and all — and swallowed it, crying: "Father\'s seed, mother\'s blood — I cannot throw these away!" Forever after, the One-Eyed Xiahou.',
  },
  'guo-jia': {
    era: { zh: '鬼才', en: 'The Ghost-Talent' },
    zh: '字奉孝,颍川阳翟人。 曹操第一谋主,十胜十败论奠定北征方略。 三十八岁早逝,曹操痛哭:"若奉孝在,孤不至于此!"',
    en: 'Style name Fengxiao, of Yangzhai in Yingchuan. Cao Cao\'s chief counselor. His "Ten Victories, Ten Defeats" memorial set the strategy for the conquest of the north. He died at thirty-eight; Cao Cao wept: "If Fengxiao were alive, I would not have come to this!"',
  },
  'xun-yu': {
    zh: '字文若,颍川颍阴人。 王佐之才,曹操称之"吾之子房"。 助曹定都许昌，迎天子,运筹帷幄二十年。 后因反对曹操称魏公,郁郁而终。',
    en: 'Style name Wenruo, of Yingyin in Yingchuan. "A talent fit to assist a king" — Cao Cao called him "my Zifang." He helped Cao set the capital at Xuchang, escort the emperor, and steered grand strategy for twenty years. Opposing the elevation of Cao to Duke of Wei, he sank into despair and died.',
  },
  'jia-xu': {
    era: { zh: '毒士', en: 'The Poisonous Counselor' },
    zh: '字文和,武威姑臧人。 算无遗策,屡换其主而善终。 助贾诩献离间之计破马超，计败张绣，保曹丕嗣位。',
    en: 'Style name Wenhe, of Guzang in Wuwei. His strategies never miscarried, and he served many lords yet died in his bed. He sowed division between Ma Chao and Han Sui, broke Zhang Xiu through a trick, and secured Cao Pi as heir of Wei.',
  },
  'hua-tuo': {
    zh: '沛国谯县人,世称神医。 创麻沸散,行外科手术。 曹操患头风请之治,华佗欲开颅,曹操疑其谋害而杀之。 临终焚医书,世人惜哉。',
    en: 'Of Qiao in Pei, called the Divine Physician. He devised the Mafei powder, the world\'s first anaesthetic, and performed surgery. Summoned to treat Cao Cao\'s headaches, he proposed opening the skull; Cao Cao suspected murder and had him killed. At his death he burned his medical books — the world has mourned him ever since.',
  },
  'lu-su': {
    zh: '字子敬,临淮东城人。 江东重臣,主张联刘抗曹,促成赤壁之盟。 一生倡导孙刘联合,深谋远略。',
    en: 'Style name Zijing, of Dongcheng in Linhuai. A pillar of the Wu court. He pressed for the alliance with Liu Bei against Cao Cao that won the Red Cliffs. All his life he argued for unity between Sun and Liu — a deep and far-seeing strategist.',
  },
  'cao-pi': {
    era: { zh: '魏文帝', en: 'Emperor Wen of Wei' },
    zh: '字子桓,曹操次子。 废献帝而代之,建立曹魏。 工于诗赋,与建安七子齐名。 七步逼弟曹植,留下"煮豆燃豆萁"之千古名篇。',
    en: 'Style name Zihuan, second son of Cao Cao. He deposed Emperor Xian of Han and founded Wei. Skilled in poetry, he stood among the Seven Masters of Jian\'an. He gave his brother Cao Zhi seven paces to compose a poem on pain of death — and so was born the immortal verse of beans burning by their own stalks.',
  },
  'cao-zhi': {
    zh: '字子建,曹操三子。 才高八斗,与曹操，曹丕并称三曹。 七步成诗:"煮豆燃豆萁,豆在釜中泣;本是同根生,相煎何太急!"',
    en: 'Style name Zijian, third son of Cao Cao. Of him it was said: "If the world\'s talent be ten dou, Zijian holds eight." With his father and brother he made up the Three Caos of letters. His seven-step poem: "Beans burn over a fire of bean-stalks / the beans in the pot are weeping / both grew from one root — / why must we devour each other so fast?"',
  },
  'wang-yun': {
    zh: '字子师,太原祁县人。 汉室忠臣,假女貂蝉施连环计,使吕布刺杀董卓。 后被李傕，郭汜攻陷长安,自焚而死。',
    en: 'Style name Zishi, of Qi in Taiyuan. A loyal minister of Han. Through his ward Diaochan he wove the Chain Stratagem and had Lü Bu strike down Dong Zhuo. When Li Jue and Guo Si seized Chang\'an, he threw himself into the flames.',
  },
  'zhang-jiao': {
    era: { zh: '大贤良师', en: 'The Great Worthy Teacher' },
    zh: '钜鹿人。 创太平道,以符水治病传教,聚徒数十万。 中平元年,以"苍天已死,黄天当立"为号起义,黃巾之乱遂起。 数月后病死。',
    en: 'Of Julu. Founder of the Way of Great Peace, healing with talisman-water and gathering hundreds of thousands of converts. In the first year of Zhongping he raised his rebellion under the slogan "The Blue Heaven is dead, the Yellow Heaven shall stand" — and the Yellow Turbans rose. Within months he died of illness.',
  },
  'meng-huo': {
    zh: '南蛮王。 诸葛亮南征,七擒七纵,使其心服。 自此南方归附,蜀汉再无后顾之忧。',
    en: 'King of the Nanman. In Zhuge Liang\'s southern campaign he was captured seven times and released seven times, until at the seventh his heart bent. From then the south was loyal, and Shu had no need to look behind.',
  },
  'deng-ai': {
    era: { zh: '滅蜀名將', en: 'Conqueror of Shu' },
    zh: '字士載,義陽棘陽人。 少時口吃,以屯田起家,而胸藏萬甲。 平定淮南文欽之亂,挫姜維於洮西。 偷渡陰平七百里,翻越摩天嶺,奇兵入蜀,迫劉禪降。 一生未敗。 終為鍾會構陷,父子俱死於亂中。',
    en: 'Style name Shizai, of Jiyang in Yiyang. He stuttered as a boy and rose from farming the military colonies, but his chest held ten thousand schemes. He put down Wen Qin\'s revolt at Huainan, broke Jiang Wei at Taoxi, and made his immortal march — seven hundred li by goat-track through Yinping, crossing Motian Ridge into the heart of Shu — and forced the second emperor to bow. He never lost a battle. In the end Zhong Hui framed him, and father and son both died in the chaos.',
    quote: { zh: '士為知己者死。', en: 'A man will die for one who knows him.' },
  },
  'zhong-hui': {
    zh: '字士季,潁川長社人。 鍾繇之少子,才氣縱橫。 與鄧艾共滅蜀,而後欲據蜀自立,聯姜維起兵。 事敗,死於亂兵之中,年四十。',
    en: 'Style name Shiji, of Changshe in Yingchuan. Youngest son of Zhong Yao, a man of dazzling talent. With Deng Ai he conquered Shu, then schemed to hold it for himself and rose with Jiang Wei. The plot failed; he died in the mutiny at forty.',
  },
  'sima-shi': {
    era: { zh: '景皇帝', en: 'Emperor Jing of Jin' },
    zh: '字子元,司馬懿長子。 高平陵之變後執政,平王凌之亂，擒毋丘儉,以陰柔之術駕馭士林。 後司馬昭得以順承其志,終成晉室。',
    en: 'Style name Ziyuan, eldest son of Sima Yi. After the Gaopingling coup he took the regency. He crushed the revolt of Wang Ling, captured Guanqiu Jian, and bent the gentry to his will by quiet hands. His brother Sima Zhao would carry his designs forward — and his nephew would found Jin.',
  },
  'sima-zhao': {
    era: { zh: '文皇帝', en: 'Emperor Wen of Jin' },
    zh: '字子上,司馬懿次子。 兄死後執政。 鎮諸葛誕之叛，攬鄧艾鍾會以滅蜀。 弒高貴鄉公曹髦,獨攬大權。 「司馬昭之心,路人皆知。」',
    en: 'Style name Zishang, second son of Sima Yi. He took power after his brother died. He crushed Zhuge Dan\'s revolt, gathered Deng Ai and Zhong Hui to swallow Shu, and finally killed the Duke of Gaogui — Emperor Mao — to clear the throne for his son. "The heart of Sima Zhao is known even to passersby."',
  },
  'guo-huai': {
    zh: '字伯濟,太原陽曲人。 鎮守關西二十年,屢挫蜀漢北伐。 大破馬岱，姜維,鎮羌氐諸部安如磐石。',
    en: 'Style name Boji, of Yangqu in Taiyuan. Twenty years he held the western marches, blunting every Shu northern campaign. He broke Ma Dai and Jiang Wei, and held the Qiang and Di tribes to peace like an unmoved rock.',
  },
  'hao-zhao': {
    zh: '字伯道,太原人。 守陳倉,以千餘兵拒諸葛亮數萬之師二十餘日。 諸葛糧盡而退,自此名動天下。',
    en: 'Style name Bodao, of Taiyuan. Holding Chencang with barely a thousand men, he stood off Zhuge Liang\'s tens of thousands for over twenty days. When Zhuge\'s grain ran out and the army withdrew, Hao Zhao\'s name was known throughout the realm.',
  },
  'liao-hua': {
    era: { zh: '蜀漢之忠', en: "Shu's Faithful Veteran" },
    zh: '字元儉,襄陽人。 始隨關羽守荊州,後事先主，後主。 「蜀中無大將,廖化作先鋒。」 一生轉戰三世,八十而戰不衰。',
    en: 'Style name Yuanjian, of Xiangyang. He first followed Guan Yu at Jingzhou, then served both First and Second Emperors of Shu. They said: "When Shu has no great general, Liao Hua takes the van." Through three reigns he marched, still in the field at eighty.',
  },
  'guan-xing': {
    zh: '關羽次子。 隨諸葛亮南征北伐,屢立戰功。 早卒,蜀漢痛失一柱。',
    en: 'Second son of Guan Yu. He followed Zhuge Liang through the southern and northern campaigns, with many honors. He died young — Shu lost a pillar before it was full-grown.',
  },
  'zhang-bao': {
    zh: '張飛長子。 武勇似父,從諸葛亮北伐。 興勢山道墜馬,傷重而卒,孔明聞之失聲。',
    en: 'Eldest son of Zhang Fei. As fierce as his father, he marched with Zhuge Liang on the northern campaigns. At Xingshi mountain he fell from his horse and died of the wounds; when the word reached Zhuge Liang, the Prime Minister cried out.',
  },
  'ma-dai': {
    zh: '馬騰族姪,馬超之弟。 隨馬超歸蜀。 諸葛亮死後,奉遺命斬叛將魏延於漢中。',
    en: 'Nephew of Ma Teng, younger kinsman of Ma Chao. He went with Ma Chao into Shu. After Zhuge Liang\'s death, by his dying order, he cut down the rebel Wei Yan at Hanzhong.',
  },
  'yan-yan': {
    zh: '巴郡太守。 張飛入蜀,生擒之。 嚴顏抗曰:「我州但有斷頭將軍,無有降將軍!」 張飛敬之,釋而禮之。',
    en: 'Governor of Bajun. When Zhang Fei broke into Shu, he was captured alive. Defiant: "In this province there are only generals who lose their heads — never generals who surrender!" Zhang Fei honored him, freed him, and received him as a peer.',
  },
  'zhuge-jin': {
    zh: '字子瑜,諸葛亮長兄。 事孫權四十年,以誠信稱。 兩弟分仕魏蜀吳三家,不通私訊,公私分明。',
    en: 'Style name Ziyu, elder brother of Zhuge Liang. For forty years he served Sun Quan and was known for sincerity. His two brothers served Wei, Shu, and Wu in turn — yet he passed no private word between them. Public and private were strictly separated.',
  },
  'zhuge-ke': {
    zh: '字元遜,諸葛瑾長子。 才思過人而剛愎自用。 平山越，伐魏,初勝後敗,終為孫峻所殺,夷三族。',
    en: 'Style name Yuanxun, eldest son of Zhuge Jin. His wit was beyond men\'s, but he was stubborn and self-willed. He pacified the Shan Yue, then marched on Wei — won at first, lost at last. Sun Jun killed him and wiped out three branches of his clan.',
  },
  'zhong-yao': {
    era: { zh: '書聖', en: 'Sage of Calligraphy' },
    zh: '字元常,潁川長社人。 漢魏間名臣,亦書法宗師,小楷之祖。 鎮關中安羌渾,曹操譽其有蕭何之功。',
    en: 'Style name Yuanchang, of Changshe in Yingchuan. A great minister bridging Han and Wei, and the founding master of regular-script calligraphy. He held the Guanzhong region steady and quieted the Qiang; Cao Cao said his merit equaled Xiao He\'s.',
  },
  'chen-qun': {
    zh: '字長文,潁川許昌人。 制九品中正,定百年選官之制。 魏室棟梁,直諫曹丕，曹叡,稱賢相。',
    en: 'Style name Changwen, of Xu in Yingchuan. He established the Nine-rank System, which would govern official appointments for a hundred years. A pillar of Wei, he remonstrated with both Cao Pi and Cao Rui and was called a worthy chancellor.',
  },
  'yang-xiu': {
    zh: '字德祖,弘農華陰人。 才思敏捷,曹操謀士,常解其心意而招忌。 「雞肋」之語,終被曹操所殺。',
    en: "Style name Dezu, of Huayin in Hongnong. So nimble of mind that Cao Cao's hidden meanings could not stay hidden from him — which earned him hatred. When he read Cao Cao's password 'chicken-ribs' as a sign the campaign was finished, Cao Cao at last had him executed.",
  },
  // ─── 歷代名將 (Historical Officers, 14 dynasties) ───
  ...HISTORICAL_BIOGRAPHIES,
};

/**
 * Procedural fallback bio for officers we haven't hand-written. Looks at their
 * highest stat and assembles a plausible one-liner.
 */
export function deriveBiography(stats: {
  leadership: number;
  war: number;
  intelligence: number;
  politics: number;
  charisma: number;
}, nameEn: string, nameZh: string): OfficerBiography {
  const best = Object.entries(stats).sort(([, a], [, b]) => b - a)[0];
  const archetype = best[0];
  const lookup: Record<string, OfficerBiography> = {
    war: {
      zh: `${nameZh},以武勇知名于乱世。三国群雄之中,堪当一阵之将。`,
      en: `${nameEn} is renowned for martial prowess. Among the heroes of his age, he can stand at the head of a host.`,
    },
    leadership: {
      zh: `${nameZh},统兵有方,治军严明,堪为一方将才。`,
      en: `${nameEn} commands troops well — strict in discipline, a worthy general for a region.`,
    },
    intelligence: {
      zh: `${nameZh},智谋深远,出策无差,是难得的谋士。`,
      en: `${nameEn} is deep in counsel and his strategies seldom miscarry — a rare strategist.`,
    },
    politics: {
      zh: `${nameZh},长于内政,治民有术,实为一郡之贤。`,
      en: `${nameEn} excels at internal affairs and the governance of the people — a virtuous official for a commandery.`,
    },
    charisma: {
      zh: `${nameZh},为人魅力非凡,所至从者如云。`,
      en: `${nameEn} has extraordinary charisma; wherever he goes, followers gather like clouds.`,
    },
  };
  return lookup[archetype] ?? lookup.leadership;
}

export function getBiography(
  officerId: string,
  nameEn: string,
  nameZh: string,
  stats: Parameters<typeof deriveBiography>[0],
): OfficerBiography {
  return BIOGRAPHIES[officerId] ?? deriveBiography(stats, nameEn, nameZh);
}
