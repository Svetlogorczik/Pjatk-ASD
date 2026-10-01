/*
 * Hash router (GitHub Pages friendly: no server rewrites needed).
 *   #/pl                -> home
 *   #/pl/t/t03          -> topic t03
 *   #/pl/t/t03/heading  -> topic t03, scrolled to a heading
 *   #/pl/p/course       -> static page
 */
(function (ASD) {
  'use strict';

  function parse(hash) {
    var parts = (hash || '').replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
    var route = { lang: null, kind: 'home', id: null, anchor: null };
    if (parts.length && ASD.i18n.isLang(parts[0])) route.lang = parts.shift();
    if (parts[0] === 't' && parts[1]) { route.kind = 'topic'; route.id = parts[1]; route.anchor = parts[2] || null; }
    else if (parts[0] === 'p' && parts[1]) { route.kind = 'page'; route.id = parts[1]; route.anchor = parts[2] || null; }
    else if (parts.length) { route.kind = 'notfound'; }
    /* The home page is the "start" page; anchors on it use #/pl/p/start/<anchor>. */
    if (route.kind === 'page' && route.id === 'start') { route.kind = 'home'; route.id = null; }
    return route;
  }

  ASD.router = {
    current: null,
    handlers: [],

    href: function (kind, id, anchor, lang) {
      var l = lang || ASD.i18n.lang;
      if (kind === 'home') return anchor ? '#/' + l + '/p/start/' + encodeURIComponent(anchor) : '#/' + l;
      return '#/' + l + '/' + (kind === 'topic' ? 't' : 'p') + '/' + encodeURIComponent(id) +
        (anchor ? '/' + encodeURIComponent(anchor) : '');
    },

    /* Same route in another language. */
    hrefForLang: function (lang) {
      var r = this.current || { kind: 'home' };
      if (r.kind === 'topic' || r.kind === 'page') return this.href(r.kind, r.id, r.anchor, lang);
      return this.href('home', null, null, lang);
    },

    onChange: function (fn) { this.handlers.push(fn); },

    start: function () {
      var self = this;
      window.addEventListener('hashchange', function () { self.emit(); });
      this.emit();
    },

    emit: function () {
      var prev = this.current;
      var route = parse(location.hash);
      if (!route.lang) {
        route.lang = ASD.i18n.lang;
        history.replaceState(null, '', this.href(route.kind === 'notfound' ? 'home' : route.kind, route.id, route.anchor, route.lang));
      }
      this.current = route;
      this.handlers.forEach(function (fn) { fn(route, prev); });
    }
  };
})(window.ASD);
