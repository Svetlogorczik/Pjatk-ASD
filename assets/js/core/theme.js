/* Light / dark theme. The initial value is set by an inline script in <head>. */
(function (ASD) {
  'use strict';

  ASD.theme = {
    get: function () {
      return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    },
    set: function (theme) {
      document.documentElement.setAttribute('data-theme', theme);
      ASD.storage.setRaw('theme', theme);
    },
    toggle: function () {
      this.set(this.get() === 'dark' ? 'light' : 'dark');
    },
    init: function () {
      var self = this;
      ASD.util.qsa('.theme-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () { self.toggle(); });
      });
    }
  };
})(window.ASD);
