import { useEffect, useRef, useState } from 'react'

export default function useParallax(speed = 0.2) {
  const ref = useRef(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    let frame = null

    function onScroll() {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight || document.documentElement.clientHeight
      const elementCenter = rect.top + rect.height / 2
      const viewportCenter = windowHeight / 2
      const distance = elementCenter - viewportCenter
      const value = -distance * speed

      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setOffset(value))
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [speed])

  return [ref, offset]
}
