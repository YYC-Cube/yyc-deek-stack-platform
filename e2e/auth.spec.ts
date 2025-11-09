import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
  test("should show login dialog", async ({ page }) => {
    await page.goto("/")

    await page.click("text=登录")
    await expect(page.locator('[role="dialog"]')).toBeVisible()
  })

  test("should validate email format", async ({ page }) => {
    await page.goto("/")
    await page.click("text=登录")

    await page.fill('input[type="email"]', "invalid-email")
    await page.click('button:has-text("登录")')

    await expect(page.locator("text=请输入有效的邮箱地址")).toBeVisible()
  })

  test("should login successfully with valid credentials", async ({ page }) => {
    await page.goto("/")
    await page.click("text=登录")

    await page.fill('input[type="email"]', "test@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button:has-text("登录")')

    await expect(page.locator("text=欢迎回来")).toBeVisible()
  })
})
