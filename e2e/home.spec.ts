import { test, expect } from "@playwright/test"

test.describe("首页功能测试", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("应该正确加载首页并显示核心元素", async ({ page }) => {
    // 验证页面标题
    await expect(page).toHaveTitle(/YanYuCloud³ Integration Center/i)

    // 验证主标题
    await expect(page.locator("h1")).toContainText("YanYuCloud³ Integration Center")

    // 验证核心功能卡片
    await expect(page.locator("text=快速集成")).toBeVisible()
    await expect(page.locator("text=安全可靠")).toBeVisible()
    await expect(page.locator("text=全球连接")).toBeVisible()
    await expect(page.locator("text=数据同步")).toBeVisible()
  })

  test("应该能够导航到集成页面", async ({ page }) => {
    // 点击"浏览集成"按钮
    await page.click("text=浏览集成")

    // 验证URL变化
    await expect(page).toHaveURL("/integrations")

    // 验证页面加载
    await expect(page.locator("h1")).toContainText(/集成/i)
  })

  test("应该能够打开和关闭AI助手", async ({ page }) => {
    // 点击"智能助手"按钮
    await page.click("text=智能助手")

    // 等待助手面板出现
    await expect(page.locator('[data-testid="assistant-panel"]')).toBeVisible({ timeout: 3000 })

    // 点击"隐藏助手"按钮
    await page.click("text=隐藏助手")

    // 验证助手面板消失
    await expect(page.locator('[data-testid="assistant-panel"]')).not.toBeVisible()
  })

  test("应该在移动端正确显示", async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 })

    // 验证响应式布局
    await expect(page.locator("h1")).toBeVisible()
    await expect(page.locator("text=浏览集成")).toBeVisible()
  })

  test("性能指标应该在合理范围内", async ({ page }) => {
    // 测量页面加载性能
    const navigationTiming = await page.evaluate(() => {
      const perfData = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
      }
    })

    // 验证性能指标
    expect(navigationTiming.domContentLoaded).toBeLessThan(2000) // DOMContentLoaded < 2s
    expect(navigationTiming.loadComplete).toBeLessThan(3000) // Load Complete < 3s
  })
})
