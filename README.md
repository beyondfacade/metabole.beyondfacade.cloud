# metabole.beyondfacade.cloud

Jekyll 문서 사이트 — https://metabole.beyondfacade.cloud

상권 데이터 구조화 및 창업 분석 Hybrid RAG용 Agent 개발 프로젝트(Metabole)의 개발 문서 사이트입니다.

## 로컬 실행

```bash
bundle install
bundle exec jekyll serve
```

## 디자인 커스터마이징

[Astryx 문서 사이트](https://astryx.atmeta.com/docs/getting-started)의 중립색 표면, 내비게이션과 목차 구성을 참고해 Jekyll의 HTML·SCSS로 구현했습니다.

- `_sass/custom/_docs.scss`: 공통 색상 토큰, 문서·사이드바·메인 페이지·반응형 스타일
- `_sass/custom/_erd.scss`: 데이터 계층, 관계도 캔버스와 테이블 스타일
- `assets/js/docs.js`: 문서 제목과 데스크톱 목차 자동 구성
- `assets/js/erd.js`: Mermaid 렌더링 후 확대·화면 맞춤·키보드로 닫을 수 있는 확대 화면

기존 Markdown 문서는 공통 스타일을 자동 적용받습니다. ERD 원본과 상세 명세는 `jekyll/erd.md`에서 관리합니다. 변경 후 `bundle exec jekyll build`로 빌드를 확인하고, 메인·일반 문서·ERD의 모바일 화면과 검색을 점검합니다.

## 개발 세션 배너

사이트 상단에 현재 작업 중인 개발자 이름을 표시합니다.

```bash
./scripts/dev-session.sh start 이은상   # 배너 켜기
./scripts/dev-session.sh end            # 배너 끄기
```

`_data/dev_session.yml` 변경 후 GitHub에 push하면 사이트에 반영됩니다.
