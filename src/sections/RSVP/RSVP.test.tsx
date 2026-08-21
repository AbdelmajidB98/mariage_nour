import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { RSVP } from './RSVP'

vi.mock('../../lib/rsvp-storage', () => ({
  saveResponse: vi.fn().mockResolvedValue({}),
}))

afterEach(() => {
  cleanup()
  document.body.className = ''
})
describe('RSVP modal', () => {
  it('shows the saved message after submit and resets after a page remount', async () => {
    const firstRender = render(<RSVP open onClose={() => undefined} invalidInvitation={false} />)

    fireEvent.click(screen.getByRole('radio', { name: 'Oui, avec grand plaisir.' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Prénom' }), { target: { value: 'Test' } })
    fireEvent.change(screen.getByRole('textbox', { name: 'Nom' }), { target: { value: 'Invité' } })
    fireEvent.click(within(screen.getByRole('group', { name: 'Viendrez-vous accompagné·e ?' })).getByRole('radio', { name: 'Non' }))
    fireEvent.click(screen.getByRole('button', { name: 'Envoyer ma réponse' }))

    await waitFor(() => expect(screen.getByRole('heading', { name: 'Votre réponse est déjà enregistrée.' })).toBeTruthy())

    firstRender.unmount()
    render(<RSVP open onClose={() => undefined} invalidInvitation={false} />)

    expect(screen.getByRole('button', { name: 'Envoyer ma réponse' })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Votre réponse est déjà enregistrée.' })).toBeNull()
  })
})
