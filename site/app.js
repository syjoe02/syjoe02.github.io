import { firstPeriod, lastPeriod, buildComparison } from './compare.js';

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 });

async function loadTable(path) {
  try {
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Could not load', path, err);
    return null;
  }
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const withUnit = (v, unit) => (unit === '%' ? `${compact.format(v)}%` : `${compact.format(v)}${unit ? ` ${unit}` : ''}`);

// The arrow is hidden from screen readers, which would read it as a shape name; they hear "down 18%".
function appendDelta(parent, row) {
  if (row.changePct === null) return;
  if (row.changePct === 0) return parent.append('no change');
  const down = row.changePct < 0;
  const arrow = el('span', null, down ? '▼' : '▲');
  arrow.setAttribute('aria-hidden', 'true');
  parent.append(arrow, el('span', 'sr-only', down ? 'down' : 'up'), ` ${Math.abs(row.changePct)}%`);
}

function renderTiles(rows, before, after) {
  const tiles = document.getElementById('tiles');
  for (const row of rows.slice(0, 4)) {
    const shown = after ? row.after : row.before;
    const tile = el('div', 'tile');
    tile.append(el('p', 'tile-label', row.label));
    const value = el('p', 'tile-value', shown === null ? '–' : compact.format(shown) + (row.unit === '%' ? '%' : ''));
    if (row.unit && row.unit !== '%') value.append(el('span', 'tile-unit', row.unit));
    tile.append(value);
    if (row.trend) {
      const delta = el('p', `delta ${row.trend}`);
      appendDelta(delta, row);
      delta.append(el('span', 'delta-period', ` vs ${before.name}`));
      tile.append(delta);
    }
    tiles.append(tile);
  }
  if (!after) document.getElementById('tiles-note').textContent = `Showing ${before.name}; latest measurement unavailable.`;
}

function renderLegend(before, after) {
  const legend = document.getElementById('legend');
  for (const [cls, text] of [['before', `Before (${before.name})`], ['after', after && `After (${after.name})`]]) {
    if (!text) continue;
    const item = el('span');
    const swatch = el('i', 'swatch');
    swatch.style.background = `var(--series-${cls})`;
    item.append(swatch, text);
    legend.append(item);
  }
}

function barLine(cls, value, max, unit, title) {
  const line = el('div', 'bar-line');
  if (value === null) return line;
  const bar = el('div', `bar ${cls}`);
  bar.style.width = `calc((100% - 96px) * ${max ? value / max : 0})`;
  bar.title = `${title}: ${withUnit(value, unit)}`;
  line.append(bar, el('span', 'bar-value', withUnit(value, unit)));
  return line;
}

function renderChart(rows, before, after) {
  const chart = document.getElementById('chart');
  for (const row of rows) {
    const max = Math.max(row.before ?? 0, row.after ?? 0);
    const r = el('div', 'row');
    const label = el('div', 'row-label', row.label);
    if (row.note) label.append(el('span', 'row-why', row.note));
    const bars = el('div', 'bars');
    bars.append(barLine('before', row.before, max, row.unit, `Before (${before.name})`));
    if (after) bars.append(barLine('after', row.after, max, row.unit, `After (${after.name})`));
    const change = el('div', `row-change ${row.trend ?? ''}`);
    appendDelta(change, row);
    r.append(label, bars, change);
    chart.append(r);
  }
}

function renderLatestNote(after) {
  const note = document.getElementById('latest-note');
  if (!after) note.textContent = 'Latest measurement unavailable.';
  else if (Number.isFinite(after.values.sessions)) note.textContent = `After (${after.name}): ${after.values.sessions} sessions.`;
  else note.textContent = `After (${after.name}): same audit, split date not recorded.`;
}

async function main() {
  const [baseTable, latestTable] = await Promise.all([loadTable('data/baseline.json'), loadTable('data/metrics.json')]);
  const before = firstPeriod(baseTable);
  const after = lastPeriod(latestTable);
  if (!before) {
    document.getElementById('chart').textContent = 'Measurement data could not be loaded.';
    return;
  }
  const rows = buildComparison(before, after);
  renderTiles(rows, before, after);
  renderLegend(before, after);
  renderChart(rows, before, after);
  renderLatestNote(after);
}

// Start the flow animation once its section is on screen; CSS stops it after ~5 s (WCAG 2.2.2).
function playFlowWhenVisible() {
  const section = document.getElementById('measured')?.closest('section');
  if (!section || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    section.classList.add('in-view');
    observer.disconnect();
  }, { threshold: 0.4 }).observe(section);
}

main();
playFlowWhenVisible();
