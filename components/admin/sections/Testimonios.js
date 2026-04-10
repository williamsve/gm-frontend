import React, { useState } from 'react'
import { HiLink, HiClipboard, HiCheck, HiX, HiClock, HiStar, HiThumbUp, HiThumbDown, HiExclamationCircle } from 'react-icons/hi'
import QRCode from 'qrcode'
import { 
  SectionHeader, 
  Button, 
  FilterBar, 
  TestimonialAdminCard, 
  StatCard,
  SectionAnimation 
} from '../../ui'
import { useTestimonios } from '../../../lib/useApi'
import { apiPut, getToken } from '../../../lib/apiClient'
import ConfirmDialog from '../../ui/ConfirmDialog'

export default function Testimonios() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRating, setFilterRating] = useState('todos')
  const [filterStatus, setFilterStatus] = useState('todos')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [generatedLink, setGeneratedLink] = useState('')
  const [linkCopied, setLinkCopied] = useState(false)
  const [qrCode, setQrCode] = useState('')

  // Estado para el modal de confirmación
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    confirmVariant: 'primary',
    onConfirm: null
  })

  // Usar hook de API para obtener testimonios
  const { data: testimoniosData, error, isLoading, mutate } = useTestimonios()

  // Transformar datos de la API al formato esperado
  // Transformar datos de la API al formato esperado
  const testimonios = testimoniosData?.items ? testimoniosData.items.map(t => ({
    id: t.id,
    nombre: t.nombre,
    empresa: t.empresa || '',
    contenido: t.testimonio,
    rating: t.calificacion,
    fecha: t.created_at ? new Date(t.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    avatar: (t.nombre || '').split(' ').map(n => (n && n[0]) || '').join('').substring(0, 2).toUpperCase() || '??',
    estado: t.is_approved ? 'aprobado' : (t.is_active === false ? 'rechazado' : 'pendiente'),
    email: t.email,
    cargo: t.cargo
  })) : []

  const filteredTestimonios = testimonios.filter(testimonio => {
    const matchesSearch = testimonio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonio.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonio.contenido.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRating = filterRating === 'todos' || testimonio.rating === parseInt(filterRating)
    const matchesStatus = filterStatus === 'todos' || testimonio.estado === filterStatus
    return matchesSearch && matchesRating && matchesStatus
  })

  const testimoniosPendientes = testimonios.filter(t => t.estado === 'pendiente')

  const handleAprobar = (testimonio) => {
    // Mostrar modal de confirmación antes de aprobar
    setConfirmState({
      open: true,
      title: 'Aprobar Testimonio',
      message: `¿Estás seguro de que deseas aprobar el testimonio de "${testimonio.nombre}"? Este testimonio se mostrará públicamente.`,
      confirmText: 'Aprobar',
      cancelText: 'Cancelar',
      confirmVariant: 'primary',
      onConfirm: async () => {
        try {
          await apiPut(`/api/testimonios/${testimonio.id}`, { is_approved: true })
          mutate() // Actualizar datos
        } catch (error) {
          console.error('Error al aprobar testimonio:', error)
          if (error.status === 401) {
            alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
            window.location.href = '/admin/login'
            return
          }
          alert('Error al aprobar el testimonio. Por favor, intenta de nuevo.')
        }
      }
    })
  }

  const handleRechazar = (testimonio) => {
    // Mostrar modal de confirmación antes de rechazar
    setConfirmState({
      open: true,
      title: 'Rechazar Testimonio',
      message: `¿Estás seguro de que deseas rechazar el testimonio de "${testimonio.nombre}"? Este testimonio no se mostrará públicamente.`,
      confirmText: 'Rechazar',
      cancelText: 'Cancelar',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          await apiPut(`/api/testimonios/${testimonio.id}`, { is_approved: false, is_active: false })
          mutate() // Actualizar datos
        } catch (error) {
          console.error('Error al rechazar testimonio:', error)
          if (error.status === 401) {
            alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
            window.location.href = '/admin/login'
            return
          }
          alert('Error al rechazar el testimonio. Por favor, intenta de nuevo.')
        }
      }
    })
  }

  const generateInviteLink = async () => {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const link = `${window.location.origin}/admin/testimonios/invitacion/${token}`
    setGeneratedLink(link)
    setLinkCopied(false)
    
    // Generar código QR
    try {
      const qrDataUrl = await QRCode.toDataURL(link, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
      setQrCode(qrDataUrl)
    } catch (err) {
      console.error('Error generando QR:', err)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  const filters = [
    {
      value: filterRating,
      onChange: setFilterRating,
      options: [
        { value: 'todos', label: 'Todas las calificaciones' },
        { value: '5', label: '5 estrellas' },
        { value: '4', label: '4 estrellas' },
        { value: '3', label: '3 estrellas' },
        { value: '2', label: '2 estrellas' },
        { value: '1', label: '1 estrella' }
      ]
    },
    {
      value: filterStatus,
      onChange: setFilterStatus,
      options: [
        { value: 'todos', label: 'Todos los estados' },
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'aprobado', label: 'Aprobado' },
        { value: 'rechazado', label: 'Rechazado' }
      ]
    }
  ]

  // Estado de carga
  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Testimonios"
          description="Gestiona las reseñas y testimonios de clientes"
          action={
            <Button icon={HiLink} variant="success" onClick={() => setShowInviteModal(true)}>
              Generar Enlace
            </Button>
          }
        />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Testimonios"
          description="Gestiona las reseñas y testimonios de clientes"
          action={
            <Button icon={HiLink} variant="success" onClick={() => setShowInviteModal(true)}>
              Generar Enlace
            </Button>
          }
        />
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <HiExclamationCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <p className="text-red-500">Error al cargar los testimonios</p>
          <p className="text-gray-500 text-sm mt-2">Por favor, intenta de nuevo más tarde</p>
          <Button 
            variant="secondary" 
            onClick={() => mutate()}
            className="mt-4"
          >
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <SectionAnimation>
      <div className="space-y-6">
        {/* Header */}
        <SectionHeader
        title="Testimonios"
        description="Gestiona las reseñas y testimonios de clientes"
        action={
          <Button icon={HiLink} variant="success" onClick={() => setShowInviteModal(true)}>
            Generar Enlace
          </Button>
        }
      />

      {/* Info card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <HiLink className="text-blue-600" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sistema de Enlaces de Invitación</h3>
            <p className="text-gray-600 text-sm mb-4">
              Genera enlaces únicos de un solo uso para que tus clientes dejen sus testimonios. 
              Cada enlace es válido para una sola submission y contiene validaciones para garantizar 
              la calidad de la información.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <HiCheck className="text-green-600" size={16} aria-hidden="true" />
                <span className="text-gray-700">Enlaces de un solo uso</span>
              </div>
              <div className="flex items-center gap-2">
                <HiCheck className="text-green-600" size={16} aria-hidden="true" />
                <span className="text-gray-700">Validación de campos</span>
              </div>
              <div className="flex items-center gap-2">
                <HiCheck className="text-green-600" size={16} aria-hidden="true" />
                <span className="text-gray-700">Control de calidad</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonios Pendientes - Sección destacada */}
      {testimoniosPendientes.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <HiClock className="text-yellow-600" size={24} aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Testimonios Pendientes de Aprobación</h3>
              <p className="text-gray-600 text-sm mb-4">
                Hay {testimoniosPendientes.length} testimonio(s) esperando tu revisión. 
                Aprueba o rechaza cada testimonio para controlar qué se muestra en el sitio web.
              </p>
              <div className="flex flex-wrap gap-3">
                {testimoniosPendientes.map((testimonio) => (
                  <div key={testimonio.id} className="bg-white rounded-lg p-4 border border-yellow-200 flex-1 min-w-[280px]">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 text-sm">
                        {testimonio.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">{testimonio.nombre}</h4>
                            <p className="text-xs text-gray-600 truncate">{testimonio.empresa}</p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0" aria-label={`${testimonio.rating} de 5 estrellas`}>
                            {[...Array(5)].map((_, index) => (
                              <HiStar
                                key={index}
                                size={16}
                                className={index < testimonio.rating ? 'text-yellow-400' : 'text-gray-300'}
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-3 line-clamp-2">&ldquo;{testimonio.contenido}&rdquo;</p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAprobar(testimonio)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            aria-label={`Aprobar testimonio de ${testimonio.nombre}`}
                          >
                            <HiThumbUp size={16} aria-hidden="true" />
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleRechazar(testimonio)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                            aria-label={`Rechazar testimonio de ${testimonio.nombre}`}
                          >
                            <HiThumbDown size={16} aria-hidden="true" />
                            Rechazar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar testimonios..."
        filters={filters}
      />

      {/* Testimonials grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTestimonios.map((testimonio) => (
          <TestimonialAdminCard
            key={testimonio.id}
            testimonial={testimonio}
            onApprove={handleAprobar}
            onReject={handleRechazar}
            onView={(t) => console.log('Ver', t.id)}
            onEdit={(t) => console.log('Editar', t.id)}
            onDelete={(t) => console.log('Eliminar', t.id)}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredTestimonios.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500">No se encontraron testimonios</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatCard
          label="Total Testimonios"
          value={testimonios.length}
          color="gray"
        />
        <StatCard
          label="Pendientes"
          value={testimonios.filter(t => t.estado === 'pendiente').length}
          color="yellow"
        />
        <StatCard
          label="Aprobados"
          value={testimonios.filter(t => t.estado === 'aprobado').length}
          color="green"
        />
        <StatCard
          label="Rechazados"
          value={testimonios.filter(t => t.estado === 'rechazado').length}
          color="red"
        />
        <StatCard
          label="Promedio"
          value={(testimonios.filter(t => t.estado === 'aprobado').reduce((acc, t) => acc + t.rating, 0) / testimonios.filter(t => t.estado === 'aprobado').length || 0).toFixed(1)}
          color="gray"
        />
      </div>

      {/* Modal para generar enlace de invitación */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 -top-6 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Generar Enlace de Invitación</h2>
              <button 
                onClick={() => {
                  setShowInviteModal(false)
                  setGeneratedLink('')
                  setQrCode('')
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Cerrar modal"
              >
                <HiX size={20} aria-hidden="true" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-sm">
                Genera un enlace único de un solo uso para que tu cliente deje su testimonio. 
                Copia el enlace o escanea el código QR para compartirlo.
              </p>

              {/* Enlace generado */}
              {generatedLink ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Enlace */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enlace Generado (Un solo uso)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={generatedLink}
                          readOnly
                          className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600"
                        />
                        <button
                          type="button"
                          onClick={copyToClipboard}
                          className={`p-2 rounded-lg transition-colors ${
                            linkCopied 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          }`}
                          aria-label={linkCopied ? 'Enlace copiado' : 'Copiar enlace al portapapeles'}
                        >
                          {linkCopied ? <HiCheck size={20} aria-hidden="true" /> : <HiClipboard size={20} aria-hidden="true" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Este enlace es de un solo uso y expira después de ser utilizado.
                      </p>
                    </div>

                    {/* Código QR - Solo visible en escritorio */}
                    {qrCode && (
                      <div className="hidden md:block text-center">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Código QR
                        </label>
                        <div className="inline-block p-3 bg-white rounded-lg border border-gray-200">
                          <img src={qrCode} alt="Código QR del enlace" className="w-32 h-32 aspect-square object-contain" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Escanea para compartir
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-blue-800 text-sm">
                    Haz clic en el botón para generar un enlace único con código QR
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteModal(false)
                    setGeneratedLink('')
                    setQrCode('')
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  aria-label="Cerrar modal de invitación"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={generateInviteLink}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  aria-label={generatedLink ? 'Generar nuevo enlace de invitación' : 'Generar enlace de invitación'}
                >
                  {generatedLink ? 'Generar Nuevo Enlace' : 'Generar Enlace'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        confirmVariant={confirmState.confirmVariant}
        onConfirm={confirmState.onConfirm}
        onClose={() => setConfirmState(prev => ({ ...prev, open: false }))}
      />
    </div>
    </SectionAnimation>
  )
}
