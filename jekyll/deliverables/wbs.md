---
layout: default
title: 1) Milestone & WBS
permalink: /docs/deliverables/wbs.html
parent: 6. 프로젝트 산출물
nav_order: 1
---

# 1) 프로젝트 개발 Milestone & WBS

[단계별 개발 일정]({{ '/docs/schedule/timeline.html' | relative_url }})의 스프린트 로드맵을 근거로, 전체 일정을 수업 산출물 형식(마일스톤 + 작업 분해 구조)에 맞춰 재구성했다.

## 프로젝트 진행을 위한 서버 및 환경 구성

| 구분 | 구성 | 상태 |
|---|---|---|
| 개발 서버 | 로컬 GPU 서버 (Ollama gemma3·qwen3 임베딩 상주) | ✅ 운영 중 |
| DB | PostgreSQL + pgvector (Docker Compose) | ✅ 운영 중 |
| 배치 | crontab — 수집 크론 일 1회 + RAG 색인 크론 05:50 | ✅ 운영 중 |
| 문서 사이트 | GitHub Pages (metabole.beyondfacade.cloud) | ✅ 운영 중 |
| 운영 이전 | AWS (G 인스턴스 쿼터 신청) — [최종 검수]({{ '/docs/deliverables/final-inspection.html' | relative_url }})의 이전 방안 참조 | 📋 예정 |

## Milestone

| 마일스톤 | 일자 | 내용 | 상태 |
|---|---|---|---|
| M1 타당성 검토·개발 착수 | 08.20 ~ 09.02 | 공공데이터 API 27종 실호출 검증, ERD 15테이블 설계, 아키텍처 확정 | ✅ 완료 |
| M2 데이터 계층 완성 | 09.07 | Bounded Context 11개, 점포 29.7만 행 공간조인, 지표 20,152건, 실 API 컷오버 | ✅ 완료 |
| M3 RAG 검색 계층 완성 | 09.15 | 색인 6,157건, Recall@5 평가 하네스 (기준선 0.900) | ✅ 완료 |
| M4 AI 에이전트 코어 | ~ 09.30 | LLM 게이트웨이·도구 7종·에이전트 루프 완료(09.16), 영속화·SSE 엔드포인트 진행 | 🔄 진행 |
| M5 통합·검수·출품 | 10.01 ~ 10.08 | 프론트-백 통합, 성능 튜닝, QA, 배포, DEMO | 📋 예정 |

## WBS (Work Breakdown Structure)

```
1. 타당성 검토 · 개발 착수 (Sprint 1, 08.20~09.02) ✅
   1.1 공공데이터 소스 조사 및 API 실호출 검증 (27종)
   1.2 요구사항 정의 · ERD 설계 (3계층 15테이블)
   1.3 개발 환경 구성 (Docker · GPU 서버 · 문서 사이트)
   1.4 웹 프론트 MVP 선행 구현 (지도 탐색 · AI 분석 2탭, mock 기반)
2. 산출물 작업 — 데이터 계층 (Sprint 2, 09.03~09.16) ✅
   2.1 수집 파이프라인 — 업종 10종 · 인구 · 정책자금 · 뉴스 · 임대료 · 금리
   2.2 특이변수 계층 (거리두기 · 기준금리 · 정책 이벤트)
   2.3 지표 집계 (행정동×업종×연도 20,152건) + 조회 API
   2.4 프론트 실 API 컷오버 (코로플레스 427 행정동)
   2.5 RAG 검색 계층 선행 — 임베딩 · 색인 · Recall@5 하네스
3. 산출물 작업 — AI 에이전트 (Sprint 3, 09.17~09.30) 🔄
   3.1 LLM 게이트웨이 (gemma3 로컬 · Gemini) ✅
   3.2 도구 레지스트리 7종 + 금융 계산기 ✅
   3.3 에이전트 루프 ✅ · SSE 스트리밍 · 영속화
   3.4 프론트 AI 탭 실 API 전환
   3.5 데이터 보강 — 어린이집 3,940곳 · 편의점 조회 API · 지표 21,005건 재집계 ✅
   3.6 서울 상권 아틀라스 — 랜딩 · 지도 `/map` 분리 · 화면 톤 통일 (브랜치 검증 완료)
4. 추가 요건 · 검증 (Sprint 4 전반, 10.01~)
   4.1 검색 성능 튜닝 (Recall@5 91.5% 목표) · 응답 속도 최적화
   4.2 시나리오 테스트 (단위→통합) · TPS 측정
5. DEMO 및 최종 검수 — 출품 (Sprint 4 후반, ~10.08)
   5.1 QA · 버그 수정 · 서비스 배포
   5.2 설치 · 이전 매뉴얼 (Local → AWS)
   5.3 최종 문서화 · 발표 자료 · DEMO 시연
```

산출물별 담당은 [개발 표준 및 산출물]({{ '/docs/guidelines/standards.html' | relative_url }})의 산출물 목록을 기준으로 삼고 위험 요인은 [위험 관리 방안]({{ '/docs/schedule/risk.html' | relative_url }})에서 다룬다.
