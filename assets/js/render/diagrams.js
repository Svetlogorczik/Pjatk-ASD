/*
 * Diagrams written as text inside Markdown fences:
 *
 * ```tree            nested notation: key(left,right) or key(c1,c2,c3...); "_" = empty child
 * 8(3(12,6(1,9)),15(_,10(4,7)))
 * ```                "*8" highlights a node, "8[-1]" adds a small note (e.g. balance factor)
 *
 * ```graph           node lines: "A 70 50 [hl]"; edge lines: "A-B 4 [hl|dim]" ("A>B" = directed)
 * A 70 50
 * B 200 50
 * A-B 4
 * ```
 *
 * ```array           one row per line, optional "label: " prefix; "@idx" or "@idx 1" adds an index row
 * @idx
 * start: 12 5 [3] (14) {8} ~7~ | 9
 * ```                [x] highlighted, (x) pivot, {x} final place, ~x~ dimmed, "|" divider, "_" empty cell
 */
(function (ASD) {
  'use strict';

  var esc = ASD.util.escapeHtml;

  /* ---------- tree ---------- */

  function parseTree(src) {
    var s = src.replace(/\s+/g, '');
    var pos = 0;

    function node() {
      if (pos >= s.length || s[pos] === ',' || s[pos] === ')') return null;
      if (s[pos] === '_' || s[pos] === '·') { pos++; return null; }
      var m = /^(\*?)([^(),\[\]]+)(\[([^\]]*)\])?/.exec(s.slice(pos));
      if (!m) throw new Error('tree syntax near: ' + s.slice(pos, pos + 10));
      pos += m[0].length;
      var n = { label: m[2], hl: m[1] === '*', note: m[4] || null, children: [] };
      if (s[pos] === '(') {
        pos++;
        n.children.push(node());
        while (s[pos] === ',') { pos++; n.children.push(node()); }
        if (s[pos] !== ')') throw new Error('tree: expected ")"');
        pos++;
      }
      return n;
    }
    return node();
  }

  function tree(src) {
    var root = parseTree(src.trim());
    if (!root) return '';
    var R = 17, DX = 42, DY = 62, PAD = 26;
    var maxDepth = 0, minX = Infinity, maxX = -Infinity;
    var binary = true;
    (function check(n) {
      if (!n) return;
      if (n.children.length > 2) binary = false;
      n.children.forEach(check);
    })(root);

    if (binary) {
      /* Binary tree: in-order layout, so horizontal order = in-order (nice for BST). */
      var order = 0;
      (function layout(n, d) {
        if (!n) return;
        layout(n.children[0] || null, d + 1);
        n.x = order++ * DX; n.y = d * DY;
        maxDepth = Math.max(maxDepth, d);
        layout(n.children[1] || null, d + 1);
      })(root, 0);
    } else {
      /* General tree: leaves get consecutive slots, a parent is centred over its children. */
      var slot = 0;
      (function layout(n, d) {
        n.y = d * DY;
        maxDepth = Math.max(maxDepth, d);
        var xs = [];
        n.children.forEach(function (c) {
          if (c) { layout(c, d + 1); xs.push(c.x); } else xs.push(slot++ * DX);
        });
        n.x = xs.length && n.children.some(Boolean) ? (xs[0] + xs[xs.length - 1]) / 2 : slot++ * DX;
      })(root, 0);
    }
    (function bounds(n) {
      if (!n) return;
      minX = Math.min(minX, n.x); maxX = Math.max(maxX, n.x);
      n.children.forEach(bounds);
    })(root);
    (function shift(n) {
      if (!n) return;
      n.x -= minX;
      n.children.forEach(shift);
    })(root);

    var w = (maxX - minX) + PAD * 2;
    var h = maxDepth * DY + PAD * 2 + 8;
    var edges = '', nodes = '';

    (function draw(n) {
      if (!n) return;
      n.children.forEach(function (c) {
        if (c) edges += '<line class="diagram__edge" x1="' + (n.x + PAD) + '" y1="' + (n.y + PAD + 6) + '" x2="' + (c.x + PAD) + '" y2="' + (c.y + PAD + 6) + '"/>';
        draw(c);
      });
      var cx = n.x + PAD, cy = n.y + PAD + 6;
      nodes += '<g class="diagram__node' + (n.hl ? ' diagram__node--hl' : '') + '">' +
        '<circle class="diagram__circle" cx="' + cx + '" cy="' + cy + '" r="' + R + '"/>' +
        '<text class="diagram__label" x="' + cx + '" y="' + cy + '">' + esc(n.label) + '</text>' +
        (n.note != null ? '<text class="diagram__note" x="' + (cx + R + 2) + '" y="' + (cy - R + 2) + '">' + esc(n.note) + '</text>' : '') +
        '</g>';
    })(root);

    return '<svg class="diagram__svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" role="img">' + edges + nodes + '</svg>';
  }

  /* ---------- graph ---------- */

  function graph(src) {
    var nodes = {}, edges = [], directed = false;
    src.trim().split('\n').forEach(function (line) {
      line = line.trim();
      if (!line || line[0] === '#') return;
      if (line === 'directed') { directed = true; return; }
      var e = /^(\S+?)([->])(\S+)\s*(\S*)\s*(hl|dim)?$/.exec(line);
      var p = line.split(/\s+/);
      if (p.length >= 3 && !isNaN(+p[1]) && !isNaN(+p[2])) {
        nodes[p[0]] = { x: +p[1], y: +p[2], hl: p[3] === 'hl' };
      } else if (e) {
        var flag = e[5] || (e[4] === 'hl' || e[4] === 'dim' ? e[4] : '');
        edges.push({ a: e[1], b: e[3], arrow: e[2] === '>' || directed, w: (e[4] === 'hl' || e[4] === 'dim') ? '' : e[4], flag: flag });
      }
    });

    var R = 17, minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    Object.keys(nodes).forEach(function (k) {
      var n = nodes[k];
      minX = Math.min(minX, n.x); minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x); maxY = Math.max(maxY, n.y);
    });
    var PAD = 28, ox = PAD - minX, oy = PAD - minY;
    var w = maxX - minX + 2 * PAD, h = maxY - minY + 2 * PAD;

    var out = '<svg class="diagram__svg" viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" role="img">' +
      '<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
      '<path class="diagram__arrow" d="M0 0L10 5L0 10z"/></marker></defs>';

    edges.forEach(function (e) {
      var a = nodes[e.a], b = nodes[e.b];
      if (!a || !b) return;
      var x1 = a.x + ox, y1 = a.y + oy, x2 = b.x + ox, y2 = b.y + oy;
      var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy) || 1;
      var sx = x1 + dx / len * R, sy = y1 + dy / len * R, ex = x2 - dx / len * (R + (e.arrow ? 3 : 0)), ey = y2 - dy / len * (R + (e.arrow ? 3 : 0));
      out += '<line class="diagram__edge' + (e.flag ? ' diagram__edge--' + e.flag : '') + '" x1="' + sx + '" y1="' + sy + '" x2="' + ex + '" y2="' + ey + '"' + (e.arrow ? ' marker-end="url(#arrow)"' : '') + '/>';
      if (e.w) {
        var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        out += '<g class="diagram__weight' + (e.flag ? ' diagram__weight--' + e.flag : '') + '"><rect class="diagram__weight-bg" x="' + (mx - 11) + '" y="' + (my - 10) + '" width="22" height="20" rx="6"/>' +
          '<text class="diagram__weight-text" x="' + mx + '" y="' + my + '">' + esc(e.w) + '</text></g>';
      }
    });
    Object.keys(nodes).forEach(function (k) {
      var n = nodes[k];
      out += '<g class="diagram__node' + (n.hl ? ' diagram__node--hl' : '') + '"><circle class="diagram__circle" cx="' + (n.x + ox) + '" cy="' + (n.y + oy) + '" r="' + R + '"/>' +
        '<text class="diagram__label" x="' + (n.x + ox) + '" y="' + (n.y + oy) + '">' + esc(k) + '</text></g>';
    });
    return out + '</svg>';
  }

  /* ---------- array ---------- */

  function cell(tok) {
    var m, mod = '';
    if (tok === '|') return '<span class="array-view__divider" aria-hidden="true"></span>';
    if (tok === '_') return '<span class="array-view__cell array-view__cell--empty"></span>';
    if ((m = /^\[(.*)\]$/.exec(tok))) { mod = 'hl'; tok = m[1]; }
    else if ((m = /^\((.*)\)$/.exec(tok))) { mod = 'pivot'; tok = m[1]; }
    else if ((m = /^\{(.*)\}$/.exec(tok))) { mod = 'done'; tok = m[1]; }
    else if ((m = /^~(.*)~$/.exec(tok))) { mod = 'dim'; tok = m[1]; }
    return '<span class="array-view__cell' + (mod ? ' array-view__cell--' + mod : '') + '">' + esc(tok) + '</span>';
  }

  function array(src) {
    var rows = '', idxStart = null, width = 0;
    var lines = src.trim().split('\n');
    var parsed = [];
    lines.forEach(function (line) {
      line = line.trim();
      if (!line) return;
      var m = /^@idx\s*(\d*)/.exec(line);
      if (m) { idxStart = m[1] ? +m[1] : 0; return; }
      var label = '';
      var lm = /^([^:\s][^:]*?):\s+(.*)$/.exec(line);
      if (lm && !/^[\[\(\{~]/.test(line)) { label = lm[1]; line = lm[2]; }
      var toks = line.split(/\s+/);
      width = Math.max(width, toks.filter(function (t) { return t !== '|'; }).length);
      parsed.push({ label: label, toks: toks });
    });
    var hasLabels = parsed.some(function (r) { return r.label; });

    if (idxStart !== null) {
      var idx = '';
      for (var i = 0; i < width; i++) idx += '<span class="array-view__index">' + (i + idxStart) + '</span>';
      rows += '<div class="array-view__row array-view__row--index">' + (hasLabels ? '<span class="array-view__label"></span>' : '') + '<span class="array-view__cells">' + idx + '</span></div>';
    }
    parsed.forEach(function (r) {
      rows += '<div class="array-view__row">' + (hasLabels ? '<span class="array-view__label">' + esc(r.label) + '</span>' : '') +
        '<span class="array-view__cells">' + r.toks.map(cell).join('') + '</span></div>';
    });
    return '<div class="array-view">' + rows + '</div>';
  }

  ASD.diagrams = {
    render: function (kind, src) {
      try {
        if (kind === 'tree') return '<figure class="diagram diagram--tree">' + tree(src) + '</figure>';
        if (kind === 'graph') return '<figure class="diagram diagram--graph">' + graph(src) + '</figure>';
        if (kind === 'array') return '<figure class="diagram diagram--array">' + array(src) + '</figure>';
      } catch (e) {
        return '<pre class="diagram diagram--error">' + esc(e.message) + '</pre>';
      }
      return '';
    }
  };
})(window.ASD);
