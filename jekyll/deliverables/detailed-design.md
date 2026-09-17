---
layout: default
title: 4) 상세 설계서
permalink: /docs/deliverables/detailed-design.html
parent: 6. 프로젝트 산출물
nav_order: 4
---

# 4) 개발 항목 상세 설계서

> 수업 지침에 따르면 상세 설계서는 개발 구현이 완료된 후 방법론을 기술하는 산출물이다. 지금은 구현이 끝난 데이터·RAG 계층까지 기술하고 AI 에이전트 구간은 Sprint 3 진행에 맞춰 갱신한다. 구현 이력 전체는 [개발 일지]({{ '/docs/devlog.html' | relative_url }})에 버전 단위로 남아 있다.

## 개발개요

백엔드는 Bounded Context 단위(master·store·metric·funding·news·shock·rent·tobacco·convenience·childcare·rag·agent 등)로 분리하고 데이터 테이블 하나마다 표준 파일 세트 하나(Fractal 11-File Set)를 구성했다. 프론트엔드는 `features/{map-explorer, agent-report}` 수직 분할 구조다.

## Data Flow (아키텍처링)

구도는 상위 설계서의 [Data Flow]({{ '/docs/deliverables/high-level-design.html' | relative_url }})와 같다. 상세 수준에서 보면 각 BC가 **수집 어댑터 → 도메인 엔티티 → 리포지토리 → UseCase → 라우터**의 포트-어댑터(헥사고날) 흐름을 따른다.

## 목적과 기능

각 모듈의 목적·기능·적재 실적:

| 모듈(BC) | 목적 | 구현 실적 |
|---|---|---|
| store | 업종 10종 점포 원천 | 29.7만 행, 행정동 공간조인 99.996% |
| metric | 지표 사전 집계 | 행정동×업종×연도 21,005건(어린이집·편의점 점포수 합류), 조회 API 3종 |
| childcare | 어린이집 시설·정원/현원 이력 | 서울 3,940곳, 행정동 연결 426/427개 동, 주간 수집 크론 |
| convenience | 편의점 점포·브랜드 분포 | 2026년 9,395곳/427개 동, 조회 API |
| funding | 정책자금 공고 | 1,849건, 멱등 업서트 + 만료 배치 |
| shock | 특이변수 4계층 | 거리두기 공백 0일 연속 커버, 기준금리 92행 |
| rent · ECOS | 임대료·공실률·대출금리 | R-ONE 3,638행, 금리 3계열 273행 |
| rag | 검색 계층 | 색인 6,645건(news 4,796 · funding 1,849), Recall@5 기준선 0.900(초기 색인 6,157건 기준) |
| agent | AI 에이전트 코어 | LLM 게이트웨이 2종·도구 7종·에이전트 루프 (라우터·SSE 진행 중) |

## 데이터베이스 설계 (ERD)

운영 DB 스키마를 직접 조회해 확정한 최종 ERD는 **21테이블**이다(2026-09-17 기준). 테이블은 **마스터 → 원천(인허가·스냅샷·외생 변수) → 집계 → 검색** 계층으로 나뉘고, 원천 테이블 대부분은 마스터 허브(`district`·`region`·`industry`)에 FK로 연결된다. 전체 다이어그램, 테이블별 컬럼, 정규화·역정규화 근거, 설계 초안(15테이블) 대비 변경분은 [ERD — 데이터 모델]({{ '/docs/erd.html' | relative_url }}) 페이지에 있다.

| 계층 | 테이블 | 비고 |
|---|---|---|
| 마스터 | district · region · industry · industry_subcategory · industry_source_code · population_stat | 행정동 427 · 업종 10종 |
| 원천(인허가) | store · academy_course · tobacco_retailer | store 348,792행 |
| 원천(스냅샷) | convenience_store · childcare_center · childcare_center_stat | 개폐업 이력 없음 → store와 분리 |
| 원천(외생 변수) | rent_price · interest_rate · shock_event · shock_event_industry · shock_event_region · news_article · funding_program | funding_program은 DB FK 없음(후속 과제) |
| 집계 | region_industry_metric | (행정동, 업종, 연도) 복합키 · 21,005행 |
| 검색 | rag_chunk | 6,645행 · vector(1536) |

## 요구사항 별 상세설계

### 요구사항 #1 — 지도 기반 상권 탐색 · 구현방식 ✅ 구현 완료

- 경계 서빙: `GET /regions/geojson` — 좌표 소수 5자리 절삭(≈1.1m 오차)으로 8.1MB→5.4MB, 프로세스 수명 캐싱 프록시(GoF Proxy), GZip 미들웨어.
- 지표 조회: `GET /metrics`(단계구분도) · `GET /stores`(마커 클러스터) · `GET /regions/{code}/summary`(fact 카드 3장). 에러 바디는 `{error:{code,message}}` 단일 형식.
- 프론트: MapLibre GL 코로플레스 이산 7클래스 + MapLegend. 상태는 URL 쿼리(`region·industry·year·metric`)로 관리하고 전역 상태 라이브러리 없이 TanStack Query만 사용한다.
- 업종별 마커: 전략(Strategy) 패턴 `RegionMarkers`로 업종마다 조회 함수·캐시 키·팝업 구성을 분리했다. 어린이집(정원·현원·가동률·입소대기)·편의점(브랜드 분포) 팝업과 사이드패널을 둔다. 현행 판정 기준은 최신 관측일이며 어린이집은 자치구별, 편의점은 행정동별로 따진다.
- 백엔드 접근: Next.js `/api/backend/*` → 서버 전용 `BACKEND_ORIGIN` 프록시. Remote-SSH 포트 포워딩 환경에 대응하려고 브라우저는 같은 origin만 호출한다.

### 요구사항 #2 — AI 창업 분석 리포트 · 구현방식 🔄 RAG까지 완료, 에이전트 진행 중

- 청크 빌더: funding·news 원천을 도메인 순수 함수로 청크화한다(프레임워크 import 금지). 원천 ORM → 엔티티 변환은 소스 게이트웨이가 맡는다.
- 임베딩: `EmbeddingPort` 뒤에 어댑터 3종을 둔다. Ollama Q4(쿼리 상시), fp16(색인 새벽 배치, 지연 로딩으로 GPU 미점유), Gemini(비교 평가용)이며 전부 1536차원 L2 정규화로 통일했다.
- 검색: `RagChunkOrm.embedding.cosine_distance`로 정렬하고 만료 공고는 SQL 조건으로 필터링한다. 색인은 증분(기존 id 스킵)/전량(`--full`) CLI와 크론으로 돌린다.
- LLM 게이트웨이: `LLMGatewayPort.chat` 단일 메서드와 프로바이더 중립 계약(`LLMToolSpec`·`LLMToolCall`·`LLMUsage`·`LLMTurn`)으로 구성한다. Ollama(gemma3) 어댑터와 Gemini 어댑터(요청 간 최소 4초 간격, 429 지수 백오프)를 둔다.
- 도구 레지스트리: 기존 UseCase를 래핑한 7종(market 3·shock 2·funding 2)을 if/elif 없는 리스트 registry로 조립했다. cross-BC 조회는 `RegionFactsPort` 구현 게이트웨이(어댑터 레이어)에만 둔다.
- 에이전트 루프: `AnalysisInteractor` 제너레이터가 `agent_status → tool_call → report_delta → report_done` 순서로 이벤트를 방출한다. 응답 규칙 4종과 `[SECTION:*]` 마커 5종을 둔다. 인자 스키마를 위반하면 재프롬프트 1회 후 스킵하고 도구 예외는 `{"error"}`로 되먹이며 12턴을 넘기면 최종 리포트를 강제한다.
- 남은 구간(Sprint 3): 영속화·라우터·SSE 엔드포인트(Task 11), 프론트 AI 분석 탭 mock → 실 SSE 전환(Task 12). 완료되면 본 절을 갱신한다.

### 요구사항 #3 — 정책자금·금융 계산기 · 구현방식 🔄 데이터 축·계산기 도구 완료, 에이전트 실연동 대기

- 데이터 축: 기업마당은 `updtPnttm` 변경분을 업서트하고 `deadline < today` 공고는 일 배치로 만료 처리한다(연장·상시 복원). 대출금리는 ECOS 121Y006 3계열을 쓴다. 은행연합회 스크래핑은 robots.txt 불허를 확인한 뒤 전량 원복했으며 우회는 없다. R-ONE 임대료·공실률은 분기 병합 업서트한다.
- 계산기: 도구 레지스트리의 `compare_rent_vs_buy` 순수 함수로 구현했다. 공시금리 × 실거래가 추정 × 취득세 부대비용으로 손익분기를 내되 예상 계산까지만 한다. 연금리를 생략하면 시설자금대출 최신값을 자동 주입하고 결과에는 금융 규제 경계 고지(assumptions)를 항상 포함한다. 금리가 적재되지 않았으면 `{"error"}`를 반환하고 멈춘다.
