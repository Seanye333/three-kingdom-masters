/**
 * Officer voice lines that fire during tactical battles.
 *
 * Trigger keys:
 *   'attack'   — when the officer attacks an enemy
 *   'critical' — when the officer rolls a high-damage attack
 *   'hit'      — when the officer takes damage
 *   'lowHp'    — when the officer's troops drop below 30% max
 *   'kill'     — when the officer's attack routs/kills an enemy unit
 *   'stratagem'— when the officer uses any stratagem
 *   'duel'     — when commander-vs-commander duel triggers
 *   'rally'    — when this officer is the morale anchor
 *   'spawn'    — said when the battle begins
 */

export type VoiceTrigger =
  | 'attack'
  | 'critical'
  | 'hit'
  | 'lowHp'
  | 'kill'
  | 'stratagem'
  | 'duel'
  | 'rally'
  | 'spawn';

export interface VoiceLineSet {
  attack?: string[];
  critical?: string[];
  hit?: string[];
  lowHp?: string[];
  kill?: string[];
  stratagem?: string[];
  duel?: string[];
  rally?: string[];
  spawn?: string[];
}

export const VOICE_LINES: Record<string, VoiceLineSet> = {
  'lu-bu': {
    spawn: ['天下無双!', '人中の呂布、馬中の赤兎!'],
    attack: ['ハッ!', '邪魔だ!', '我が方天画戟を受けよ!'],
    critical: ['天下に敵なし!', '誰が我を止められるか!'],
    duel: ['命を頂戴する!'],
    kill: ['ハハハ!弱い、弱い!'],
    lowHp: ['まさか、この呂布が...'],
  },
  'guan-yu': {
    spawn: ['義に背くわけにはいかぬ。'],
    attack: ['青龍偃月、ここにあり!', 'ハッ!'],
    critical: ['一刀のもとに斬る!'],
    duel: ['我が刀を試そう!'],
    kill: ['弱兵を相手にするのは恥ずかしい。'],
    lowHp: ['まだ、まだ戦える!'],
    rally: ['義兄上の名にかけて!'],
  },
  'zhang-fei': {
    spawn: ['燕人、張飛、ここにあり!'],
    attack: ['くらえ!', 'やっちまえ!', '逃がさんぞ!'],
    critical: ['この一撃、避けられるか!'],
    duel: ['いざ尋常に勝負!'],
    kill: ['雑魚が!'],
    lowHp: ['ぐっ、こんなところで...'],
  },
  'liu-bei': {
    spawn: ['漢室を再興する!'],
    attack: ['仁を以て立つ!'],
    rally: ['みんな、ついてきてくれ!'],
    lowHp: ['まだ諦めぬ...'],
  },
  'zhuge-liang': {
    spawn: ['天の時、地の利、人の和。我が計、ここに成る。'],
    stratagem: ['計略は既に成った。', '読み通りだ。'],
    critical: ['全ては予定通り。'],
    rally: ['動くな、まだ早い。'],
    lowHp: ['誤算か... いや、まだ手はある。'],
  },
  'cao-cao': {
    spawn: ['天下を我が手に。'],
    attack: ['寧ろ我が天下に背くとも!'],
    critical: ['乱世の奸雄、ここにあり!'],
    duel: ['面白い、相手をしてやろう!'],
    rally: ['進め、進め!'],
    lowHp: ['まだ終わらぬ、まだ...'],
  },
  'zhao-yun': {
    spawn: ['常山の趙子龍、参る!'],
    attack: ['ハッ!', '龍の一閃!'],
    critical: ['一騎当千!'],
    duel: ['尋常に勝負!'],
    kill: ['まだまだ!'],
    lowHp: ['主公をお守りせねば...'],
    rally: ['続け、武の者よ!'],
  },
  'ma-chao': {
    spawn: ['錦馬超、ここにあり!'],
    attack: ['受けよ!', '駆けるぞ!'],
    critical: ['一閃!'],
    duel: ['一騎打ちを所望する!'],
  },
  'sun-ce': {
    spawn: ['江東に虎ありと知れ!'],
    attack: ['行くぞ!'],
    critical: ['小覇王の一撃!'],
    duel: ['面白い、来い!'],
  },
  'sun-quan': {
    spawn: ['呉の旗、ここに翻る。'],
    rally: ['江東の士、力を貸せ!'],
    lowHp: ['まだ、これからだ。'],
  },
  'zhou-yu': {
    spawn: ['美周郎、参陣。'],
    stratagem: ['計は既に成った。'],
    critical: ['炎、燃え盛れ!'],
    duel: ['受けて立とう!'],
  },
  'lu-meng': {
    spawn: ['呂蒙、白衣を脱ぐ!'],
    attack: ['静かに、確実に。'],
    stratagem: ['策、ここに極まる。'],
  },
  'sima-yi': {
    spawn: ['鷹、空を待つ。'],
    stratagem: ['機を見て動く。'],
    rally: ['焦るな、勝機は必ず来る。'],
    lowHp: ['この程度では沈まぬ...'],
  },
  'xiahou-dun': {
    spawn: ['夏侯惇、参戦!'],
    attack: ['この眼、見開いて見よ!'],
    critical: ['父母の精、無駄にはせぬ!'],
    hit: ['ぐっ...!'],
  },
  'huang-zhong': {
    spawn: ['老兵、まだ衰えず!'],
    attack: ['弓を絞れ!', '矢を放て!'],
    critical: ['百歩、外さず!'],
  },
  'taishi-ci': {
    attack: ['ハッ!', '弓に頼るな!'],
    duel: ['一騎打ち、所望!'],
    critical: ['遠近自在!'],
  },
  'gan-ning': {
    spawn: ['錦帆賊、甘興覇!'],
    attack: ['ハハハ、来い!'],
    critical: ['百騎の魂、ここに見せん!'],
  },
  'dian-wei': {
    spawn: ['典韋、君を守る!'],
    attack: ['受けよ!'],
    duel: ['命に代えて!'],
    lowHp: ['まだ、主のために...!'],
  },
  'xu-chu': {
    spawn: ['虎痴、参陣!'],
    attack: ['ぬん!', 'はっ!'],
    critical: ['一閃!'],
  },
  'zhang-liao': {
    spawn: ['張遼、文遠なり。'],
    attack: ['受けよ!'],
    critical: ['八百が八万に勝つ!'],
    duel: ['尋常に!'],
  },
};

/** Pick a random voice line for an officer and trigger, or null if none. */
export function pickVoiceLine(
  officerId: string,
  trigger: VoiceTrigger,
  rng: () => number,
): string | null {
  const set = VOICE_LINES[officerId];
  if (!set) return null;
  const lines = set[trigger];
  if (!lines || lines.length === 0) return null;
  return lines[Math.floor(rng() * lines.length)];
}
