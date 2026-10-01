// 생성된 테마의 실제 색인 초기화와 Lunr로 한국어 검색 회귀를 검사한다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../_site');
const lunr = require(path.join(root, 'assets/js/vendor/lunr.min.js'));
const source = fs.readFileSync(path.join(root, 'assets/js/just-the-docs.js'), 'utf8');
const docs = JSON.parse(fs.readFileSync(path.join(root, 'assets/js/search-data.json'), 'utf8'));
const initialize = source.slice(source.indexOf('function initSearch()'), source.indexOf('function searchLoaded('));
let index;
vm.runInNewContext(`${initialize}\ninitSearch();`, {
  lunr, console,
  XMLHttpRequest: class {
    open() {}
    send() { this.status = 200; this.responseText = JSON.stringify(docs); this.onload(); }
  },
  searchLoaded(value) { index = value; }
});
for (const [query, expected] of [
  ['백테스트', '/docs/evidence.html'],
  ['창업 경고', '/docs/requirements/service-platform.html'],
  ['판정 보류', '/docs/evidence.html'],
  ['Hit', '/docs/evidence.html'],
  ['최종 산출물', '/showcase/screens/'],
]) {
  const results = index.query(q => lunr.tokenizer(query).forEach(t => q.term(t.toString(), {boost:10, wildcard:lunr.Query.wildcard.TRAILING})));
  assert(results.some(r => docs[r.ref].url.split('#')[0].endsWith(expected)), `${query}: ${expected} 검색 누락`);
  console.log(`PASS: ${query} → ${expected}`);
}
