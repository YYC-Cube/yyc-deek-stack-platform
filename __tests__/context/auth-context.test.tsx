"use client"

import { renderHook, act, waitFor } from "@testing-library/react"
import { AuthProvider, useAuth } from "@/app/context/auth-context"
import type React from "react"

describe("AuthContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>

  it("should initialize with no user", () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })

  it("should login successfully", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login("test@example.com", "password123")
    })

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).not.toBeNull()
    })
  })

  it("should logout successfully", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login("test@example.com", "password123")
    })

    await act(async () => {
      await result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })
})
