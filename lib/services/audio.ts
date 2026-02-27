export interface GenerateAudioResult {
  duration: number
}

export async function generateAudio(_text: string, _voiceId: string): Promise<GenerateAudioResult> {
  // TODO: replace with real API call
  await new Promise((r) => setTimeout(r, 2000 + Math.random() * 2000))
  return { duration: 12 + Math.floor(Math.random() * 15) }
}
