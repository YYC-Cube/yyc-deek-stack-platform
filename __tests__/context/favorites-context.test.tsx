import { renderHook, act } from "@testing-library/react"
import { FavoritesProvider, useFavorites } from "@/app/context/favorites-context"
import type React from "react"

describe("FavoritesContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => <FavoritesProvider>{children}</FavoritesProvider>

  const mockIntegration = {
    id: "test-integration",
    name: "Test Integration",
    description: "Test Description",
    category: "Test Category",
  }

  it("should initialize with empty favorites", () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })
    expect(result.current.favorites).toEqual([])
  })

  it("should add favorite", () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })

    act(() => {
      result.current.addFavorite(mockIntegration)
    })

    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0].id).toBe("test-integration")
  })

  it("should remove favorite", () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })

    act(() => {
      result.current.addFavorite(mockIntegration)
    })

    act(() => {
      result.current.removeFavorite("test-integration")
    })

    expect(result.current.favorites).toHaveLength(0)
  })

  it("should check if integration is favorite", () => {
    const { result } = renderHook(() => useFavorites(), { wrapper })

    act(() => {
      result.current.addFavorite(mockIntegration)
    })

    expect(result.current.isFavorite("test-integration")).toBe(true)
    expect(result.current.isFavorite("non-existent")).toBe(false)
  })
})
