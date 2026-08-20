import { type PropsWithChildren, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type RevealProps = PropsWithChildren<{ className?: string; delay?: number; y?: number }>

export function Reveal({ children, className = '', delay = 0, y = 34 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        { autoAlpha: 0, y },
        { autoAlpha: 1, y: 0, duration: 1.05, delay, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } },
      )
    }, element)
    return () => context.revert()
  }, [delay, y])

  return <div ref={ref} className={className}>{children}</div>
}
