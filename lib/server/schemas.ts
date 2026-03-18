import { z } from 'zod'

export const emotionSchema = z.object({
  start: z.number().describe('Start character index in the text'),
  end: z.number().describe('End character index in the text'),
  emotion: z.enum([
    'happy',
    'excited',
    'angry',
    'sad',
    'surprised',
    'gentle',
    'humorous',
    'serious',
  ]),
  intensity: z.enum(['slight', 'moderate', 'strong', 'very-strong']),
})

export const paragraphSchema = z.object({
  id: z.string().describe('Unique paragraph ID like p1, p2, p3...'),
  speaker: z.enum(['A', 'B']),
  text: z.string().describe('The spoken text content'),
  emotions: z.array(emotionSchema).describe('Emotion annotations for segments of the text'),
})
