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
      zh: '将軍同士が酒席で衝突しました。一方は刃傷沙汰寸前。',
      en: 'Two of your generals brawled at a banquet — blades were nearly drawn.',
    },
    choices: [
      {
        label: { zh: '両者罰す', en: 'Punish both' },
        effects: [{ kind: 'gold', delta: -50 }],
        outcome: { zh: '両者降格,軍規確立。', en: 'Both demoted. Discipline restored.' },
      },
      {
        label: { zh: '不問', en: 'Let it pass' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '酔っ払い同士の喧嘩,大事に至らず。', en: 'Just drunkards quarreling. Forgotten by dawn.' },
      },
      {
        label: { zh: '酒を取り上げる', en: 'Confiscate the wine' },
        effects: [{ kind: 'gold', delta: 30 }],
        outcome: { zh: '酒は売れ,30金が国庫に。', en: 'The wine was sold — 30 gold to the treasury.' },
      },
    ],
  },
  {
    id: 'dlg-omen-comet',
    speaker: { zh: '天文官', en: 'Court Astronomer' },
    text: {
      zh: '彗星出ず。古に曰く,「彗,改の象なり」。',
      en: 'A comet has appeared. The ancients say: "the broom-star foretells change."',
    },
    choices: [
      {
        label: { zh: '吉兆と告知', en: 'Proclaim it a good omen' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '民衆,新時代の予兆と歓喜。', en: 'The people rejoice — a new age begins!' },
      },
      {
        label: { zh: '黙殺', en: 'Ignore it' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '占星家の妄言として無視。', en: 'Dismissed as the astronomer\'s rambling.' },
      },
    ],
  },
  {
    id: 'dlg-bandit-offer',
    speaker: { zh: '使者', en: 'Messenger' },
    text: {
      zh: '山賊が,金200を払えば撤退すると申し出てきました。',
      en: 'A bandit chieftain offers to disperse his forces for 200 gold.',
    },
    choices: [
      {
        label: { zh: '払う', en: 'Pay' },
        effects: [{ kind: 'gold', delta: -200 }],
        outcome: { zh: '山賊は約束通り撤退。', en: 'The bandits disperse — as promised, this time.' },
      },
      {
        label: { zh: '討伐す', en: 'Hunt them down' },
        effects: [{ kind: 'troops', cityId: '', delta: -300 }],
        outcome: { zh: '討伐隊損耗,しかし山賊根絶。', en: 'Casualties taken, but the bandits are gone.' },
      },
      {
        label: { zh: '無視', en: 'Ignore' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '将来,後悔するかもしれぬ。', en: 'May come back to haunt you.' },
      },
    ],
  },
  {
    id: 'dlg-poet-gift',
    speaker: { zh: '老詩人', en: 'Old Poet' },
    text: {
      zh: '名のある詩人が,君主に詩を捧げに参りました。',
      en: 'A renowned poet has come to offer verses to your court.',
    },
    choices: [
      {
        label: { zh: '黄金で報う', en: 'Reward with gold' },
        effects: [{ kind: 'gold', delta: -100 }],
        outcome: { zh: '詩人喜び,君主の名,後世に伝わる。', en: 'The poet is delighted. Your name will live in his verses.' },
      },
      {
        label: { zh: '茶のみ', en: 'Just tea' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '詩人は静かに帰る。', en: 'The poet leaves quietly.' },
      },
    ],
  },
  {
    id: 'dlg-rain-pour',
    speaker: { zh: '農吏', en: 'Agriculture Official' },
    text: {
      zh: '今春,雨に恵まれ。収穫の兆し豊かです。',
      en: 'This spring has brought generous rains. The harvest will be bountiful.',
    },
    choices: [
      {
        label: { zh: '農夫を褒める', en: 'Reward the farmers' },
        effects: [{ kind: 'gold', delta: -50 }],
        outcome: { zh: '農民の忠誠,目に見えて上がる。', en: 'Farmer loyalty rises visibly.' },
      },
      {
        label: { zh: '感謝のみ', en: 'Just thanks' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '農民は満足するでしょう。', en: 'The farmers will be satisfied.' },
      },
    ],
  },
  {
    id: 'dlg-orphan-petition',
    speaker: { zh: '孤児', en: 'Orphan' },
    text: {
      zh: '戦災孤児たちが宮殿の前に集まっています。哀れな姿です。',
      en: 'Orphans of war gather at your palace gates — wretched.',
    },
    choices: [
      {
        label: { zh: '救済', en: 'Establish a relief fund' },
        effects: [{ kind: 'gold', delta: -150 }],
        outcome: { zh: '民の声,称賛で満つ。', en: 'The people sing your praise.' },
      },
      {
        label: { zh: '追い払う', en: 'Have them driven away' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '民衆,失望。', en: 'The people are disappointed.' },
      },
    ],
  },
  {
    id: 'dlg-merchant-deal',
    speaker: { zh: '商人', en: 'Travelling Merchant' },
    text: {
      zh: '西域の商人が,珍宝を売り込んでいます。',
      en: 'A merchant from the Western Regions offers rare treasures.',
    },
    choices: [
      {
        label: { zh: '購入', en: 'Buy' },
        effects: [{ kind: 'gold', delta: -300 }],
        outcome: { zh: '宝物が国庫を飾る。', en: 'The treasures enrich your court.' },
      },
      {
        label: { zh: '断る', en: 'Decline' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '商人は去る。', en: 'The merchant moves on.' },
      },
    ],
  },
  {
    id: 'dlg-wandering-monk',
    speaker: { zh: '行脚僧', en: 'Wandering Monk' },
    text: {
      zh: '老僧が一夜の宿を求めています。',
      en: 'An old monk seeks shelter for the night.',
    },
    choices: [
      {
        label: { zh: '迎え入れる', en: 'Welcome him' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '夜,僧は禅を語る。心,清涼。', en: 'In the night, the monk speaks of Zen. Your heart is at peace.' },
      },
      {
        label: { zh: '追い払う', en: 'Turn him away' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '僧は黙して去る。', en: 'The monk leaves in silence.' },
      },
    ],
  },

  // ─── Phase 34 expansion ─────────────────────────────────────
  {
    id: 'dlg-eunuch-favor',
    speaker: { zh: '宦官', en: 'Court Eunuch' },
    text: {
      zh: '宦官がそっと近づき,賄賂と引き換えに某官位への推薦を持ちかけてきました。',
      en: 'A eunuch quietly offers to recommend a promotion in exchange for a bribe.',
    },
    choices: [
      { label: { zh: '断固拒否', en: 'Refuse outright' },   effects: [{ kind: 'none' }],
        outcome: { zh: '宦官,顔色を変えて去る。良心は守られた。', en: 'The eunuch leaves, displeased. But your conscience is clean.' } },
      { label: { zh: '受け入れる', en: 'Accept' },           effects: [{ kind: 'gold', delta: -300 }],
        outcome: { zh: '官位を得たが,評判は曇った。', en: 'You gained the position — but your reputation is shadowed.' } },
    ],
  },
  {
    id: 'dlg-prophet',
    speaker: { zh: '巷の童謡', en: 'Street Children' },
    text: {
      zh: '巷の童謡:「東風吹かば,赤き雲起こる」。 不吉な予言か?',
      en: 'A street rhyme: "When the east wind blows, red clouds rise." A prophecy?',
    },
    choices: [
      { label: { zh: '禁ず', en: 'Ban the rhyme' },   effects: [{ kind: 'none' }],
        outcome: { zh: '童たちは別の歌を歌い始める。', en: 'The children find a new tune.' } },
      { label: { zh: '聞き流す', en: 'Ignore it' }, effects: [{ kind: 'none' }],
        outcome: { zh: '童謡が広まり,民の不安が高まる。', en: 'The rhyme spreads. Unease grows in the streets.' } },
    ],
  },
  {
    id: 'dlg-falling-star',
    speaker: { zh: '天文官', en: 'Astronomer' },
    text: {
      zh: '昨夜,西方に大星が墜ちました。古に曰く,「将星墜つ」と。',
      en: 'A great star fell in the west last night. The ancients say: "a general\'s star falls."',
    },
    choices: [
      { label: { zh: '緘口令', en: 'Suppress the news' }, effects: [{ kind: 'none' }],
        outcome: { zh: '士気は保たれた。', en: 'Morale stays intact.' } },
      { label: { zh: '占いをさせる', en: 'Divine its meaning' }, effects: [{ kind: 'gold', delta: -50 }],
        outcome: { zh: '占者は「敵将に凶」と告げる。', en: 'The diviner: "an ill omen — for the enemy."' } },
    ],
  },
  {
    id: 'dlg-stray-dog',
    speaker: { zh: '老農', en: 'Old Farmer' },
    text: {
      zh: '宮殿の門に虎のような大犬が現れました。 主君,これは?',
      en: 'A great tiger-like dog appeared at the palace gate. My lord, what could it mean?',
    },
    choices: [
      { label: { zh: '飼う', en: 'Keep it' },   effects: [{ kind: 'gold', delta: -30 }],
        outcome: { zh: '犬,殿中に従う。庶民,主公の徳を称える。', en: 'The dog follows you in. People praise your virtue.' } },
      { label: { zh: '追い払う', en: 'Drive it away' }, effects: [{ kind: 'none' }],
        outcome: { zh: '犬,森へ消える。', en: 'The dog vanishes into the forest.' } },
    ],
  },
  {
    id: 'dlg-traveling-doctor',
    speaker: { zh: '游医', en: 'Wandering Physician' },
    text: {
      zh: '医者が,珍しい薬草を売り込んでいます。 兵の傷を癒すと申しております。',
      en: 'A physician offers rare herbs that he claims will heal soldiers\' wounds.',
    },
    choices: [
      { label: { zh: '購入', en: 'Buy' },          effects: [{ kind: 'gold', delta: -200 }],
        outcome: { zh: '今後,兵の回復が早まる。', en: 'Soldiers heal faster in the coming seasons.' } },
      { label: { zh: '疑う', en: 'Suspicious — refuse' }, effects: [{ kind: 'none' }],
        outcome: { zh: '医者,失望して去る。', en: 'The physician departs disappointed.' } },
    ],
  },
  {
    id: 'dlg-frontier-tribe',
    speaker: { zh: '辺境の使者', en: 'Frontier Envoy' },
    text: {
      zh: '辺境の異民族の首長が,贡物と引き換えに通商を求めてきました。',
      en: 'A tribal chieftain from the frontier offers tribute in exchange for trade rights.',
    },
    choices: [
      { label: { zh: '許可', en: 'Grant trade' }, effects: [{ kind: 'gold', delta: 200 }],
        outcome: { zh: '貢物と毛皮を得る。', en: 'You receive tribute and furs.' } },
      { label: { zh: '拒否', en: 'Refuse' },     effects: [{ kind: 'none' }],
        outcome: { zh: '使者,憤って去る。', en: 'The envoy departs in anger.' } },
    ],
  },
  {
    id: 'dlg-spy-rumor',
    speaker: { zh: '錦衣衛', en: 'Captain of the Guard' },
    text: {
      zh: '宮殿内に密偵が潜伏しているとの噂です。 捜査を命じますか?',
      en: 'Rumor says a spy lurks within the palace. Order an investigation?',
    },
    choices: [
      { label: { zh: '徹底捜査', en: 'Full investigation' }, effects: [{ kind: 'gold', delta: -150 }],
        outcome: { zh: '密偵を捕らえた。 機密が守られる。', en: 'The spy is caught. Secrets remain ours.' } },
      { label: { zh: '無視', en: 'Dismiss the rumor' }, effects: [{ kind: 'none' }],
        outcome: { zh: '何事も起こらず…おそらく。', en: 'Nothing happens. Probably.' } },
    ],
  },
  {
    id: 'dlg-festival',
    speaker: { zh: '礼部官', en: 'Minister of Rites' },
    text: {
      zh: '春節が近づいています。 民は祭礼の費用を願い出ています。',
      en: 'The Spring Festival approaches. The people petition for festival funding.',
    },
    choices: [
      { label: { zh: '盛大に祝う', en: 'Lavish festival' }, effects: [{ kind: 'gold', delta: -500 }],
        outcome: { zh: '民は喜び,君主を讃える。', en: 'The people rejoice and praise their lord.' } },
      { label: { zh: '質素に', en: 'A simple celebration' }, effects: [{ kind: 'gold', delta: -100 }],
        outcome: { zh: '民は満足する。', en: 'The people are content.' } },
      { label: { zh: '見送る', en: 'Skip it' }, effects: [{ kind: 'none' }],
        outcome: { zh: '不満の声が漏れる。', en: 'Murmurs of discontent.' } },
    ],
  },
  {
    id: 'dlg-tax-collector',
    speaker: { zh: '徴税官', en: 'Tax Collector' },
    text: {
      zh: '徴税官:「今年は不作です。 減免を考慮されますか?」',
      en: 'Tax collector: "The harvest was poor. Consider a tax reduction?"',
    },
    choices: [
      { label: { zh: '減税', en: 'Reduce taxes' },     effects: [{ kind: 'gold', delta: -200 }],
        outcome: { zh: '民の忠誠が深まる。', en: 'The people\'s loyalty deepens.' } },
      { label: { zh: '取り立てよ', en: 'Collect in full' }, effects: [{ kind: 'gold', delta: 200 }],
        outcome: { zh: '金庫は潤うが,民の心は離れる。', en: 'The treasury swells, but the people grow cold.' } },
    ],
  },
  {
    id: 'dlg-locust-swarm',
    speaker: { zh: '農吏', en: 'Field Officer' },
    text: {
      zh: '南方より蝗害の報。 至急,対策を要します。',
      en: 'A locust plague hits the southern fields. Urgent action needed.',
    },
    choices: [
      { label: { zh: '兵を派遣', en: 'Send troops to control it' }, effects: [{ kind: 'gold', delta: -250 }],
        outcome: { zh: '蝗害,沈静化。', en: 'The plague is contained.' } },
      { label: { zh: '放任', en: 'Do nothing' }, effects: [{ kind: 'none' }],
        outcome: { zh: '田畑荒れる。', en: 'Fields lie ruined.' } },
    ],
  },
  {
    id: 'dlg-foreign-scholar',
    speaker: { zh: '異国の学者', en: 'Foreign Scholar' },
    text: {
      zh: '西域より来た学者が,君主の宮廷で職を求めています。',
      en: 'A scholar from the Western Regions seeks employment at your court.',
    },
    choices: [
      { label: { zh: '採用', en: 'Hire him' },         effects: [{ kind: 'gold', delta: -150 }],
        outcome: { zh: '宮廷の知識が増す。', en: 'Your court grows in learning.' } },
      { label: { zh: '断る', en: 'Decline' },         effects: [{ kind: 'none' }],
        outcome: { zh: '学者は別所を求めて去る。', en: 'The scholar seeks elsewhere.' } },
    ],
  },
  {
    id: 'dlg-dragon-sighting',
    speaker: { zh: '漁師', en: 'Fisherman' },
    text: {
      zh: '川辺の漁師たちが,「黄龍を見た」と興奮しています。',
      en: 'Fishermen claim they saw a "yellow dragon" in the river.',
    },
    choices: [
      { label: { zh: '吉兆と宣告', en: 'Proclaim a good omen' }, effects: [{ kind: 'none' }],
        outcome: { zh: '民,主公の徳と結びつけて喜ぶ。', en: 'The people link it to your virtue and rejoice.' } },
      { label: { zh: '迷信と一蹴', en: 'Dismiss as superstition' }, effects: [{ kind: 'none' }],
        outcome: { zh: '老臣たちは少し失望。', en: 'Old courtiers seem disappointed.' } },
    ],
  },
  {
    id: 'dlg-runaway-prince',
    speaker: { zh: '巷の話題', en: 'Local Gossip' },
    text: {
      zh: '隣国の若君が出奔し,我が領内に紛れ込んでいるという噂。',
      en: 'A rumor: a young prince from a neighboring realm has fled and is hiding in your domain.',
    },
    choices: [
      { label: { zh: '捜索して保護', en: 'Search and shelter him' }, effects: [{ kind: 'gold', delta: -200 }],
        outcome: { zh: '若君を見つけ,人質とする。', en: 'You find him — and now hold a hostage.' } },
      { label: { zh: '関与しない', en: 'Stay out of it' }, effects: [{ kind: 'none' }],
        outcome: { zh: '何事もなし。', en: 'Nothing comes of it.' } },
    ],
  },
  {
    id: 'dlg-old-soldier',
    speaker: { zh: '老兵', en: 'Old Soldier' },
    text: {
      zh: '老兵が宮殿の門に現れ,「最後の出陣を願う」と申し出ています。',
      en: 'An old veteran arrives at the palace gates, asking for one last campaign.',
    },
    choices: [
      { label: { zh: '叶える', en: 'Grant his request' }, effects: [{ kind: 'none' }],
        outcome: { zh: '老兵は涙して感謝する。', en: 'The veteran weeps in gratitude.' } },
      { label: { zh: '年金を与える', en: 'Pension him off' }, effects: [{ kind: 'gold', delta: -100 }],
        outcome: { zh: '老兵,静かに故郷へ。', en: 'The veteran returns home, at peace.' } },
    ],
  },
  {
    id: 'dlg-merchant-caravan',
    speaker: { zh: '商隊長', en: 'Caravan Master' },
    text: {
      zh: '商隊が領内を通過。 通行税を課しますか?',
      en: 'A merchant caravan passes through your lands. Levy a toll?',
    },
    choices: [
      { label: { zh: '課税', en: 'Tax them' },         effects: [{ kind: 'gold', delta: 150 }],
        outcome: { zh: '商人,渋々払う。', en: 'The merchants pay grudgingly.' } },
      { label: { zh: '免除', en: 'Let them pass free' }, effects: [{ kind: 'none' }],
        outcome: { zh: '商人,君主の名を称えて去る。', en: 'The merchants praise your name as they leave.' } },
    ],
  },
  {
    id: 'dlg-comet-second',
    speaker: { zh: '天文官', en: 'Court Astronomer' },
    text: {
      zh: '異星が三夜連続で現れました。 周易に曰く,「変動の兆し」。',
      en: 'A strange star has appeared three nights running. The Book of Changes warns of upheaval.',
    },
    choices: [
      { label: { zh: '祭祀を行う', en: 'Conduct a ritual' }, effects: [{ kind: 'gold', delta: -150 }],
        outcome: { zh: '士気が安定する。', en: 'Morale steadies.' } },
      { label: { zh: '何もせず', en: 'Do nothing' }, effects: [{ kind: 'none' }],
        outcome: { zh: '人々は不安げに過ごす。', en: 'People pass anxious days.' } },
    ],
  },
  {
    id: 'dlg-bridge-collapse',
    speaker: { zh: '使者', en: 'Messenger' },
    text: {
      zh: '辺境の橋が嵐で崩落しました。 修復費用は二百金。',
      en: 'A frontier bridge has collapsed in the storm. Repairs cost 200 gold.',
    },
    choices: [
      { label: { zh: '修復', en: 'Repair' },          effects: [{ kind: 'gold', delta: -200 }],
        outcome: { zh: '輸送網が回復する。', en: 'Supply routes restored.' } },
      { label: { zh: '放置', en: 'Leave it' },         effects: [{ kind: 'none' }],
        outcome: { zh: '輸送が滞り,辺境の不満が高まる。', en: 'Trade slows and discontent rises in the borderlands.' } },
    ],
  },
  {
    id: 'dlg-philosopher-debate',
    speaker: { zh: '儒者', en: 'Confucian Scholar' },
    text: {
      zh: '儒者と道士が宮廷の前で論争しています。 どちらに肩入れしますか?',
      en: 'A Confucian and a Daoist argue at your court gate. Take a side?',
    },
    choices: [
      { label: { zh: '儒者を支持', en: 'Side with the Confucian' }, effects: [{ kind: 'none' }],
        outcome: { zh: '儒者の支持を得る。', en: 'You gain Confucian support.' } },
      { label: { zh: '道士を支持', en: 'Side with the Daoist' }, effects: [{ kind: 'none' }],
        outcome: { zh: '道家の僧侶の支持を得る。', en: 'You gain Daoist support.' } },
      { label: { zh: '中立', en: 'Stay neutral' }, effects: [{ kind: 'none' }],
        outcome: { zh: '両者,やや不満。', en: 'Both sides leave a little disappointed.' } },
    ],
  },
  {
    id: 'dlg-old-noble-petition',
    speaker: { zh: '長老', en: 'Senior Noble' },
    text: {
      zh: '高齢の重臣が引退を願い出ています。 後任に弟子を推薦中です。',
      en: 'An aged minister asks to retire and recommends his protégé.',
    },
    choices: [
      { label: { zh: '弟子を任命', en: 'Appoint the protégé' }, effects: [{ kind: 'none' }],
        outcome: { zh: '世代交代,円滑に進む。', en: 'A smooth transition.' } },
      { label: { zh: '辞退を許さず', en: 'Refuse the retirement' }, effects: [{ kind: 'none' }],
        outcome: { zh: '老臣,さらに数年仕える。', en: 'The old minister serves a few more years.' } },
    ],
  },
  {
    id: 'dlg-foreign-tribute',
    speaker: { zh: '外国使節', en: 'Foreign Envoy' },
    text: {
      zh: '遠国より使節が,珍奇な物産を貢ぎ物として持参しました。',
      en: 'An envoy from a distant land arrives with rare goods as tribute.',
    },
    choices: [
      { label: { zh: '厚遇する', en: 'Welcome him warmly' }, effects: [{ kind: 'gold', delta: -100 }],
        outcome: { zh: '友好関係が築かれる。 名声が広まる。', en: 'A friendship begins. Your fame spreads.' } },
      { label: { zh: '簡素に', en: 'Receive him plainly' }, effects: [{ kind: 'none' }],
        outcome: { zh: '使節は失望して去る。', en: 'The envoy leaves disappointed.' } },
    ],
  },
  {
    id: 'dlg-natural-spring',
    speaker: { zh: '農夫', en: 'Farmer' },
    text: {
      zh: '村人:「丘の上から霊水が湧き出しました!」 神秘的な兆しです。',
      en: 'Villagers: "A miraculous spring has burst forth on the hill!" A strange omen.',
    },
    choices: [
      { label: { zh: '祠を建てる', en: 'Build a shrine' }, effects: [{ kind: 'gold', delta: -100 }],
        outcome: { zh: '聖地として知られ,巡礼が集う。', en: 'It becomes a holy site. Pilgrims gather.' } },
      { label: { zh: '一介の泉とする', en: 'Treat it as ordinary' }, effects: [{ kind: 'none' }],
        outcome: { zh: '村人は静かに崇める。', en: 'The villagers quietly venerate it.' } },
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
      zh: '敵軍の一将が,身一つで内通を申し出てきました。「私を信じてくだされ」と。',
      en: 'An enemy general has secretly offered to defect. "Trust me," he pleads.',
    },
    choices: [
      {
        label: { zh: '受け入れる', en: 'Accept his service' },
        effects: [{ kind: 'gold', delta: -200 }, { kind: 'set-flag', flag: 'accepted-defector' }],
        outcome: { zh: '彼を取り立てる。後の展開は彼次第。', en: 'You take him in. The next season will tell what kind of man he is.' },
        followupEventId: 'dlg-defector-followup',
      },
      {
        label: { zh: '斬る', en: 'Behead him' },
        effects: [{ kind: 'set-flag', flag: 'rejected-defector' }],
        outcome: { zh: '裏切り者は信ぜず。彼の首を晒す。', en: 'You trust no turncoat. His head is displayed at the gate.' },
      },
      {
        label: { zh: '送り返す', en: 'Send him back' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '彼を送り返した。事はこれで終わる。', en: 'You send him home unharmed. The matter ends here.' },
      },
    ],
  },
  {
    id: 'dlg-defector-followup',
    speaker: { zh: '哨兵', en: 'Sentry' },
    text: {
      zh: '先の降将,夜陰に乗じて陣中の地図を盗み逃れんとしているところを捕えました!',
      en: 'The defector from last season — we caught him trying to slip out at night with our camp maps!',
    },
    choices: [
      {
        label: { zh: '処刑し見せしめに', en: 'Execute as warning' },
        effects: [{ kind: 'gold', delta: -50 }],
        outcome: { zh: '裏切り者は晒し首。臣下の忠誠は一段と固くなる。', en: 'The traitor is executed publicly. Your retainers stand a little straighter.' },
      },
      {
        label: { zh: '逆に偽情報を渡して放つ', en: 'Feed him false intel and release him' },
        effects: [{ kind: 'none' }, { kind: 'set-flag', flag: 'fed-false-intel' }],
        outcome: { zh: '偽の進軍計画を持たせて逃がす。敵将,毒餌に食いつくか。', en: 'You let him "escape" with forged battle plans. Time will tell if the enemy bites.' },
      },
    ],
    conditions: { requiresFlag: 'accepted-defector' },
  },

  // Chain 2: a holy mountain hermit → his disciple returns later if you were generous.
  {
    id: 'dlg-hermit-visit',
    speaker: { zh: '老隠者', en: 'Old Hermit' },
    text: {
      zh: '深山より下りた老人が,治国の道を説きに来た。「されば,君の道は何処にありや」',
      en: 'An old hermit descends from the mountains to lecture on the Way. "Tell me — where lies your path?"',
    },
    choices: [
      {
        label: { zh: '丁重に迎える', en: 'Welcome him with full honors' },
        effects: [{ kind: 'gold', delta: -80 }, { kind: 'set-flag', flag: 'honored-hermit' }],
        outcome: { zh: '老人,数日語り合い満足して去った。', en: 'The hermit converses for days, then departs satisfied.' },
        followupEventId: 'dlg-hermit-disciple',
      },
      {
        label: { zh: '寒食を出す', en: 'Offer him only cold rations' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '老人,黙して去る。', en: 'The hermit departs without a word.' },
      },
      {
        label: { zh: '追い払う', en: 'Drive him off' },
        effects: [{ kind: 'set-flag', flag: 'scorned-hermit' }],
        outcome: { zh: '老人,呪言を残して去る。', en: 'The hermit leaves muttering curses.' },
      },
    ],
  },
  {
    id: 'dlg-hermit-disciple',
    speaker: { zh: '若き弟子', en: 'Young Disciple' },
    text: {
      zh: '先の隠者の弟子と申す者が,「師の遺言にて」と参上した。眼光鋭く,才気明らか。',
      en: 'A young man arrives saying he is the late hermit\'s disciple. His eyes are sharp; talent is plain.',
    },
    choices: [
      {
        label: { zh: '臣として召し抱える', en: 'Take him as a retainer' },
        effects: [{ kind: 'gold', delta: -50 }],
        outcome: { zh: '若き才,君の幕下に加わる。', en: 'A new talent joins your camp.' },
      },
      {
        label: { zh: '路銀を渡して送る', en: 'Give him travel money and send him on' },
        effects: [{ kind: 'gold', delta: -20 }],
        outcome: { zh: '彼,別の主君を求めて旅立つ。', en: 'He goes to seek service elsewhere.' },
      },
    ],
    conditions: { requiresFlag: 'honored-hermit' },
  },

  // Chain 3: famine relief → townspeople remember.
  {
    id: 'dlg-famine-village',
    speaker: { zh: '村長', en: 'Village Elder' },
    text: {
      zh: '凶作にて村人が餓えております。御救いをば。',
      en: 'A village suffers a poor harvest. The elder begs for relief grain.',
    },
    choices: [
      {
        label: { zh: '蔵を開けて救う', en: 'Open the granaries' },
        effects: [{ kind: 'gold', delta: -150 }, { kind: 'set-flag', flag: 'opened-granaries' }],
        outcome: { zh: '村,救済を受け,君の徳を讃える。', en: 'The village survives. Your name is praised everywhere.' },
        followupEventId: 'dlg-grateful-villagers',
      },
      {
        label: { zh: '半額のみ', en: 'Send half what they ask' },
        effects: [{ kind: 'gold', delta: -75 }],
        outcome: { zh: '不十分ではあるが,村は耐え忍ぶ。', en: 'Not enough, but they survive — barely.' },
      },
      {
        label: { zh: '断る', en: 'Refuse' },
        effects: [{ kind: 'set-flag', flag: 'refused-relief' }],
        outcome: { zh: '村人,君を恨む。', en: 'The village curses your name.' },
      },
    ],
  },
  {
    id: 'dlg-grateful-villagers',
    speaker: { zh: '村の若者', en: 'Village Youth' },
    text: {
      zh: '前の救済の御恩,忘れず。我ら一同,兵に志願したく参上いたしました。',
      en: 'We have not forgotten the grain you sent. The young men of our village wish to enlist!',
    },
    choices: [
      {
        label: { zh: '喜んで迎える', en: 'Welcome them' },
        effects: [{ kind: 'gold', delta: -30 }],
        outcome: { zh: '志願兵が陣に加わる。', en: 'Volunteers swell your ranks.' },
      },
      {
        label: { zh: '農に戻すべし', en: 'Send them back to the fields' },
        effects: [{ kind: 'none' }],
        outcome: { zh: '農こそ国の本と論す。', en: 'You remind them that farming is the root of the state.' },
      },
    ],
    conditions: { requiresFlag: 'opened-granaries' },
  },
];

/** Lookup by id for branching follow-ups. */
export const DIALOGUE_EVENTS_BY_ID: Record<string, DialogueEvent> =
  Object.fromEntries(DIALOGUE_EVENTS.map((d) => [d.id, d]));
