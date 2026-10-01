// 기본 Lunr trimmer는 한글을 단어 경계에서 제거한다.
// 테마의 문서별 훅에서 최초 한 번만 Unicode 문자·숫자를 보존하도록 교체한다.
if (!this.metaboleUnicodeTrimmer) {
  var unicodeTrimmer = function (token) {
    return token.update(function (text) {
      return text.replace(/^[^\p{L}\p{N}_]+|[^\p{L}\p{N}_]+$/gu, '');
    });
  };
  lunr.Pipeline.registerFunction(unicodeTrimmer, 'metabole-unicode-trimmer');
  this.pipeline.before(lunr.trimmer, unicodeTrimmer);
  this.pipeline.remove(lunr.trimmer);
  this.metaboleUnicodeTrimmer = true;
}
