---
layout: default
title: 6) 최종 검수
permalink: /docs/deliverables/final-inspection.html
parent: 6. 프로젝트 산출물
nav_order: 6
---

# 6) 최종 검수

Sprint 4(10.01~10.08) 검수 단계의 기준 문서다. 수업 지침상 시나리오 테스트 전/후 고객 환경에 구축/이전할지는 선택사항이다. 본 프로젝트는 **로컬 시연을 기본, AWS 이전을 가정 시나리오**로 준비한다.

## 개발환경 (HW / SW)

| 구분 | 내용 |
|---|---|
| HW | 로컬 GPU 서버 (NVIDIA CUDA, Ollama 모델 상주) / 이전 대상: AWS G 계열 인스턴스 |
| OS·런타임 | Linux, Docker Compose, Python 3.x (venv), Node 22 |
| SW Stack | FastAPI · PostgreSQL+pgvector · Ollama(gemma3, qwen3-embedding) · Next.js — 상세는 [상위 설계서]({{ '/docs/deliverables/high-level-design.html' | relative_url }}) |

## 개발내용 Flow

### 동작과정

수집 크론(일 1회) → 원천 적재(BC 11개) → 지표 집계 → RAG 색인 크론(05:50) → FastAPI 서빙(REST+SSE) → Next.js 웹. 전체 흐름도는 [상위 설계서 Data Flow]({{ '/docs/deliverables/high-level-design.html' | relative_url }})에 그려 두었다.

### 설치방법 (Source 이전 및 환경구성 방안)

로컬 기준 설치 절차:

1. 저장소 clone → `.env` 작성 (공공 API 키·Gemini 키 — 저장소에 커밋하지 않음)
2. `docker compose up -d` — PostgreSQL(+pgvector) 기동
3. `alembic upgrade head` — 스키마 마이그레이션 (ERD 21테이블, rag_chunk 포함)
4. Ollama 모델 pull (`gemma3`, `qwen3-embedding` Q4)
5. 수집 CLI 실행 또는 크론 등록 (`scripts/*.sh`) → 초기 적재
6. `python -m ... build_rag_index` — RAG 초기 색인
7. 백엔드 `uvicorn` 기동, 프론트 `next build && next start`

**Local → Amazon 이전 가정**:

| 구성요소 | 로컬 | AWS 이전 |
|---|---|---|
| DB | Docker PostgreSQL | RDS for PostgreSQL (pgvector 확장 활성화) 또는 EC2 컨테이너 유지 |
| LLM/임베딩 | 로컬 GPU + Ollama | G 계열 EC2에 Ollama 동일 구성, 또는 Gemini API로 두뇌 대체(임베딩 쿼리만 CPU 인스턴스) |
| 백엔드/크론 | 로컬 프로세스 + crontab | EC2 Docker 이미지 배포 + EventBridge/crontab |
| 프론트 | 로컬 Next.js | Vercel 또는 EC2 — `NEXT_PUBLIC_API_BASE` env 1개 변경으로 컷오버 |

이전할 때 데이터는 `pg_dump`/`pg_restore`로 이관한다. 벡터 컬럼을 포함한 전체가 표준 덤프로 이전되므로 재색인할 필요가 없다. 개발 ENV·OSS 라이브러리·Git·AI Model 의존은 requirements/lock 파일로 고정되어 있어 재현 가능하다.

### 예외처리

운영 중 예외(외부 API 실패·LLM 타임아웃·부분 적재 실패)를 처리할 때는 [시나리오 테스트의 예외처리 표]({{ '/docs/deliverables/test-scenario.html' | relative_url }})에 적힌 원칙을 검수 기준으로 삼는다.

### 사용자정의 설정방안

- `.env`: API 키, DB 접속, `GEMINI_API_KEY`, 프론트 `NEXT_PUBLIC_API_BASE`·`NEXT_PUBLIC_VWORLD_KEY`
- 색인 provider 선택: CLI `--provider {fp16|ollama|gemini}` — GPU 가용성에 따라 전환
- 업종 추가: 설정(업종코드·데이터소스 매핑)만 추가하면 확장된다. [개발 표준]({{ '/docs/guidelines/standards.html' | relative_url }})의 `if 업종` 분기 금지 원칙을 지킨다.

## 테스트 시나리오 / 시나리오 상세

[시나리오 테스트]({{ '/docs/deliverables/test-scenario.html' | relative_url }}) 산출물의 시나리오 1~4와 성능(TPS·Recall@5) 측정을 검수 항목으로 재사용한다. 완료 기준(Definition of Done)은 코드 리뷰 승인과 테스트 통과, 문서 반영을 모두 마치는 것이다.

## 유지보수 방안

- **데이터 신선도**: 수집·색인 크론이 무인으로 갱신하고 실패는 `logs/*.log`로 추적한다.
- **버전 관리**: 백엔드/프론트가 각각 `ver_log`에 버전 단위로 기록하므로 회귀가 생기면 원인 버전을 특정할 수 있다.
- **스키마 변경**: Alembic 마이그레이션으로만 수행하고 수기 DDL은 금지한다.
- **평가 회귀**: 릴리스 전에 Recall@5 하네스를 재실행해 검색 품질 회귀를 감지한다.
- **문서**: 본 사이트가 유지보수 기준 문서다. 구현 변경은 [개발 일지]({{ '/docs/devlog.html' | relative_url }})에 계속 기록한다.
