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

백엔드는 Bounded Context 11개(master·store·metric·funding·news·shock·rent·tobacco·convenience·rag 등)로 분리하고, 데이터 테이블 하나마다 표준 파일 세트 하나(Fractal 11-File Set)를 구성했다. 프론트엔드는 `features/{map-explorer, agent-report}` 수직 분할 구조다.

## Data Flow (아키텍처링)

상위 설계서의 [Data Flow]({{ '/docs/deliverables/high-level-design.html' | relative_url }})와 동일 구도이며, 상세 수준에서는 각 BC가 **수집 어댑터 → 도메인 엔티티 → 리포지토리 → UseCase → 라우터**의 포트-어댑터(헥사고날) 흐름을 따른다.

## 목적과 기능

각 모듈의 목적·기능·적재 실적:

| 모듈(BC) | 목적 | 구현 실적 |
|---|---|---|
| store | 업종 10종 점포 원천 | 29.7만 행, 행정동 공간조인 99.996% |
| metric | 지표 사전 집계 | 행정동×업종×연도 20,152건, 조회 API 3종 |
| funding | 정책자금 공고 | 1,499건, 멱등 업서트 + 만료 배치 |
| shock | 특이변수 4계층 | 거리두기 공백 0일 연속 커버, 기준금리 92행 |
| rent · ECOS | 임대료·공실률·대출금리 | R-ONE 3,638행, 금리 3계열 273행 |
| rag | 검색 계층 | 색인 6,157건, Recall@5 기준선 0.900 |

## 요구사항 별 상세설계

### 요구사항 #1 — 지도 기반 상권 탐색 · 구현방식 ✅ 구현 완료

- 경계 서빙: `GET /regions/geojson` — 좌표 소수 5자리 절삭(≈1.1m 오차)으로 8.1MB→5.4MB, 프로세스 수명 캐싱 프록시(GoF Proxy), GZip 미들웨어.
- 지표 조회: `GET /metrics`(단계구분도) · `GET /stores`(마커 클러스터) · `GET /regions/{code}/summary`(fact 카드 3장). 에러 바디는 `{error:{code,message}}` 단일 형식.
- 프론트: MapLibre GL 코로플레스 이산 7클래스 + MapLegend, URL 쿼리(`region·industry·year·metric`)로 상태 관리 — 전역 상태 라이브러리 없이 TanStack Query만 사용.

### 요구사항 #2 — AI 창업 분석 리포트 · 구현방식 🔄 RAG까지 완료, 에이전트 진행 중

- 청크 빌더: funding·news 원천을 도메인 순수 함수로 청크화(프레임워크 import 금지), 소스 게이트웨이가 원천 ORM → 엔티티 변환.
- 임베딩: `EmbeddingPort` 뒤에 어댑터 3종 — Ollama Q4(쿼리 상시), fp16(색인 새벽 배치, 지연 로딩으로 GPU 미점유), Gemini(비교 평가용). 전부 1536차원 L2 정규화 통일.
- 검색: `RagChunkOrm.embedding.cosine_distance` 정렬 + 만료 공고 SQL 조건 필터. 색인은 증분(기존 id 스킵)/전량(`--full`) CLI + 크론.
- 에이전트(Sprint 3): LLM 게이트웨이 포트 + gemma3·Gemini 어댑터, 도구 레지스트리 7종, 이벤트 제너레이터 루프, SSE 라우터 — 완료 시 본 절 갱신.

### 요구사항 #3 — 정책자금·금융 계산기 · 구현방식 🔄 데이터 축 완료, 계산기 진행 중

- 데이터 축: 기업마당 `updtPnttm` 변경분 업서트, `deadline < today` 일 배치 만료(연장·상시 복원). ECOS 121Y006 대출금리 3계열(은행연합회 스크래핑은 robots.txt 불허 확인 후 전량 원복 — 우회 없음). R-ONE 임대료·공실률 분기 병합 업서트.
- 계산기(Sprint 3): 도구 레지스트리에 순수 함수로 구현 — 공시금리 × 실거래가 추정 × 취득세 부대비용 손익분기, 예상 계산까지만.
