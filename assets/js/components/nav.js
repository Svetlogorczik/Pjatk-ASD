/* Sidebar navigation: information pages + numbered topics with progress marks. */
(function (ASD) {
  'use strict';

  var esc = ASD.util.escapeHtml;
  var PAGE_ORDER = ['start', 'course', 'exams', 'howto', 'cheatsheet', 'sources'];

  ASD.nav = {
    render: function (data, route) {
      var slot = ASD.util.qs('[data-slot="nav"]');
      var t = function (k, v) { return ASD.i18n.t(k, v); };
      var ids = data.topics.map(function (x) { return x.id; });

      var html = '<p class="nav__heading">' + esc(t('navInfo')) + '</p><ul class="nav__list">';
      html += '<li class="nav__item"><a class="nav__link' + (route.kind === 'home' ? ' nav__link--active' : '') + '" href="' + ASD.router.href('home') + '">' +
        '<span class="nav__icon" aria-hidden="true">⌂</span>' + esc(data.pages.start ? data.pages.start.short || data.pages.start.title : 'Start') + '</a></li>';
      PAGE_ORDER.slice(1).forEach(function (pid) {
        var p = data.pages[pid];
        if (!p) return;
        var active = route.kind === 'page' && route.id === pid;
        html += '<li class="nav__item"><a class="nav__link' + (active ? ' nav__link--active' : '') + '" href="' + ASD.router.href('page', pid) + '">' +
          '<span class="nav__icon" aria-hidden="true">' + esc(p.icon || '•') + '</span>' + esc(p.short || p.title) + '</a></li>';
      });
      html += '</ul>';

      html += '<p class="nav__heading">' + esc(t('navTopics')) +
        '<span class="nav__progress">' + esc(t('progress', { done: ASD.progress.count(ids), all: ids.length })) + '</span></p><ol class="nav__list nav__list--topics">';
      data.topics.forEach(function (tp) {
        var active = route.kind === 'topic' && route.id === tp.id;
        var done = ASD.progress.isDone(tp.id);
        html += '<li class="nav__item"><a class="nav__link nav__link--topic' + (active ? ' nav__link--active' : '') + (done ? ' nav__link--done' : '') + '" href="' + ASD.router.href('topic', tp.id) + '">' +
          '<span class="nav__num">' + esc(tp.num) + '</span><span class="nav__text">' + esc(tp.short || tp.title) + '</span>' +
          (done ? '<span class="nav__check" aria-label="' + esc(t('done')) + '">✓</span>' : '') + '</a></li>';
      });
      slot.innerHTML = html + '</ol>';
    },

    /* Mobile off-canvas behaviour. */
    init: function () {
      var btn = ASD.util.qs('.header__menu');
      var overlay = ASD.util.qs('[data-slot="overlay"]');
      var set = function (open) {
        document.body.classList.toggle('page--nav-open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        overlay.hidden = !open;
      };
      btn.addEventListener('click', function () { set(!document.body.classList.contains('page--nav-open')); });
      overlay.addEventListener('click', function () { set(false); });
      ASD.util.qs('#sidebar').addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
      this.close = function () { set(false); };
    }
  };
})(window.ASD);
