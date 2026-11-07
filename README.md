# Martha's Flowers

Martha's Flowers is a small imaginary flower shop. The site is static HTML, CSS, and client-side JavaScript. There is no backend. The cart, saved list, recent bouquets, checkout draft, and receipt stay in the browser.

The homepage follows a department-store layout: a hero, colored category tiles, a deal row, style chips, a delivery banner, another product row, two large photos, a short bench row, and three notes. The frames for that layout are in `design/`.

## Setup

1. Open `index.html` in a browser.
2. Or run a static server from this folder (`npx serve`) if you want cleaner reloads.
3. On CodeSandbox, this is a static project. Open `index.html`.

No install. No API keys.

## Pages

- `index.html` is the landing page.
- `shop.html` is the product list.
- `product.html?id=peach-sky` is a bouquet page.
- The cart drawer is on every page. `cart.html` is the same cart as a page.
- `wishlist.html`, `checkout.html`, `confirmation.html`, and `about.html`.

## Files

- `js/data.js` is the catalog.
- `js/store.js` is the cart, saved list, and session. Pages listen to it instead of reloading.
- `js/site.js` is the menu, search toggle, cart drawer, and toast.
- `js/pages.js` draws the home grids, shop filters, bouquet page, cart, saved list, and checkout.
- `css/styles.css` is mobile-first. The custom properties are the color and type tokens. Product rows use grid. The header, cards, and checkout columns use flex.

## Design

The exported frames live in `design/`. They use the same colors as the stylesheet.

- `00-foundations.svg` — type sizes, color tokens, buttons
- `01-homepage-desktop.svg` and `02-homepage-mobile.svg`
- `03-shop-desktop.svg`
- `04-product-desktop.svg`
- `05-checkout-desktop.svg`

Type is Plus Jakarta Sans. Display is the large hero. Headings are the section titles. Body is the paragraphs. Captions are the small uppercase labels.

Colors: paper `#f6f7f4`, ink `#171c18`, primary green `#2f8a45`, secondary gold `#f0c14d`, danger `#c43b3b`, success `#1e7a4d`, and neutrals 100 through 900.

The green buttons and the category tiles are the high-contrast pieces. Names sit with prices. Add to cart sits on the card it belongs to, and it is at least 44 by 44 pixels. The header has four links, not a long list. Vase shape is tucked in a disclosure so the shop does not open as a wall of checkboxes.

## What the shop does

- Add, change quantity, and remove. The drawer, the cart page, and the count update together. The page does not reload.
- `localStorage`: `martha.cart`, `martha.wishlist`, `martha.session` (recent bouquets and the last search).
- `sessionStorage`: `martha.draft` (checkout fields, card number left out) and `martha.order`.
- Shop search filters as you type. Category, price, stock, and vase filter in place. Sort covers featured, newest, price, and name.
- Checkout checks name, email, phone, address, city, ZIP, a Luhn card number, a future expiry, and CVC while you type. A bad field says what is wrong. Test card: `4242 4242 4242 4242`, any future `MM/YY`, any 3-digit CVC. Nothing is charged.
- Home and shop show skeletons first. Bouquet photos use `loading="lazy"`. Empty cart, empty saved list, empty search, and the sold-out lily bunch each have their own state.

Dew Lilies is sold out. You can save it. You cannot add it.
