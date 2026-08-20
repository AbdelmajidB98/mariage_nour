import { describe, expect, it } from 'vitest'
import { getCountdown } from './useCountdown'

describe('getCountdown', () => {
  it('calculates a live countdown without hardcoded values', () => {
    const target = '2026-09-06T19:30:00.000Z'
    const now = new Date('2026-09-05T18:29:30.000Z').getTime()
    expect(getCountdown(target, now)).toEqual({ days: 1, hours: 1, minutes: 0, seconds: 30, complete: false })
  })

  it('never returns negative values', () => {
    expect(getCountdown('2026-01-01T00:00:00.000Z', new Date('2026-01-02').getTime()).complete).toBe(true)
  })
})
