import { Closing } from './sections/Closing/Closing'
import { Hero } from './sections/Hero/Hero'
import { RSVP } from './sections/RSVP/RSVP'
import { Schedule } from './sections/Schedule/Schedule'
import { Story } from './sections/Story/Story'
import { Venue } from './sections/Venue/Venue'
import { Opening } from './components/Opening'
import { SiteHeader } from './components/SiteHeader'

function invitationFromPath() {
  const match = window.location.pathname.match(/^\/invite\/([^/]+)\/?$/)
  if (!window.location.pathname.startsWith('/invite/')) return { token: undefined, invalid: false }
  const token = match?.[1]
  return { token, invalid: !token || !/^[A-Za-z0-9_-]{6,64}$/.test(token) }
}

export default function App() {
  const invitation = invitationFromPath()
  return (
    <>
      <a className="skip-link" href="#main">Aller au contenu</a>
      <Opening />
      <SiteHeader />
      <main id="main">
        <Hero />
        <Story />
        <Schedule />
        <Venue />
        <RSVP invitationToken={invitation.token} invalidInvitation={invitation.invalid} />
      </main>
      <Closing />
    </>
  )
}
