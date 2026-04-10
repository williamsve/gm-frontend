import { useRouter } from 'next/router'
import { 
  HiHome, 
  HiBriefcase, 
  HiChat, 
  HiCog,
  HiAdjustments,
  HiMenu,
  HiX,
  HiLogout,
  HiUser
} from 'react-icons/hi'
import { useAuth } from '../../lib/useAuth'

export default function AdminSidebar({ isOpen, onToggle, activeSection, onSectionChange }) {
  const router = useRouter()
  const { user, logout } = useAuth()

  const menuItems = [
    { 
      name: 'Dashboard', 
      id: 'dashboard', 
      icon: HiHome 
    },
    { 
      name: 'Trabajos', 
      id: 'trabajos', 
      icon: HiBriefcase 
    },
    { 
      name: 'Servicios', 
      id: 'servicios', 
      icon: HiCog 
    },
    { 
      name: 'Testimonios', 
      id: 'testimonios', 
      icon: HiChat 
    },
    { 
      name: 'Configuración', 
      id: 'configuracion', 
      icon: HiAdjustments 
    },
  ]

  const handleSectionClick = (sectionId) => {
    onSectionChange(sectionId)
  }

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  return (
    <aside 
      className={`fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 z-50 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        {isOpen && (
          <span className="text-xl font-bold text-white">Admin Panel</span>
        )}
        <button 
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label={isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
        >
          {isOpen ? <HiX size={20} aria-hidden="true" /> : <HiMenu size={20} aria-hidden="true" />}
        </button>
      </div>

      {/* User info */}
      {isOpen && user && (
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center" aria-hidden="true">
              <HiUser size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user.username}</p>
              <p className="text-xs text-gray-400">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = activeSection === item.id
            
            return (
              <li key={item.name}>
                <button
                  onClick={() => handleSectionClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  aria-label={item.name}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon size={20} aria-hidden="true" />
                  {isOpen && <span>{item.name}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        {isOpen ? (
          <div className="space-y-3">
            <div className="text-xs text-gray-500 text-center">
              Panel de Administración v1.0
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
              aria-label="Cerrar sesión"
            >
              <HiLogout size={18} aria-hidden="true" />
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
            aria-label="Cerrar sesión"
          >
            <HiLogout size={20} aria-hidden="true" />
          </button>
        )}
      </div>
    </aside>
  )
}
