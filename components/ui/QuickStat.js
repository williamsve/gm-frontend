export default function QuickStat({ 
  label, 
  value, 
  icon: Icon, 
  trend,
  className = '' 
}) {
  const isPositive = trend && trend.startsWith('+')
  const isNegative = trend && trend.startsWith('-')

  return (
    <div className={`flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors ${className}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Icon size={18} className="text-gray-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">{label}</p>
          <p className="text-lg font-bold text-gray-900">{value}</p>
        </div>
      </div>
      {trend && (
        <span className={`text-sm font-medium ${
          isPositive ? 'text-green-600' : 
          isNegative ? 'text-red-600' : 'text-gray-500'
        }`}>
          {trend}
        </span>
      )}
    </div>
  )
}
