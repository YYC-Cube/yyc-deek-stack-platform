export interface PerformanceMetric {
  name: string
  value: number
  id: string
  label: "web-vital" | "custom"
  rating?: "good" | "needs-improvement" | "poor"
}

interface PerformanceThreshold {
  good: number
  needsImprovement: number
}

const thresholds: Record<string, PerformanceThreshold> = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  TTFB: { good: 600, needsImprovement: 1000 },
  FCP: { good: 1800, needsImprovement: 3000 },
}

function getRating(name: string, value: number): "good" | "needs-improvement" | "poor" {
  const threshold = thresholds[name]
  if (!threshold) return "good"

  if (value <= threshold.good) return "good"
  if (value <= threshold.needsImprovement) return "needs-improvement"
  return "poor"
}

export function reportWebVitals(metric: PerformanceMetric) {
  const rating = getRating(metric.name, metric.value)

  const enhancedMetric = {
    ...metric,
    rating,
    timestamp: Date.now(),
    url: typeof window !== "undefined" ? window.location.href : "",
  }

  // 控制台日志（开发环境）
  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${metric.name}:`, {
      value: `${metric.value.toFixed(2)}ms`,
      rating,
      id: metric.id,
    })
  }

  // 发送到分析服务
  if (typeof window !== "undefined" && metric.label === "web-vital") {
    try {
      // 使用 sendBeacon 确保数据发送不阻塞页面
      const body = JSON.stringify(enhancedMetric)
      const blob = new Blob([body], { type: "application/json" })
      navigator.sendBeacon("/api/analytics/vitals", blob)
    } catch (error) {
      console.error("[Performance] Failed to send metric:", error)
    }
  }

  // 性能预算警告
  if (rating === "poor") {
    console.warn(`[Performance] 警告: ${metric.name} 性能不达标`, {
      current: metric.value,
      threshold: thresholds[metric.name],
    })
  }
}

// 自定义性能标记
export function markPerformance(name: string) {
  if (typeof window !== "undefined" && window.performance) {
    window.performance.mark(name)
  }
}

// 测量性能指标
export function measurePerformance(name: string, startMark: string, endMark?: string) {
  if (typeof window !== "undefined" && window.performance) {
    try {
      const measure = endMark
        ? window.performance.measure(name, startMark, endMark)
        : window.performance.measure(name, startMark)

      console.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`)
      return measure.duration
    } catch (error) {
      console.error(`[Performance] Failed to measure ${name}:`, error)
    }
  }
  return 0
}

// 监控长任务
export function observeLongTasks(callback: (entries: PerformanceEntry[]) => void) {
  if (typeof window !== "undefined" && "PerformanceObserver" in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        callback(entries)

        entries.forEach((entry) => {
          if (entry.duration > 50) {
            console.warn("[Performance] 检测到长任务:", {
              name: entry.name,
              duration: `${entry.duration.toFixed(2)}ms`,
              startTime: `${entry.startTime.toFixed(2)}ms`,
            })
          }
        })
      })

      observer.observe({ entryTypes: ["longtask"] })
      return observer
    } catch (error) {
      console.error("[Performance] Failed to observe long tasks:", error)
    }
  }
  return null
}
