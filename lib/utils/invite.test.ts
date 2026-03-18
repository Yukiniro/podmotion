import { describe, expect, it } from 'vitest'

import { generateInviteToken } from './invite'

describe('generateInviteToken', () => {
  it('should generate a hex string', async () => {
    const token = await generateInviteToken('test-code')
    expect(token).toMatch(/^[0-9a-f]+$/)
  })

  it('should be deterministic', async () => {
    const token1 = await generateInviteToken('test-code')
    const token2 = await generateInviteToken('test-code')
    expect(token1).toBe(token2)
  })

  it('should produce different tokens for different codes', async () => {
    const token1 = await generateInviteToken('code-a')
    const token2 = await generateInviteToken('code-b')
    expect(token1).not.toBe(token2)
  })

  it('should produce a 64-character hex string (SHA-256)', async () => {
    const token = await generateInviteToken('any-code')
    expect(token).toHaveLength(64)
  })
})
