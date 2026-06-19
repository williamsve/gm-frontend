import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md',
  secondary: 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  warning: 'bg-amber-500 text-neutral-900 hover:bg-amber-400',
  outline: 'border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50',
  ghost: 'text-neutral-600 hover:bg-neutral-100',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  className = '',
  ...props
}) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-[36px]',
    md: 'px-5 py-2.5 min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[52px]',
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200
        ${variants[variant] || variants.primary}
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
    </motion.button>
  )
}
