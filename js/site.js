(function () {
  var lastFocus = null;

  function toast(message) {
    var node = document.querySelector("[data-toast]");
    if (!node) return;
    node.textContent = message;
    node.classList.add("is-on");
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(function () {
      node.classList.remove("is-on");
    }, 2200);
  }

  function line(item) {
    return (
      '<article class="cart-line">' +
        '<a class="cart-art" href="product.html?id=' + item.id + '"><img src="' + item.product.image + '" alt=""></a>' +
        '<div><h3><a href="product.html?id=' + item.id + '">' + item.product.name + '</a></h3>' +
        '<p>' + window.Martha.money(item.product.price) + '</p>' +
        '<div class="stepper"><button type="button" data-qty="' + item.id + '" data-delta="-1" aria-label="Decrease ' + item.product.name + '">−</button><span>' + item.qty + '</span><button type="button" data-qty="' + item.id + '" data-delta="1" aria-label="Increase ' + item.product.name + '">+</button></div></div>' +
        '<button class="text-btn" type="button" data-remove="' + item.id + '">Remove</button>' +
      '</article>'
    );
  }

  function renderDrawer(snap) {
    var body = document.querySelector("[data-drawer-body]");
    var foot = document.querySelector("[data-drawer-foot]");
    if (!body || !foot) return;
    if (!snap.items.length) {
      body.innerHTML = '<div class="empty"><p>Your cart is empty.</p><a class="btn btn-primary" href="shop.html">Browse bouquets</a></div>';
      foot.innerHTML = "";
      return;
    }
    body.innerHTML = snap.items.map(line).join("");
    foot.innerHTML =
      '<p class="subtotal"><span>Subtotal</span><strong>' + window.Martha.money(snap.subtotal) + '</strong></p>' +
      '<a class="btn btn-primary" href="checkout.html">Checkout</a>' +
      '<a class="text-btn" href="cart.html">Review cart</a>';
  }

  function paint(snap) {
    document.querySelectorAll("[data-cart-count]").forEach(function (node) {
      node.textContent = String(snap.count);
    });
    document.querySelectorAll("[data-wish-count]").forEach(function (node) {
      node.textContent = String(snap.wishlist.length);
    });
    document.querySelectorAll("[data-wish]").forEach(function (node) {
      var on = snap.wishlist.indexOf(node.getAttribute("data-wish")) !== -1;
      node.setAttribute("aria-pressed", on ? "true" : "false");
      node.classList.toggle("is-on", on);
      node.textContent = on ? "Saved" : "Save";
    });
    renderDrawer(snap);
    if (window.Martha.renderCart) window.Martha.renderCart(snap);
    if (window.Martha.renderWish) window.Martha.renderWish(snap);
  }

  function openDrawer() {
    var drawer = document.querySelector("[data-drawer]");
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.hidden = false;
    document.body.classList.add("is-locked");
    var close = drawer.querySelector(".icon-btn");
    if (close) close.focus();
  }

  function closeDrawer() {
    var drawer = document.querySelector("[data-drawer]");
    if (!drawer || drawer.hidden) return;
    drawer.hidden = true;
    document.body.classList.remove("is-locked");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.body.insertAdjacentHTML("beforeend",
    '<div class="drawer" data-drawer hidden>' +
      '<button class="drawer-backdrop" type="button" data-cart-close aria-label="Close cart"></button>' +
      '<aside class="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">' +
        '<header class="drawer-head"><h2 id="cart-title">Your cart</h2><button class="icon-btn" type="button" data-cart-close>Close</button></header>' +
        '<div data-drawer-body></div>' +
        '<footer class="drawer-foot" data-drawer-foot></footer>' +
      '</aside>' +
    '</div>' +
    '<div class="toast" data-toast role="status"></div>'
  );

  document.addEventListener("click", function (event) {
    var open = event.target.closest("[data-cart-open]");
    var close = event.target.closest("[data-cart-close]");
    var navBtn = event.target.closest("[data-nav-open]");
    var searchBtn = event.target.closest("[data-search-open]");
    var add = event.target.closest("[data-add]");
    var wish = event.target.closest("[data-wish]");
    var qty = event.target.closest("[data-qty]");
    var remove = event.target.closest("[data-remove]");

    if (open) openDrawer();
    if (close) closeDrawer();
    if (navBtn) {
      var nav = document.getElementById("site-nav");
      var on = nav.classList.toggle("is-open");
      navBtn.setAttribute("aria-expanded", on ? "true" : "false");
    }
    if (searchBtn) {
      var form = document.querySelector(".search");
      var shown = form.classList.toggle("is-open");
      searchBtn.setAttribute("aria-expanded", shown ? "true" : "false");
      if (shown) form.querySelector("input").focus();
    }
    if (add) {
      var result = window.Martha.store.add(add.getAttribute("data-add"), Number(add.getAttribute("data-qty-value") || 1));
      if (!result.ok && result.reason === "sold") toast("That bunch is sold out.");
      else if (!result.ok) toast("That is all we have in the cooler.");
      else {
        toast("Added to cart.");
        openDrawer();
      }
    }
    if (wish) {
      var id = wish.getAttribute("data-wish");
      var saved = window.Martha.store.toggleWish(id);
      var product = window.Martha.getProduct(id);
      toast(saved ? "Saved " + product.name + "." : "Removed from saved.");
    }
    if (qty) {
      var current = window.Martha.store.snapshot().items.filter(function (item) {
        return item.id === qty.getAttribute("data-qty");
      })[0];
      var next = (current ? current.qty : 1) + Number(qty.getAttribute("data-delta"));
      window.Martha.store.setQty(qty.getAttribute("data-qty"), next);
    }
    if (remove) window.Martha.store.remove(remove.getAttribute("data-remove"));
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeDrawer();
  });

  window.Martha.toast = toast;
  window.Martha.store.subscribe(paint);
})();
