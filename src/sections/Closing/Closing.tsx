import { weddingConfig } from '../../config/wedding.config'

export function Closing() {
  const { assets } = weddingConfig
  return (
    <footer className="closing" aria-label="Nour et Hassene, à très bientôt">
      <img
        className="closing__monogram"
        src={assets.closingMonogram}
        alt="Monogramme Nour et Hassene, 06 septembre 2026, à très bientôt"
        width="1254"
        height="1254"
        loading="lazy"
        decoding="async"
      />
      <p className="closing__farewell">À très bientôt</p>
    </footer>
  )
}
