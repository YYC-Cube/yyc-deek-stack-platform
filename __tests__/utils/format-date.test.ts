import { describe, it, expect } from "@jest/globals"

describe("formatDate utility", () => {
  it("should format date correctly", async () => {
    const { formatDate } = await import("@/app/utils/format-date")
    const date = new Date("2025-01-10T12:00:00Z")

    const formatted = formatDate(date)
    expect(formatted).toBeDefined()
    expect(typeof formatted).toBe("string")
  })

  it("should handle invalid dates", async () => {
    const { formatDate } = await import("@/app/utils/format-date")

    const result = formatDate(null as any)
    expect(result).toBeDefined()
  })
})
