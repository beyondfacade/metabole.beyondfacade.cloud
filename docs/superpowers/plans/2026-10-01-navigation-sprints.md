# 사이드바·스프린트 문서 재편 Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** 요청한 14개 메뉴와 근거가 있는 스프린트 칸반으로 문서를 정돈한다.
**Architecture:** 기존 permalink 유지, front matter로 문서 재배치, YAML 데이터와 Liquid로 일정 중복을 제거한다.
**Tech Stack:** Jekyll, Just the Docs, Liquid, YAML, SCSS, Python 표준 라이브러리.
**Spec:** `docs/superpowers/specs/2026-10-01-navigation-sprints-design.md`

## Global Constraints

- 최상위 1~14 순서·이름은 설계 표를 따른다. 모든 기존 permalink는 유지한다.
- 10/23 프로젝트 마무리·10/27 발표, 상태 기준일 2026-10-01.
- `jekyll.md` 자동 생성 원본은 수정하지 않는다.
- 기록 확인·검수 대기·예정의 차이를 보존한다. 완료율·개인 담당을 추측하지 않는다.
- 현재 작업 공간에서 수정하고 커밋·배포 전 단계의 검토 가능한 변경으로 남긴다.

## Review Focus

- 자동 생성 개발일지의 순서·표시 이름이 다음 갱신에도 유지되는가.
- 숨긴 인덱스 때문에 하위 문서가 사라지거나 기존 링크가 깨지지 않는가.
- ERD·검증 근거의 부모 탐색과 검색이 동작하는가.
- 모바일·인쇄에서 칸반 카드가 잘리지 않는가.
- 미래 계획이나 저장된 실험 기록을 서비스 완료로 오해하게 하지 않는가.

## Task 1: 탐색 위계와 문서 통합

**Files:** `index.markdown`, `_config.yml`, `_includes/components/nav/links.html`, `jekyll/**/*.md`, `jekyll/showcase/screens.html`, `scripts/check-navigation.py`.
**Interfaces:** 기존 URL을 소비하고 최상위 14개와 관련 parent/grand_parent를 생성한다.

- [x] 생성 HTML에서 최상위 순서·ERD/근거 부모를 검사하고 변경 전 실패를 확인한다.
- [x] front matter 재배치, 개요·주제 통합, 과거 인덱스의 새 위치 안내, 목차 갱신.
- [x] 개발일지는 defaults의 nav_title을 탐색 템플릿에서 표시한다.
- [x] Jekyll 빌드와 탐색·기존 링크·검색 검사 통과.

## Task 2: 스프린트와 WBS

**Files:** `_data/project_sprints.yml`, `_includes/sprint-roadmap.html`, `_includes/sprint-boards.html`, `_sass/custom/_sprints.scss`, `_sass/custom/custom.scss`, `jekyll/deliverables/wbs.md`, `jekyll/schedule/timeline.md`, `scripts/check-navigation.py`.
**Interfaces:** YAML의 기준일·스프린트·작업 목록을 로드맵·카드·WBS 표에서 함께 사용한다. 각 작업은 id/title/status/evidence/url/acceptance를 가진다.

- [x] HTML 검사에 스프린트·4상태·카드 링크·빈 상태 검사를 추가하고 미구현 실패를 확인한다.
- [x] 6개 구간의 목표·종료 조건·작업 카드를 기존 기록과 새 계획으로 구분하여 작성한다.
- [x] 공통 include를 두 일정 페이지에 연결하고 과거 기록은 접어 보존한다.
- [x] 모바일 1열·큰 화면 4열, 범위가 명확한 SCSS 적용.
- [x] 빌드·전체 검사와 데스크톱·모바일 브라우저 확인.

## Task 3: 최종 검토와 기록

- [x] 변경 전체를 검토하여 제목·계층·과거 문맥·검색 회귀 확인.
- [x] `bundle exec jekyll build`, `python3 scripts/check-site.py`, `python3 scripts/check-navigation.py`, `node scripts/check-search.cjs`, `git diff --check` 통과.
- [x] 검증 결과와 남은 제한을 아래 실행 기록에 남긴다.

## 실행 기록

- 변경 전: HTML 43개·내부 참조 2966개 오류 0, 한국어 검색 5개 통과. 빌드에는 기존 테마 Sass 폐기 예정 경고가 있다.
- 설계와 계획을 먼저 저장함. 사용자가 설계·기록 후 변경 진행을 명시했으므로 추가 승인 대기 없이 수행한다.

- Task 1 완료: 최상위 14개·ERD/근거 하위 경로 검사 RED → GREEN. 기존 43개 페이지 URL 유지, 주제 구성 통합, 개발일지 원본 변경 없음.
- Task 2 완료: 칸반 미구현 검사 RED → GREEN. 6개 구간(스프린트 5회 + 발표 준비), 24개 상태 열, 20개 카드의 근거·종료 조건 확인.
- 최종 검증: Jekyll 빌드 성공; HTML 43개·내부 참조 2,831개 오류 0; 탐색/칸반 검사 통과; 한국어 검색 5개 통과; git diff --check 통과.
- 실제 Chromium: 1440×1000에서 4열, 375×900에서 1열·문서 가로 넘침 없음; 모바일 메뉴 열림; Space로 과거 스프린트 열림 확인.
- 독립 검토: navigation_review 에이전트가 permalink·자동 생성 일지·탐색 위계·검색·계획/실적 구분을 확인. 소스/내용의 중대한 문제 없음.
- 인쇄 보완: 닫힌 details의 content-visibility 때문에 PDF에 5/20 카드만 포함됨을 재현했다. 인쇄 전용 ::details-content 가시성 수정 후 20/20 종료 조건이 PDF에 포함됨을 확인했다.
- 현재 문서 재편 작업 4.2를 검토 상태로 갱신했다. 사이트 구현·검증은 마쳤으며 팀의 산출물 내용 검토는 남아 있다.
- 검토 범위: 실제 앱 배포와 실험 재현은 문서 재편의 범위 밖이다. 기존 테마 Sass 폐기 예정 경고는 빌드를 막지 않는다.
- 결과는 현재 작업 공간의 변경으로 남겼으며 커밋·푸시·운영 배포는 수행하지 않았다.

## 후속 요청 반영 및 커밋 전 검증

- 사이드바는 홈의 짙은 남색을 공통 스타일로 옮겨 모든 페이지에서 통일했다. 홈·목차·최종산출물의 브라우저 계산 색상을 확인했다.
- 사용자 확인에 따라 Sprint 1~3 완료, Sprint 4 진행 중을 전체 스프린트 상태로 표시했다. 개별 작업 상태와는 구분한다.
- Sprint 2·3 일자별 상세 페이지를 추가하고 사이드바·목차·로드맵·칸반에 연결했다.
- 상세 기록의 표를 Sprint 1과 동일한 날짜·요일·업무 내용·담당·상태로 맞췄다. 개발은 신채연·이은상 공동, 방향 결정·산출물 정리는 전원으로 표기하고 역할 기준을 설명했다.
- 최종 Jekyll 빌드 성공, HTML 45개·내부 참조 3,091개 오류 0, 탐색·칸반 검사와 한국어 검색 5개 및 git diff --check 통과.
- 사용자가 커밋·푸시를 명시적으로 요청하여 현재 main 브랜치에 변경을 커밋하고 origin으로 푸시한다. 앞선 배포 전 보존 방침은 이 후속 요청으로 대체한다.
