(function () {
  var products = [
    {
      id: "peach-sky",
      name: "Peach and Sky",
      price: 68,
      was: 78,
      category: "Pastel",
      vase: "Bowl",
      stock: 9,
      featured: 1,
      newest: 4,
      rating: 5,
      lead: "Peach roses and blue hydrangea in a round glass bowl.",
      story: "Martha wires a thin copper ring around the bowl so the stems stay put in the car. It sits low, which is what you want on a dinner table.",
      care: "Recut the stems and change the water every other day. Keep it off the radiator.",
      image: "assets/flowers/peach-sky.jpg"
    },
    {
      id: "magenta-day",
      name: "Magenta Day",
      price: 58,
      was: 66,
      category: "Bright",
      vase: "Bowl",
      stock: 11,
      featured: 2,
      newest: 2,
      rating: 4,
      lead: "A magenta gerbera, pink roses, and a few alstroemeria.",
      story: "This is the loud one. People pick it when the week has been gray and they do not want a polite bouquet.",
      care: "The gerbera drinks a lot. Top up the vase in the morning.",
      image: "assets/flowers/magenta-day.jpg"
    },
    {
      id: "citrus-garden",
      name: "Citrus Garden",
      price: 72,
      was: 80,
      category: "Bright",
      vase: "Cylinder",
      stock: 7,
      featured: 3,
      newest: 6,
      rating: 5,
      lead: "Orange roses with green and blush hydrangea.",
      story: "The hydrangea is the filler and the roses are the point. It reads warm from across the room.",
      care: "Hydrangea wilts if the vase runs dry. Mist the heads if the house is hot.",
      image: "assets/flowers/citrus-garden.jpg"
    },
    {
      id: "blush-column",
      name: "Blush Column",
      price: 74,
      was: 84,
      category: "Pastel",
      vase: "Tall",
      stock: 6,
      featured: 4,
      newest: 5,
      rating: 4,
      lead: "Pink roses and white hydrangea in a green glass vase.",
      story: "Taller than the bowl arrangements, so it works on a sideboard where people are not reaching over it.",
      care: "Strip any leaves that would sit in the water.",
      image: "assets/flowers/blush-column.jpg"
    },
    {
      id: "red-cloud",
      name: "Red and Cloud",
      price: 86,
      was: 0,
      category: "Roses",
      vase: "Tall",
      stock: 8,
      featured: 5,
      newest: 8,
      rating: 5,
      lead: "Red roses stacked over a cloud of white hydrangea.",
      story: "A straight-ahead bunch. No loops, no extra greenery trying to be clever.",
      care: "Roses last longer if you recut them on an angle.",
      image: "assets/flowers/red-cloud.jpg"
    },
    {
      id: "lily-rose",
      name: "Lily and Rose",
      price: 90,
      was: 0,
      category: "Lilies",
      vase: "Tall",
      stock: 5,
      featured: 6,
      newest: 3,
      rating: 4,
      lead: "Pink lilies, pink roses, and a little white stock.",
      story: "The lilies open over two days, so it looks fuller on Wednesday than it did on Monday.",
      care: "Pull the pollen tips off if you do not want stains on the table.",
      image: "assets/flowers/lily-rose.jpg"
    },
    {
      id: "two-hearts",
      name: "Two Hearts",
      price: 96,
      was: 0,
      category: "Roses",
      vase: "Cube",
      stock: 4,
      featured: 7,
      newest: 7,
      rating: 5,
      lead: "Red roses in a square vase, with two willow loops.",
      story: "The loops are willow, bent while they are wet. They dry in place. Do not try to straighten them.",
      care: "The cube vase is narrow. Check the water line.",
      image: "assets/flowers/two-hearts.jpg"
    },
    {
      id: "stargazer",
      name: "Stargazer Column",
      price: 104,
      was: 0,
      category: "Lilies",
      vase: "Tall",
      stock: 5,
      featured: 8,
      newest: 9,
      rating: 5,
      lead: "Red roses, stargazer lilies, and white hydrangea.",
      story: "This one has a scent. If someone in the house is sensitive to lilies, pick a rose bunch instead.",
      care: "Give it a spot with light, but not a south window at noon.",
      image: "assets/flowers/stargazer.jpg"
    },
    {
      id: "full-garden",
      name: "Full Garden",
      price: 118,
      was: 128,
      category: "Mixed",
      vase: "Flared",
      stock: 3,
      featured: 9,
      newest: 1,
      rating: 5,
      lead: "A packed mixed bunch: roses, daisies, stock, and whatever was good that morning.",
      story: "Martha builds this one last, from the stems that are left and still look proud. No two weeks match.",
      care: "It is dense. Pull any stem that fades so the rest can breathe.",
      image: "assets/flowers/full-garden.jpg"
    },
    {
      id: "dew-lilies",
      name: "Dew Lilies",
      price: 44,
      was: 52,
      category: "Lilies",
      vase: "Stems",
      stock: 0,
      featured: 10,
      newest: 10,
      rating: 4,
      lead: "A close bunch of pink lilies. This week's stems are gone.",
      story: "These are sold as stems, not in a vase. The photo is from the last bunch, still wet from the cooler.",
      care: "When they are back, recut and use a tall vase. They need room.",
      image: "assets/flowers/dew-lilies.jpg"
    }
  ];

  function esc(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  window.Martha = window.Martha || {};
  window.Martha.products = products;
  window.Martha.categories = ["Roses", "Lilies", "Pastel", "Bright", "Mixed"];
  window.Martha.vases = ["Bowl", "Tall", "Cube", "Cylinder", "Flared", "Stems"];
  window.Martha.getProduct = function (id) {
    for (var i = 0; i < products.length; i += 1) {
      if (products[i].id === id) return products[i];
    }
    return null;
  };
  window.Martha.money = function (value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value);
  };
  window.Martha.esc = esc;
})();
