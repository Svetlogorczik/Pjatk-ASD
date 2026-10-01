/* Floating "back to top" button, shown after scrolling down a long page. */
(function (ASD) {
  'use strict';

  ASD.toTop = {
    init: function () {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'to-top';
      btn.hidden = true;
      btn.setAttribute('data-i18n-title', 'toTop');
      btn.setAttribute('aria-label', ASD.i18n.t('toTop'));
      btn.title = ASD.i18n.t('toTop');
      btn.innerHTML = '<svg class="to-top__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
      btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
      document.body.appendChild(btn);

      var ticking = false;
      window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          btn.hidden = window.scrollY < 900;
          ticking = false;
        });
      }, { passive: true });
    }
  };
})(window.ASD);
