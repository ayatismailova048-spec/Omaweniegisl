/* Движок: помощники для описания контента */
window.K = {
  tree: {},
  M: {hanafi: 'Ханафитский', maliki: 'Маликитский', shafii: 'Шафиитский', hanbali: 'Ханбалитский'},
  // блоки
  P: function (x) { return {t: 'p', x: x}; },
  H: function (x) { return {t: 'h', x: x}; },
  UL: function (a) { return {t: 'ul', a: a}; },
  SUM: function (x) { return {t: 'sum', x: x}; },
  NOTE: function (x, h) { return {t: 'note', x: x, h: h || 'Важно'}; },
  WARN: function (x, h) { return {t: 'warn', x: x, h: h || 'Осторожно'}; },
  INFO: function (x, h) { return {t: 'info', x: x, h: h || 'Полезно знать'}; },
  AY: function (ar, ru, ref) { return {t: 'ay', ar: ar, ru: ru, ref: ref}; },
  HD: function (x, ref, w) { return {t: 'hd', x: x, ref: ref, w: w}; },
  MZ: function (o, title) { return {t: 'mz', o: o, title: title}; },
  TBL: function (head, rows) { return {t: 'tbl', head: head, rows: rows}; },
  // узлы: T(id, заголовок, описание, значок, блоки или дети, опции)
  T: function (id, title, desc, icon, body, opt) {
    var n = {id: id, title: title, desc: desc, icon: icon};
    if (opt) for (var k in opt) n[k] = opt[k];
    if (body && body.length && body[0].id) n.children = body; else n.blocks = body || [];
    return n;
  }
};
