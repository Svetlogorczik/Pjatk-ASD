/* Home page: hero, legend of boxes and the grid of topics. */
(function (ASD) {
  'use strict';

  var esc = ASD.util.escapeHtml;

  ASD.pages = ASD.pages || {};

  ASD.pages.home = function (data) {
    var start = data.pages.start || { title: '', body: '' };
    var md = ASD.markdown.render(start.body);
    var html = '<section class="hero">' +
      '<p class="hero__eyebrow">' + esc(start.eyebrow || '') + '</p>' +
      '<h1 class="hero__title">' + esc(start.title) + '</h1>' +
      '<p class="hero__lead">' + ASD.markdown.inline(start.lead || '') + '</p>' +
      '<div class="hero__actions">' +
      (data.topics[0] ? '<a class="button button--primary" href="' + ASD.router.href('topic', data.topics[0].id) + '">' + esc(start.cta || 'Start') + '</a>' : '') +
      (data.pages.course ? '<a class="button button--ghost" href="' + ASD.router.href('page', 'course') + '">' + esc(data.pages.course.short || data.pages.course.title) + '</a>' : '') +
      '</div></section>';

    html += '<section class="cards" aria-label="' + esc(ASD.i18n.t('navTopics')) + '">';
    data.topics.forEach(function (tp) {
      var done = ASD.progress.isDone(tp.id);
      html += '<a class="card' + (done ? ' card--done' : '') + '" href="' + ASD.router.href('topic', tp.id) + '">' +
        '<span class="card__num">' + esc(ASD.i18n.t('topicLabel', { n: tp.num })) + (done ? ' · ✓' : '') + '</span>' +
        '<span class="card__title">' + esc(tp.title) + '</span>' +
        '<span class="card__text">' + esc(tp.desc || '') + '</span></a>';
    });
    html += '</section>';

    html += '<div class="prose prose--home">' + md.html + '</div>';
    return { html: html, headings: md.headings, title: start.title };
  };
})(window.ASD);
