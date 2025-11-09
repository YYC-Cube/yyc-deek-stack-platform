import { describe, it, expect } from "@jest/globals"

describe("EncryptionService", () => {
  it("should encrypt and decrypt data correctly", async () => {
    const { EncryptionService } = await import("@/app/services/encryption")
    const testData = "sensitive data"
    const password = "test-password"

    const encrypted = await EncryptionService.encrypt(testData, password)
    expect(encrypted).not.toBe(testData)

    const decrypted = await EncryptionService.decrypt(encrypted, password)
    expect(decrypted).toBe(testData)
  })

  it("should fail with wrong password", async () => {
    const { EncryptionService } = await import("@/app/services/encryption")
    const testData = "sensitive data"
    const password = "test-password"
    const wrongPassword = "wrong-password"

    const encrypted = await EncryptionService.encrypt(testData, password)

    await expect(async () => {
      await EncryptionService.decrypt(encrypted, wrongPassword)
    }).rejects.toThrow()
  })
})
