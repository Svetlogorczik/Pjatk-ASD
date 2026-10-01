/*
 * Math rendering with the vendored KaTeX (assets/vendor/katex).
 *   $...$     inline formula        $$...$$   display formula (own line or block)
 * Without KaTeX (script blocked) the TeX source is shown in a readable monospace fallback.
 */
(function (ASD) {
  'use strict';

  var esc = ASD.util.escapeHtml;

  function render(tex, display) {
    if (window.katex) {
      try {
        return window.katex.renderToString(tex, { displayMode: !!display, throwOnError: false, strict: 'ignore', output: 'html' });
      } catch (e) { /* fall through to the plain fallback */ }
    }
    return '<code class="math__fallback">' + esc(tex) + '</code>';
  }

  ASD.math = {
    inline: function (tex) { return '<span class="math math--inline">' + render(tex, false) + '</span>'; },
    block: function (tex) { return '<div class="math math--block" role="math">' + render(tex, true) + '</div>'; }
  };
})(window.ASD);
