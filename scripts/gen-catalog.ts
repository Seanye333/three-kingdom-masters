/**
 * 內容目錄生成器 — 從 src/game/data 抽取所有內容清單。產出兩份:
 *   1) docs/CATALOG.md     — 完整全量(每件名品/政策/戰法…),供查閱/grep。
 *   2) docs/GUIDE.md 附錄  — 可讀摘要(小集合全表 + 大集合統計與精選)。
 * 重新生成:  npm run docs:catalog
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { ITEMS } from '../src/game/data/items';
import { SKILLS } from '../src/game/data/skills';
import { PRESTIGE_TITLES } from '../src/game/data/prestige';
import { CHALLENGES } from '../src/game/data/challenges';
import { SHIP_CLASSES } from '../src/game/data/ships';
import { ELITE_TROOPS } from '../src/game/data/eliteTroops';
import { CIVIC_TITLES, MILITARY_RANKS } from '../src/game/data/titles';
import { DEFENSE_BUILDINGS } from '../src/game/data/defenseBuildings';
import { SIEGE_ENGINES } from '../src/game/data/siegeEngines';
import { POLICY_DEFS, TACTIC_DEFS } from '../src/game/data/officerAttributes';
import { SCENARIOS } from '../src/game/data/scenarios';

const here = dirname(fileURLToPath(import.meta.url));
const GUIDE = join(here, '..', 'docs', 'GUIDE.md');
const CATALOG = join(here, '..', 'docs', 'CATALOG.md');

const effTotal = (e: Record<string, number> | undefined) =>
  e ? Object.values(e).reduce((a, b) => a + (b as number), 0) : 0;
const effStr = (e: Record<string, number> | undefined) =>
  e ? Object.entries(e).map(([k, v]) => `${k.slice(0, 3).toUpperCase()}+${v}`).join(' ') : '';
const clean = (s?: string) => (s ?? '').replace(/\|/g, '/');

const itemsByKind: Record<string, number> = {};
for (const it of ITEMS) itemsByKind[it.kind] = (itemsByKind[it.kind] ?? 0) + 1;
const policyN = Object.keys(POLICY_DEFS).length;
const tacticN = Object.keys(TACTIC_DEFS).length;
const siege = Object.values(SIEGE_ENGINES) as Array<{ name: { zh: string; en: string }; defenseMultiplier: number; descriptionZh?: string }>;
const defs = Object.values(DEFENSE_BUILDINGS) as Array<{ name: { zh: string; en: string }; goldCost: number; maxLevel: number; descriptionZh?: string }>;

// ─── shared small-set tables (used in both summary and full) ───
function smallTables(): string[] {
  const L: string[] = [];
  L.push('', `### 技能 Skills(${SKILLS.length})`, '', '| 技 | 類別 | 說明 |', '|---|---|---|');
  for (const sk of SKILLS) L.push(`| ${sk.name.zh} ${sk.name.en} | ${(sk as { category?: string }).category ?? ''} | ${clean(sk.descriptionZh)} |`);

  L.push('', `### 威名 Prestige(${PRESTIGE_TITLES.length})`, '', '| 威名 | 路線 | 效果 |', '|---|---|---|');
  for (const p of PRESTIGE_TITLES) {
    const e = p.effects as { duelBonus?: number; combatPowerMul?: number; incomeMul?: number };
    const parts = [e.duelBonus ? `單挑+${e.duelBonus}` : '', e.combatPowerMul && e.combatPowerMul !== 1 ? `戰力×${e.combatPowerMul}` : '', e.incomeMul && e.incomeMul !== 1 ? `收入×${e.incomeMul}` : ''].filter(Boolean).join(' ');
    L.push(`| ${p.name.zh} ${p.name.en} | ${(p as { path?: string }).path ?? ''} | ${parts} |`);
  }

  L.push('', `### 官職 Civic Titles(${CIVIC_TITLES.length})`, '', '| 官職 | 主屬性 | 效果 |', '|---|---|---|');
  for (const c of CIVIC_TITLES) L.push(`| ${c.name.zh} ${c.name.en} | ${(c as { primaryStat?: string }).primaryStat ?? ''} | ${clean(c.descriptionZh)} |`);

  L.push('', `### 軍階 Military Ranks(${MILITARY_RANKS.length})`, '', MILITARY_RANKS.map((r) => r.name.zh).join(' → '));

  L.push('', `### 船級 Ship Classes(${SHIP_CLASSES.length})`, '', '| 船 | 造價 | 工期 | 戰力 | 載量 |', '|---|---|---|---|---|');
  for (const s of SHIP_CLASSES) L.push(`| ${s.name.zh} ${s.name.en} | ${s.goldCost} | ${s.seasonsToBuild} | ${s.combatStrength} | ${(s as { capacity?: number }).capacity ?? '—'} |`);

  L.push('', `### 精兵 Elite Troops(${ELITE_TROOPS.length})`, '', '| 精兵 | 戰力× | 損耗× | 武力+ |', '|---|---|---|---|');
  for (const e of ELITE_TROOPS) L.push(`| ${e.name.zh} ${e.name.en} | ${e.powerMultiplier} | ${(e as { ownLossMultiplier?: number }).ownLossMultiplier ?? '—'} | ${(e as { warBonus?: number }).warBonus ?? 0} |`);

  L.push('', `### 攻城器械 Siege Engines(${siege.length})`, '', '| 器械 | 守備× | 說明 |', '|---|---|---|');
  for (const s of siege) L.push(`| ${s.name.zh} ${s.name.en} | ${s.defenseMultiplier} | ${clean(s.descriptionZh)} |`);

  L.push('', `### 城防設施 Defense Buildings(${defs.length})`, '', '| 設施 | 造價 | 上限級 | 說明 |', '|---|---|---|---|');
  for (const d of defs) L.push(`| ${d.name.zh} ${d.name.en} | ${d.goldCost} | ${d.maxLevel} | ${clean(d.descriptionZh).slice(0, 60)} |`);

  L.push('', `### 英雄模式挑戰 Hero-Mode Challenges(${CHALLENGES.length})`, '', '| 挑戰 | 難度 | 劇本 | 期限 |', '|---|---|---|---|');
  for (const c of CHALLENGES) L.push(`| ${c.name.zh} ${c.name.en} | ${(c as { difficulty?: string }).difficulty ?? ''} | ${c.scenarioId} | ${(c as { deadlineYear?: number }).deadlineYear ?? '—'} |`);

  const byKind = new Map<string, string[]>();
  for (const s of SCENARIOS) {
    const k = (s as { kind?: string }).kind ?? 'historical';
    if (!byKind.has(k)) byKind.set(k, []);
    byKind.get(k)!.push(`${s.name.zh}(${s.startDate.year})`);
  }
  L.push('', `### 劇本 Scenarios(${SCENARIOS.length})`, '');
  for (const [k, names] of byKind) L.push(`- **${k}**(${names.length}):${names.join('、')}`);
  return L;
}

// ─── GUIDE summary block ───
const summary: string[] = [];
summary.push(
  '> 完整全量(全部 1273 名品 / 政策 / 戰法逐條)見 **[docs/CATALOG.md](CATALOG.md)**;此處為可讀摘要。',
  '',
  '### 內容總量',
  '',
  '| 類別 | 數量 |',
  '|---|---|',
  `| 名品 Items | ${ITEMS.length}(${Object.entries(itemsByKind).map(([k, n]) => `${k} ${n}`).join(' / ')}) |`,
  `| 政策 Policies | ${policyN} |`,
  `| 戰法 Tactics | ${tacticN} |`,
  `| 技能 Skills | ${SKILLS.length} |`,
  `| 威名 Prestige | ${PRESTIGE_TITLES.length} |`,
  `| 官職 Civic Titles | ${CIVIC_TITLES.length} |`,
  `| 船級 Ships | ${SHIP_CLASSES.length} |`,
  `| 精兵 Elite | ${ELITE_TROOPS.length} |`,
  `| 攻城器械 Siege | ${siege.length} |`,
  `| 城防設施 Defense | ${defs.length} |`,
  `| 英雄挑戰 Challenges | ${CHALLENGES.length} |`,
  `| 劇本 Scenarios | ${SCENARIOS.length} |`,
);
// 名品精選 — top 30 by effect total
const topItems = [...ITEMS].sort((a, b) => effTotal(b.effects as Record<string, number>) - effTotal(a.effects as Record<string, number>)).slice(0, 30);
summary.push('', '### 名品精選(加成最高 30 件,全表見 CATALOG)', '', '| 名 | 類 | 出處城 | 加成 |', '|---|---|---|---|');
for (const it of topItems) summary.push(`| ${it.name.zh} | ${it.kind} | ${it.originCityId ?? '—'} | ${effStr(it.effects as Record<string, number>)} |`);
summary.push(...smallTables());

// ─── CATALOG.md full dump ───
const full: string[] = [
  '# 三國志大師 · 完整內容目錄(機器生成)',
  '',
  '> 由 `scripts/gen-catalog.ts` 自動生成,請勿手改;重生成:`npm run docs:catalog`。',
  '> 可讀摘要見 [GUIDE.md](GUIDE.md) 附錄。',
];
full.push('', `## 名品 Items(${ITEMS.length})`, '', '| 名 | 類 | 出處城 | 加成 |', '|---|---|---|---|');
for (const it of ITEMS) full.push(`| ${it.name.zh} ${it.name.en} | ${it.kind} | ${it.originCityId ?? '—'} | ${effStr(it.effects as Record<string, number>)} |`);
full.push('', `## 政策 Policies(${policyN})`, '', (Object.values(POLICY_DEFS) as Array<{ zh: string; en: string }>).map((v) => `${v.zh} ${v.en}`).join(' · '));
full.push('', `## 戰法 Tactics(${tacticN})`, '', (Object.values(TACTIC_DEFS) as Array<{ zh: string; en: string }>).map((v) => `${v.zh} ${v.en}`).join(' · '));
full.push(...smallTables());

writeFileSync(CATALOG, full.join('\n') + '\n');

const md = readFileSync(GUIDE, 'utf8');
writeFileSync(GUIDE, md.replace(
  /<!-- CATALOG:START -->[\s\S]*<!-- CATALOG:END -->/,
  `<!-- CATALOG:START -->\n${summary.join('\n')}\n<!-- CATALOG:END -->`,
));
console.log(`CATALOG.md: ${full.length} lines · GUIDE summary: ${summary.length} lines`);
