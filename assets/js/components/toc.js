/* "On this page" table of contents with scroll spy (right column on wide screens), plus a
   collapsible copy at the top of the article for phones and tablets, where that column is hidden. */
(function (ASD) {
  'use strict';

  var observer = null;

  function renderInline(items, kind, id) {
    var body = ASD.util.qs('[data-slot="content"] .article__body');
    if (!body) return;
    var top = items.filter(function (h) { return h.level === 2; });
    var list = top.length >= 3 ? top : items;
    var html = '<summary class="toc-inline__summary">' + ASD.util.escapeHtml(ASD.i18n.t('onThisPage')) +
      '<span class="toc-inline__count">' + list.length + '</span></summary><ol class="toc-inline__list">';
    list.forEach(function (h) {
      html += '<li class="toc-inline__item toc-inline__item--level-' + h.level + '"><a class="toc-inline__link" href="' +
        ASD.router.href(kind, id, h.id) + '">' + ASD.util.escapeHtml(h.text) + '</a></li>';
    });
    var box = document.createElement('details');
    box.className = 'toc-inline';
    box.innerHTML = html + '</ol>';
    box.addEventListener('click', function (e) { if (e.target.closest('.toc-inline__link')) box.open = false; });
    body.parentNode.insertBefore(box, body);
  }

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
      renderInline(items, kind, id);

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
