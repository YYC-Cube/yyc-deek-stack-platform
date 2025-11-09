import { describe, expect, it, jest, beforeEach, afterEach } from "@jest/globals"
import { reportWebVitals, markPerformance, measurePerformance } from "@/app/utils/performance-monitor"
import type { PerformanceMetric } from "@/app/utils/performance-monitor"

describe("Performance Monitor", () => {
  beforeEach(() => {
    // Mock console methods
    global.console.log = jest.fn()
    global.console.warn = jest.fn()
    global.console.error = jest.fn()

    // Mock navigator.sendBeacon
    Object.defineProperty(global.navigator, "sendBeacon", {
      writable: true,
      value: jest.fn(() => true),
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("reportWebVitals", () => {
    it("应该正确报告性能指标", () => {
      const metric: PerformanceMetric = {
        name: "LCP",
        value: 2000,
        id: "test-1",
        label: "web-vital",
      }

      reportWebVitals(metric)

      expect(global.console.log).toHaveBeenCalledWith(
        "[Performance] LCP:",
        expect.objectContaining({
          value: "2000.00ms",
          rating: "good",
        }),
      )
    })

    it("应该对性能差的指标发出警告", () => {
      const metric: PerformanceMetric = {
        name: "LCP",
        value: 5000, // 超过阈值
        id: "test-2",
        label: "web-vital",
      }

      reportWebVitals(metric)

      expect(global.console.warn).toHaveBeenCalledWith("[Performance] 警告: LCP 性能不达标", expect.any(Object))
    })

    it("应该正确评级FID指标", () => {
      const goodMetric: PerformanceMetric = {
        name: "FID",
        value: 80,
        id: "test-3",
        label: "web-vital",
      }

      reportWebVitals(goodMetric)

      expect(global.console.log).toHaveBeenCalledWith(
        "[Performance] FID:",
        expect.objectContaining({
          rating: "good",
        }),
      )
    })
  })

  describe("markPerformance", () => {
    it("应该创建性能标记", () => {
      const mockMark = jest.fn()
      Object.defineProperty(global.window, "performance", {
        writable: true,
        value: { mark: mockMark },
      })

      markPerformance("test-mark")

      expect(mockMark).toHaveBeenCalledWith("test-mark")
    })
  })

  describe("measurePerformance", () => {
    it("应该测量性能并返回持续时间", () => {
      const mockMeasure = jest.fn(() => ({ duration: 123.45 }))
      Object.defineProperty(global.window, "performance", {
        writable: true,
        value: { measure: mockMeasure },
      })

      const duration = measurePerformance("test-measure", "start", "end")

      expect(mockMeasure).toHaveBeenCalledWith("test-measure", "start", "end")
      expect(duration).toBe(123.45)
      expect(global.console.log).toHaveBeenCalledWith("[Performance] test-measure: 123.45ms")
    })
  })
})
