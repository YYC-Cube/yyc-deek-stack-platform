import "@testing-library/jest-dom"
import jest from "jest"
import afterEach from "afterEach"

// 全局测试环境配置
global.fetch = jest.fn()

// Mock Next.js路由
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  })),
  usePathname: jest.fn(() => "/"),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}))

// Mock Framer Motion以提升测试性能
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => children,
}))

// 清理每个测试后的mock
afterEach(() => {
  jest.clearAllMocks()
})
