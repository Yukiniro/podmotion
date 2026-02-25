# AGENTS.md - 项目开发指南

## 构建与开发命令

```bash
pnpm dev             # 启动开发服务器
pnpm build           # 生产环境构建
pnpm start           # 启动生产服务器
pnpm lint            # 运行 ESLint
pnpm lint:fix        # 自动修复 ESLint 问题
pnpm type-check      # TypeScript 编译检查
pnpm test            # 监听模式运行测试
pnpm test:run        # 单次运行测试
pnpm test:ui         # 带 UI 运行测试
pnpm test:coverage   # 生成测试覆盖率报告
pnpm format          # 格式化代码
pnpm format:check    # 检查代码格式
```

说明：本项目使用 Vitest 做单元测试，使用 Prettier 做代码格式化。

## 代码风格规范

### 导入

- 分组：先 React/类型导入，再第三方库，最后本地导入
- 仅类型导入使用 `import type { ... }`
- 使用 `@/` 路径别名表示项目根目录的绝对导入

```ts
'use client'
import type { RefObject } from 'react'
import { useAtom } from 'jotai'
import { Button } from '@/components/ui/button'
```

### 组件（React/Next.js 项目）

- 所有客户端组件顶部添加 `'use client'`
- 在组件上方定义 props 接口：`interface ComponentNameProps { ... }`
- 使用命名导出：`export function ComponentName({ prop }: Props) { ... }`
- 使用函数组件和 Hooks，不用类组件
- 在函数签名中解构 props，便于阅读

### 样式

- 使用 Tailwind CSS
- 用 `lib/utils.ts` 中的 `cn()` 合并 class
- 组件变体使用 CVA（class-variance-authority）
- 暗色模式用 `dark:` 前缀
- 颜色/选项等常量放在 `constants.ts`，使用 `as const`

### TypeScript

- 开启严格模式，禁止 `any`
- 为所有 props 和数据结构定义接口
- 少用 `as` 断言，优先正确类型
- 适当使用 `?` 可选链做空值检查

### 错误处理

- 异步逻辑用 try-catch 包裹
- 控制台错误带上下文：`console.error('[feature] Error:', error)`
- 异步操作中显式设置 loading 状态
- 数据缺失时优先返回 null，而非抛错

### 文件组织

- `components/ui/` - 通用 UI 组件（shadcn/ui）
- `components/feature-name/` - 功能组件，带 index.tsx
- `hooks/` - 自定义 React Hooks
- `lib/` - 工具、配置、状态管理
- `app/` - Next.js App Router 页面
- `app/[locale]/` - 国际化路由（使用 next-intl）
- `i18n/` - 国际化配置
- `languages/` - 翻译文件

### 国际化

- 使用 next-intl 的 `useTranslations()` 钩子
- 在 `i18n/routing.ts` 配置 locale 路由
- 翻译文件放在 `languages/` 目录
- 用 `t('key')` 获取文案

### 命名约定

- 组件：kebab-case（`photo-editor.tsx`）
- Hooks：kebab-case（`use-image-upload.ts`）
- 工具函数：kebab-case（`format-date.ts`）
- 常量：SCREAMING_SNAKE_CASE（`DEFAULT_CONFIG`）
- 组件文件用 kebab-case，类型/钩子用 camelCase

### 包管理

- 使用 pnpm 管理依赖
- 保持 lockfile 在版本控制中
- 定期更新依赖，注意破坏性变更

### 测试

- 测试文件与源码同目录，后缀 `.test.ts` 或 `.spec.ts`
- 为核心业务逻辑和工具函数编写测试
- 测试描述使用清晰的语言：`it('should handle empty input', () => { ... })`
- 在 `vitest.setup.ts` 或测试文件中 mock 外部依赖
- 目标测试覆盖率：80% 以上

### 代码格式化

- 使用 Prettier 自动格式化代码
- 提交前运行 `pnpm format` 确保代码格式一致
- 配置编辑器保存时自动格式化（推荐）

### 提交前检查

- [ ] 构建通过：`pnpm build`
- [ ] 通过 Lint：`pnpm lint`（或执行 `pnpm lint:fix`）
- [ ] TypeScript 无报错：`pnpm type-check`
- [ ] 测试通过：`pnpm test:run`
- [ ] 代码已格式化：`pnpm format`
- [ ] 在开发环境中手动验证功能

## 项目特定规范

> **TODO**：在此添加项目特定的规范、约定和最佳实践。
> 例如：API 调用规范、数据库查询规范、安全要求等。
