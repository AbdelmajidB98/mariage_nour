import { weddingConfig } from '../../config/wedding.config'
import { useCountdown } from '../../hooks/useCountdown'
import { Reveal } from '../../components/ui/Reveal'

const pad = (value: number) => String(value).padStart(2, '0')

function SaveTheDate() {
  return (
    <section className="save-date" id="save-date" aria-label="Réservez la date">
      <Reveal className="save-date__composition">
        <h2><span>SAVE</span><em>the</em><span>DATE</span></h2>
      </Reveal>
    </section>
  )
}

function InvitationLetter() {
  const { assets } = weddingConfig
  return (
    <section className="letter" id="story" aria-labelledby="letter-title">
      <div className="letter__art" aria-hidden="true">
        <img src={assets.storyArtwork} alt="" width="1024" height="1536" loading="lazy" />
      </div>
      <div className="letter__copy">
        <Reveal>
          <h2 id="letter-title">
            <span>Pour</span>
            <span>écrire</span>
            <em>avec vous</em>
          </h2>
          <span className="letter__flourish" aria-hidden="true" />
        </Reveal>
        <div className="letter__verses">
          <Reveal className="letter__poem-wrap">
            <p className="letter__poem">
              <span>une page lumineuse</span>
              <span>de notre histoire</span>
              <span>où chaque sourire</span>
              <span>sera une étoile</span>
            </p>
          </Reveal>
          <Reveal delay={0.08} className="letter__invitation-wrap">
            <span className="letter__ornament" aria-hidden="true" />
            <p className="letter__invitation">Venez partager ce moment précieux avec nous.</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function DateReveal() {
  return (
    <section className="date-reveal" aria-label="Date du mariage">
      <div><strong>06</strong><span>Dimanche</span></div>
      <div><strong>09</strong><span>Septembre</span></div>
      <div><strong>26</strong><span>Gammarth</span></div>
    </section>
  )
}

function Countdown() {
  const value = useCountdown(weddingConfig.wedding.targetIso)
  const parts = [
    [value.days, 'Jours'],
    [value.hours, 'Heures'],
    [value.minutes, 'Minutes'],
    [value.seconds, 'Secondes'],
    ] as const
  return (
    <section className="countdown" aria-labelledby="countdown-title">
      <img className="countdown__image" src={weddingConfig.assets.countdown} alt="" width="1440" height="1964" loading="lazy" />
      <div className="countdown__content">
        <p>Plus que</p>
        <h2 id="countdown-title"><span>Avant notre</span><em>grand jour</em></h2>
        {value.complete ? <p className="countdown__complete">Le grand jour est arrivé.</p> : (
          <div className="countdown__numbers" aria-live="polite">
            {parts.map(([number, label]) => <div key={label}><strong>{label === 'Jours' ? number : pad(number)}</strong><span>{label}</span></div>)}
          </div>
        )}
      </div>
    </section>
  )
}

export function Story() {
  return <><SaveTheDate /><DateReveal /><InvitationLetter /><Countdown /></>
}
