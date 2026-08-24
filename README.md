# metabole.beyondfacade.cloud

Jekyll 문서 사이트 — https://metabole.beyondfacade.cloud

상권 데이터 구조화 및 창업 분석 Hybrid RAG용 Agent 개발 프로젝트(Metabole)의 개발 문서 사이트입니다.

## 로컬 실행

```bash
bundle install
bundle exec jekyll serve
```

## 개발 세션 배너

사이트 상단에 현재 작업 중인 개발자 이름을 표시합니다.

```bash
./scripts/dev-session.sh start 이은상   # 배너 켜기
./scripts/dev-session.sh end            # 배너 끄기
```

`_data/dev_session.yml` 변경 후 GitHub에 push하면 사이트에 반영됩니다.
