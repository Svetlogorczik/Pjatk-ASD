/* Static information pages (course rules, tests, cheat sheet, sources, study tips); optional exercises part. */
(function (ASD) {
  'use strict';

  var esc = ASD.util.escapeHtml;

  ASD.pages = ASD.pages || {};

  ASD.pages.page = function (data, id) {
    var p = data.pages[id];
    if (!p || id === 'start') return null;
    var md = ASD.markdown.render(p.body);
    var headings = md.headings.slice();
    var tasksHtml = '';
    if (p.tasks) {
      var tasks = ASD.markdown.render('## ' + ASD.i18n.t('exercisesHeading') + '\n\n' + p.tasks, { ids: md.ids });
      headings = headings.concat(tasks.headings);
      tasksHtml = '<section class="article__exercises">' +
        tasks.html.replace('</h2>', '</h2><p class="article__exercises-intro">' + esc(ASD.i18n.t('exercisesIntro')) + '</p>') +
        '</section>';
    }
    var html = '<article class="article article--page">' +
      '<header class="article__header">' +
      (p.eyebrow ? '<p class="article__eyebrow">' + esc(p.eyebrow) + '</p>' : '') +
      '<h1 class="article__title">' + esc(p.title) + '</h1>' +
      (p.desc ? '<p class="article__lead">' + esc(p.desc) + '</p>' : '') +
      '</header>' +
      '<div class="article__body prose">' + md.html + tasksHtml + '</div></article>';
    return { html: html, headings: headings, title: p.title };
  };
})(window.ASD);
