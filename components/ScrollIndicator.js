import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Icon from './Icon'

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 150)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="flex flex-col items-center cursor-pointer group"
        onClick={() => {
          const servicios = document.getElementById('quienes-somos')
          if (servicios) {
            servicios.scrollIntoView({ behavior: 'smooth' })
          }
        }}
        role="button"
        aria-label="Desplazarse a la siguiente sección"
        tabIndex={0}
      >
        <span className="text-white/80 text-sm mb-3 font-medium">Descubre más</span>
        <div className="w-10 h-16 rounded-full border-2 border-white/60 flex justify-center pt-3 group-hover:border-white group-hover:bg-white/10 transition-all">
          <motion.div
            animate={{ opacity: [1, 0.4, 1], y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-2 h-3 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </motion.div>
  )
}