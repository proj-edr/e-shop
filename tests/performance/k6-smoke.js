import http from "k6/http";
import { check, sleep } from "k6";

const baseUrl = __ENV.BASE_URL || "http://127.0.0.1:3000";

export const options = {
  vus: 5,
  duration: "15s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"]
  }
};

export default function () {
  const health = http.get(`${baseUrl}/api/health`);
  check(health, {
    "health status 200": (r) => r.status === 200
  });

  const products = http.get(`${baseUrl}/api/products?limit=6`);
  check(products, {
    "products status 200": (r) => r.status === 200
  });

  const payload = JSON.stringify({
    customer: {
      name: "k6 smoke user",
      email: "k6-smoke@example.com"
    },
    items: [
      { id: "berry-burst-gummies", quantity: 2 },
      { id: "classic-chocolate-bites", quantity: 1 }
    ]
  });

  const order = http.post(`${baseUrl}/api/orders`, payload, {
    headers: { "Content-Type": "application/json" }
  });
  check(order, {
    "order status 201": (r) => r.status === 201
  });

  sleep(1);
}
