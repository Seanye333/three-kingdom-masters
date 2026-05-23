import type { City, Force, Officer } from '../types';

export const RECRUIT_COST = 200;
export const FREE_AGENT_COST = 100;

export interface RecruitInput {
  officer: Officer;
  city: City;
  recruiterForce: Force;
  recruiterRuler: Officer;
  rng?: () => number;
}

export interface RecruitOutput {
  ok: boolean;
  message: string;
  recruitedOfficer?: Officer;
}

export function attemptRecruit(input: RecruitInput): RecruitOutput {
  const rng = input.rng ?? Math.random;
  const { officer, city, recruiterForce, recruiterRuler } = input;

  if (officer.status !== 'imprisoned') {
    return { ok: false, message: 'Officer is not a captive.' };
  }
  if (city.gold < RECRUIT_COST) {
    return { ok: false, message: 'Not enough gold to attempt recruitment.' };
  }

  // Probability is shaped by the ruler's charisma and the prisoner's loyalty
  // to their (lost) former allegiance.
  const persuasion = recruiterRuler.stats.charisma;
  const resistance = officer.loyalty;
  const raw = (persuasion - resistance + 50) / 100;
  const chance = clamp01(raw);
  const roll = rng();
  if (roll < chance) {
    const recruited: Officer = {
      ...officer,
      status: 'idle',
      forceId: recruiterForce.id,
      locationCityId: city.id,
      loyalty: Math.max(40, Math.floor(persuasion * 0.7)),
      task: null,
    };
    return {
      ok: true,
      message: `${officer.name.en} bows and pledges service to ${recruiterForce.name.en}.`,
      recruitedOfficer: recruited,
    };
  }

  return {
    ok: false,
    message: `${officer.name.en} refused. ${RECRUIT_COST} gold spent.`,
  };
}

export interface FreeAgentRecruitInput {
  officer: Officer;
  city: City;
  recruiterForce: Force;
  recruiterRuler: Officer;
  rng?: () => number;
}

export function attemptFreeAgentRecruit(
  input: FreeAgentRecruitInput,
): RecruitOutput {
  const rng = input.rng ?? Math.random;
  const { officer, city, recruiterForce, recruiterRuler } = input;

  if (officer.status !== 'idle' || officer.forceId !== null) {
    return { ok: false, message: 'Officer is not a free agent.' };
  }
  if (city.gold < FREE_AGENT_COST) {
    return { ok: false, message: 'Not enough gold to offer them service.' };
  }

  // Free agents are less resistant — their willingness scales with
  // recruiter charisma alone.
  const chance = clamp01((recruiterRuler.stats.charisma + 20) / 100);
  if (rng() < chance) {
    const recruited: Officer = {
      ...officer,
      status: 'idle',
      forceId: recruiterForce.id,
      locationCityId: city.id,
      loyalty: Math.max(60, Math.floor(recruiterRuler.stats.charisma * 0.8)),
      task: null,
    };
    return {
      ok: true,
      message: `${officer.name.en} accepts a place in ${recruiterForce.name.en}.`,
      recruitedOfficer: recruited,
    };
  }

  return {
    ok: false,
    message: `${officer.name.en} declines and slips away. ${FREE_AGENT_COST} gold spent.`,
  };
}

export function applyExecute(officer: Officer): Officer {
  return {
    ...officer,
    status: 'dead',
    forceId: null,
    locationCityId: null,
    task: null,
  };
}

export function applyRelease(officer: Officer): Officer {
  return {
    ...officer,
    status: 'idle',
    forceId: null,
    task: null,
  };
}

function clamp01(v: number): number {
  return Math.max(0.05, Math.min(0.95, v));
}
