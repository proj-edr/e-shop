const { test, expect } = require("@playwright/test");

test.describe("Candy Corner functional coverage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test("home catalog search and category filters", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#product-grid .product-card")).toHaveCount(12);
    await expect(page.locator("#category-filters .chip-btn")).toContainText([
      "All",
      "Gummies",
      "Chocolate",
      "Sour",
      "Caramel"
    ]);

    await page.fill("#search-input", "chocolate");
    await expect(page.locator("#product-grid .product-card")).toHaveCount(3);
    await expect(page.locator("#product-grid")).toContainText("Classic Chocolate Bites");
    await expect(page.locator("#product-grid")).toContainText("Mint Choco Crisps");
    await expect(page.locator("#product-grid")).toContainText("Dark Cocoa Truffles");

    await page.click('button[data-category="Sour"]');
    await expect(page.locator("#product-grid .product-card")).toHaveCount(0);
    await expect(page.locator("#product-grid")).toContainText("No products matched your search.");
  });

  test("product details, review submission, and review persistence", async ({ page }) => {
    await page.goto("/product.html?id=classic-chocolate-bites");
    await expect(page.locator("h1")).toContainText("Classic Chocolate Bites");
    await expect(page.locator(".price")).toContainText("$5.99");
    await expect(page.locator("#review-list .review-card")).toHaveCount(2);

    await page.fill('input[name="reviewerName"]', "QA Bot");
    await page.selectOption('select[name="rating"]', "4");
    await page.fill('textarea[name="comment"]', "Automation review test");
    await page.click('button:has-text("Submit Review")');

    await expect(page.locator("#review-message")).toContainText("Review submitted. Thank you!");
    await expect(page.locator("#review-list")).toContainText("QA Bot");
    await expect(page.locator("#review-list")).toContainText("Automation review test");

    await page.reload();
    await expect(page.locator("#review-list")).toContainText("QA Bot");
    await expect(page.locator("#review-list")).toContainText("Automation review test");
  });

  test("cart, checkout validation, order placement, and cart persistence behavior", async ({
    page
  }) => {
    await page.goto("/");
    await page.click('article:has-text("Classic Chocolate Bites") .add-btn');
    await expect(page.locator("#cart-count")).toContainText("1");

    await page.goto("/checkout.html");
    await expect(page.locator("#checkout-items")).toContainText("Classic Chocolate Bites");
    await expect(page.locator("#subtotal")).toContainText("$5.99");
    await expect(page.locator("#total")).toContainText("$10.98");

    await page.click("#place-order");
    await expect(page.locator("#checkout-message")).toContainText(
      "Please complete all checkout fields."
    );

    await page.fill('input[name="fullName"]', "Test Buyer");
    await page.fill('input[name="email"]', "buyer@example.com");
    await page.fill('input[name="address"]', "123 Candy Street");
    await page.fill('input[name="city"]', "Sweetville");
    await page.fill('input[name="zip"]', "10001");
    await page.fill('input[name="cardNumber"]', "4111111111111111");
    await page.fill('input[name="expiry"]', "12/30");
    await page.fill('input[name="cvv"]', "123");
    await page.click("#place-order");

    await expect(page.locator("#checkout-message")).toContainText(
      "Order placed! Your candy is on the way."
    );
    await expect(page.locator("#checkout-items")).toContainText("Your cart is empty.");
    await expect(page.locator("#cart-count")).toContainText("0");

    await page.reload();
    await expect(page.locator("#checkout-items")).toContainText("Your cart is empty.");
  });

  test("invalid product id state", async ({ page }) => {
    await page.goto("/product.html?id=not-a-real-product");
    await expect(page.locator("#product-details")).toContainText("Product not found.");
  });
});
