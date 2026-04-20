const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");

dotenv.config();

const app = express();
const port = Number(process.env.API_PORT || 3000);
const host = process.env.API_HOST || "0.0.0.0";
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

const orders = new Map();

function loadProducts() {
  const dataPath = path.join(__dirname, "..", "data.js");
  const source = fs.readFileSync(dataPath, "utf8");
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${source}\nthis.products = CANDY_PRODUCTS;`, sandbox);

  if (!Array.isArray(sandbox.products)) {
    throw new Error("Failed to load products from data.js");
  }

  return sandbox.products;
}

function getProductMap() {
  return new Map(loadProducts().map((product) => [product.id, product]));
}

function sanitizeProduct(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    image: product.image,
    description: product.description
  };
}

function validateOrderPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return "Request body must be a JSON object.";
  }

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    return "Order requires at least one item.";
  }

  for (const item of payload.items) {
    if (!item || typeof item !== "object") {
      return "Each item must be an object.";
    }

    if (typeof item.id !== "string" || !item.id.trim()) {
      return "Each item requires a product id.";
    }

    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      return "Each item quantity must be an integer greater than 0.";
    }
  }

  return null;
}

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "candy-corner-api",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/products", (req, res) => {
  const products = loadProducts();
  const category = String(req.query.category || "").trim().toLowerCase();
  const search = String(req.query.search || "").trim().toLowerCase();
  const limit = Number(req.query.limit || 0);

  let filtered = products;
  if (category) {
    filtered = filtered.filter((product) => product.category.toLowerCase() === category);
  }

  if (search) {
    filtered = filtered.filter((product) => {
      const haystack = `${product.name} ${product.description}`.toLowerCase();
      return haystack.includes(search);
    });
  }

  if (Number.isInteger(limit) && limit > 0) {
    filtered = filtered.slice(0, limit);
  }

  res.json({
    count: filtered.length,
    products: filtered.map(sanitizeProduct)
  });
});

app.get("/api/products/:id", (req, res) => {
  const product = loadProducts().find((entry) => entry.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: "Product not found." });
    return;
  }

  res.json({ product: sanitizeProduct(product) });
});

app.post("/api/orders", (req, res) => {
  const validationError = validateOrderPayload(req.body);
  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  const productMap = getProductMap();
  let total = 0;
  const lineItems = [];

  for (const item of req.body.items) {
    const product = productMap.get(item.id);
    if (!product) {
      res.status(400).json({ error: `Product id '${item.id}' does not exist.` });
      return;
    }

    const lineTotal = Number((item.quantity * product.price).toFixed(2));
    total = Number((total + lineTotal).toFixed(2));
    lineItems.push({
      id: product.id,
      quantity: item.quantity,
      unitPrice: product.price,
      lineTotal
    });
  }

  const orderId = crypto.randomUUID();
  const order = {
    id: orderId,
    createdAt: new Date().toISOString(),
    customer: req.body.customer || null,
    items: lineItems,
    total
  };

  orders.set(orderId, order);
  res.status(201).json({ order });
});

app.get("/api/orders/:id", (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) {
    res.status(404).json({ error: "Order not found." });
    return;
  }

  res.json({ order });
});

app.get("/api/stats", (_req, res) => {
  const totals = [...orders.values()].map((order) => order.total);
  const revenue = totals.reduce((sum, value) => sum + value, 0);

  res.json({
    orderCount: orders.size,
    revenue: Number(revenue.toFixed(2))
  });
});

app.listen(port, host, () => {
  console.log(`API listening on http://${host}:${port}`);
});
