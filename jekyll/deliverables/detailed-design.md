---
layout: default
title: 4) 상세 설계서
permalink: /docs/deliverables/detailed-design.html
parent: 6. 프로젝트 산출물
nav_order: 4
---

# 4) 개발 항목 상세 설계서

> 상세 설계서는 개발 구현이 완료된 후 방법론에 대해 기술하는 산출물이다(수업 지침). 현재 구현이 끝난 데이터·RAG 계층까지 기술하고, AI 에이전트 구간은 Sprint 3 진행에 맞춰 갱신한다. 구현 이력 전체는 [개발 일지]({{ '/docs/devlog.html' | relative_url }})에 버전 단위로 기록되어 있다.

## 개발개요

백엔드는 Bounded Context 단위(master·store·metric·funding·news·shock·rent·tobacco·convenience·childcare·rag·agent 등)로 분리하고, 데이터 테이블 하나마다 표준 파일 세트 하나(Fractal 11-File Set)를 구성했다. 프론트엔드는 `features/{map-explorer, agent-report}` 수직 분할 구조다.

## Data Flow (아키텍처링)

상위 설계서의 [Data Flow]({{ '/docs/deliverables/high-level-design.html' | relative_url }})와 동일 구도이며, 상세 수준에서는 각 BC가 **수집 어댑터 → 도메인 엔티티 → 리포지토리 → UseCase → 라우터**의 포트-어댑터(헥사고날) 흐름을 따른다.

## 목적과 기능

각 모듈의 목적·기능·적재 실적:

| 모듈(BC) | 목적 | 구현 실적 |
|---|---|---|
| store | 업종 10종 점포 원천 | 29.7만 행, 행정동 공간조인 99.996% |
| metric | 지표 사전 집계 | 행정동×업종×연도 21,005건(어린이집·편의점 점포수 합류), 조회 API 3종 |
| childcare | 어린이집 시설·정원/현원 이력 | 서울 3,940곳, 행정동 연결 426/427개 동, 주간 수집 크론 |
| convenience | 편의점 점포·브랜드 분포 | 2026년 9,395곳/427개 동, 조회 API |
| funding | 정책자금 공고 | 1,499건, 멱등 업서트 + 만료 배치 |
| shock | 특이변수 4계층 | 거리두기 공백 0일 연속 커버, 기준금리 92행 |
| rent · ECOS | 임대료·공실률·대출금리 | R-ONE 3,638행, 금리 3계열 273행 |
| rag | 검색 계층 | 색인 6,157건, Recall@5 기준선 0.900 |
| agent | AI 에이전트 코어 | LLM 게이트웨이 2종·도구 7종·에이전트 루프 (라우터·SSE 진행 중) |

## 요구사항 별 상세설계

### 요구사항 #1 — 지도 기반 상권 탐색 · 구현방식 ✅ 구현 완료

- 경계 서빙: `GET /regions/geojson` — 좌표 소수 5자리 절삭(≈1.1m 오차)으로 8.1MB→5.4MB, 프로세스 수명 캐싱 프록시(GoF Proxy), GZip 미들웨어.
- 지표 조회: `GET /metrics`(단계구분도) · `GET /stores`(마커 클러스터) · `GET /regions/{code}/summary`(fact 카드 3장). 에러 바디는 `{error:{code,message}}` 단일 형식.
- 프론트: MapLibre GL 코로플레스 이산 7클래스 + MapLegend, URL 쿼리(`region·industry·year·metric`)로 상태 관리 — 전역 상태 라이브러리 없이 TanStack Query만 사용.
- 업종별 마커: 업종마다 조회 함수·캐시 키·팝업 구성을 분리한 전략(Strategy) 패턴 `RegionMarkers` — 어린이집(정원·현원·가동률·입소대기)·편의점(브랜드 분포) 팝업과 사이드패널. 현행 판정은 어린이집은 자치구별, 편의점은 행정동별 최신 관측일 기준.
- 백엔드 접근: Next.js `/api/backend/*` → 서버 전용 `BACKEND_ORIGIN` 프록시로 브라우저는 같은 origin만 호출(Remote-SSH 포트 포워딩 환경 대응).

### 요구사항 #2 — AI 창업 분석 리포트 · 구현방식 🔄 RAG까지 완료, 에이전트 진행 중

- 청크 빌더: funding·news 원천을 도메인 순수 함수로 청크화(프레임워크 import 금지), 소스 게이트웨이가 원천 ORM → 엔티티 변환.
- 임베딩: `EmbeddingPort` 뒤에 어댑터 3종 — Ollama Q4(쿼리 상시), fp16(색인 새벽 배치, 지연 로딩으로 GPU 미점유), Gemini(비교 평가용). 전부 1536차원 L2 정규화 통일.
- 검색: `RagChunkOrm.embedding.cosine_distance` 정렬 + 만료 공고 SQL 조건 필터. 색인은 증분(기존 id 스킵)/전량(`--full`) CLI + 크론.
- LLM 게이트웨이: `LLMGatewayPort.chat` 단일 메서드 + 프로바이더 중립 계약(`LLMToolSpec`·`LLMToolCall`·`LLMUsage`·`LLMTurn`). Ollama(gemma3) 어댑터와 Gemini 어댑터(요청 간 최소 4초 간격, 429 지수 백오프).
- 도구 레지스트리: 기존 UseCase를 래핑한 7종(market 3·shock 2·funding 2)을 if/elif 없는 리스트 registry로 조립. cross-BC 조회는 `RegionFactsPort` 구현 게이트웨이(어댑터 레이어)에만 둔다.
- 에이전트 루프: `AnalysisInteractor` 제너레이터가 `agent_status → tool_call → report_delta → report_done` 순서로 이벤트 방출. 응답 규칙 4종 + `[SECTION:*]` 마커 5종, 인자 스키마 위반은 재프롬프트 1회 후 스킵, 도구 예외는 `{"error"}` 되먹임, 12턴 초과 시 최종 리포트 강제.
- 남은 구간(Sprint 3): 영속화·라우터·SSE 엔드포인트(Task 11), 프론트 AI 분석 탭 mock → 실 SSE 전환(Task 12) — 완료 시 본 절 갱신.

### 요구사항 #3 — 정책자금·금융 계산기 · 구현방식 🔄 데이터 축·계산기 도구 완료, 에이전트 실연동 대기

- 데이터 축: 기업마당 `updtPnttm` 변경분 업서트, `deadline < today` 일 배치 만료(연장·상시 복원). ECOS 121Y006 대출금리 3계열(은행연합회 스크래핑은 robots.txt 불허 확인 후 전량 원복 — 우회 없음). R-ONE 임대료·공실률 분기 병합 업서트.
- 계산기: 도구 레지스트리의 `compare_rent_vs_buy` 순수 함수로 구현 — 공시금리 × 실거래가 추정 × 취득세 부대비용 손익분기, 예상 계산까지만. 연금리 생략 시 시설자금대출 최신값 자동 주입, 결과에 금융 규제 경계 고지(assumptions) 항상 포함, 금리 미적재 시 `{"error"}` 반환으로 우아하게 실패.
