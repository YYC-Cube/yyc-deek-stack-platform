import { describe, it, expect } from "@jest/globals"

describe("Health API", () => {
  it("should return healthy status", async () => {
    const response = await fetch("http://localhost:3000/api/health")
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.status).toBe("healthy")
    expect(data.checks).toBeDefined()
  })

  it("should include uptime information", async () => {
    const response = await fetch("http://localhost:3000/api/health")
    const data = await response.json()

    expect(data.uptime).toBeGreaterThan(0)
    expect(data.timestamp).toBeDefined()
  })

  it("should include memory information", async () => {
    const response = await fetch("http://localhost:3000/api/health")
    const data = await response.json()

    expect(data.memory).toBeDefined()
    expect(data.memory.used).toBeDefined()
    expect(data.memory.total).toBeDefined()
  })
})
