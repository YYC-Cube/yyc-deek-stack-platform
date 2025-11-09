/**
 * 通用类型定义
 * Phase 3: 代码质量提升 - 类型系统
 */

/**
 * API 响应基础类型
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: number
}

/**
 * API 错误响应
 */
export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
  stack?: string
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page: number
  pageSize: number
  total?: number
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

/**
 * 用户类型
 */
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: "admin" | "user" | "guest"
  createdAt: string
  updatedAt: string
}

/**
 * 集成配置类型
 */
export interface Integration {
  id: string
  name: string
  description: string
  icon: string
  category: string
  status: "active" | "inactive" | "error"
  config?: Record<string, unknown>
  lastSync?: string
}

/**
 * Web Vitals 类型
 */
export interface WebVitals {
  name: "CLS" | "FID" | "FCP" | "LCP" | "TTFB" | "INP"
  value: number
  rating: "good" | "needs-improvement" | "poor"
  delta: number
  id: string
}

/**
 * 性能指标类型
 */
export interface PerformanceMetrics {
  timestamp: number
  metrics: {
    timeToFirstByte?: number
    firstContentfulPaint?: number
    largestContentfulPaint?: number
    firstInputDelay?: number
    cumulativeLayoutShift?: number
    interactionToNextPaint?: number
  }
  navigation: {
    type: string
    redirectCount: number
  }
}

/**
 * 类型守卫：检查是否为有效的 API 响应
 */
export function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    typeof (value as ApiResponse).success === "boolean"
  )
}

/**
 * 类型守卫：检查是否为 API 错误
 */
export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "message" in value &&
    typeof (value as ApiError).code === "string" &&
    typeof (value as ApiError).message === "string"
  )
}

/**
 * 类型断言：确保值不为 null 或 undefined
 */
export function assertDefined<T>(value: T | null | undefined, message = "Value must be defined"): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message)
  }
}
