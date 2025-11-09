# 无障碍性指南

Phase 3: 持续改进 - 无障碍性规范

## 语义化 HTML

### 使用正确的 HTML 元素
\`\`\`html
<!-- ✅ 好的示例 -->
<button>提交</button>
<nav><a href="/home">首页</a></nav>
<main><h1>页面标题</h1></main>

<!-- ❌ 避免 -->
<div onclick="submit()">提交</div>
<div><span onclick="navigate()">首页</span></div>
\`\`\`

### 标题层级
- 使用 `<h1>` - `<h6>` 建立文档大纲
- 不要跳过标题级别
- 每个页面只有一个 `<h1>`

## ARIA 标签

### 常用 ARIA 属性
- `aria-label`: 为元素提供文本标签
- `aria-labelledby`: 引用其他元素作为标签
- `aria-describedby`: 提供额外描述
- `aria-hidden`: 对屏幕阅读器隐藏元素
- `role`: 定义元素角色

\`\`\`tsx
<button 
  aria-label="关闭对话框"
  onClick={closeDialog}
>
  <XIcon aria-hidden="true" />
</button>
\`\`\`

### ARIA Live Regions
用于动态内容更新通知：
\`\`\`tsx
<div 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
>
  {statusMessage}
</div>
\`\`\`

## 键盘导航

### 可聚焦元素
- 所有交互元素必须可通过键盘访问
- Tab 键顺序应符合视觉顺序
- 提供焦点可见性指示器

### 快捷键
\`\`\`typescript
// 常用快捷键
ESC - 关闭模态框/取消操作
Enter - 确认/提交
Space - 选择/切换
Arrow Keys - 导航列表/菜单
\`\`\`

### 焦点管理
\`\`\`typescript
// 使用焦点陷阱 Hook
const containerRef = useFocusTrap(isModalOpen);

// 焦点恢复
const { saveFocus, restoreFocus } = useFocusReturn();
\`\`\`

## 颜色和对比度

### 对比度要求
- 正常文本：至少 4.5:1
- 大文本（18pt+）：至少 3:1
- UI 组件：至少 3:1

### 不依赖颜色传达信息
\`\`\`tsx
// ✅ 好的示例
<div>
  <CheckIcon aria-hidden="true" />
  <span>成功</span>
</div>

// ❌ 仅用颜色
<div className="text-green">成功</div>
\`\`\`

## 屏幕阅读器

### 隐藏装饰性内容
\`\`\`tsx
<img src="decorative.png" alt="" aria-hidden="true" />
\`\`\`

### 提供文本替代
\`\`\`tsx
// 图标按钮
<button aria-label="搜索">
  <SearchIcon aria-hidden="true" />
</button>

// 图片
<img src="chart.png" alt="2024年销售增长趋势图" />
\`\`\`

### 使用屏幕阅读器专用文本
\`\`\`tsx
<span className="sr-only">
  跳转到主内容
</span>
\`\`\`

## 表单无障碍

### 标签关联
\`\`\`tsx
<label htmlFor="email">邮箱</label>
<input 
  id="email" 
  type="email" 
  aria-required="true"
  aria-describedby="email-hint"
/>
<span id="email-hint">请输入有效的邮箱地址</span>
\`\`\`

### 错误提示
\`\`\`tsx
<input 
  aria-invalid={hasError}
  aria-errormessage="email-error"
/>
{hasError && (
  <div id="email-error" role="alert">
    邮箱格式不正确
  </div>
)}
\`\`\`

## 动画和运动

### 减弱动画偏好
\`\`\`css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
\`\`\`

### 在 React 中检测
\`\`\`typescript
const prefersReducedMotion = usePrefersReducedMotion();

<motion.div
  animate={prefersReducedMotion ? {} : { scale: 1.1 }}
/>
\`\`\`

## 测试清单

- [ ] 使用键盘导航所有功能
- [ ] 使用屏幕阅读器测试（NVDA/JAWS）
- [ ] 检查颜色对比度（使用 WebAIM Contrast Checker）
- [ ] 运行自动化无障碍测试（axe DevTools）
- [ ] 测试放大至 200% 是否可用
- [ ] 测试减弱动画模式
- [ ] 验证 ARIA 属性正确性

## 工具推荐

- **axe DevTools**: 浏览器扩展，自动检测无障碍问题
- **WAVE**: Web 无障碍评估工具
- **Lighthouse**: Chrome DevTools 内置
- **NVDA**: Windows 免费屏幕阅读器
- **VoiceOver**: macOS/iOS 内置屏幕阅读器
