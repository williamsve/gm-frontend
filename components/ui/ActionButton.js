import { HiEye, HiPencil, HiTrash, HiThumbUp, HiThumbDown } from 'react-icons/hi'

const variants = {
  view: {
    icon: HiEye,
    baseClass: 'text-gray-600 hover:text-blue-600 hover:bg-blue-50',
  },
  edit: {
    icon: HiPencil,
    baseClass: 'text-gray-600 hover:text-green-600 hover:bg-green-50',
  },
  delete: {
    icon: HiTrash,
    baseClass: 'text-gray-600 hover:text-red-600 hover:bg-red-50',
  },
  approve: {
    icon: HiThumbUp,
    baseClass: 'bg-green-600 text-white hover:bg-green-700',
  },
  reject: {
    icon: HiThumbDown,
    baseClass: 'bg-red-600 text-white hover:bg-red-700',
  },
}

export default function ActionButton({ 
  variant = 'view', 
  onClick, 
  label,
  size = 18,
  className = '',
  ...props 
}) {
  const config = variants[variant] || variants.view
  const Icon = config.icon

  // Map variants to aria-labels
  const ariaLabels = {
    view: 'Ver detalles',
    edit: 'Editar elemento',
    delete: 'Eliminar elemento',
    approve: 'Aprobar testimonio',
    reject: 'Rechazar testimonio',
  }

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors ${config.baseClass} ${className}`}
      aria-label={ariaLabels[variant] || 'Acción'}
      {...props}
    >
      <Icon size={size} aria-hidden="true" />
      {label && <span className="ml-1 text-sm font-medium">{label}</span>}
    </button>
  )
}
