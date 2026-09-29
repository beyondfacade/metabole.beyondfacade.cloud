---
layout: default
title: 4) 상세 설계서
permalink: /docs/deliverables/detailed-design.html
parent: 6. 프로젝트 산출물
nav_order: 4
---

# 4) 개발 항목 상세 설계서

> 수업 지침에 따르면 상세 설계서는 개발 구현이 완료된 후 방법론을 기술하는 산출물이다. 데이터·RAG·AI 에이전트·채팅 관문·계획/조달 화면까지 구현이 끝난 범위를 기술한다(2026-09-28 기준). 09.28 서비스 방향을 네거티브 리포트로 전환해 판정(verdict) BC를 별도 브랜치에서 구현 중이며, 남은 것은 판정 카드·위험도 지도 화면, 실배포, 모바일 지도다. 구현 이력 전체는 [개발 일지]({{ '/docs/devlog.html' | relative_url }})에 버전 단위로 남아 있다.

## 개발개요

백엔드는 Bounded Context 16개(master·store·metric·funding·news·shock·rent·tobacco·convenience·childcare·commerce·neighborhood·rag·agent·intent·finance)로 분리하고 데이터 테이블 하나마다 표준 파일 세트 하나(Fractal 11-File Set)를 구성했다. intent·finance는 상태가 없어 테이블 없이 유스케이스만 둔 BC다. 09.28부터는 17번째 BC `verdict`(네거티브 판정)를 `feat/verdict-card` 브랜치에서 추가하고 있다(미병합). 프론트엔드는 라우트 4개(`/`·`/map`·`/plan`·`/analysis`)에 `features/{landing, intent-gate, map-explorer, plan, agent-report}` 수직 분할 구조다.

## Data Flow (아키텍처링)

구도는 상위 설계서의 [Data Flow]({{ '/docs/deliverables/high-level-design.html' | relative_url }})와 같다. 상세 수준에서 보면 각 BC가 **수집 어댑터 → 도메인 엔티티 → 리포지토리 → UseCase → 라우터**의 포트-어댑터(헥사고날) 흐름을 따른다.

## 목적과 기능

각 모듈의 목적·기능·적재 실적:

| 모듈(BC) | 목적 | 구현 실적 |
|---|---|---|
| store | 업종 18종(기존 10 + 음식 8) 점포 원천 | 88.8만 행(음식 53.9만 행은 09.28 24구 적재), 행정동 공간조인 99.99%, 좌표 없는 학원·부동산중개는 SGIS 지오코딩(99.5% 이상). 음식은 인허가 일반음식점 슬러그 1개를 업태 분류기로 나눈다 |
| metric | 지표 사전 집계·파생 | 행정동×업종×연도 55,093건(18업종) + 동네 유형 프로필 9,284건 + 시간대 어긋남 342,078건(배치 33초, 멱등), 조회 API `/metrics`·`/profiles`·`/hour-gaps` |
| commerce | 서울 상권분석 업종 실적 | 추정매출 34.3만 · 점포 70.4만 · 매출 분해 789만 행(20분기), 계획 화면 월매출 프리필 원천 |
| neighborhood | 동네 맥락 7종 + 상권 변화 | 105만 행(22분기), 유형 6종 판정 원천, `/commerce-changes` 영업 지속 개월 |
| childcare | 어린이집 시설·정원/현원 이력 | 서울 3,940곳, 행정동 연결 426/427개 동, 주간 수집 크론(관측 2회) |
| convenience | 편의점 점포·브랜드 분포 | 2026년 9,395곳/427개 동, 조회 API |
| funding | 정책자금 공고·후보 필터 | 2,032건, 멱등 업서트 + 만료 배치, 조달 화면용 후보 공고 필터·확인할 질문 규칙 11종 |
| shock | 특이변수 4계층 | 거리두기 공백 0일 연속 커버, 기준금리 92행 |
| rent · ECOS | 임대료·공실률·대출금리 | R-ONE 3,638행, 금리 3계열 365행 |
| rag | 검색 계층 | 색인 7,980건 전량 fp16, 평가셋 200건 검수 완료(confirmed 180) 기준 **Hit@5 1.000 · MRR 0.95**, 뉴스 같은 사건 접기 |
| agent | AI 에이전트 코어 | LLM 게이트웨이 2종(Gemini 우선·로컬 gemma4 폴백 혼합)·도구 10종·에이전트 루프(벽시계 예산 180초)·SSE 라우터 3종·리포트 영속화 |
| intent | 채팅 관문 | 규칙 우선 파서(동·업종·예산 추출기 체인) + LLM 폴백, 한 줄 진단은 어휘 테이블 조립 |
| finance | 계획·재무 계산 | 결정론 엔진 이식, `/finance/simulate`·`/finance/prefill`(월매출·권역 임대료·ECOS 금리 실측 프리필) |
| verdict (구현 중) | 네거티브 판정 카드 | 공통 신호 5종 Specification, 427동 strict 백분위 상대평가, 판정 규칙 Chain of Responsibility, 새벽 배치 테이블 `region_industry_verdict`, API 3종. Task 1~6 구현·테스트 28건, Task 7(라우터·배치) 진행 |

## 데이터베이스 설계 (ERD)

운영 DB 스키마를 직접 조회해 확정한 최종 ERD는 **36테이블**이다(스키마 2026-09-23 확정, 적재 2026-09-28 실측 약 1,159만 행). verdict BC의 `region_industry_verdict`는 브랜치에만 있어 병합 시 37테이블이 된다. 테이블은 **마스터 → 원천(인허가·스냅샷·외생 변수·서울 상권분석) → 집계·파생 → 검색·에이전트** 계층으로 나뉘고, 원천 테이블 대부분은 마스터 허브(`district`·`region`·`industry`)에 FK로 연결된다. 전체 다이어그램, 테이블별 컬럼, 정규화·역정규화 근거, 설계 초안(15테이블) 대비 변경분은 [ERD — 데이터 모델]({{ '/docs/erd.html' | relative_url }}) 페이지에 있다.

| 계층 | 테이블 | 비고 |
|---|---|---|
| 마스터 | district · region · industry · industry_subcategory · industry_source_code · population_stat | 행정동 427 · 업종 18종(화면 판정 대상 14종) |
| 원천(인허가) | store · academy_course · tobacco_retailer | store 888,308행(09.28, 음식 8종 포함) |
| 원천(스냅샷) | convenience_store · childcare_center · childcare_center_stat | 개폐업 이력 없음 → store와 분리 |
| 원천(외생 변수) | rent_price · interest_rate · shock_event · shock_event_industry · shock_event_region · news_article · funding_program | funding_program은 DB FK 없음(후속 과제) |
| 원천(상권분석 · 업종 실적) | region_commerce_sales · region_commerce_store · region_commerce_sales_breakdown | 동×업종×분기, 매출 분해는 1NF long 테이블 789만 행 |
| 원천(상권분석 · 동네 맥락) | region_footfall_quarter · region_population_quarter · region_household_quarter · region_housing_average_quarter · region_facility_quarter · region_spending_quarter · region_commerce_change · seoul_commerce_change_baseline | 동×분기, 업종 축 없음 → 별도 BC |
| 집계·파생 | region_industry_metric · region_profile_quarter · region_industry_hour_gap_quarter | 업종 지표 55,093행 · 동네 유형 9,284행 · 시간대 어긋남 342,078행 |
| 검색·에이전트 | rag_chunk · analysis_report · llm_usage | 7,980행 · vector(1536) / 리포트 영속화·토큰 사용량 |

## 요구사항 별 상세설계

### 요구사항 #1 — 지도 기반 상권 탐색 · 구현방식 ✅ 구현 완료

- 경계 서빙: `GET /regions/geojson` — 좌표 소수 5자리 절삭(≈1.1m 오차)으로 8.1MB→5.4MB, 프로세스 수명 캐싱 프록시(GoF Proxy), GZip 미들웨어.
- 지표 조회: `GET /metrics`(단계구분도) · `GET /stores`(마커 클러스터) · `GET /regions/{code}/summary`(fact 카드 3장). 에러 바디는 `{error:{code,message}}` 단일 형식.
- 프론트: MapLibre GL 코로플레스 이산 7클래스 + MapLegend. 상태는 URL 쿼리(`region·industry·year·metric`)로 관리하고 전역 상태 라이브러리 없이 TanStack Query만 사용한다.
- 업종별 마커: 전략(Strategy) 패턴 `RegionMarkers`로 업종마다 조회 함수·캐시 키·팝업 구성을 분리했다. 어린이집(정원·현원·가동률·입소대기)·편의점(브랜드 분포) 팝업과 사이드패널을 둔다. 현행 판정 기준은 최신 관측일이며 어린이집은 자치구별, 편의점은 행정동별로 따진다.
- 백엔드 접근: Next.js `/api/backend/*` → 서버 전용 `BACKEND_ORIGIN` 프록시. Remote-SSH 포트 포워딩 환경에 대응하려고 브라우저는 같은 origin만 호출한다.
- 채팅 관문(09.23): 랜딩 입력창 → `POST /intent`가 동·업종·예산을 규칙 우선으로 추출(추출기 체인, LLM 폴백은 동 결측 시 1콜)하고, 후보가 여럿이면 칩으로 되묻는다(상태 기계 idle → pending → clarify → done). 한 줄 진단은 LLM이 아니라 어휘 테이블 조립이다.
- 무대(09.23): 컨트롤바를 동네 무리(유형·심야 체류·음식/유흥 비중·영업 지속 개월, 동×분기)와 업종 무리(폐업률·성장률·점포수, 업종×연도)로 나눴다. 기본 지표는 **동네 유형 단계구분도**(범주형 계약 `/profiles/types`, 라이트/다크 팔레트 두 벌). 사이드패널은 ①어떤 동네인가 → ②하루 흐름(4블록 막대) → ③업종 시간대(유동·매출 두 선, `/hour-gaps`) → ④얼마나 버티나(서울 평균 동봉) → ⑤업종 실적 순서의 서사로 재배열했다.
- 데이터 보유 범위(09.24): `metric-coverage.ts`를 단일 원천으로 두어 빈 지도가 되는 (업종, 지표, 시점) 조합을 셀렉터가 제안하지 않고, 범위 밖 시점은 가장 가까운 유효 시점으로 당긴다. 폐업 이력 없는 원천(어린이집·편의점·학원)은 배너·사이드패널에서 "집계 없음"으로 안내한다.
- 업종 확장(09.28): 인허가 일반음식점은 슬러그 하나(`general_restaurants`)로 수집하고 건별 업종은 업태(`BZSTAT_SE_NM`) 분류기가 정한다(`PermitIndustryClassifier` 추상 + `FixedIndustryClassifier`·`BusinessTypeClassifier` Strategy). 6업종을 따로 받으면 같은 50만 건을 6번 받기 때문이다. 프론트는 `shared/industries.ts`를 단일 원천으로 판정 대상 14종과 업종 그룹(음식/생활/여가) optgroup을 상권 탐색 컨트롤바와 AI 분석 폼이 공유하고, 학원·어린이집은 판정 대상에서 빼 동 단위 보조축으로 쓴다.

### 요구사항 #2 — AI 창업 분석 리포트 · 구현방식 ✅ 구현 완료 (실 SSE 연동)

- 청크 빌더: funding·news 원천을 도메인 순수 함수로 청크화한다(프레임워크 import 금지). 원천 ORM → 엔티티 변환은 소스 게이트웨이가 맡는다.
- 임베딩: `EmbeddingPort` 뒤에 어댑터 3종을 둔다. Ollama Q4(쿼리 상시), fp16(색인 새벽 배치, 지연 로딩으로 GPU 미점유), Gemini(비교 평가용)이며 전부 1536차원 L2 정규화로 통일했다.
- 검색: `RagChunkOrm.embedding.cosine_distance`로 정렬하고 만료 공고는 SQL 조건으로 필터링한다. 색인은 증분(기존 id 스킵)/전량(`--full`) CLI와 크론으로 돌린다.
- LLM 게이트웨이: `LLMGatewayPort.chat` 단일 메서드와 프로바이더 중립 계약(`LLMToolSpec`·`LLMToolCall`·`LLMUsage`·`LLMTurn`)으로 구성한다. Ollama(gemma3) 어댑터와 Gemini 어댑터(요청 간 최소 4초 간격, 429 지수 백오프)를 둔다.
- 도구 레지스트리: 기존 UseCase를 래핑한 도구를 if/elif 없는 리스트 registry로 조립했다(market 3·shock 2·funding 2에서 시작해 동네 프로필·finance 계산기·후보 공고까지 10종). cross-BC 조회는 `RegionFactsPort` 구현 게이트웨이(어댑터 레이어)에만 둔다. 리포트 `market` 섹션은 슬롯 6종으로 고정하고 서울 평균·같은 유형 중앙값 벤치마크를 주입해 "비교 기준 없는 절대값 서술"을 막는다.
- 에이전트 루프: `AnalysisInteractor` 제너레이터가 `agent_status → tool_call → report_delta → report_done` 순서로 이벤트를 방출한다. 응답 규칙 4종과 `[SECTION:*]` 마커 5종을 둔다. 인자 스키마를 위반하면 재프롬프트 1회 후 스킵하고 도구 예외는 `{"error"}`로 되먹이며 12턴을 넘기면 최종 리포트를 강제한다.
- SSE 엔드포인트·영속화(09.21): `POST /analysis` · `GET /analysis/{id}/events` · `GET /analysis/myself`. 스트림 완료 시 `analysis_report` 1행 + `llm_usage` 1행을 저장하고, 요청마다 인터랙터를 새로 만들어 토큰 사용량 상태를 격리한다. 에이전트 루프는 벽시계 예산 180초를 두고 LLM 장애 시에도 리포트를 낸다.
- 프론트 실 SSE 전환(09.21): `config.apiBase`(`NEXT_PUBLIC_API_BASE=/api/backend`)만으로 mock ↔ 실 API를 바꾼다. 백엔드 계약이 mock과 동일해 훅 로직은 무변경. 업종별 예시 질문 칩(10업종×3)으로 질문 입력을 돕는다.
- 두뇌 선택(09.22~09.24): 시나리오 10건(업종 기본 6·부분 데이터 2·규칙 2)으로 gemma4 로컬과 Gemini를 비교 평가한 뒤 **혼합(Gemini 우선·실패 시 로컬 폴백)**을 채택했다. 금지 규칙(은행 추천·외국인 비하)은 자동 채점과 수동 판정을 병기한다.
- RAG 평가셋(09.24~09.25): candidate 50건을 200건으로 확장하고 사람 검수 CLI·Claude 1차 판정·외부 판정 2종을 거쳐 confirmed 180 / rejected 20으로 마감. 지표는 뉴스 다중 정답을 반영해 Recall@5 → Hit@5로 전환했고, 검색 시점에 같은 사건 기사를 접어(제목 Jaccard·보도일 창) top-5 중복을 평균 2.98 → 2.00으로 줄였다.

### 요구사항 #3 — 정책자금·금융 계산기 · 구현방식 ✅ 구현 완료 (계획 `/plan` 화면)

- 데이터 축: 기업마당은 `updtPnttm` 변경분을 업서트하고 `deadline < today` 공고는 일 배치로 만료 처리한다(연장·상시 복원). 대출금리는 ECOS 121Y006 3계열을 쓴다. 은행연합회 스크래핑은 robots.txt 불허를 확인한 뒤 전량 원복했으며 우회는 없다. R-ONE 임대료·공실률은 분기 병합 업서트한다.
- 계산기: 도구 레지스트리의 `compare_rent_vs_buy` 순수 함수로 구현했다. 공시금리 × 실거래가 추정 × 취득세 부대비용으로 손익분기를 내되 예상 계산까지만 한다. 연금리를 생략하면 시설자금대출 최신값을 자동 주입하고 결과에는 금융 규제 경계 고지(assumptions)를 항상 포함한다. 금리가 적재되지 않았으면 `{"error"}`를 반환하고 멈춘다.
- finance BC(09.23~09.24): 테이블 없는 BC로 결정론 엔진(80줄)을 산식 변경 없이 이식해 `POST /finance/simulate`(입력 13필드)를 두고, 계산은 코드가 하고 설명만 AI가 맡는다. `GET /finance/prefill?region&industry`가 월매출(상권분석 sales ÷ store ÷ 3)·권역 임대료·ECOS 금리를 실측으로 채우며 값마다 `basis`·`caveat`를 붙인다. 리포트 calculator 절은 이 엔진을 도구로 읽는다.
- 조달·준비(09.24): `funding` 후보 공고 필터(미만료·업종·지역 조건, 후보 풀 92건)와 확인할 질문 생성 규칙 11종, 준비자료 목록을 `/plan` 화면 마지막 단계(조달·상담 준비)에 연결했다. 리포트 funding 절도 같은 결정론 후보를 읽는다. 상품 매칭·은행 추천은 하지 않는다.
- 프론트 `/plan`(09.24): 실측 프리필 확인 → 재무 계산 → 최초안/현재안 비교 → 조달·상담 준비 흐름. 계획 초안은 `sessionStorage`에 둔다. E2E 11단계(관문 → 지도 → 분석 → 계획)가 실 백엔드 상대로 전 구간 통과했다.

### 방향 전환 — 네거티브 판정 카드(verdict) · 구현방식 🔄 구현 중 (`feat/verdict-card`)

09.28 브레인스토밍에서 서비스 방향을 "어디에 창업하면 좋다"가 아니라 **"이 동네에서 이 장사는 하지 마라"**로 바꿨다. 지방행정 인허가 원천은 폐업 21만 건을 점포 단위(개업일·폐업일·좌표)로 갖고 2019년부터 시계열이 있어 코호트 생존율과 백테스트가 가능하다는 점이 근거다. 설계서와 13 Task 플랜은 `docs/superpowers/specs/2026-09-28-verdict-card-design.md`·`plans/2026-09-28-verdict-card.md`에 있다.

- 판정 구조: 점수 하나로 뭉개지 않고 **독립 경고 신호를 하나씩 켠다**(Specification 패턴, 신호 1개 = 클래스 1개). 1차 공통 신호 5종 — 순유출(12개월 폐업−개업 ÷ 시작 점포)·생존 절벽(3년 전 개업 코호트 생존율)·조기 폐업(최근 3년 폐업 영업개월 중위)·포화(상주인구 1,000명당 점포)·상권 축소(변화지표 HL). 표본 가드 미달은 `unavailable`.
- 상대평가: 임계값은 사람이 정하지 않고 업종 안 **427동 strict 백분위**로 `p ≥ 75 → on`, `p ≥ 90 → strong`. 상수는 `VerdictThresholds` 한 곳에 두고 경계값은 배치마다 분포에서 재계산한다.
- 판정 규칙: Chain of Responsibility로 `insufficient`(판정 가능 신호 < 3, 먼저 검사) → `red`(strong ≥ 2) → `orange`(켜진 신호 ≥ 1) → `clear`. 🟢 추천은 쓰지 않는다. 근거 문장은 규칙 코드가 숫자·비교 기준을 넣어 만들며 LLM은 관여하지 않는다.
- 저장·API: 지도가 427동을 한 번에 칠하므로 요청 시 계산 대신 **새벽 배치 테이블 `region_industry_verdict`**(마이그레이션 `c9d0e1f2a3b4`, signals JSON)에 업서트한다. 신호 입력은 verdict BC 자체 게이트웨이가 store·metric·neighborhood ORM을 읽어(다른 BC 무변경) store 집계는 `group_by(region, industry)` + `percentile_cont(0.5)` 1쿼리로 낸다. API는 `/verdicts/myself`(배선 검증) · `/verdicts?industry=`(범주형 단계구분도) · `/verdicts/{region_code}?industry=` 3종.
- 진행: Task 1~6(엔티티·신호·규칙·DTO/인터랙터·ORM·게이트웨이) 커밋 6개, 테스트 28건. Task 7(라우터·DI·`build_verdicts` CLI·실DB 배치 1회)이 진행 중이며 완료 시 BE v0.40.0으로 기록한다. 이어서 2단계 프론트 판정 카드·위험도 지도(FE v0.29.0), 3단계 폐업 마커 `GET /stores?status=closed`, 그 다음 백테스트와 업종 특화 신호 순서다.
- 판정 대상: 기존 8종 + 음식 6종 = **14종**. 학원·어린이집은 정주 인구 지표이므로 판정 대상이 아니라 동 단위 보조축이다. 치킨은 인허가 신규 발급이 2017년 이후 없어 인허가 기반 신호에서 제외한다.
