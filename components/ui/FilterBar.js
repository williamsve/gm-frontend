import { HiSearch, HiFilter } from 'react-icons/hi'

export default function FilterBar({ 
  searchTerm, 
  onSearchChange, 
  searchPlaceholder = 'Buscar...',
  filters = [],
  className = '' 
}) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        {onSearchChange && (
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Filters */}
        {filters.map((filter, index) => (
          <div key={index} className="flex items-center gap-2">
            <HiFilter className="text-gray-400" size={20} />
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}
