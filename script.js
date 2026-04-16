const products = [
  {
    id: "ona-lounge-chair",
    name: "Ona Lounge Chair",
    category: "living",
    price: 1240000,
    badge: "Best seller",
    description: "Hand-finished walnut framing with a soft boucle seat for quiet luxury corners.",
    art: "chair",
  },
  {
    id: "aso-modular-sofa",
    name: "Aso Modular Sofa",
    category: "living",
    price: 2480000,
    badge: "New arrival",
    description: "A low, sculpted sofa designed to make open-plan spaces feel grounded and intimate.",
    art: "sofa",
  },
  {
    id: "ife-dining-table",
    name: "Ife Dining Table",
    category: "dining",
    price: 1980000,
    badge: "Made to order",
    description: "Rounded oak top with a carved pedestal base and a warm, hospitality-led presence.",
    art: "table",
  },
  {
    id: "ari-canopy-bed",
    name: "Ari Canopy Bed",
    category: "bedroom",
    price: 2875000,
    badge: "Signature",
    description: "Soft structure, generous upholstery, and a silhouette made for calm statement rooms.",
    art: "bed",
  },
  {
    id: "nuru-display-cabinet",
    name: "Nuru Cabinet",
    category: "storage",
    price: 1640000,
    badge: "Craft finish",
    description: "Ribbed timber character with smoked-glass styling for dining rooms and styled storage.",
    art: "cabinet",
  },
  {
    id: "tala-floor-lamp",
    name: "Tala Floor Lamp",
    category: "decor",
    price: 420000,
    badge: "Finishing touch",
    description: "A brushed bronze glow piece that softens corners and completes layered interiors.",
    art: "lamp",
  },
];

const state = {
  activeFilter: "all",
  cart: [],
};

const productGrid = document.querySelector("#product-grid");
const filterButtons = document.querySelectorAll(".filter-chip");
const cartButton = document.querySelector(".cart-button");
const cartCloseButton = document.querySelector(".cart-close");
const cartDrawer = document.querySelector("#cart-drawer");
const overlay = document.querySelector("#overlay");
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartCount = document.querySelector(".cart-count");
const cartTotal = document.querySelector("#cart-total");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const newsletterForm = document.querySelector("#newsletter-form");
const formMessage = document.querySelector("#form-message");
const themeToggle = document.querySelector(".theme-toggle");
const checkoutButton = document.querySelector("#checkout-button");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const themeStorageKey = "akyam-theme";

let revealObserver;

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function applyTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  document.body.dataset.theme = nextTheme;
  themeToggle.textContent = nextTheme === "dark" ? "Light mode" : "Dark mode";
  themeToggle.setAttribute("aria-pressed", String(nextTheme === "dark"));
  themeToggle.setAttribute(
    "aria-label",
    nextTheme === "dark" ? "Switch to light mode" : "Switch to dark mode",
  );
}

function readStoredTheme() {
  try {
    return localStorage.getItem(themeStorageKey) || "light";
  } catch {
    return "light";
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    return;
  }
}

function productArt(art) {
  const templates = {
    chair: `
      <div class="product-art product-art--chair">
        <span class="art-shape art-back"></span>
        <span class="art-shape art-seat"></span>
        <span class="art-shape art-arm-left"></span>
        <span class="art-shape art-arm-right"></span>
        <span class="art-shape art-leg-left"></span>
        <span class="art-shape art-leg-right"></span>
      </div>
    `,
    sofa: `
      <div class="product-art product-art--sofa">
        <span class="art-shape art-back"></span>
        <span class="art-shape art-seat"></span>
        <span class="art-shape art-arm-left"></span>
        <span class="art-shape art-arm-right"></span>
        <span class="art-shape art-leg-left"></span>
        <span class="art-shape art-leg-right"></span>
      </div>
    `,
    table: `
      <div class="product-art product-art--table">
        <span class="art-shape art-top"></span>
        <span class="art-shape art-leg"></span>
        <span class="art-shape art-base"></span>
      </div>
    `,
    bed: `
      <div class="product-art product-art--bed">
        <span class="art-shape art-headboard"></span>
        <span class="art-shape art-mattress"></span>
        <span class="art-shape art-base"></span>
      </div>
    `,
    cabinet: `
      <div class="product-art product-art--cabinet">
        <span class="art-shape art-body"></span>
        <span class="art-shape art-door-left"></span>
        <span class="art-shape art-door-right"></span>
        <span class="art-shape art-legs"></span>
      </div>
    `,
    lamp: `
      <div class="product-art product-art--lamp">
        <span class="art-shape art-shade"></span>
        <span class="art-shape art-stem"></span>
        <span class="art-shape art-base"></span>
      </div>
    `,
  };

  return templates[art] || "";
}

function revealVariant(element) {
  if (
    element.matches(".hero-copy, .craft-copy, .collection-card:nth-child(odd), .journal-card:nth-child(odd), .testimonial-card:nth-child(odd)")
  ) {
    return "left";
  }

  if (
    element.matches(".hero-stage, .craft-panel, .collection-card:nth-child(even), .journal-card:nth-child(even), .testimonial-card:nth-child(even)")
  ) {
    return "right";
  }

  return "up";
}

function revealDelay(element, index) {
  if (
    element.matches(".detail-card, .collection-card, .product-card, .craft-points article, .journal-card, .testimonial-card")
  ) {
    return (index % 4) * 90;
  }

  return 0;
}

function revealKeyframes(variant) {
  const frames = {
    up: [
      { opacity: 0, transform: "translate3d(0, 34px, 0) scale(0.985)", filter: "blur(10px)" },
      { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)", filter: "blur(0px)" },
    ],
    left: [
      { opacity: 0, transform: "translate3d(-42px, 18px, 0) scale(0.985)", filter: "blur(10px)" },
      { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)", filter: "blur(0px)" },
    ],
    right: [
      { opacity: 0, transform: "translate3d(42px, 18px, 0) scale(0.985)", filter: "blur(10px)" },
      { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)", filter: "blur(0px)" },
    ],
  };

  return frames[variant] || frames.up;
}

function animateReveal(element) {
  if (element.dataset.revealed === "true") {
    return;
  }

  element.dataset.revealed = "true";
  element.classList.add("is-visible");

  if (prefersReducedMotion.matches) {
    return;
  }

  const delay = Number(element.dataset.revealDelay || 0);
  element.animate(revealKeyframes(element.dataset.reveal), {
    duration: 820,
    delay,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    fill: "backwards",
  });
}

function setupRevealObserver() {
  if (prefersReducedMotion.matches) {
    return;
  }

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      animateReveal(entry.target);
      revealObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  });
}

function registerRevealElements(scope = document) {
  const selector = [
    ".hero-copy",
    ".hero-stage",
    ".section-heading",
    ".detail-card",
    ".collection-card",
    ".craft-copy",
    ".craft-points article",
    ".craft-panel",
    ".product-card",
    ".journal-card",
    ".testimonial-card",
    ".newsletter",
    ".site-footer",
  ].join(", ");

  const elements = Array.from(scope.querySelectorAll(selector)).filter(
    (element) => element.dataset.revealReady !== "true",
  );

  elements.forEach((element, index) => {
    element.dataset.revealReady = "true";
    element.dataset.reveal = revealVariant(element);
    element.dataset.revealDelay = String(revealDelay(element, index));

    if (element.closest(".hero") || prefersReducedMotion.matches) {
      animateReveal(element);
      return;
    }

    revealObserver?.observe(element);
  });
}

function renderProducts() {
  const visibleProducts = state.activeFilter === "all"
    ? products
    : products.filter((product) => product.category === state.activeFilter);

  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card">
      <div class="product-media">
        <span class="product-badge">${product.badge}</span>
        ${productArt(product.art)}
      </div>
      <div class="product-copy">
        <div class="product-header">
          <div>
            <p class="product-category">${product.category.charAt(0).toUpperCase()}${product.category.slice(1)}</p>
            <h3 class="product-name">${product.name}</h3>
          </div>
          <span class="product-price">${currency.format(product.price)}</span>
        </div>
        <p class="product-description">${product.description}</p>
        <div class="product-actions">
          <a class="button button--secondary" href="#craft">Details</a>
          <button class="button button--primary" type="button" data-add-to-cart="${product.id}">
            Add to cart
          </button>
        </div>
      </div>
    </article>
  `).join("");

  registerRevealElements(productGrid);
}

function getCartCount() {
  return state.cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
  return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function renderCart() {
  const hasItems = state.cart.length > 0;
  cartEmpty.hidden = hasItems;
  cartItems.innerHTML = hasItems
    ? state.cart.map((item) => `
      <li class="cart-item">
        <div class="cart-item-copy">
          <h3 class="cart-item-name">${item.name}</h3>
          <p class="cart-item-description">${item.description}</p>
          <div class="cart-item-meta">
            <span class="cart-item-price">${currency.format(item.price)}</span>
            <div class="quantity-controls" aria-label="Quantity controls for ${item.name}">
              <button class="quantity-button" type="button" data-quantity-change="${item.id}" data-change="-1">-</button>
              <span>${item.quantity}</span>
              <button class="quantity-button" type="button" data-quantity-change="${item.id}" data-change="1">+</button>
            </div>
          </div>
        </div>
      </li>
    `).join("")
    : "";

  cartCount.textContent = String(getCartCount());
  cartTotal.textContent = currency.format(getCartTotal());
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return;
  }

  const existingItem = state.cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  openCart();
}

function updateQuantity(productId, change) {
  const item = state.cart.find((entry) => entry.id === productId);

  if (!item) {
    return;
  }

  item.quantity += change;
  state.cart = state.cart.filter((entry) => entry.quantity > 0);
  renderCart();
}

function openCart() {
  document.body.classList.add("cart-open");
  document.body.classList.remove("nav-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  cartButton.setAttribute("aria-expanded", "true");
  overlay.hidden = false;
}

function closeCart() {
  document.body.classList.remove("cart-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  cartButton.setAttribute("aria-expanded", "false");
  if (!document.body.classList.contains("nav-open")) {
    overlay.hidden = true;
  }
}

function toggleMenu() {
  const isOpen = document.body.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) {
    document.body.classList.remove("cart-open");
    cartDrawer.setAttribute("aria-hidden", "true");
    cartButton.setAttribute("aria-expanded", "false");
    overlay.hidden = false;
  } else if (!document.body.classList.contains("cart-open")) {
    overlay.hidden = true;
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.activeFilter = button.dataset.filter || "all";
    filterButtons.forEach((chip) => {
      chip.classList.remove("is-active");
      chip.setAttribute("aria-pressed", "false");
    });
    button.classList.add("is-active");
    button.setAttribute("aria-pressed", "true");
    renderProducts();
  });
});

productGrid.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const productId = target.dataset.addToCart;

  if (productId) {
    addToCart(productId);
  }
});

cartItems.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const productId = target.dataset.quantityChange;
  const change = Number(target.dataset.change);

  if (productId && Number.isFinite(change)) {
    updateQuantity(productId, change);
  }
});

cartButton.addEventListener("click", openCart);
cartCloseButton.addEventListener("click", closeCart);
menuToggle.addEventListener("click", toggleMenu);
themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  saveTheme(nextTheme);
});

overlay.addEventListener("click", () => {
  document.body.classList.remove("nav-open");
  closeCart();
  menuToggle.setAttribute("aria-expanded", "false");
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
    if (!document.body.classList.contains("cart-open")) {
      overlay.hidden = true;
    }
  });
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent = "Thanks. You are on the AKYAM list for product drops and styling notes.";
  newsletterForm.reset();
});

checkoutButton.addEventListener("click", () => {
  const hasItems = state.cart.length > 0;
  const message = hasItems
    ? "Checkout can be wired next. For now, this cart is ready as a strong front-end placeholder."
    : "Add a few pieces first and the cart will be ready for a fuller checkout flow.";

  formMessage.textContent = message;
  closeCart();
  window.location.hash = "#contact";
});

setupRevealObserver();
applyTheme(readStoredTheme());
renderProducts();
renderCart();
registerRevealElements(document);
document.body.classList.add("reveal-ready");
