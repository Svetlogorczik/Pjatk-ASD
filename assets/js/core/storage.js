/* localStorage wrapper: storage can be blocked (private mode, file://), so every call is guarded. */
(function (ASD) {
  'use strict';

  var PREFIX = 'asd.';

  ASD.storage = {
    get: function (key, fallback) {
      try {
        var v = window.localStorage.getItem(PREFIX + key);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) {
        return fallback;
      }
    },
    set: function (key, value) {
      try { window.localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch (e) { /* ignore */ }
    },
    /* The theme is stored as a raw string so the inline <head> script can read it. */
    getRaw: function (key) {
      try { return window.localStorage.getItem(PREFIX + key); } catch (e) { return null; }
    },
    setRaw: function (key, value) {
      try { window.localStorage.setItem(PREFIX + key, value); } catch (e) { /* ignore */ }
    }
  };
})(window.ASD);
