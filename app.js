const CART_KEY = "candy_corner_cart";
const SHIPPING_FEE = 4.99;
const REVIEW_KEY = "candy_corner_reviews";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const totalItems = getCart().reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.textContent = String(totalItems);
  }
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
}

function changeQuantity(productId, delta) {
  const cart = getCart();
  const target = cart.find((item) => item.id === productId);
  if (!target) {
    return;
  }
  target.quantity += delta;
  if (target.quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  saveCart(cart);
}

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function getStoredReviews() {
  try {
    return JSON.parse(localStorage.getItem(REVIEW_KEY)) || {};
  } catch {
    return {};
  }
}

function saveStoredReviews(reviewMap) {
  localStorage.setItem(REVIEW_KEY, JSON.stringify(reviewMap));
}

function getReviewsForProduct(productId, defaultReviews = []) {
  const reviewMap = getStoredReviews();
  return reviewMap[productId] || defaultReviews;
}

function renderProductCard(product) {
  return `
    <article class="product-card">
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-content">
        <h3>${product.name}</h3>
        <p class="price">${formatPrice(product.price)}</p>
        <div class="card-actions">
          <button class="btn-primary add-btn" data-id="${product.id}">Add to Cart</button>
          <a class="btn-secondary" href="product.html?id=${product.id}">View Product</a>
        </div>
      </div>
    </article>
  `;
}

function initHomePage() {
  const grid = document.getElementById("product-grid");
  const searchInput = document.getElementById("search-input");
  const categoryFilters = document.getElementById("category-filters");
  if (!grid || !searchInput || !categoryFilters) {
    return;
  }

  let activeCategory = "All";
  const categories = ["All", ...new Set(CANDY_PRODUCTS.map((product) => product.category))];

  const renderFilters = () => {
    categoryFilters.innerHTML = categories
      .map(
        (category) => `
          <button
            class="chip-btn ${category === activeCategory ? "active-chip" : ""}"
            data-category="${category}"
            type="button"
          >
            ${category}
          </button>
        `
      )
      .join("");
  };

  const render = (searchTerm = "") => {
    const term = searchTerm.trim().toLowerCase();
    const filtered = CANDY_PRODUCTS.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;
      const matchesTerm =
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term);
      return (
        matchesCategory &&
        matchesTerm
      );
    });

    if (!filtered.length) {
      grid.innerHTML = "<p>No products matched your search.</p>";
      return;
    }

    grid.innerHTML = filtered.map(renderProductCard).join("");
  };

  renderFilters();
  render();
  searchInput.addEventListener("input", (event) => {
    render(event.target.value);
  });

  categoryFilters.addEventListener("click", (event) => {
    const chip = event.target.closest(".chip-btn");
    if (!chip) {
      return;
    }
    activeCategory = chip.dataset.category;
    renderFilters();
    render(searchInput.value);
  });

  grid.addEventListener("click", (event) => {
    const target = event.target.closest(".add-btn");
    if (!target) {
      return;
    }
    addToCart(target.dataset.id);
  });
}

function createStars(rating) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function initProductPage() {
  const details = document.getElementById("product-details");
  if (!details) {
    return;
  }

  const productId = new URLSearchParams(window.location.search).get("id");
  const product = CANDY_PRODUCTS.find((item) => item.id === productId);

  if (!product) {
    details.innerHTML = "<p>Product not found.</p>";
    return;
  }

  const renderReviews = (reviews) =>
    reviews
      .map(
        (review) => `
          <li class="review-card">
            <p class="review-title"><strong>${review.name}</strong> - ${createStars(review.rating)}</p>
            <p>${review.comment}</p>
          </li>
        `
      )
      .join("");

  const currentReviews = getReviewsForProduct(product.id, product.reviews);

  details.innerHTML = `
    <section class="product-layout">
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-info">
        <h1>${product.name}</h1>
        <p class="muted">Category: ${product.category}</p>
        <p class="price">${formatPrice(product.price)}</p>
        <p>${product.description}</p>
        <button class="btn-primary" id="product-add-btn">Add to Cart</button>
        <h2>Reviews</h2>
        <ul id="review-list" class="review-list">${renderReviews(currentReviews)}</ul>
        <form id="review-form" class="review-form">
          <h3>Leave a Review</h3>
          <label>
            Your Name
            <input type="text" name="reviewerName" required />
          </label>
          <label>
            Rating
            <select name="rating" required>
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Very Good</option>
              <option value="3">3 - Good</option>
              <option value="2">2 - Fair</option>
              <option value="1">1 - Poor</option>
            </select>
          </label>
          <label>
            Comment
            <textarea name="comment" rows="3" required></textarea>
          </label>
          <button type="submit" class="btn-primary">Submit Review</button>
          <p id="review-message" class="success-text"></p>
        </form>
      </div>
    </section>
  `;

  const addBtn = document.getElementById("product-add-btn");
  if (addBtn) {
    addBtn.addEventListener("click", () => addToCart(product.id));
  }

  const reviewForm = document.getElementById("review-form");
  const reviewList = document.getElementById("review-list");
  const reviewMessage = document.getElementById("review-message");
  if (!reviewForm || !reviewList || !reviewMessage) {
    return;
  }

  reviewForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(reviewForm);
    const newReview = {
      name: String(formData.get("reviewerName") || "").trim(),
      rating: Number(formData.get("rating")),
      comment: String(formData.get("comment") || "").trim()
    };

    if (!newReview.name || !newReview.comment) {
      reviewMessage.textContent = "Please fill out all review fields.";
      return;
    }

    const updatedReviews = [...getReviewsForProduct(product.id, product.reviews), newReview];
    const reviewMap = getStoredReviews();
    reviewMap[product.id] = updatedReviews;
    saveStoredReviews(reviewMap);
    reviewList.innerHTML = renderReviews(updatedReviews);
    reviewForm.reset();
    reviewMessage.textContent = "Review submitted. Thank you!";
  });
}

function initCheckoutPage() {
  const checkoutItems = document.getElementById("checkout-items");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  const placeOrderBtn = document.getElementById("place-order");
  const checkoutMessage = document.getElementById("checkout-message");
  const checkoutForm = document.getElementById("checkout-form");

  if (!checkoutItems || !subtotalEl || !totalEl || !placeOrderBtn || !checkoutMessage || !checkoutForm) {
    return;
  }

  const render = () => {
    const cart = getCart();
    if (!cart.length) {
      checkoutItems.innerHTML = "<p>Your cart is empty.</p>";
      subtotalEl.textContent = formatPrice(0);
      totalEl.textContent = formatPrice(SHIPPING_FEE);
      return;
    }

    let subtotal = 0;
    checkoutItems.innerHTML = cart
      .map((cartItem) => {
        const product = CANDY_PRODUCTS.find((item) => item.id === cartItem.id);
        if (!product) {
          return "";
        }
        const lineTotal = product.price * cartItem.quantity;
        subtotal += lineTotal;
        return `
          <div class="checkout-item">
            <div>
              <p><strong>${product.name}</strong></p>
              <p>${formatPrice(product.price)} x ${cartItem.quantity}</p>
            </div>
            <div class="checkout-controls">
              <button class="small-btn qty-btn" data-id="${product.id}" data-delta="-1">-</button>
              <button class="small-btn qty-btn" data-id="${product.id}" data-delta="1">+</button>
              <button class="danger-link remove-btn" data-id="${product.id}">Remove</button>
            </div>
          </div>
        `;
      })
      .join("");

    subtotalEl.textContent = formatPrice(subtotal);
    totalEl.textContent = formatPrice(subtotal + SHIPPING_FEE);
  };

  render();

  checkoutItems.addEventListener("click", (event) => {
    const qtyBtn = event.target.closest(".qty-btn");
    const removeBtn = event.target.closest(".remove-btn");

    if (qtyBtn) {
      changeQuantity(qtyBtn.dataset.id, Number(qtyBtn.dataset.delta));
      render();
      return;
    }

    if (removeBtn) {
      removeFromCart(removeBtn.dataset.id);
      render();
    }
  });

  placeOrderBtn.addEventListener("click", () => {
    if (!getCart().length) {
      checkoutMessage.textContent = "Add at least one product before checking out.";
      return;
    }
    if (!checkoutForm.reportValidity()) {
      checkoutMessage.textContent = "Please complete all checkout fields.";
      return;
    }
    saveCart([]);
    checkoutForm.reset();
    render();
    checkoutMessage.textContent = "Order placed! Your candy is on the way.";
  });
}

function init() {
  updateCartCount();
  const page = document.body.dataset.page;

  if (page === "home") {
    initHomePage();
  } else if (page === "product") {
    initProductPage();
  } else if (page === "checkout") {
    initCheckoutPage();
  }
}

init();
