import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 速率限制存储（生产环境建议使用Redis）
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

// 速率限制配置
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15分钟
  maxRequests: 100, // 最多100个请求
}

function getRateLimitKey(request: NextRequest): string {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
  return `rate-limit:${ip}`
}

function checkRateLimit(request: NextRequest): boolean {
  const key = getRateLimitKey(request)
  const now = Date.now()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    // 创建新记录或重置过期记录
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs,
    })
    return true
  }

  if (record.count >= RATE_LIMIT.maxRequests) {
    return false
  }

  record.count++
  return true
}

// 清理过期的速率限制记录
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 60000) // 每分钟清理一次

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // API路由速率限制
  if (pathname.startsWith("/api/")) {
    if (!checkRateLimit(request)) {
      return NextResponse.json(
        { error: "请求过于频繁，请稍后再试" },
        {
          status: 429,
          headers: {
            "Retry-After": "900", // 15分钟后重试
          },
        },
      )
    }
  }

  // CSRF保护 - 验证来源
  if (request.method !== "GET" && pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin")
    const host = request.headers.get("host")

    if (origin && host) {
      const originHost = new URL(origin).host
      if (originHost !== host) {
        console.warn(`[Security] CSRF attempt detected: ${origin} -> ${host}`)
        return NextResponse.json({ error: "请求来源验证失败" }, { status: 403 })
      }
    }
  }

  const response = NextResponse.next()

  // 添加安全响应头
  response.headers.set("X-DNS-Prefetch-Control", "on")
  response.headers.set("X-Frame-Options", "SAMEORIGIN")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  // CSP头（仅在生产环境）
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;",
    )
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|icons).*)"],
}
