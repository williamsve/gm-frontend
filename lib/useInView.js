import { useEffect, useRef, useState } from 'react'

export default function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setInView(true)
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -10% 0px', ...options }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [ref.current])

  return [ref, inView]
}
