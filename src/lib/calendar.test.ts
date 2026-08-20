import { describe, expect, it, vi } from 'vitest'
import { downloadIcs, getGoogleCalendarUrl } from './calendar'

describe('calendar utilities', () => {
  it('creates a configured Google Calendar link', () => {
    const url = getGoogleCalendarUrl()
    expect(url).toContain('Mariage+de+Nour+%26+Hassene')
    expect(url).toContain('20260906T193000Z')
    expect(url).toContain('Africa%2FTunis')
  })

  it('creates and clicks a downloadable ICS file', () => {
    Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: vi.fn(() => 'blob:wedding-calendar') })
    Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: vi.fn() })
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    downloadIcs()
    expect(click).toHaveBeenCalledOnce()
    click.mockRestore()
  })
})
