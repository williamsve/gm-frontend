import React from 'react'
import useInView from '../lib/useInView'

export default function Revealer({ children, className = '', rootMargin, threshold }) {
  const [ref, inView] = useInView({ rootMargin, threshold })

  return (
    <div ref={ref} className={`reveal ${inView ? 'is-visible' : ''} ${className}`.trim()}>
      {children}
    </div>
  )
}
