---
layout: default
title: 주제 구성
permalink: /docs/subtopics.html
nav_order: 3
---

# 주제 구성 — 사용자 문제와 기술의 연결

KDT 대주제 **“LLM(Large Language Model) : Finance 소비 분석 서비스”**와 초기 팀 과제명 **“상권 데이터 구조화 및 창업 분석 Hybrid RAG용 Agent 개발”**을 유지합니다. 현재 서비스 방향은 계약 전 창업 경고 확인입니다.

| 소주제 | 사용자 문제 | 현재 구현과 확인할 문서 |
|---|---|---|
| 1. 공공데이터 수집·연계 | 개업·폐업 기록이 흩어져 있음 | 인허가·상권분석 자료를 지역·업종 축으로 연결. [데이터 수집]({{ '/docs/requirements/data-collection.html' | relative_url }}) |
| 2. 창업 경고 판정 | 여러 수치 중 무엇부터 봐야 하는지 어려움 | 신호별 규칙·상대 백분위·표본 가드. [검증 결과와 원문 근거]({{ '/docs/evidence.html' | relative_url }}) |
| 3. 근거 설명과 검색 | 경고의 이유와 맥락을 읽기 어려움 | 정형 사실을 먼저 수집하고 뉴스 검색과 LLM 설명을 결합. [RAG]({{ '/docs/requirements/rag-pipeline.html' | relative_url }}) |
| 4. 경고 지도·리포트 | 후보 조합을 비교하고 싶음 | 최신 판정 지도와 6개 절 리포트. [서비스 흐름]({{ '/docs/requirements/service-platform.html' | relative_url }}) |
| 5. 지원·자금 준비 | 다음 행동과 비용을 정리해야 함 | `/support` 공고·상담 창구, `/plan` 결정론 계산·상담 준비 |

“AI가 판정한다”는 설명을 쓰지 않습니다. 현재 등급은 규칙 코드가 정하고 LLM은 근거를 설명합니다. 자금 계산도 코드가 수행합니다. 초기 설계의 변수 목록을 모두 구현한 기능처럼 나열하지 않습니다.
