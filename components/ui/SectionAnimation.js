import { motion } from 'framer-motion'

/**
 * Componente reutilizable de animación para las secciones del panel de administración
 * Proporciona animaciones de entrada y salida suaves
 * 
 * @param {React.ReactNode} children - Contenido a envolver
 * @param {number} delay - Retraso en segundos para el inicio de la animación
 * @param {string} className - Clases CSS adicionales
 */
export default function SectionAnimation({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: delay
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Variante de animación para elementos escalonados (staggered)
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
}

/**
 * Componente para animaciones de listas con efecto escalonado
 */
export function StaggeredList({ children, className = '' }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Componente para elementos individuales en una lista animada
 */
export function StaggeredItem({ children, className = '' }) {
  return (
    <motion.div
      variants={staggerItem}
      className={className}
    >
      {children}
    </motion.div>
  )
}
