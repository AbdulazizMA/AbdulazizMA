(function () {
  'use strict';

  var header = document.getElementById('top');
  var bar = document.querySelector('.bookbar');
  var hero = document.querySelector('.hero');

  // Solid header after scrolling; mobile booking bar after the hero
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('solid', y > 40);
    if (bar && hero) bar.classList.toggle('show', y > hero.offsetHeight - 200);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Fade sections in as they scroll into view
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // Mobile menu
  var menu = document.querySelector('.menu');
  var nav = document.getElementById('nav');
  if (menu && nav) {
    menu.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      header.classList.toggle('open', open);
      menu.setAttribute('aria-expanded', open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); header.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
    });
  }

  // Analytics events for outbound booking / WhatsApp clicks (only if GA is configured)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-track]');
    if (a && typeof window.gtag === 'function') {
      window.gtag('event', a.dataset.track, { unit: a.dataset.unit || '', link_url: a.href });
    }
  });

  // Lightbox gallery
  var lb = document.getElementById('lightbox');
  var items = Array.prototype.slice.call(document.querySelectorAll('.gallery button'));
  if (!lb || !items.length || typeof lb.showModal !== 'function') return;
  var media = lb.querySelector('.lb-media');
  var cap = lb.querySelector('figcaption');
  var idx = 0;
  function show(i) {
    idx = (i + items.length) % items.length;
    var src = items[idx].firstElementChild;
    var clone = src.cloneNode(true);
    clone.removeAttribute('loading');
    media.innerHTML = '';
    media.appendChild(clone);
    cap.textContent = items[idx].getAttribute('aria-label') + '  ·  ' + (idx + 1) + ' / ' + items.length;
  }
  document.querySelectorAll('[data-open]').forEach(function (b) {
    b.addEventListener('click', function () { show(+b.dataset.open); lb.showModal(); });
  });
  var rtl = document.documentElement.dir === 'rtl';
  lb.querySelector('.lb-close').addEventListener('click', function () { lb.close(); });
  lb.querySelector('.lb-prev').addEventListener('click', function () { show(idx - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { show(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') show(idx + (rtl ? -1 : 1));
    if (e.key === 'ArrowLeft') show(idx + (rtl ? 1 : -1));
  });
  var x0 = null;
  lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(idx + ((dx < 0) !== rtl ? 1 : -1));
    x0 = null;
  });
})();
