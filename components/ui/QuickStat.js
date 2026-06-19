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
    <div className={`flex items-center justify-between p-4 border border-neutral-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all duration-200 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary-50 rounded-lg">
          <Icon size={20} className="text-primary-600" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-700">{label}</p>
          <p className="text-xl font-bold text-neutral-900">{value}</p>
        </div>
      </div>
      {trend && (
        <span className={`text-sm font-bold ${
          isPositive ? 'text-emerald-600' :
          isNegative ? 'text-red-600' : 'text-neutral-500'
        }`}>
          {trend}
        </span>
      )}
    </div>
  )
}
