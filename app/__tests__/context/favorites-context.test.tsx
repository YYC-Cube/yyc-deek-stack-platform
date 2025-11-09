"use client"

import { describe, expect, it, jest, beforeEach } from "@jest/globals"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { FavoritesProvider, useFavorites } from "@/app/context/favorites-context"
import type { Integration } from "@/app/types"

const mockIntegrations: Integration[] = [
  {
    id: "test-1",
    name: "Test Integration 1",
    description: "Test description",
    category: "测试分类",
    icon: () => null,
    color: "#000000",
    tags: ["test"],
    pricing: "free",
    developer: "Test Dev",
    lastUpdated: "2024-01-01",
    version: "1.0.0",
    compatibility: ["web"],
    verified: true,
    featured: false,
    rating: 4.5,
    reviews: 100,
    installs: 1000,
  },
]

function TestComponent() {
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites()

  return (
    <div>
      <div data-testid="favorites-count">{favorites.length}</div>
      <button onClick={() => addFavorite("test-1")}>Add Favorite</button>
      <button onClick={() => removeFavorite("test-1")}>Remove Favorite</button>
      <div data-testid="is-favorite">{isFavorite("test-1") ? "true" : "false"}</div>
    </div>
  )
}

describe("FavoritesContext", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("应该正确初始化收藏夹", () => {
    render(
      <FavoritesProvider integrations={mockIntegrations}>
        <TestComponent />
      </FavoritesProvider>,
    )

    expect(screen.getByTestId("favorites-count")).toHaveTextContent("0")
  })

  it("应该能够添加收藏", async () => {
    render(
      <FavoritesProvider integrations={mockIntegrations}>
        <TestComponent />
      </FavoritesProvider>,
    )

    fireEvent.click(screen.getByText("Add Favorite"))

    await waitFor(() => {
      expect(screen.getByTestId("favorites-count")).toHaveTextContent("1")
      expect(screen.getByTestId("is-favorite")).toHaveTextContent("true")
    })
  })

  it("应该能够移除收藏", async () => {
    render(
      <FavoritesProvider integrations={mockIntegrations}>
        <TestComponent />
      </FavoritesProvider>,
    )

    // 先添加
    fireEvent.click(screen.getByText("Add Favorite"))
    await waitFor(() => {
      expect(screen.getByTestId("favorites-count")).toHaveTextContent("1")
    })

    // 再移除
    fireEvent.click(screen.getByText("Remove Favorite"))
    await waitFor(() => {
      expect(screen.getByTestId("favorites-count")).toHaveTextContent("0")
      expect(screen.getByTestId("is-favorite")).toHaveTextContent("false")
    })
  })

  it("应该持久化到localStorage", async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem")

    render(
      <FavoritesProvider integrations={mockIntegrations}>
        <TestComponent />
      </FavoritesProvider>,
    )

    fireEvent.click(screen.getByText("Add Favorite"))

    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith("favorites", expect.stringContaining("test-1"))
    })
  })
})
