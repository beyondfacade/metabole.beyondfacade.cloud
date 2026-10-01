#!/usr/bin/env python3
"""생성된 Jekyll 사이트의 내부 링크·앵커·이미지·검색 색인을 검사한다(표준 라이브러리만 사용)."""
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

ROOT = Path(__file__).resolve().parents[1] / '_site'
ORIGIN = 'https://metabole.beyondfacade.cloud'


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids = set()
        self.references = []
        self.errors = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            if attrs['id'] in self.ids:
                self.errors.append(f"중복 ID: {attrs['id']}")
            self.ids.add(attrs['id'])
        if tag == 'a' and attrs.get('href'):
            self.references.append(attrs['href'])
        if tag in ('img', 'script') and attrs.get('src'):
            self.references.append(attrs['src'])
        if tag == 'img' and not attrs.get('alt'):
            self.errors.append('이미지 alt 없음')
        if tag == 'link' and attrs.get('rel') == 'stylesheet':
            self.references.append(attrs['href'])


def main():
    if not (ROOT / 'index.html').exists():
        raise SystemExit('먼저 bundle exec jekyll build를 실행하세요.')
    pages = {p.relative_to(ROOT).as_posix(): Page(p.read_text()) for p in ROOT.rglob('*.html')}
    errors = []
    count = 0
    for path, page in pages.items():
        errors.extend(f'{path}: {e}' for e in page.errors)
        for ref in page.references:
            url = urlsplit(urljoin(f'{ORIGIN}/{path}', ref))
            if url.scheme not in ('http', 'https') or url.netloc != urlsplit(ORIGIN).netloc:
                continue
            target = unquote(url.path).lstrip('/')
            if not target or target.endswith('/'):
                target += 'index.html'
            count += 1
            if not (ROOT / target).is_file():
                errors.append(f'{path}: 대상 파일 없음: {ref}')
            elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
                errors.append(f'{path}: 앵커 없음: {ref}')
    search = ROOT / 'assets/js/search-data.json'
    if not search.exists():
        errors.append('검색 색인 없음')
    else:
        index = json.loads(search.read_text())
        urls = {row.get('url', '').split('#')[0] for row in index.values()}
        for required in ('/docs/evidence.html', '/docs/requirements/service-platform.html', '/docs/erd.html', '/showcase/screens/', '/docs/schedule/sprint2.html', '/docs/schedule/sprint3.html'):
            if not any(url.endswith(required) for url in urls):
                errors.append(f'검색 색인 누락: {required}')
    for error in errors:
        print(error)
    print(f'HTML {len(pages)}개 · 내부 참조 {count}개 · 오류 {len(errors)}개')
    raise SystemExit(bool(errors))


if __name__ == '__main__':
    main()
