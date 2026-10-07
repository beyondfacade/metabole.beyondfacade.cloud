---
layout: default
title: 7. 상위 설계서
permalink: /docs/deliverables/high-level-design.html
nav_order: 7
has_children: true
---

# 7. 상위 설계서

## 개발개요

경고 등급을 계산하는 부분과 그 근거를 설명하는 부분을 분리합니다. 사용자에게는 지도에서 판정과 이유를 먼저 보여주고 리포트·지원·자금 준비로 이어집니다.

## Data Flow (아키텍처링)

데이터가 어디서 들어와(1) 어떻게 가공되고(2) 어느 API로(3) 어느 화면이 되며(4) 무엇을 남기는지(5)를 한 장으로 정리했습니다. 그림을 누르면 원본 크기로 볼 수 있습니다.

[![주요기능 Mapping Flow — 수집·가공·조회 API·사용자 화면·기록 운영 5단계와 요청 시점 외부 AI 호출]({{ '/assets/images/dataflow.png' | relative_url }})]({{ '/assets/images/dataflow.png' | relative_url }})

| 단계 | 이름 | 무엇을 하나 | 언제 | 대표 산출물 |
|---|---|---|---|---|
| **1단계** | 수집 | 공공데이터·뉴스·지원사업·지역 사건을 원천 테이블에 적재 | 밤 크론(매시·매일·매주) + 일회성 적재 | `store`, `funding_program`, `news_article`, 상권·동네 분기 테이블 |
| **2단계** | 가공 | 원천을 동×업종 지표·동네 프로필·시간대 공백·**판정**·RAG 벡터로 만듦 | 크론 안에서 수집 직후 | `region_industry_metric`, `region_profile_quarter`, `region_industry_verdict`, `rag_chunk` |
| **3단계** | 조회 API | 가공 결과를 요청 시점에 읽기만 함 | 사용자 요청마다 | `/verdicts`, `/regions/{code}/summary`, `/profiles/{code}`, `/stores`, `/finance/*`, `/funding/*` |
| **4단계** | 사용자 화면 | 관문 → 지도 → 리포트 → 지원사업 → 자금 계획 | 사용자 클릭 | `/`, `/map`, `/analysis`, `/support`, `/plan` |
| **5단계** | 기록·운영 | 리포트·LLM 사용량·보안 이벤트를 남기고 관리자 화면이 읽음 | 요청마다 + 매분 | `analysis_report`, `llm_usage`, `llm_call_event`, `access_event`, `host_metric_sample` |

핵심은 **무거운 계산을 2단계(밤)에 끝내고 3단계는 읽기만 한다**는 점입니다. 요청 시점에 외부를 부르는 곳은 관문(`/intent`)의 Gemini 폴백과 리포트(`/analysis`)의 해석 LLM(gemini-3.8-flash → claude-opus-5-5 → gemma4:12b)·네이버 뉴스(등록 안 된 사건 질문일 때)뿐입니다. 뉴스는 이용조건에 따라 21일만 보관하고 원문 링크로만 보여 주며, RAG 색인(`rag_chunk`)에는 지원사업 공고만 넣습니다. 판정 순서는 `store` 수집 → `build_metrics` → `build_verdicts`이며, 판정은 동네 프로필 빌더 결과도 읽습니다. 여러 시점 백테스트에서 안정 신호가 없던 7개 업종은 비추천 없이 최대 조건부로 판정합니다.

### 데이터 × 기능 매트릭스

[![데이터 × 기능 매트릭스 — 데이터 18종이 관문 진단·지도·판정 카드·대안·동네 프로필·점포 지도·AI 리포트·지원사업·자금 계획 중 어디에 쓰이는지]({{ '/assets/images/dataflow-matrix.png' | relative_url }})]({{ '/assets/images/dataflow-matrix.png' | relative_url }})

● = 요청 시점에 직접 읽음, ○ = 2단계 가공을 거쳐 간접으로 쓰임. **판정(`region_industry_verdict`) 한 테이블이 지도 색칠·판정 카드·대안·AI 리포트 네 기능을 받치므로** 판정 빌더가 틀리면 네 화면이 함께 틀립니다. AI 리포트는 거의 모든 데이터를 읽어, 데이터 하나가 낡으면 리포트 문장이 먼저 틀립니다.

> 그림과 표는 2026-10-07 기준(백엔드 v0.88.0) 코드·실DB 실측입니다. 출처: 개발 저장소 `docs/plan/dataflow.md`

### AI Model 학습/추론 및 Module 별 AI 연동 체계

현재 판정은 학습 모델이 아니라 규칙입니다. `rag`는 임베딩·코사인 검색을, `agent`는 사실을 전달받아 설명을 만드는 LLM 호출을 담당합니다. 색인과 질문의 임베딩 포트를 구분하며 모델별 검색 결과는 별도 실험으로 비교했습니다. 학습된 폐업 확률 모델은 현재 구현으로 제시하지 않습니다.

## 개발환경

로컬 개발 환경에서는 Next.js·FastAPI와 PostgreSQL·pgvector를 사용하며 임베딩·LLM의 외부 의존이 있습니다. 문서 사이트는 Jekyll입니다. 실제 서비스 주소는 [beyondfacade.cloud](https://beyondfacade.cloud)이며 최종 운영 설정은 별도 검수 대상입니다.

## 주요 기술요소 (SW Stack / Infra Stack)

| 영역 | 구성 | 선택의 이유 |
|---|---|---|
| 백엔드 | FastAPI, SQLAlchemy, Alembic | API 계약과 스키마 변경 관리 |
| 판정 | Specification·규칙 목록·업종 원천 Strategy | 신호 근거와 데이터 차이를 명시적으로 관리 |
| DB·검색 | PostgreSQL, pgvector | 정형 지표와 근거 문서 검색 연결 |
| 리포트 | LLM 게이트웨이·사실 수집·SSE | 실패 격리와 사실/설명 책임 분리 |
| 프론트 | Next.js·React·TypeScript·TanStack Query·MapLibre | 조건 전달·지도·비동기 상태 표시 |
| 검증 | pytest·Vitest·검색 평가·판정 백테스트 | 코드 동작과 통계 검증의 분리 |

## 요구사항 별 기술요소

### 요구사항 #1 — 창업 경고와 근거

`GET /regions/geojson`과 `GET /verdicts?industry=`를 읽어 지도를 그리고 선택 동의 단건 판정·대안·요약을 각각 조회합니다. 최신 판정은 `region_industry_verdict`에 저장됩니다.

### 요구사항 #2 — 설명 리포트

LLM을 부르기 전에 코드가 사실 15개를 6개 스레드로 모읍니다. 항목 실패를 격리하고, 6개 절의 사실은 코드가 쓰며 LLM은 도구 없이 해석 한 단락만 씁니다(SSE). 자세한 구현은 [상세 설계서]({{ '/docs/deliverables/detailed-design.html' | relative_url }})에 있습니다.

### 요구사항 #3 — 지원·자금 계획

지원 후보 선정은 지역·업종 규칙으로 수행하고 자금 계획은 `finance` 엔진으로 계산합니다. 참고 금리·평균 매출을 개별 사용자 확정값으로 해석하지 않습니다.

## 시나리오 테스트

[시나리오 테스트]({{ '/docs/deliverables/test-scenario.html' | relative_url }})에서 보류·제외·빈 대안·부분 실패·입력 변경을 확인합니다. [검증 결과와 원문 근거]({{ '/docs/evidence.html' | relative_url }})에서 실험 기록과 목표를 분리합니다.
