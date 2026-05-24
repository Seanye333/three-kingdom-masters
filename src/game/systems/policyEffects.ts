/**
 * Real gameplay effects of officers' personal policies.
 *
 * Each officer carries a list of policies (their lifelong expertise). When
 * stationed at a city or fighting in a battle, those policies are aggregated
 * into modifiers that actually change the game's numbers — not just labels.
 *
 * Effects are kept conservative on purpose: 1 policy = ~5–25% change so
 * stacking 3-5 makes a clear difference without breaking the game.
 */
import type { City, Officer, PolicyId } from '../types';

export interface CityPolicyEffects {
  /** Multiplier applied to gold income (1.0 = unchanged). */
  goldMul: number;
  /** Flat gold added/subtracted per season. */
  goldFlat: number;
  /** Multiplier applied to food (autumn) income. */
  foodMul: number;
  /** Loyalty delta per season (positive = recover toward 100). */
  loyaltyDelta: number;
  /** Defense bonus added to city.defense for siege calc. */
  defenseBonus: number;
  /** Troop cap multiplier (default 1.0 — used when training/recruiting). */
  troopCapMul: number;
  /** Description badges to show on city HUD ("★ 屯田 +25% 糧"). */
  badges: string[];
}

export interface CombatPolicyEffects {
  /** Damage multiplier for attacker. */
  attackMul: number;
  /** Damage taken multiplier for defender (>1 = take more damage). */
  defenseMul: number;
  /** Morale floor — minimum morale this side keeps. */
  moraleFloor: number;
  /** Bonus to fire-attack stratagem damage. */
  fireMul: number;
  /** Bonus to ranged stratagem (arrows/crossbow). */
  rangedMul: number;
  /** Badges to display. */
  badges: string[];
}

/**
 * Gather a list of all PolicyIds active in a given officer pool.
 * Each policy counts once per officer who carries it.
 */
function aggregatePolicies(officers: Officer[]): Set<PolicyId> {
  const set = new Set<PolicyId>();
  for (const o of officers) {
    for (const p of o.policies ?? []) set.add(p);
  }
  return set;
}

/**
 * Compute economic + defense effects for one city, given the officers
 * currently stationed there.
 */
export function cityPolicyEffects(
  _city: City,
  cityOfficers: Officer[],
): CityPolicyEffects {
  const pol = aggregatePolicies(cityOfficers);
  let goldMul = 1, goldFlat = 0, foodMul = 1, loyaltyDelta = 0;
  let defenseBonus = 0, troopCapMul = 1;
  const badges: string[] = [];

  // ── ECONOMY ────────────────────────────────────────────────────────
  if (pol.has('tuntian'))            { foodMul += 0.25; badges.push('屯田 +25% 糧'); }
  if (pol.has('ox-plowing'))         { foodMul += 0.12; badges.push('牛耕 +12% 糧'); }
  if (pol.has('iron-tools'))         { foodMul += 0.20; badges.push('鐵具 +20% 糧'); }
  if (pol.has('water-mill'))         { foodMul += 0.12; badges.push('水車 +12% 糧'); }
  if (pol.has('hydraulics'))         { foodMul += 0.15; badges.push('治水 +15% 糧'); }
  if (pol.has('commerce'))           { goldMul += 0.20; badges.push('商業 +20% 金'); }
  if (pol.has('silk-trade'))         { goldMul += 0.25; badges.push('絲綢 +25% 金'); }
  if (pol.has('maritime-trade'))     { goldMul += 0.30; badges.push('海貿 +30% 金'); }
  if (pol.has('salt-monopoly'))      { goldFlat += 60; loyaltyDelta -= 1; badges.push('鹽政 +60 金/-1 忠'); }
  if (pol.has('iron-monopoly'))      { goldFlat += 40; badges.push('鐵政 +40 金'); }
  if (pol.has('gold-mining'))        { goldFlat += 120; badges.push('金礦 +120 金'); }
  if (pol.has('silver-mining'))      { goldFlat += 90; badges.push('銀礦 +90 金'); }
  if (pol.has('copper-mining'))      { goldFlat += 50; badges.push('銅礦 +50 金'); }
  if (pol.has('pearl-trade'))        { goldFlat += 60; badges.push('珍珠貿 +60 金'); }
  if (pol.has('jade-trade'))         { goldFlat += 40; badges.push('玉貿 +40 金'); }
  if (pol.has('river-customs'))      { goldFlat += 50; badges.push('関稅 +50 金'); }
  if (pol.has('tea-trade'))          { goldMul += 0.10; badges.push('茶馬 +10% 金'); }
  if (pol.has('fish-salt'))          { goldFlat += 40; foodMul += 0.15; badges.push('漁鹽 +40 金 +15% 糧'); }

  // ── LOYALTY / SOCIAL ──────────────────────────────────────────────
  if (pol.has('rites'))              { loyaltyDelta += 1; badges.push('禮樂 +1 忠/季'); }
  if (pol.has('poor-relief'))        { loyaltyDelta += 1; badges.push('賑災 +1 忠/季'); }
  if (pol.has('community-granary'))  { loyaltyDelta += 2; badges.push('義倉 +2 忠/季'); }
  if (pol.has('charity-house'))      { loyaltyDelta += 1; badges.push('養濟院 +1 忠'); }
  if (pol.has('mediation'))          { loyaltyDelta += 1; badges.push('鄉約 +1 忠'); }
  if (pol.has('tax-light'))          { loyaltyDelta += 2; goldMul -= 0.20; badges.push('輕徭 +2 忠/-20% 金'); }
  // (protect-people is a tactic, not a policy — handled via tactics if needed)
  if (pol.has('frontier-pacification')) { loyaltyDelta += 2; badges.push('撫夷 +2 忠'); }
  // Heavy-handed policies cost loyalty for civic benefit
  if (pol.has('corvee'))             { loyaltyDelta -= 2; badges.push('力役 −2 忠'); }
  if (pol.has('conscription'))       { loyaltyDelta -= 1; troopCapMul += 0.35; badges.push('徵兵 −1 忠 +35% 兵'); }
  if (pol.has('watchnight'))         { loyaltyDelta -= 1; badges.push('夜禁 −1 忠'); }

  // ── DEFENSE ──────────────────────────────────────────────────────
  if (pol.has('fortifications'))     { defenseBonus += 30; badges.push('城防 +30 守'); }
  if (pol.has('moat-construction'))  { defenseBonus += 15; badges.push('護城河 +15 守'); }
  if (pol.has('watch-towers'))       { defenseBonus += 10; badges.push('烽燧 +10 守'); }
  if (pol.has('mountain-passes'))    { defenseBonus += 20; badges.push('關隘 +20 守'); }
  if (pol.has('coastal-fortress'))   { defenseBonus += 20; badges.push('海防 +20 守'); }
  if (pol.has('imperial-guard'))     { defenseBonus += 25; badges.push('禁衛 +25 守'); }

  // ── RECRUITMENT / TROOPS ────────────────────────────────────────
  if (pol.has('recruitment'))        { troopCapMul += 0.20; badges.push('養兵 +20% 兵'); }
  if (pol.has('horse-breeding'))     { troopCapMul += 0.10; badges.push('牧苑 +10% 兵'); }

  return {
    goldMul, goldFlat, foodMul, loyaltyDelta,
    defenseBonus, troopCapMul, badges,
  };
}

/**
 * Compute combat effects for a side based on the officers participating.
 */
export function combatPolicyEffects(
  sideOfficers: Officer[],
  context?: { weather?: string; terrain?: 'river' | 'naval' | 'mountain' | 'plain' },
): CombatPolicyEffects {
  const pol = aggregatePolicies(sideOfficers);
  let attackMul = 1, defenseMul = 1, fireMul = 1, rangedMul = 1, moraleFloor = 0;
  const badges: string[] = [];

  if (pol.has('military-theory'))    { attackMul += 0.10; badges.push('軍学 +10% 攻'); }
  if (pol.has('camp-discipline'))    { moraleFloor = Math.max(moraleFloor, 30); badges.push('軍紀 士氣保底 30'); }
  if (pol.has('military-academy'))   { attackMul += 0.08; badges.push('武備堂 +8% 攻'); }
  if (pol.has('elite-guards'))       { defenseMul -= 0.15; badges.push('親衛 −15% 受傷'); }
  if (pol.has('horse-armor'))        { defenseMul -= 0.20; badges.push('馬鎧 −20% 受傷'); }
  if (pol.has('shield-wall'))        { rangedMul -= 0.25; defenseMul -= 0.10; badges.push('盾陣 抗箭'); }
  if (pol.has('crossbow-corps'))     { rangedMul += 0.30; badges.push('弩兵 +30% 射'); }
  if (pol.has('archery-school'))     { rangedMul += 0.15; badges.push('射禮 +15% 射'); }
  // Naval-fireships shine in water battles with wind
  if (pol.has('naval-fireships')) {
    if (context?.terrain === 'naval' || context?.terrain === 'river') {
      fireMul += 0.50; badges.push('火船 +50% 火攻');
    } else {
      fireMul += 0.20; badges.push('火船 +20% 火攻');
    }
  }
  if (pol.has('supply-train'))       { moraleFloor = Math.max(moraleFloor, 25); badges.push('輜重 士氣保底 25'); }
  if (pol.has('frontier-pacification') && context?.terrain === 'mountain') {
    attackMul += 0.15; badges.push('撫夷 山地 +15% 攻');
  }
  if (pol.has('mountain-warfare') && context?.terrain === 'mountain') {
    attackMul += 0.20; defenseMul -= 0.10; badges.push('山戰 山地 +20% 攻');
  }
  if (pol.has('naval-academy') && (context?.terrain === 'naval' || context?.terrain === 'river')) {
    attackMul += 0.20; badges.push('水軍 +20% 攻');
  }

  return { attackMul, defenseMul, moraleFloor, fireMul, rangedMul, badges };
}

/**
 * Recruitment-related effects. Used when searching for talent or recruiting troops.
 */
export function recruitmentPolicyEffects(forceOfficers: Officer[]): {
  searchSuccessBonus: number;  // additive % to search success
  recruitTroopMul: number;     // multiplier on troops gained per recruit action
  badges: string[];
} {
  const pol = aggregatePolicies(forceOfficers);
  let searchSuccessBonus = 0, recruitTroopMul = 1;
  const badges: string[] = [];
  if (pol.has('scholarship'))     { searchSuccessBonus += 0.20; badges.push('學問 招攬 +20%'); }
  if (pol.has('seek-talent' as PolicyId)) { searchSuccessBonus += 0.15; }   // tactic alias if ever
  if (pol.has('nine-grade'))      { searchSuccessBonus += 0.15; badges.push('九品 招攬 +15%'); }
  if (pol.has('examination'))     { searchSuccessBonus += 0.10; badges.push('察舉 招攬 +10%'); }
  if (pol.has('school-village'))  { searchSuccessBonus += 0.10; badges.push('鄉學 +10%'); }
  if (pol.has('imperial-academy')){ searchSuccessBonus += 0.15; badges.push('太學 +15%'); }
  if (pol.has('defector-reward')) { searchSuccessBonus += 0.10; badges.push('招降 +10%'); }
  if (pol.has('noble-titles'))    { searchSuccessBonus += 0.10; badges.push('封爵 +10%'); }
  if (pol.has('propaganda'))      { searchSuccessBonus += 0.05; badges.push('檄文 +5%'); }
  if (pol.has('recruitment'))     { recruitTroopMul += 0.20; }
  if (pol.has('horse-breeding'))  { recruitTroopMul += 0.10; }
  if (pol.has('military-drill'))  { recruitTroopMul += 0.05; badges.push('演武 兵質 +5%'); }
  return { searchSuccessBonus, recruitTroopMul, badges };
}
