import { useEffect, useState } from 'react'

export type CountdownValue = { days: number; hours: number; minutes: number; seconds: number; complete: boolean }

export function getCountdown(targetIso: string, now = Date.now()): CountdownValue {
  const distance = Math.max(0, new Date(targetIso).getTime() - now)
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
    complete: distance === 0,
  }
}

export function useCountdown(targetIso: string) {
  const [value, setValue] = useState(() => getCountdown(targetIso))

  useEffect(() => {
    const tick = () => setValue(getCountdown(targetIso))
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [targetIso])

  return value
}
