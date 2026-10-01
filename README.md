# 메타볼레 개발 문서

계약 전에 동×업종의 창업 경고와 근거를 확인하는 서비스의 개발 문서입니다. 심사위원·면접관이 사용자 문제, 실제 흐름, 검증 결과, 설계 선택과 한계를 읽도록 구성했습니다.

- 문서 사이트: <https://metabole.beyondfacade.cloud>
- 실제 서비스: <https://beyondfacade.cloud> (문서 사이트와 별도)
- 구현 확인: `cloud.beyondfacade`, `feat/warning-copy` / `750b4e5` (2026-10-01). main 병합·배포 완료를 뜻하지 않습니다.

프로젝트는 2026-10-23까지 마무리하고 10-27에 최종 발표합니다. 김충식은 팀장, 신채연·이은상은 프론트엔드와 백엔드의 경계를 나누지 않고 함께 개발한 풀스택 개발자입니다.

## 문서 진입점

- `index.markdown`: 서비스 소개 → 핵심 흐름 → 최종 산출물·개발 문서 → 팀
- `jekyll/showcase/screens.html`: `/showcase/screens/`, 실제 구현 화면 4장·시연 조건·검증 및 KDT 산출물 링크
- `jekyll/evidence.md`: 업종별 백테스트, 별도의 검색 평가, 원문 링크와 확인 범위
- `jekyll/requirements/`: 제공 조건·데이터·판정과 설명의 구조
- `jekyll/deliverables/`: KDT 장 구성을 유지한 요구사항·설계·검수·시연
- `jekyll/erd.md`: 현행 ORM 47개와 과거 실DB 36테이블 명세를 구분
- `docs/superpowers/plans/`: 파일별 개편 계획과 검증 기록(사이트 빌드 제외)

## 로컬 실행·검증

```bash
bundle install
bundle exec jekyll serve
```

```bash
bundle exec jekyll build
git diff --check
python3 scripts/check-site.py
node scripts/check-search.cjs
```

기존 서버가 있으면 중지·재시작하지 않고 다른 포트에서 생성물을 확인합니다. 홈·일반 문서·검증 표·ERD를 375/768/1152/1440 폭에서 확인하고 검색·메뉴·링크·앵커·이미지를 검사합니다. 정적 검사 스크립트는 생성된 HTML 내부 링크·이미지·앵커·검색 색인을 점검합니다. Node.js 검색 검사는 실제 테마의 Lunr 색인으로 한국어 검색 결과를 확인합니다.

## 유지보수

기존 just-the-docs·SCSS·JavaScript를 사용합니다. 새 프레임워크는 없습니다.

- `_sass/custom/_docs.scss`: 문서 공통 스타일
- `_sass/custom/_presentation.scss`: 서비스 소개·최종 산출물·반응형 구성
- `_sass/custom/_erd.scss`, `assets/js/erd.js`: 관계도·확대·키보드 탐색
- `assets/js/docs.js`: 문서 제목과 데스크톱 목차
- `_includes/lunr/custom-index.js`: 한글을 보존하는 검색 색인 처리
- `assets/images/seoul-diorama.webp`, `location-pin.webp`: cloud 서비스의 기존 브랜드 일러스트를 재사용한 개념 모형
- `assets/images/service-entry.png`, `service-support.png`, `service-plan.png`: 2026-10-01 로컬 실백엔드 화면. 자금 계획은 자기자본 5천만 원 가정의 계산 전 상태
- `assets/images/service-warning-map.png`: 2026-10-01 기존 로컬 서비스의 실제 캡처. API는 `/api/backend`, 판정 산출일 9/30. 자동 갱신 화면이 아닙니다.

초기 목표와 측정 성과, UI 14업종과 판정 12업종, 규칙과 LLM 설명을 구분합니다. 날짜별 개발 기록과 초기 설계는 당시 상태로 보존합니다.

**개발 일지의 정본은 cloud 저장소 `docs/jekyll.md`입니다.** `scripts/jekyll-devlog.sh`가 이 저장소의 `jekyll.md`로 복사하므로 복사본만 편집하지 마세요. 현재 방향 안내는 `_layouts/post.html`, 메뉴 순서는 `_config.yml` defaults에서 주입합니다. 이번 정비에서는 기존 dirty `jekyll.md`를 수정하지 않았습니다.

## 개발 세션 배너

```bash
./scripts/dev-session.sh start 이은상
./scripts/dev-session.sh end
```

이 명령은 `_data/dev_session.yml`을 바꿉니다. 사이트에 공개하려면 별도의 커밋·푸시가 필요합니다. 이번 문서 정비는 커밋·푸시·배포를 포함하지 않습니다.
