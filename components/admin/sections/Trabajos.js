import { useState } from 'react'
import { HiPlus, HiArrowLeft, HiExclamationCircle, HiBriefcase, HiCalendar, HiUser } from 'react-icons/hi'
import { 
  SectionHeader, 
  Button, 
  FilterBar, 
  DataTable, 
  ActionButton, 
  StatCard,
  SectionAnimation 
} from '../../ui'
import ConfirmDialog from '../../ui/ConfirmDialog'
import TrabajoForm from './TrabajoForm'
import { useTrabajos } from '../../../lib/useApi'
import { useAuth } from '../../../lib/useAuth'
import { apiPost, apiPut, apiDelete, getToken } from '../../../lib/apiClient'

export default function Trabajos() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingTrabajo, setEditingTrabajo] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({ open: false, trabajoId: null })
  const [uploadProgress, setUploadProgress] = useState(null)

  // Usar hook de API para obtener trabajos
  const { data: trabajos, error, isLoading, mutate } = useTrabajos()
  const { user } = useAuth()

  // Filtrar solo trabajos completados
  const filteredTrabajos = trabajos?.items ? trabajos.items.filter(trabajo => {
    const matchesSearch = trabajo.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trabajo.cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trabajo.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch && trabajo.estado === 'completado'
  }) : []

  const handleAddNew = () => {
    setEditingTrabajo(null)
    setShowForm(true)
  }

  const handleEdit = (trabajo) => {
    setEditingTrabajo(trabajo)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    // Show confirmation dialog instead of native confirm()
    setConfirmDialog({ open: true, trabajoId: id })
  }

  const handleConfirmDelete = async () => {
    const id = confirmDialog.trabajoId
    try {
      await apiDelete(`/api/trabajos/${id}`)
      // Actualizar cache de SWR
      mutate()
    } catch (error) {
      console.error('Error:', error)
      if (error.status === 401) {
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
        window.location.href = '/admin/login'
        return
      }
      alert('Error al eliminar el trabajo. Por favor, intenta de nuevo.')
    }
  }

  const handleCloseConfirm = () => {
    setConfirmDialog({ open: false, trabajoId: null })
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingTrabajo(null)
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)

    try {
      // Subir imágenes primero si hay nuevas imágenes
      let imageUrls = []
      if (formData.imagenes && formData.imagenes.length > 0) {
        const formDataUpload = new FormData()
        formData.imagenes.forEach(file => {
          formDataUpload.append('files', file)
        })

        // Función para subir con progreso usando XMLHttpRequest
        const uploadWithProgress = () => {
          return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            
            xhr.upload.addEventListener('progress', (event) => {
              if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100)
                setUploadProgress(percentComplete)
              }
            })

            xhr.addEventListener('load', () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                try {
                  const result = JSON.parse(xhr.responseText)
                  resolve(result)
                } catch (e) {
                  reject(new Error('Error al parsear respuesta'))
                }
              } else {
                reject(new Error('Error al subir imágenes'))
              }
            })

            xhr.addEventListener('error', () => {
              reject(new Error('Error de conexión'))
            })

            xhr.addEventListener('abort', () => {
              reject(new Error('Subida cancelada'))
            })

            const token = getToken()
            xhr.open('POST', '/api/upload/imagenes?tipo=trabajos')
            if (token) {
              xhr.setRequestHeader('Authorization', `Bearer ${token}`)
            }
            xhr.send(formDataUpload)
          })
        }

        const uploadResult = await uploadWithProgress()
        setUploadProgress(null)
        imageUrls = uploadResult.urls || []
      }

      // Preparar datos para enviar a la API
      const dataToSend = {
        nombre: formData.nombre,
        cliente: formData.cliente,
        descripcion: formData.descripcion,
        fecha_inicio: formData.fecha ? new Date(formData.fecha).toISOString() : null,
        tipo_servicio: formData.categoria || null,
        estado: 'completado', // Siempre completado
        imagenes: imageUrls.length > 0 ? imageUrls : (editingTrabajo?.imagenes || [])
      }

      if (editingTrabajo) {
        // Modo edición: actualizar trabajo existente
        await apiPut(`/api/trabajos/${editingTrabajo.id}`, dataToSend)
      } else {
        // Modo creación: añadir nuevo trabajo
        await apiPost('/api/trabajos', dataToSend)
      }

      // Actualizar cache de SWR
      mutate()
      setShowForm(false)
      setEditingTrabajo(null)
    } catch (error) {
      console.error('Error:', error)
      if (error.status === 401) {
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
        window.location.href = '/admin/login'
        return
      }
      alert('Error al guardar el trabajo. Por favor, intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns = [
    { 
      header: 'Trabajo', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <HiBriefcase className="text-blue-600" size={20} aria-hidden="true" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{row.nombre}</div>
            <div className="text-sm text-gray-500 max-w-xs truncate">{row.descripcion}</div>
          </div>
        </div>
      )
    },
    { 
      header: 'Cliente', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <HiUser className="text-gray-400" size={16} aria-hidden="true" />
          <span className="text-sm text-gray-600">{row.cliente || 'Sin cliente'}</span>
        </div>
      )
    },
    { 
      header: 'Fecha', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <HiCalendar className="text-gray-400" size={16} aria-hidden="true" />
          <span className="text-sm text-gray-600">
            {row.fecha_inicio ? new Date(row.fecha_inicio).toLocaleDateString() : 'Sin fecha'}
          </span>
        </div>
      )
    },
    { 
      header: 'Acciones', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <ActionButton variant="edit" onClick={() => handleEdit(row)} />
          <ActionButton variant="delete" onClick={() => handleDelete(row.id)} />
        </div>
      )
    },
  ]

  // Si se está mostrando el formulario, renderizar solo el formulario
  if (showForm) {
    return (
      <div className="space-y-6">
        <Button
          variant="secondary"
          icon={HiArrowLeft}
          onClick={handleCancel}
        >
          Volver a Trabajos
        </Button>
        {/* Indicador de progreso de upload */}
        {uploadProgress !== null && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {uploadProgress === 100 ? '✓ Imagen subida correctamente' : 'Subiendo imágenes...'}
              </span>
              <span className="text-sm font-bold text-blue-600">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full transition-all duration-300 ${uploadProgress === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
        <TrabajoForm
          trabajo={editingTrabajo}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    )
  }

  // Estado de carga
  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Trabajos"
          description="Gestiona todos los trabajos completados"
          action={
            <Button icon={HiPlus} onClick={handleAddNew}>
              Nuevo Trabajo
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
          title="Trabajos"
          description="Gestiona todos los trabajos completados"
          action={
            <Button icon={HiPlus} onClick={handleAddNew}>
              Nuevo Trabajo
            </Button>
          }
        />
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <HiExclamationCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <p className="text-red-500">Error al cargar los trabajos</p>
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
        title="Trabajos"
        description="Gestiona todos los trabajos completados"
        action={
          <Button icon={HiPlus} onClick={handleAddNew}>
            Nuevo Trabajo
          </Button>
        }
      />

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Buscar trabajos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title="Eliminar trabajo"
        message="¿Estás seguro de que deseas eliminar este trabajo? El registro se guardará en la papelera y podrá ser recuperado posteriormente."
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onClose={handleCloseConfirm}
      />

      {/* Jobs table */}
      <DataTable
        columns={columns}
        data={filteredTrabajos}
        emptyMessage="No se encontraron trabajos completados"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <StatCard
          label="Total Trabajos"
          value={filteredTrabajos.length}
          color="gray"
        />
      </div>
    </div>
    </SectionAnimation>
  )
}
