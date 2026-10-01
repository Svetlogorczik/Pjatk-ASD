/* Lazily loads the content bundle of a language (a plain <script>, works on file:// too). */
(function (ASD) {
  'use strict';

  var pending = {};

  ASD.loader = {
    load: function (lang) {
      if (ASD.content.data[lang]) return Promise.resolve(ASD.content.data[lang]);
      if (pending[lang]) return pending[lang];

      pending[lang] = new Promise(function (resolve, reject) {
        (ASD.content.waiting[lang] = ASD.content.waiting[lang] || []).push(resolve);
        var s = document.createElement('script');
        s.src = 'assets/data/content.' + lang + '.js';
        s.async = true;
        s.onerror = function () {
          delete pending[lang];
          reject(new Error('Cannot load ' + s.src));
        };
        document.head.appendChild(s);
      });
      return pending[lang];
    }
  };
})(window.ASD);
