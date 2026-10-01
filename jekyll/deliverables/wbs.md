---
layout: default
title: 5. 마일스톤&WBS
permalink: /docs/deliverables/wbs.html
nav_order: 5
has_children: true
---

# 5. 마일스톤&WBS

단계별 목표와 작업 상태를 스프린트 단위로 확인합니다. **카드의 완료는 해당 구현·기록 범위의 확인**을 뜻하며, 서비스 전체 테스트 통과나 운영 배포 완료를 뜻하지 않습니다.

## 단계별 개발 일정
{: #current-milestone }

{% include sprint-roadmap.html %}

## 상태를 읽는 방법

| 상태 | 의미 | 다음 단계로 옮기는 기준 |
|---|---|---|
| 예정 | 계획만 있고 착수 기록 없음 | 작업 착수와 근거 기록 |
| 진행 | 작업 중, 종료 조건 미충족 | 산출물과 검토 대상 제출 |
| 검토 | 결과는 있으나 추가 확인 필요 | 카드의 종료 조건 충족 확인 |
| 완료 | 카드 범위의 구현·기록 확인 | 새 이슈는 후속 작업으로 등록 |

이 보드는 **2026-10-01 기준 기록**입니다. 새 작업·상태는 근거 확인 후 갱신합니다. 현재 Sprint 4의 칸반은 펼쳐 두었으며 다른 스프린트도 ‘칸반 보기’로 열 수 있습니다. 개인별 담당은 추정하지 않고 [팀 역할]({{ '/docs/team.html' | relative_url }})의 팀장·풀스택 공동 개발 체계를 따릅니다.

## 스프린트 목표와 칸반

{% include sprint-boards.html %}

## WBS — 작업 분해 구조

칸반과 같은 작업을 산출물 기준으로 다시 읽습니다. 상태별 숫자는 작업 개수이며 프로젝트 완료율이 아닙니다.

<div class="table-wrapper">
<table>
<thead><tr><th scope="col">WBS</th><th scope="col">작업·산출물</th><th scope="col">상태</th><th scope="col">종료 조건</th></tr></thead>
<tbody>
{% for sprint in site.data.project_sprints.sprints %}
{% for task in sprint.tasks %}
{% assign state = site.data.project_sprints.states | where: 'id', task.status | first %}
<tr><td>{{ task.id }}</td><td><a href="{{ task.url | relative_url }}">{{ task.title | escape }}</a><br><small>{{ sprint.name | escape }} · {{ sprint.period | escape }}</small></td><td><span class="sprint-status sprint-status-{{ task.status }}">{{ state.label }}</span></td><td>{{ task.acceptance | escape }}</td></tr>
{% endfor %}
{% endfor %}
</tbody>
</table>
</div>

## 스프린트 운영과 검수

스프린트 시작 때 목표·종료 조건과 작업을 정하고, 작업 중에는 근거와 장애 요인을 갱신합니다. 종료 때는 산출물을 시연·검토하고 미완료 작업의 이월 사유를 남깁니다. 작업 수나 날짜 경과만으로 완료를 판단하지 않습니다.

- [단계별 개발 일정·과거 기록]({{ '/docs/schedule/timeline.html' | relative_url }}) · [Sprint 1 일자별 기록]({{ '/docs/schedule/sprint1.html' | relative_url }})
- 완료된 스프린트 상세: [Sprint 2 일자별 기록]({{ '/docs/schedule/sprint2.html' | relative_url }}) · [Sprint 3 일자별 기록]({{ '/docs/schedule/sprint3.html' | relative_url }})
- [검증 결과와 구현 근거]({{ '/docs/evidence.html' | relative_url }}) · [시나리오 테스트]({{ '/docs/deliverables/test-scenario.html' | relative_url }})
- [위험 관리 방안]({{ '/docs/schedule/risk.html' | relative_url }}) · [최종 검수]({{ '/docs/deliverables/final-inspection.html' | relative_url }})

## 서버 및 환경 구성

Jekyll 문서와 Next.js·FastAPI 서비스는 별도 프로젝트입니다. 로컬 서비스 화면은 2026-10-01 확인했으며 실제 서비스 주소는 [beyondfacade.cloud](https://beyondfacade.cloud)입니다. 공개 배포·부하·보안 검수는 후속 작업으로 구분합니다.

## 과거 계획 보관

아래 10/8 종료 일정과 당시 역할·상태는 9/28 기록입니다. 현재 마감과 상태는 위 로드맵·칸반을 기준으로 읽습니다.

<details markdown="1">
<summary>2026-09-28 당시 WBS 원문 — 과거 계획</summary>

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
| M4 AI 에이전트 코어 | 09.21 | LLM 게이트웨이·도구·에이전트 루프(09.16), 영속화·SSE 엔드포인트·프론트 실연동(09.21), 두뇌 혼합 채택(09.24) | ✅ 완료 |
| M4' 채팅 관문·무대·계획 | 09.24 | 서울 상권분석 약 1,000만 행 적재, 동네 유형·시간대 어긋남, intent·finance BC, `/plan` 조달·준비, RAG 평가셋 검수(Hit@5 1.000) | ✅ 완료 |
| M4'' 네거티브 리포트 전환 | 09.28 | 판정 카드 설계(공통 신호 5종·427동 상대평가), 음식 업종 8종 24구 적재(store 888,308행·지표 55,093행), verdict BC Task 1~6 구현 | 🔄 진행 |
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
   3.1 LLM 게이트웨이 (gemma4 로컬 · Gemini → 혼합 채택) ✅
   3.2 도구 레지스트리 10종 + 금융 계산기 ✅
   3.3 에이전트 루프 · SSE 스트리밍 · 영속화 ✅ (09.21)
   3.4 프론트 AI 탭 실 API 전환 · 예시 질문 칩 ✅
   3.5 데이터 보강 — 어린이집 3,940곳 · 편의점 조회 API · SGIS 지오코딩 · 지표 27,829건 재집계 ✅
   3.6 서울 상권 아틀라스 — 랜딩 · 지도 `/map` 분리 · main 병합 ✅ (09.23)
   3.7 서울 상권분석서비스 적재 — commerce · neighborhood BC 약 1,000만 행, 동네 유형 6종 · 시간대 어긋남 ✅ (09.23)
   3.8 채팅 관문(intent) · 유형 단계구분도 · 패널 서사 · 계획 `/plan`(finance) · 조달·상담 준비 ✅ (09.24)
   3.9 RAG 평가셋 200건 검수 — Hit@5 1.000 · MRR 0.95, 뉴스 같은 사건 접기 ✅ (09.25)
   3.10 네거티브 리포트 방향 전환 — HANDOFF §0 · 판정 대상 14종 · 판정 카드 설계서 · 13 Task 플랜 ✅ (09.28)
   3.11 음식 업종 8종 — 인허가 업태 분류기 · 24구 적재 66분 · 프론트 optgroup ✅ (09.28)
   3.12 verdict BC — 신호 5종 · 판정 규칙 · 배치 테이블 `region_industry_verdict` · API 3종 🔄 (Task 1~6 완료, Task 7 진행)
   3.13 판정 카드 · 업종별 위험도 지도 · 폐업 마커 (FE v0.29.x)
   3.14 모바일 지도 반응형 · 뉴스 수집 시 사건 클러스터링
4. 추가 요건 · 검증 (Sprint 4 전반, 10.01~)
   4.1 검색 성능 튜닝 (Recall@5 91.5% 목표) · 응답 속도 최적화
   4.2 시나리오 테스트 (단위→통합) · TPS 측정
5. DEMO 및 최종 검수 — 출품 (Sprint 4 후반, ~10.08)
   5.1 QA · 버그 수정 · 서비스 배포 (Vercel + Cloudflare 터널 — 대구 런북 재사용)
   5.2 설치 · 이전 매뉴얼 (Local → AWS)
   5.3 최종 문서화 · 발표 자료 · DEMO 시연
```

산출물별 담당은 [개발 표준 및 산출물]({{ '/docs/guidelines/standards.html' | relative_url }})의 산출물 목록을 기준으로 삼고 위험 요인은 [위험 관리 방안]({{ '/docs/schedule/risk.html' | relative_url }})에서 다룬다.

</details>
