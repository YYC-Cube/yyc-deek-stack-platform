// 中间件 - 性能和安全增强
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 速率限制配置
const RATE_LIMIT_WINDOW = 60 * 1000 // 1分钟
const RATE_LIMIT_MAX_REQUESTS = 100

// 简单的内存存储（生产环境应使用Redis）
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// 速率限制检查
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  record.count++
  return true
}

export function middleware(request: NextRequest) {
  const startTime = Date.now()

  // 获取客户端IP
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"

  // API路由速率限制
  if (request.nextUrl.pathname.startsWith("/api/")) {
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": RATE_LIMIT_MAX_REQUESTS.toString(),
            "X-RateLimit-Remaining": "0",
          },
        },
      )
    }
  }

  // 添加安全头
  const response = NextResponse.next()

  // CORS配置（根据需要调整）
  response.headers.set("Access-Control-Allow-Origin", "*")
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

  // 性能监控头
  const processingTime = Date.now() - startTime
  response.headers.set("X-Response-Time", `${processingTime}ms`)

  // 服务器时间头
  response.headers.set("X-Server-Time", new Date().toISOString())

  return response
}

// 配置中间件应用路径
export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
}
