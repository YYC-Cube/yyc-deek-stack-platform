import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test("should load homepage successfully", async ({ page }) => {
    await page.goto("/")

    await expect(page.locator("h1")).toContainText("YanYuCloud³")
    await expect(page.locator("text=万象归元于云枢")).toBeVisible()
  })

  test("should navigate to integrations page", async ({ page }) => {
    await page.goto("/")

    await page.click("text=浏览集成")
    await expect(page).toHaveURL(/.*integrations/)
  })

  test("should show AI assistant on button click", async ({ page }) => {
    await page.goto("/")

    await page.click("text=智能助手")
    await expect(page.locator('[data-testid="assistant-panel"]')).toBeVisible()
  })

  test("should display feature cards", async ({ page }) => {
    await page.goto("/")

    const features = page.locator(".card-hover")
    await expect(features).toHaveCount(4)

    await expect(page.locator("text=快速集成")).toBeVisible()
    await expect(page.locator("text=安全可靠")).toBeVisible()
    await expect(page.locator("text=全球连接")).toBeVisible()
    await expect(page.locator("text=数据同步")).toBeVisible()
  })
})
