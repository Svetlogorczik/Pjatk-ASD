/* "Copy" buttons on code blocks (event delegation, clipboard API with a file:// fallback). */
(function (ASD) {
  'use strict';

  var toastTimer = null;

  function toast(text) {
    var box = ASD.util.qs('[data-slot="toast"]');
    if (!box) return;
    box.textContent = text;
    box.hidden = false;
    box.classList.add('toast--visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      box.classList.remove('toast--visible');
      box.hidden = true;
    }, 1600);
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }

  ASD.codeBlock = {
    toast: toast,
    init: function () {
      document.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-copy]');
        if (!btn) return;
        var block = btn.closest('.code-block');
        var code = block && ASD.util.qs('.code-block__code', block);
        if (!code) return;
        copy(code.textContent).then(function (ok) {
          if (ok) {
            btn.textContent = ASD.i18n.t('copied');
            btn.classList.add('code-block__copy--done');
            setTimeout(function () {
              btn.textContent = ASD.i18n.t('copy');
              btn.classList.remove('code-block__copy--done');
            }, 1400);
          } else {
            toast(ASD.i18n.t('copyFail'));
          }
        });
      });
    }
  };
})(window.ASD);
