/* ============================================================
   main.js — Lenis (drivato da GSAP ticker), nav, sticky CTA, menu
   ============================================================ */
(function () {
  'use strict';

  /* Fallback: se GSAP non carica, mostra tutto e ferma qui */
  if (typeof window.gsap === 'undefined') {
    document.documentElement.classList.add('no-anim');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis smooth scroll, sempre drivato dal ticker GSAP ---------- */
  var lenis = null;
  if (typeof window.Lenis === 'function') {
    lenis = new Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- Navbar: cambia stato dopo lo scroll ---------- */
  var nav = document.querySelector('.nav');
  var navHeight = nav ? nav.offsetHeight : 76;

  function updateNav(y) {
    if (nav) nav.classList.toggle('is-scrolled', y > 40);
  }

  if (lenis) {
    lenis.on('scroll', function (e) { updateNav(e.scroll); });
  } else {
    window.addEventListener('scroll', function () { updateNav(window.scrollY); }, { passive: true });
  }

  /* ---------- Sticky CTA: appare dopo l'hero ---------- */
  var stickyCta = document.querySelector('.sticky-cta');
  var hero = document.querySelector('.hero');

  if (stickyCta && hero) {
    ScrollTrigger.create({
      trigger: hero,
      start: 'bottom 60%',
      onEnter: function () { stickyCta.classList.add('is-visible'); },
      onLeaveBack: function () { stickyCta.classList.remove('is-visible'); }
    });
  }

  /* ---------- Menu mobile ---------- */
  var burger = document.querySelector('.nav-burger');
  var links = document.querySelector('.nav-links');
  var closeBtn = document.querySelector('.nav-close');

  function closeMenu() {
    if (links) links.classList.remove('is-open');
    if (lenis) lenis.start();
  }

  if (burger && links) {
    burger.addEventListener('click', function () {
      links.classList.add('is-open');
      if (lenis) lenis.stop();
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (links) {
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ---------- Anchor smooth (via Lenis) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      ev.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -navHeight + 10 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------- Safety net anti-flash: dopo 4s tutto visibile ---------- */
  setTimeout(function () {
    document.documentElement.classList.add('force-visible');
  }, 4000);
})();
