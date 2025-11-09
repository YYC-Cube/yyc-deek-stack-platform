"use client"

import { useState } from "react"

import { useEffect, useRef, useCallback } from "react"

/**
 * Phase 3: 无障碍性 Hook
 */

/**
 * 焦点陷阱 Hook - 用于模态框等场景
 */
export function useFocusTrap(active: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    // 自动聚焦第一个元素
    firstElement?.focus()

    container.addEventListener("keydown", handleTabKey)
    return () => container.removeEventListener("keydown", handleTabKey)
  }, [active])

  return containerRef
}

/**
 * 焦点恢复 Hook - 关闭模态框时恢复焦点
 */
export function useFocusReturn() {
  const previousActiveElement = useRef<HTMLElement | null>(null)

  const saveFocus = useCallback(() => {
    previousActiveElement.current = document.activeElement as HTMLElement
  }, [])

  const restoreFocus = useCallback(() => {
    previousActiveElement.current?.focus()
  }, [])

  return { saveFocus, restoreFocus }
}

/**
 * 键盘导航 Hook
 */
export function useKeyboardNavigation(onEscape?: () => void, onEnter?: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onEscape) {
        onEscape()
      }
      if (e.key === "Enter" && onEnter) {
        onEnter()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onEscape, onEnter])
}

/**
 * 屏幕阅读器通知 Hook
 */
export function useAnnouncement() {
  const announcementRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // 创建 ARIA live region
    const div = document.createElement("div")
    div.setAttribute("role", "status")
    div.setAttribute("aria-live", "polite")
    div.setAttribute("aria-atomic", "true")
    div.className = "sr-only"
    document.body.appendChild(div)
    announcementRef.current = div

    return () => {
      if (announcementRef.current) {
        document.body.removeChild(announcementRef.current)
      }
    }
  }, [])

  const announce = useCallback((message: string) => {
    if (announcementRef.current) {
      announcementRef.current.textContent = message
    }
  }, [])

  return announce
}

/**
 * 减弱动画偏好检测 Hook
 */
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return prefersReducedMotion
}
