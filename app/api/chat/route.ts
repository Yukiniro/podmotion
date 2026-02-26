import type { UIMessage } from 'ai'
import { convertToModelMessages, streamText } from 'ai'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: 'openai/gpt-4o-mini',
    system: `你是播客脚本编辑助手。你可以帮助用户：
- 优化脚本内容，使对话更自然流畅
- 添加情感标注建议
- 调整对话节奏和风格
- 回答关于视频内容的问题
请用简洁、专业的语言回复。`,
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
