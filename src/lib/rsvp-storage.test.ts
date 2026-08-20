import { beforeEach, describe, expect, it } from 'vitest'
import { readResponse, saveResponse } from './rsvp-storage'

const response = {
  attendance: 'yes' as const,
  firstName: 'Sarah',
  lastName: 'Test',
  accompanied: 'no' as const,
  guests: 1,
}

describe('RSVP storage', () => {
  beforeEach(() => localStorage.clear())

  it('stores and retrieves a token-scoped response', async () => {
    await saveResponse(response, 'ABC123')
    expect(readResponse('ABC123')).toMatchObject(response)
    expect(readResponse('OTHER1')).toBeNull()
  })
})
