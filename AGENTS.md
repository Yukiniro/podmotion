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

### 文件组织（分层架构）

项目采用 **Utils → Service → Atoms → Hooks → UI** 五层架构，每层只依赖下层，禁止反向依赖或跨层调用。

```text
app/                          # Next.js App Router
  [locale]/                   # 国际化路由页面
  api/                        # API Route（服务端）

components/                   # UI 层（纯视图）
  ui/                         # 通用 UI 组件（shadcn/ui）
  preview/                    # Preview 页面组件（index.tsx 为容器）
  workspace/                  # Workspace 页面组件（index.tsx 为容器）
  home-page.tsx               # 首页
  export-page.tsx             # 导出页

hooks/                        # Hook 层（编排 Service + Atom）
  use-transcript.ts           # 转录加载编排
  use-summary.ts              # 流式摘要编排
  use-paragraphs.ts           # 段落 CRUD + 音频生成
  use-audio-player.ts         # 播放器控制
  use-export-player.ts        # 导出页播放器
  use-video-loading.ts        # 视频加载状态
  use-style-config.ts         # 风格切换（含联动逻辑）

lib/
  atoms/                      # Atom 层（纯状态定义，Jotai）
    preview-atoms.ts          # Preview 页面状态
    workspace-atoms.ts        # Workspace 页面状态
    export-atoms.ts           # Export 页面状态
  services/                   # Service 层（函数式业务逻辑，不依赖 React）
    transcript.ts             # 转录获取 + 缓存
    summary.ts                # 流式摘要 API
    audio.ts                  # 音频生成 API
    cache.ts                  # 缓存读写封装
  utils/                      # Utils 层（纯函数）
    format.ts                 # 时间格式化
    validators.ts             # URL 验证
    emotion.tsx               # 情感标记渲染
  store.ts                    # 全局类型定义 + 常量
  storage.ts                  # IndexedDB 底层封装
  utils.ts                    # cn() 工具函数

i18n/                         # 国际化配置
languages/                    # 翻译文件
```

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

## 分层架构规范

### 层级依赖规则

```text
UI 组件 → Hooks → Atoms / Services → Utils
```

- **禁止**：UI 组件直接调用 Service 函数或 `fetch`
- **禁止**：Service 层导入 React 或 Jotai
- **禁止**：Atom 文件包含业务逻辑（如条件更新、API 调用）
- **允许**：UI 组件通过 `useAtomValue` 直接读取 Atom（只读）
- **允许**：Hooks 同时依赖 Atoms 和 Services

### Service 层（`lib/services/`）

Service 层导出**纯函数**，不依赖 React，可直接单元测试。

```ts
// lib/services/transcript.ts
export async function fetchTranscript(
  videoUrl: string,
  signal?: AbortSignal
): Promise<TranscriptResult> {
  const cached = await getCached<TranscriptResult>(cacheKey)
  if (cached?.content) return cached
  // ... fetch + cache ...
}
```

规范：

- 每个 Service 文件对应一个业务域（transcript、summary、audio、cache）
- 函数签名明确：参数使用基本类型或自定义接口，不接受 React 特有类型
- 流式 API 通过 `onChunk` 回调返回中间结果，不直接操作状态
- 错误通过 `throw` 抛出，由 Hook 层统一捕获处理
- 自定义错误类用于区分业务异常（如 `TranscriptPendingError`）

### Atom 层（`lib/atoms/`）

Atom 文件只定义**状态形状**和**派生计算**，不包含副作用或业务逻辑。

```ts
// lib/atoms/workspace-atoms.ts
export const paragraphsAtom = atom<ScriptParagraph[]>([])

// 派生 atom（只读计算）
export const totalDurationAtom = atom((get) => {
  return get(paragraphsAtom).reduce((sum, p) => sum + (p.audioDuration || 0), 0)
})
```

规范：

- 按页面/功能域拆分文件：`preview-atoms.ts`、`workspace-atoms.ts`、`export-atoms.ts`
- 基础 atom 使用 `atom(initialValue)` 定义
- 派生 atom 使用 `atom((get) => ...)` 只读计算
- 不使用 write-only atom（如 `atom(null, (get, set, ...) => ...)`），业务逻辑放到 Hook 层
- 类型定义如 `TranscriptStatus`、`SummaryStatus` 与 atom 放在同一文件

### Hook 层（`hooks/`）

Hook 是**编排层**，连接 Service 和 Atom，管理副作用生命周期。

```ts
// hooks/use-transcript.ts
export function useTranscript(videoUrl: string, onTranscriptReady?: (content: string) => void) {
  const setTranscript = useSetAtom(transcriptAtom)
  const setTranscriptStatus = useSetAtom(transcriptStatusAtom)

  useEffect(() => {
    // 调用 Service → 更新 Atom → 触发回调
    const result = await fetchTranscript(videoUrl, controller.signal)
    setTranscript(result.content)
    setTranscriptStatus('done')
    onTranscriptReady?.(result.content)
  }, [videoUrl])
}
```

规范：

- 一个 Hook 对应一个业务流程（转录加载、摘要生成、段落管理等）
- Hook 内部调用 Service 函数，通过 `useSetAtom` 更新状态
- 通过 `AbortController` 管理异步操作的取消
- 错误在 Hook 内捕获并更新对应的 status atom
- Hook 返回操作函数和必要的状态值，供 UI 组件使用
- 回调参数使用 `useRef` 包装，避免加入 `useEffect` 依赖

### UI 层（`components/`）

UI 组件只关心**视图渲染**，通过 `useAtomValue` 读取状态，通过 Hook 获取操作函数。

```tsx
// components/preview/ai-summary.tsx — 纯视图组件
export function AISummary() {
  const summary = useAtomValue(summaryAtom)
  const summaryStatus = useAtomValue(summaryStatusAtom)

  if (isLoading) return <Skeleton />
  if (hasError) return <ErrorMessage />
  return <p>{summary}</p>
}
```

规范：

- 组件**不直接**调用 `fetch`、操作缓存或执行业务逻辑
- 容器组件（如 `preview/index.tsx`）负责调用 Hooks，子组件通过 props 接收数据和回调
- 功能区域使用目录组织（`preview/`、`workspace/`），入口为 `index.tsx`
- 子组件通过 props 接收所有交互回调，不直接操作 Atom（保持纯粹）
- 纯 UI 级别的局部状态（如表单输入、hover 状态）可以使用 `useState`

### Utils 层（`lib/utils/`）

纯函数，无副作用，可直接测试。

```ts
// lib/utils/format.ts
export function formatTime(seconds: number): string {
  /* ... */
}

// lib/utils/validators.ts
export function isValidYoutubeUrl(url: string): boolean {
  /* ... */
}
```

规范：

- 一个文件一个职责域
- 包含 JSX 渲染逻辑的工具函数使用 `.tsx` 扩展名
- 不导入 React Hooks 或状态管理库

### 测试规范

- 测试文件与源码**同目录**，后缀 `.test.ts`
- **优先测试** Service 层和 Utils 层（不依赖 React，最易测试）
- Service 测试中使用 `vi.mock()` 隔离依赖（cache、fetch）
- 使用 `globalThis.fetch = vi.fn()` mock 网络请求，**不使用** `global.fetch`
- mock 模块的 import 放在 `vi.mock()` 之后（hoisting 机制自动处理）

```ts
// lib/services/transcript.test.ts
vi.mock('./cache', () => ({ getCached: vi.fn(), setCache: vi.fn() }))

describe('fetchTranscript', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn()
  })
  it('should return cached result when available', async () => {
    /* ... */
  })
})
```

### 新增功能的开发流程

添加新功能时，按照自下而上的顺序：

1. **Utils**：是否需要新的纯函数？添加到 `lib/utils/`
2. **Service**：是否需要 API 调用或业务逻辑？添加到 `lib/services/`
3. **Atoms**：是否需要新的状态？添加到 `lib/atoms/` 对应的文件
4. **Hook**：创建 Hook 编排 Service 和 Atom
5. **UI**：在组件中调用 Hook，只写视图逻辑
6. **Test**：为 Service 和 Utils 编写测试
