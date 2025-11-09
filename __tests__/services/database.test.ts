import { describe, it, expect } from "@jest/globals"

describe("DatabaseService", () => {
  it("should initialize database correctly", async () => {
    const { DatabaseService } = await import("@/app/services/database")

    expect(DatabaseService).toBeDefined()
    expect(typeof DatabaseService.init).toBe("function")
  })

  it("should get data from database", async () => {
    const { DatabaseService } = await import("@/app/services/database")

    const data = await DatabaseService.get("test-key")
    expect(data).toBeDefined()
  })

  it("should set data in database", async () => {
    const { DatabaseService } = await import("@/app/services/database")

    const testData = { id: "1", name: "test" }
    await DatabaseService.set("test-key", testData)

    const retrieved = await DatabaseService.get("test-key")
    expect(retrieved).toEqual(testData)
  })
})
