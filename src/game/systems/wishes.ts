import type {
  City,
  EntityId,
  GameDate,
  Officer,
  OfficerWish,
  ReportEntry,
  WishKind,
} from '../types';
import { POLICY_DEFS, POLICY_PREREQ, type PolicyId } from '../data/officerAttributes';

/**
 * Officer wishes: a small chance each season that an active officer in the
 * player's force will make a request. Granting it boosts loyalty; rejecting
 * it drops loyalty by the configured penalty.
 */

const WISH_CHANCE_PER_OFFICER = 0.04;
const MAX_OPEN_WISHES = 4;

export interface WishContext {
  officers: Record<EntityId, Officer>;
  cities: Record<EntityId, City>;
  playerForceId: EntityId | null;
  existing: OfficerWish[];
  date: GameDate;
  rng: () => number;
}

export function rollWishes(ctx: WishContext): OfficerWish[] {
  if (!ctx.playerForceId) return ctx.existing;
  if (ctx.existing.length >= MAX_OPEN_WISHES) return ctx.existing;
  const playerOfficers = Object.values(ctx.officers).filter(
    (o) =>
      o.forceId === ctx.playerForceId &&
      o.status === 'idle' &&
      o.loyalty < 95 &&
      !ctx.existing.some((w) => w.officerId === o.id),
  );
  if (playerOfficers.length === 0) return ctx.existing;
  const newWishes: OfficerWish[] = [];
  for (const o of playerOfficers) {
    if (ctx.rng() > WISH_CHANCE_PER_OFFICER) continue;
    if (newWishes.length + ctx.existing.length >= MAX_OPEN_WISHES) break;
    newWishes.push(generateWish(o, ctx));
  }
  return [...ctx.existing, ...newWishes];
}

function generateWish(o: Officer, ctx: WishContext): OfficerWish {
  // Officers with int >= 70 and < 8 policies sometimes wish to learn one.
  const have = new Set(o.policies ?? []);
  const learnable: PolicyId[] = [];
  if (o.stats.intelligence >= 70 && have.size < 8) {
    for (const id of Object.keys(POLICY_DEFS) as PolicyId[]) {
      if (have.has(id)) continue;
      const prereqs = POLICY_PREREQ[id] ?? [];
      if (prereqs.every((p) => have.has(p))) learnable.push(id);
    }
  }
  const kinds: WishKind[] = ['transfer', 'reinforce', 'promote'];
  if (learnable.length > 0) kinds.push('learn-policy');
  const kind = kinds[Math.floor(ctx.rng() * kinds.length)];
  if (kind === 'learn-policy') {
    const wantId = learnable[Math.floor(ctx.rng() * learnable.length)];
    const want = POLICY_DEFS[wantId];
    return {
      id: `wish-${o.id}-${ctx.date.year}-${ctx.date.season}`,
      officerId: o.id,
      kind: 'learn-policy',
      text: {
        zh: `${o.name.zh}求學「${want?.zh ?? wantId}」之政。`,
        en: `${o.name.en} wishes to study the policy ${want?.en ?? wantId}.`,
      },
      targetId: wantId,
      issuedYear: ctx.date.year,
      issuedSeason: ctx.date.season,
      rejectPenalty: 4,
      grantBonus: 14,
    };
  }
  if (kind === 'transfer') {
    const otherCities = Object.values(ctx.cities).filter(
      (c) => c.ownerForceId === ctx.playerForceId && c.id !== o.locationCityId,
    );
    const target = otherCities[Math.floor(ctx.rng() * otherCities.length)];
    return {
      id: `wish-${o.id}-${ctx.date.year}-${ctx.date.season}`,
      officerId: o.id,
      kind: 'transfer',
      text: {
        zh: `${o.name.zh}请求转任至${target?.name.zh ?? '其他城'}。`,
        en: `${o.name.en} requests transfer to ${target?.name.en ?? 'another city'}.`,
      },
      targetId: target?.id,
      issuedYear: ctx.date.year,
      issuedSeason: ctx.date.season,
      rejectPenalty: 8,
      grantBonus: 10,
    };
  }
  if (kind === 'reinforce') {
    return {
      id: `wish-${o.id}-${ctx.date.year}-${ctx.date.season}`,
      officerId: o.id,
      kind: 'reinforce',
      text: {
        zh: `${o.name.zh}请求增兵${o.locationCityId ? ctx.cities[o.locationCityId]?.name.zh : ''}。`,
        en: `${o.name.en} requests reinforcements for ${o.locationCityId ? ctx.cities[o.locationCityId]?.name.en : 'their city'}.`,
      },
      targetId: o.locationCityId ?? undefined,
      issuedYear: ctx.date.year,
      issuedSeason: ctx.date.season,
      rejectPenalty: 6,
      grantBonus: 8,
    };
  }
  return {
    id: `wish-${o.id}-${ctx.date.year}-${ctx.date.season}`,
    officerId: o.id,
    kind: 'promote',
    text: {
      zh: `${o.name.zh}请求升迁。`,
      en: `${o.name.en} requests promotion.`,
    },
    issuedYear: ctx.date.year,
    issuedSeason: ctx.date.season,
    rejectPenalty: 10,
    grantBonus: 12,
  };
}

/**
 * Apply the answer to a wish: grants give the loyalty bonus and resolve the
 * referenced action; rejections cost loyalty.
 */
export interface ApplyWishContext {
  officers: Record<EntityId, Officer>;
  cities: Record<EntityId, City>;
  /** Multiplier on the granted loyalty bonus — driven by 諫議大夫. */
  advisorMultiplier?: number;
}

export function applyWishGrant(
  wish: OfficerWish,
  ctx: ApplyWishContext,
): { officers: Record<EntityId, Officer>; entry: ReportEntry } {
  const officers = { ...ctx.officers };
  const o = officers[wish.officerId];
  if (!o) {
    return {
      officers,
      entry: { cityId: null, kind: 'note', text: 'Wish target gone.', textZh: '心願對象已不在。' },
    };
  }
  const bonus = Math.ceil(wish.grantBonus * (ctx.advisorMultiplier ?? 1));
  if (wish.kind === 'transfer' && wish.targetId) {
    officers[o.id] = {
      ...o,
      locationCityId: wish.targetId,
      loyalty: Math.min(100, o.loyalty + bonus),
    };
  } else {
    officers[o.id] = {
      ...o,
      loyalty: Math.min(100, o.loyalty + bonus),
    };
  }
  return {
    officers,
    entry: {
      cityId: o.locationCityId,
      kind: 'note',
      text: `Granted ${o.name.en}'s wish (+${bonus} loyalty).`,
      textZh: `達成${o.name.zh}之心願（忠誠 +${bonus}）。`,
    },
  };
}

export function applyWishReject(
  wish: OfficerWish,
  ctx: ApplyWishContext,
): { officers: Record<EntityId, Officer>; entry: ReportEntry } {
  const officers = { ...ctx.officers };
  const o = officers[wish.officerId];
  if (!o) {
    return {
      officers,
      entry: { cityId: null, kind: 'note', text: 'Wish target gone.', textZh: '心願對象已不在。' },
    };
  }
  officers[o.id] = {
    ...o,
    loyalty: Math.max(0, o.loyalty - wish.rejectPenalty),
  };
  return {
    officers,
    entry: {
      cityId: o.locationCityId,
      kind: 'note',
      text: `Rejected ${o.name.en}'s wish (−${wish.rejectPenalty} loyalty).`,
      textZh: `回絕${o.name.zh}之心願（忠誠 −${wish.rejectPenalty}）。`,
    },
  };
}
