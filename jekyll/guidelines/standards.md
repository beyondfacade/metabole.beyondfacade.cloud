---
layout: default
title: 2) 개발 표준 및 산출물
permalink: /docs/guidelines/standards.html
parent: 3. 주요 개발 수행 지침
nav_order: 2
---

# 2) 개발 표준 및 산출물

## 코드 구조 표준

- **`if 업종` 분기 금지**: 업종별 분석 로직은 유형별 Strategy 클래스로 분리한다. 서브카테고리별 수요변수 매핑도 마찬가지로 `if 계열` 분기 없이 설정(VO) + Strategy로 처리한다.
- **설정과 로직의 분리**: 업종코드, 지배변수 세트, 데이터 소스 매핑은 설정으로 뺀다. 업종 추가가 설정 추가로 끝나야 한다.
- **코어/확장 지표 분리**: 전국 공통 데이터 기반 코어 지표와 서울 전용 확장 지표를 코드 레벨에서 분리한다.
- **Fractal 11-File Set**: 데이터 테이블 하나마다 표준 파일 세트 하나를 구성한다. 행정동×업종 지표 집계 테이블도 각각 하나의 세트다.
- **ERD 노드-엣지 규칙**: 테이블 관계 설계는 노드-엣지 규칙을 따른다. 데이터 소스가 확정되면 ERD 설계와 11-File Set 단위로 Bounded Context를 나눈다.

## 백엔드·프론트엔드 표준

- 백엔드는 FastAPI, 프론트엔드는 Flutter로 구현한다.
- 지도 데이터는 GeoJSON API로 주고받는다.
- API 인증키는 환경변수로 관리하고 저장소에 커밋하지 않는다.

## 산출물 목록

| 산출물 | 시기 | 담당 |
|---|---|---|
| 요구사항 정의서 | Sprint 1 | 김충식 |
| 업종코드-데이터소스 매핑표 (10종) | 1주차 | 신채연 |
| ERD 설계서 | Sprint 1~2 | 신채연 |
| 와이어프레임·화면 설계 | Sprint 1 | 이은상 |
| 데이터 수집 파이프라인 | Sprint 2 | 신채연 |
| Flutter UI 프로토타입 | Sprint 2 | 이은상 |
| Hybrid RAG 파이프라인 | Sprint 3 | 신채연 |
| 분석 에이전트 | Sprint 3~4 | 이은상 · 신채연 |
| Recall@5 평가셋 (질문-정답 쌍) | Sprint 3~4 | 전원 |
| 통합 테스트 시나리오 | Sprint 4 | 김충식 |
| 데모 배포 (metabole.beyondfacade.cloud) | Sprint 4 | 신채연 |
| 최종 문서·성능 지표 정리, 발표 자료 | Sprint 4 | 전원 |

산출물별 일정 배경은 [단계별 개발 일정]({{ '/docs/schedule/timeline.html' | relative_url }})의 스프린트 보드와 맞물린다.
