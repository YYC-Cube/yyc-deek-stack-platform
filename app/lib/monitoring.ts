import * as Sentry from "@sentry/nextjs"

export class ErrorLogger {
  static logError(error: Error, context?: Record<string, any>) {
    console.error("[ErrorLogger]", error, context)

    Sentry.captureException(error, {
      contexts: {
        additional: context,
      },
    })
  }

  static logWarning(message: string, context?: Record<string, any>) {
    console.warn("[Warning]", message, context)

    Sentry.captureMessage(message, {
      level: "warning",
      contexts: {
        additional: context,
      },
    })
  }

  static logInfo(message: string, context?: Record<string, any>) {
    console.info("[Info]", message, context)
  }

  static setUser(userId: string, email?: string, username?: string) {
    Sentry.setUser({
      id: userId,
      email,
      username,
    })
  }

  static clearUser() {
    Sentry.setUser(null)
  }

  static addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
    Sentry.addBreadcrumb({
      message,
      category,
      data,
      level: "info",
    })
  }
}

export class PerformanceMonitor {
  static startTransaction(name: string, op: string) {
    return Sentry.startTransaction({
      name,
      op,
    })
  }

  static measurePageLoad(pageName: string) {
    const transaction = this.startTransaction(pageName, "pageload")

    if (typeof window !== "undefined" && window.performance) {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming

      if (navigation) {
        transaction.setMeasurement("ttfb", navigation.responseStart - navigation.requestStart, "millisecond")
        transaction.setMeasurement("fcp", navigation.responseEnd - navigation.requestStart, "millisecond")
        transaction.setMeasurement(
          "domLoad",
          navigation.domContentLoadedEventEnd - navigation.fetchStart,
          "millisecond",
        )
        transaction.setMeasurement("windowLoad", navigation.loadEventEnd - navigation.fetchStart, "millisecond")
      }
    }

    return transaction
  }

  static recordMetric(name: string, value: number, unit = "millisecond") {
    Sentry.metrics.distribution(name, value, {
      unit,
      tags: {
        environment: process.env.NODE_ENV || "development",
      },
    })
  }
}
