/* Application bootstrap: wires router, language, theme and page renderers together. */
(function (ASD) {
  'use strict';

  var contentSlot, lastKey = null;

  function notFound() {
    return {
      html: '<article class="article"><h1 class="article__title">404</h1><p class="article__lead">' +
        ASD.util.escapeHtml(ASD.i18n.t('notFound')) + '</p><p><a class="button button--primary" href="' +
        ASD.router.href('home') + '">' + ASD.util.escapeHtml(ASD.i18n.t('backHome')) + '</a></p></article>',
      headings: [],
      title: '404'
    };
  }

  function scrollToAnchor(anchor, smooth) {
    if (!anchor) return false;
    var el = document.getElementById(anchor);
    if (!el) return false;
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    return true;
  }

  function render(route) {
    var data = ASD.content.data[route.lang];
    var key = route.lang + '|' + route.kind + '|' + route.id;

    /* Same page, only the anchor changed: just scroll. */
    if (key === lastKey) { scrollToAnchor(route.anchor, true); return; }
    lastKey = key;

    ASD.nav.render(data, route);
    var view = null;
    if (route.kind === 'home') view = ASD.pages.home(data);
    else if (route.kind === 'topic') view = ASD.pages.topic(data, route.id);
    else if (route.kind === 'page') view = ASD.pages.page(data, route.id);
    if (!view) view = notFound();

    contentSlot.innerHTML = view.html;
    if (view.bind) view.bind(contentSlot);
    ASD.toc.render(view.headings, route.kind === 'home' ? 'page' : route.kind, route.kind === 'home' ? 'start' : route.id);
    document.title = (view.title ? view.title + ' · ' : '') + 'ASD';

    if (!scrollToAnchor(route.anchor, false)) window.scrollTo(0, 0);
  }

  function onRoute(route) {
    if (route.lang !== ASD.i18n.lang || !document.documentElement.getAttribute('data-ready')) {
      ASD.i18n.set(route.lang);
    }
    document.documentElement.setAttribute('data-ready', '1');
    if (ASD.drawer.isOpen()) ASD.drawer.close();

    if (!ASD.content.data[route.lang]) contentSlot.innerHTML = '<p class="page__loading">' + ASD.util.escapeHtml(ASD.i18n.t('loading')) + '</p>';
    ASD.loader.load(route.lang).then(function () {
      if (ASD.router.current === route) render(route);
    }, function () {
      contentSlot.innerHTML = '<div class="callout callout--warn"><div class="callout__body"><p class="prose__p">' +
        ASD.util.escapeHtml(ASD.i18n.t('loadError')) + '</p></div></div>';
    });
  }

  function init() {
    contentSlot = ASD.util.qs('[data-slot="content"]');
    ASD.theme.init();
    ASD.codeBlock.init();
    ASD.drawer.init();
    ASD.nav.init();
    ASD.i18n.apply(document);

    ASD.util.qsa('.lang-switch__button').forEach(function (b) {
      b.addEventListener('click', function () {
        var lang = b.getAttribute('data-lang');
        lastKey = null;
        location.hash = ASD.router.hrefForLang(lang);
      });
    });

    /* Re-render the sidebar when a topic is marked as done. */
    document.addEventListener('asd:progress', function () {
      var r = ASD.router.current;
      if (r && ASD.content.data[r.lang]) ASD.nav.render(ASD.content.data[r.lang], r);
    });

    ASD.router.onChange(onRoute);
    ASD.router.start();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})(window.ASD);
