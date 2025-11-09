# 代码质量指南

Phase 3: 持续改进 - 代码质量规范

## TypeScript 使用规范

### 类型定义
- 使用 `interface` 定义对象类型
- 使用 `type` 定义联合类型、交叉类型
- 避免使用 `any`，改用 `unknown` + 类型守卫
- 为所有函数参数和返回值添加类型注解

\`\`\`typescript
// ✅ 好的示例
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ 避免
function getUser(id): any {
  // ...
}
\`\`\`

### 严格模式
- 启用所有 TypeScript 严格检查选项
- 使用 `noUncheckedIndexedAccess` 防止索引访问错误
- 使用 `exactOptionalPropertyTypes` 精确处理可选属性

## React 组件规范

### 组件设计
- 保持组件单一职责
- 优先使用函数组件和 Hooks
- 组件文件名使用 PascalCase
- 一个文件只导出一个组件

\`\`\`typescript
// ✅ 好的示例
export function UserCard({ user }: { user: User }) {
  return <div>{user.name}</div>;
}

// ❌ 避免
export default ({ data }) => <div>{data.name}</div>;
\`\`\`

### 性能优化
- 使用 `React.memo` 避免不必要的重渲染
- 使用 `useMemo` 和 `useCallback` 优化计算和回调
- 避免在渲染函数中创建新对象或数组
- 使用 `key` 属性优化列表渲染

## 错误处理

### 异步错误处理
\`\`\`typescript
// 使用 tryCatch 包装
const [data, error] = await tryCatch(fetchData());
if (error) {
  logger.error('Failed to fetch data', error);
  return;
}
\`\`\`

### 错误边界
- 为关键组件添加 ErrorBoundary
- 提供友好的错误提示
- 上报错误到监控系统

## 测试规范

### 单元测试
- 测试覆盖率目标：80%+
- 为所有纯函数编写测试
- 为关键业务逻辑编写测试

### 集成测试
- 测试用户关键路径
- 测试 API 集成
- 测试状态管理

### E2E 测试
- 测试核心用户流程
- 测试多浏览器兼容性

## 性能优化清单

- [ ] 使用代码分割减少初始加载体积
- [ ] 图片使用 Next.js Image 优化
- [ ] 实施懒加载和预加载策略
- [ ] 使用 Web Workers 处理重计算
- [ ] 优化 CSS，避免重复样式
- [ ] 使用 CDN 加速静态资源
- [ ] 实施 HTTP 缓存策略

## 安全规范

- 不在客户端存储敏感数据
- 使用 HTTPS 传输数据
- 实施 CSP（内容安全策略）
- 防止 XSS 和 CSRF 攻击
- 定期更新依赖包修复漏洞

## Git 提交规范

\`\`\`
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
perf: 性能优化
test: 测试相关
chore: 构建工具或辅助工具变动
\`\`\`

示例：
\`\`\`
feat(auth): 添加用户登录功能
fix(api): 修复数据同步错误
docs(readme): 更新安装说明
