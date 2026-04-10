import { useState } from 'react'
import { HiPlus, HiPencil, HiTrash, HiArrowLeft, HiExclamationCircle } from 'react-icons/hi'
import { SectionHeader, Button } from '../../ui'
import ConfirmDialog from '../../ui/ConfirmDialog'
import ServicioForm from './ServicioForm'
import { useServicios } from '../../../lib/useApi'
import { useAuth } from '../../../lib/useAuth'
import { apiPost, apiPut, apiDelete, getToken } from '../../../lib/apiClient'
import { SectionAnimation } from '../../ui'

export default function Servicios() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingServicio, setEditingServicio] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({ open: false, servicioId: null })
  const [uploadProgress, setUploadProgress] = useState(null)

  // Usar hook de API para obtener servicios
  const { data: servicios, error, isLoading, mutate } = useServicios()
  const { user } = useAuth()

  const filteredServicios = servicios?.items ? servicios.items.filter(servicio =>
    servicio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servicio.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  const handleAddNew = () => {
    setEditingServicio(null)
    setShowForm(true)
  }

  const handleEdit = (servicio) => {
    setEditingServicio(servicio)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    // Show confirmation dialog instead of native confirm()
    setConfirmDialog({ open: true, servicioId: id })
  }

  const handleConfirmDelete = async () => {
    const id = confirmDialog.servicioId
    try {
      await apiDelete(`/api/servicios/${id}`)
      // Actualizar cache de SWR
      mutate()
    } catch (error) {
      console.error('Error:', error)
      if (error.status === 401) {
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
        window.location.href = '/admin/login'
        return
      }
      alert('Error al eliminar el servicio. Por favor, intenta de nuevo.')
    }
  }

  const handleCloseConfirm = () => {
    setConfirmDialog({ open: false, servicioId: null })
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingServicio(null)
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)

    try {
      // Preparar datos para enviar a la API
      let imagenUrl = editingServicio?.imagen || '/placeholder.jpg'
      
      // Si la imagen es un objeto File, subirla primero
      if (formData.imagen instanceof File) {
        const formDataUpload = new FormData()
        formDataUpload.append('files', formData.imagen)

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
                reject(new Error('Error al subir imagen'))
              }
            })

            xhr.addEventListener('error', () => {
              reject(new Error('Error de conexión'))
            })

            xhr.addEventListener('abort', () => {
              reject(new Error('Subida cancelada'))
            })

            const token = getToken()
            xhr.open('POST', '/api/upload/imagenes?tipo=servicios')
            if (token) {
              xhr.setRequestHeader('Authorization', `Bearer ${token}`)
            }
            xhr.send(formDataUpload)
          })
        }

        const uploadResult = await uploadWithProgress()
        setUploadProgress(null)
        imagenUrl = uploadResult.urls?.[0] || '/placeholder.jpg'
      } else if (typeof formData.imagen === 'string') {
        imagenUrl = formData.imagen
      }

      const dataToSend = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        imagen: imagenUrl
      }

      if (editingServicio) {
        // Modo edición: actualizar servicio existente
        await apiPut(`/api/servicios/${editingServicio.id}`, dataToSend)
      } else {
        // Modo creación: añadir nuevo servicio
        await apiPost('/api/servicios', dataToSend)
      }

      // Actualizar cache de SWR
      mutate()
      setShowForm(false)
      setEditingServicio(null)
    } catch (error) {
      console.error('Error:', error)
      if (error.status === 401) {
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
        window.location.href = '/admin/login'
        return
      }
      alert('Error al guardar el servicio. Por favor, intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Si se está mostrando el formulario, renderizar solo el formulario
  if (showForm) {
    return (
      <div className="space-y-6">
        <Button
          variant="secondary"
          icon={HiArrowLeft}
          onClick={handleCancel}
        >
          Volver a Servicios
        </Button>
        {/* Indicador de progreso de upload */}
        {uploadProgress !== null && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {uploadProgress === 100 ? '✓ Imagen subida correctamente' : 'Subiendo imagen...'}
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
        <ServicioForm
          servicio={editingServicio}
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
          title="Servicios"
          description="Gestiona el catálogo de servicios de mantenimiento industrial"
          action={
            <Button icon={HiPlus} onClick={handleAddNew}>
              Nuevo Servicio
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
          title="Servicios"
          description="Gestiona el catálogo de servicios de mantenimiento industrial"
          action={
            <Button icon={HiPlus} onClick={handleAddNew}>
              Nuevo Servicio
            </Button>
          }
        />
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <HiExclamationCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <p className="text-red-500">Error al cargar los servicios</p>
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
        title="Servicios"
        description="Gestiona el catálogo de servicios de mantenimiento industrial"
        action={
          <Button icon={HiPlus} onClick={handleAddNew}>
            Nuevo Servicio
          </Button>
        }
      />

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Buscar servicios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title="Eliminar servicio"
        message="¿Estás seguro de que deseas eliminar este servicio? El registro se guardará en la papelera y podrá ser recuperado posteriormente."
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onClose={handleCloseConfirm}
      />

      {/* Services grid */}
      {filteredServicios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServicios.map((servicio) => (
            <div key={servicio.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
              {/* Imagen */}
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img 
                  src={servicio.imagen || '/placeholder.jpg'} 
                  alt={servicio.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Contenido */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{servicio.nombre}</h3>
                <p className="text-sm text-gray-600 mb-4">{servicio.descripcion}</p>
                
                {/* Acciones */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEdit(servicio)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    aria-label={`Editar servicio ${servicio.nombre}`}
                  >
                    <HiPencil size={16} aria-hidden="true" />
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(servicio.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label={`Eliminar servicio ${servicio.nombre}`}
                  >
                    <HiTrash size={16} aria-hidden="true" />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">
            {searchTerm ? 'No se encontraron servicios' : 'No hay servicios disponibles'}
          </p>
          {!searchTerm && (
            <Button 
              icon={HiPlus} 
              onClick={handleAddNew}
              className="mt-4"
            >
              Crear primer servicio
            </Button>
          )}
        </div>
      )}
    </div>
    </SectionAnimation>
  )
}
