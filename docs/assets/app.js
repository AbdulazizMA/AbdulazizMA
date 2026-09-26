(function () {
  'use strict';

  // Mobile menu
  var menu = document.querySelector('.menu');
  var nav = document.getElementById('nav');
  if (menu && nav) {
    menu.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
    });
  }

  // Booking dates -> Airbnb / Booking.com deep links
  var form = document.getElementById('dates');
  var links = document.querySelectorAll('a[data-platform]');
  links.forEach(function (a) { a.dataset.base = a.href; });
  function iso(d) { return d.toISOString().slice(0, 10); }
  function updateLinks() {
    if (!form) return;
    var ci = form.elements['in'].value, co = form.elements['out'].value, g = form.elements.guests.value;
    links.forEach(function (a) {
      var u;
      try { u = new URL(a.dataset.base); } catch (e) { return; }
      if (a.dataset.platform === 'airbnb') {
        if (ci && co) { u.searchParams.set('check_in', ci); u.searchParams.set('check_out', co); }
        u.searchParams.set('adults', g);
      } else {
        if (ci && co) { u.searchParams.set('checkin', ci); u.searchParams.set('checkout', co); }
        u.searchParams.set('group_adults', g);
        u.searchParams.set('no_rooms', '1');
      }
      a.href = u.toString();
    });
  }
  if (form) {
    var today = new Date();
    form.elements['in'].min = iso(today);
    form.elements['out'].min = iso(new Date(today.getTime() + 864e5));
    form.addEventListener('change', function (e) {
      var ci = form.elements['in'], co = form.elements['out'];
      if (e.target === ci && ci.value) {
        var next = new Date(ci.value + 'T00:00:00Z');
        next.setUTCDate(next.getUTCDate() + 1);
        co.min = iso(next);
        if (!co.value || co.value <= ci.value) co.value = iso(next);
      }
      updateLinks();
    });
    updateLinks();
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
