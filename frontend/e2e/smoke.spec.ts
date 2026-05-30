import { test, expect } from "@playwright/test";

/** Aguarda React hidratar (mocks locais quando API retorna 503). */
async function waitForAppShell(page: import("@playwright/test").Page) {
  await page.waitForFunction(
    () => (document.getElementById("root")?.innerText?.trim().length ?? 0) > 30,
    { timeout: 25_000 },
  );
}

test.describe("Smoke rotas públicas e admin login", () => {
  test("home /", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Chope do Leopoldo/);
    await waitForAppShell(page);
  });

  test("cardápio /menu", async ({ page }) => {
    const response = await page.goto("/menu");
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(/\/menu/);
    await waitForAppShell(page);
  });

  test("landing /lp/karaoke-sexta", async ({ page }) => {
    await page.goto("/lp/karaoke-sexta");
    await expect(page.getByText(/Toda sexta é dia de soltar a voz/i)).toBeVisible();
  });

  test("admin login /admin/login", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByText(/Painel admin/i)).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});
