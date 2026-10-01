/* Topic page: lecture text, "konspekt" button, exercises and prev/next navigation. */
(function (ASD) {
  'use strict';

  var esc = ASD.util.escapeHtml;
  var t = function (k, v) { return ASD.i18n.t(k, v); };

  function readingMinutes(text) {
    var words = String(text).replace(/```[\s\S]*?```/g, ' ').split(/\s+/).length;
    return Math.max(3, Math.round(words / 180));
  }

  ASD.pages = ASD.pages || {};

  ASD.pages.topic = function (data, id) {
    var idx = -1;
    data.topics.forEach(function (x, i) { if (x.id === id) idx = i; });
    if (idx < 0) return null;
    var tp = data.topics[idx];

    var body = ASD.markdown.render(tp.body);
    var headings = body.headings.slice();
    var tasksHtml = '';
    var taskCount = (tp.tasks.match(/^:::task/gm) || []).length;
    if (tp.tasks) {
      var tasks = ASD.markdown.render('## ' + t('exercisesHeading') + '\n\n' + tp.tasks, { ids: body.ids });
      headings = headings.concat(tasks.headings);
      tasksHtml = '<section class="article__exercises">' +
        tasks.html.replace('</h2>', '</h2><p class="article__exercises-intro">' + esc(t('exercisesIntro')) + '</p>') +
        '</section>';
    }
    var exercisesId = headings.length && tp.tasks ? headings[body.headings.length].id : null;

    var html = '<article class="article" data-topic="' + esc(tp.id) + '">' +
      '<header class="article__header">' +
      '<p class="article__eyebrow">' + esc(t('topicLabel', { n: tp.num })) + ' · ' + esc(t('readingTime', { min: readingMinutes(tp.body) })) + '</p>' +
      '<h1 class="article__title">' + esc(tp.title) + '</h1>' +
      (tp.desc ? '<p class="article__lead">' + esc(tp.desc) + '</p>' : '') +
      '<dl class="article__meta">' +
      (tp.sources ? '<div class="article__meta-row"><dt class="article__meta-label">' + esc(t('sources')) + '</dt><dd class="article__meta-value">' + esc(tp.sources) + '</dd></div>' : '') +
      (tp.exercises ? '<div class="article__meta-row"><dt class="article__meta-label">' + esc(t('exerciseSources')) + '</dt><dd class="article__meta-value">' + esc(tp.exercises) + '</dd></div>' : '') +
      '</dl>' +
      '<div class="article__actions">' +
      '<button class="button button--primary" type="button" data-action="summary">' +
      '<svg class="button__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7M9 9h3"/></svg>' + esc(t('summaryBtn')) + '</button>' +
      (exercisesId ? '<a class="button button--ghost" href="' + ASD.router.href('topic', tp.id, exercisesId) + '">' + esc(t('exercisesBtn')) + ' (' + taskCount + ')</a>' : '') +
      '<label class="article__done"><input class="article__done-input" type="checkbox" data-action="done"' + (ASD.progress.isDone(tp.id) ? ' checked' : '') + '> ' + esc(t('markDone')) + '</label>' +
      '</div></header>' +
      '<div class="article__body prose">' + body.html + tasksHtml + '</div>';

    var prev = data.topics[idx - 1], next = data.topics[idx + 1];
    html += '<nav class="pager">' +
      (prev ? '<a class="pager__link pager__link--prev" href="' + ASD.router.href('topic', prev.id) + '"><span class="pager__hint">← ' + esc(t('prev')) + '</span><span class="pager__title">' + esc(prev.title) + '</span></a>' : '<span></span>') +
      (next ? '<a class="pager__link pager__link--next" href="' + ASD.router.href('topic', next.id) + '"><span class="pager__hint">' + esc(t('next')) + ' →</span><span class="pager__title">' + esc(next.title) + '</span></a>' : '') +
      '</nav></article>';

    return {
      html: html,
      headings: headings,
      title: tp.title,
      bind: function (root) {
        var sBtn = ASD.util.qs('[data-action="summary"]', root);
        if (sBtn) sBtn.addEventListener('click', function () {
          var md = tp.summary ? ASD.markdown.render(tp.summary).html : '<p class="prose__p">' + esc(t('summaryNone')) + '</p>';
          ASD.drawer.open(t('summaryTitle', { title: tp.short || tp.title }), md);
        });
        var done = ASD.util.qs('[data-action="done"]', root);
        if (done) done.addEventListener('change', function () { ASD.progress.set(tp.id, done.checked); });
      }
    };
  };
})(window.ASD);
