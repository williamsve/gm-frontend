export default function QuickActionButton({
  icon: Icon,
  label,
  color = 'blue',
  onClick,
  className = ''
}) {
  const colorClasses = {
    blue: 'border-primary-500 hover:bg-primary-50 text-primary-600',
    green: 'border-emerald-500 hover:bg-emerald-50 text-emerald-600',
    purple: 'border-violet-500 hover:bg-violet-50 text-violet-600',
    orange: 'border-orange-500 hover:bg-orange-50 text-orange-600',
    red: 'border-red-500 hover:bg-red-50 text-red-600',
  }

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 border-2 border-dashed border-neutral-300 rounded-xl transition-colors min-h-[100px] ${colorClasses[color] || colorClasses.blue} ${className}`}
    >
      <Icon size={24} aria-hidden="true" />
      <span className="text-sm font-semibold text-neutral-700">{label}</span>
    </button>
  )
}
