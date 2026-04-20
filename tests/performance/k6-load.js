import http from "k6/http";
import { check, sleep } from "k6";

const baseUrl = __ENV.BASE_URL || "http://127.0.0.1:3000";

export const options = {
  scenarios: {
    normal_load: {
      executor: "ramping-vus",
      startVUs: 10,
      stages: [
        { duration: "1m", target: 30 },
        { duration: "3m", target: 30 },
        { duration: "1m", target: 50 },
        { duration: "3m", target: 50 },
        { duration: "1m", target: 0 }
      ],
      gracefulRampDown: "30s"
    }
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500", "p(99)<900"]
  }
};

function createOrderPayload() {
  return JSON.stringify({
    customer: {
      name: "load-test-user",
      email: "load@example.com"
    },
    items: [
      { id: "berry-burst-gummies", quantity: 2 },
      { id: "classic-chocolate-bites", quantity: 1 }
    ]
  });
}

export default function () {
  const health = http.get(`${baseUrl}/api/health`);
  check(health, { "health 200": (r) => r.status === 200 });

  const products = http.get(`${baseUrl}/api/products?limit=6`);
  check(products, { "products 200": (r) => r.status === 200 });

  const order = http.post(`${baseUrl}/api/orders`, createOrderPayload(), {
    headers: { "Content-Type": "application/json" }
  });
  check(order, { "order 201": (r) => r.status === 201 });

  sleep(1);
}
