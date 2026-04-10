export default function SectionHeader({ 
  title, 
  description, 
  action,
  className = '' 
}) {
  return (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${className}`}>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="text-gray-600 mt-1">{description}</p>
        )}
      </div>
      {action && action}
    </div>
  )
}
