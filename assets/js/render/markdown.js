/*
 * Markdown renderer used for all lecture content (no external dependencies).
 *
 * Standard: ## headings, paragraphs, **bold**, *italic*, `code`, [link](url), lists, pipe tables,
 * > quotes, --- rules, fenced code (```java title="File.java").
 * Extensions:
 *   ## Heading {own}                      heading with the "by the author" badge
 *   :::own | analogy | tip | warn | info | exam | def | example  [title]   ...   :::
 *   :::task level=1..3 source="..." | source=own title="..."   ... ::hint ... ::solution ... :::
 *   ```tree / ```graph / ```array          diagrams (see diagrams.js)
 *   ==marked text==, [text](topic:t03), [text](topic:t03#anchor), [text](page:course)
 * Inline HTML (sub, sup, br, kbd, span, mark, small, b, i, em, strong, abbr) is allowed.
 */
(function (ASD) {
  'use strict';

  var esc = ASD.util.escapeHtml;
  var t = function (k, v) { return ASD.i18n.t(k, v); };

  var CALLOUTS = {
    own: 'calloutOwn', analogy: 'calloutAnalogy', tip: 'calloutTip', warn: 'calloutWarn',
    info: 'calloutInfo', exam: 'calloutExam', def: 'calloutDef', example: 'calloutExample'
  };
  var DIAGRAMS = { tree: 1, graph: 1, array: 1 };

  var RE = {
    fence: /^(\s*)(`{3,}|~{3,})\s*([\w+-]*)\s*(.*)$/,
    container: /^:::\s*([a-z]+)\s*(.*)$/,
    containerEnd: /^:::\s*$/,
    heading: /^(#{2,6})\s+(.*?)\s*(\{own\})?\s*$/,
    hr: /^(-{3,}|\*{3,})\s*$/,
    listItem: /^(\s*)([-*+]|\d+[.)])\s+(.*)$/,
    quote: /^>\s?(.*)$/,
    tableSep: /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/
  };

  function parseAttrs(s) {
    var attrs = {}, rest = s;
    rest = rest.replace(/([a-z]+)=("([^"]*)"|'([^']*)'|(\S+))/g, function (_, k, __, a, b, c) {
      attrs[k] = a != null ? a : (b != null ? b : c);
      return '';
    }).trim();
    if (rest) attrs._text = rest;
    return attrs;
  }

  /* ---------- inline ---------- */

  var ALLOWED_TAG = /<(?!\/?(sub|sup|br|kbd|span|mark|small|b|i|em|strong|abbr|u|s)\b)/g;

  function linkHref(url) {
    var m;
    if ((m = /^topic:([\w-]+)(?:#(.+))?$/.exec(url))) return { href: ASD.router.href('topic', m[1], m[2]), ext: false };
    if ((m = /^page:([\w-]+)(?:#(.+))?$/.exec(url))) return { href: ASD.router.href('page', m[1], m[2]), ext: false };
    return { href: url, ext: /^https?:/.test(url) };
  }

  function inline(text) {
    var codes = [];
    var s = text.replace(/`([^`]+)`/g, function (_, c) {
      codes.push('<code class="prose__code">' + esc(c) + '</code>');
      return '\u0000' + (codes.length - 1) + '\u0000';
    });
    var escapes = [];
    s = s.replace(/\\([*_=\[\]`\\|#])/g, function (_, ch) {
      escapes.push(ch);
      return '\u0001' + (escapes.length - 1) + '\u0001';
    });
    s = s.replace(ALLOWED_TAG, '&lt;');
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*\w])\*(?!\s)(.+?)\*(?!\w)/g, '$1<em>$2</em>');
    s = s.replace(/==(.+?)==/g, '<mark class="prose__mark">$1</mark>');
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, label, url) {
      var l = linkHref(url);
      return '<a class="prose__link" href="' + esc(l.href) + '"' + (l.ext ? ' target="_blank" rel="noopener"' : '') + '>' + label + '</a>';
    });
    s = s.replace(/\u0001(\d+)\u0001/g, function (_, i) { return esc(escapes[+i]); });
    return s.replace(/\u0000(\d+)\u0000/g, function (_, i) { return codes[+i]; });
  }

  /* ---------- helpers for block scanning ---------- */

  function isFence(line) { return RE.fence.test(line) && /^\s*(`{3,}|~{3,})/.test(line); }

  /* Index of the ":::" that closes a container opened at `start` (nesting and fences aware). */
  function findContainerEnd(lines, start) {
    var depth = 1, fence = null;
    for (var i = start + 1; i < lines.length; i++) {
      var l = lines[i];
      var fm = /^\s*(`{3,}|~{3,})/.exec(l);
      if (fence) { if (fm && fm[1][0] === fence[0] && fm[1].length >= fence.length && /^\s*[`~]+\s*$/.test(l)) fence = null; continue; }
      if (fm) { fence = fm[1]; continue; }
      if (RE.containerEnd.test(l)) { if (--depth === 0) return i; }
      else if (RE.container.test(l)) depth++;
    }
    return lines.length;
  }

  function startsBlock(line) {
    return isFence(line) || RE.container.test(line) || RE.heading.test(line) || RE.hr.test(line) ||
      RE.listItem.test(line) || RE.quote.test(line) || /^\s*\|/.test(line) || /^::(hint|solution)\s*$/.test(line);
  }

  /* ---------- renderer ---------- */

  function Renderer() {
    this.headings = [];
    this.ids = {};
    this.taskNo = 0;
  }

  Renderer.prototype.uniqueId = function (text) {
    var base = ASD.util.slugify(text), id = base, n = 2;
    while (this.ids[id]) id = base + '-' + n++;
    this.ids[id] = true;
    return id;
  };

  Renderer.prototype.blocks = function (lines) {
    var html = '';
    var i = 0;
    while (i < lines.length) {
      var line = lines[i];
      var m;

      if (!line.trim()) { i++; continue; }

      /* fenced code or diagram */
      if (isFence(line)) {
        m = RE.fence.exec(line);
        var indent = m[1].length, marker = m[2], lang = (m[3] || '').toLowerCase(), info = parseAttrs(m[4] || '');
        var body = [];
        i++;
        while (i < lines.length && !(new RegExp('^\\s*' + marker[0] + '{' + marker.length + ',}\\s*$').test(lines[i]))) {
          body.push(lines[i].slice(Math.min(indent, lines[i].search(/\S|$/))));
          i++;
        }
        i++;
        html += DIAGRAMS[lang] ? this.diagram(lang, body.join('\n'), info) : this.code(lang, body.join('\n'), info);
        continue;
      }

      /* container */
      if ((m = RE.container.exec(line))) {
        var end = findContainerEnd(lines, i);
        html += this.container(m[1], parseAttrs(m[2]), lines.slice(i + 1, end));
        i = end + 1;
        continue;
      }

      /* heading */
      if ((m = RE.heading.exec(line))) {
        var level = m[1].length, text = m[2], id = this.uniqueId(text);
        var own = !!m[3];
        this.headings.push({ level: level, text: text.replace(/<[^>]+>/g, '').replace(/[*`]/g, ''), id: id, own: own });
        html += '<h' + level + ' class="prose__h' + level + '" id="' + id + '">' + inline(text) +
          (own ? ' <span class="prose__badge prose__badge--own">' + esc(t('badgeOwn')) + '</span>' : '') + '</h' + level + '>';
        i++;
        continue;
      }

      if (RE.hr.test(line)) { html += '<hr class="prose__hr">'; i++; continue; }

      /* table */
      if (/^\s*\|/.test(line) && i + 1 < lines.length && RE.tableSep.test(lines[i + 1])) {
        var rows = [line];
        i += 2;
        while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(lines[i++]);
        html += this.table(rows);
        continue;
      }

      /* quote */
      if (RE.quote.test(line)) {
        var q = [];
        while (i < lines.length && RE.quote.test(lines[i])) q.push(RE.quote.exec(lines[i++])[1]);
        html += '<blockquote class="prose__quote">' + this.blocks(q) + '</blockquote>';
        continue;
      }

      /* list */
      if (RE.listItem.test(line)) {
        var res = this.list(lines, i);
        html += res.html;
        i = res.next;
        continue;
      }

      /* paragraph */
      var para = [line.trim()];
      i++;
      while (i < lines.length && lines[i].trim() && !startsBlock(lines[i])) para.push(lines[i++].trim());
      html += '<p class="prose__p">' + inline(para.join(' ')) + '</p>';
    }
    return html;
  };

  Renderer.prototype.code = function (lang, code, info) {
    var label = lang === 'pseudo' ? t('pseudocode') : ASD.highlight.label(lang);
    var plain = !lang || lang === 'text';
    return '<figure class="code-block' + (plain ? ' code-block--plain' : '') + '" data-lang="' + esc(lang || 'text') + '">' +
      '<figcaption class="code-block__header">' +
      (label ? '<span class="code-block__lang">' + esc(label) + '</span>' : '') +
      (info.title ? '<span class="code-block__title">' + esc(info.title) + '</span>' : '') +
      '<button class="code-block__copy" type="button" data-copy>' + esc(t('copy')) + '</button>' +
      '</figcaption>' +
      '<pre class="code-block__pre"><code class="code-block__code">' + ASD.highlight.code(code, lang) + '</code></pre>' +
      '</figure>';
  };

  Renderer.prototype.diagram = function (kind, src, info) {
    var out = ASD.diagrams.render(kind, src);
    if (info.caption || info._text) {
      out = out.replace(/<\/figure>$/, '<figcaption class="diagram__caption">' + inline(info.caption || info._text) + '</figcaption></figure>');
    }
    return out;
  };

  Renderer.prototype.table = function (rows) {
    function cells(row) {
      return row.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map(function (c) { return c.trim().replace(/\\\|/g, '|'); });
    }
    var head = cells(rows[0]);
    var html = '<div class="prose__table-wrap"><table class="prose__table"><thead><tr>' +
      head.map(function (c) { return '<th class="prose__th">' + inline(c) + '</th>'; }).join('') + '</tr></thead><tbody>';
    rows.slice(1).forEach(function (r) {
      html += '<tr>' + cells(r).map(function (c) { return '<td class="prose__td">' + inline(c) + '</td>'; }).join('') + '</tr>';
    });
    return html + '</tbody></table></div>';
  };

  Renderer.prototype.list = function (lines, start) {
    var first = RE.listItem.exec(lines[start]);
    var base = first[1].length;
    var ordered = /\d/.test(first[2]);
    var startNum = ordered ? parseInt(first[2], 10) : 1;
    var items = [];
    var i = start;

    while (i < lines.length) {
      var line = lines[i];
      var m = RE.listItem.exec(line);
      if (m && m[1].length === base && /\d/.test(m[2]) === ordered) {
        items.push({ lines: [m[3]], pad: m[1].length + m[2].length + 1 });
        i++;
        continue;
      }
      if (!line.trim()) {
        /* blank line: continue only if the next non-blank line belongs to this list */
        var j = i + 1;
        while (j < lines.length && !lines[j].trim()) j++;
        if (j < lines.length) {
          var ind = lines[j].search(/\S/);
          var mm = RE.listItem.exec(lines[j]);
          if (ind > base || (mm && mm[1].length === base && /\d/.test(mm[2]) === ordered)) {
            items[items.length - 1].lines.push('');
            i++;
            continue;
          }
        }
        break;
      }
      if (line.search(/\S/) > base && items.length) {
        var cur = items[items.length - 1];
        items[items.length - 1].lines.push(line.slice(Math.min(cur.pad, line.search(/\S/))));
        i++;
        continue;
      }
      break;
    }

    var self = this;
    var tag = ordered ? 'ol' : 'ul';
    var html = '<' + tag + ' class="prose__list' + (ordered ? ' prose__list--ordered' : '') + '"' + (ordered && startNum !== 1 ? ' start="' + startNum + '"' : '') + '>';
    items.forEach(function (it) {
      var simple = it.lines.every(function (l) { return l.trim() && !startsBlock(l); });
      html += '<li class="prose__item">' + (simple ? inline(it.lines.join(' ')) : self.blocks(it.lines)) + '</li>';
    });
    return { html: html + '</' + tag + '>', next: i };
  };

  Renderer.prototype.container = function (type, attrs, lines) {
    if (type === 'task') return this.task(attrs, lines);
    var key = CALLOUTS[type] || 'calloutInfo';
    var title = attrs.title || attrs._text || t(key);
    return '<aside class="callout callout--' + esc(CALLOUTS[type] ? type : 'info') + '">' +
      '<div class="callout__title"><span class="callout__icon" aria-hidden="true"></span>' + inline(title) + '</div>' +
      '<div class="callout__body">' + this.blocks(lines) + '</div></aside>';
  };

  Renderer.prototype.task = function (attrs, lines) {
    var parts = { body: [], hint: null, solution: null }, cur = 'body', depth = 0, fence = null;
    lines.forEach(function (l) {
      var fm = /^\s*(`{3,}|~{3,})/.exec(l);
      if (fence) { if (fm && /^\s*[`~]+\s*$/.test(l)) fence = null; }
      else if (fm) fence = fm[1];
      else if (RE.containerEnd.test(l)) depth--;
      else if (RE.container.test(l)) depth++;
      var mk = !fence && depth === 0 && /^::(hint|solution)\s*$/.exec(l);
      if (mk) { cur = mk[1]; parts[cur] = []; return; }
      parts[cur].push(l);
    });

    var no = ++this.taskNo;
    var level = Math.min(3, Math.max(1, parseInt(attrs.level || '1', 10)));
    var own = !attrs.source || attrs.source === 'own';
    var html = '<article class="task" id="task-' + no + '">' +
      '<header class="task__header">' +
      '<span class="task__number">' + esc(t('task')) + ' ' + no + '</span>' +
      '<span class="task__level task__level--' + level + '" title="' + esc(t('level' + level)) + '">' + '★★★'.slice(0, level) + '<span class="task__level-text"> ' + esc(t('level' + level)) + '</span></span>' +
      (own
        ? '<span class="task__source task__source--own">' + esc(t('taskOwn')) + '</span>'
        : '<span class="task__source">' + esc(t('taskAdapted')) + ': ' + inline(attrs.source) + '</span>') +
      '</header>' +
      (attrs.title ? '<h3 class="task__title">' + inline(attrs.title) + '</h3>' : '') +
      '<div class="task__body">' + this.blocks(parts.body) + '</div>';
    if (parts.hint) {
      html += '<details class="task__reveal task__reveal--hint"><summary class="task__toggle">' + esc(t('hint')) + '</summary>' +
        '<div class="task__content">' + this.blocks(parts.hint) + '</div></details>';
    }
    if (parts.solution) {
      html += '<details class="task__reveal task__reveal--solution"><summary class="task__toggle">' + esc(t('solution')) + '</summary>' +
        '<div class="task__content">' + this.blocks(parts.solution) + '</div></details>';
    }
    return html + '</article>';
  };

  ASD.markdown = {
    /* Returns { html, headings }. */
    render: function (src, state) {
      var r = new Renderer();
      if (state && state.ids) r.ids = state.ids;
      var html = r.blocks(String(src || '').replace(/\r\n/g, '\n').split('\n'));
      return { html: html, headings: r.headings, ids: r.ids };
    },
    inline: inline
  };
})(window.ASD);
