/* Small, dependency-free syntax highlighter for the languages used on the site. */
(function (ASD) {
  'use strict';

  var esc = ASD.util.escapeHtml;

  function words(list) {
    var set = {};
    list.split(/\s+/).forEach(function (w) { if (w) set[w] = true; });
    return set;
  }

  var LANGS = {
    java: {
      label: 'Java',
      keywords: words('abstract boolean break byte case catch char class continue default do double else enum extends final finally float for if implements import instanceof int interface long new package private protected public return short static super switch this throw throws try void while var'),
      literals: words('true false null'),
      types: words('String Object Integer System Math List ArrayList Deque ArrayDeque Queue Stack LinkedList Node TreeNode IntCiag PriorityQueue Arrays Map HashMap Set HashSet Scanner'),
      lineComment: '//',
      blockComment: true,
      hashComment: false
    },
    c: null, // filled below (same as Java)
    pseudo: {
      label: 'Pseudokod',
      keywords: words('Algorytm Algorithm Dane Wynik Input Output if then else elif while do for to downto repeat until return begin end and or not div mod function procedure procedura funkcja swap'),
      literals: words('true false null NULL TRUE FALSE'),
      types: words(''),
      lineComment: '//',
      blockComment: true,
      hashComment: false
    },
    python: {
      label: 'Python',
      keywords: words('def return if elif else while for in not and or is import from as class lambda pass break continue yield with try except finally raise global nonlocal del assert'),
      literals: words('True False None'),
      types: words('int float str list dict set tuple len range print min max sorted enumerate'),
      lineComment: null,
      blockComment: false,
      hashComment: true
    }
  };
  LANGS.c = LANGS.java;
  LANGS.cpp = LANGS.java;

  var LABELS = { java: 'Java', c: 'C', cpp: 'C++', pseudo: null, python: 'Python', text: null, bash: 'Shell' };

  function span(type, text) {
    return '<span class="code-block__token code-block__token--' + type + '">' + esc(text) + '</span>';
  }

  function highlight(code, lang) {
    var def = LANGS[lang];
    if (!def) return esc(code);

    var out = '';
    var i = 0;
    var n = code.length;
    while (i < n) {
      var ch = code[i];
      var rest = code.slice(i);
      var m;

      if (def.blockComment && rest.lastIndexOf('/*', 0) === 0) {
        var end = code.indexOf('*/', i + 2);
        end = end < 0 ? n : end + 2;
        out += span('comment', code.slice(i, end)); i = end; continue;
      }
      if ((def.lineComment && rest.lastIndexOf(def.lineComment, 0) === 0) || (def.hashComment && ch === '#')) {
        var eol = code.indexOf('\n', i);
        eol = eol < 0 ? n : eol;
        out += span('comment', code.slice(i, eol)); i = eol; continue;
      }
      if (ch === '"' || ch === "'") {
        var j = i + 1;
        while (j < n && code[j] !== ch && code[j] !== '\n') { if (code[j] === '\\') j++; j++; }
        out += span('string', code.slice(i, j + 1)); i = j + 1; continue;
      }
      if ((m = /^\d+(\.\d+)?[lLfFdD]?/.exec(rest))) {
        out += span('number', m[0]); i += m[0].length; continue;
      }
      if ((m = /^[A-Za-z_À-ɏЀ-ӿ][\wÀ-ɏЀ-ӿ]*/.exec(rest))) {
        var w = m[0];
        if (def.keywords[w]) out += span('keyword', w);
        else if (def.literals[w]) out += span('literal', w);
        else if (def.types[w]) out += span('type', w);
        else if (code[i + w.length] === '(') out += span('function', w);
        else out += esc(w);
        i += w.length; continue;
      }
      if ((m = /^(:=|<=|>=|==|!=|&&|\|\||\+\+|--|[-+*\/%<>=!&|^~?:])/.exec(rest))) {
        out += span('operator', m[0]); i += m[0].length; continue;
      }
      out += esc(ch); i++;
    }
    return out;
  }

  ASD.highlight = {
    code: highlight,
    label: function (lang) { return LABELS.hasOwnProperty(lang) ? LABELS[lang] : (lang || null); }
  };
})(window.ASD);
