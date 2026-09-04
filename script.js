/* ==========================================================================
   Arun Karthik N — Portfolio
   script.js — scroll reveals, pointer motion, mobile menu
   Requires: GSAP 3 (loaded from CDN in index.html)
   ========================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------------------------------------------------------------- menu -- */
  function initMenu() {
    var menu = document.getElementById('ak-menu');
    if (!menu) return;

    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-action="toggle-menu"]');
      if (trigger) {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        return;
      }
      // tapping the backdrop, or any link inside the panel, closes it
      if (e.target.closest('#ak-menu')) menu.style.display = 'none';
    });

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') menu.style.display = 'none';
    });
  }

  /* ------------------------------------------------------------- reveals -- */
  function initReveals() {
    var nodes = document.querySelectorAll('[data-reveal]');
    if (!nodes.length) return;

    if (reduce || !('IntersectionObserver' in window)) {
      nodes.forEach(function (el) { el.style.opacity = ''; el.style.transform = ''; });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);
        if (!window.gsap) { el.style.opacity = ''; el.style.transform = ''; return; }
        window.gsap.fromTo(el, { y: 24, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.75, ease: 'power2.out',
          clearProps: 'opacity,transform'
        });
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });

    nodes.forEach(function (el) { io.observe(el); });
  }

  /* -------------------------------------------------------------- motion -- */
  // Cursor ring, scatter heading, magnetic buttons and the hero smoke trail.
  // Pointer-driven only, so it is skipped on touch and reduced-motion.
  function initMotion() {
    if (!fine || reduce || !window.gsap) return;
    var RADIUS = 150;
    var activeMagnet = null;

    window.addEventListener('pointermove', function (e) {
      var g = window.gsap;

      var dot = document.getElementById('ak-cursor');
      if (dot) {
        g.set(dot, { opacity: 1 });
        g.to(dot, { x: e.clientX - 15, y: e.clientY - 15, duration: 0.28, ease: 'power3.out', overwrite: 'auto' });
        var hot = e.target.closest && e.target.closest('a, button, [data-magnet]');
        g.to(dot, { scale: hot ? 2.2 : 0.42, duration: 0.28, ease: 'power2.out', overwrite: 'auto' });
      }

      var title = document.getElementById('ak-scatter');
      if (title) {
        var tb = title.getBoundingClientRect();
        var near = e.clientX > tb.left - RADIUS && e.clientX < tb.right + RADIUS &&
                   e.clientY > tb.top - RADIUS && e.clientY < tb.bottom + RADIUS;
        title.querySelectorAll('[data-ch]').forEach(function (el) {
          if (!near) {
            g.to(el, { x: 0, y: 0, rotate: 0, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
            return;
          }
          var b = el.getBoundingClientRect();
          var dx = b.left + b.width / 2 - e.clientX;
          var dy = b.top + b.height / 2 - e.clientY;
          var d = Math.hypot(dx, dy) || 1;
          var f = d < RADIUS ? (1 - d / RADIUS) * 46 : 0;
          g.to(el, {
            x: (dx / d) * f, y: (dy / d) * f, rotate: (dx / d) * f * 0.14,
            duration: 0.6, ease: 'power3.out', overwrite: 'auto'
          });
        });
      }

      var mag = e.target.closest && e.target.closest('[data-magnet]');
      if (mag) {
        var mb = mag.getBoundingClientRect();
        g.to(mag, {
          x: (e.clientX - (mb.left + mb.width / 2)) * 0.2,
          y: (e.clientY - (mb.top + mb.height / 2)) * 0.3,
          duration: 0.4, ease: 'power3.out', overwrite: 'auto'
        });
        activeMagnet = mag;
      } else if (activeMagnet) {
        g.to(activeMagnet, { x: 0, y: 0, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
        activeMagnet = null;
      }

      var host = document.querySelector('[data-smoke-host]');
      var smoke = document.getElementById('ak-smoke');
      if (host && smoke) {
        var r = host.getBoundingClientRect();
        var inside = e.clientX >= r.left && e.clientX <= r.right &&
                     e.clientY >= r.top && e.clientY <= r.bottom;
        smoke.style.opacity = inside ? '1' : '0';
        if (inside) {
          var x = e.clientX - r.left, y = e.clientY - r.top;
          var a = document.getElementById('ak-smoke-a');
          var b2 = document.getElementById('ak-smoke-b');
          if (a) g.to(a, { x: x, y: y, duration: 1.1, ease: 'power2.out', overwrite: 'auto' });
          if (b2) g.to(b2, { x: x, y: y, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
        }
      }
    });

    // Clicking the heading throws the letters up and springs them back.
    window.addEventListener('click', function (e) {
      var g = window.gsap;
      var title = document.getElementById('ak-scatter');
      if (!g || !title || !title.contains(e.target)) return;
      var chars = title.querySelectorAll('[data-ch]');
      g.fromTo(chars, { y: 0 }, {
        y: function () { return g.utils.random(-42, -14); },
        duration: 0.28, ease: 'power2.out',
        stagger: { each: 0.018, from: 'center' },
        onComplete: function () {
          g.to(chars, { y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)', stagger: { each: 0.014, from: 'center' } });
        }
      });
    });
  }

  function boot() {
    initMenu();
    initReveals();
    initMotion();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
