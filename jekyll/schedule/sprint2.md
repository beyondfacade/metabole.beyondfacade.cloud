---
layout: default
title: Sprint 2 일자별 진행 사항
permalink: /docs/schedule/sprint2.html
parent: 단계별 개발 일정
grand_parent: 5. 마일스톤&WBS
nav_order: 2
---

# Sprint 2 일자별 진행 사항 (09.03 ~ 09.16)

**상태: 완료** · **Sprint Goal: 데이터 수집·집계와 실 API 연동을 완성하고 RAG 검색 기반을 마련한다.**

팀에서 확인한 완료 상태를 반영했습니다. 아래는 개발일지에 기록된 날짜별 작업을 정리한 내용입니다. 기록이 없는 날짜의 업무·담당·회의는 추정하지 않았습니다. 수치와 버전은 당시 기준이며, 최신 제공 범위는 [프로젝트 개요]({{ '/docs/overview.html' | relative_url }})에서 확인합니다.

## 일자별 업무 진행 사항

담당은 [현재 팀 역할]({{ '/docs/team.html' | relative_url }})을 기준으로 개발 업무는 **신채연·이은상 공동**, 방향 결정·산출물 정리는 **전원(김충식·신채연·이은상)**으로 표시했습니다. 상태는 각 행에 적힌 업무 범위의 완료 여부입니다. 날짜를 누르면 해당 개발일지 원문을 볼 수 있습니다.

| 날짜 | 요일 | 업무 내용 | 담당 | 상태 |
|------|:----:|-----------|------|:----:|
| [09.07]({{ '/docs/devlog.html#2026-09-07' | relative_url }}) | 월 | **데이터·조회 API** — 서울 427개 행정동 경계, 지표·점포·지역 요약 API 구성. 첫 지표 집계 20,152건. 인구·학원·부동산중개·정책자금·특이변수·임대료·금리·편의점 원천 수집 확장 | 신채연 · 이은상 | ✅ 완료 |
| [09.07]({{ '/docs/devlog.html#2026-09-07' | relative_url }}) | 월 | **화면 연동** — 지도 mock 경계를 실제 행정동 경계로 교체하고 지표·요약·점포 조회를 실 API로 연결. 단계구분도 범례와 오류 처리를 보강. 당시 AI 분석 탭은 mock 유지 | 신채연 · 이은상 | ✅ 완료 |
| [09.07]({{ '/docs/devlog.html#2026-09-07' | relative_url }}) | 월 | **검색·에이전트 설계** — RAG 검색 계층 → 에이전트 → 프론트 SSE → 모델 비교의 14개 작업 계획 수립 | 신채연 · 이은상 | ✅ 완료 |
| [09.15]({{ '/docs/devlog.html#2026-09-15' | relative_url }}) | 화 | **RAG 검색** — `rag_chunk`·임베딩 어댑터·청크 빌더·코사인 검색·색인 CLI·평가 하네스 구현. 초기 색인 6,157건. candidate 평가셋 시운전 기록 확보 | 신채연 · 이은상 | ✅ 완료 |
| [09.15]({{ '/docs/devlog.html#2026-09-15' | relative_url }}) | 화 | **통합·문서** — 프론트 v0.12.0 main 병합 및 실 API 연동 확인. 어린이집 API 개발계정 승인·스키마 확인, 프로젝트 산출물 구조 정리 | 전원 | ✅ 완료 |
| [09.16]({{ '/docs/devlog.html#2026-09-16' | relative_url }}) | 수 | **에이전트 선행 구현** — LLM 게이트웨이·Ollama/Gemini 어댑터, 도구 7종·금융 계산기, 에이전트 루프·SSE 이벤트 계약 구현. 영속화·실제 SSE 엔드포인트는 Sprint 3로 연결 | 신채연 · 이은상 | ✅ 완료 |

## 완료 산출물

| 산출물 | 완료한 범위 | 관련 문서 |
|---|---|---|
| 데이터 수집·매핑 | 원천별 수집과 지역·업종 연결, 현황과 이력의 구분 | [상권 공공데이터 수집 및 연계]({{ '/docs/requirements/data-collection.html' | relative_url }}) |
| 지표·지도 연동 | 사전 집계·조회 API와 실제 지도 연결 | [상위 설계서]({{ '/docs/deliverables/high-level-design.html' | relative_url }}) |
| 검색 계층 | 청크·임베딩·벡터 검색·색인·평가 실행 구조 | [RAG 파이프라인]({{ '/docs/requirements/rag-pipeline.html' | relative_url }}) |
| 에이전트 기반 | 모델 어댑터·도구 레지스트리·루프·이벤트 계약 선행 구현 | [상세 설계서]({{ '/docs/deliverables/detailed-design.html' | relative_url }}) |

## 검증 기록과 해석

9/15 검색 시운전은 **candidate 50건 기준 Recall@5 0.900, MRR 0.782** 기록입니다. 사람 검수를 마친 평가셋의 최종 성능으로 읽지 않습니다. 이후 Sprint 3에서 평가셋 검수와 전량 재색인을 진행했습니다. 현재 검색 평가의 조건과 결과는 [검증 결과와 구현 근거]({{ '/docs/evidence.html' | relative_url }})에 정리되어 있습니다.

9/7 지도 실 API 연동·프론트 테스트, 9/16 에이전트 어댑터·루프 테스트 기록도 원문에서 확인할 수 있습니다. 이는 해당 날짜의 실행 기록입니다.

## Sprint 3로 연결한 항목

| Sprint 2 종료 시 남은 작업 | 후속 기록 |
|---|---|
| 어린이집 운영계정의 실데이터 수집 | 9/17 수집·조회·지도 연결 |
| 에이전트 영속화·SSE API와 분석 화면 연결 | 9/21 실 SSE 연동 |
| 모델 비교, SGIS 지오코딩, fp16 전량 재색인 | 9/22 평가·데이터 보강 |
| 검색 평가셋 검수 | 9/24~25 평가셋 검수와 결과 정리 |

위 작업의 진행 과정은 [Sprint 3 일자별 진행 사항]({{ '/docs/schedule/sprint3.html' | relative_url }})에서 이어집니다. 과거 문서에 적힌 10/8 마감은 당시 계획이며, 현재 확정 일정은 10/23 마무리·10/27 발표입니다.

---

[← Sprint 1]({{ '/docs/schedule/sprint1.html' | relative_url }}) · [단계별 개발 일정]({{ '/docs/schedule/timeline.html' | relative_url }}) · [Sprint 3 →]({{ '/docs/schedule/sprint3.html' | relative_url }})
