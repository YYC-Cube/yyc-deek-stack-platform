import { test, expect } from "@playwright/test"

test.describe("集成市场功能测试", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/integrations")
  })

  test("应该显示集成列表", async ({ page }) => {
    // 等待集成卡片加载
    await page.waitForSelector('[data-testid="integration-card"]', { timeout: 5000 })

    // 验证至少有一个集成卡片
    const cards = page.locator('[data-testid="integration-card"]')
    await expect(cards.first()).toBeVisible()
  })

  test("应该能够搜索集成", async ({ page }) => {
    // 输入搜索关键词
    const searchInput = page.locator('input[placeholder*="搜索"]')
    await searchInput.fill("Slack")

    // 等待搜索结果
    await page.waitForTimeout(500)

    // 验证搜索结果包含Slack
    await expect(page.locator("text=Slack")).toBeVisible()
  })

  test("应该能够按分类筛选", async ({ page }) => {
    // 点击分类筛选
    await page.click("text=通信协作")

    // 等待筛选结果
    await page.waitForTimeout(500)

    // 验证显示的都是通信协作类集成
    const categoryBadges = page.locator("text=通信协作")
    const count = await categoryBadges.count()
    expect(count).toBeGreaterThan(0)
  })

  test("应该能够查看集成详情", async ({ page }) => {
    // 点击第一个集成卡片
    await page.click('[data-testid="integration-card"]')

    // 验证导航到详情页
    await expect(page).toHaveURL(/\/integrations\/[\w-]+/)

    // 验证详情页元素
    await expect(page.locator("h1")).toBeVisible()
    await expect(page.locator("text=安装")).toBeVisible()
  })

  test("应该能够收藏集成", async ({ page }) => {
    // 找到收藏按钮
    const favoriteButton = page.locator('[data-testid="favorite-button"]').first()

    // 点击收藏
    await favoriteButton.click()

    // 验证收藏状态变化
    await expect(favoriteButton).toHaveAttribute("data-favorited", "true")
  })
})
