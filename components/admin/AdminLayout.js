import { useState, useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import Breadcrumbs from '../ui/Breadcrumbs'
import Dashboard from './sections/Dashboard'
import Proyectos from './sections/Proyectos'
import Servicios from './sections/Servicios'
import Testimonios from './sections/Testimonios'
import Trabajos from './sections/Trabajos'
import Configuracion from './sections/Configuracion'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState('dashboard')

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />
      case 'trabajos':
        return <Trabajos />
      case 'servicios':
        return <Servicios />
      case 'testimonios':
        return <Testimonios />
      case 'configuracion':
        return <Configuracion />
      default:
        return <Dashboard />
    }
  }

  // Listen for navigation events from Breadcrumbs
  useEffect(() => {
    const handleNavigate = (e) => {
      setActiveSection(e.detail)
    }
    window.addEventListener('adminNavigate', handleNavigate)
    return () => window.removeEventListener('adminNavigate', handleNavigate)
  }, [])

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Mobile overlay backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <Breadcrumbs activeSection={activeSection} />
        
        <main className="p-6" id="main">
          {renderSection()}
        </main>
      </div>
    </div>
  )
}
