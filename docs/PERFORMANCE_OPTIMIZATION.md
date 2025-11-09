# 性能优化指南

Phase 3: 持续改进 - 性能优化规范

## React 性能优化

### 避免不必要的重渲染
\`\`\`typescript
// 使用 React.memo
const MemoizedComponent = React.memo(Component);

// 使用 useMemo 优化计算
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// 使用 useCallback 优化回调
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);
\`\`\`

### 列表优化
\`\`\`typescript
// 使用稳定的 key
{items.map(item => (
  <Item key={item.id} data={item} />
))}

// 虚拟滚动大列表
import { VirtualList } from '@/components/virtual-list';
\`\`\`

## 代码分割

### 路由级别分割
\`\`\`typescript
// Next.js 自动支持
// 每个 page 文件自动分割

// 动态导入
const DynamicComponent = dynamic(() => import('./Component'));
\`\`\`

### 组件级别分割
\`\`\`typescript
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false, // 仅客户端加载
});
\`\`\`

## 图片优化

### 使用 Next.js Image
\`\`\`tsx
import Image from 'next/image';

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="描述"
  loading="lazy"
  placeholder="blur"
/>
\`\`\`

### 响应式图片
\`\`\`tsx
<Image
  src="/image.jpg"
  sizes="(max-width: 768px) 100vw, 50vw"
  fill
  alt="描述"
/>
\`\`\`

## 网络请求优化

### 数据缓存
\`\`\`typescript
// SWR 自动缓存
import useSWR from 'swr';

const { data } = useSWR('/api/user', fetcher, {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
});
\`\`\`

### 请求批处理
\`\`\`typescript
// 合并多个请求
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments(),
]);
\`\`\`

### 预加载
\`\`\`typescript
// 预加载关键资源
<link rel="preload" href="/font.woff2" as="font" />

// 预连接第三方域名
<link rel="preconnect" href="https://api.example.com" />
\`\`\`

## CSS 性能

### 避免布局抖动
\`\`\`css
/* ✅ 使用 transform */
.element {
  transform: translateX(100px);
}

/* ❌ 避免 */
.element {
  left: 100px;
}
\`\`\`

### GPU 加速
\`\`\`css
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}
\`\`\`

### 关键 CSS 内联
\`\`\`tsx
// Next.js 自动处理
// 首屏 CSS 自动内联
\`\`\`

## Bundle 优化

### 分析 Bundle 大小
\`\`\`bash
npm run build
npx @next/bundle-analyzer
\`\`\`

### Tree Shaking
\`\`\`typescript
// ✅ 具名导入
import { Button } from '@/components/ui';

// ❌ 避免默认导出全部
import * as Components from '@/components/ui';
\`\`\`

### 压缩和混淆
\`\`\`javascript
// next.config.js
module.exports = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  swcMinify: true,
};
\`\`\`

## Web Vitals 优化

### LCP (Largest Contentful Paint)
- 目标：< 2.5s
- 优化图片加载
- 优化服务器响应时间
- 预加载关键资源

### FID (First Input Delay)
- 目标：< 100ms
- 减少 JavaScript 执行时间
- 代码分割
- 使用 Web Workers

### CLS (Cumulative Layout Shift)
- 目标：< 0.1
- 为图片设置尺寸
- 避免动态插入内容
- 使用 transform 动画

### TTFB (Time to First Byte)
- 目标：< 600ms
- 优化服务器性能
- 使用 CDN
- 实施缓存策略

## 性能监控

### Web Vitals 上报
\`\`\`typescript
export function reportWebVitals(metric: NextWebVitalsMetric) {
  // 上报到分析服务
  if (metric.label === 'web-vital') {
    console.log(metric);
  }
}
\`\`\`

### 自定义性能测量
\`\`\`typescript
const { start, end } = usePerformanceMeasure('data-fetch');

start();
await fetchData();
end();
\`\`\`

## 性能预算

### 设置阈值
\`\`\`json
{
  "budgets": [
    {
      "path": "/_app.js",
      "maxSize": "150kb"
    },
    {
      "path": "/page.js",
      "maxSize": "100kb"
    }
  ]
}
\`\`\`

### 监控指标
- First Load JS: < 200kb
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- TTFB: < 600ms

## 优化清单

- [ ] 使用 Next.js Image 组件
- [ ] 实施代码分割
- [ ] 启用 SWR 缓存
- [ ] 优化 Web Vitals
- [ ] 使用 CDN
- [ ] 压缩资源
- [ ] 实施懒加载
- [ ] 添加性能监控
- [ ] 设置性能预算
- [ ] 定期性能审计
