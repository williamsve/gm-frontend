import { motion } from 'framer-motion'

export default function CTAButton({ children, variant = 'primary', className = '', ...props }) {
  const base = 'font-bold px-6 py-3 rounded-md'
  const variants = {
    primary: 'bg-yellow-500 text-blue-900 hover:bg-yellow-400',
    secondary: 'border-2 border-white text-white hover:bg-white hover:text-blue-900',
  }

  return (
    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </motion.button>
  )
}
