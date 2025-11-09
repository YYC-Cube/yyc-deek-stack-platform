module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      settings: {
        preset: "desktop",
      },
    },
    assert: {
      assertions: {
        // 性能指标
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.95 }],
        "categories:pwa": ["warn", { minScore: 0.8 }],

        // Core Web Vitals
        "first-contentful-paint": ["warn", { maxNumericValue: 1800 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 200 }],
        "speed-index": ["warn", { maxNumericValue: 3000 }],

        // 资源优化
        "uses-responsive-images": "error",
        "offscreen-images": "warn",
        "uses-optimized-images": "warn",
        "modern-image-formats": "warn",
        "unminified-css": "error",
        "unminified-javascript": "error",
        "unused-css-rules": "warn",
        "unused-javascript": "warn",
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
}
