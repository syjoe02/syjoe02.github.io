import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { METRICS, firstPeriod, lastPeriod, buildComparison, periodNote } from '../site/compare.js';

const load = (name) => JSON.parse(readFileSync(new URL(`../site/data/${name}`, import.meta.url)));
const byKey = (rows) => Object.fromEntries(rows.map((r) => [r.key, r]));

const before = { name: 'b', values: { 'ctx K/step': 211, 'out/turn': 18900, 'agents/session': 1.36, 'tests %': 23, 'tool_result KB/turn': 10 } };
const after = { name: 'a', values: { 'ctx K/step': 172, 'out/turn': 13500, 'agents/session': 0.54, 'tests %': 46, 'tool_result KB/turn': 10 } };

// Fixtures, not data/*.json: a new measurement must not fail the deploy.
test('fixture values give the expected changes and trends', () => {
  const rows = byKey(buildComparison(before, after));
  const pct = Object.fromEntries(METRICS.map((m) => [m.key, rows[m.key].changePct]));
  assert.deepEqual(pct, { 'ctx K/step': -18, 'out/turn': -29, 'agents/session': -60, 'tests %': 100, 'tool_result KB/turn': 0 });
  assert.deepEqual(METRICS.map((m) => rows[m.key].trend), ['better', 'better', 'better', 'better', 'flat']);
});

test('shipped data files give a Before and an After with every tracked metric', () => {
  for (const period of [firstPeriod(load('baseline.json')), lastPeriod(load('metrics.json'))]) {
    assert.ok(period, 'no usable period');
    for (const { key } of METRICS) assert.ok(Number.isFinite(period.values[key]), `${period.name}: ${key} missing`);
  }
});

test('a period without any tracked measurement counts as missing', () => {
  assert.equal(lastPeriod({ 'Sep 2026': { 'ctx K/step': null, 'model mix': 'opus:80%' } }), null);
  assert.equal(lastPeriod({ 'Sep 2026': { 'tests %': 46 } })?.name, 'Sep 2026');
});

test('context is reported in tokens so it formats as 172K', () => {
  const rows = byKey(buildComparison(before, after));
  assert.equal(rows['ctx K/step'].before, 211000);
  assert.equal(rows['ctx K/step'].after, 172000);
  assert.equal(rows['ctx K/step'].unit, 'tokens');
});

test('a documented cause shows only when the metric improved', () => {
  const better = byKey(buildComparison(before, after));
  assert.equal(better['out/turn'].note, 'Fell after dropping a per-reply footer');
  assert.equal(better['ctx K/step'].note, null);
  // Re-measured counts left agents/session within one session's noise, so it claims no cause.
  assert.equal(better['agents/session'].note, null);
  const worse = byKey(buildComparison(before, { name: 'a', values: { ...after.values, 'out/turn': 20000 } }));
  assert.equal(worse['out/turn'].trend, 'worse');
  assert.equal(worse['out/turn'].note, null);
});

test('period note gives the session count only when the table has one', () => {
  assert.equal(periodNote('Before', { name: 'Aug 2026', values: { sessions: 57 } }), 'Before (Aug 2026): 57 sessions.');
  assert.equal(periodNote('After', { name: 'Nov 1-18', values: { 'ctx K/step': 286 } }), 'After (Nov 1-18).');
});

test('uses the last period of a multi-period table', () => {
  const table = { 'wk 10-05': { 'ctx K/step': 180 }, 'wk 10-12': { 'ctx K/step': 150 } };
  assert.equal(lastPeriod(table).name, 'wk 10-12');
  assert.equal(firstPeriod(table).name, 'wk 10-05');
});

test('ignores non-numeric extra fields', () => {
  const noisy = { name: 'a', values: { ...after.values, 'model mix': 'opus:80%', 'en subject %': null } };
  assert.deepEqual(buildComparison(before, noisy), buildComparison(before, after));
});

test('missing metric gives a null after for that row only', () => {
  const { 'tests %': _, ...rest } = after.values;
  const rows = byKey(buildComparison(before, { name: 'a', values: rest }));
  assert.equal(rows['tests %'].after, null);
  assert.equal(rows['tests %'].changePct, null);
  assert.equal(rows['tests %'].trend, null);
  assert.equal(rows['ctx K/step'].after, 172000);
  assert.equal(rows['ctx K/step'].changePct, -18);
});

test('invalid tables give null periods', () => {
  for (const bad of [null, [], {}, 'x', { a: 1 }]) assert.equal(lastPeriod(bad), null);
  const rows = buildComparison(before, null);
  assert.deepEqual(rows.map((r) => r.before), [211000, 18900, 1.36, 23, 10]);
  assert.ok(rows.every((r) => r.after === null && r.changePct === null));
});

test('zero before gives no percentage', () => {
  const rows = byKey(buildComparison({ name: 'b', values: { 'agents/session': 0 } }, { name: 'a', values: { 'agents/session': 0.5 } }));
  assert.equal(rows['agents/session'].changePct, null);
});
