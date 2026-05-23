import type { DialogueEvent } from '../types';

/**
 * Random dialogue events — roll a small chance each season for one of these
 * to fire. Most are flavor; a few have meaningful mechanical effects.
 *
 * The roller filters by year and optional flag/officer conditions, then
 * picks uniformly among the eligible.
 */
export const DIALOGUE_EVENTS: DialogueEvent[] = [
  {
    id: 'dlg-drunken-brawl',
    speaker: { zh: '報告係', en: 'Court Messenger' },
    text: {
      zh: '兩將酒席相爭。一方刃傷沙汰寸前。',
      en: 'Two of your generals brawled at a banquet — blades were nearly drawn.',
    },
    choices: [
      {
        label: { zh: '両者罰', en: 'Punish both' },
        effects: [{ kind: 'gold', delta: -50 }],
        outcome: { zh: '両者降格,軍規確立。', en: 'Both demoted. Discipline restored.' },
      },
      {
        label: { zh: '不問', en: 'Let it pass' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '醉漢相鬥，無甚要緊', en: 'Just drunkards quarreling. Forgotten by dawn.' },
      },
      {
        label: { zh: '沒收酒水', en: 'Confiscate the wine' },
        effects: [{ kind: 'gold', delta: 30 }],
        outcome: { zh: '酒水變賣,30金，入庫。', en: 'The wine was sold — 30 gold to the treasury.' },
      },
    ],
  },
  {
    id: 'dlg-omen-comet',
    speaker: { zh: '天文官', en: 'Court Astronomer' },
    text: {
      zh: '彗星出現，古云,「彗者，改之象也」。',
      en: 'A comet has appeared. The ancients say: "the broom-star foretells change."',
    },
    choices: [
      {
        label: { zh: '宣為吉兆', en: 'Proclaim it a good omen' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '民眾以為新世將至，喜形於色', en: 'The people rejoice — a new age begins!' },
      },
      {
        label: { zh: '黙殺', en: 'Ignore it' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '視為占星家妄言。', en: 'Dismissed as the astronomer\'s rambling.' },
      },
    ],
  },
  {
    id: 'dlg-bandit-offer',
    speaker: { zh: '使者', en: 'Messenger' },
    text: {
      zh: '山賊,金200，付則退前來。',
      en: 'A bandit chieftain offers to disperse his forces for 200 gold.',
    },
    choices: [
      {
        label: { zh: '払', en: 'Pay' },
        effects: [{ kind: 'gold', delta: -200 }],
        outcome: { zh: '山賊如約而退。', en: 'The bandits disperse — as promised, this time.' },
      },
      {
        label: { zh: '討伐', en: 'Hunt them down' },
        effects: [{ kind: 'troops', cityId: '', delta: -300 }],
        outcome: { zh: '討伐隊損耗,然而山賊根絶。', en: 'Casualties taken, but the bandits are gone.' },
      },
      {
        label: { zh: '無視', en: 'Ignore' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '將來,後悔亦未可知。', en: 'May come back to haunt you.' },
      },
    ],
  },
  {
    id: 'dlg-poet-gift',
    speaker: { zh: '老詩人', en: 'Old Poet' },
    text: {
      zh: '名之詩人,君主獻詩，前來敬獻。',
      en: 'A renowned poet has come to offer verses to your court.',
    },
    choices: [
      {
        label: { zh: '黄金報', en: 'Reward with gold' },
        effects: [{ kind: 'gold', delta: -100 }],
        outcome: { zh: '詩人欣喜,君主之名,傳於後世。', en: 'The poet is delighted. Your name will live in his verses.' },
      },
      {
        label: { zh: '僅奉茶', en: 'Just tea' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '詩人静帰。', en: 'The poet leaves quietly.' },
      },
    ],
  },
  {
    id: 'dlg-rain-pour',
    speaker: { zh: '農吏', en: 'Agriculture Official' },
    text: {
      zh: '今春,雨充沛。収穫之兆豐。',
      en: 'This spring has brought generous rains. The harvest will be bountiful.',
    },
    choices: [
      {
        label: { zh: '農夫，褒', en: 'Reward the farmers' },
        effects: [{ kind: 'gold', delta: -50 }],
        outcome: { zh: '農民之忠誠,目見上升。', en: 'Farmer loyalty rises visibly.' },
      },
      {
        label: { zh: '感謝之', en: 'Just thanks' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '農民感激吧。', en: 'The farmers will be satisfied.' },
      },
    ],
  },
  {
    id: 'dlg-orphan-petition',
    speaker: { zh: '孤児', en: 'Orphan' },
    text: {
      zh: '戰災孤児們宮殿之前聚集。狀甚悲憫。',
      en: 'Orphans of war gather at your palace gates — wretched.',
    },
    choices: [
      {
        label: { zh: '救済', en: 'Establish a relief fund' },
        effects: [{ kind: 'gold', delta: -150 }],
        outcome: { zh: '民之声,讚譽四起。', en: 'The people sing your praise.' },
      },
      {
        label: { zh: '追払', en: 'Have them driven away' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '民衆,失望。', en: 'The people are disappointed.' },
      },
    ],
  },
  {
    id: 'dlg-merchant-deal',
    speaker: { zh: '商人', en: 'Travelling Merchant' },
    text: {
      zh: '西域之商人,珍宝，兜售。',
      en: 'A merchant from the Western Regions offers rare treasures.',
    },
    choices: [
      {
        label: { zh: '購入', en: 'Buy' },
        effects: [{ kind: 'gold', delta: -300 }],
        outcome: { zh: '宝物國庫，飾。', en: 'The treasures enrich your court.' },
      },
      {
        label: { zh: '断', en: 'Decline' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '商人去。', en: 'The merchant moves on.' },
      },
    ],
  },
  {
    id: 'dlg-wandering-monk',
    speaker: { zh: '行脚僧', en: 'Wandering Monk' },
    text: {
      zh: '老僧一夜之宿，求宿。',
      en: 'An old monk seeks shelter for the night.',
    },
    choices: [
      {
        label: { zh: '迎入', en: 'Welcome him' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '夜,僧禅，講解。心,清明。', en: 'In the night, the monk speaks of Zen. Your heart is at peace.' },
      },
      {
        label: { zh: '追払', en: 'Turn him away' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '僧黙去。', en: 'The monk leaves in silence.' },
      },
    ],
  },

  // ─── Phase 34 expansion ─────────────────────────────────────
  {
    id: 'dlg-eunuch-favor',
    speaker: { zh: '宦官', en: 'Court Eunuch' },
    text: {
      zh: '宦官動前來,賄賂換取某官位之推薦，暗中提議。',
      en: 'A eunuch quietly offers to recommend a promotion in exchange for a bribe.',
    },
    choices: [
      { label: { zh: '断固拒否', en: 'Refuse outright' },   effects: [{ kind: 'none' }],
        outcome: { zh: '宦官,顔色，失色而去。良心得保。', en: 'The eunuch leaves, displeased. But your conscience is clean.' } },
      { label: { zh: '受入', en: 'Accept' },           effects: [{ kind: 'gold', delta: -300 }],
        outcome: { zh: '官位，得,評判蒙塵。', en: 'You gained the position — but your reputation is shadowed.' } },
    ],
  },
  {
    id: 'dlg-prophet',
    speaker: { zh: '街頭童謠', en: 'Street Children' },
    text: {
      zh: '街頭童謠:「東風起時,赤雲便起」。 或為不祥之兆？',
      en: 'A street rhyme: "When the east wind blows, red clouds rise." A prophecy?',
    },
    choices: [
      { label: { zh: '禁', en: 'Ban the rhyme' },   effects: [{ kind: 'none' }],
        outcome: { zh: '童們改唱別歌，歌始。', en: 'The children find a new tune.' } },
      { label: { zh: '聞流', en: 'Ignore it' }, effects: [{ kind: 'none' }],
        outcome: { zh: '童謡廣傳,民之不安愈深。', en: 'The rhyme spreads. Unease grows in the streets.' } },
    ],
  },
  {
    id: 'dlg-falling-star',
    speaker: { zh: '天文官', en: 'Astronomer' },
    text: {
      zh: '昨夜,西方大星墜了。古曰,「将星墜」。',
      en: 'A great star fell in the west last night. The ancients say: "a general\'s star falls."',
    },
    choices: [
      { label: { zh: '緘口令', en: 'Suppress the news' }, effects: [{ kind: 'none' }],
        outcome: { zh: '士気保。', en: 'Morale stays intact.' } },
      { label: { zh: '占，', en: 'Divine its meaning' }, effects: [{ kind: 'gold', delta: -50 }],
        outcome: { zh: '占者「敵将凶」告。', en: 'The diviner: "an ill omen — for the enemy."' } },
    ],
  },
  {
    id: 'dlg-stray-dog',
    speaker: { zh: '老農', en: 'Old Farmer' },
    text: {
      zh: '宮殿之門虎之大犬現身了。 主君,?',
      en: 'A great tiger-like dog appeared at the palace gate. My lord, what could it mean?',
    },
    choices: [
      { label: { zh: '飼', en: 'Keep it' },   effects: [{ kind: 'gold', delta: -30 }],
        outcome: { zh: '犬,殿中従。庶民,主公之徳，称。', en: 'The dog follows you in. People praise your virtue.' } },
      { label: { zh: '追払', en: 'Drive it away' }, effects: [{ kind: 'none' }],
        outcome: { zh: '犬,森消。', en: 'The dog vanishes into the forest.' } },
    ],
  },
  {
    id: 'dlg-traveling-doctor',
    speaker: { zh: '游医', en: 'Wandering Physician' },
    text: {
      zh: '医者,珍薬草，兜售。 兵之傷，癒申。',
      en: 'A physician offers rare herbs that he claims will heal soldiers\' wounds.',
    },
    choices: [
      { label: { zh: '購入', en: 'Buy' },          effects: [{ kind: 'gold', delta: -200 }],
        outcome: { zh: '今後,兵之回復早。', en: 'Soldiers heal faster in the coming seasons.' } },
      { label: { zh: '疑', en: 'Suspicious — refuse' }, effects: [{ kind: 'none' }],
        outcome: { zh: '医者,失望去。', en: 'The physician departs disappointed.' } },
    ],
  },
  {
    id: 'dlg-frontier-tribe',
    speaker: { zh: '辺境之使者', en: 'Frontier Envoy' },
    text: {
      zh: '辺境之異民族之首長,贡物換取通商，求前來。',
      en: 'A tribal chieftain from the frontier offers tribute in exchange for trade rights.',
    },
    choices: [
      { label: { zh: '許可', en: 'Grant trade' }, effects: [{ kind: 'gold', delta: 200 }],
        outcome: { zh: '貢物毛皮，得。', en: 'You receive tribute and furs.' } },
      { label: { zh: '拒否', en: 'Refuse' },     effects: [{ kind: 'none' }],
        outcome: { zh: '使者,憤去。', en: 'The envoy departs in anger.' } },
    ],
  },
  {
    id: 'dlg-spy-rumor',
    speaker: { zh: '錦衣衛', en: 'Captain of the Guard' },
    text: {
      zh: '宮殿内密偵潜伏中之傳言。 捜査，命？',
      en: 'Rumor says a spy lurks within the palace. Order an investigation?',
    },
    choices: [
      { label: { zh: '徹底捜査', en: 'Full investigation' }, effects: [{ kind: 'gold', delta: -150 }],
        outcome: { zh: '密偵，捕。 機密守。', en: 'The spy is caught. Secrets remain ours.' } },
      { label: { zh: '無視', en: 'Dismiss the rumor' }, effects: [{ kind: 'none' }],
        outcome: { zh: '平安無事…或許。', en: 'Nothing happens. Probably.' } },
    ],
  },
  {
    id: 'dlg-festival',
    speaker: { zh: '礼部官', en: 'Minister of Rites' },
    text: {
      zh: '春節近。 民祭礼之費用，懇請。',
      en: 'The Spring Festival approaches. The people petition for festival funding.',
    },
    choices: [
      { label: { zh: '盛大祝', en: 'Lavish festival' }, effects: [{ kind: 'gold', delta: -500 }],
        outcome: { zh: '民欣喜,君主，讃。', en: 'The people rejoice and praise their lord.' } },
      { label: { zh: '質素', en: 'A simple celebration' }, effects: [{ kind: 'gold', delta: -100 }],
        outcome: { zh: '民感激。', en: 'The people are content.' } },
      { label: { zh: '見送', en: 'Skip it' }, effects: [{ kind: 'none' }],
        outcome: { zh: '不満之声漏。', en: 'Murmurs of discontent.' } },
    ],
  },
  {
    id: 'dlg-tax-collector',
    speaker: { zh: '徴税官', en: 'Tax Collector' },
    text: {
      zh: '徴税官:「今年不作。 減免，考慮？」',
      en: 'Tax collector: "The harvest was poor. Consider a tax reduction?"',
    },
    choices: [
      { label: { zh: '減税', en: 'Reduce taxes' },     effects: [{ kind: 'gold', delta: -200 }],
        outcome: { zh: '民之忠誠深。', en: 'The people\'s loyalty deepens.' } },
      { label: { zh: '取立', en: 'Collect in full' }, effects: [{ kind: 'gold', delta: 200 }],
        outcome: { zh: '金庫潤,民之心離。', en: 'The treasury swells, but the people grow cold.' } },
    ],
  },
  {
    id: 'dlg-locust-swarm',
    speaker: { zh: '農吏', en: 'Field Officer' },
    text: {
      zh: '南方蝗害之報。 至急,対策，要。',
      en: 'A locust plague hits the southern fields. Urgent action needed.',
    },
    choices: [
      { label: { zh: '兵，派遣', en: 'Send troops to control it' }, effects: [{ kind: 'gold', delta: -250 }],
        outcome: { zh: '蝗害,沈静化。', en: 'The plague is contained.' } },
      { label: { zh: '放任', en: 'Do nothing' }, effects: [{ kind: 'none' }],
        outcome: { zh: '田畑荒。', en: 'Fields lie ruined.' } },
    ],
  },
  {
    id: 'dlg-foreign-scholar',
    speaker: { zh: '異国之学者', en: 'Foreign Scholar' },
    text: {
      zh: '西域来学者,君主之宮廷職，求宿。',
      en: 'A scholar from the Western Regions seeks employment at your court.',
    },
    choices: [
      { label: { zh: '採用', en: 'Hire him' },         effects: [{ kind: 'gold', delta: -150 }],
        outcome: { zh: '宮廷之知識増。', en: 'Your court grows in learning.' } },
      { label: { zh: '断', en: 'Decline' },         effects: [{ kind: 'none' }],
        outcome: { zh: '学者別所，求去。', en: 'The scholar seeks elsewhere.' } },
    ],
  },
  {
    id: 'dlg-dragon-sighting',
    speaker: { zh: '漁師', en: 'Fisherman' },
    text: {
      zh: '川辺之漁師們,「黄龍，見」興奮不已。',
      en: 'Fishermen claim they saw a "yellow dragon" in the river.',
    },
    choices: [
      { label: { zh: '吉兆宣告', en: 'Proclaim a good omen' }, effects: [{ kind: 'none' }],
        outcome: { zh: '民,主公之徳結喜。', en: 'The people link it to your virtue and rejoice.' } },
      { label: { zh: '迷信一蹴', en: 'Dismiss as superstition' }, effects: [{ kind: 'none' }],
        outcome: { zh: '老臣們少失望。', en: 'Old courtiers seem disappointed.' } },
    ],
  },
  {
    id: 'dlg-runaway-prince',
    speaker: { zh: '巷之話題', en: 'Local Gossip' },
    text: {
      zh: '隣国之若君出奔,我領内紛込噂。',
      en: 'A rumor: a young prince from a neighboring realm has fled and is hiding in your domain.',
    },
    choices: [
      { label: { zh: '捜索保護', en: 'Search and shelter him' }, effects: [{ kind: 'gold', delta: -200 }],
        outcome: { zh: '若君，見,人質。', en: 'You find him — and now hold a hostage.' } },
      { label: { zh: '關涉不', en: 'Stay out of it' }, effects: [{ kind: 'none' }],
        outcome: { zh: '何事。', en: 'Nothing comes of it.' } },
    ],
  },
  {
    id: 'dlg-old-soldier',
    speaker: { zh: '老兵', en: 'Old Soldier' },
    text: {
      zh: '老兵宮殿之門現身,「最後之出陣，願」申出。',
      en: 'An old veteran arrives at the palace gates, asking for one last campaign.',
    },
    choices: [
      { label: { zh: '叶', en: 'Grant his request' }, effects: [{ kind: 'none' }],
        outcome: { zh: '老兵涙感謝。', en: 'The veteran weeps in gratitude.' } },
      { label: { zh: '年金，与', en: 'Pension him off' }, effects: [{ kind: 'gold', delta: -100 }],
        outcome: { zh: '老兵,静故郷。', en: 'The veteran returns home, at peace.' } },
    ],
  },
  {
    id: 'dlg-merchant-caravan',
    speaker: { zh: '商隊長', en: 'Caravan Master' },
    text: {
      zh: '商隊領内，通過。 通行税，課？',
      en: 'A merchant caravan passes through your lands. Levy a toll?',
    },
    choices: [
      { label: { zh: '課税', en: 'Tax them' },         effects: [{ kind: 'gold', delta: 150 }],
        outcome: { zh: '商人,渋々払。', en: 'The merchants pay grudgingly.' } },
      { label: { zh: '免除', en: 'Let them pass free' }, effects: [{ kind: 'none' }],
        outcome: { zh: '商人,君主之名，称去。', en: 'The merchants praise your name as they leave.' } },
    ],
  },
  {
    id: 'dlg-comet-second',
    speaker: { zh: '天文官', en: 'Court Astronomer' },
    text: {
      zh: '異星三夜連続現身了。 周易曰,「変動之兆」。',
      en: 'A strange star has appeared three nights running. The Book of Changes warns of upheaval.',
    },
    choices: [
      { label: { zh: '祭祀，行', en: 'Conduct a ritual' }, effects: [{ kind: 'gold', delta: -150 }],
        outcome: { zh: '士気安定。', en: 'Morale steadies.' } },
      { label: { zh: '按兵不動', en: 'Do nothing' }, effects: [{ kind: 'none' }],
        outcome: { zh: '人々不安過。', en: 'People pass anxious days.' } },
    ],
  },
  {
    id: 'dlg-bridge-collapse',
    speaker: { zh: '使者', en: 'Messenger' },
    text: {
      zh: '辺境之橋嵐崩落了。 修復費用二百金。',
      en: 'A frontier bridge has collapsed in the storm. Repairs cost 200 gold.',
    },
    choices: [
      { label: { zh: '修復', en: 'Repair' },          effects: [{ kind: 'gold', delta: -200 }],
        outcome: { zh: '輸送網回復。', en: 'Supply routes restored.' } },
      { label: { zh: '放置', en: 'Leave it' },         effects: [{ kind: 'none' }],
        outcome: { zh: '輸送滞,辺境之不満愈深。', en: 'Trade slows and discontent rises in the borderlands.' } },
    ],
  },
  {
    id: 'dlg-philosopher-debate',
    speaker: { zh: '儒者', en: 'Confucian Scholar' },
    text: {
      zh: '儒者道士宮廷之前論争。 偏袒？',
      en: 'A Confucian and a Daoist argue at your court gate. Take a side?',
    },
    choices: [
      { label: { zh: '儒者，支持', en: 'Side with the Confucian' }, effects: [{ kind: 'none' }],
        outcome: { zh: '儒者之支持，得。', en: 'You gain Confucian support.' } },
      { label: { zh: '道士，支持', en: 'Side with the Daoist' }, effects: [{ kind: 'none' }],
        outcome: { zh: '道家之僧侶之支持，得。', en: 'You gain Daoist support.' } },
      { label: { zh: '中立', en: 'Stay neutral' }, effects: [{ kind: 'none' }],
        outcome: { zh: '両者,不満。', en: 'Both sides leave a little disappointed.' } },
    ],
  },
  {
    id: 'dlg-old-noble-petition',
    speaker: { zh: '長老', en: 'Senior Noble' },
    text: {
      zh: '高齢之重臣引退，懇請。 後任弟子，推薦。',
      en: 'An aged minister asks to retire and recommends his protégé.',
    },
    choices: [
      { label: { zh: '弟子，任命', en: 'Appoint the protégé' }, effects: [{ kind: 'none' }],
        outcome: { zh: '世代交代,円滑進。', en: 'A smooth transition.' } },
      { label: { zh: '辞退，不准', en: 'Refuse the retirement' }, effects: [{ kind: 'none' }],
        outcome: { zh: '老臣,数年仕。', en: 'The old minister serves a few more years.' } },
    ],
  },
  {
    id: 'dlg-foreign-tribute',
    speaker: { zh: '外国使節', en: 'Foreign Envoy' },
    text: {
      zh: '遠国使節,珍奇物産，貢物作為持参了。',
      en: 'An envoy from a distant land arrives with rare goods as tribute.',
    },
    choices: [
      { label: { zh: '厚遇', en: 'Welcome him warmly' }, effects: [{ kind: 'gold', delta: -100 }],
        outcome: { zh: '友好關係築。 名声広。', en: 'A friendship begins. Your fame spreads.' } },
      { label: { zh: '簡素', en: 'Receive him plainly' }, effects: [{ kind: 'none' }],
        outcome: { zh: '使節失望去。', en: 'The envoy leaves disappointed.' } },
    ],
  },
  {
    id: 'dlg-natural-spring',
    speaker: { zh: '農夫', en: 'Farmer' },
    text: {
      zh: '村人:「丘之上霊水湧出了!」 神秘的兆。',
      en: 'Villagers: "A miraculous spring has burst forth on the hill!" A strange omen.',
    },
    choices: [
      { label: { zh: '祠，建', en: 'Build a shrine' }, effects: [{ kind: 'gold', delta: -100 }],
        outcome: { zh: '聖地作為知,巡礼集。', en: 'It becomes a holy site. Pilgrims gather.' } },
      { label: { zh: '一介之泉', en: 'Treat it as ordinary' }, effects: [{ kind: 'none' }],
        outcome: { zh: '村人静崇。', en: 'The villagers quietly venerate it.' } },
    ],
  },

  // ─── Phase 36 — Branching chains ────────────────────────────
  // A choice can set a flag, queue a follow-up dialogue id, or both.
  // The follow-up is fired deterministically the next season.

  // Chain 1: a defector's offer → consequences a season later.
  {
    id: 'dlg-defector-approach',
    speaker: { zh: '密使', en: 'Secret Envoy' },
    text: {
      zh: '敵軍之一将,身一内通，前來。「私，信」。',
      en: 'An enemy general has secretly offered to defect. "Trust me," he pleads.',
    },
    choices: [
      {
        label: { zh: '受入', en: 'Accept his service' },
        effects: [{ kind: 'gold', delta: -200 }, { kind: 'set-flag', flag: 'accepted-defector' }],
        outcome: { zh: '彼，取立。後之展開彼次第。', en: 'You take him in. The next season will tell what kind of man he is.' },
        followupEventId: 'dlg-defector-followup',
      },
      {
        label: { zh: '斬', en: 'Behead him' },
        effects: [{ kind: 'set-flag', flag: 'rejected-defector' }],
        outcome: { zh: '裏切者信。彼之首，晒。', en: 'You trust no turncoat. His head is displayed at the gate.' },
      },
      {
        label: { zh: '送返', en: 'Send him back' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '彼，送返。事終。', en: 'You send him home unharmed. The matter ends here.' },
      },
    ],
  },
  {
    id: 'dlg-defector-followup',
    speaker: { zh: '哨兵', en: 'Sentry' },
    text: {
      zh: '先之降将,夜陰乗陣中之地図，盗逃中，捕了!',
      en: 'The defector from last season — we caught him trying to slip out at night with our camp maps!',
    },
    choices: [
      {
        label: { zh: '処刑見', en: 'Execute as warning' },
        effects: [{ kind: 'gold', delta: -50 }],
        outcome: { zh: '裏切者晒首。臣下之忠誠一段固。', en: 'The traitor is executed publicly. Your retainers stand a little straighter.' },
      },
      {
        label: { zh: '逆偽情報，渡放', en: 'Feed him false intel and release him' },
        effects: [{ kind: 'none' }, { kind: 'set-flag', flag: 'fed-false-intel' }],
        outcome: { zh: '偽之進軍計画，持逃。敵将,毒餌食。', en: 'You let him "escape" with forged battle plans. Time will tell if the enemy bites.' },
      },
    ],
    conditions: { requiresFlag: 'accepted-defector' },
  },

  // Chain 2: a holy mountain hermit → his disciple returns later if you were generous.
  {
    id: 'dlg-hermit-visit',
    speaker: { zh: '老隠者', en: 'Old Hermit' },
    text: {
      zh: '深山下老人,治国之道，説来。「,君之道何処」',
      en: 'An old hermit descends from the mountains to lecture on the Way. "Tell me — where lies your path?"',
    },
    choices: [
      {
        label: { zh: '丁重迎', en: 'Welcome him with full honors' },
        effects: [{ kind: 'gold', delta: -80 }, { kind: 'set-flag', flag: 'honored-hermit' }],
        outcome: { zh: '老人,数日語合満足去。', en: 'The hermit converses for days, then departs satisfied.' },
        followupEventId: 'dlg-hermit-disciple',
      },
      {
        label: { zh: '寒食，出', en: 'Offer him only cold rations' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '老人,黙去。', en: 'The hermit departs without a word.' },
      },
      {
        label: { zh: '追払', en: 'Drive him off' },
        effects: [{ kind: 'set-flag', flag: 'scorned-hermit' }],
        outcome: { zh: '老人,呪言，残去。', en: 'The hermit leaves muttering curses.' },
      },
    ],
  },
  {
    id: 'dlg-hermit-disciple',
    speaker: { zh: '若弟子', en: 'Young Disciple' },
    text: {
      zh: '先之隠者之弟子申者,「師之遺言」参上。眼光鋭,才気明。',
      en: 'A young man arrives saying he is the late hermit\'s disciple. His eyes are sharp; talent is plain.',
    },
    choices: [
      {
        label: { zh: '臣作為召抱', en: 'Take him as a retainer' },
        effects: [{ kind: 'gold', delta: -50 }],
        outcome: { zh: '若才,君之幕下加。', en: 'A new talent joins your camp.' },
      },
      {
        label: { zh: '路銀，渡送', en: 'Give him travel money and send him on' },
        effects: [{ kind: 'gold', delta: -20 }],
        outcome: { zh: '彼,別之主君，求旅立。', en: 'He goes to seek service elsewhere.' },
      },
    ],
    conditions: { requiresFlag: 'honored-hermit' },
  },

  // Chain 3: famine relief → townspeople remember.
  {
    id: 'dlg-famine-village',
    speaker: { zh: '村長', en: 'Village Elder' },
    text: {
      zh: '凶作村人餓。御救，。',
      en: 'A village suffers a poor harvest. The elder begs for relief grain.',
    },
    choices: [
      {
        label: { zh: '蔵，開救', en: 'Open the granaries' },
        effects: [{ kind: 'gold', delta: -150 }, { kind: 'set-flag', flag: 'opened-granaries' }],
        outcome: { zh: '村,救済，受,君之徳，讃。', en: 'The village survives. Your name is praised everywhere.' },
        followupEventId: 'dlg-grateful-villagers',
      },
      {
        label: { zh: '半額之', en: 'Send half what they ask' },
        effects: [{ kind: 'gold', delta: -75 }],
        outcome: { zh: '不十分,村耐忍。', en: 'Not enough, but they survive — barely.' },
      },
      {
        label: { zh: '断', en: 'Refuse' },
        effects: [{ kind: 'set-flag', flag: 'refused-relief' }],
        outcome: { zh: '村人,君，恨。', en: 'The village curses your name.' },
      },
    ],
  },
  {
    id: 'dlg-grateful-villagers',
    speaker: { zh: '村之若者', en: 'Village Youth' },
    text: {
      zh: '前之救済之御恩,忘。我一同,兵志願参上了。',
      en: 'We have not forgotten the grain you sent. The young men of our village wish to enlist!',
    },
    choices: [
      {
        label: { zh: '喜迎', en: 'Welcome them' },
        effects: [{ kind: 'gold', delta: -30 }],
        outcome: { zh: '志願兵陣加。', en: 'Volunteers swell your ranks.' },
      },
      {
        label: { zh: '農戻', en: 'Send them back to the fields' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '農国之本論。', en: 'You remind them that farming is the root of the state.' },
      },
    ],
    conditions: { requiresFlag: 'opened-granaries' },
  },
];

/** Lookup by id for branching follow-ups. */
export const DIALOGUE_EVENTS_BY_ID: Record<string, DialogueEvent> =
  Object.fromEntries(DIALOGUE_EVENTS.map((d) => [d.id, d]));
