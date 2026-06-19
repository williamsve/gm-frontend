import { HiEye, HiPencil, HiTrash, HiThumbUp, HiThumbDown } from 'react-icons/hi'

const variants = {
  view: {
    icon: HiEye,
    baseClass: 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50',
  },
  edit: {
    icon: HiPencil,
    baseClass: 'text-neutral-600 hover:text-emerald-600 hover:bg-emerald-50',
  },
  delete: {
    icon: HiTrash,
    baseClass: 'text-neutral-600 hover:text-red-600 hover:bg-red-50',
  },
  approve: {
    icon: HiThumbUp,
    baseClass: 'bg-emerald-600 text-white hover:bg-emerald-700',
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
      className={`p-2 rounded-lg transition-colors min-h-[36px] min-w-[36px] ${config.baseClass} ${className}`}
      aria-label={ariaLabels[variant] || 'Acción'}
      {...props}
    >
      <Icon size={size} aria-hidden="true" />
      {label && <span className="ml-1 text-sm font-medium">{label}</span>}
    </button>
  )
}
