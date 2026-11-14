# syjoe02.github.io

Claude Code 하네스 엔지니어링(`claude-config`)을 소개하는 한 장짜리 정적 페이지입니다. 하네스 구조 그림과
세션 기록으로 잰 성능 전후 비교를 보여 줍니다. 빌드 도구 없이 `site/` 폴더를 그대로 GitHub Pages에 배포합니다.

## 구조

| 경로 | 내용 |
|---|---|
| `site/index.html`, `site/style.css` | 페이지 본문과 스타일 |
| `site/app.js` | 측정값 JSON을 읽어 숫자 카드와 막대 그래프를 그립니다 |
| `site/compare.js` | Before / After 변화율 계산 (`tests/compare.test.js`가 검증) |
| `site/data/baseline.json` | 고정된 Before 값 (2026-08 측정) |
| `site/data/metrics.json` | 갱신되는 After 값 |

## 로컬 미리보기

```bash
python3 -m http.server -d site 4321
```

`http://localhost:4321`을 엽니다. 파일을 직접 열면(`file://`) 브라우저가 JSON을 읽지 못해 측정값이 비어 보입니다.

## 테스트

```bash
node --test 'tests/*.test.js'
```

배포 워크플로도 같은 테스트를 통과해야 `site/`를 올립니다.

## 측정값 갱신

`metrics.py`는 `claude-config`에서 삭제됐지만 git 히스토리에서 바로 실행할 수 있습니다. 세션 기록
(`~/.claude/projects`)은 Mac에만 있으므로 측정은 로컬에서 합니다.

```bash
git -C ~/claude-config show 28706d9^:scripts/metrics.py | python3 - --periods "Nov 1-14=2026-11-01..2026-11-14" --json site/data/metrics.json
```

기간 이름(`Nov 1-14`)은 페이지에 그대로 표시되므로 날짜 범위로 짓습니다. `--periods`를 빼면 최근 6주를 주 단위로
쓰고, 페이지는 마지막 주를 After로 씁니다. 그다음 commit과 push를 하면 GitHub Actions가 다시 배포합니다.
`baseline.json`은 다시 잴 수 없는 기록값이므로 고치지 않습니다.
