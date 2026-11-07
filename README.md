#Project for IT13 Marthas Flowers
members:
Romart Mindoro
Cj Madrona
Rafael Mindoro
Kert Festin
FigmaLink:https://www.figma.com/design/RE6nHGVqdGBLnAbilk5hEd

Pages

index.html-home
shop.html-the list
product.html?id=peach-sky-one bouquet
cart.html-cart drawer on every page
wishlist.html, checkout.html, confirmation.html, about.html

How the files are split

js/data.js - catalog
js/store.js - cart saved list, recent bouquets
js/site.js - menu, search, drawer
js/pages.js - the pages that get drawn in the browser
css/styles.css - layout and colors

Product rows are grid. The header and the cards are flex. Colors and the font are CSS variables at the top of the stylesheet. Type is Plus Jakarta Sans. The big line on the home page is the display size, section titles are the headings, paragraphs are body, and the small uppercase labels are captions.

Page sketches are in `design/`:

00-foundations.svg
01-homepage-desktop.svg, 02-homepage-mobile.svg
03-shop-desktop.svg
04-product-desktop.svg
05-checkout-desktop.svg

Green is the main color (`#2f8a45`). Gold is the second (`#f0c14d`). Paper is `#f6f7f4`, ink is `#171c18`. Red `#c43b3b` is for errors. Green `#1e7a4d` is for a field that passed.

Names sit next to prices. The add-to-cart button is on the same card. The nav is Shop, Deals, What's new, and Delivery. Vase shape is under a "Vase shape" toggle on the shop page.

What you can do

- Add a bouquet, change the quantity, remove it. The drawer and the cart page update together.
- Cart, saved list, and recently viewed stay after a refresh (`martha.cart`, `martha.wishlist`, `martha.session`).
- The checkout form and the receipt last until the tab closes (`martha.draft`, `martha.order`). The card number is not stored.
- Search updates the list while you type. Category, price, stock, and vase filter it. Sort is featured, newest, price, or name.
- Checkout checks the fields as you type. Test card `4242 4242 4242 4242`, any future `MM/YY`, any 3-digit CVC. The card is not billed.
- Home and shop show gray placeholders first. Photos lower on the page wait to load. Empty cart, empty saved list, a search with no matches, and Dew Lilies (sold out) each have their own message.

Dew Lilies can be saved. It cannot be added.
