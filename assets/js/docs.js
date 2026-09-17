(() => {
  const main = document.querySelector('#main-content > main');
  if (!main || main.querySelector('.landing, .erd-page')) return;

  const title = document.querySelector('script[data-page-title]')?.dataset.pageTitle;
  if (!main.querySelector('h1') && title) {
    const header = document.createElement('header');
    header.className = 'doc-header';
    const eyebrow = document.createElement('p');
    eyebrow.className = 'doc-eyebrow';
    eyebrow.textContent = 'METABOLE / DOCUMENTATION';
    const heading = document.createElement('h1');
    heading.textContent = title;
    header.append(eyebrow, heading);
    main.prepend(header);
  }

  const headings = [...main.querySelectorAll('h2[id]')];
  if (headings.length < 3) return;

  const layout = document.createElement('div');
  layout.className = 'doc-layout';
  main.before(layout);
  layout.append(main);
  const outline = document.createElement('nav');
  outline.className = 'page-outline';
  outline.setAttribute('aria-label', '이 페이지 목차');
  const label = document.createElement('p');
  label.textContent = '이 페이지에서';
  outline.append(label);
  const links = headings.map(heading => {
    const link = document.createElement('a');
    link.href = `#${encodeURIComponent(heading.id)}`;
    link.textContent = heading.textContent.trim();
    outline.append(link);
    return link;
  });
  layout.append(outline);

  let scheduled = false;
  const updateCurrent = () => {
    let current = 0;
    headings.forEach((heading, index) => {
      if (heading.getBoundingClientRect().top <= 120) current = index;
    });
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  };
  window.addEventListener('scroll', () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateCurrent);
    }
  }, {passive: true});
  updateCurrent();
})();
