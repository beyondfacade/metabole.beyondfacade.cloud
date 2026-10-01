---
layout: default
title: 검증 결과와 구현 근거
permalink: /docs/evidence.html
nav_order: 4.5
---

# 검증 결과와 구현 근거

이 페이지는 **무엇을 구현했는지**, **어떤 조건에서 측정했는지**, **아직 무엇을 확인하지 못했는지**를 나눠 설명합니다. 수치에는 모집단·시점·원문을 붙입니다.

## 문서 기준
{: #baseline }

2026-10-01 확인: 구현 저장소 `feat/warning-copy` / `750b4e5a67aeba6ef27915d7213f3627f34b889c`. 백엔드 버전 로그는 v0.63.0, 프론트는 v0.52.1까지입니다. 현재 브랜치의 코드이며 main 병합·운영 배포 완료를 뜻하지 않습니다. 링크는 이 커밋에 고정되어 있고 저장소 접근 권한이 필요할 수 있습니다.

`docs/STATUS.md`는 9/24 실측 기록에 이후 일부 내용을 갱신한 기록이 섞여 있습니다. `HANDOFF.md` §0도 제안과 후속 결정이 함께 있으므로 현재 기능은 실제 코드와 최신 버전 기록을 대조했습니다.

## 창업 경고 백테스트
{: #backtest }

**질문:** 과거 시점에 경고를 낸 동×업종에서 이후 새로 개업한 점포가 더 많이 폐업했는가?

| 조건 | 정의 |
|---|---|
| 실험 기록일 | 2026-09-29 |
| 판정 기준 T | 2022-06-30 |
| 입력 시점 제한 | T 시점 집계, 직전 분기 2022Q1, 점포수 2021년 말 |
| 진입 코호트 | `[T, T+365일)`에 개업한 점포. 코드상 T 당일 포함, 종료일 제외 |
| 후속 관찰 | 개업 후 1,095일 이내 폐업. 폐업일이 개업일보다 이르면 폐업 집계에서 제외 |
| 분류 단위 | 동×업종. 결과의 폐업률 분모는 해당 분류에 진입한 점포 수 |
| 비교값 | 비추천 집단 폐업률 ÷ 경고 없음 집단 폐업률(lift) |

카페는 비추천 **1,142곳 중 76.8%**, 경고 없음 **1,680곳 중 38.2%**가 3년 이내 폐업했습니다. 비율은 **2.01배**입니다. 현재 신규 창업자의 폐업 확률·예측 정확도·인과 효과가 아닙니다.

### 업종별 결과

| 업종 | 🔴 폐업률 (개업) | 🟠 폐업률 (개업) | ⚪ 폐업률 (개업) | 보류 (개업) | lift 🔴/⚪ |
|---|---:|---:|---:|---:|---:|
| 당구장 | 33.3% (3) | 7.5% (40) | 20.0% (5) | 7.4% (27) | 1.67× |
| 카페 | 76.8% (1,142) | 43.1% (3,268) | 38.2% (1,680) | 14.3% (7) | 2.01× |
| 중식 | 41.2% (34) | 41.2% (342) | 50.7% (75) | 36.2% (174) | 0.81× |
| 헬스장 | 0.0% (6) | 12.6% (183) | 18.2% (11) | 5.7% (246) | — |
| 미용실 | 34.9% (367) | 27.5% (2,052) | 24.7% (1,025) | 35.7% (14) | 1.41× |
| 일식 | 25.0% (12) | 32.9% (675) | 35.3% (184) | 39.4% (142) | 0.71× |
| 노래방 | 0.0% (2) | 7.4% (54) | 11.8% (17) | 13.3% (15) | — |
| 한식 | 48.4% (351) | 41.0% (3,760) | 41.7% (1,030) | 28.6% (7) | 1.16× |
| PC방 | 37.5% (8) | 45.9% (85) | 41.7% (24) | 25.0% (20) | 0.90× |
| 호프·주점 | 31.2% (16) | 34.8% (564) | 36.2% (265) | 35.0% (40) | 0.86× |
| 분식 | 33.3% (3) | 47.4% (312) | 44.0% (207) | 44.2% (43) | 0.76× |
| 양식 | 43.8% (16) | 36.5% (1,125) | 39.7% (232) | 39.2% (209) | 1.10× |

전체 합산은 비추천 1,960곳·폐업 1,209곳(61.7%), 경고 없음 4,755곳·폐업 1,721곳(36.2%), lift 1.70배입니다. 전체 값에는 업종 구성 효과가 섞이므로 업종별 표를 먼저 읽습니다. 미용실은 1.41배지만 한식은 1.16배, 중식 0.81배·일식 0.71배처럼 반대 방향도 있습니다. 작은 표본의 비율은 크게 흔들립니다.

### 해석 한계

- 한 기준 시점의 후향적 비교입니다. 미래·다른 지역·다른 업종으로 일반화하려면 추가 검증이 필요합니다.
- 당시 자료로 재구성한 집계이며 과거 실제 이용자가 받은 판정을 추적한 실험은 아닙니다. 과거 공표 시차까지 완전히 재현했다는 보장은 없습니다.
- 업종별 기저 폐업률·양도양수·신고 누락·계절성·겹친 정책 등의 영향을 통제한 인과 추정이 아닙니다.
- 표본 가드를 통과한 집단에서도 작은 표본이나 편향이 남습니다. 보류 집단을 안전한 비교군으로 읽지 않습니다.
- 같은 기록을 보며 규칙을 조정했으므로 독립된 추가 시점·표본의 검증이 필요합니다. 신뢰구간·교정된 개인별 확률은 이 기록에 없습니다.

### 판정 제외 업종 재심사

편의점(담배소매인 이력) 경고 lift는 **1.00배**, 부동산중개업(상권분석 집계)은 **1.04배**로 기준 1.10배에 미달했습니다. 여기서 경고는 red+orange이며 위 표의 red/clear 비율과 다릅니다. 편의점은 양쪽 집단의 개업 점포가 각 50곳 이상, 집계 원천은 양쪽 집단의 동이 각 30곳 이상이어야 한다는 표본 기준도 사용합니다.

부동산 결과는 개별 진입 코호트가 아니라 기준 분기 점포수 대비 이후 12분기 폐업 집계입니다. 편의점 승계 접기는 기준일 뒤 최대 90일을 참조할 수 있다는 편향이 원문에 기록되어 있습니다. 두 업종을 현재 판정 대상에 넣지 않습니다.

원문: [백테스트 기록](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/docs/verdict-backtest.md) · [진입·폐업 집계 코드](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/backend/apps/verdict/adapter/outbound/gateways/entrant_outcome_gateway.py) · [집계·재포함 기준](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/backend/apps/verdict/domain/services/backtest.py)

## 현재 판정 규칙과 제공 범위
{: #rules }

| 구분 | 현재 구현 |
|---|---|
| 지역 | 서울 427개 행정동 |
| 마스터 시드 | 18종 — 수집·분류 목록 |
| UI 선택 | 14종 — 음식 6·생활 4·여가 4 |
| 판정 대상 | 12종 — UI 선택 중 편의점·부동산중개업 제외 |
| 판정 신호 | 순유출·생존 절벽·조기 폐업·포화 |
| 참고 신호 | 상권 축소. 업종 특화 담배권 빈자리·사무소당 거래도 등급 합산 제외 |
| 상대평가 | 같은 업종의 평가 가능한 값에 대해 strict 백분위. 75 이상 켜짐, 90 이상 강함 |
| 가드 | 점포·코호트·폐업 표본 10, 포화 상주인구 1,000 |
| 보류 우선 | 평가 가능한 판정 신호 2개 미만이면 insufficient |
| 등급 | 이후 strong 2개 이상 red → on/strong 1개 이상 orange → clear |

**clear는 평가 가능한 판정 신호 중 켜진 것이 없다는 뜻입니다. 성공·안전·추천을 보장하지 않습니다.** LLM은 이 등급을 정하지 않습니다. HANDOFF의 ML 위험모델 제안과 현재 규칙 코드를 구분합니다.

근거: [마스터 시드](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/backend/apps/master/adapter/inbound/cli/seed_master.py) · [UI 업종](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/frontend/src/shared/industries.ts) · [판정 범위·라벨](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/frontend/src/shared/verdict.ts) · [등급 규칙](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/backend/apps/verdict/domain/services/rules.py) · [가드·백분위](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/backend/apps/verdict/domain/services/thresholds.py) · [대안 순위](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/backend/apps/verdict/domain/services/alternatives.py)

## RAG 검색 평가는 별도다
{: #retrieval }

**질문:** 공고·뉴스 질문에 관련 문서가 검색되는가? 창업 경고의 통계적 판별력이나 리포트 문장 정확도를 재는 검사가 아닙니다.

| 기록 | 평가 표본 | Hit@5 | MRR |
|---|---|---:|---:|
| fp16 · 2026-09-25 00:04:14 파일 | confirmed 180건 | 1.000 | 0.9502 |
| Ollama · 2026-09-25 00:04:35 파일 | confirmed 180건 | 1.000 | 0.9463 |

총 200행의 상태를 직접 집계하면 confirmed 180·rejected 20입니다. 결과 JSON의 `candidate_count: 20` 필드는 rejected까지 묶은 이름이어서 행별 상태를 기준으로 설명했습니다. 결과는 해당 검수 질문집과 당시 색인에 한정됩니다. 새로운 질문이나 운영 성능을 보장하지 않습니다.

- **Hit@5**: 상위 5개에 정답 문서가 하나 이상 있는 질문의 비율.
- **Recall@5**: 질문의 전체 정답 문서 중 상위 5개로 회수한 비율. 정답 하나일 때 Hit@5와 같지만 다중 정답에서는 다릅니다.
- **MRR**: 첫 정답 순위의 역수를 질문별로 평균한 값.

초기 **Recall@5 91.5%**, **지연 40% 개선**은 목표였습니다. Hit@5 1.000을 그대로 초기 목표 달성률이라고 쓰지 않습니다. 지연 40%를 동일 조건으로 입증한 최신 실험 결과도 이번 조사에서 확인하지 않았습니다.

현재 검색은 pgvector 코사인 검색·정형 필터·뉴스 사건 접기입니다. 초기 과제명 Hybrid RAG에 담긴 키워드 점수 결합은 현행 검색 코드에서 확인되지 않았습니다.

원문: [fp16 결과 JSON](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/data/eval/results/rag_fp16_20260925_000414.json) · [Ollama 결과 JSON](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/data/eval/results/rag_ollama_20260925_000435.json) · [검색 저장소](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/backend/apps/rag/adapter/outbound/repositories/rag_repository.py) · [검색·후처리](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/backend/apps/rag/app/use_cases/rag_interactor.py)

## 구현을 확인한 원문
{: #sources }

| 주제 | 근거 | 읽을 때 주의할 점 |
|---|---|---|
| 방향 전환 | [HANDOFF §0](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/docs/HANDOFF.md) | 제안·과거 실행 순서와 후속 결정을 함께 읽음 |
| 현재 문구 | [10/1 설계서](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/docs/superpowers/specs/2026-10-01-warning-copy-design.md) | 실제 화면·제외 상태 조건과 대조 |
| 상태 | [STATUS](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/docs/STATUS.md) | 9/24 기준과 후속 부분 갱신이 혼재 |
| 백엔드 변경 | [BE 버전 로그](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/backend/docs/backend_ver_log.md) | v0.63.0까지, 측정은 해당 날짜의 기록 |
| 프론트 변경 | [FE 버전 로그](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/frontend/docs/frontend_ver_log.md) | v0.52.1까지, 배포 보장 아님 |
| 리포트 | [사실 수집기](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/backend/apps/agent/app/use_cases/report_facts.py) | 13키·조회 실패 격리 |
| 지원 화면 | [SupportPage](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/frontend/src/features/support/components/support-page.tsx) | 동·업종이 있어야 계획 CTA |
| 자금 계획 | [PlanPage](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/frontend/src/features/plan/components/plan-page.tsx) | 화면 상태·재계산·상담 준비 조건 |
| 자금 산식 | [finance 엔진](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/backend/apps/finance/domain/services/engine.py) | 실제 승인·매출 예측 아님 |
| 일지 동기화 | [동기화 스크립트](https://github.com/beyondfacade/cloud.beyondfacade/blob/750b4e5a67aeba6ef27915d7213f3627f34b889c/scripts/jekyll-devlog.sh) | 원본을 복사하므로 일지 복사본만 고치지 않음 |

## 팀이 확인한 사항과 검증 범위
{: #open-items }

2026-10-01 사용자 확인: 프로젝트는 **10월 23일까지 마무리**, **10월 27일 최종 발표**입니다. 김충식은 팀장, 신채연·이은상은 영역을 나누지 않고 함께 개발한 풀스택 개발자입니다. 세부 역할은 [팀 소개]({{ '/docs/team.html' | relative_url }})에 정리했습니다. 실제 서비스 주소는 [beyondfacade.cloud](https://beyondfacade.cloud)입니다. 주소 확인과 배포 환경의 동작 검증은 구분합니다.

점포·뉴스의 현재 행 수, 실제 DB 테이블 수, 운영 크론·외부 배포 상태는 이번 문서 작업에서 다시 측정하지 않았습니다. 코드의 테이블 목록과 날짜가 있는 실측 기록을 구분합니다. 앱 전체 테스트·부하시험·판정 백테스트·RAG 검색 평가를 이번에 재실행한 것은 아닙니다.

[서비스 흐름]({{ '/docs/requirements/service-platform.html' | relative_url }}) · [설계 선택과 트러블슈팅]({{ '/docs/deliverables/detailed-design.html' | relative_url }}) · [최종 검수]({{ '/docs/deliverables/final-inspection.html' | relative_url }})
