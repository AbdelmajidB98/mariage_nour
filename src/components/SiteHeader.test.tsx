import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup } from '@testing-library/react'
import { SiteHeader } from './SiteHeader'

afterEach(() => {
  cleanup()
  document.body.className = ''
})
describe('SiteHeader navigation drawer', () => {
  it('opens the programme and questions menu, then closes with Escape', async () => {
    render(<SiteHeader onOpenRsvp={() => undefined} />)

    const trigger = screen.getByRole('button', { name: 'Menu' })
    trigger.focus()
    fireEvent.click(trigger)

    const dialog = screen.getByRole('dialog', { name: /Nour.*Hassene/i })
    expect(within(dialog).getByRole('button', { name: /Confirmation d’invitation/i })).toBeTruthy()
    expect(within(dialog).getByRole('link', { name: /Programme de la soirée/i })).toBeTruthy()
    expect(within(dialog).getByRole('heading', { name: 'Questions & Réponses' })).toBeTruthy()
    expect(document.body.classList.contains('menu-open')).toBe(true)

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(document.body.classList.contains('menu-open')).toBe(false)
    expect(document.activeElement).toBe(trigger)
  })
})
