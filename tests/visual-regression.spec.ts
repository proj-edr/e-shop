import { test, expect } from "@playwright/test";

const VIEWPORT = { width: 1440, height: 900 };

test.describe("Candy Corner visual regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(VIEWPORT);

    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation: none !important;
          transition: none !important;
          caret-color: transparent !important;
        }
      `
    });
  });

  test("home page screenshot", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("home-page.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01
    });
  });

  test("product page screenshot", async ({ page }) => {
    await page.goto("/product.html?id=classic-chocolate-bites");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("product-page.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01
    });
  });

  test("checkout page screenshot", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem(
        "candy_corner_cart",
        JSON.stringify([{ id: "classic-chocolate-bites", quantity: 2 }])
      );
    });

    await page.goto("/checkout.html");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveScreenshot("checkout-page.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01
    });
  });
});
// comment