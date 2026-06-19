import { motion } from 'framer-motion'

export default function CTAButton({ children, variant = 'primary', className = '', href, ...props }) {
  const base = 'font-bold px-8 py-4 rounded-lg min-h-[48px] inline-flex items-center justify-center gap-2'
  const variants = {
    primary: 'bg-amber-500 text-neutral-900 hover:bg-amber-400 shadow-lg hover:shadow-xl',
    secondary: 'border-2 border-white text-white hover:bg-white hover:text-neutral-900',
  }

  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className={`${base} ${variants[variant] || variants.primary} ${className}`}
        {...props}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
