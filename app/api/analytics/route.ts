import { type NextRequest, NextResponse } from "next/server"
import { ErrorLogger } from "@/app/lib/monitoring"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const { name, value, id } = data

    console.log("[Analytics] Web Vital:", { name, value, id })

    if (name && value) {
      if (name === "LCP" && value > 2500) {
        ErrorLogger.logWarning("Slow LCP detected", { value, id })
      } else if (name === "FID" && value > 100) {
        ErrorLogger.logWarning("Slow FID detected", { value, id })
      } else if (name === "CLS" && value > 0.1) {
        ErrorLogger.logWarning("High CLS detected", { value, id })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    ErrorLogger.logError(error as Error, { endpoint: "/api/analytics" })
    return NextResponse.json({ error: "Failed to process analytics" }, { status: 500 })
  }
}
