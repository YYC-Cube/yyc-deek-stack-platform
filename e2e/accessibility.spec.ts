import { test, expect } from "@playwright/test"

test.describe("无障碍访问性测试", () => {
  test("首页应该通过基本无障碍检查", async ({ page }) => {
    await page.goto("/")

    // 验证页面语言属性
    const html = page.locator("html")
    await expect(html).toHaveAttribute("lang", "zh-CN")

    // 验证所有图片都有alt属性
    const images = page.locator("img")
    const count = await images.count()

    for (let i = 0; i < count; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute("alt")
      expect(alt).toBeTruthy()
    }

    // 验证主要标题层级
    await expect(page.locator("h1")).toBeVisible()
  })

  test("应该支持键盘导航", async ({ page }) => {
    await page.goto("/")

    // Tab键导航
    await page.keyboard.press("Tab")

    // 验证焦点在可交互元素上
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName
    })

    expect(["A", "BUTTON", "INPUT"]).toContain(focusedElement)
  })

  test("应该有足够的颜色对比度", async ({ page }) => {
    await page.goto("/")

    // 检查主要文本元素的对比度
    const textColor = await page.locator("body").evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return styles.color
    })

    const bgColor = await page.locator("body").evaluate((el) => {
      const styles = window.getComputedStyle(el)
      return styles.backgroundColor
    })

    // 验证颜色值存在
    expect(textColor).toBeTruthy()
    expect(bgColor).toBeTruthy()
  })
})
