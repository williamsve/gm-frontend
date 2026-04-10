export default function EmptyState({ 
  message = 'No se encontraron resultados',
  icon: Icon,
  className = '' 
}) {
  return (
    <div className={`text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200 ${className}`}>
      {Icon && (
        <div className="flex justify-center mb-4">
          <Icon size={48} className="text-gray-300" />
        </div>
      )}
      <p className="text-gray-500">{message}</p>
    </div>
  )
}
