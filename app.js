(function () {
  var K = window.K, view = document.getElementById('view');
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var me = store('m') || '';

  // ---- мазхаб ----
  function setM(m) {
    me = m || '';
    store('m', me);
    var chips = document.querySelectorAll('#mbar .chip');
    for (var i = 0; i < chips.length; i++) chips[i].classList.toggle('on', chips[i].getAttribute('data-m') === me);
  }
  document.getElementById('mbar').addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    setM(b.getAttribute('data-m')); route(true);
  });

  // ---- блоки ----
  function esc(s) { return s; }
  function blk(b) {
    switch (b.t) {
      case 'p': return '<p>' + b.x + '</p>';
      case 'h': return '<h3 class="sec">' + b.x + '</h3><br>';
      case 'ul': return '<ul class="clean">' + b.a.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>';
      case 'sum': return '<div class="sum"><b>Коротко</b>' + b.x + '</div>';
      case 'note': case 'warn': case 'info': return '<div class="' + b.t + '"><b>' + b.h + '</b>' + b.x + '</div>';
      case 'ay': return '<div class="ayah">' + (b.ar ? '<div class="ar">' + b.ar + '</div>' : '') + '<blockquote>' + b.ru + '</blockquote><div class="ref">' + b.ref + '</div></div>';
      case 'hd': return '<div class="hadith"><span class="t">«' + b.x + '»</span><span class="ref">' + b.ref + '</span>' + (b.w ? '<span class="w">' + b.w + '</span>' : '') + '</div>';
      case 'mz':
        var keys = ['hanafi', 'maliki', 'shafii', 'hanbali'], out = '';
        if (b.o.all) out += '<div class="c all"><h4>Единое мнение</h4>' + b.o.all + '</div>';
        var ord = keys.filter(function (k) { return b.o[k]; });
        if (me && ord.indexOf(me) > 0) { ord.splice(ord.indexOf(me), 1); ord.unshift(me); }
        ord.forEach(function (k) { out += '<div class="c' + (k === me ? ' me' : '') + '"><h4>' + K.M[k] + '</h4>' + b.o[k] + '</div>'; });
        return (b.title ? '<div class="mzt">' + b.title + '</div>' : '') + '<div class="mz' + (me ? ' dim' : '') + '">' + out + '</div>';
      case 'tbl':
        return '<div class="tw"><table><tr>' + b.head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' +
          b.rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></div>';
    }
    return '';
  }

  // ---- поиск узла ----
  function resolve(parts) {
    var node = null, path = [], list = [K.tree.wudu, K.tree.ghusl];
    for (var i = 0; i < parts.length; i++) {
      var found = null;
      for (var j = 0; j < list.length; j++) if (list[j] && list[j].id === parts[i]) found = list[j];
      if (!found) return null;
      node = found; path.push(found); list = found.children || [];
    }
    return {node: node, path: path};
  }
  function href(path) { return '#/' + path.map(function (n) { return n.id; }).join('/'); }

  // ---- экраны ----
  function home() {
    var w = K.tree.wudu, g = K.tree.ghusl;
    return '<h2>Выберите раздел</h2><p class="lead">Нажмите на нужный раздел — внутри всё по шагам: смысл, порядок, правила, доводы и мнения мазхабов.</p>' +
      '<div class="hero">' +
      '<a class="big w" href="#/wudu"><span class="ico">💧</span><h2>Омовение</h2><p>Вуду: зачем нужно, порядок действий, что нарушает, правила</p></a>' +
      '<a class="big g" href="#/ghusl"><span class="ico">🚿</span><h2>Гусль</h2><p>Полное омовение: зачем, когда обязателен, порядок, правила</p></a>' +
      '</div>' +
      '<div class="note"><b>Выберите свой мазхаб</b>Вверху страницы есть переключатель «Мой мазхаб». После выбора его мнение будет подсвечено и поставлено первым на каждой странице.</div>' +
      '<div class="info"><b>Как пользоваться</b>В каждом разделе кнопки идут по порядку омовения. На каждой странице — смысл, хадисы и аяты, а также мнения четырёх мазхабов. Внизу страниц есть кнопки «назад» и «дальше».</div>' +
      '<div class="warn"><b>Оговорка</b>Приложение справочное. В спорных и сложных случаях (болезнь, повязка, постоянные выделения) спросите знающего человека.</div>';
  }

  function crumbs(path) {
    var h = '<div class="crumbs"><a href="#/">Главная</a>';
    path.forEach(function (n, i) {
      h += '<i>›</i>' + (i === path.length - 1 ? n.title : '<a href="' + href(path.slice(0, i + 1)) + '">' + n.title + '</a>');
    });
    return h + '</div>';
  }

  function menu(r) {
    var node = r.node, h = crumbs(r.path) + '<h2>' + node.title + '</h2>' + (node.lead ? '<p class="lead">' + node.lead + '</p>' : '');
    if (node.blocks && node.blocks.length) h += node.blocks.map(blk).join('');
    h += '<div class="list">';
    node.children.forEach(function (c) {
      var cls = 'item' + (c.kind ? ' ' + c.kind : '');
      var badge = c.n ? '<div class="n">' + c.n + '</div>' : '<div class="n e">' + (c.icon || '•') + '</div>';
      h += (c.sep ? '<div class="sep">' + c.sep + '</div>' : '') +
        '<a class="' + cls + '" href="' + href(r.path.concat([c])) + '">' + badge + '<span><b>' + c.title + '</b>' + (c.desc ? '<small>' + c.desc + '</small>' : '') + '</span><span class="go">›</span></a>';
    });
    return h + '</div>';
  }

  function leaf(r) {
    var node = r.node, parent = r.path[r.path.length - 2];
    var h = crumbs(r.path) + '<h2>' + node.title + '</h2>' + (node.lead ? '<p class="lead">' + node.lead + '</p>' : '') + node.blocks.map(blk).join('');
    if (parent && parent.children) {
      var sib = parent.children, i = sib.indexOf(node), base = r.path.slice(0, -1);
      h += '<div class="pager">' +
        (i > 0 ? '<a href="' + href(base.concat([sib[i - 1]])) + '"><small>← Назад</small>' + sib[i - 1].title + '</a>' : '') +
        (i < sib.length - 1 ? '<a class="next" href="' + href(base.concat([sib[i + 1]])) + '"><small>Дальше →</small>' + sib[i + 1].title + '</a>' : '') +
        '</div><a class="up" href="' + href(base) + '">↑ К списку: ' + parent.title + '</a>';
    }
    return h;
  }

  function route(keep) {
    var parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    var html;
    if (!parts.length) html = home();
    else {
      var r = resolve(parts);
      html = !r ? home() : (r.node.children ? menu(r) : leaf(r));
    }
    
    view.innerHTML = html;
    view.style.animation = 'none'; void view.offsetWidth; view.style.animation = '';
    if (keep !== true) window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', function () { route(); });
  setM(me); route();
})();
