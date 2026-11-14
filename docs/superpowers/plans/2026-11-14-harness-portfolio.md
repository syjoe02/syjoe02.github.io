# Harness Portfolio Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Astro blog with one static English page that shows how the `claude-config` Claude Code harness is wired and what it measurably changed.

**Architecture:** `site/` is deployed as-is to GitHub Pages, no build step. `site/compare.js` is a pure ES module that turns two `metrics.py --json` tables into comparison rows; `site/app.js` fetches the two JSON files and draws stat tiles and bars from those rows. Everything else is static HTML and an inline SVG.

**Tech Stack:** HTML, CSS, vanilla ES modules, `node --test` (Node 24, no npm packages).

**Spec:** `docs/superpowers/specs/2026-11-14-harness-portfolio-design.md`

**Prior context:** fix 커밋 0개(origin/main, 수정 대상 4개 파일), myDocs 노트 0개, 비교 함수 0개(새 파일뿐이라 형제 코드 없음).

## Global Constraints

- Page copy is English. `README.md` is Korean (`-습니다`).
- No dependencies: no `package.json`, no CDN chart library. The Google Analytics tag `G-TBY917WSKE` is the only external script.
- Every number on the page comes from the spec or from `site/data/*.json`. No invented values.
- No company identifiers in `site/`: `rg -i 'spacemap|starlink|norad|ephemeris|\bCDM\b|\bTLE\b' site/` must print nothing. The company layer appears only as a box labelled "company layer".
- Charts: Before/After bars only. No time-series chart.
- Commits happen only after the user says so (one commit at the end, Task 4).

## Review Focus

1. `metrics.json` written by `metrics.py` with no `--periods` holds six weekly periods: the page must use the last one. (Task 1 test `uses the last period of a multi-period table`)
2. A real `metrics.py` table carries non-numeric fields (`"model mix": "opus:80%"`, `"en subject %": null`): they must not break the page. (Task 1 test `ignores non-numeric extra fields`)
3. A metric missing from the latest period: that row shows Before only, never `NaN`. (Task 1 test `missing metric gives a null after for that row only`)
4. `metrics.json` missing, 404, or not JSON: Before values still render and "latest measurement unavailable" shows. (Task 3 browser check)
5. 375px phone width and dark mode: no horizontal scroll, diagram scales, text readable. (Task 3 browser check)

---

### Task 1: Data files and comparison logic

**Files:**
- Create: `site/compare.js`, `site/data/baseline.json`, `site/data/metrics.json`
- Test: `tests/compare.test.js`

**Interfaces:**
- Produces:
  - `METRICS: Array<{ key: string, label: string, unit: string, lowerIsBetter: boolean }>` in this order:
    `ctx K/step` "Context read per response" "K tokens" true; `out/turn` "Output tokens per turn" "tokens" true;
    `agents/session` "Subagent dispatches per session" "" true; `tests %` "Sessions that ran tests" "%" false;
    `tool_result KB/turn` "Tool output per turn" "KB" true.
  - `firstPeriod(table: unknown): { name: string, values: object } | null`
  - `lastPeriod(table: unknown): { name: string, values: object } | null`
    Both return null unless `table` is a non-array object with at least one object-valued period.
  - `buildComparison(before: Period|null, after: Period|null): Array<{ key, label, unit, before: number|null, after: number|null, changePct: number|null, trend: 'better'|'worse'|'flat'|null }>`
    A value is used only if `Number.isFinite`. `changePct = Math.round((after - before) / before * 100)`, null when either side is null or `before === 0`. `trend` is `'flat'` when `changePct === 0`, else better/worse by `lowerIsBetter`.
- Data (shape is exactly what `metrics.py --json` writes):
  - `baseline.json`: `{ "Aug 2026": { "ctx K/step": 211, "out/turn": 18900, "agents/session": 1.36, "tests %": 23, "tool_result KB/turn": 10 } }`
  - `metrics.json`: `{ "Sep 2026": { "ctx K/step": 172, "out/turn": 13500, "agents/session": 0.54, "tests %": 46, "tool_result KB/turn": 10 } }`

- [ ] **Step 1: Write the failing tests** in `tests/compare.test.js` (`node:test`, `node:assert/strict`, import from `../site/compare.js`):
  - `recorded audit values give the published changes`: with the two data files' periods, `changePct` by key is `ctx K/step` -18, `out/turn` -29, `agents/session` -60, `tests %` 100, `tool_result KB/turn` 0; trends better, better, better, better, flat.
  - `uses the last period of a multi-period table`: `lastPeriod({ "wk 10-05": {...}, "wk 10-12": { "ctx K/step": 150 } }).name === "wk 10-12"`; `firstPeriod` of the same gives `"wk 10-05"`.
  - `ignores non-numeric extra fields`: an after period that also has `"model mix": "opus:80%"` and `"en subject %": null` gives the same rows as without them.
  - `missing metric gives a null after for that row only`: after lacks `tests %` → that row has `after: null, changePct: null, trend: null`; the other rows still have numbers.
  - `invalid tables give null periods`: `lastPeriod` of `null`, `[]`, `{}`, `"x"`, `{ a: 1 }` is null; `buildComparison(before, null)` keeps every `before` and every `after` is null.
  - `zero before gives no percentage`: before `agents/session: 0`, after `0.5` → `changePct: null`.

- [ ] **Step 2: Run** `node --test tests/` — expected FAIL (cannot find module `site/compare.js`).

- [ ] **Step 3: Implement** `site/compare.js` and the two data files per the Interfaces block.

- [ ] **Step 4: Run** `node --test tests/` — expected all 6 pass, and no module-type warning (Node detects ESM syntax without a `package.json`).

### Task 2: The page

**Files:**
- Create: `site/index.html`, `site/style.css`, `site/app.js`

**Interfaces:**
- Consumes: `METRICS`, `firstPeriod`, `lastPeriod`, `buildComparison` from `./compare.js`.
- `app.js` fetches `data/baseline.json` and `data/metrics.json` (relative paths, so it works under any base). A failed fetch or JSON parse of either file is treated as `null` for that side; when the after side is null, show "latest measurement unavailable" next to the chart. When the before side is null, the chart section says the data could not be loaded. Log the error with `console.error`.

Load the `dataviz` skill before writing the chart and tiles.

- [ ] **Step 1: Write `index.html` sections in this order** (copy is the implementer's, facts are fixed here):
  1. Hero: name "syjoe02", one sentence (harness engineering for Claude Code: rules, skills, hooks and agents, kept only when measurement shows they work), four stat tiles filled by `app.js` from the first four `METRICS` rows (after value, and change % vs before).
  2. "How the harness is wired": inline SVG with `viewBox` and `width: 100%`. Nodes:
     - Loaded every turn: `rules/` (shared rules + language and reply shape), `AGENTS.md` index, the installed layer's rule file.
     - Loaded on demand: skills (`explain-code`, `plan-context`, superpowers process skills), slash commands (`/find`, `/move-docs`).
     - One turn left to right: session start (ponytail ruleset injected) → user prompt → tool calls → `PreToolUse` on `git commit`: secret scan (denies the call on a key match) and test-prune reminder → `PostToolUse` on Edit/Write: auto-format → subagent on dispatch (`security-reviewer`, `Explore`) → `Stop`: Hangul/Latin check (blocks once on stray scripts) → reply.
     - Side: `install.sh` links shared items plus one layer (personal | company layer) into `~/.claude`; MCP `context7` for version-pinned library docs.
  3. "Timeline", a list, 2026-08-03 → 2026-11-05, 184 commits, 32 merged PRs. Pick about 8 milestones from `git -C ~/claude-config log --format='%ad %s' --date=short` and use the dates it prints. Include: repo created; 11 phantom agents dropped; 20 never-invoked skills and 6 orphaned commands removed; `metrics.py` added; always-loaded rules 668 → 338 lines; `metrics.py` removed; `/find`; `plan-context`.
  4. "Before / After": a `<div id="chart">` that `app.js` fills, one row per `METRICS` entry with two bars scaled to the larger of the pair, value labels, and change %. Under it: "Before (Aug 2026) and After (Sep 2026) come from one audit of 128 sessions, 2026-08-07 → 09-17; the split date was not recorded." plus a line `app.js` fills with the after period's name and `sessions` when present.
  5. "Fixed by measuring", five short items: two reminder hooks wrote to stderr, which never reaches the model (318 transcripts, 98 `git push` calls, 0 reminders delivered); 26 commands and 9 agents were never used; always-loaded rules cut from 668 to 338 lines; the English commit-subject check read 30–47% because its regex missed heredoc commits, and was really 98–100%; `metrics.py` itself was deleted when the correction signal (1 in 6 weeks) proved too weak to show a trend.
  6. Footer: how the numbers update (re-run `metrics.py` from git history with `--json site/data/metrics.json`, then push).
  Head: the GA snippet from the old `src/layouts/BaseLayout.astro:52-59` with ID `G-TBY917WSKE`, `<link rel="icon" href="favicon.svg">`, viewport meta, `<script type="module" src="app.js">`.

- [ ] **Step 2: Write `style.css`**: color tokens on `:root`, a dark set under `@media (prefers-color-scheme: dark)`, explicit `body` background, 16px side gutter, single column under 640px.

- [ ] **Step 3: Write `app.js`** per the Interfaces block.

- [ ] **Step 4: Run** `node --test tests/` (still 6 pass) and the company-identifier `rg` from Global Constraints (prints nothing).

### Task 3: Remove the Astro site and switch the deploy

**Files:**
- Delete: `src/`, `astro.config.mjs`, `keystatic.config.ts`, `package.json`, `package-lock.json`, `tsconfig.json`
- Move: `public/favicon.svg`, `public/robots.txt`, `public/.nojekyll` → `site/` (`git mv`), then `public/` is gone
- Modify: `.github/workflows/pages-deploy.yml`, `.gitignore`, `README.md`, `.claude/launch.json` (untracked locally; edit only)

- [ ] **Step 1: Delete and move** the files above.
- [ ] **Step 2: Workflow**: in the `build` job keep `checkout` and `configure-pages`; `setup-node` with `node-version: 24` and no `cache`; one step `node --test tests/`; `upload-pages-artifact` with `path: site/`. Remove `npm ci` and the build step. `deploy` job unchanged.
- [ ] **Step 3: `.gitignore`**: keep `.DS_Store`, `.env*`, `.vscode/`, `*.md.kor`; drop Astro and npm entries.
- [ ] **Step 4: `README.md`** (Korean): what the site is, local preview (`python3 -m http.server -d site 4321`), and the update command `git -C ~/claude-config show 28706d9^:scripts/metrics.py | python3 - --periods "<range name>=YYYY-MM-DD..YYYY-MM-DD" --json site/data/metrics.json`, then commit and push; name the period by its date range because the page shows the name.
- [ ] **Step 5: `.claude/launch.json`**: one configuration running `python3 -m http.server -d site 4321`, port 4321.
- [ ] **Step 6: Verify**: `git status --short` shows no `src/` or `public/` left; `node --test tests/` passes; `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/pages-deploy.yml'))"` exits 0.
- [ ] **Step 7: Browser check** via `preview_start` with that config: no console errors; tiles show -18%, -29%, -60%, +100%; rename `site/data/metrics.json` temporarily → Before bars plus "latest measurement unavailable", then restore it; 375px width has no horizontal scroll; dark mode readable. Screenshot for the user.

### Task 4: Review and commit

- [ ] **Step 1:** `/code-review` on the branch diff; fix CRITICAL and HIGH.
- [ ] **Step 2:** Show the user the screenshot and ask to commit. On yes: one commit, subject `feat: replace blog with harness engineering page`, Korean body.
