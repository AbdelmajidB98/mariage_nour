import { LineArt } from '../../components/editorial/LineArt'
import { Reveal } from '../../components/ui/Reveal'
import { weddingConfig } from '../../config/wedding.config'

export function Schedule() {
  return (
    <section className="schedule" id="programme" aria-labelledby="schedule-title">
      <header className="schedule__header">
        <span>{weddingConfig.couple.displayName}</span>
        <span>06 septembre 2026, Gammarth</span>
      </header>
      <Reveal><h2 id="schedule-title">Programme<br /><em>de la soirée</em></h2></Reveal>
      <div className="schedule__timeline">
        {weddingConfig.schedule.map((event, index) => (
          <article className="schedule-event" key={event.time}>
            <div className="schedule-event__art"><LineArt type={event.icon} /></div>
            <span className="schedule-event__node" />
            <div className="schedule-event__copy">
              <Reveal y={24}>
                <time dateTime={`${event.date}T${event.time}`}>{event.time}</time>
                {index === 2 ? <p className="schedule-event__night">La nuit continue</p> : null}
                <h3>{event.title}</h3>
                <p>{event.description}</p>
              </Reveal>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
