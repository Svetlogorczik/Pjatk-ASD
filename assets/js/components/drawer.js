/* Side panel used for the per-topic short notes ("konspekt"). */
(function (ASD) {
  'use strict';

  var lastFocus = null;

  function root() { return ASD.util.qs('[data-slot="drawer"]'); }

  ASD.drawer = {
    open: function (title, html) {
      var d = root();
      ASD.util.qs('.drawer__title', d).textContent = title;
      ASD.util.qs('[data-slot="drawer-body"]', d).innerHTML = html;
      lastFocus = document.activeElement;
      d.hidden = false;
      document.body.classList.add('page--locked');
      requestAnimationFrame(function () { d.classList.add('drawer--open'); });
      var closeBtn = ASD.util.qs('.drawer__panel [data-drawer-close]', d);
      if (closeBtn) closeBtn.focus();
    },

    close: function () {
      var d = root();
      if (d.hidden) return;
      d.classList.remove('drawer--open');
      document.body.classList.remove('page--locked');
      setTimeout(function () { d.hidden = true; }, 220);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    },

    isOpen: function () { return !root().hidden; },

    init: function () {
      var self = this;
      var d = root();
      d.addEventListener('click', function (e) {
        if (e.target.closest('[data-drawer-close]')) self.close();
        if (e.target.closest('.drawer__print')) {
          document.body.classList.add('page--print-drawer');
          window.print();
          setTimeout(function () { document.body.classList.remove('page--print-drawer'); }, 500);
        }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && self.isOpen()) self.close();
      });
    }
  };
})(window.ASD);
