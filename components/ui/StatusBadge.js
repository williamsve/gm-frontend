import { HiCheck, HiX, HiClock } from 'react-icons/hi'

const statusConfig = {
  // Estados de testimonios
  pendiente: { 
    bg: 'bg-yellow-100', 
    text: 'text-yellow-800', 
    icon: HiClock, 
    label: 'Pendiente' 
  },
  aprobado: { 
    bg: 'bg-green-100', 
    text: 'text-green-800', 
    icon: HiCheck, 
    label: 'Aprobado' 
  },
  rechazado: { 
    bg: 'bg-red-100', 
    text: 'text-red-800', 
    icon: HiX, 
    label: 'Rechazado' 
  },
  
  // Estados de trabajos
  completado: { 
    bg: 'bg-green-100', 
    text: 'text-green-800', 
    icon: HiCheck, 
    label: 'Completado' 
  },
  en_progreso: { 
    bg: 'bg-blue-100', 
    text: 'text-blue-800', 
    icon: HiClock, 
    label: 'En Progreso' 
  },
  
  // Categorías de servicios
  desarrollo: { 
    bg: 'bg-blue-100', 
    text: 'text-blue-800', 
    label: 'Desarrollo' 
  },
  diseno: { 
    bg: 'bg-purple-100', 
    text: 'text-purple-800', 
    label: 'Diseño' 
  },
  consultoria: { 
    bg: 'bg-orange-100', 
    text: 'text-orange-800', 
    label: 'Consultoría' 
  },
}

export default function StatusBadge({ 
  status, 
  customConfig,
  className = '' 
}) {
  const config = customConfig || statusConfig[status]
  
  if (!config) {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ${className}`}>
        {status}
      </span>
    )
  }

  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${className}`}>
      {Icon && <Icon size={12} />}
      {config.label}
    </span>
  )
}
