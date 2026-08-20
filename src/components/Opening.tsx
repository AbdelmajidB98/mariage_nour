import { useEffect, useState } from 'react'
import { weddingConfig } from '../config/wedding.config'

export function Opening() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(false)
      return
    }
    document.body.classList.add('opening-active')
    const timer = window.setTimeout(() => {
      setVisible(false)
      document.body.classList.remove('opening-active')
    }, 1750)
    return () => {
      window.clearTimeout(timer)
      document.body.classList.remove('opening-active')
    }
  }, [])

  if (!visible) return null
  return (
    <div className="opening" aria-hidden="true">
      <span className="opening-line opening-line--top" />
      <p>{weddingConfig.couple.monogram}</p>
      <span className="opening-line opening-line--bottom" />
    </div>
  )
}
