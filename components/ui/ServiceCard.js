import StatusBadge from './StatusBadge'
import ActionButton from './ActionButton'

export default function ServiceCard({ 
  service,
  onEdit,
  onDelete,
  onView,
  className = '' 
}) {
  const Icon = service.icon

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`${service.color} p-3 rounded-lg`}>
          <Icon size={24} className="text-white" />
        </div>
        <StatusBadge status={service.categoria} />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.nombre}</h3>
      <p className="text-gray-600 text-sm mb-4">{service.descripcion}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-gray-900">{service.precio}</span>
        <div className="flex items-center gap-2">
          {onView && (
            <ActionButton variant="view" onClick={() => onView(service)} />
          )}
          {onEdit && (
            <ActionButton variant="edit" onClick={() => onEdit(service)} />
          )}
          {onDelete && (
            <ActionButton variant="delete" onClick={() => onDelete(service)} />
          )}
        </div>
      </div>
    </div>
  )
}
