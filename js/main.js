/* VECTR - interactions */
(function () {
  'use strict';
  var hasGSAP = !!(window.gsap && window.ScrollTrigger);
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var root = document.documentElement, body = document.body;
  if (hasGSAP && !reduce) root.classList.add('anim');
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var EASE = 'cubic-bezier(.7,0,.2,1)';

  /* ---------- shutter bands (injected now so images start covered) ---------- */
  if (!reduce) $$('.shutter').forEach(function (el) {
    var b = document.createElement('div'); b.className = 'bands';
    for (var i = 0; i < 6; i++) b.appendChild(document.createElement('i'));
    el.appendChild(b);
  });

  /* ---------- LOADER ---------- */
  var loader = $('#loader'), grid = $('#loaderGrid'), log = $('#loaderLog'), pct = $('#loaderPct'), bar = $('#loaderBar');
  var blocks = [];
  for (var b = 0; b < 84; b++) { var i = document.createElement('i'); grid.appendChild(i); blocks.push(i); }
  var order = blocks.slice().sort(function () { return Math.random() - .5; });
  var lines = ['> boot vectr.academy', '> mount /curriculum ......... <b>ok</b>', '> load mentors[42] .......... <b>ok</b>', '> sync lab.inventory ........ <b>ok</b>', '> compile you@intake-0127 ... <b>ok</b>', '> ready_'];
  var start = performance.now(), last = start, MIN = 2200, shown = 0, done = false;
  var imgs = $$('img:not([loading="lazy"])'), total = imgs.length + 1, loaded = 0;
  function bump() { loaded = Math.min(total, loaded + 1); }
  imgs.forEach(function (im) { if (im.complete) bump(); else { im.addEventListener('load', bump, { once: true }); im.addEventListener('error', bump, { once: true }); } });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(bump); else bump();
  var lit = 0, logged = 0;
  function paint(v) {
    pct.textContent = ('00' + v).slice(-3);
    bar.style.width = v + '%';
    var want = Math.floor(order.length * v / 100);
    while (lit < want) { order[lit].className = Math.random() < .12 ? 'hot' : 'on'; lit++; }
    var wantLog = Math.min(lines.length, Math.floor(v / 100 * lines.length) + 1);
    if (wantLog > logged) { log.innerHTML = lines.slice(0, wantLog).join('\n'); logged = wantLog; }
  }
  (function tick(now) {
    now = now || performance.now();
    var dt = now - last; last = now;
    var target = Math.min(loaded / total, (now - start) / MIN) * 100;
    shown += (target - shown) * Math.min(1, dt / 130);
    if (target >= 100 && shown > 99.4) shown = 100;
    paint(Math.round(shown));
    if (shown >= 100) return finish();
    requestAnimationFrame(tick);
  })();
  setTimeout(function () { loaded = total; }, 6000);
  setTimeout(function () { if (!done) { paint(100); finish(); } }, 8000);

  function finish() {
    if (done) return; done = true;
    setTimeout(function () {
      loader.classList.add('is-out');
      body.classList.remove('is-loading');
      // blocks drop away in random order (pure CSS transitions — no library needed)
      order.forEach(function (bl, k) {
        bl.style.transition = 'transform .55s ' + EASE + ' ' + (k * 0.006 + Math.random() * .12).toFixed(3) + 's';
        bl.style.transform = 'scaleY(0)';
      });
      init();
      setTimeout(function () { loader.classList.add('is-gone'); }, 1500);
    }, 380);
  }

  /* ---------- INIT ---------- */
  var booted = false;
  function init() {
    if (booted) return; booted = true;
    header(); crosshair(); spotlight(); shutters(); counters(); bars(); tabs(); video(); form();
    if (hasGSAP && !reduce) motion();
    var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- header ---------- */
  function header() {
    var h = $('#hdr'), btn = $('#burger'), menu = $('#menu'), lastY = 0;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      h.classList.toggle('is-hidden', y > lastY && y > 400 && !menu.classList.contains('is-open'));
      lastY = y;
    }, { passive: true });
    btn.addEventListener('click', function () { var o = !menu.classList.contains('is-open'); menu.classList.toggle('is-open', o); btn.setAttribute('aria-expanded', o); body.style.overflow = o ? 'hidden' : ''; });
    $$('.menu a').forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); body.style.overflow = ''; }); });
  }

  /* ---------- crosshair cursor (disabled: standard normal system cursor restored) ---------- */
  function crosshair() {}

  /* ---------- colour spotlight (disabled: all photos are displayed in full colour) ---------- */
  function spotlight() {}

  /* ---------- shutter reveal on view ---------- */
  function shutters() {
    var els = $$('.shutter');
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return; io.unobserve(e.target);
        $$('.bands i', e.target).forEach(function (band, k) {
          band.style.transition = 'transform .9s ' + EASE + ' ' + (k * .07) + 's';
          band.style.transform = 'scaleY(0)';
        });
        setTimeout(function () { var b = $('.bands', e.target); if (b) b.remove(); }, 1600);
      });
    }, { threshold: .2 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- counters ---------- */
  function counters() {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return; io.unobserve(e.target);
        if (reduce) return;
        var el = e.target, end = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || '0', 10), t0 = performance.now(), d = 1600;
        (function s(now) {
          var p = Math.min(1, (now - t0) / d), v = end * (1 - Math.pow(1 - p, 4));
          // scramble last digits while counting for a terminal feel
          el.textContent = dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-IN');
          if (p < 1) requestAnimationFrame(s);
        })(t0);
      });
    }, { threshold: .6 });
    $$('[data-count]').forEach(function (el) { io.observe(el); });
  }

  /* ---------- outcome bars ---------- */
  function bars() {
    var spans = $$('.bar__t span');
    spans.forEach(function (s) { if (!reduce) s.style.transform = 'scaleX(0)'; });
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return; io.unobserve(e.target);
        $$('.bar__t span', e.target).forEach(function (s, k) { s.style.transition = 'transform 1.2s ' + EASE + ' ' + (k * .12) + 's'; s.style.transform = 'scaleX(1)'; });
      });
    }, { threshold: .3 });
    $$('.bars').forEach(function (b) { io.observe(b); });
  }

  /* ---------- curriculum tabs ---------- */
  var DATA = {
    fs: [['WK 01–03', 'Web Foundations', 'HTML, CSS, JavaScript, Git and the browser — from blank file to deployed page.', 'Personal site on a custom domain'],
         ['WK 04–07', 'TypeScript & React', 'Components, state, routing, testing and accessible UI patterns.', 'Booking app front-end'],
         ['WK 08–11', 'APIs & Databases', 'Node, Express, PostgreSQL, auth, validation and API design.', 'REST + SQL backend'],
         ['WK 12–15', 'System Design', 'Caching, queues, scaling, observability and code reviews at team scale.', 'Load-tested service'],
         ['WK 16–19', 'DevOps for Devs', 'Docker, CI/CD, cloud deploys, feature flags and incident drills.', 'Pipeline with rollbacks'],
         ['WK 20–24', 'Capstone', 'Multi-tenant SaaS built in squads, reviewed by a hiring partner.', 'Production SaaS + demo day']],
    ai: [['WK 01–03', 'Python for AI', 'NumPy, pandas, notebooks and clean, tested Python.', 'Data-cleaning toolkit'],
         ['WK 04–06', 'ML Foundations', 'Regression, trees, evaluation and the maths that matters.', 'Churn prediction model'],
         ['WK 07–10', 'Deep Learning', 'PyTorch, CNNs, transformers and training on GPUs.', 'Vision classifier'],
         ['WK 11–14', 'LLM Applications', 'Prompting, tool use, RAG, embeddings and vector search.', 'Document Q&A assistant'],
         ['WK 15–17', 'Evals & MLOps', 'Evaluation harnesses, monitoring, cost and latency budgets.', 'Model service with dashboards'],
         ['WK 18–20', 'Capstone', 'An AI product shipped to real users with measured quality.', 'Deployed AI product']],
    sec: [['WK 01–03', 'Networks & Linux', 'TCP/IP, routing, shells, permissions and hardening.', 'Hardened Linux server'],
          ['WK 04–07', 'Offensive Basics', 'Recon, web vulns, exploitation in a legal lab range.', 'CTF write-ups'],
          ['WK 08–11', 'Defensive Ops', 'SIEM, log analysis, detection rules and threat intel.', 'Detection rule pack'],
          ['WK 12–14', 'Cloud Security', 'IAM, misconfigurations, container and K8s security.', 'Cloud security audit'],
          ['WK 15–17', 'Incident Response', 'Playbooks, forensics and tabletop exercises under pressure.', 'IR runbook'],
          ['WK 18–20', 'Capstone', 'Red-vs-blue engagement assessed by industry practitioners.', 'Engagement report + debrief']]
  };
  function tabs() {
    var wrap = $('#modules'), btns = $$('.tabs button'), ink = $('#tabInk');
    function render(key, animate) {
      wrap.innerHTML = DATA[key].map(function (m, i) {
        return '<article class="mod"><span class="mod__wk">M.0' + (i + 1) + ' · ' + m[0] + '</span><h3>' + m[1] + '</h3><p>' + m[2] + '</p><span class="mod__build">BUILD → <b>' + m[3] + '</b></span></article>';
      }).join('');
      if (animate && hasGSAP && !reduce) gsap.fromTo('.mod', { opacity: 0, y: 24, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: .7, stagger: .06, ease: 'power3.out', clearProps: 'clipPath,transform' });
    }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-selected', x === b ? 'true' : 'false'); });
        ink.style.transform = 'translateX(' + (i * 100) + '%)';
        render(b.dataset.tab, true);
        if (hasGSAP) ScrollTrigger.refresh();
      });
    });
    render('fs', false);
  }

  /* ---------- viewfinder video + timecode ---------- */
  function video() {
    var v = $('#vfFrame video'), tc = $('#vfTime');
    if (!v) return;
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) {
          $$('source[data-src]', v).forEach(function (s) { s.src = s.dataset.src; s.removeAttribute('data-src'); });
          if (!v.dataset.loaded) { v.load(); v.dataset.loaded = 1; }
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else if (v.dataset.loaded) v.pause();
      });
    }, { rootMargin: '200px 0px' });
    io.observe(v);
    var t0 = performance.now();
    (function clock() {
      var s = (performance.now() - t0) / 1000, f = Math.floor((s % 1) * 24);
      var pad = function (n) { return ('0' + n).slice(-2); };
      tc.textContent = pad(Math.floor(s / 3600)) + ':' + pad(Math.floor(s / 60) % 60) + ':' + pad(Math.floor(s) % 60) + ':' + pad(f);
      requestAnimationFrame(clock);
    })();
  }

  /* ---------- form ---------- */
  function form() {
    var f = $('#applyForm'), msg = $('#formMsg');
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = $('#fName'), p = $('#fPhone'), em = $('#fEmail'), t = $('#fTrack');
      var checks = [[n, n.value.trim().length > 1], [p, /^[6-9]\d{9}$/.test(p.value.replace(/\D/g, '').slice(-10))], [em, !em.value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value)], [t, !!t.value]];
      var ok = true;
      checks.forEach(function (c) { c[0].closest('.tf').classList.toggle('bad', !c[1]); if (!c[1]) ok = false; });
      if (!ok) { msg.textContent = '> error: check the highlighted fields'; return; }
      // TODO: POST to your CRM / admissions endpoint.
      msg.textContent = '> application received. we will call ' + n.value.trim().split(' ')[0].toLowerCase() + ' within 1 working day.';
      f.reset();
    });
    $$('input, select', f).forEach(function (el) { el.addEventListener('input', function () { el.closest('.tf').classList.remove('bad'); }); });
  }

  /* ---------- GSAP motion ---------- */
  function motion() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0);

    // hero: hard, fast line drops
    gsap.to('.hero__title .ln > span', { y: 0, duration: 1.1, stagger: .1, ease: 'expo.out', delay: .25 });
    gsap.to('.hero .reveal', { opacity: 1, y: 0, duration: .9, stagger: .08, ease: 'power3.out', delay: .6 });
    gsap.to('.hero__media .cut img', { yPercent: 8, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // generic reveals
    ScrollTrigger.batch('.reveal:not(.hero .reveal)', { start: 'top 90%', once: true, onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: .8, stagger: .08, ease: 'power3.out' }); } });

    // section headings wipe in left -> right like a scan
    $$('.sec__head h2').forEach(function (h) {
      gsap.to(h, { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'expo.inOut', scrollTrigger: { trigger: h, start: 'top 85%' } });
    });

    // kinetic type: scroll-linked horizontal drift in opposite directions
    $$('.kinetic__row').forEach(function (row) {
      var dir = Number(row.dataset.dir);
      gsap.fromTo(row, { xPercent: dir > 0 ? -30 : 0 }, { xPercent: dir > 0 ? 0 : -30, ease: 'none', scrollTrigger: { trigger: '.kinetic', start: 'top bottom', end: 'bottom top', scrub: .5 } });
    });

    // viewfinder: frame opens up from letterbox
    gsap.fromTo('#vfFrame', { clipPath: 'polygon(0 18%, 100% 18%, 100% 82%, 0 82%)' }, { clipPath: 'polygon(0 0, calc(100% - 60px) 0, 100% 60px, 100% 100%, 60px 100%, 0 calc(100% - 60px))', ease: 'none', scrollTrigger: { trigger: '#vf', start: 'top 85%', end: 'top 15%', scrub: true } });

    // lab: independent parallax per tile (broken grid feel)
    $$('.bg[data-speed]').forEach(function (el) {
      gsap.fromTo(el, { y: Number(el.dataset.speed) }, { y: -Number(el.dataset.speed), ease: 'none', scrollTrigger: { trigger: '.bgrid', start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // footer mega word slides up
    gsap.from('.ftr__mega', { yPercent: 40, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.ftr', start: 'top 80%' } });

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }
})();
