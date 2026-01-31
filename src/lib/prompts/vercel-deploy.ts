export const VERCEL_DEPLOY_PROMPT = `# Vercel 部署指南

## 部署前检查清单

### 1. Next.js useSearchParams Suspense 问题

**问题**: 使用 \`useSearchParams()\` 的页面在构建时会报错：
\`\`\`
useSearchParams() should be wrapped in a suspense boundary at page "/auth/callback"
\`\`\`

**解决方案**: 将使用 \`useSearchParams()\` 的逻辑提取到子组件，并用 \`<Suspense>\` 包裹：

\`\`\`tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ContentWithSearchParams() {
  const searchParams = useSearchParams();
  // ... 使用 searchParams 的逻辑
  return <div>...</div>;
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingUI />}>
      <ContentWithSearchParams />
    </Suspense>
  );
}
\`\`\`

### 2. 本地构建验证

部署前务必本地验证构建：
\`\`\`bash
npm run build
\`\`\`

---

## Vercel 环境变量设置

### ⚠️ 重要：避免换行符问题

**问题**: 使用 \`echo\` 设置环境变量会在值末尾添加换行符 \`\\n\`，导致 URL 中出现 \`%0A\`，产生错误：
\`\`\`xml
<Error>
  <Code>InvalidURI</Code>
  <Message>%0A are not allowed in URI</Message>
</Error>
\`\`\`

**正确做法**: 使用 \`printf\` 代替 \`echo\`：

\`\`\`bash
# ❌ 错误 - echo 会添加换行符
echo "https://example.com" | vercel env add MY_URL production

# ✅ 正确 - printf 不会添加换行符
printf 'https://example.com' | vercel env add MY_URL production
\`\`\`

### 环境变量设置命令

\`\`\`bash
# SecondMe OAuth 配置
printf 'your-client-id' | vercel env add SECONDME_CLIENT_ID production
printf 'your-client-secret' | vercel env add SECONDME_CLIENT_SECRET production
printf 'https://your-domain.vercel.app/auth/callback' | vercel env add SECONDME_REDIRECT_URI production

# SecondMe API 配置
printf 'https://app.mindos.com/gate/lab' | vercel env add SECONDME_API_BASE_URL production
printf 'https://go.second.me/oauth/' | vercel env add SECONDME_OAUTH_URL production

# NextAuth 配置
printf 'your-random-secret-key' | vercel env add NEXTAUTH_SECRET production
printf 'https://your-domain.vercel.app' | vercel env add NEXTAUTH_URL production
\`\`\`

### 生成安全的 Secret

\`\`\`bash
# 生成随机 secret
printf 'your-app-secret-%s' "$(openssl rand -hex 16)" | vercel env add NEXTAUTH_SECRET production
\`\`\`

### 环境变量管理命令

\`\`\`bash
# 查看所有环境变量
vercel env ls

# 删除环境变量（修复问题时需要先删除再添加）
vercel env rm VARIABLE_NAME production -y

# 拉取环境变量到本地
vercel env pull
\`\`\`

---

## 部署命令

\`\`\`bash
# 部署到生产环境
vercel --prod

# 部署到预览环境
vercel

# 查看部署日志
vercel inspect <deployment-url> --logs
\`\`\`

---

## 调试技巧

### 检查 OAuth 重定向 URL

当 OAuth 登录出现问题时，检查生成的重定向 URL：

\`\`\`bash
curl -s -I "https://your-domain.vercel.app/api/auth/login" | grep -i location
\`\`\`

正确的 URL 应该是：
\`\`\`
location: https://go.second.me/oauth/?client_id=xxx&redirect_uri=...
\`\`\`

如果看到 \`%0A\` 在任何参数后面，说明环境变量包含换行符，需要重新设置。

### 验证网站是否正常

\`\`\`bash
curl -s -o /dev/null -w "%{http_code}" https://your-domain.vercel.app/
# 应该返回 200
\`\`\`

---

## 完整部署流程 Prompt

复制以下 prompt 给 Claude Code 执行自动部署：

\`\`\`
请帮我部署这个 Next.js 项目到 Vercel：

1. 首先运行 \`npm run build\` 验证构建是否成功
2. 如果遇到 useSearchParams Suspense 错误，请修复它
3. 使用 \`vercel env ls\` 检查现有环境变量
4. 使用 printf（不是 echo）设置以下环境变量到 production：
   - SECONDME_CLIENT_ID: [你的 client id]
   - SECONDME_CLIENT_SECRET: [你的 client secret]
   - SECONDME_REDIRECT_URI: https://[你的域名]/auth/callback
   - SECONDME_API_BASE_URL: https://app.mindos.com/gate/lab
   - SECONDME_OAUTH_URL: https://go.second.me/oauth/
   - NEXTAUTH_SECRET: 生成一个随机值
   - NEXTAUTH_URL: https://[你的域名]
5. 运行 \`vercel --prod\` 部署
6. 部署后用 curl 验证 /api/auth/login 的重定向 URL 是否正确（不应包含 %0A）
\`\`\`

---

## 常见问题排查

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| \`%0A are not allowed in URI\` | 环境变量包含换行符 | 使用 \`printf\` 重新设置环境变量 |
| \`useSearchParams() should be wrapped in suspense\` | Next.js 静态预渲染要求 | 用 \`<Suspense>\` 包裹使用 \`useSearchParams\` 的组件 |
| OAuth 回调失败 | redirect_uri 不匹配 | 确保 SECONDME_REDIRECT_URI 与实际部署域名一致 |
| 部署后环境变量未生效 | 需要重新部署 | 修改环境变量后运行 \`vercel --prod\` |
`;
