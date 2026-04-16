import { useState, useEffect } from 'react'
import { HiUser, HiBell, HiShieldCheck, HiColorSwatch, HiGlobe, HiSave } from 'react-icons/hi'
import { SectionHeader, Button, SectionAnimation } from '../../ui'
import { API_BASE_URL } from '../../lib/apiConfig'

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState('notificaciones')
  const [settings, setSettings] = useState({
    notificaciones: {
      email: true,
      reportes: true
    }
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const tabs = [
    { id: 'notificaciones', label: 'Notificaciones', icon: HiBell }
  ]

  // Cargar configuración desde la API
  useEffect(() => {
    fetchConfiguracion()
  }, [])

  const fetchConfiguracion = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/api/configuracion/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setSettings({
            notificaciones: {
              email: data.email_notificaciones ?? true,
              reportes: data.reporte_semanal ?? true
            }
          })
        }
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setMessage({ type: '', text: '' })
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/api/configuracion/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email_notificaciones: settings.notificaciones.email,
          reporte_semanal: settings.notificaciones.reportes
        })
      })
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Configuración guardada exitosamente' })
      } else {
        setMessage({ type: 'error', text: 'Error al guardar la configuración' })
      }
    } catch (error) {
      console.error('Error al guardar:', error)
      setMessage({ type: 'error', text: 'Error de conexión' })
    } finally {
      setLoading(false)
    }
  }

  // Profile render removed - disabled per requirements

  const renderNotificaciones = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Notificaciones por Email</h4>
            <p className="text-sm text-gray-500">Recibir notificaciones importantes por correo</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notificaciones.email}
              onChange={(e) => setSettings({...settings, notificaciones: {...settings.notificaciones, email: e.target.checked}})}
              className="sr-only peer"
              disabled={loading}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Reporte semanal (visitas)</h4>
            <p className="text-sm text-gray-500">Recibir resumen semanal de visitas</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notificaciones.reportes}
              onChange={(e) => setSettings({...settings, notificaciones: {...settings.notificaciones, reportes: e.target.checked}})}
              className="sr-only peer"
              disabled={loading}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        {message.text && (
          <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  )

  const renderSeguridad = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Autenticación de Dos Factores</h4>
            <p className="text-sm text-gray-500">Añadir una capa extra de seguridad a tu cuenta</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.seguridad.autenticacion2fa}
              onChange={(e) => setSettings({...settings, seguridad: {...settings.seguridad, autenticacion2fa: e.target.checked}})}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Tiempo de Expiración de Sesión</h4>
          <p className="text-sm text-gray-500 mb-3">Tiempo en minutos antes de que la sesión expire</p>
          <select
            value={settings.seguridad.sesionExpira}
            onChange={(e) => setSettings({...settings, seguridad: {...settings.seguridad, sesionExpira: e.target.value}})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="15">15 minutos</option>
            <option value="30">30 minutos</option>
            <option value="60">1 hora</option>
            <option value="120">2 horas</option>
          </select>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Intentos de Login Permitidos</h4>
          <p className="text-sm text-gray-500 mb-3">Número de intentos antes de bloquear la cuenta</p>
          <select
            value={settings.seguridad.intentosLogin}
            onChange={(e) => setSettings({...settings, seguridad: {...settings.seguridad, intentosLogin: e.target.value}})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="3">3 intentos</option>
            <option value="5">5 intentos</option>
            <option value="10">10 intentos</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderApariencia = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Tema</h4>
          <p className="text-sm text-gray-500 mb-3">Selecciona el tema de la interfaz</p>
          <select
            value={settings.apariencia.tema}
            onChange={(e) => setSettings({...settings, apariencia: {...settings.apariencia, tema: e.target.value}})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="claro">Claro</option>
            <option value="oscuro">Oscuro</option>
            <option value="auto">Automático</option>
          </select>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Idioma</h4>
          <p className="text-sm text-gray-500 mb-3">Idioma de la interfaz</p>
          <select
            value={settings.apariencia.idioma}
            onChange={(e) => setSettings({...settings, apariencia: {...settings.apariencia, idioma: e.target.value}})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Zona Horaria</h4>
          <p className="text-sm text-gray-500 mb-3">Selecciona tu zona horaria</p>
          <select
            value={settings.apariencia.timezone}
            onChange={(e) => setSettings({...settings, apariencia: {...settings.apariencia, timezone: e.target.value}})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="America/Caracas">Caracas (UTC-4)</option>
            <option value="America/Mexico_City">Ciudad de México (UTC-6)</option>
            <option value="America/Bogota">Bogotá (UTC-5)</option>
            <option value="America/Lima">Lima (UTC-5)</option>
            <option value="America/Santiago">Santiago (UTC-3)</option>
            <option value="Europe/Madrid">Madrid (UTC+1)</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'notificaciones':
        return renderNotificaciones()
      default:
        return renderNotificaciones()
    }
  }

  return (
    <SectionAnimation>
      <div className="space-y-6">
        {/* Header */}
        <SectionHeader
        title="Configuración"
        description="Administra la configuración de tu cuenta y preferencias"
        action={
          <Button icon={HiSave} onClick={handleSave} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        }
      />

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {renderContent()}
      </div>
    </div>
    </SectionAnimation>
  )
}
