/* Static information pages (course rules, cheat sheet, sources, study tips). */
(function (ASD) {
  'use strict';

  var esc = ASD.util.escapeHtml;

  ASD.pages = ASD.pages || {};

  ASD.pages.page = function (data, id) {
    var p = data.pages[id];
    if (!p || id === 'start') return null;
    var md = ASD.markdown.render(p.body);
    var html = '<article class="article article--page">' +
      '<header class="article__header">' +
      (p.eyebrow ? '<p class="article__eyebrow">' + esc(p.eyebrow) + '</p>' : '') +
      '<h1 class="article__title">' + esc(p.title) + '</h1>' +
      (p.desc ? '<p class="article__lead">' + esc(p.desc) + '</p>' : '') +
      '</header>' +
      '<div class="article__body prose">' + md.html + '</div></article>';
    return { html: html, headings: md.headings, title: p.title };
  };
})(window.ASD);
