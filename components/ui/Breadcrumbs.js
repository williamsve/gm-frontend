import Link from 'next/link'

const sectionNames = {
  dashboard: 'Dashboard',
  trabajos: 'Trabajos',
  servicios: 'Servicios',
  testimonios: 'Testimonios',
  proyectos: 'Proyectos',
  configuracion: 'Configuración',
  estadisticas: 'Estadísticas'
}

export default function Breadcrumbs({ activeSection = 'dashboard' }) {
  const currentSection = sectionNames[activeSection] || 'Dashboard'

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4 px-4">
      {/* Inicio / Dashboard - Always clickable */}
      <Link 
        href="#" 
        className="hover:text-blue-600 transition-colors font-medium"
        onClick={(e) => {
          e.preventDefault()
          // Navigate to dashboard - handled by parent component
          window.dispatchEvent(new CustomEvent('adminNavigate', { detail: 'dashboard' }))
        }}
      >
        Inicio
      </Link>

      {/* Separator */}
      <svg 
        className="w-4 h-4 text-gray-400" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M9 5l7 7-7 7" 
        />
      </svg>

      {/* Current section - not clickable */}
      <span className="text-gray-800 font-semibold">
        {currentSection}
      </span>
    </nav>
  )
}