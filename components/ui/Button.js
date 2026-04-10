import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
  success: 'bg-green-600 text-white hover:bg-green-700',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  warning: 'bg-yellow-500 text-blue-900 hover:bg-yellow-400',
  outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  ghost: 'text-gray-600 hover:bg-gray-100',
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
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors
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
