import { weddingConfig } from '../config/wedding.config'

const compactUtc = (iso: string) => iso.replace(/[-:]/g, '').replace('.000', '')

export function getGoogleCalendarUrl() {
  const { wedding, venue } = weddingConfig
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Mariage de Nour & Hassene',
    dates: `${compactUtc(wedding.targetIso)}/${compactUtc(wedding.endIso)}`,
    details: 'Nour & Hassene ont la joie de vous inviter à célébrer leur union.',
    location: `${venue.name}, ${venue.city}, ${venue.country}`,
    ctz: wedding.timezone,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function downloadIcs() {
  const { wedding, venue } = weddingConfig
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nour et Hassene//Invitation//FR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:nour-hassene-${wedding.date}@invitation`,
    `DTSTAMP:${compactUtc(new Date().toISOString())}`,
    `DTSTART:${compactUtc(wedding.targetIso)}`,
    `DTEND:${compactUtc(wedding.endIso)}`,
    'SUMMARY:Mariage de Nour & Hassene',
    `LOCATION:${venue.name}\, ${venue.city}\, ${venue.country}`,
    'DESCRIPTION:Nour & Hassene ont la joie de vous inviter à célébrer leur union.',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([body], { type: 'text/calendar;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'mariage-nour-hassene.ics'
  anchor.style.display = 'none'
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
