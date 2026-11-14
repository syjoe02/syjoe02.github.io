import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { METRICS, firstPeriod, lastPeriod, buildComparison } from '../site/compare.js';

const load = (name) => JSON.parse(readFileSync(new URL(`../site/data/${name}`, import.meta.url)));
const byKey = (rows) => Object.fromEntries(rows.map((r) => [r.key, r]));

const before = { name: 'b', values: { 'ctx K/step': 211, 'out/turn': 18900, 'agents/session': 1.36, 'tests %': 23, 'tool_result KB/turn': 10 } };
const after = { name: 'a', values: { 'ctx K/step': 172, 'out/turn': 13500, 'agents/session': 0.54, 'tests %': 46, 'tool_result KB/turn': 10 } };

test('recorded audit values give the published changes', () => {
  const rows = byKey(buildComparison(firstPeriod(load('baseline.json')), lastPeriod(load('metrics.json'))));
  const pct = Object.fromEntries(METRICS.map((m) => [m.key, rows[m.key].changePct]));
  assert.deepEqual(pct, { 'ctx K/step': -18, 'out/turn': -29, 'agents/session': -60, 'tests %': 100, 'tool_result KB/turn': 0 });
  assert.deepEqual(METRICS.map((m) => rows[m.key].trend), ['better', 'better', 'better', 'better', 'flat']);
});

test('context is reported in tokens so it formats as 172K', () => {
  const rows = byKey(buildComparison(before, after));
  assert.equal(rows['ctx K/step'].before, 211000);
  assert.equal(rows['ctx K/step'].after, 172000);
  assert.equal(rows['ctx K/step'].unit, 'tokens');
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
