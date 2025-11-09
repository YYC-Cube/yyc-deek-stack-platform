/** @type {import('next').NextConfig} */
const nextConfig = {
  // 恢复类型检查和ESLint检查以提升代码质量
  eslint: {
    ignoreDuringBuilds: false, // 启用构建时ESLint检查
  },
  typescript: {
    ignoreBuildErrors: false, // 启用TypeScript类型检查
  },
  
  // 图片优化配置
  images: {
    unoptimized: false, // 启用图片优化
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 性能优化
  compress: true, // 启用gzip压缩
  poweredByHeader: false, // 移除X-Powered-By头以提升安全性
  
  // 实验性功能
  experimental: {
    optimizeCss: true, // CSS优化
    optimizePackageImports: ['lucide-react', 'framer-motion'], // 包导入优化
  },

  // 安全头配置
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },

  // 重定向配置
  async redirects() {
    return []
  },

  // Webpack配置优化
  webpack: (config, { isServer }) => {
    // 性能优化
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name: 'lib',
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      }
    }
    return config
  },
}

export default nextConfig
