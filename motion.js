(function () {
  'use strict';

  /* ── 1. CUSTOM CURSOR ─────────────────────────────────────── */
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.id = 'cursor-dot';
  ring.id = 'cursor-ring';
  document.body.append(dot, ring);

  let mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mousedown', () => ring.classList.add('clicking'));
  document.addEventListener('mouseup', () => ring.classList.remove('clicking'));

  (function animCursor() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    dot.style.transform = 'translate(' + (mx - 4) + 'px,' + (my - 4) + 'px)';
    ring.style.transform = 'translate(' + (rx - 19) + 'px,' + (ry - 19) + 'px)';
    requestAnimationFrame(animCursor);
  })();

  document.querySelectorAll('a,button,.cap,.pain,.form-card,.quote,.step').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  /* ── 2. SCROLL PROGRESS BAR ───────────────────────────────── */
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });

  /* ── 3. HERO TITLE WORD SPLIT ─────────────────────────────── */
  const h1 = document.querySelector('.hero h1');
  if (h1) {
    const parts = h1.innerHTML.split(/(<[^>]+>|s+)/g);
    h1.innerHTML = parts.map(p => {
      if (!p.trim() || p.startsWith('<')) return p;
      return '<span class="word-wrap"><span class="word">' + p + '</span></span>';
    }).join('');
    const words = h1.querySelectorAll('.word');
    words.forEach((w, i) => {
      setTimeout(() => w.classList.add('in'), 200 + i * 70);
    });
  }

  /* ── 4. SCROLL REVEAL ─────────────────────────────────────── */
  const groups = [
    ['.hero-social-proof', 'reveal', 0],
    ['.hero .lead', 'reveal', 0],
    ['.hero-actions', 'reveal', 0],
    ['.hero-note', 'reveal', 0],
    ['.hero-card', 'reveal-right', 0],
    ['.diff-left', 'reveal-left', 0],
    ['.compare', 'reveal-right', 0],
    ['.band', 'reveal', 0],
    ['.final h2, .final p, .final .row, .final .perks', 'reveal', 0],
  ];

  const staggerGroups = [
    ['.trust-item', 'reveal'],
    ['.pain', 'reveal'],
    ['.step', 'reveal'],
    ['.form-card', 'reveal'],
    ['.quote', 'reveal'],
    ['.proof-stat', 'reveal'],
    ['.cap', 'reveal'],
    ['.obj-item', 'reveal'],
    ['.compare-row', 'reveal'],
  ];

  function makeReveal(selector, cls) {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add(cls);
      new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          e.target.classList.add('in');
          obs.unobserve(e.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }).observe(el);
    });
  }

  groups.forEach(([sel, cls]) => makeReveal(sel, cls));

  staggerGroups.forEach(([selector, cls]) => {
    const els = document.querySelectorAll(selector);
    els.forEach((el, i) => {
      el.classList.add(cls, 'stagger-' + Math.min(i + 1, 6));
      new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          e.target.classList.add('in');
          obs.unobserve(e.target);
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }).observe(el);
    });
  });

  /* ── 5. SECTION HEADINGS REVEAL ──────────────────────────── */
  document.querySelectorAll('h2, .sec-head .sub, .page-hero h1').forEach(el => {
    el.classList.add('reveal');
    new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.1 }).observe(el);
  });

  /* ── 6. COUNTER ANIMATION ─────────────────────────────────── */
  function countUp(el, to, suffix, dur) {
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const v = Math.round(p * p * (3 - 2 * p) * to);
      el.dataset.display = v + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.dataset.display = to + suffix;
    })(start);
    const iv = setInterval(() => {
      if (el.dataset.display) {
        el.textContent = el.dataset.display;
        if (el.dataset.display === to + suffix) clearInterval(iv);
      }
    }, 16);
  }

  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const txt = el.textContent.trim();
      if (txt === '100') countUp(el, 100, '', 1400);
      else if (txt === '15+') countUp(el, 15, '+', 1200);
      e.target.parentElement && e.target.parentElement.parentElement && new IntersectionObserver(()=>{}).disconnect();
    });
  }, { threshold: 0.5 }).observe = (function(orig) {
    return function(el) {
      if (el.closest('.trust-bar') || el.closest('.proof-section')) orig.call(this, el);
    };
  })(IntersectionObserver.prototype.observe);

  document.querySelectorAll('.trust-item .val').forEach(el => {
    const txt = el.textContent.trim();
    new IntersectionObserver((entries, obs) => {
      if (!entries[0].isIntersecting) return;
      if (txt === '100') countUp(el, 100, '', 1400);
      else if (txt === '15+') countUp(el, 15, '+', 1200);
      obs.unobserve(el);
    }, { threshold: 0.5 }).observe(el);
  });

  /* ── 7. MAGNETIC BUTTONS ──────────────────────────────────── */
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.3;
      const y = (e.clientY - r.top - r.height / 2) * 0.4;
      btn.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(1.04)';
      btn.style.transition = 'transform .1s ease';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)';
    });
  });

  /* ── 8. 3D CARD TILT ──────────────────────────────────────── */
  document.querySelectorAll('.form-card, .hero-card').forEach(card => {
    card.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1), border-color .2s, box-shadow .2s';
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = 'perspective(900px) rotateY(' + (x * 7) + 'deg) rotateX(' + (-y * 7) + 'deg) translateY(-4px)';
      card.style.transition = 'transform .05s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1), border-color .2s, box-shadow .2s';
    });
  });

  /* ── 9. NAV HIDE ON SCROLL DOWN ──────────────────────────── */
  let lastY = 0;
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > lastY && y > 100) header.classList.add('hidden');
    else header.classList.remove('hidden');
    lastY = y;
  }, { passive: true });

  /* ── 10. NOISE TEXTURE on dark sections ───────────────────── */
  document.querySelectorAll('.pain-section, .proof-section').forEach(section => {
    const canvas = document.createElement('canvas');
    canvas.className = 'noise-canvas';
    section.insertBefore(canvas, section.firstChild);
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
    }
    resize();
    new ResizeObserver(resize).observe(section);

    let running = false;
    function draw() {
      const w = canvas.width, h = canvas.height;
      const img = ctx.createImageData(w, h);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255 | 0;
        d[i] = d[i+1] = d[i+2] = v; d[i+3] = 14;
      }
      ctx.putImageData(img, 0, 0);
      if (running) setTimeout(() => requestAnimationFrame(draw), 80);
    }

    new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      if (running) draw();
    }).observe(section);
  });

  /* ── 11. SMOOTH ANCHOR SCROLL ─────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

})();
