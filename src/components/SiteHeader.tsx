import { useEffect, useRef, useState } from 'react'
import { weddingConfig } from '../config/wedding.config'
import { FAQ } from '../sections/FAQ/FAQ'

const focusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    const previousFocus = document.activeElement as HTMLElement | null
    document.body.classList.add('menu-open')
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus())

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return
      const focusableElements = Array.from(panelRef.current.querySelectorAll<HTMLElement>(focusableSelector))
      const firstElement = focusableElements[0]
      const lastElement = focusableElements.at(-1)

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement?.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.cancelAnimationFrame(focusFrame)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('menu-open')
      previousFocus?.focus()
    }
  }, [menuOpen])

  const showQuestions = () => {
    document.getElementById('menu-questions')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <header className="site-header">
        <a className="site-header__mark" href="#top" aria-label="Retour au début">{weddingConfig.couple.displayName}</a>
        <div className="site-header__actions">
          <button
            className="site-header__menu"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="navigation-drawer"
            onClick={() => setMenuOpen(true)}
          >
            Menu
          </button>
          <a className="site-header__rsvp" href="#rsvp">Répondre</a>
        </div>
      </header>

      {menuOpen ? (
        <div className="navigation-drawer" id="navigation-drawer">
          <button className="navigation-drawer__backdrop" type="button" aria-label="Fermer le menu" onClick={() => setMenuOpen(false)} />
          <div
            className="navigation-drawer__panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="navigation-drawer-title"
          >
            <header className="navigation-drawer__header">
              <p id="navigation-drawer-title">Nour <span>×</span> Hassene</p>
              <button ref={closeButtonRef} type="button" onClick={() => setMenuOpen(false)}>
                Fermer <span aria-hidden="true">×</span>
              </button>
            </header>

            <nav className="navigation-drawer__nav" aria-label="Menu de l’invitation">
              <a href="#programme" onClick={() => setMenuOpen(false)}>
                <span>01</span>
                <strong>Programme <em>de la soirée</em></strong>
              </a>
              <button type="button" onClick={showQuestions}>
                <span>02</span>
                <strong>Questions <em>&amp; Réponses</em></strong>
              </button>
            </nav>

            <FAQ variant="drawer" />
          </div>
        </div>
      ) : null}
    </>
  )
}
