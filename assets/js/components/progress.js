/* Per-topic "done" flags kept in the viewer's browser only. */
(function (ASD) {
  'use strict';

  ASD.progress = {
    all: function () { return ASD.storage.get('done', {}); },
    isDone: function (id) { return !!this.all()[id]; },
    set: function (id, value) {
      var d = this.all();
      if (value) d[id] = true; else delete d[id];
      ASD.storage.set('done', d);
      document.dispatchEvent(new CustomEvent('asd:progress'));
    },
    count: function (ids) {
      var d = this.all();
      return ids.filter(function (id) { return d[id]; }).length;
    }
  };
})(window.ASD);
