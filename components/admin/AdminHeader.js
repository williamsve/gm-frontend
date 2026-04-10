import { useRouter } from 'next/router'
import { HiBell, HiUser, HiLogout, HiMenu } from 'react-icons/hi'
import { useAuth } from '../../lib/useAuth'

export default function AdminHeader({ onMenuToggle }) {
  const router = useRouter()
  const { user, logout } = useAuth()

  // Map routes to display titles
  const getPageTitle = (pathname) => {
    if (pathname === '/admin' || pathname === '/admin/index') return 'Dashboard'
    if (pathname.includes('/admin/servicios')) return 'Servicios'
    if (pathname.includes('/admin/trabajos')) return 'Trabajos'
    if (pathname.includes('/admin/testimonios')) return 'Testimonios'
    if (pathname.includes('/admin/proyectos')) return 'Proyectos'
    if (pathname.includes('/admin/configuracion')) return 'Configuración'
    return 'Dashboard'
  }

  const pageTitle = getPageTitle(router.pathname)

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side - Menu toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            aria-label="Abrir menú de navegación"
          >
            <HiMenu size={20} className="text-gray-600" aria-hidden="true" />
          </button>
          
          <h1 className="text-xl font-semibold text-gray-800">
            {pageTitle}
          </h1>
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Ver notificaciones">
            <HiBell size={20} className="text-gray-600" aria-hidden="true" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" aria-hidden="true"></span>
          </button>

          {/* User dropdown */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center" aria-hidden="true">
              <HiUser size={16} className="text-white" />
            </div>
            
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-700">{user?.username || 'Administrador'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'admin'}</p>
            </div>

            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-red-600"
              aria-label="Cerrar sesión"
            >
              <HiLogout size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
