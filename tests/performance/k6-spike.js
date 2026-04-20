import http from "k6/http";
import { check, sleep } from "k6";

const baseUrl = __ENV.BASE_URL || "http://127.0.0.1:3000";

export const options = {
  scenarios: {
    sudden_spikes: {
      executor: "ramping-vus",
      startVUs: 10,
      stages: [
        { duration: "30s", target: 20 },
        { duration: "15s", target: 300 },
        { duration: "30s", target: 20 },
        { duration: "15s", target: 500 },
        { duration: "30s", target: 20 },
        { duration: "15s", target: 0 }
      ],
      gracefulRampDown: "10s"
    }
  },
  thresholds: {
    http_req_failed: ["rate<0.2"],
    http_req_duration: ["p(95)<2500", "p(99)<5000"]
  }
};

function createOrderPayload() {
  return JSON.stringify({
    customer: {
      name: "spike-test-user",
      email: "spike@example.com"
    },
    items: [
      { id: "peach-ring-delight", quantity: 3 },
      { id: "salted-caramel-drops", quantity: 1 }
    ]
  });
}

export default function () {
  const products = http.get(`${baseUrl}/api/products?limit=4`);
  check(products, { "products 200": (r) => r.status === 200 });

  const order = http.post(`${baseUrl}/api/orders`, createOrderPayload(), {
    headers: { "Content-Type": "application/json" }
  });
  check(order, { "order 201": (r) => r.status === 201 });

  sleep(0.2);
}
