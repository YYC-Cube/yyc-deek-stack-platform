"use client"

import { useEffect } from "react"
import { reportWebVitals, observeLongTasks } from "@/app/utils/performance-monitor"

export function PerformanceMonitor() {
  useEffect(() => {
    // 监控Web Vitals
    if (typeof window !== "undefined") {
      // 动态导入web-vitals库
      import("web-vitals")
        .then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
          onCLS(reportWebVitals)
          onFID(reportWebVitals)
          onFCP(reportWebVitals)
          onLCP(reportWebVitals)
          onTTFB(reportWebVitals)
        })
        .catch((error) => {
          console.error("[Performance] Failed to load web-vitals:", error)
        })

      // 监控长任务
      const observer = observeLongTasks((entries) => {
        const longTasks = entries.filter((entry) => entry.duration > 50)
        if (longTasks.length > 0) {
          console.warn(`[Performance] 检测到 ${longTasks.length} 个长任务`)
        }
      })

      // 清理
      return () => {
        observer?.disconnect()
      }
    }
  }, [])

  return null // 这是一个无UI的监控组件
}
