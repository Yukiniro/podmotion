# Podmotion 产品方向设计文档

## 产品定位

Podmotion — 将任意内容转化为播客的极简工具。粘贴即生成，脚本可编辑，用完即走。

## 目标用户

- **内容创作者**：将文章、视频等已有内容快速转为播客形态，扩大分发渠道
- **内容消费者**：将想看但没时间看的长文/视频，转为可随时收听的音频

## 差异化定位

- **极简易用**：比竞品更少的操作步骤，粘贴即生成
- **脚本可编辑**：用户可精细控制生成的播客脚本（竞品大多是黑盒）

## 产品形态

- 工具型，用完即走，无需注册登录
- 免费使用，暂不考虑变现

---

## 核心流程

```text
输入内容 → 提取/接收文本 → AI 生成摘要 → AI 生成播客脚本 → TTS 语音合成 → 下载音频
```

### 支持的输入源

| 输入源      | 处理方式                       |
| ----------- | ------------------------------ |
| YouTube URL | supadata.transcript() 提取字幕 |
| 网页 URL    | supadata.web.scrape() 提取正文 |
| 纯文本      | 直接使用，跳过抓取步骤         |

### 播客风格（精简为 3 种）

- 闲聊 — 最自然，适合大多数内容
- 科普 — 适合知识类内容转化
- 新闻 — 适合时事/资讯类内容

移除：访谈、故事（后续可按需加回）

---

## 首页设计

Tab 切换式，两个 Tab：链接 / 文本。

**链接 Tab**：单输入框，用户粘贴 YouTube 或网页链接，系统自动识别类型：

- 匹配 YouTube URL 模式 → 调用 /api/transcript
- 其他 URL → 调用 /api/scrape

**文本 Tab**：多行文本框，用户粘贴或输入任意文本。

---

## 网页抓取方案

使用 Supadata Web Scrape API（参考 https://docs.supadata.ai/web/scrape）。

新增 API 路由 `/api/scrape`：

```typescript
// GET /api/scrape?url=https://example.com/article
const result = await supadata.web.scrape(url)
// 返回: { title, content, language }
```

SDK 调用方式：

```typescript
import { Supadata } from '@supadata/js'

const supadata = new Supadata({ apiKey: process.env.SUPADATA_API_KEY })
const webContent = await supadata.web.scrape('https://example.com')
```

无需新增依赖，`@supadata/js` 已包含 web.scrape 方法。

---

## 数据流

```text
┌─────────── 输入层 ───────────┐
│ 链接 Tab                     │
│ ├─ YouTube URL → /api/transcript → supadata.transcript()
│ └─ 网页 URL   → /api/scrape     → supadata.web.scrape()
│ 文本 Tab                     │
│ └─ 纯文本 → 直接使用            │
└──────────┬───────────────────┘
           ▼
    统一的文本内容（content + language）
           ▼
    /api/summary → AI 摘要生成
           ▼
    /api/script → 播客脚本生成
           ▼
    /api/audio → TTS 语音合成
           ▼
    下载音频文件
```

---

## Preview 页面适配

| 元素     | YouTube URL    | 网页 URL            | 纯文本         |
| -------- | -------------- | ------------------- | -------------- |
| 顶部预览 | 视频嵌入播放器 | 网页标题 + 来源域名 | 无             |
| 原文内容 | 字幕文本       | 抓取的正文          | 用户输入的文本 |
| AI 摘要  | ✅             | ✅                  | ✅             |
| 播客配置 | 风格 + 人数    | 风格 + 人数         | 风格 + 人数    |

---

## 架构改动范围

### 需要改动

| 层级    | 改动                                            | 说明                       |
| ------- | ----------------------------------------------- | -------------------------- |
| API     | 新增 `/api/scrape`                              | 调用 supadata.web.scrape() |
| Service | 新增 `scrape.ts`                                | 网页抓取服务封装           |
| Service | 修改 `transcript.ts`                            | 仅处理 YouTube             |
| Utils   | 修改 `validators.ts`                            | 增加 URL 类型识别          |
| Atoms   | 修改 `preview-atoms.ts`                         | 增加输入模式状态           |
| Hooks   | 新增 `use-scrape.ts` 或扩展 `use-transcript.ts` | 根据 URL 类型分发          |
| UI      | 改造 `home-page.tsx`                            | Tab 切换 + 文本输入        |
| UI      | 修改 `preview/`                                 | 适配无视频预览场景         |
| Prompts | 精简风格选项                                    | 保留闲聊/科普/新闻         |
| i18n    | 更新翻译文件                                    | 新增文案中英文             |

### 不需要改动

- `/api/summary`、`/api/script`、`/api/audio` — 接收纯文本，与输入源无关
- 整个 workspace（脚本编辑、声线选择、音频生成）
- 导出功能
