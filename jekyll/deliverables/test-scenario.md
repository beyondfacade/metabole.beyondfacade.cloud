---
layout: default
title: 5) 시나리오 테스트
permalink: /docs/deliverables/test-scenario.html
parent: 6. 프로젝트 산출물
nav_order: 5
---

# 5) 시나리오 테스트 (단위 → 통합 테스트)

품질 체계 전반은 [품질 관리 및 테스트]({{ '/docs/guidelines/quality.html' | relative_url }})의 4계층 프레임워크가 기준이다. 여기서는 수업 산출물 형식에 맞춰 시나리오를 구체화한다.

## 테스트 범위

| 단계 | 범위 | 도구 |
|---|---|---|
| 단위 | 도메인 순수 함수(청크 빌더·지표 계산·recall_at_k), 어댑터(MockTransport) | pytest, TDD Red→Green |
| 통합 | 실 DB 리포지토리(결정적 더미 벡터), API 계약, 색인→검색 왕복 | pytest + PostgreSQL |
| E2E | 지도 탐색·AI 분석 사용자 흐름, 스크린샷 회귀 | agent-browser, Vitest |
| 성능 | 구간 단위 TPS·지연, 검색 품질(Recall@5) | 평가 하네스, 부하 스크립트 |

## 개발 아키텍처

포트-어댑터 구조라서 외부 의존(공공 API·LLM·DB)을 Fake/Mock으로 대체해 UseCase를 단독 검증할 수 있다. 색인 UseCase 테스트에는 Fake EmbeddingPort·Fake 리포지토리로 증분/전량/위임/기록 4케이스를 실호출 없이 검증한 실례가 있다.

## 사전 준비사항

- Docker Compose로 PostgreSQL(+pgvector) 기동, Alembic `upgrade head`
- `.env` 공공 API 키 (키 없이도 단위 테스트는 전부 통과해야 함)
- Ollama 모델 상주 확인 (`gemma3`, `qwen3-embedding` Q4). E2E·성능 구간에서만 필요
- 평가셋 `data/eval/rag_evalset.jsonl` (candidate 50건 → 사용자 검수 후 confirmed 승격)

## 시나리오 개요

1. **지도 탐색**: 접속 → 코로플레스 로딩(427동) → 업종·지표·연도 전환 → 행정동 클릭 → fact 카드 확인
2. **AI 분석**: 상권×업종 지정 → SSE 진행 패널 → 리포트 생성 → 근거 출처 확인
3. **정책자금·계산기**: 공고 카드 목록(마감 임박순) → 원문 링크 → 손익분기 계산 입력·결과
4. **예외처리**: 외부 API Connection Fail, LLM 타임아웃, 잘못된 행정동 코드(404), SSE 중단 재시도

## 시나리오 상세

### 성능 — TPS 구현 방안 (구간 단위 테스트)

> 수업 질의 응답: "TPS 정확한 수치를 산정하느냐? 메타볼레의 TPS 수치를 측정할 수 있는 방법을 제공하느냐?" → **측정 방법을 시스템이 직접 제공하는 방식**으로 답한다.

- **구간 분리 측정**: ①지표 조회(`/metrics`, DB 사전 집계 — 고TPS 구간) ②RAG 검색(임베딩 1회+코사인 검색) ③에이전트 리포트(LLM 스트리밍 — 저TPS·장시간 구간)를 분리해 각각 산정한다. 단일 평균 TPS는 ③ 때문에 왜곡되므로 사용하지 않는다.
- **측정 제공**: FastAPI 미들웨어로 요청별 처리시간을 로그에 남긴다. 부하 스크립트(동시 접속 N 단계 증가)로 구간별 TPS·p95 지연을 산출하는 러너는 `scripts/`에 두어 검수자가 재실행해 수치를 재현할 수 있게 한다.
- **목표치**: ① 지도·지표 API p95 < 500ms ② 검색 왕복 < 2s ③ 리포트 첫 토큰 < 5s + Latency -40%(튜닝 전 대비). 실측 후 본 절에 수치를 기록한다.

### 검색 품질 — Recall@5

- 평가 하네스: `recall_at_k`·`mrr` 순수 함수와 provider별(ollama/fp16/gemini) 러너. 현재 기준선은 **Recall@5 0.900 / MRR 0.782**로, candidate 평가셋에서 얻은 참고치다.
- 목표 91.5%는 confirmed 평가셋 승격 후 Sprint 4 튜닝 구간에서 판정한다.

### 예외처리 시나리오

| 상황 | 기대 동작 |
|---|---|
| 공공 API 응답 실패/변조 | 수집 배치 해당 건 스킵 + 로그, 기존 적재분은 유지해 부분 실패가 전체를 막지 않음 |
| LLM 호출 실패 (429/타임아웃) | 백오프 재시도(0.5s→4s, 예산 30s), 최종 실패 시 SSE로 에러 이벤트 전송 |
| 미지원 행정동/업종 코드 | 404 + `{error:{code,message}}` 단일 형식 |
| 임베딩 서버 미기동 | 검색 기능만 비활성 안내, 지도·지표는 정상 동작 (기능 격리) |
