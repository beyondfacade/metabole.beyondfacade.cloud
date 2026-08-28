---
layout: default
title: 표지
nav_exclude: true
---

<div class="landing">

  <!-- ── 히어로 ── -->
  <section class="hero">
    <p class="hero-eyebrow">TEAM BEYOND FACADE · PORTFOLIO</p>
    <h1 class="hero-title">
      공공데이터로 창업의 질문에<br>
      <span class="accent">근거 있는 답</span>을 만듭니다
    </h1>
    <p class="hero-lead">
      <strong>메타볼레(Metabole)</strong>는 "이 동네, 이 업종으로 창업해도 될까?"라는 질문에
      서울 상권 공공데이터로 답하는 AI 분석 에이전트를 만드는 10주 프로젝트입니다.
      데이터를 AI가 읽기 좋게 조각내고(Chunking), 검색과 생성을 결합한
      Hybrid RAG 파이프라인 위에 올립니다.
    </p>
    <div class="hero-actions">
      <a class="btn-cta primary" href="{{ '/docs/overview.html' | relative_url }}">프로젝트 개요</a>
      <a class="btn-cta ghost" href="{{ '/docs/devlog.html' | relative_url }}">개발 일지</a>
      <a class="btn-cta ghost" href="https://github.com/beyondfacade/metabole.beyondfacade.cloud">GitHub</a>
    </div>

    <div class="stat-band">
      <div class="stat">
        <p class="stat-number">91.5<span class="unit">%</span></p>
        <p class="stat-label">Recall@5 목표<br>Hybrid 검색 성능</p>
      </div>
      <div class="stat">
        <p class="stat-number">-40<span class="unit">%</span></p>
        <p class="stat-label">Latency 개선 목표<br>Chunking 최적화</p>
      </div>
      <div class="stat">
        <p class="stat-number">5.5만<span class="unit">+</span></p>
        <p class="stat-label">인허가 개폐업 데이터<br>6업종 × 서울 25개 구</p>
      </div>
      <div class="stat">
        <p class="stat-number">1,838<span class="unit">+</span></p>
        <p class="stat-label">상권 뉴스 실수집<br>매시 자동 폴링 적재</p>
      </div>
    </div>
  </section>

  <!-- ── 무엇을 보여주는가 ── -->
  <section class="landing-section">
    <h2>이 프로젝트가 증명하는 것</h2>
    <p class="section-sub">기획부터 수집·분석·서빙까지, 데이터 프로덕트의 전 과정을 팀으로 완주합니다</p>
    <div class="value-grid">
      <div class="value-card">
        <p class="value-icon">📊</p>
        <h3>데이터 엔지니어링</h3>
        <p>서울시 상권분석, 행안부 인허가, 네이버 뉴스 같은 공공·개방 API를 수집 파이프라인으로 묶습니다.
        좌표계 변환(EPSG:5174→WGS84)부터 멱등 시드, 증분 커서, 오류 격리까지 운영 수준을 목표로 설계합니다.</p>
      </div>
      <div class="value-card">
        <p class="value-icon">🤖</p>
        <h3>Hybrid RAG · AI 에이전트</h3>
        <p>상권의 기초 체력(전통 변수 8종)과 외부 충격(특이변수 4계층)을 나눠 구조화하고,
        그 위에 창업 분석 에이전트를 올립니다.
        브이월드 지도 시각화와 정책자금 연계까지 한 흐름으로 다룹니다.</p>
      </div>
      <div class="value-card">
        <p class="value-icon">🤝</p>
        <h3>협업 프로세스</h3>
        <p>10주 애자일 스크럼 — 스프린트 계획, 칸반 보드, GitHub Flow(PR + 리뷰), 데일리 개발 일지 자동 동기화.
        이 문서 사이트 자체가 팀의 커뮤니케이션 결과물입니다.</p>
      </div>
    </div>
  </section>

  <!-- ── 팀 ── -->
  <section class="landing-section">
    <h2>팀 소개</h2>
    <p class="section-sub">Beyond Facade — 정책 공시 RAG 파이프라인 (3명)</p>
    <div class="team-grid">
      <div class="team-card">
        <div class="team-avatar">김</div>
        <p class="team-name">김충식</p>
        <p class="team-role">PM · 프로젝트 관리<br>스크럼 마스터 · 일정/품질 총괄</p>
      </div>
      <div class="team-card">
        <div class="team-avatar">이</div>
        <p class="team-name">이은상</p>
        <p class="team-role">프론트엔드 · Flutter<br>AI 에이전트 개발</p>
      </div>
      <div class="team-card">
        <div class="team-avatar">신</div>
        <p class="team-name">신채연</p>
        <p class="team-role">백엔드 개발<br>AI 에이전트 개발</p>
      </div>
    </div>
  </section>

  <!-- ── 프로젝트 정보 ── -->
  <section class="landing-section">
    <h2>프로젝트 정보</h2>
    <p class="section-sub">상권 데이터 구조화 및 창업 분석 Hybrid RAG용 Agent 개발</p>
    <div class="info-strip">
      <dl>
        <dt>개발 기간</dt>
        <dd>2026. 8. 20 ~ 2026. 10. 27 (10주)</dd>
      </dl>
      <dl>
        <dt>지역 · 업종 범위</dt>
        <dd>서울 25개 구 · 타겟 10업종 (핵심 3종)</dd>
      </dl>
      <dl>
        <dt>깃허브</dt>
        <dd><a href="https://github.com/beyondfacade/metabole.beyondfacade.cloud">github.com/beyondfacade/metabole.beyondfacade.cloud</a></dd>
      </dl>
      <dl>
        <dt>데모 사이트</dt>
        <dd><a href="https://metabole.beyondfacade.cloud">metabole.beyondfacade.cloud</a></dd>
      </dl>
    </div>
  </section>

  <p class="landing-footnote">본 사이트는 Metabole 프로젝트의 개발 문서이자 팀 포트폴리오입니다.</p>

</div>
