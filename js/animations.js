/* ============================================================
   animations.js — firma hero (marquee + scale-down blur-to-sharp),
   scroll reveal con scrub 0.6, parallax, stagger, contatori
   ============================================================ */
(function () {
  'use strict';

  if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  var reduce = false; /* le animazioni partono SEMPRE: nessun kill-switch */

  /* ---------------- FIRMA HERO ----------------
     1) Foto: entra con scale-down + blur-to-sharp
     2) Copy: righe che salgono in scena
     3) Badge rating e tag: fade ritardato                       */
  var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl
    .fromTo('.hero-photo',
      { scale: 1.18, filter: 'blur(18px)', opacity: 0 },
      { scale: 1, filter: 'blur(0px)', opacity: 1, duration: 1.7, ease: 'power2.out' }, 0.1)
    .fromTo('.hero-title .line',
      { y: 70, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, stagger: 0.14 }, 0.35)
    .fromTo('.hero-sub',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9 }, 0.75)
    .fromTo('.hero-actions',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9 }, 0.9)
    .fromTo('.hero-badge',
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }, 1.05)
    .fromTo('.hero-tag',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }, 1.2)
    .fromTo('.marquee-ribbon',
      { y: -30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }, 0.2)
    .fromTo('.hero-scroll',
      { opacity: 0 },
      { opacity: 1, duration: 0.8 }, 1.4);

  /* ---------------- SCROLL REVEAL con scrub 0.6 su ogni sezione ---------------- */
  document.querySelectorAll('.section').forEach(function (section) {
    var head = section.querySelector('.section-head');
    if (head) {
      gsap.fromTo(head,
        { y: 90, opacity: 0 },
        {
          y: 0, opacity: 1, ease: 'none',
          scrollTrigger: { trigger: head, start: 'top 92%', end: 'top 55%', scrub: 0.6 }
        });
      /* linea del capitolo che si disegna */
      var line = head.querySelector('.chapter-line');
      if (line) {
        gsap.fromTo(line, { scaleX: 0 }, {
          scaleX: 1, ease: 'none',
          scrollTrigger: { trigger: head, start: 'top 92%', end: 'top 55%', scrub: 0.6 }
        });
      }
    }
  });

  /* reveal generico per blocchi [data-reveal] fuori dall'hero */
  ScrollTrigger.batch('[data-reveal]:not(.hero *)', {
    start: 'top 90%',
    once: true,
    onEnter: function (batch) {
      gsap.fromTo(batch,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.12, overwrite: true });
    }
  });

  /* ---------------- STAGGER su cards, gallery e punti nicchia ---------------- */
  gsap.fromTo('.service-card',
    { y: 80, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.15,
      scrollTrigger: { trigger: '.service-grid', start: 'top 85%', once: true }
    });

  gsap.fromTo('.gallery figure',
    { y: 60, opacity: 0, scale: 0.96 },
    {
      y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: '.gallery', start: 'top 85%', once: true }
    });

  gsap.fromTo('.niche-points li',
    { x: -40, opacity: 0 },
    {
      x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: '.niche-points', start: 'top 85%', once: true }
    });

  gsap.fromTo('.info-card',
    { y: 60, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.14,
      scrollTrigger: { trigger: '.info-grid', start: 'top 88%', once: true }
    });

  /* ---------------- PARALLASSI ---------------- */
  gsap.to('.hero-photo', {
    yPercent: 12, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
  });

  gsap.to('.marquee-ghost', {
    yPercent: 40, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
  });

  document.querySelectorAll('[data-parallax]').forEach(function (img) {
    gsap.fromTo(img, { yPercent: -8 }, {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: img.closest('figure') || img, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
    });
  });

  /* ---------------- CONTATORI (rating 5.0 / 28 recensioni) ---------------- */
  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = (el.getAttribute('data-decimals') | 0);
    var obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: function () {
        el.textContent = obj.val.toFixed(decimals);
      }
    });
  }

  document.querySelectorAll('[data-count]').forEach(function (el) {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: function () { animateCounter(el); }
    });
  });
})();
