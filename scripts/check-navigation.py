#!/usr/bin/env python3
"""빌드된 사이트의 사용자 탐색 경로를 검사한다."""
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / '_site'
EXPECTED = [
    '1. 홈', '2. 목차', '3. 프로젝트 개요', '4. 팀소개',
    '5. 마일스톤&WBS', '6. 요구사항정의서', '7. 상위 설계서',
    '8. 상세 설계서', '9. 시나리오 테스트', '10. 최종 검수',
    '11. 출품시나리오', '12. 개발일지', '13. 부록', '14. 최종산출물',
]


class Navigation(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.active = False
        self.path = []
        self.links = []
        self.current = None
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'nav' and attrs.get('id') == 'site-nav':
            self.active = True
        if not self.active:
            return
        if tag == 'li':
            self.path.append('')
        if tag == 'a' and 'nav-list-link' in attrs.get('class', '').split():
            self.current = [attrs['href'], '']

    def handle_data(self, data):
        if self.current is not None:
            self.current[1] += data

    def handle_endtag(self, tag):
        if not self.active:
            return
        if tag == 'a' and self.current is not None:
            href, label = self.current
            self.path[-1] = label.strip()
            self.links.append((href, tuple(self.path)))
            self.current = None
        if tag == 'li':
            self.path.pop()
        if tag == 'nav':
            self.active = False


class SprintBoards(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.boards = []
        self.cards = []
        self.states = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        classes = attrs.get('class', '').split()
        if 'sprint-board' in classes:
            self.boards.append(attrs['aria-label'])
        if 'sprint-column' in classes:
            self.states.append(attrs['data-status'])
        if 'sprint-card' in classes:
            self.cards.append(attrs['id'])


def main():
    assert (ROOT / 'index.html').exists(), '먼저 Jekyll을 빌드하세요.'
    for file in ROOT.rglob('*.html'):
        nav = Navigation(file.read_text())
        if not nav.links:
            continue
        top = [path[0] for _, path in nav.links if len(path) == 1]
        assert top == EXPECTED, f'{file.name}: 최상위 순서 불일치: {top}'
        paths = {href: path for href, path in nav.links}
        assert paths['/docs/erd.html'] == ('8. 상세 설계서', 'ERD — 데이터 모델')
        assert paths['/docs/evidence.html'] == ('9. 시나리오 테스트', '검증 결과와 구현 근거')
        for number in (1, 2, 3):
            assert paths[f'/docs/schedule/sprint{number}.html'] == (
                '5. 마일스톤&WBS', '단계별 개발 일정', f'Sprint {number} 일자별 진행 사항')
        assert len(paths) == len(nav.links), f'{file.name}: 중복 탐색 링크'
    print('PASS: 모든 페이지의 14개 메뉴·ERD·검증 근거·스프린트 기록 경로')
    text = (ROOT / 'docs/deliverables/wbs.html').read_text()
    boards = SprintBoards(text)
    assert len(boards.boards) == 6, f'6개 일정 구간의 칸반 필요: {boards.boards}'
    assert boards.states == ['todo', 'doing', 'review', 'done'] * 6
    assert len(boards.cards) >= 18, '스프린트 작업 누락'
    assert len(boards.cards) == len(set(boards.cards)), 'WBS 작업 ID 중복'
    assert '해당 작업 없음' in text, '비어 있는 열 안내 누락'
    assert text.count('종료 조건:') == len(boards.cards), '작업별 종료 조건 누락'
    assert text.count('작업 근거') == len(boards.cards), '작업별 근거 링크 누락'
    print(f'PASS: 6개 구간·24개 상태 열·{len(boards.cards)}개 WBS 카드·빈 상태·종료 조건')


if __name__ == '__main__':
    main()
