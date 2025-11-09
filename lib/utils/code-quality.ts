/**
 * Phase 3: 代码质量工具函数
 */

/**
 * 日志级别
 */
export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

/**
 * 结构化日志器
 */
export class Logger {
  private context: string

  constructor(context: string) {
    this.context = context
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    const timestamp = new Date().toISOString()
    const logData = {
      timestamp,
      level,
      context: this.context,
      message,
      ...(data && { data }),
    }

    // 开发环境：格式化输出
    if (process.env.NODE_ENV === "development") {
      const color = {
        [LogLevel.DEBUG]: "\x1b[36m",
        [LogLevel.INFO]: "\x1b[32m",
        [LogLevel.WARN]: "\x1b[33m",
        [LogLevel.ERROR]: "\x1b[31m",
      }[level]

      console.log(`${color}[${level.toUpperCase()}]\x1b[0m [${this.context}] ${message}`, data || "")
    } else {
      // 生产环境：JSON 输出（便于日志收集）
      console.log(JSON.stringify(logData))
    }
  }

  debug(message: string, data?: unknown) {
    this.log(LogLevel.DEBUG, message, data)
  }

  info(message: string, data?: unknown) {
    this.log(LogLevel.INFO, message, data)
  }

  warn(message: string, data?: unknown) {
    this.log(LogLevel.WARN, message, data)
  }

  error(message: string, error?: unknown) {
    this.log(
      LogLevel.ERROR,
      message,
      error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
          }
        : error,
    )
  }
}

/**
 * 错误处理装饰器
 */
export function withErrorBoundary<T extends (...args: unknown[]) => unknown>(fn: T, fallback?: unknown): T {
  return ((...args: Parameters<T>) => {
    try {
      return fn(...args)
    } catch (error) {
      console.error("Error in function:", fn.name, error)
      return fallback
    }
  }) as T
}

/**
 * 异步错误处理
 */
export async function tryCatch<T>(promise: Promise<T>): Promise<[T | null, Error | null]> {
  try {
    const data = await promise
    return [data, null]
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))]
  }
}

/**
 * 重试函数
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number
    delay?: number
    backoff?: boolean
  } = {},
): Promise<T> {
  const { maxAttempts = 3, delay = 1000, backoff = true } = options

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error
      }

      const waitTime = backoff ? delay * attempt : delay
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
  }

  throw new Error("Retry failed")
}

/**
 * 缓存装饰器
 */
export function memoize<T extends (...args: unknown[]) => unknown>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = fn(...args) as ReturnType<T>
    cache.set(key, result)
    return result
  }) as T
}
