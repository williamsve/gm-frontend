export default function QuickActionButton({ 
  icon: Icon, 
  label, 
  color = 'blue',
  onClick,
  className = '' 
}) {
  const colorClasses = {
    blue: 'border-blue-500 hover:bg-blue-50 text-blue-600',
    green: 'border-green-500 hover:bg-green-50 text-green-600',
    purple: 'border-purple-500 hover:bg-purple-50 text-purple-600',
    orange: 'border-orange-500 hover:bg-orange-50 text-orange-600',
    red: 'border-red-500 hover:bg-red-50 text-red-600',
  }

  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg transition-colors ${colorClasses[color] || colorClasses.blue} ${className}`}
    >
      <Icon size={24} />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  )
}
