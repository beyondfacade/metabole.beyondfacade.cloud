(() => {
  const panel = document.querySelector('.erd-diagram');
  if (!panel) return;
  const viewport = panel.querySelector('.erd-viewport');
  const container = viewport.querySelector('.language-mermaid');
  const controls = panel.querySelector('.erd-controls');
  let svg;
  let width;
  let height;
  let zoom = 1;
  let minimum = 0.1;
  let fitMode = true;
  let previousFocus;
  let backgroundElements = [];

  const setZoom = value => {
    const previousZoom = zoom;
    zoom = Math.max(minimum, Math.min(2, value));
    const centerX = viewport.scrollLeft + viewport.clientWidth / 2;
    const centerY = viewport.scrollTop + viewport.clientHeight / 2;
    svg.style.width = `${width * zoom}px`;
    svg.style.height = `${height * zoom}px`;
    viewport.scrollLeft = centerX * zoom / previousZoom - viewport.clientWidth / 2;
    viewport.scrollTop = centerY * zoom / previousZoom - viewport.clientHeight / 2;
    panel.querySelector('.erd-zoom').textContent = `${Math.round(zoom * 100)}%`;
    controls.querySelector('[data-erd-action="out"]').disabled = zoom <= minimum;
    controls.querySelector('[data-erd-action="in"]').disabled = zoom >= 2;
  };
  const fit = () => {
    const style = getComputedStyle(viewport);
    const available = viewport.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
    minimum = Math.min(0.1, available / width);
    setZoom(Math.min(1, available / width));
    viewport.scrollTo(0, 0);
  };
  const toggleExpanded = () => {
    const expanded = panel.classList.toggle('is-expanded');
    const button = controls.querySelector('[data-erd-action="expand"]');
    button.textContent = expanded ? '닫기 (Esc)' : '크게 보기';
    button.setAttribute('aria-pressed', String(expanded));
    if (expanded) {
      previousFocus = document.activeElement;
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-modal', 'true');
      // Make background content inert while keeping the dialog's ancestors available.
      for (let node = panel; node.parentElement && node !== document.body; node = node.parentElement) {
        [...node.parentElement.children].forEach(sibling => {
          if (sibling !== node && !sibling.inert) {
            sibling.inert = true;
            backgroundElements.push(sibling);
          }
        });
      }
      button.focus();
    } else {
      panel.removeAttribute('role');
      panel.removeAttribute('aria-modal');
      backgroundElements.forEach(element => { element.inert = false; });
      backgroundElements = [];
      previousFocus?.focus();
    }
    if (fitMode) fit();
  };

  controls.addEventListener('click', event => {
    const action = event.target.closest('button')?.dataset.erdAction;
    if (action === 'in' || action === 'out') {
      fitMode = false;
      setZoom(zoom * (action === 'in' ? 1.25 : 0.8));
    } else if (action === 'fit') {
      fitMode = true;
      fit();
    } else if (action === 'actual') {
      fitMode = false;
      setZoom(1);
    } else if (action === 'expand') toggleExpanded();
  });
  document.addEventListener('keydown', event => {
    if (!panel.classList.contains('is-expanded')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      toggleExpanded();
    } else if (event.key === 'Tab') {
      const focusable = [...panel.querySelectorAll('button:not(:disabled), [tabindex="0"]')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });

  const initialize = () => {
    const candidate = container.querySelector(':scope > svg');
    const box = candidate?.viewBox.baseVal;
    if (!box?.width || !box.height || !candidate.querySelector('.entityBox')) return false;
    svg = candidate;
    width = box.width;
    height = box.height;
    const masters = ['district', 'region', 'population_stat', 'industry', 'industry_subcategory', 'industry_source_code'];
    svg.querySelectorAll('g[id^="entity-"]').forEach(entity => {
      const name = entity.querySelector('.entityLabel')?.textContent.trim();
      if (!name) return;
      entity.dataset.erdLayer = masters.includes(name) ? 'master' : name === 'rag_chunk' ? 'search' : name === 'region_industry_metric' ? 'metric' : 'source';
    });
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', '메타볼레 21개 테이블의 데이터 관계도');
    controls.hidden = false;
    fit();
    new ResizeObserver(() => { if (fitMode) fit(); }).observe(viewport);
    return true;
  };
  // Mermaid renders asynchronously. Wait for its completed SVG, not its temporary scaffold.
  if (!initialize()) {
    const observer = new MutationObserver(() => {
      if (initialize()) observer.disconnect();
    });
    observer.observe(container, {childList: true, subtree: true, attributes: true, attributeFilter: ['viewBox']});
  }
})();
