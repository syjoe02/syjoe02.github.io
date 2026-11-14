// Turns two `metrics.py --json` tables ({ "<period>": { "<metric>": value } }) into Before/After rows.

// `scale`: metrics.py writes context in thousands; tokens let it format as 172K like out/turn.
// `why`: documented cause from the audit, shown only while the metric is still better.
export const METRICS = [
  { key: 'ctx K/step', label: 'Context read per response', unit: 'tokens', scale: 1000, lowerIsBetter: true },
  { key: 'out/turn', label: 'Output tokens per turn', unit: 'tokens', lowerIsBetter: true, why: 'Fell after dropping a per-reply footer' },
  { key: 'agents/session', label: 'Subagent dispatches per session', unit: '', lowerIsBetter: true, why: 'Fell after removing nonexistent agents' },
  { key: 'tests %', label: 'Sessions that ran tests', unit: '%', lowerIsBetter: false },
  { key: 'tool_result KB/turn', label: 'Tool output per turn', unit: 'KB', lowerIsBetter: true },
];

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

function periods(table) {
  if (!isObject(table)) return [];
  return Object.entries(table)
    .filter(([, values]) => isObject(values))
    .map(([name, values]) => ({ name, values }));
}

export const firstPeriod = (table) => periods(table)[0] ?? null;
export const lastPeriod = (table) => periods(table).at(-1) ?? null;

const num = (period, key, scale = 1) => {
  const v = period?.values[key];
  return Number.isFinite(v) ? v * scale : null;
};

function trendOf(changePct, lowerIsBetter) {
  if (changePct === null) return null;
  if (changePct === 0) return 'flat';
  return changePct < 0 === lowerIsBetter ? 'better' : 'worse';
}

export function buildComparison(before, after) {
  return METRICS.map(({ key, label, unit, scale, lowerIsBetter, why }) => {
    const b = num(before, key, scale);
    const a = num(after, key, scale);
    const changePct = b === null || a === null || b === 0 ? null : Math.round(((a - b) / b) * 100);
    const trend = trendOf(changePct, lowerIsBetter);
    return { key, label, unit, before: b, after: a, changePct, trend, note: (trend === 'better' && why) || null };
  });
}
