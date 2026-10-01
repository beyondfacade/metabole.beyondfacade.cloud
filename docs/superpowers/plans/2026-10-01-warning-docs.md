# 메타볼레 창업 경고 문서 전면 정비 계획

> 실행: 이 세션에서 직접 수정·검증한다. 사용자가 계획에서 멈추지 않고 구현까지 위임했으므로 별도 승인 단계·커밋·푸시·배포를 두지 않는다.

**목표:** 심사위원은 문제·흐름·검증·완성도를, 면접관은 데이터 흐름·설계 선택·실험·한계를 읽도록 기존 Jekyll 문서를 정비한다.
**구조:** 기존 just-the-docs와 KDT 장·permalink를 유지한다. 홈은 문제 → 실제 화면 → 여정 → 백테스트 → 아키텍처 → 설계 선택 → 산출물로 연결한다. 근거 정본 페이지를 추가해 측정과 목표를 분리한다.
**기술:** Jekyll·Liquid·Markdown·기존 SCSS·Mermaid. 새 프레임워크나 의존성 없음.
**명세:** 2026-10-01 사용자 작업지시서 및 cloud `docs/superpowers/specs/2026-10-01-warning-copy-design.md`.

## 작업 시작 상태

- 문서 저장소: `main` / `fef1fe1da37144610370af651bf0af8ec5b59f94`, 기존 변경은 ` M jekyll.md`.
- 구현 저장소(읽기 전용): `feat/warning-copy` / `750b4e5a67aeba6ef27915d7213f3627f34b889c`, 작업 트리 깨끗함. main 병합 여부를 추정하지 않는다.
- 루트 AGENTS.md는 양쪽 모두 없음. 문서 CLAUDE.md는 빈 파일. 구현 CLAUDE.md·frontend AGENTS.md·CLAUDE.md 확인.
- `jekyll.md`와 cloud `docs/jekyll.md` SHA-256은 둘 다 `7873fda4e33070cea3cd9a73d23db042a559818839d75ed25964a8965cdd3d9e`.
- cloud `scripts/jekyll-devlog.sh`가 원본을 매일 복사한다. 일지 본문에 쓰지 않고 `_layouts/post.html`에서 최신 안내를 제공한다. 원본 정정은 범위 밖 후속 작업.
- 사용자 지정 작업 디렉터리에서 파일 편집만 수행. git 메타데이터·브랜치·커밋·서비스 서버 상태는 변경하지 않는다.

## 근거 목록

모든 S 근거는 위 cloud HEAD의 작업 트리에서 읽었다.

| ID | 원문 | 판정 기준 |
|---|---|---|
| S1 | `docs/HANDOFF.md` §0, `docs/superpowers/specs/2026-10-01-warning-copy-design.md` | 초기 제안과 9/29 이후 구현을 구별. 사용자 문제·문구·제외 조건 |
| S2 | `docs/STATUS.md`, `backend/docs/backend_ver_log.md`, `frontend/docs/frontend_ver_log.md` | STATUS 첫머리는 9/24, 부분 갱신됨. 현재 기능은 BE v0.63.0 / FE v0.52.1 코드와 대조 |
| S3 | `docs/verdict-backtest.md`, `backend/apps/verdict/domain/services/{rules,thresholds,alternatives,backtest}.py`, `adapter/outbound/gateways/entrant_outcome_gateway.py` | T=2022-06-30, [T,T+365) 진입·개업 후 1095일 이내 폐업. clear는 추천 아님 |
| S4 | `frontend/src/shared/{industries,verdict}.ts`, `backend/apps/master/adapter/inbound/cli/seed_master.py` | 마스터 시드 18·UI 선택 14·판정 12. 제외는 별도 이유 |
| S5 | `frontend/src/features/{intent-gate,map-explorer,agent-report,support,plan}`, 각 API 라우터, `backend/apps/finance/domain/services/engine.py` | 관문 조건·대안 빈 결과·done 뒤 지원 링크·동과 업종 있어야 계획 CTA·초안 화면 상태 |
| S6 | `backend/apps/rag/adapter/outbound/repositories/rag_repository.py`, `app/use_cases/rag_interactor.py`, `backend/apps/agent/app/use_cases/report_facts.py`, `data/eval/results/rag_fp16_20260925_000414.json`, `rag_ollama_20260925_000435.json` | 검색은 코사인+정형필터+뉴스 사건 접기. BM25 결합 구현 확인 안 됨. confirmed 180 결과와 초기 목표를 분리 |
| S7 | `backend/apps/**/adapter/outbound/orms/*.py`·Alembic | __tablename__ 47개(버전 테이블 제외), 실제 DB 재측정 아님. 기존 36에 판정·주택·관리 7·호출 이력·호스트 지표 추가 |
| S8 | `scripts/jekyll-devlog.sh`, 양쪽 `jekyll.md` | 원본 자동 복사·기존 변경 보존 |

## 파일별 조사와 변경 방향

| 파일 | 현재 주장 | 근거 | 유지·수정·과거 기록·확인 필요 | 변경 방향 |
|---|---|---|---|---|
| `index.markdown` | 10개 업종 · 36개 테이블 · 91.5 · Hybrid RAG | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `_config.yml` | 기존 테마·공통 제목·푸터·ERD 동작 | 사이트 코드·S1 | 유지·수정 | 기존 테마·동작 유지. 소개 메타데이터와 공통 안내·필요한 반응형 CSS만 수정. |
| `README.md` | Hybrid RAG | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/appendix/forms.md` | 기존 개발 문서·메뉴·양식 | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/appendix/glossary.md` | 91.5 · 40% · Hybrid RAG · 7주 | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/appendix/index.md` | 기존 개발 문서·메뉴·양식 | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/business-overview/effects.md` | 월세 vs 매입 | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/business-overview/index.md` | 기존 개발 문서·메뉴·양식 | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/business-overview/purpose.md` | 91.5 · 40% · Hybrid RAG | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/business-overview/scope.md` | 10종 · 10개 업종 · 슬라이더 · 월세 vs 매입 · 개인정보 · Hybrid RAG | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/deliverables/demo-scenario.md` | 10종 · 월세 vs 매입 · Hybrid RAG | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/deliverables/detailed-design.md` | 10종 · 36테이블 | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/deliverables/final-inspection.md` | 36테이블 | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/deliverables/high-level-design.md` | 36테이블 · 91.5 | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/deliverables/index.md` | 기존 개발 문서·메뉴·양식 | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/deliverables/requirements-spec.md` | 10종 · 91.5 · 월세 vs 매입 · 개인정보 · Hybrid RAG · 7주 | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/deliverables/test-scenario.md` | 91.5 · 40% | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/deliverables/wbs.md` | 7주 일정·역할·9/28 진행 상태 | S1·S2·사용자 확인 | 수정·과거 기록·확인 필요 | 현행 마일스톤과 미완료 작업을 앞에 추가. 날짜별 원래 계획은 과거 기록으로 구분. 최종 기간·현재 역할은 확인 대기. |
| `jekyll/erd.md` | 9/23 스키마 36테이블을 현행 전체로 표시 | S7 | 수정·과거 기록 | 기존 명세를 날짜 있는 스냅샷으로 보존하고 현행 ORM 47개 목록·추가 11개 관계도·판정 테이블 상세 추가. 실DB 개수로 단정하지 않음. |
| `jekyll/guidelines/general.md` | 기존 개발 문서·메뉴·양식 | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/guidelines/index.md` | 기존 개발 문서·메뉴·양식 | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/guidelines/quality.md` | 91.5 · 40% | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/guidelines/standards.md` | 10종 · Hybrid RAG | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/intro/overview.md` | 10종 · 91.5 · 40% · 슬라이더 · 월세 vs 매입 · Hybrid RAG · 7주 | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/intro/subtopics.md` | 91.5 · 슬라이더 · 월세 vs 매입 · 개인정보 · Hybrid RAG | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/intro/team.md` | 3명 및 담당 역할 | 기존 팀 문서·사용자 확인 | 유지·확인 필요 | 기존 역할을 계획 당시 배정으로 표시하고 최신 기여를 만들어 내지 않음. |
| `jekyll/requirements/architecture.md` | 슬라이더 · 월세 vs 매입 · Hybrid RAG | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/requirements/data-collection.md` | 10종 | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/requirements/dev-scope.md` | 10종 · 91.5 · 슬라이더 · 월세 vs 매입 · Hybrid RAG | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/requirements/index.md` | 개인정보 · Hybrid RAG | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/requirements/purpose.md` | 91.5 · 40% · 개인정보 | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/requirements/rag-pipeline.md` | 91.5 · 40% · Hybrid RAG | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/requirements/security.md` | 개인정보 | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/requirements/service-platform.md` | 슬라이더 · 월세 vs 매입 · 개인정보 | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `jekyll/schedule/index.md` | 7주 일정·역할·9/28 진행 상태 | S1·S2·사용자 확인 | 수정·과거 기록·확인 필요 | 현행 마일스톤과 미완료 작업을 앞에 추가. 날짜별 원래 계획은 과거 기록으로 구분. 최종 기간·현재 역할은 확인 대기. |
| `jekyll/schedule/organization.md` | 7주 일정·역할·9/28 진행 상태 | S1·S2·사용자 확인 | 수정·과거 기록·확인 필요 | 현행 마일스톤과 미완료 작업을 앞에 추가. 날짜별 원래 계획은 과거 기록으로 구분. 최종 기간·현재 역할은 확인 대기. |
| `jekyll/schedule/risk.md` | 7주 일정·역할·9/28 진행 상태 | S1·S2·사용자 확인 | 수정·과거 기록·확인 필요 | 현행 마일스톤과 미완료 작업을 앞에 추가. 날짜별 원래 계획은 과거 기록으로 구분. 최종 기간·현재 역할은 확인 대기. |
| `jekyll/schedule/sprint1.md` | 날짜별 개발·초기 기획 기록 | S1·S2·S8 | 과거 기록 | 본문 보존. 개발 일지는 post 레이아웃에서 현재 방향 안내. Sprint 1에는 기록 시점 안내. |
| `jekyll/schedule/timeline.md` | 7주 일정·역할·9/28 진행 상태 | S1·S2·사용자 확인 | 수정·과거 기록·확인 필요 | 현행 마일스톤과 미완료 작업을 앞에 추가. 날짜별 원래 계획은 과거 기록으로 구분. 최종 기간·현재 역할은 확인 대기. |
| `jekyll/toc.md` | 개인정보 · Hybrid RAG | S1~S7 | 수정 | 창업 경고 사용자 문제·실제 구현·근거·한계 중심으로 정비. permalink·KDT 장/필수 소제목 유지. |
| `_includes/nav_footer_custom.html` | 기존 테마·공통 제목·푸터·ERD 동작 | 사이트 코드·S1 | 유지·수정 | 기존 테마·동작 유지. 소개 메타데이터와 공통 안내·필요한 반응형 CSS만 수정. |
| `_includes/title.html` | 기존 테마·공통 제목·푸터·ERD 동작 | 사이트 코드·S1 | 유지·수정 | 기존 테마·동작 유지. 소개 메타데이터와 공통 안내·필요한 반응형 CSS만 수정. |
| `_layouts/post.html` | 기존 테마·공통 제목·푸터·ERD 동작 | 사이트 코드·S1 | 유지·수정 | 기존 테마·동작 유지. 소개 메타데이터와 공통 안내·필요한 반응형 CSS만 수정. |
| `_sass/custom/_docs.scss` | 기존 테마·공통 제목·푸터·ERD 동작 | 사이트 코드·S1 | 유지·수정 | 기존 테마·동작 유지. 소개 메타데이터와 공통 안내·필요한 반응형 CSS만 수정. |
| `assets/js/docs.js` | 기존 테마·공통 제목·푸터·ERD 동작 | 사이트 코드·S1 | 유지·수정 | 기존 테마·동작 유지. 소개 메타데이터와 공통 안내·필요한 반응형 CSS만 수정. |
| `assets/js/erd.js` | 기존 테마·공통 제목·푸터·ERD 동작 | 사이트 코드·S1 | 유지·수정 | 기존 테마·동작 유지. 소개 메타데이터와 공통 안내·필요한 반응형 CSS만 수정. |
| `jekyll.md` | 날짜별 개발·초기 기획 기록 | S1·S2·S8 | 과거 기록 | 본문 보존. 개발 일지는 post 레이아웃에서 현재 방향 안내. Sprint 1에는 기록 시점 안내. |
| `brainstorming.md` | 날짜별 개발·초기 기획 기록 | S1·S2·S8 | 과거 기록 | 본문 보존. 개발 일지는 post 레이아웃에서 현재 방향 안내. Sprint 1에는 기록 시점 안내. |

## 추가 파일

- `jekyll/evidence.md`: `/docs/evidence.html`. 백테스트 원표·해석 한계·RAG 별도 평가·출처 경로·기준 커밋·확인 필요 사항의 정본.
- `assets/images/service-warning-map.png`: 기존 서비스 서버에서 얻은 실제 화면. 모의 재현을 실화면으로 표시하지 않는다. 캡처 조건을 캡션에 기록.
- `docs/superpowers/plans/2026-10-01-warning-docs-verification.md`: 실제 실행 검증·미실행 범위·남은 확인 사항.

## 검토 초점

1. UI 선택 14와 판정 12, 마스터 18의 혼동 여부.
2. 보류·제외·clear·빈 대안에서 없는 기능을 약속하는지.
3. 카페 폐업률 비율을 정확도·인과·미래 확률로 표현하는지.
4. 과거 일정·목표·실험 결과·현재 코드·운영 배포 상태가 섞이는지.
5. 기존 일지 해시·permalink·KDT 장 구성 및 작은 화면에서 탐색 가능 여부.

## 실행 순서 및 완료 조건

- [x] 1. 원문·코드 조사, 시작 상태·파일별 표 작성. 불확실한 기간·역할·공개 URL은 사용자에게 묶어서 질의.
- [x] 2. 근거 정본과 현행 소개·사업·요구사항·산출물·용어를 편집. 날짜가 있는 기록은 보존.
- [x] 3. 홈·메타·공통 안내·실제 화면·ERD 최신 보완. 구현 코드와 다시 대조.
- [x] 4. `bundle exec jekyll build`, `git diff --check`, 생성 HTML 링크·앵커·검색 JSON·이미지·내비게이션 검사.
- [x] 5. 브라우저에서 홈·주요 문서 375/768/1152/1440 폭, 검색·메뉴·ERD 표시·확대 검사. 외부 서비스 공개 URL 확인 범위 명시.
- [x] 6. 독립 검토와 필요한 정정. 사용자 변경 보존·cloud 읽기 전용을 재확인하고 실제 검증 결과 보고.

문서·스타일 편집은 빌드와 생성물·브라우저 검사로 검증한다. 애플리케이션 기능 테스트·DB 변경·크론 실행·백테스트 재실행은 범위 밖이다.

## 실행 중 보완 및 추가 요청

- 생성물 검사에서 중복 Milestone 앵커와 홈 소제목 앵커 누락을 바로잡았다.
- 한국어 검색이 실제 브라우저에서 실패했다. 테마 기본 Lunr trimmer가 한글을 지우는 원인을 확인하고 `_includes/lunr/custom-index.js`로 Unicode 문자·숫자를 보존했다. 실제 생성 색인에 대한 `scripts/check-search.cjs`는 수정 전 실패, 수정 후 4개 검색어 통과를 확인했다.
- `scripts/check-site.py`로 내부 링크·앵커·이미지·검색 색인을 반복 검사할 수 있게 했다. 새 패키지 의존성은 추가하지 않았다.
- 사용자 추가 요청에 따라 `epoko77-ai/im-not-ai`의 85개 진단 패턴과 보존 원칙을 참고해 전체 문서와 공통 문구를 검사했다. 개편 완료본과 비교해 문장 호응·조사·과도한 명사 압축·연결어미 쉼표만 보수적으로 다듬었다. 과거 기록 본문은 수정하지 않았다.
- 검사 결과·정정·미확인 범위는 [검증 기록](2026-10-01-warning-docs-verification.md), 윤문 상세는 [윤문 검사 기록](2026-10-01-warning-docs-proofreading.md)에 남겼다.
