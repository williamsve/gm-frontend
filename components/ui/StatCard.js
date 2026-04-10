export default function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  color = 'gray',
  change,
  className = '' 
}) {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    yellow: 'text-yellow-500',
    red: 'text-red-500',
    gray: 'text-gray-900',
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className={`text-3xl font-bold mt-2 ${colorClasses[color] || colorClasses.gray}`}>
            {value}
          </p>
          {change && (
            <p className={`text-xs mt-2 ${
              change.startsWith('+') ? 'text-green-600' : 
              change.startsWith('-') ? 'text-red-600' : 'text-gray-500'
            }`}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg bg-${color}-100`}>
            <Icon size={24} className={`text-${color}-600`} />
          </div>
        )}
      </div>
    </div>
  )
}
