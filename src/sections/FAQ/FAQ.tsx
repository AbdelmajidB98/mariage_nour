import { useState } from 'react'
import { weddingConfig } from '../../config/wedding.config'

type FAQProps = {
  variant?: 'page' | 'drawer'
}

export function FAQ({ variant = 'page' }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const prefix = variant === 'drawer' ? 'menu-questions' : 'faq'

  return (
    <section id={prefix} className={`faq faq--${variant}`} aria-labelledby={`${prefix}-title`}>
      <header>
        <h2 id={`${prefix}-title`}>Questions <em>&amp;</em> Réponses</h2>
        <p>Si vous avez des questions, jetez d’abord un œil ici.</p>
      </header>
      <div className="faq__list">
        {weddingConfig.faq.map(([question, answer], index) => {
          const open = openIndex === index
          const panelId = `${prefix}-panel-${index}`
          return (
            <article className={`faq-item ${open ? 'is-open' : ''}`} key={question}>
              <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpenIndex(open ? null : index)}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{question}</strong>
                <i aria-hidden="true" />
              </button>
              <div className="faq-item__answer" id={panelId} aria-hidden={!open}><div><p>{answer}</p>{index === 6 ? <a href={`tel:${weddingConfig.contact.phone}`} tabIndex={open ? 0 : -1}>{weddingConfig.contact.displayPhone}</a> : null}</div></div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
