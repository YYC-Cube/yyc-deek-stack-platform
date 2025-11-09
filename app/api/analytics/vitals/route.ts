import { type NextRequest, NextResponse } from "next/server"

interface VitalMetric {
  name: string
  value: number
  id: string
  rating: "good" | "needs-improvement" | "poor"
  timestamp: number
  url: string
}

// 内存存储（生产环境建议使用数据库）
const metricsStore: VitalMetric[] = []
const MAX_METRICS = 1000

export async function POST(request: NextRequest) {
  try {
    const metric: VitalMetric = await request.json()

    // 验证数据
    if (!metric.name || typeof metric.value !== "number") {
      return NextResponse.json({ error: "无效的性能指标数据" }, { status: 400 })
    }

    // 存储指标
    metricsStore.push(metric)

    // 限制存储大小
    if (metricsStore.length > MAX_METRICS) {
      metricsStore.shift()
    }

    // 日志记录
    console.log("[Analytics] 收到性能指标:", {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Analytics] 处理性能指标失败:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const metricName = searchParams.get("name")

    let filteredMetrics = metricsStore

    // 按指标名称过滤
    if (metricName) {
      filteredMetrics = metricsStore.filter((m) => m.name === metricName)
    }

    // 计算统计信息
    const stats = calculateStats(filteredMetrics)

    return NextResponse.json({
      metrics: filteredMetrics.slice(-100), // 返回最近100条
      stats,
      total: filteredMetrics.length,
    })
  } catch (error) {
    console.error("[Analytics] 获取性能指标失败:", error)
    return NextResponse.json({ error: "服务器内部错误" }, { status: 500 })
  }
}

function calculateStats(metrics: VitalMetric[]) {
  if (metrics.length === 0) {
    return { average: 0, median: 0, p95: 0, good: 0, poor: 0 }
  }

  const values = metrics.map((m) => m.value).sort((a, b) => a - b)
  const sum = values.reduce((acc, val) => acc + val, 0)

  return {
    average: sum / values.length,
    median: values[Math.floor(values.length / 2)],
    p95: values[Math.floor(values.length * 0.95)],
    good: metrics.filter((m) => m.rating === "good").length,
    poor: metrics.filter((m) => m.rating === "poor").length,
  }
}
