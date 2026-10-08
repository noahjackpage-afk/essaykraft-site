// EssayKraft homepage: entrance, reveals and the three small app models.
// Every model shows its finished state when motion is reduced.
(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The wordmark arrives a letter at a time.
  const letters = document.querySelector('.letters');
  if (letters) {
    letters.innerHTML = [...letters.textContent].map((c, i) => `<span class="ch" style="--i:${i}">${c}</span>`).join('');
    letters.classList.add('ready');
  }

  // The bar gains its glass once the page moves.
  // Over the dark band it turns dark too.
  const bar = document.querySelector('.bar');
  const darks = [...document.querySelectorAll('.dark')];
  const onScroll = () => {
    bar.classList.toggle('scrolled', scrollY > 12);
    bar.classList.toggle('on-dark', darks.some(d => { const r = d.getBoundingClientRect(); return r.top <= 30 && r.bottom >= 30; }));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveals, staggered among siblings that arrive together.
  const reveals = document.querySelectorAll('.reveal');
  if (still || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('in'));
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
    reveals.forEach(el => io.observe(el));
  }

  // Runs `start` the first time an element is mostly on screen.
  const whenSeen = (el, start, threshold = .45) => {
    if (!el) return;
    if (!('IntersectionObserver' in window)) return start();
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { io.disconnect(); start(); }
    }, { threshold });
    io.observe(el);
  };

  // Citations: the same source in six styles.
  const STYLES = {
    apa: ['(Hobsbawm, 1962, p. 74)', 'Hobsbawm, E. (1962). <i>The age of revolution: 1789–1848</i>. Weidenfeld &amp; Nicolson.', 'References'],
    mla: ['(Hobsbawm 74)', 'Hobsbawm, Eric. <i>The Age of Revolution: 1789–1848</i>. Weidenfeld &amp; Nicolson, 1962.', 'Works Cited'],
    chicago: ['(Hobsbawm 1962, 74)', 'Hobsbawm, Eric. 1962. <i>The Age of Revolution: 1789–1848</i>. London: Weidenfeld &amp; Nicolson.', 'References'],
    harvard: ['(Hobsbawm, 1962, p. 74)', 'Hobsbawm, E. (1962) <i>The age of revolution: 1789–1848</i>. London: Weidenfeld &amp; Nicolson.', 'Reference list'],
    ieee: ['[1]', '[1] E. Hobsbawm, <i>The Age of Revolution: 1789–1848</i>. London, U.K.: Weidenfeld &amp; Nicolson, 1962.', 'References'],
    vancouver: ['(1)', '1. Hobsbawm E. The age of revolution: 1789–1848. London: Weidenfeld &amp; Nicolson; 1962.', 'References'],
  };
  const cite = document.querySelector('[data-model="cite"]');
  if (cite) {
    const buttons = [...cite.querySelectorAll('button')];
    const slotCite = cite.querySelector('[data-slot="cite"]');
    const slotRef = cite.querySelector('[data-slot="ref"]');
    const label = cite.querySelector('.refs-label');
    let index = 0, timer = null, visible = false, userTook = false;

    const show = key => {
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.style === key)));
      const [c, r, l] = STYLES[key];
      if (still) { slotCite.textContent = c; slotRef.innerHTML = r; label.textContent = l; return; }
      [slotCite, slotRef].forEach(s => s.classList.add('swap'));
      setTimeout(() => {
        slotCite.textContent = c; slotRef.innerHTML = r; label.textContent = l;
        [slotCite, slotRef].forEach(s => s.classList.remove('swap'));
      }, 380);
    };
    const tick = () => { index = (index + 1) % buttons.length; show(buttons[index].dataset.style); };
    const run = () => {
      clearInterval(timer); timer = null;
      if (!still && !userTook && visible && !document.hidden) timer = setInterval(tick, 2600);
    };
    buttons.forEach((b, i) => b.addEventListener('click', () => { userTook = true; index = i; show(b.dataset.style); run(); }));
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; run(); }, { threshold: .5 }).observe(cite);
    }
    document.addEventListener('visibilitychange', run);
  }

  // Counts a number up from zero.
  const countUp = (el, ms) => {
    const end = Number(el.dataset.count);
    const fmt = n => el.dataset.format === 'thousands' ? n.toLocaleString('en-GB') : String(n);
    if (still) { el.textContent = fmt(end); return; }
    const t0 = performance.now();
    const step = t => {
      const k = Math.min(1, (t - t0) / ms);
      el.textContent = fmt(Math.round(end * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Authorship: sessions rise, numbers count, the seal draws.
  const record = document.querySelector('[data-model="record"]');
  whenSeen(record, () => {
    record.classList.add('play');
    record.querySelectorAll('.sessions i').forEach((bar, i) => { bar.style.transitionDelay = `${i * 60}ms`; });
    record.querySelectorAll('[data-count]').forEach(el => countUp(el, 1500));
  });

  // Word target: the count climbs as if someone were writing.
  const target = document.querySelector('[data-model="target"]');
  whenSeen(target, () => {
    const words = target.querySelector('[data-words]');
    const meter = target.querySelector('.meter b');
    const goal = 2500, from = 1420, to = 2180;
    const set = n => { words.textContent = n.toLocaleString('en-GB'); meter.style.setProperty('--p', n / goal); };
    if (still) return set(to);
    let n = from;
    set(n);
    const write = () => {
      n = Math.min(to, n + 3 + Math.floor(Math.random() * 9));
      set(n);
      if (n < to) setTimeout(write, 24 + Math.random() * 40);
    };
    setTimeout(write, 400);
  });
})();
