export default function ActivityItem({ 
  action, 
  time, 
  type = 'default',
  className = '' 
}) {
  const typeColors = {
    proyecto: 'bg-blue-500',
    testimonio: 'bg-purple-500',
    servicio: 'bg-green-500',
    trabajo: 'bg-orange-500',
    default: 'bg-gray-500',
  }

  return (
    <div className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${className}`}>
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${typeColors[type] || typeColors.default}`}></div>
        <span className="text-gray-700">{action}</span>
      </div>
      <span className="text-sm text-gray-500">{time}</span>
    </div>
  )
}
