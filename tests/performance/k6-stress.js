import http from "k6/http";
import { check, sleep } from "k6";

const baseUrl = __ENV.BASE_URL || "http://127.0.0.1:3000";

export const options = {
  scenarios: {
    push_to_failure: {
      executor: "ramping-vus",
      startVUs: 20,
      stages: [
        { duration: "2m", target: 50 },
        { duration: "2m", target: 100 },
        { duration: "2m", target: 100 },
        { duration: "2m", target: 100 },
        { duration: "2m", target: 0 }
      ],
      gracefulRampDown: "30s"
    }
  },
  thresholds: {
    http_req_failed: ["rate<0.1"],
    http_req_duration: ["p(95)<2000", "p(99)<4000"]
  }
};

function createOrderPayload() {
  return JSON.stringify({
    customer: {
      name: "stress-test-user",
      email: "stress@example.com"
    },
    items: [
      { id: "sour-rainbow-strips", quantity: 2 },
      { id: "dark-cocoa-truffles", quantity: 1 }
    ]
  });
}

export default function () {
  const products = http.get(`${baseUrl}/api/products?limit=8`);
  check(products, { "products 200": (r) => r.status === 200 });

  const order = http.post(`${baseUrl}/api/orders`, createOrderPayload(), {
    headers: { "Content-Type": "application/json" }
  });
  check(order, { "order 201": (r) => r.status === 201 });

  sleep(0.5);
}
