---
layout: default
title: 개발 표준 및 산출물
permalink: /docs/guidelines/standards.html
parent: 10. 최종 검수
nav_order: 1
---

# 개발 표준 및 산출물

## 코드 구조 표준

백엔드는 BC별 도메인·유스케이스·포트·어댑터를 분리하고 프론트는 기능별 `features`와 공통 `shared`를 사용합니다. 판정 신호의 근거와 표본 가드는 신호 구현에, 공통 임계값은 `VerdictThresholds`에 둡니다. 상태 없는 finance·intent 모듈도 있어 모든 모듈을 테이블 개수와 일대일로 세지 않습니다.

업종별 원천 차이는 Strategy로 분리하지만 업종 추가가 언제나 설정만으로 끝나지는 않습니다. 원천·분류·UI·표본·검증을 함께 확인해야 합니다.

## 백엔드·프론트엔드 표준

API 코드는 계약값을 유지하고 화면은 한국어 라벨을 사용합니다. 지도·리포트가 업종 및 판정 어휘를 공유합니다. 요약·판정·공고 조회의 오류는 각각 표시하고 비밀값은 문서와 저장소에 넣지 않습니다.

## 산출물 목록

| 산출물 | 목적 | 현재 연결 |
|---|---|---|
| Milestone & WBS | 완료·진행·검수 과제 구분 | [WBS]({{ '/docs/deliverables/wbs.html' | relative_url }}) |
| 요구사항 정의서 | 사용자 문제와 예외 조건 | [요구사항]({{ '/docs/deliverables/requirements-spec.html' | relative_url }}) |
| 상위·상세 설계서 | 데이터 흐름·책임·설계 이유 | [설계서]({{ '/docs/deliverables/high-level-design.html' | relative_url }}) |
| ERD | 원천·판정·계정·운영의 관계 | [데이터 모델]({{ '/docs/erd.html' | relative_url }}) |
| 평가 기록 | 판정과 검색 성능의 별도 검증 | [검증 결과와 원문 근거]({{ '/docs/evidence.html' | relative_url }}) |
| 테스트·검수·시연 | 예외 동작·운영 확인·발표 경로 | [산출물]({{ '/docs/deliverables.html' | relative_url }}) |

담당자는 [조직 구성]({{ '/docs/schedule/organization.html' | relative_url }})을 따릅니다. 김충식이 팀장을 맡고 신채연·이은상은 풀스택으로 공동 개발합니다. 기능별 개인 기여는 해당 작업 기록으로 확인합니다.
