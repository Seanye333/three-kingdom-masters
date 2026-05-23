import type { Officer } from '../types';

/**
 * 舌戰 — pre-battle war of words. Each side may field a strategist; the
 * one with higher intelligence + charisma wins. The loser's side starts
 * the upcoming tactical battle demoralized (−10 morale on all units).
 */
export interface WordWarLine {
  speakerId: string;
  text: { zh: string; en: string };
}

export interface WordWarResult {
  winnerSide: 'attacker' | 'defender' | 'draw';
  attackerStrategistId?: string;
  defenderStrategistId?: string;
  lines: WordWarLine[];
  /** Morale modifier (−10/0/+10) to be applied at battle start. */
  attackerMoraleDelta: number;
  defenderMoraleDelta: number;
}

// Generic taunts and ripostes — picked randomly to give variety.
const BARBS_ATTACKER: Array<{ zh: string; en: string }> = [
  { zh: '汝主庸碌,何敢與我爭鋒?', en: 'Your lord is a mediocrity — how dare you contend with me?' },
  { zh: '不識天命,猶作螳臂!', en: 'You do not know heaven\'s mandate — yet you raise a praying mantis\'s arm!' },
  { zh: '此役不勝,枉為人臣!', en: 'If we do not win today, we are not worthy of being subjects of any lord!' },
];
const BARBS_DEFENDER: Array<{ zh: string; en: string }> = [
  { zh: '小兒之言,何足懼也?', en: 'A child\'s words — why should I fear them?' },
  { zh: '逆天而動,終必自敗!', en: 'You move against heaven — your defeat is already written!' },
  { zh: '此地堅城,豈是汝可破?', en: 'This city stands fast — what makes you think you can break it?' },
];
const RIPOSTES: Array<{ zh: string; en: string }> = [
  { zh: '誇誇其談,毫無實據!', en: 'Empty boasting, with no proof behind it!' },
  { zh: '汝之計,我已盡知!', en: 'Your every stratagem — I already know!' },
  { zh: '今日讓你見識真功夫!', en: 'Today I show you what real skill looks like!' },
];

export function resolveWordWar(
  attackerCommander: Officer,
  defenderCommander: Officer,
  attackerCompanions: Officer[],
  defenderCompanions: Officer[],
  rng: () => number = Math.random,
): WordWarResult {
  const pickStrategist = (cmd: Officer, companions: Officer[]) => {
    const pool = [cmd, ...companions];
    pool.sort((a, b) => (b.stats.intelligence + b.stats.charisma) - (a.stats.intelligence + a.stats.charisma));
    return pool[0];
  };
  const a = pickStrategist(attackerCommander, attackerCompanions);
  const d = pickStrategist(defenderCommander, defenderCompanions);
  const aScore = a.stats.intelligence + a.stats.charisma * 0.5 + rng() * 20;
  const dScore = d.stats.intelligence + d.stats.charisma * 0.5 + rng() * 20;

  const lines: WordWarLine[] = [];
  // 2 exchanges.
  for (let i = 0; i < 2; i++) {
    const aBarb = BARBS_ATTACKER[Math.floor(rng() * BARBS_ATTACKER.length)];
    lines.push({ speakerId: a.id, text: aBarb });
    const dBarb = i === 0
      ? BARBS_DEFENDER[Math.floor(rng() * BARBS_DEFENDER.length)]
      : RIPOSTES[Math.floor(rng() * RIPOSTES.length)];
    lines.push({ speakerId: d.id, text: dBarb });
  }

  const margin = Math.abs(aScore - dScore);
  if (margin < 10) {
    return {
      winnerSide: 'draw',
      attackerStrategistId: a.id,
      defenderStrategistId: d.id,
      lines,
      attackerMoraleDelta: 0,
      defenderMoraleDelta: 0,
    };
  }
  if (aScore > dScore) {
    return {
      winnerSide: 'attacker',
      attackerStrategistId: a.id,
      defenderStrategistId: d.id,
      lines,
      attackerMoraleDelta: 0,
      defenderMoraleDelta: -10,
    };
  }
  return {
    winnerSide: 'defender',
    attackerStrategistId: a.id,
    defenderStrategistId: d.id,
    lines,
    attackerMoraleDelta: -10,
    defenderMoraleDelta: 0,
  };
}
