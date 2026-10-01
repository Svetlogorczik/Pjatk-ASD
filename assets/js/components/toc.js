/* "On this page" table of contents with scroll spy. */
(function (ASD) {
  'use strict';

  var observer = null;

  ASD.toc = {
    render: function (headings, kind, id) {
      var slot = ASD.util.qs('[data-slot="toc"]');
      if (observer) { observer.disconnect(); observer = null; }
      var items = headings.filter(function (h) { return h.level <= 3; });
      if (items.length < 2) { slot.innerHTML = ''; slot.classList.add('toc--empty'); return; }
      slot.classList.remove('toc--empty');

      var html = '<p class="toc__title">' + ASD.util.escapeHtml(ASD.i18n.t('onThisPage')) + '</p><ol class="toc__list">';
      items.forEach(function (h) {
        html += '<li class="toc__item toc__item--level-' + h.level + '">' +
          '<a class="toc__link" data-target="' + h.id + '" href="' + ASD.router.href(kind, id, h.id) + '">' +
          ASD.util.escapeHtml(h.text) + '</a></li>';
      });
      slot.innerHTML = html + '</ol>';

      if (!('IntersectionObserver' in window)) return;
      var links = {};
      ASD.util.qsa('.toc__link', slot).forEach(function (a) { links[a.getAttribute('data-target')] = a; });
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          Object.keys(links).forEach(function (k) { links[k].classList.remove('toc__link--active'); });
          var a = links[en.target.id];
          if (a) a.classList.add('toc__link--active');
        });
      }, { rootMargin: '-72px 0px -70% 0px' });
      items.forEach(function (h) {
        var el = document.getElementById(h.id);
        if (el) observer.observe(el);
      });
    }
  };
})(window.ASD);
