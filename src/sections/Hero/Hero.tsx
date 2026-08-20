import { weddingConfig } from '../../config/wedding.config'

export function Hero() {
  const { couple, wedding, venue, assets } = weddingConfig
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <picture className="hero__media">
        <source media="(max-width: 720px)" srcSet={assets.coupleSmall} />
        <img src={assets.couple} alt="Nour et Hassene le soir de leur mariage" width="1440" height="1920" fetchPriority="high" />
      </picture>
      <div className="hero__copy">
        <h1 id="hero-title">{couple.displayName}</h1>
        <p>{wedding.longDate}</p>
        <p>{venue.city}</p>
      </div>
      <a className="hero__scroll" href="#save-date" aria-label="Découvrir l’invitation"><span />Défiler</a>
    </section>
  )
}
