/**
 * 技能可視化 — every innate skill gets a signature battle aura, built from a
 * small set of reusable 3D archetypes (blaze / mystic / embers / arrows / dust
 * / ring / banner / wave / aura) tinted a per-skill colour, so a 武神 burns
 * red, a 臥龍 swirls deep-blue runes, a 弓神 glints with arrow-shards, etc.
 *
 * Pure data — the archetype string + colour. The renderer (SkillAura in the
 * tactical battle) turns each archetype into meshes. The hero's first listed
 * skill is the one shown (the data lists each officer's signature first).
 */
export type SkillFxArchetype =
  | 'blaze' | 'mystic' | 'embers' | 'arrows' | 'dust' | 'ring' | 'banner' | 'wave' | 'aura';

export interface SkillFx { zh: string; color: string; archetype: SkillFxArchetype; }

export const SKILL_FX: Record<string, SkillFx> = {
  // ── combat ──
  'god-of-war':        { zh: '武神',     color: '#ff3b2e', archetype: 'blaze' },
  'flying-general':    { zh: '飛將',     color: '#ffd24a', archetype: 'blaze' },
  'sage-of-war':       { zh: '兵聖',     color: '#e6ecf2', archetype: 'blaze' },
  'tiger-vanguard':    { zh: '虎臣',     color: '#e08020', archetype: 'banner' },
  'iron-vow':          { zh: '鉄誓',     color: '#c2cad4', archetype: 'ring' },
  'archer-master':     { zh: '弓神',     color: '#d8c488', archetype: 'arrows' },
  'cavalry-master':    { zh: '騎神',     color: '#c8a878', archetype: 'dust' },
  'navy-master':       { zh: '水神',     color: '#3ac0e0', archetype: 'wave' },
  'brave':             { zh: '勇猛',     color: '#ff6020', archetype: 'blaze' },
  'tireless':          { zh: '不屈',     color: '#9ad0a0', archetype: 'ring' },
  'pursuit':           { zh: '追撃',     color: '#d6b860', archetype: 'dust' },
  'rear-guard':        { zh: '殿軍',     color: '#8090a4', archetype: 'ring' },
  'tiger-of-jiangdong':{ zh: '江東之虎', color: '#d8402e', archetype: 'banner' },
  'little-conqueror':  { zh: '小覇王',   color: '#ff5060', archetype: 'blaze' },
  // ── wisdom ──
  'celestial-tactician':{ zh: '神算',    color: '#7ec8ff', archetype: 'mystic' },
  'crouching-dragon':  { zh: '臥龍',     color: '#3a7dd9', archetype: 'mystic' },
  'young-phoenix':     { zh: '鳳雛',     color: '#e0709a', archetype: 'mystic' },
  'fire-master':       { zh: '火神',     color: '#ff7020', archetype: 'embers' },
  'ambush-master':     { zh: '伏兵',     color: '#7a52a8', archetype: 'mystic' },
  'iron-will':         { zh: '剛胆',     color: '#b8a860', archetype: 'ring' },
  // ── command ──
  'iron-formation':    { zh: '鉄壁',     color: '#90a0b4', archetype: 'ring' },
  'imposing-host':     { zh: '威風',     color: '#e6c440', archetype: 'banner' },
  'siegemaster':       { zh: '攻城',     color: '#9a7450', archetype: 'ring' },
  'wallwarden':        { zh: '守城',     color: '#7a8a9c', archetype: 'ring' },
  // ── civil (subtle haloes) ──
  'benevolent':        { zh: '仁徳',     color: '#ffd87a', archetype: 'aura' },
  'silver-tongue':     { zh: '弁舌',     color: '#a0d0ff', archetype: 'aura' },
  'eye-for-talent':    { zh: '識才',     color: '#c0a0e8', archetype: 'aura' },
  'administrator':     { zh: '内政',     color: '#90c890', archetype: 'aura' },
  'tax-genius':        { zh: '財政',     color: '#e6c440', archetype: 'aura' },
  'farmer':            { zh: '農政',     color: '#a8c860', archetype: 'aura' },
};

/** The signature FX for a unit: its officer's first listed skill that has one. */
export function primarySkillFx(skillIds: readonly string[] | undefined): (SkillFx & { id: string }) | null {
  if (!skillIds) return null;
  for (const id of skillIds) {
    const fx = SKILL_FX[id];
    if (fx) return { ...fx, id };
  }
  return null;
}
