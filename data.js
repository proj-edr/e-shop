const CANDY_PRODUCTS = [
  {
    id: "berry-burst-gummies",
    name: "Berry Burst Gummies",
    category: "Gummies",
    price: 4.49,
    image:
      "https://images.unsplash.com/photo-1616690710400-a16d146927c5?auto=format&fit=crop&w=900&q=80",
    description:
      "Soft and juicy berry-flavored gummies made with natural fruit flavors. Perfect for movie nights and snack breaks.",
    reviews: [
      { name: "Mia", rating: 5, comment: "Fresh flavor and great texture." },
      { name: "Ethan", rating: 4, comment: "Sweet but not too much, love it." }
    ]
  },
  {
    id: "classic-chocolate-bites",
    name: "Classic Chocolate Bites",
    category: "Chocolate",
    price: 5.99,
    image:
      "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=900&q=80",
    description:
      "Creamy milk chocolate bites with a smooth finish. Individually wrapped for easy sharing.",
    reviews: [
      { name: "Noah", rating: 5, comment: "Rich chocolate taste, very satisfying." },
      { name: "Aria", rating: 5, comment: "My kids keep asking for more." }
    ]
  },
  {
    id: "sour-rainbow-strips",
    name: "Sour Rainbow Strips",
    category: "Sour",
    price: 3.79,
    image:
      "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=900&q=80",
    description:
      "Tangy rainbow strips coated with just the right sour sugar blend. Bright colors, big flavor.",
    reviews: [
      { name: "Liam", rating: 4, comment: "Sour kick is perfect." },
      { name: "Ava", rating: 5, comment: "Colorful and very tasty." }
    ]
  },
  {
    id: "caramel-crunch-chews",
    name: "Caramel Crunch Chews",
    category: "Caramel",
    price: 4.99,
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
    description:
      "Buttery caramel chews with crispy crunch pieces in every bite. Great mix of chewy and crunchy.",
    reviews: [
      { name: "Lucas", rating: 4, comment: "Nice caramel flavor and fun texture." },
      { name: "Zoe", rating: 5, comment: "Absolutely addictive snack." }
    ]
  },
  {
    id: "mint-choco-crisps",
    name: "Mint Choco Crisps",
    category: "Chocolate",
    price: 6.29,
    image:
      "https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=900&q=80",
    description:
      "Crunchy chocolate crisps with a cool mint center for a refreshing finish.",
    reviews: [
      { name: "Ella", rating: 5, comment: "Mint and chocolate are perfectly balanced." },
      { name: "James", rating: 4, comment: "Very crunchy and not overly sweet." }
    ]
  },
  {
    id: "fizzy-lemon-bites",
    name: "Fizzy Lemon Bites",
    category: "Sour",
    price: 3.99,
    image:
      "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=900&q=80",
    description:
      "Small lemon candies with fizzy centers that pop with sour citrus flavor.",
    reviews: [
      { name: "Olivia", rating: 5, comment: "Super zesty and fun to eat." },
      { name: "Mason", rating: 4, comment: "Strong lemon taste, really good." }
    ]
  },
  {
    id: "peach-ring-delight",
    name: "Peach Ring Delight",
    category: "Gummies",
    price: 4.19,
    image:
      "https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&w=900&q=80",
    description:
      "Chewy peach rings dusted with sugar for a sweet and juicy fruit burst.",
    reviews: [
      { name: "Harper", rating: 5, comment: "Tastes like real peach candy." },
      { name: "Henry", rating: 4, comment: "Great texture and flavor." }
    ]
  },
  {
    id: "toffee-swirl-cubes",
    name: "Toffee Swirl Cubes",
    category: "Caramel",
    price: 5.49,
    image:
      "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=900&q=80",
    description:
      "Soft toffee cubes with caramel swirls that melt slowly in every bite.",
    reviews: [
      { name: "Sofia", rating: 4, comment: "Smooth and buttery, very satisfying." },
      { name: "Benjamin", rating: 5, comment: "Best caramel candy on this site." }
    ]
  },
  {
    id: "dark-cocoa-truffles",
    name: "Dark Cocoa Truffles",
    category: "Chocolate",
    price: 6.99,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
    description:
      "Rich dark chocolate truffles with velvety cocoa centers for true chocolate lovers.",
    reviews: [
      { name: "Charlotte", rating: 5, comment: "Deep cocoa flavor, premium feel." },
      { name: "Logan", rating: 4, comment: "Not too sweet, just right." }
    ]
  },
  {
    id: "watermelon-sour-slices",
    name: "Watermelon Sour Slices",
    category: "Sour",
    price: 4.29,
    image:
      "https://images.unsplash.com/photo-1556911220-bda9f7f7597e?auto=format&fit=crop&w=900&q=80",
    description:
      "Juicy watermelon slices with a sour sugar edge and chewy finish.",
    reviews: [
      { name: "Amelia", rating: 5, comment: "Watermelon taste is amazing." },
      { name: "William", rating: 4, comment: "Perfect for sour candy fans." }
    ]
  },
  {
    id: "strawberry-jelly-hearts",
    name: "Strawberry Jelly Hearts",
    category: "Gummies",
    price: 4.59,
    image:
      "https://images.unsplash.com/photo-1612198526281-9f6f8ab9b313?auto=format&fit=crop&w=900&q=80",
    description:
      "Soft strawberry jelly hearts with a sweet aroma and smooth bite.",
    reviews: [
      { name: "Evelyn", rating: 5, comment: "Cute shape and delicious flavor." },
      { name: "Alexander", rating: 4, comment: "Great candy for sharing." }
    ]
  },
  {
    id: "salted-caramel-drops",
    name: "Salted Caramel Drops",
    category: "Caramel",
    price: 5.19,
    image:
      "https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&w=900&q=80",
    description:
      "Caramel drops with a hint of sea salt for a sweet-salty balance.",
    reviews: [
      { name: "Abigail", rating: 5, comment: "Love the salted caramel combo." },
      { name: "Daniel", rating: 4, comment: "Smooth, creamy, and flavorful." }
    ]
  }
];
