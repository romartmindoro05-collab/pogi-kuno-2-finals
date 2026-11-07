(function () {
  var CART = "martha.cart";
  var WISH = "martha.wishlist";
  var SESSION = "martha.session";
  var DRAFT = "martha.draft";
  var ORDER = "martha.order";
  var listeners = [];

  function read(storage, key, fallback) {
    try {
      var raw = storage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function write(storage, key, value) {
    storage.setItem(key, JSON.stringify(value));
  }

  function cartItems() {
    return read(localStorage, CART, []);
  }

  function wishIds() {
    return read(localStorage, WISH, []);
  }

  function session() {
    return read(localStorage, SESSION, { recent: [], query: "" });
  }

  function snapshot() {
    var items = cartItems().map(function (item) {
      var product = window.Martha.getProduct(item.id);
      if (!product) return null;
      return {
        id: item.id,
        qty: item.qty,
        product: product,
        line: product.price * item.qty
      };
    }).filter(Boolean);
    var subtotal = items.reduce(function (sum, item) { return sum + item.line; }, 0);
    var count = items.reduce(function (sum, item) { return sum + item.qty; }, 0);
    return {
      items: items,
      subtotal: subtotal,
      count: count,
      wishlist: wishIds(),
      session: session()
    };
  }

  function emit() {
    var snap = snapshot();
    listeners.forEach(function (fn) { fn(snap); });
  }

  function add(id, qty) {
    var product = window.Martha.getProduct(id);
    var amount = Math.max(1, Number(qty) || 1);
    if (!product || product.stock < 1) return { ok: false, reason: "sold" };
    var items = cartItems();
    var found = null;
    items.forEach(function (item) {
      if (item.id === id) found = item;
    });
    var nextQty = (found ? found.qty : 0) + amount;
    if (nextQty > product.stock) return { ok: false, reason: "stock" };
    if (found) found.qty = nextQty;
    else items.push({ id: id, qty: amount });
    write(localStorage, CART, items);
    emit();
    return { ok: true };
  }

  function setQty(id, qty) {
    var product = window.Martha.getProduct(id);
    var next = Math.max(0, Number(qty) || 0);
    if (product && next > product.stock) next = product.stock;
    var items = cartItems().filter(function (item) { return item.id !== id; });
    if (next > 0) items.push({ id: id, qty: next });
    write(localStorage, CART, items);
    emit();
  }

  function remove(id) {
    write(localStorage, CART, cartItems().filter(function (item) { return item.id !== id; }));
    emit();
  }

  function toggleWish(id) {
    var ids = wishIds();
    var has = ids.indexOf(id) !== -1;
    write(localStorage, WISH, has ? ids.filter(function (item) { return item !== id; }) : ids.concat(id));
    emit();
    return !has;
  }

  function wished(id) {
    return wishIds().indexOf(id) !== -1;
  }

  function remember(id) {
    var current = session();
    current.recent = [id].concat(current.recent.filter(function (item) { return item !== id; })).slice(0, 4);
    write(localStorage, SESSION, current);
  }

  function rememberQuery(query) {
    var current = session();
    current.query = query || "";
    write(localStorage, SESSION, current);
  }

  function draft(value) {
    if (typeof value === "undefined") return read(sessionStorage, DRAFT, null);
    write(sessionStorage, DRAFT, value);
    return value;
  }

  function placeOrder(info) {
    var snap = snapshot();
    var order = {
      id: "MF-" + String(Date.now()).slice(-6),
      items: snap.items.map(function (item) {
        return { id: item.id, name: item.product.name, qty: item.qty, line: item.line };
      }),
      subtotal: snap.subtotal,
      name: info.name,
      email: info.email,
      city: info.city,
      when: new Date().toISOString()
    };
    write(sessionStorage, ORDER, order);
    sessionStorage.removeItem(DRAFT);
    write(localStorage, CART, []);
    emit();
    return order;
  }

  function lastOrder() {
    return read(sessionStorage, ORDER, null);
  }

  window.Martha = window.Martha || {};
  window.Martha.store = {
    subscribe: function (fn) {
      listeners.push(fn);
      fn(snapshot());
    },
    add: add,
    setQty: setQty,
    remove: remove,
    toggleWish: toggleWish,
    wished: wished,
    remember: remember,
    rememberQuery: rememberQuery,
    draft: draft,
    placeOrder: placeOrder,
    lastOrder: lastOrder,
    snapshot: snapshot
  };
})();
