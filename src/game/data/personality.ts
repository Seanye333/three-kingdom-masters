import type {
  PersonalityTrait,
  PersonalityTraitDef,
  RulerPersonality,
  RulerPersonalityDef,
} from '../types';

export const TRAIT_DEFS: PersonalityTraitDef[] = [
  { id: 'drunkard',    name: { en: 'Drunkard',    zh: '嗜酒' }, description: 'Loves wine to excess. Vulnerable to assassination and brawls.',                color: '#b8442e', positive: false },
  { id: 'suspicious',  name: { en: 'Suspicious',  zh: '多疑' }, description: 'Trusts no one. Harder to defect, but harder to manage as a vassal.',         color: '#8a5a8a', positive: false },
  { id: 'benevolent',  name: { en: 'Benevolent',  zh: '仁慈' }, description: 'Refuses to execute captives. Boosts city loyalty when stationed.',            color: '#6abf6a', positive: true },
  { id: 'stubborn',    name: { en: 'Stubborn',    zh: '剛愎' }, description: 'Will not retreat or change orders. Often refuses requests.',                  color: '#c19a3b', positive: false },
  { id: 'cowardly',    name: { en: 'Cowardly',    zh: '怯懦' }, description: 'Flees at the first sign of defeat.',                                          color: '#8a7050', positive: false },
  { id: 'ambitious',   name: { en: 'Ambitious',   zh: '野心' }, description: 'Will defect when loyalty drops. Eyes the throne for themselves.',             color: '#b8442e', positive: false },
  { id: 'loyal',       name: { en: 'Loyal',       zh: '忠義' }, description: 'Sworn to their lord. Never defects, regenerates loyalty slowly.',             color: '#d4a84a', positive: true },
  { id: 'lustful',     name: { en: 'Lustful',     zh: '好色' }, description: 'Vulnerable to femme-fatale plots and bribes of marriage.',                    color: '#c178c7', positive: false },
  { id: 'greedy',      name: { en: 'Greedy',      zh: '貪欲' }, description: 'Accepts gold bribes. Defects for the right price.',                           color: '#c19a3b', positive: false },
  { id: 'reckless',    name: { en: 'Reckless',    zh: '魯莽' }, description: 'Picks duels and takes risks. +duel chance, −defense.',                        color: '#b8442e', positive: false },
  { id: 'cautious',    name: { en: 'Cautious',    zh: '慎重' }, description: 'Refuses risky stratagems. Survives battles, takes fewer.',                    color: '#88b7e8', positive: true },
  { id: 'arrogant',    name: { en: 'Arrogant',    zh: '傲慢' }, description: 'Clashes with peers. Harder to recruit and to keep loyal.',                    color: '#a85d8a', positive: false },
  { id: 'cunning',     name: { en: 'Cunning',     zh: '老謀' }, description: 'Veteran of court intrigue. +espionage and stratagem success.',                color: '#3a7dd9', positive: true },
  { id: 'pious',       name: { en: 'Pious',       zh: '虔誠' }, description: 'Oaths and temples matter more. Stronger bond with sworn brothers.',          color: '#d4a84a', positive: true },
  { id: 'wrathful',    name: { en: 'Wrathful',    zh: '暴怒' }, description: 'Flies into rage in battle. Charges harder, defends worse.',                  color: '#b8442e', positive: false },
  // Phase 31b
  { id: 'chivalrous',  name: { en: 'Chivalrous',  zh: '義俠' }, description: 'A knight of the old school. Refuses ambushes; rescues allies in trouble.',     color: '#d4a84a', positive: true },
  { id: 'compassionate', name: { en: 'Compassionate', zh: '慈悲' }, description: 'Never executes captives. Gentle in war, beloved by the common people.',   color: '#88b7e8', positive: true },
  { id: 'martial-valor', name: { en: 'Martial Valor', zh: '武勇' }, description: 'Actively seeks duels. +15% chance to initiate single combat.',             color: '#b8442e', positive: true },
  { id: 'composed',    name: { en: 'Composed',    zh: '沈着' }, description: 'Calm in crisis. Resists confusion and fear stratagems.',                       color: '#88b7e8', positive: true },
  { id: 'impatient',   name: { en: 'Impatient',   zh: '急躁' }, description: 'Acts fast — strikes harder when on top, fumbles when not.',                    color: '#c19a3b', positive: false },
  { id: 'taciturn',    name: { en: 'Taciturn',    zh: '寡黙' }, description: 'Speaks rarely. Immune to framing and slander plots.',                          color: '#5a4530', positive: true },
  { id: 'cheerful',    name: { en: 'Cheerful',    zh: '開朗' }, description: 'Lights up any camp. Adjacent allies gain morale in tactical battles.',         color: '#d4a84a', positive: true },
  { id: 'noble',       name: { en: 'Noble',       zh: '高潔' }, description: 'Refuses bribes of any kind. Immune to gold-based defection.',                  color: '#d4a84a', positive: true },
  { id: 'sickly',      name: { en: 'Sickly',      zh: '病弱' }, description: 'Frail of body. Ages faster than peers.',                                       color: '#8a7050', positive: false },
  { id: 'long-lived',  name: { en: 'Long-Lived',  zh: '寿福' }, description: 'Blessed with longevity. Ages more slowly than peers.',                         color: '#d4a84a', positive: true },
  { id: 'refined',     name: { en: 'Refined',     zh: '風流' }, description: 'Poet, calligrapher, lover. +5 charisma in court / diplomacy events.',          color: '#c178c7', positive: true },
  { id: 'cruel',       name: { en: 'Cruel',       zh: '残忍' }, description: 'Reputation terrifies enemies (−5 enemy morale) but lowers own loyalty.',       color: '#5a2025', positive: false },
  { id: 'precognitive',name: { en: 'Precognitive',zh: '神算' }, description: 'Sees through enemy plots. Immune to most espionage.',                          color: '#3a7dd9', positive: true },
  { id: 'matchless',   name: { en: 'Matchless',   zh: '一騎当千' }, description: 'Peerless single combatant. +25 to duel rolls.',                            color: '#ffce4a', positive: true },
  { id: 'frail',       name: { en: 'Frail',       zh: '文弱' }, description: 'Physically weak. Cannot fight duels.',                                         color: '#8a7050', positive: false },
  { id: 'one-eyed',    name: { en: 'One-Eyed',    zh: '独眼' }, description: 'Veteran of grim battles. +10 war when troops below 50% — refuses to fall.',    color: '#b8442e', positive: true },
  { id: 'gluttonous',  name: { en: 'Gluttonous',  zh: '食道楽' }, description: 'Eats half a regiment\'s rations. City food drains slightly faster.',         color: '#c19a3b', positive: false },
];

export const TRAIT_DEFS_BY_ID: Record<string, PersonalityTraitDef> = Object.fromEntries(
  TRAIT_DEFS.map((t) => [t.id, t]),
);

/**
 * Curated trait loadouts for famous officers — 1–3 each. Officers not in
 * this map get personality derived from stats (e.g. high war + low intelligence
 * gets 'reckless'; high politics gets 'cunning').
 */
export const OFFICER_TRAITS: Record<string, PersonalityTrait[]> = {
  // Early base (kept for those without phase-31b reassignments)
  'dong-zhuo':   ['drunkard', 'lustful', 'wrathful'],
  'yuan-shao':   ['suspicious', 'arrogant', 'cautious'],
  'yuan-shu':    ['ambitious', 'arrogant', 'greedy'],
  'liu-biao':    ['cautious', 'benevolent'],
  'kong-rong':   ['benevolent', 'arrogant'],
  'pang-tong':   ['cunning', 'arrogant'],
  'sima-shi':    ['suspicious', 'cunning'],
  'sima-zhao':   ['ambitious', 'cunning', 'cautious'],
  'wei-yan':     ['stubborn', 'ambitious', 'reckless'],
  'zhang-liao':  ['loyal', 'cautious'],
  'cao-ren':     ['cautious', 'loyal'],
  'xiahou-yuan': ['reckless', 'loyal'],
  'liu-zhang':   ['cowardly', 'cautious'],
  'zhang-jiao':  ['pious', 'cunning'],
  'jiang-wei':   ['loyal', 'stubborn'],
  'deng-ai':     ['cunning', 'stubborn'],
  'zhong-hui':   ['arrogant', 'ambitious', 'cunning'],
  // Phase 31b — reassignments with the new richer traits.
  'lu-bu':       ['matchless', 'ambitious', 'lustful'],
  'guan-yu':     ['matchless', 'loyal', 'pious'],
  'zhao-yun':    ['matchless', 'loyal', 'chivalrous'],
  'zhang-fei':   ['drunkard', 'wrathful', 'martial-valor'],
  'ma-chao':     ['martial-valor', 'wrathful', 'matchless'],
  'huang-zhong': ['martial-valor', 'long-lived', 'loyal'],
  'xiahou-dun':  ['one-eyed', 'wrathful', 'loyal'],
  'dian-wei':    ['matchless', 'loyal'],
  'xu-chu':      ['martial-valor', 'loyal'],
  'taishi-ci':   ['matchless', 'chivalrous', 'loyal'],
  'gan-ning':    ['cruel', 'reckless', 'martial-valor'],
  'pang-de':     ['matchless', 'loyal'],
  'zhuge-liang': ['precognitive', 'cautious', 'loyal'],
  'sima-yi':     ['precognitive', 'cunning', 'long-lived'],
  'liu-bei':     ['benevolent', 'compassionate', 'noble'],
  'lu-su':       ['chivalrous', 'noble'],
  'zhou-yu':     ['refined', 'cunning'],
  'cao-cao':     ['suspicious', 'cunning', 'refined'],
  'cao-pi':      ['suspicious', 'refined', 'ambitious'],
  'cao-zhi':     ['refined', 'drunkard'],
  'guo-jia':     ['cunning', 'sickly'],
  'cai-yan':     ['refined', 'compassionate'],
  'sun-ce':      ['cheerful', 'reckless', 'martial-valor'],
  'sun-quan':    ['cautious', 'composed'],
  'sun-jian':    ['martial-valor', 'wrathful'],
  'hua-tuo':     ['compassionate', 'noble'],
  'xun-yu':      ['composed', 'loyal', 'cunning'],
  'jia-xu':      ['cunning', 'cautious', 'taciturn'],
  'lu-meng':     ['composed', 'cunning'],
  'lu-xun':      ['composed', 'cunning', 'refined'],
  'lu-kang':     ['composed', 'cunning', 'loyal'],
  'wang-yun':    ['noble', 'loyal', 'cunning'],
  'meng-huo':    ['stubborn', 'wrathful', 'martial-valor'],
  'diaochan':    ['cunning', 'refined', 'noble'],
  'huang-yueying':['cunning', 'composed'],
  'huang-gai':   ['loyal', 'martial-valor', 'one-eyed'],
  'yu-jin':      ['composed', 'cautious'],
  'pan-feng':    ['martial-valor', 'arrogant'],
  'hua-xiong':   ['martial-valor', 'cruel'],
  'wen-chou':    ['martial-valor', 'wrathful'],
  'yan-liang':   ['martial-valor', 'wrathful'],
  // Phase 35
  'zhu-rong':    ['martial-valor', 'wrathful', 'chivalrous'],
  'lady-fan':    ['cunning', 'noble'],
  'empress-bian':['noble', 'composed', 'benevolent'],
  'sun-luban':   ['cunning', 'ambitious'],
  'meng-you':    ['cautious', 'composed'],
  'mangya-chang':['martial-valor', 'wrathful'],
  'wutugu':      ['matchless', 'cruel'],
  'shamoke':     ['martial-valor', 'wrathful'],
  'tadun':       ['martial-valor', 'cruel'],
  'kebi-neng':   ['cunning', 'composed', 'martial-valor'],
  'gongsun-yuan':['ambitious', 'arrogant'],
};

export function deriveTraitsFromStats(stats: {
  leadership: number; war: number; intelligence: number; politics: number; charisma: number;
}): PersonalityTrait[] {
  const out: PersonalityTrait[] = [];
  if (stats.war >= 85 && stats.intelligence < 50) out.push('reckless');
  if (stats.intelligence >= 85 && stats.charisma < 60) out.push('arrogant');
  if (stats.politics >= 85) out.push('cunning');
  if (stats.charisma >= 85 && stats.politics >= 70) out.push('benevolent');
  if (stats.leadership >= 85 && stats.war < 60) out.push('cautious');
  return out.slice(0, 2);
}

export const RULER_PERSONALITY_DEFS: RulerPersonalityDef[] = [
  {
    id: 'aggressive',
    name: { en: 'Aggressive', zh: '攻撃型' },
    description: 'Strikes first, asks later. Marches on the weakest neighbour.',
    marchWeight: 1.5, developWeight: 0.7, recruitWeight: 1.0, diplomacyWeight: 0.6,
    retreatThreshold: 0.15,
  },
  {
    id: 'defensive',
    name: { en: 'Defensive', zh: '守勢型' },
    description: 'Builds walls before swords. Strikes only when provoked.',
    marchWeight: 0.6, developWeight: 1.4, recruitWeight: 1.2, diplomacyWeight: 1.2,
    retreatThreshold: 0.35,
  },
  {
    id: 'opportunist',
    name: { en: 'Opportunist', zh: '機会型' },
    description: 'Watches rivals weaken, then strikes the weak.',
    marchWeight: 1.0, developWeight: 1.0, recruitWeight: 1.0, diplomacyWeight: 1.2,
    retreatThreshold: 0.25,
  },
  {
    id: 'hesitant',
    name: { en: 'Hesitant', zh: '慎重型' },
    description: 'Builds great armies but is slow to commit them.',
    marchWeight: 0.5, developWeight: 1.3, recruitWeight: 1.4, diplomacyWeight: 0.9,
    retreatThreshold: 0.30,
  },
  {
    id: 'tyrant',
    name: { en: 'Tyrant', zh: '暴虐型' },
    description: 'No diplomacy, no mercy. Conquers or dies.',
    marchWeight: 1.7, developWeight: 0.5, recruitWeight: 0.9, diplomacyWeight: 0.2,
    retreatThreshold: 0.10,
  },
  {
    id: 'scholar',
    name: { en: 'Scholar', zh: '学者型' },
    description: 'Cultivates virtue and granaries above all.',
    marchWeight: 0.3, developWeight: 1.6, recruitWeight: 1.0, diplomacyWeight: 1.3,
    retreatThreshold: 0.40,
  },
  {
    id: 'expansionist',
    name: { en: 'Expansionist', zh: '拡張型' },
    description: 'Always pushing outward, often dangerously thin.',
    marchWeight: 1.4, developWeight: 0.6, recruitWeight: 1.1, diplomacyWeight: 0.7,
    retreatThreshold: 0.20,
  },
  {
    id: 'cautious',
    name: { en: 'Cautious', zh: '守備型' },
    description: 'Holds what they have, rarely sallies forth.',
    marchWeight: 0.4, developWeight: 1.2, recruitWeight: 1.0, diplomacyWeight: 1.4,
    retreatThreshold: 0.45,
  },
];

export const RULER_PERSONALITY_BY_ID: Record<string, RulerPersonalityDef> =
  Object.fromEntries(RULER_PERSONALITY_DEFS.map((p) => [p.id, p]));

/**
 * Default ruler personality by force/officer.
 */
export const FORCE_PERSONALITY: Record<string, RulerPersonality> = {
  cao: 'aggressive',
  'force-cao-cao': 'aggressive',
  liu: 'defensive',
  'force-liu-bei': 'defensive',
  sun: 'opportunist',
  'force-sun-quan': 'opportunist',
  'force-sun-jian': 'aggressive',
  'force-sun-ce': 'aggressive',
  'yuan-shao': 'hesitant',
  'force-yuan-shao': 'hesitant',
  'yuan-shu': 'expansionist',
  'force-yuan-shu': 'expansionist',
  'dong': 'tyrant',
  'force-dong-zhuo': 'tyrant',
  'liu-biao': 'scholar',
  'force-liu-biao': 'scholar',
  'liu-yan': 'scholar',
  'force-liu-yan': 'scholar',
  'liu-zhang': 'cautious',
  'force-liu-zhang': 'cautious',
  'kong-rong': 'scholar',
  'tao': 'cautious',
  'force-tao-qian': 'cautious',
  'gongsun': 'aggressive',
  'force-gongsun-zan': 'aggressive',
  'ma-teng': 'expansionist',
  'force-ma-teng': 'expansionist',
  'zhang-jiao': 'expansionist',
};
