import { ArrowIcon } from '../../components/ui/ArrowIcon'
import { Reveal } from '../../components/ui/Reveal'
import { weddingConfig } from '../../config/wedding.config'
import { getGoogleCalendarUrl } from '../../lib/calendar'

export function Venue() {
  const { venue, assets, links } = weddingConfig
  return (
    <section className="venue" aria-labelledby="venue-title">
      <div className="venue__image">
        <img src={assets.venue} alt="L’entrée illuminée du Pavillon des Baies à Gammarth" width="1920" height="1080" loading="lazy" />
        <Reveal className="venue__title">
          <h2 id="venue-title"><span>Le Pavillon</span><span>des Baies</span></h2>
          <p>{venue.city} — {venue.country}</p>
        </Reveal>
      </div>
      <nav className="utility-links" aria-label="Informations pratiques">
        <a href={links.maps} target="_blank" rel="noreferrer"><span>Voir l’itinéraire</span><ArrowIcon /></a>
        <a href={getGoogleCalendarUrl()} target="_blank" rel="noreferrer"><span>Google Calendar</span><ArrowIcon /></a>
      </nav>
    </section>
  )
}
