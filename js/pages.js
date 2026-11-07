(function () {
  var money = window.Martha.money;
  var esc = window.Martha.esc;

  function stars(n) {
    var marks = "";
    for (var i = 1; i <= 5; i += 1) marks += i <= n ? "★" : "☆";
    return '<p class="stars" aria-label="' + n + " out of 5 stars" + '">' + marks + "</p>";
  }

  function card(product) {
    var sold = product.stock < 1;
    var sale = product.was > product.price;
    var saved = window.Martha.store.wished(product.id);
    return (
      '<article class="card">' +
        '<a class="card-photo" href="product.html?id=' + product.id + '">' +
          '<img src="' + product.image + '" alt="' + esc(product.name + ". " + product.lead) + '" loading="lazy">' +
          (sold ? '<span class="flag">Sold out</span>' : sale ? '<span class="flag flag-sale">Sale</span>' : "") +
        "</a>" +
        '<div><h3><a href="product.html?id=' + product.id + '">' + esc(product.name) + "</a></h3>" +
        '<p class="price">' + money(product.price) + (sale ? " <s>" + money(product.was) + "</s>" : "") + "</p>" +
        stars(product.rating) + "</div>" +
        '<button class="btn btn-cart" type="button" data-add="' + product.id + '"' + (sold ? " disabled" : "") + ">" + (sold ? "Sold out" : "Add to cart") + "</button>" +
        '<button class="save' + (saved ? " is-on" : "") + '" type="button" data-wish="' + product.id + '" aria-pressed="' + (saved ? "true" : "false") + '" aria-label="Save ' + esc(product.name) + '">' + (saved ? "Saved" : "Save") + "</button>" +
      "</article>"
    );
  }

  function byFeatured(a, b) { return a.featured - b.featured; }
  function byNewest(a, b) { return a.newest - b.newest; }

  function renderHome() {
    var products = window.Martha.products.slice();
    var deals = products.filter(function (item) { return item.was > item.price; }).sort(byFeatured).slice(0, 4);
    var loved = products.filter(function (item) { return item.stock > 0; }).sort(function (a, b) { return b.rating - a.rating || a.featured - b.featured; }).slice(0, 4);
    var dealsNode = document.querySelector("[data-deals]");
    var lovedNode = document.querySelector("[data-loved]");
    if (dealsNode) dealsNode.innerHTML = deals.map(card).join("");
    if (lovedNode) lovedNode.innerHTML = loved.map(card).join("");
    document.querySelectorAll("[data-skeleton]").forEach(function (node) { node.hidden = true; });
    var recent = document.querySelector("[data-recent]");
    if (!recent) return;
    var ids = window.Martha.store.snapshot().session.recent;
    var items = ids.map(window.Martha.getProduct).filter(Boolean);
    if (!items.length) return;
    recent.hidden = false;
    recent.querySelector("[data-recent-grid]").innerHTML = items.map(card).join("");
  }

  function filtersFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return {
      q: params.get("q") || "",
      categories: (params.get("category") || "").split(",").filter(Boolean),
      vases: (params.get("vase") || "").split(",").filter(Boolean),
      price: params.get("price") || "all",
      stock: params.get("stock") === "1",
      sort: params.get("sort") || "featured"
    };
  }

  function writeUrl(filters) {
    var params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.categories.length) params.set("category", filters.categories.join(","));
    if (filters.vases.length) params.set("vase", filters.vases.join(","));
    if (filters.price !== "all") params.set("price", filters.price);
    if (filters.stock) params.set("stock", "1");
    if (filters.sort !== "featured") params.set("sort", filters.sort);
    var next = params.toString();
    window.history.replaceState(null, "", next ? "shop.html?" + next : "shop.html");
  }

  function inPrice(product, band) {
    if (band === "all") return true;
    var parts = band.split("-");
    return product.price >= Number(parts[0]) && product.price <= Number(parts[1]);
  }

  function apply(list, filters) {
    var q = filters.q.toLowerCase();
    var next = list.filter(function (product) {
      var blob = (product.name + " " + product.category + " " + product.vase + " " + product.lead).toLowerCase();
      if (q && blob.indexOf(q) === -1) return false;
      if (filters.categories.length && filters.categories.indexOf(product.category) === -1) return false;
      if (filters.vases.length && filters.vases.indexOf(product.vase) === -1) return false;
      if (!inPrice(product, filters.price)) return false;
      if (filters.stock && product.stock < 1) return false;
      return true;
    });
    next.sort(function (a, b) {
      if (filters.sort === "newest") return a.newest - b.newest;
      if (filters.sort === "price-asc") return a.price - b.price;
      if (filters.sort === "price-desc") return b.price - a.price;
      if (filters.sort === "name") return a.name.localeCompare(b.name);
      return a.featured - b.featured;
    });
    return next;
  }

  function syncForm(filters) {
    var search = document.querySelector("[data-catalog-search]");
    var header = document.querySelector("[data-header-search]");
    if (search) search.value = filters.q;
    if (header) header.value = filters.q;
    document.querySelectorAll('input[name="category"]').forEach(function (input) {
      input.checked = filters.categories.indexOf(input.value) !== -1;
    });
    document.querySelectorAll('input[name="vase"]').forEach(function (input) {
      input.checked = filters.vases.indexOf(input.value) !== -1;
    });
    var price = document.querySelector('input[name="price"][value="' + filters.price + '"]');
    if (price) price.checked = true;
    var stock = document.querySelector('input[name="stock"]');
    if (stock) stock.checked = filters.stock;
    var sort = document.querySelector("[data-sort]");
    if (sort) sort.value = filters.sort;
  }

  function selected(name) {
    return Array.prototype.slice.call(document.querySelectorAll('input[name="' + name + '"]:checked')).map(function (input) {
      return input.value;
    });
  }

  function renderShop() {
    var filters = filtersFromUrl();
    syncForm(filters);
    window.Martha.store.rememberQuery(filters.q);
    var list = apply(window.Martha.products, filters);
    var grid = document.querySelector("[data-grid]");
    var empty = document.querySelector("[data-empty]");
    var count = document.querySelector("[data-count]");
    document.querySelector("[data-shop-skeleton]").hidden = true;
    count.textContent = list.length + (list.length === 1 ? " bouquet" : " bouquets");
    if (!list.length) {
      grid.hidden = true;
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    grid.hidden = false;
    grid.innerHTML = list.map(card).join("");
  }

  function readFormFilters() {
    return {
      q: document.querySelector("[data-catalog-search]").value.trim(),
      categories: selected("category"),
      vases: selected("vase"),
      price: (document.querySelector('input[name="price"]:checked') || { value: "all" }).value,
      stock: document.querySelector('input[name="stock"]').checked,
      sort: document.querySelector("[data-sort]").value
    };
  }

  function bindShop() {
    var form = document.querySelector("[data-filters]");
    function go() {
      writeUrl(readFormFilters());
      renderShop();
    }
    form.addEventListener("input", function () {
      var header = document.querySelector("[data-header-search]");
      var search = document.querySelector("[data-catalog-search]");
      if (header && document.activeElement === search) header.value = search.value;
      go();
    });
    form.addEventListener("change", go);
    document.querySelector("[data-sort]").addEventListener("change", go);
    document.querySelectorAll("[data-clear]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.history.replaceState(null, "", "shop.html");
        renderShop();
      });
    });
    var header = document.querySelector("[data-header-search]");
    if (header) {
      header.addEventListener("input", function () {
        document.querySelector("[data-catalog-search]").value = header.value;
        go();
      });
    }
    var desktop = window.matchMedia("(min-width: 64rem)");
    var more = document.querySelector("[data-more]");
    if (more && desktop.matches) more.open = true;
  }

  function renderProduct() {
    var id = new URLSearchParams(window.location.search).get("id");
    var product = window.Martha.getProduct(id);
    var shell = document.querySelector("[data-product]");
    var missing = document.querySelector("[data-missing]");
    document.querySelector("[data-product-skeleton]").hidden = true;
    if (!product) {
      shell.hidden = true;
      missing.hidden = false;
      return;
    }
    window.Martha.store.remember(product.id);
    document.title = product.name + " — Martha's Flowers";
    var sold = product.stock < 1;
    var sale = product.was > product.price;
    var saved = window.Martha.store.wished(product.id);
    shell.innerHTML =
      '<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="shop.html?category=' + encodeURIComponent(product.category) + '">' + esc(product.category) + "</a> / <span>" + esc(product.name) + "</span></nav>" +
      '<div class="pdp"><div class="gallery-main"><img src="' + product.image + '" alt="' + esc(product.name + ". " + product.lead) + '"></div>' +
      '<div class="buy"><p class="caption">' + esc(product.category) + " · " + esc(product.vase) + "</p><h1>" + esc(product.name) + "</h1>" +
      '<p class="price price-lg">' + money(product.price) + (sale ? " <s>" + money(product.was) + "</s>" : "") + "</p>" +
      stars(product.rating) +
      "<p>" + esc(product.lead) + "</p><p>" + esc(product.story) + "</p>" +
      '<div class="buy-row"><label for="qty">Quantity</label><div class="stepper"><button type="button" data-local-qty="-1" aria-label="Decrease quantity">−</button><input id="qty" value="1" inputmode="numeric"><button type="button" data-local-qty="1" aria-label="Increase quantity">+</button></div></div>' +
      '<button class="btn btn-primary" type="button" data-add="' + product.id + '" data-qty-value="1"' + (sold ? " disabled" : "") + ">" + (sold ? "Sold out" : "Add to cart") + "</button>" +
      '<button class="save' + (saved ? " is-on" : "") + '" type="button" data-wish="' + product.id + '" aria-pressed="' + saved + '">' + (saved ? "Saved" : "Save") + "</button>" +
      '<p class="help">' + (sold ? "Save it. The next stems are not in yet." : product.stock + " in the cooler today.") + "</p>" +
      '<div class="fold"><details open><summary>Care</summary><p>' + esc(product.care) + "</p></details>" +
      "<details><summary>Delivery</summary><p>Order before noon and we can run it across town the same day. Over $80, wrapping is included. This checkout does not charge a card.</p></details></div></div></div>" +
      '<section class="related"><h2>More in ' + esc(product.category) + '</h2><div class="product-grid">' +
      window.Martha.products.filter(function (item) { return item.category === product.category && item.id !== product.id; }).slice(0, 4).map(card).join("") +
      "</div></section>";
    shell.hidden = false;
    var qty = shell.querySelector("#qty");
    shell.addEventListener("click", function (event) {
      var step = event.target.closest("[data-local-qty]");
      if (!step) return;
      var max = Math.max(1, product.stock || 1);
      var next = Math.min(max, Math.max(1, Number(qty.value || 1) + Number(step.getAttribute("data-local-qty"))));
      qty.value = String(next);
      shell.querySelector("[data-add]").setAttribute("data-qty-value", String(next));
    });
  }

  function renderCart(snap) {
    var root = document.querySelector("[data-cart-page]");
    if (!root) return;
    if (!snap.items.length) {
      root.innerHTML = '<div class="empty"><h1>Your cart is empty</h1><p>Bouquets you add stay in this browser.</p><a class="btn btn-primary" href="shop.html">Browse bouquets</a></div>';
      return;
    }
    root.innerHTML =
      '<h1>Cart</h1><div class="cart-layout"><div>' + snap.items.map(function (item) {
        return '<article class="cart-row"><a class="cart-art" href="product.html?id=' + item.id + '"><img src="' + item.product.image + '" alt=""></a><div><h2><a href="product.html?id=' + item.id + '">' + esc(item.product.name) + "</a></h2><p>" + money(item.product.price) + "</p>" +
          '<div class="stepper"><button type="button" data-qty="' + item.id + '" data-delta="-1" aria-label="Decrease ' + esc(item.product.name) + '">−</button><span>' + item.qty + '</span><button type="button" data-qty="' + item.id + '" data-delta="1" aria-label="Increase ' + esc(item.product.name) + '">+</button></div>' +
          '<button class="text-btn" type="button" data-remove="' + item.id + '">Remove</button></div><p class="price">' + money(item.line) + "</p></article>";
      }).join("") + '</div><aside class="summary"><h2>Summary</h2><p class="subtotal"><span>Subtotal</span><strong>' + money(snap.subtotal) + "</strong></p><p>Wrapping is included over $80.</p><a class=\"btn btn-primary\" href=\"checkout.html\">Checkout</a></aside></div>";
  }

  function renderWish(snap) {
    var root = document.querySelector("[data-wish-page]");
    if (!root) return;
    var items = snap.wishlist.map(window.Martha.getProduct).filter(Boolean);
    if (!items.length) {
      root.innerHTML = '<div class="empty"><h1>Nothing saved</h1><p>Save a bouquet and it stays on this browser.</p><a class="btn btn-primary" href="shop.html">Browse bouquets</a></div>';
      return;
    }
    root.innerHTML = '<h1>Saved</h1><div class="product-grid">' + items.map(card).join("") + "</div>";
  }

  function luhn(value) {
    var digits = value.replace(/\D/g, "");
    if (digits.length < 13 || digits.length > 19) return false;
    var sum = 0;
    var alt = false;
    for (var i = digits.length - 1; i >= 0; i -= 1) {
      var n = Number(digits[i]);
      if (alt) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      alt = !alt;
    }
    return sum % 10 === 0;
  }

  function expiryOk(value) {
    var match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value.trim());
    if (!match) return false;
    var month = Number(match[1]);
    var year = 2000 + Number(match[2]);
    var now = new Date();
    var end = new Date(year, month, 1);
    return end > now;
  }

  var rules = {
    name: { test: function (v) { return /^[A-Za-z][A-Za-z' .-]{1,}$/.test(v.trim()); }, msg: "Enter a name using letters." },
    email: { test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }, msg: "That email does not look complete." },
    phone: { test: function (v) { return v.trim() === "" || /^[0-9()+\-\s]{7,}$/.test(v.trim()); }, msg: "Use digits, spaces, or dashes." },
    address: { test: function (v) { return v.trim().length >= 5; }, msg: "Add a street address." },
    city: { test: function (v) { return /^[A-Za-z][A-Za-z .'-]{1,}$/.test(v.trim()); }, msg: "Enter a city." },
    postal: { test: function (v) { return /^\d{5}$/.test(v.trim()); }, msg: "Use a 5-digit ZIP." },
    card: { test: luhn, msg: "That card number failed the check. Try 4242 4242 4242 4242." },
    expiry: { test: expiryOk, msg: "Use a future date as MM/YY." },
    cvc: { test: function (v) { return /^\d{3}$/.test(v.trim()); }, msg: "CVC is 3 digits." }
  };

  function checkField(input, showEmpty) {
    var rule = rules[input.name];
    var field = input.closest(".field");
    var error = field.querySelector(".field-error");
    var blank = input.value.trim() === "";
    var ok = rule.test(input.value);
    if (input.name === "phone" && blank) {
      field.classList.remove("is-invalid", "is-valid");
      error.textContent = "";
      input.removeAttribute("aria-invalid");
      return true;
    }
    var show = !ok && (!blank || showEmpty);
    field.classList.toggle("is-invalid", show);
    field.classList.toggle("is-valid", ok && !blank);
    error.textContent = show ? rule.msg : "";
    if (show) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
    return ok;
  }

  function renderCheckout() {
    var form = document.querySelector("[data-checkout]");
    var empty = document.querySelector("[data-checkout-empty]");
    var snap = window.Martha.store.snapshot();
    if (!snap.items.length) {
      form.hidden = true;
      empty.hidden = false;
      return;
    }
    form.hidden = false;
    empty.hidden = true;
    document.querySelector("[data-pay-total]").textContent = money(snap.subtotal);
    var saved = window.Martha.store.draft();
    if (saved) {
      Object.keys(saved).forEach(function (key) {
        if (form.elements[key] && key !== "card" && key !== "cvc") form.elements[key].value = saved[key];
      });
    }
    function draftFromForm() {
      var data = {};
      ["name", "email", "phone", "address", "city", "postal", "expiry"].forEach(function (key) {
        data[key] = form.elements[key].value;
      });
      window.Martha.store.draft(data);
    }
    form.addEventListener("input", function (event) {
      if (event.target.name && rules[event.target.name]) checkField(event.target);
      draftFromForm();
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var ok = true;
      ["name", "email", "phone", "address", "city", "postal", "card", "expiry", "cvc"].forEach(function (key) {
        if (!checkField(form.elements[key], true)) ok = false;
      });
      if (!ok) {
        var bad = form.querySelector(".is-invalid input");
        if (bad) bad.focus();
        return;
      }
      window.Martha.store.placeOrder({
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        city: form.elements.city.value.trim()
      });
      window.location.href = "confirmation.html";
    });
  }

  function renderConfirmation() {
    var root = document.querySelector("[data-order]");
    var order = window.Martha.store.lastOrder();
    if (!order) {
      root.innerHTML = '<div class="empty"><h1>No order in this tab</h1><p>Place an order and the receipt stays until you close the tab.</p><a class="btn btn-primary" href="shop.html">Browse bouquets</a></div>';
      return;
    }
    root.innerHTML =
      '<p class="caption">Order ' + esc(order.id) + "</p><h1>We have it, " + esc(order.name.split(" ")[0]) + ".</h1>" +
      "<p class=\"lede\">A receipt for " + esc(order.email) + ". Nothing was charged. The flowers are imaginary, the form is not.</p>" +
      "<ul class=\"receipt\">" + order.items.map(function (item) {
        return "<li><span>" + item.qty + " × " + esc(item.name) + "</span><span>" + money(item.line) + "</span></li>";
      }).join("") + "</ul>" +
      '<p class="subtotal"><span>Subtotal</span><strong>' + money(order.subtotal) + "</strong></p>" +
      "<p>Deliver to " + esc(order.city) + ".</p>";
  }

  var page = document.body.dataset.page;
  if (page === "home") renderHome();
  if (page === "shop") {
    bindShop();
    renderShop();
  }
  if (page === "product") renderProduct();
  if (page === "cart") {
    window.Martha.renderCart = renderCart;
    renderCart(window.Martha.store.snapshot());
  }
  if (page === "wish") {
    window.Martha.renderWish = renderWish;
    renderWish(window.Martha.store.snapshot());
  }
  if (page === "checkout") renderCheckout();
  if (page === "confirm") renderConfirmation();
})();
