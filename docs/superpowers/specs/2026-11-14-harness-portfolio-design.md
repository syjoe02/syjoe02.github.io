# Harness portfolio page: 설계

## 목적

채용 담당자와 개발자가 Claude Code 하네스 엔지니어링 역량과 LLM을 효율적으로 쓰는 방식을 한 페이지에서 보게
합니다. 소재는 `claude-config` repo(main, 2026-08-03 ~ 2026-11-05, 커밋 184개, merge된 PR 32개)입니다.

- 채용 담당자: 30초 안에 첫 화면의 숫자 4개와 한 문장으로 요지를 파악합니다.
- 개발자: 구조 그림, 각 장치가 왜 있는지, 무엇으로 측정했는지, 효과가 없었던 것까지 확인합니다.

이야기의 중심은 "설정을 쌓은 것"이 아니라 "측정하고 덜어낸 과정"입니다.

## 목표 / 비목표 / 실패 조건

- 목표: 영어 한 페이지, 하네스 구조 그림, 성능 전후 막대 그래프, 측정값을 JSON 파일만 바꿔 갱신.
- 비목표: 블로그, 검색, 글 작성 도구(Keystatic), 추이(시계열) 그래프, 측정 자동화.
- 실패 조건: 기록에 없는 숫자가 페이지에 오르는 것. 회사 도메인이나 repo 이름(Spacemap, starlink, CDM 등)이
  페이지에 오르는 것.

## 접근 방식

- A. 정적 HTML 한 장 (선택): 빌드 도구 없이 `site/`를 그대로 배포합니다. 페이지가 하나뿐이라 의존성과 빌드가
  필요 없고, "모두 초기화"와 맞습니다.
- B. Astro 최소 유지: 나중에 블로그를 되살리기 쉽지만 페이지 하나에 npm 의존성과 lockfile 관리가 따라옵니다.
- C. 차트 라이브러리: 막대 몇 개에 외부 의존성이 생겨 제외했습니다.

## 결정된 것

- 언어: 영어.
- 그래프: 성능 전후 막대 그래프만. 규칙 줄 수 추이 그래프는 넣지 않습니다.
- 측정값 분리: 페이지는 `site/data/baseline.json`(고정 Before)과 `site/data/metrics.json`(갱신되는 After)을
  읽어 그립니다. 두 파일 모두 예전 `metrics.py --json`이 쓰는 모양 그대로입니다:
  `{ "<기간 이름>": { "sessions": 12, "ctx K/step": 172, "out/turn": 13500, ... } }`.
  페이지는 baseline의 첫 기간을 Before, metrics의 마지막 기간을 After로 씁니다.
- 공개 범위: 규칙 문장을 인용하지 않고 "무엇을 하는지"만 적습니다. 회사용 층은 "company layer" 상자 하나로만
  그립니다.
- 초기화: git 히스토리는 남기고 파일만 교체합니다.

## 페이지 구성

1. Hero: 한 문장 소개 + 숫자 카드 4개(응답당 컨텍스트, 턴당 출력 토큰, 세션당 에이전트 호출, 테스트를 돌린
   세션 비율). 값은 두 JSON에서 계산합니다.
2. Harness architecture: Claude Code를 가운데 두고 로드 시점별 층(Every turn rules, On demand skills,
   On an event hooks, On dispatch subagents)을 겹친 그림. 안쪽일수록 자주 로드되므로 작게 유지한다는 원칙을 보여줍니다.
   이름표는 내부 이름 대신 일반 단어로 씁니다(`/move-docs`가 아니라 "save notes to docs"). 가운데에는 Claude 아이콘과 캐릭터를 둡니다.
3. Before / After: 위 4개 지표 + 변하지 않은 지표 1개(턴당 도구 출력 KB)의 막대 쌍.
4. How it's measured: `metrics.py`의 함수 5단계(`load`, `parse`, `parse_periods`, `aggregate`, `--json`)와 지표마다 분자/분모를 보여 주는 분수 카드.
5. Footer: GitHub 링크.

Timeline과 Fixed by measuring 섹션은 사용자 요청으로 2026-11-14에 뺐습니다.

Before 값의 출처는 `metrics.py` docstring에 남은 2026-09-17 측정입니다(2026-08-07 ~ 09-17, 세션 128개):
ctx 211 → 172 K/step, out 18.9k → 13.5k, agents 1.36 → 0.54, tests 23% → 46%, tool_result 약 10 KB(변화 없음).
처음 배포할 때는 이 값의 앞쪽을 `baseline.json`, 뒤쪽을 `metrics.json`에 넣습니다.

## 갱신 방법

`metrics.py`는 claude-config에서 지워졌지만 git 히스토리에서 바로 실행할 수 있어 되살리지 않습니다.

`git -C ~/claude-config show 28706d9^:scripts/metrics.py | python3 - --periods "Nov 1-14=2026-11-01..2026-11-14" --json site/data/metrics.json`

그다음 commit과 push를 하면 GitHub Actions가 다시 배포합니다. 세션 기록이 Mac에만 있어 측정은 Actions에서
할 수 없습니다. 기간 이름은 페이지에 그대로 표시되므로 날짜 범위로 짓습니다.

## 파일 변경

- 삭제: `src/`, `public/`, `astro.config.mjs`, `keystatic.config.ts`, `package.json`, `package-lock.json`,
  `tsconfig.json`.
- 추가: `site/index.html`, `site/style.css`, `site/app.js`(JSON 읽고 그리기), `site/data/*.json`,
  `public/`에서 옮긴 `favicon.svg`, `robots.txt`, `.nojekyll`, 그리고 `app.js`의 계산 함수 테스트
  (`node --test`, 의존성 없음).
- 수정: `.github/workflows/pages-deploy.yml`(npm 빌드 제거, 테스트 후 `site/` 업로드), `.gitignore`,
  `README.md`(한국어, 갱신 방법), `.claude/launch.json`(정적 서버 미리보기).

## 내 판단으로 정한 것 (확인 부탁)

- Google Analytics 태그(`G-TBY917WSKE`)를 새 페이지에도 그대로 둡니다. 최근 커밋에서 넣으셨기 때문입니다.
- `metrics.json`이 없거나 모양이 틀리면 Before 값만 보여 주고 "latest measurement unavailable"을 표시합니다.
- 디자인(색, 글꼴, 다크 모드)은 제가 정하고, merge 전에 브라우저 미리보기로 보여 드립니다.
- 작업 브랜치는 `feat/harness-portfolio`(main에서 분기, worktree)이고 PR 대상은 main입니다.
- main checkout의 커밋되지 않은 `src/content/blog/Auth.md`, `Django.md` 수정분은 건드리지 않습니다. 이 PR이
  merge되면 `src/`가 지워지므로, 그 전에 따로 옮겨 두셔야 합니다.

## 확인하지 못한 것

- Before / After를 어느 날짜에서 나눴는지는 기록에 없습니다. 페이지에는 "Before (Aug 2026)", "After (Sep 2026)"로
  적고 측정 창 전체(2026-08-07 ~ 09-17, 세션 128개)를 함께 밝힙니다.
