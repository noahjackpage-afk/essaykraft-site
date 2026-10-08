// EssayKraft homepage: the title page's entrance, headline and scroll reveals,
// the reading-position dock, Midnight Mode, and the small app models in
// sections 2, 4 and 5. Everything shows its finished state when motion is reduced.
(() => {
  const root = document.documentElement;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canObserve = 'IntersectionObserver' in window;

  // The wordmark arrives a letter at a time.
  const letters = document.querySelector('.letters');
  if (letters) {
    letters.innerHTML = [...letters.textContent].map((c, i) => `<span class="ch" style="--i:${i}">${c}</span>`).join('');
    letters.classList.add('ready');
  }

  // Headlines are split into lines so each can rise out of its own slot.
  document.querySelectorAll('.lines').forEach(h => {
    h.innerHTML = h.innerHTML.split(/<br\s*\/?>/i)
      .map((line, i) => `<span class="ln"><span style="--l:${i}">${line.trim()}</span></span>`).join('');
    h.classList.add('reveal-lines');
  });

  // Reveals, staggered among siblings that arrive together.
  const revealables = document.querySelectorAll('.reveal, .lines');
  if (still || !canObserve) {
    revealables.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(entries => {
      let n = 0;
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.style.setProperty('--stagger', `${Math.min(n++, 6) * 70}ms`);
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
    revealables.forEach(el => io.observe(el));
  }

  // Runs `start` once, the first time an element is well on screen.
  const whenSeen = (el, start, threshold = .35) => {
    if (!el) return;
    if (!canObserve) return start();
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); start(); } }, { threshold });
    io.observe(el);
  };

  // The bar gains glass once the page moves, and goes dark over the dark band.
  // The dock appears after the title page and names the part you're reading.
  const bar = document.querySelector('.bar');
  const dock = document.querySelector('.dock');
  const where = dock.querySelector('[data-where]');
  const nights = [...document.querySelectorAll('.night')];
  const pages = [...document.querySelectorAll('[data-page]')];
  let current = where.textContent;
  const setWhere = label => {
    if (label === current) return;
    current = label;
    if (still) { where.textContent = label; return; }
    where.classList.add('out');
    setTimeout(() => { where.textContent = label; where.classList.remove('out'); }, 180);
  };
  const onScroll = () => {
    bar.classList.toggle('scrolled', scrollY > 12);
    bar.classList.toggle('on-dark', !root.hasAttribute('data-midnight') && nights.some(d => { const r = d.getBoundingClientRect(); return r.top <= 29 && r.bottom >= 29; }));
    dock.classList.toggle('shown', scrollY > innerHeight * .5);
    const mid = innerHeight * .45;
    let label = pages[0].dataset.page;
    pages.forEach(p => { if (p.getBoundingClientRect().top <= mid) label = p.dataset.page; });
    setWhere(label);
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  // Midnight Mode: true black everywhere except the pages, which stay white.
  const toggles = document.querySelectorAll('[data-midnight-toggle]');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const reflect = () => {
    const on = root.hasAttribute('data-midnight');
    document.querySelectorAll('.midnight').forEach(b => b.setAttribute('aria-pressed', String(on)));
    themeColor.content = on ? '#000000' : '#f1f0ec';
  };
  const flip = () => {
    root.toggleAttribute('data-midnight');
    try { localStorage.setItem('ek-midnight', root.hasAttribute('data-midnight') ? '1' : '0'); } catch (e) {}
    reflect();
    onScroll();
  };
  toggles.forEach(t => t.addEventListener('click', ev => {
    if (still || !document.startViewTransition) return flip();
    const r = t.getBoundingClientRect();
    const x = ev.clientX || r.left + r.width / 2, y = ev.clientY || r.top + r.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(flip).ready.then(() => {
      root.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 750, easing: 'cubic-bezier(.2, .7, .2, 1)', pseudoElement: '::view-transition-new(root)' });
    });
  }));
  reflect();

  // 2. One source in all sixteen styles: [in-text, reference, list heading].
  const STYLES = {
    apa7: ['(Hobsbawm, 1962, p. 74)', 'Hobsbawm, E. (1962). <i>The age of revolution: 1789–1848</i>. Weidenfeld &amp; Nicolson.', 'References'],
    apa6: ['(Hobsbawm, 1962, p. 74)', 'Hobsbawm, E. (1962). <i>The age of revolution: 1789–1848</i>. London, England: Weidenfeld &amp; Nicolson.', 'References'],
    mla: ['(Hobsbawm 74)', 'Hobsbawm, Eric. <i>The Age of Revolution: 1789–1848</i>. Weidenfeld &amp; Nicolson, 1962.', 'Works Cited'],
    chicago: ['(Hobsbawm 1962, 74)', 'Hobsbawm, Eric. 1962. <i>The Age of Revolution: 1789–1848</i>. Weidenfeld &amp; Nicolson.', 'References'],
    chicago17: ['(Hobsbawm 1962, 74)', 'Hobsbawm, Eric. 1962. <i>The Age of Revolution: 1789–1848</i>. London: Weidenfeld &amp; Nicolson.', 'References'],
    harvard: ['(Hobsbawm, 1962, p. 74)', 'Hobsbawm, E. (1962) <i>The age of revolution: 1789–1848</i>. London: Weidenfeld &amp; Nicolson.', 'Reference list'],
    elsevier: ['(Hobsbawm, 1962, p. 74)', 'Hobsbawm, E., 1962. The Age of Revolution: 1789–1848. Weidenfeld &amp; Nicolson, London.', 'References'],
    sage: ['(Hobsbawm, 1962: 74)', 'Hobsbawm E (1962) <i>The Age of Revolution: 1789–1848</i>. London: Weidenfeld &amp; Nicolson.', 'References'],
    turabian: ['(Hobsbawm 1962, 74)', 'Hobsbawm, Eric. 1962. <i>The Age of Revolution: 1789–1848</i>. London: Weidenfeld &amp; Nicolson.', 'Bibliography'],
    asa: ['(Hobsbawm 1962:74)', 'Hobsbawm, Eric. 1962. <i>The Age of Revolution: 1789–1848</i>. London: Weidenfeld &amp; Nicolson.', 'References'],
    apsa: ['(Hobsbawm 1962, 74)', 'Hobsbawm, Eric. 1962. <i>The Age of Revolution: 1789–1848</i>. London: Weidenfeld &amp; Nicolson.', 'References'],
    ieee: ['[1]', '[1] E. Hobsbawm, <i>The Age of Revolution: 1789–1848</i>. London, U.K.: Weidenfeld &amp; Nicolson, 1962.', 'References'],
    acm: ['[1]', '[1] Eric Hobsbawm. 1962. <i>The Age of Revolution: 1789–1848</i>. Weidenfeld &amp; Nicolson, London.', 'References'],
    cse: ['<sup>1</sup>', '1. Hobsbawm E. The age of revolution: 1789–1848. London: Weidenfeld &amp; Nicolson; 1962.', 'References'],
    vancouver: ['(1)', '1. Hobsbawm E. The age of revolution: 1789–1848. London: Weidenfeld &amp; Nicolson; 1962.', 'References'],
    springer: ['(Hobsbawm 1962, p 74)', 'Hobsbawm E (1962) The age of revolution: 1789–1848. Weidenfeld &amp; Nicolson, London', 'References'],
  };
  const lab = document.querySelector('[data-model="cite"]');
  if (lab) {
    const buttons = [...lab.querySelectorAll('[data-style]')];
    const slots = ['cite', 'ref', 'label'].map(k => lab.querySelector(`[data-slot="${k}"]`));
    let index = 0, timer = null, visible = false, userTook = false, shown = 'apa7', pending = null;

    const show = key => {
      if (key === shown) return;
      shown = key;
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.style === key)));
      // Only the parts that actually change between styles fade out and back.
      const changed = slots.filter((s, i) => s.innerHTML !== STYLES[key][i]);
      const fill = () => STYLES[key].forEach((html, i) => { slots[i].innerHTML = html; });
      if (still) return fill();
      changed.forEach(s => s.classList.add('swap'));
      clearTimeout(pending);
      pending = setTimeout(() => { fill(); slots.forEach(s => s.classList.remove('swap')); }, 300);
    };
    const run = () => {
      clearInterval(timer); timer = null;
      if (!still && !userTook && visible && !document.hidden) {
        timer = setInterval(() => { index = (index + 1) % buttons.length; show(buttons[index].dataset.style); }, 2200);
      }
    };
    const take = (b, i) => { userTook = true; index = i; show(b.dataset.style); run(); };
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
    buttons.forEach((b, i) => {
      b.addEventListener('click', () => take(b, i));
      if (finePointer) b.addEventListener('mouseenter', () => take(b, i));
    });
    if (canObserve) new IntersectionObserver(([e]) => { visible = e.isIntersecting; run(); }, { threshold: .4 }).observe(lab);
    document.addEventListener('visibilitychange', run);
  }

  // 4. The writing record fills in line by line, then declares itself intact.
  const report = document.querySelector('[data-model="record"]');
  whenSeen(report, () => {
    const lines = [...report.querySelectorAll('.history li')];
    lines.forEach((li, i) => { li.style.transitionDelay = `${300 + i * 120}ms`; });
    report.classList.add('play');
    report.querySelectorAll('[data-count]').forEach(el => {
      const end = Number(el.dataset.count);
      if (still) return;
      const t0 = performance.now();
      const step = t => {
        const k = Math.min(1, (t - t0) / 1600);
        el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))).toLocaleString('en-GB');
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    setTimeout(() => report.classList.add('done'), still ? 0 : 300 + lines.length * 120 + 400);
  }, .25);

  // 5. Type and the target fills. Forty words and it's done.
  const typer = document.querySelector('[data-model="typer"]');
  if (typer) {
    const goal = 40;
    const area = typer.querySelector('textarea');
    const count = typer.querySelector('[data-words]');
    const meter = typer.querySelector('.meter b');
    const note = typer.querySelector('.done-note');
    const grow = () => { area.style.height = 'auto'; area.style.height = `${area.scrollHeight}px`; };
    area.addEventListener('input', () => {
      const words = area.value.trim() ? area.value.trim().split(/\s+/).length : 0;
      count.textContent = words.toLocaleString('en-GB');
      meter.style.setProperty('--p', Math.min(1, words / goal));
      const done = words >= goal;
      if (done !== typer.classList.contains('done')) {
        typer.classList.toggle('done', done);
        note.textContent = done ? 'Target reached. Hand it in.' : '';
      }
      grow();
    });
  }
})();
