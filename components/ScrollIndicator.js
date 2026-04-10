import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Icon from './Icon'

export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        className="flex flex-col items-center cursor-pointer"
        onClick={() => {
          const servicios = document.getElementById('quienes-somos')
          if (servicios) {
            servicios.scrollIntoView({ behavior: 'smooth' })
          }
        }}
      >
        <span className="text-white/70 text-sm mb-2">Descubre más</span>
        <div className="w-8 h-12 rounded-full border-2 border-white/50 flex justify-center pt-2">
          <motion.div 
            animate={{ opacity: [1, 0.3, 1], y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-1.5 h-2.5 bg-white/70 rounded-full"
          />
        </div>
      </motion.div>
    </motion.div>
  )
}