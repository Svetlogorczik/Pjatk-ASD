/* Global namespace + tiny DOM helpers shared by all modules. */
(function () {
  'use strict';

  var ASD = window.ASD = window.ASD || {};

  ASD.util = {
    qs: function (sel, root) { return (root || document).querySelector(sel); },
    qsa: function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); },

    escapeHtml: function (s) {
      return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    },

    /* Turns heading text into an id usable in URLs (keeps Polish/Cyrillic letters). */
    slugify: function (s) {
      return String(s)
        .toLowerCase()
        .replace(/<[^>]+>/g, '')
        .replace(/&[a-z]+;/g, '')
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'section';
    },

    el: function (tag, className, html) {
      var node = document.createElement(tag);
      if (className) node.className = className;
      if (html != null) node.innerHTML = html;
      return node;
    }
  };

  /* Content bundles (assets/data/content.<lang>.js) call ASD.content.register(). */
  ASD.content = {
    data: {},
    waiting: {},
    register: function (lang, data) {
      this.data[lang] = data;
      (this.waiting[lang] || []).forEach(function (cb) { cb(data); });
      this.waiting[lang] = [];
    }
  };
})();
