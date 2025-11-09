"use client"

import { useEffect, useRef, useState, useCallback } from "react"

/**
 * Phase 3: 性能监控 Hook
 * 用于监控组件渲染性能
 */
export function usePerformance(componentName: string) {
  const renderCount = useRef(0)
  const renderTimes = useRef<number[]>([])
  const startTime = useRef<number>(0)

  useEffect(() => {
    renderCount.current += 1
    const endTime = performance.now()
    const renderTime = endTime - startTime.current
    renderTimes.current.push(renderTime)

    // 只在开发环境记录
    if (process.env.NODE_ENV === "development") {
      console.log(`[Performance] ${componentName} rendered ${renderCount.current} times`)
      console.log(`[Performance] Last render took ${renderTime.toFixed(2)}ms`)
    }
  })

  // 在渲染开始时记录时间
  startTime.current = performance.now()

  return {
    renderCount: renderCount.current,
    averageRenderTime:
      renderTimes.current.length > 0 ? renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length : 0,
  }
}

/**
 * 防抖 Hook
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * 节流 Hook
 */
export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastUpdated = useRef<number>(Date.now())

  useEffect(() => {
    const now = Date.now()
    const timeSinceLastUpdate = now - lastUpdated.current

    if (timeSinceLastUpdate >= interval) {
      lastUpdated.current = now
      setThrottledValue(value)
    } else {
      const timeoutId = setTimeout(() => {
        lastUpdated.current = Date.now()
        setThrottledValue(value)
      }, interval - timeSinceLastUpdate)

      return () => clearTimeout(timeoutId)
    }
  }, [value, interval])

  return throttledValue
}

/**
 * 懒加载图片 Hook
 */
export function useLazyImage(src: string) {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const img = new Image()
    img.src = src

    img.onload = () => {
      setImageSrc(src)
      setIsLoading(false)
    }

    img.onerror = () => {
      setError(new Error(`Failed to load image: ${src}`))
      setIsLoading(false)
    }

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  return { imageSrc, isLoading, error }
}

/**
 * 性能测量 Hook
 */
export function usePerformanceMeasure(name: string) {
  const startMark = useRef<string>(`${name}-start`)
  const endMark = useRef<string>(`${name}-end`)

  const start = useCallback(() => {
    performance.mark(startMark.current)
  }, [])

  const end = useCallback(() => {
    performance.mark(endMark.current)
    performance.measure(name, startMark.current, endMark.current)

    const measure = performance.getEntriesByName(name)[0]
    if (measure && process.env.NODE_ENV === "development") {
      console.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`)
    }

    // 清理标记
    performance.clearMarks(startMark.current)
    performance.clearMarks(endMark.current)
    performance.clearMeasures(name)
  }, [name])

  useEffect(() => {
    return () => {
      // 清理所有标记
      performance.clearMarks(startMark.current)
      performance.clearMarks(endMark.current)
      performance.clearMeasures(name)
    }
  }, [name])

  return { start, end }
}
