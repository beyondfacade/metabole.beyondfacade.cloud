# Jekyll 전체 윤문 검사 기록

검사일: 2026-10-01. 사용자가 문서 개편 후 `https://github.com/epoko77-ai/im-not-ai`를 참고한 전체 윤문 검사를 추가로 요청했다.

## 기준과 적용 범위

기준 저장소는 [im-not-ai](https://github.com/epoko77-ai/im-not-ai/tree/2f3d943d08056b612a92e12bfb72ea94dd2acd18), 확인 커밋은 `2f3d943d08056b612a92e12bfb72ea94dd2acd18`이다. [85개 진단 패턴](https://github.com/epoko77-ai/im-not-ai/blob/2f3d943d08056b612a92e12bfb72ea94dd2acd18/skills/humanize-korean/references/diagnosis-rules.md)과 [윤문·보존 원칙](https://github.com/epoko77-ai/im-not-ai/blob/2f3d943d08056b612a92e12bfb72ea94dd2acd18/skills/humanize-korean/references/quick-rules.md)을 읽고 적용했다.

이번 작업은 이 기준에 따른 문맥 검토와 제한적인 문장 편집이다. 플러그인을 설치하거나 `/humanize` 자동화 전체를 실행한 것은 아니며 자동 게이트 점수·작성 주체 판정·등급을 산출하지 않았다. 진단을 독립 검토자에게 맡긴 뒤 제안을 원문과 대조해 반영했다.

- 홈, 전체 `jekyll/**/*.md`, 개발 일지, README, 초기 브레인스토밍, 설정·공통 메뉴·레이아웃을 포함해 48개 파일을 점검했다.
- 번역투, 조사·서술 호응, 명사 압축, 반복 대구, 연결어미 쉼표, 과장과 추상 표현, 문체·리듬·시각 장식을 살폈다.
- 기술문서의 표·불릿·목차·API명·약어와 짧은 상태 문구는 독자가 비교하고 찾는 데 필요하므로 형식을 유지했다. 문장 길이를 맞추려고 불필요한 장문을 만들지 않았다.
- 수치·날짜·고유명사·출처·기능 조건·주장의 강도는 보존했다. 의미를 제한하는 ‘성공·안전 보장 없음’, ‘정확도·인과 효과 아님’은 윤문 과정에서 삭제하지 않았다.
- 과거 기록·초기 계획·기존 dirty 개발 일지는 진단만 했다. 당시 어조를 현재 설명으로 소급 변경하지 않았다.

## 반영한 주요 표현

| 파일 | 수정 전 | 수정 후 | 이유 |
|---|---|---|---|
| `index.markdown` | 부족한 자료는 판정을 보류합니다. | 자료가 부족하면 판정을 보류합니다. | 주어와 서술어 호응 |
| `index.markdown` | 근거와 해당하는 대안부터 | 근거와 해당 조건에 맞는 대안을 보여주며 | A-13, 조건과 행동을 명시 |
| `index.markdown` | 자유 설명의 검토는 여전히 필요합니다. | 자유 설명은 여전히 검토가 필요합니다. | 명사 연결 완화 |
| `jekyll/intro/overview.md` | 해당하는 대안·지원 정보·자금 준비로 | 해당 조건에 맞는 대안을 검토하고 지원 정보 확인과 자금 준비로 | A-13, 무엇을 하는지 명시 |
| `jekyll/deliverables/index.md` | 출품 시나리오을 | 출품 시나리오를 | 조사 오류 |
| `jekyll/deliverables/detailed-design.md` | 6개 스레드로 독립 자료를 조회합니다. | 6개 스레드로 자료를 독립적으로 조회합니다. | 수식 관계 |
| `jekyll/deliverables/detailed-design.md` | 고정비 6개월의 준비액 | 6개월 동안의 고정비 준비액 | 수량 수식 관계 |
| `jekyll/deliverables/high-level-design.md` | 임베딩·LLM 외부 의존을 사용합니다. | 임베딩·LLM의 외부 의존이 있습니다. | 서술 호응 |
| `jekyll/requirements/security.md` | 관리자에 의한 다른 계정의 비밀번호·등급 변경 | 관리자가 다른 계정의 비밀번호·등급을 변경하는 기능 | A-9·A-13, 행위자 명시 |
| `jekyll/requirements/security.md` | 서비스 전체가 개인정보를 수집하지 않는 것은 아닙니다. | 서비스 전체에는 개인정보 수집도 포함됩니다. | 이중부정 정리 |
| `jekyll/requirements/rag-pipeline.md` | 모든 원천을 LLM이 임의로 반복 조회하던 왕복 | LLM이 모든 원천을 임의로 반복 조회하며 생기던 왕복 | 수식 관계 |
| `jekyll/requirements/architecture.md` | 유사 사례 범위 철회와 입력 상태 문제 | 유사 사례의 계산 범위 변경을 철회한 과정과 입력 상태 문제 | 철회 대상 명시 |
| `jekyll/evidence.md` | 9/24 실측에 후속 부분 갱신 | 9/24 실측 기록에 이후 일부 내용을 갱신한 기록 | 명사 압축 완화 |
| `jekyll/evidence.md` | 양쪽 개업 각 50곳 | 양쪽 집단의 개업 점포가 각 50곳 이상 | 집단·단위·최소 표본 의미 명시, 원문 §5 재대조 |
| `jekyll/deliverables/demo-scenario.md` | 연결·LLM 실패는 실제 안내를 보여주고 | 연결·LLM 실패 시에는 실제 안내를 보여주고 | 조건·주어 호응 |
| 서비스 기능·요구사항 정의서 | 지역 사실 | 지역에 관한 사실 | 조사 보완 |

홈·README·개요·표준·품질·서비스 기능·상위 설계·요구사항 정의서에서는 의미 구분에 필요하지 않은 연결어미 뒤 쉼표를 줄였다(C-11). 홈의 ‘과거의 판정과, 이후의 폐업’에서도 불필요한 쉼표를 뺐다.

윤문 점검 중 별도로 ERD의 과거 요약 앞에 시점 안내를 추가했고 README에는 새 한국어 검색 검증 명령을 기록했다. 이 보완을 포함해 검사 전후 달라진 파일은 16개다. 전면 개편의 변경량과 후속 윤문의 변경량을 혼동하지 않았다.

## 과거 기록에서 관찰하고 보존한 표현

| 위치 | 관찰 | 처리 |
|---|---|---|
| `jekyll.md` | ‘우아하게 실패’, ‘하루 만에 화면까지 끌고 왔다’ 등 당시 기술 메모 | 동기화 원본·사용자 변경 보존, 본문 수정 없음 |
| `jekyll/history/detailed-design-2026-09-28.md` | ‘점수 하나로 뭉개지 않고’ 등 당시 설명 어조 | 과거 원문 유지 |
| `jekyll/schedule/timeline.md` 과거 계획 | ‘방법론을 적용하여,’ 등 연결어미 쉼표 | 과거 계획 본문 유지 |
| Sprint 1·WBS | 명사형 업무 목록·완료 이모지·짧은 상태 | 날짜별 업무표의 기능에 맞는 형식으로 유지 |
| ERD 과거 상세 명세 | 약어·명사구·수치와 기술적 대비가 반복됨 | 스키마 기록 형식 유지, 현재 내용과 구분하는 안내 보완 |

## 사후 검증

- 윤문 전 스냅샷을 `/tmp/metabole-docs-review/proofread-before/`에 저장해 비교했다.
- 바뀐 문서의 숫자 토큰을 전후 대조했다. ERD에 새로 붙인 과거 시점 안내 외에 숫자 변경은 없었다. 기존 백테스트 수치·표본·날짜와 기능 조건을 다시 읽었다.
- 개발 일지 해시·기존 permalink·과거 상세 설계 본문 보존을 확인했다.
- 윤문 반영 후 Jekyll 빌드, 내부 참조 2,718개 검사, 한국어 검색 4개, 5페이지×4폭 브라우저 검사 통과. 전체 결과와 확인하지 못한 범위는 [검증 기록](2026-10-01-warning-docs-verification.md)에 있다.

## 파일별 검사 목록

‘보존’은 검사에서 제외했다는 뜻이 아니라, 문맥상 유지하거나 과거 기록을 고치지 않았다는 뜻이다.

| 파일 | 후속 검사 처리 |
|---|---|
| `index.markdown` | 표현·안내 보완 |
| `README.md` | 표현·안내 보완 |
| `_config.yml` | 검사 후 보존 |
| `jekyll.md` | 검사 후 보존 |
| `brainstorming.md` | 검사 후 보존 |
| `jekyll/appendix/forms.md` | 검사 후 보존 |
| `jekyll/appendix/glossary.md` | 검사 후 보존 |
| `jekyll/appendix/index.md` | 검사 후 보존 |
| `jekyll/business-overview/effects.md` | 검사 후 보존 |
| `jekyll/business-overview/index.md` | 검사 후 보존 |
| `jekyll/business-overview/purpose.md` | 검사 후 보존 |
| `jekyll/business-overview/scope.md` | 검사 후 보존 |
| `jekyll/deliverables/demo-scenario.md` | 표현·안내 보완 |
| `jekyll/deliverables/detailed-design.md` | 표현·안내 보완 |
| `jekyll/deliverables/final-inspection.md` | 검사 후 보존 |
| `jekyll/deliverables/high-level-design.md` | 표현·안내 보완 |
| `jekyll/deliverables/index.md` | 표현·안내 보완 |
| `jekyll/deliverables/requirements-spec.md` | 표현·안내 보완 |
| `jekyll/deliverables/test-scenario.md` | 검사 후 보존 |
| `jekyll/deliverables/wbs.md` | 검사 후 보존 |
| `jekyll/erd.md` | 표현·안내 보완 |
| `jekyll/evidence.md` | 표현·안내 보완 |
| `jekyll/guidelines/general.md` | 검사 후 보존 |
| `jekyll/guidelines/index.md` | 검사 후 보존 |
| `jekyll/guidelines/quality.md` | 표현·안내 보완 |
| `jekyll/guidelines/standards.md` | 표현·안내 보완 |
| `jekyll/history/detailed-design-2026-09-28.md` | 검사 후 보존 |
| `jekyll/intro/overview.md` | 표현·안내 보완 |
| `jekyll/intro/subtopics.md` | 검사 후 보존 |
| `jekyll/intro/team.md` | 검사 후 보존 |
| `jekyll/requirements/architecture.md` | 표현·안내 보완 |
| `jekyll/requirements/data-collection.md` | 검사 후 보존 |
| `jekyll/requirements/dev-scope.md` | 검사 후 보존 |
| `jekyll/requirements/index.md` | 검사 후 보존 |
| `jekyll/requirements/purpose.md` | 검사 후 보존 |
| `jekyll/requirements/rag-pipeline.md` | 표현·안내 보완 |
| `jekyll/requirements/security.md` | 표현·안내 보완 |
| `jekyll/requirements/service-platform.md` | 표현·안내 보완 |
| `jekyll/schedule/index.md` | 검사 후 보존 |
| `jekyll/schedule/organization.md` | 검사 후 보존 |
| `jekyll/schedule/risk.md` | 검사 후 보존 |
| `jekyll/schedule/sprint1.md` | 검사 후 보존 |
| `jekyll/schedule/timeline.md` | 검사 후 보존 |
| `jekyll/toc.md` | 검사 후 보존 |
| `_includes/head_custom.html` | 검사 후 보존 |
| `_includes/nav_footer_custom.html` | 검사 후 보존 |
| `_includes/title.html` | 검사 후 보존 |
| `_layouts/post.html` | 검사 후 보존 |
