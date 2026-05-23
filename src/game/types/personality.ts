import type { BilingualName } from './common';

/**
 * Per-officer personality traits — flavor + light gameplay effects.
 * An officer has 0–3 traits. Many traits push the AI's tendency in some
 * direction (e.g. 嗜酒 = prone to brawl events; 多疑 = harder to defect).
 */
export type PersonalityTrait =
  | 'drunkard'      // 嗜酒 — prone to drunkenness; lower defense vs assassination
  | 'suspicious'    // 多疑 — harder to defect to (negative espionage modifier)
  | 'benevolent'    // 仁慈 — refuses to execute captives; +loyalty aura
  | 'stubborn'      // 剛愎 — refuses retreats, ignores some wishes
  | 'cowardly'      // 怯懦 — flees easily, more likely to surrender
  | 'ambitious'     // 野心 — more likely to defect when low loyalty
  | 'loyal'         // 忠義 — never defects, +loyalty regen
  | 'lustful'       // 好色 — vulnerable to femme-fatale plots
  | 'greedy'        // 貪欲 — accepts bribes easily, defects for gold
  | 'reckless'      // 魯莽 — picks duels, takes risks in battle
  | 'cautious'      // 慎重 — refuses risky stratagems
  | 'arrogant'      // 傲慢 — clashes with peers; harder to recruit
  | 'cunning'       // 老謀 — extra success on espionage / stratagem
  | 'pious'         // 虔誠 — temples / oaths matter more
  | 'wrathful'      // 暴怒 — fly into rage in battle (charge bonus, defense penalty)
  // ─── Phase 31b additions ───────────────────────────────────────
  | 'chivalrous'    // 義俠 — rescues allies; refuses to ambush from cover
  | 'compassionate' // 慈悲 — never executes captives; gentle in war
  | 'martial-valor' // 武勇 — actively seeks duels (+15% duel-init chance)
  | 'composed'      // 沈着 — calm in crisis; resists confusion / fear
  | 'impatient'     // 急躁 — fast but error-prone (more crit / more miss)
  | 'taciturn'      // 寡黙 — speaks rarely; immune to slander/frame
  | 'cheerful'      // 開朗 — boosts adjacent ally morale in tactical battles
  | 'noble'         // 高潔 — refuses gold bribes; harder to corrupt
  | 'sickly'        // 病弱 — ages faster, dies younger
  | 'long-lived'    // 寿福 — ages slower, lives long
  | 'refined'       // 風流 — poet/scholar; +charisma during diplomacy events
  | 'cruel'         // 残忍 — terrifies enemies in tactical battle but lowers own loyalty
  | 'precognitive'  // 神算 — sees through enemy plots (espionage immunity)
  | 'matchless'     // 一騎当千 — peerless duelist; massive duel bonus
  | 'frail'         // 文弱 — physically weak; cannot duel
  | 'one-eyed'      // 独眼 — combat veterans (Xiahou Dun) — bonus when wounded
  | 'gluttonous';   // 食道楽 — eats well; lowers food supply effects

export interface PersonalityTraitDef {
  id: PersonalityTrait;
  name: BilingualName;
  description: string;
  /** Visual tint for the trait chip. */
  color: string;
  /** Whether this trait is generally a "positive" personality. */
  positive: boolean;
}

/**
 * Force-level AI personality. Determines how this force's AI ruler
 * approaches the strategic map.
 */
export type RulerPersonality =
  | 'aggressive'     // 攻撃型 — Cao Cao, Sun Ce: marches aggressively, prefers conquest
  | 'defensive'     // 守勢型 — Liu Bei, Liu Biao: fortifies, defends
  | 'opportunist'   // 機会型 — Sun Quan: strikes when others weaken
  | 'hesitant'      // 慎重型 — Yuan Shao: builds large but slow to act
  | 'tyrant'        // 暴虐型 — Dong Zhuo: aggressive, ignores diplomacy
  | 'scholar'       // 学者型 — Kong Rong, Liu Yan: defensive, prefers internal affairs
  | 'expansionist'  // 拡張型 — Yuan Shu, Ma Teng: spreads thin
  | 'cautious';     // 守備型 — Tao Qian: minimal action

export interface RulerPersonalityDef {
  id: RulerPersonality;
  name: BilingualName;
  description: string;
  /** AI tuning weights. */
  marchWeight: number;     // chance to attack each season
  developWeight: number;   // chance to do internal affairs
  recruitWeight: number;   // chance to recruit
  diplomacyWeight: number; // chance to send diplomacy
  retreatThreshold: number; // troop ratio at which they retreat/avoid combat
}
