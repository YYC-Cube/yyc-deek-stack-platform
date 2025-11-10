# 环境变量配置指南

本文档列出了 YanYuCloud³ 项目所需的所有环境变量。

## 必需的环境变量

### 应用配置

\`\`\`env
NEXT_PUBLIC_NODE_ENV=development
\`\`\`
- **说明**: 应用运行环境（development/production）
- **默认值**: development
- **是否必需**: 否（自动从 NODE_ENV 读取）

\`\`\`env
NEXT_PUBLIC_APP_VERSION=1.0.0
\`\`\`
- **说明**: 应用版本号
- **默认值**: 从 package.json 读取
- **是否必需**: 否

\`\`\`env
NEXT_PUBLIC_BUILD_DATE=2024-01-01T00:00:00.000Z
\`\`\`
- **说明**: 构建时间戳
- **默认值**: 构建时自动生成
- **是否必需**: 否

## 可选的环境变量

### Supabase 配置

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
\`\`\`
- **说明**: Supabase 数据库连接配置
- **是否必需**: 如果使用 Supabase 功能则必需

### Sentry 错误监控

\`\`\`env
SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
\`\`\`
- **说明**: Sentry 错误追踪配置
- **是否必需**: 生产环境推荐配置

### Vercel Analytics

\`\`\`env
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
\`\`\`
- **说明**: Vercel 分析追踪 ID
- **是否必需**: 如果使用 Vercel Analytics 则必需

### 数据库配置

\`\`\`env
DATABASE_URL=postgresql://user:password@host:5432/dbname
\`\`\`
- **说明**: PostgreSQL 数据库连接字符串
- **是否必需**: 如果使用数据库功能则必需

### Redis 缓存

\`\`\`env
REDIS_URL=redis://localhost:6379
\`\`\`
- **说明**: Redis 缓存服务器地址
- **是否必需**: 如果使用缓存功能则必需

## 配置方式

### 本地开发

1. 复制 `.env.example` 为 `.env.local`：
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

2. 填写必需的环境变量

3. 重启开发服务器：
   \`\`\`bash
   npm run dev
   \`\`\`

### Vercel 部署

1. 在 Vercel 项目设置中添加环境变量
2. 选择对应的环境（Production/Preview/Development）
3. 重新部署项目

### Docker 部署

在 `docker-compose.yml` 中配置环境变量：

\`\`\`yaml
environment:
  - NEXT_PUBLIC_NODE_ENV=production
  - NEXT_PUBLIC_APP_VERSION=1.0.0
  - DATABASE_URL=postgresql://...
\`\`\`

## 安全注意事项

1. **不要提交包含真实密钥的 `.env` 文件到 Git**
2. **NEXT_PUBLIC_** 前缀的变量会暴露到客户端，不要存储敏感信息
3. **定期轮换 API 密钥和数据库密码**
4. **使用 Vercel 或 GitHub Secrets 管理生产环境密钥**

## 故障排查

### 环境变量未生效

1. 检查变量名是否有 `NEXT_PUBLIC_` 前缀（客户端使用）
2. 重启开发服务器
3. 清除 `.next` 缓存：`rm -rf .next`

### 部署后环境变量错误

1. 确认在 Vercel 中已正确设置环境变量
2. 检查环境变量的作用域（Production/Preview/Development）
3. 触发重新部署
