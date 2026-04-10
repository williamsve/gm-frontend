import { useState, useRef, useEffect } from 'react'
import { HiPhotograph, HiX, HiCheck, HiExclamationCircle } from 'react-icons/hi'
import { SectionHeader, Button, SectionAnimation } from '../../ui'
import { apiPost, apiPut } from '../../../lib/apiClient'

export default function ProyectoForm({ proyecto, onCancel, onSubmit, isSubmitting: externalIsSubmitting }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    imagen: null,
    cliente: '',
    ubicacion: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'pendiente'
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false)
  const isSubmitting = externalIsSubmitting !== undefined ? externalIsSubmitting : internalIsSubmitting
  const [previewImage, setPreviewImage] = useState(null)
  const fileInputRef = useRef(null)

  // Si se proporciona un proyecto, cargar sus datos (modo edición)
  useEffect(() => {
    if (proyecto) {
      setFormData({
        nombre: proyecto.nombre || '',
        descripcion: proyecto.descripcion || '',
        imagen: null,
        cliente: proyecto.cliente || '',
        ubicacion: proyecto.ubicacion || '',
        fecha_inicio: proyecto.fecha_inicio ? proyecto.fecha_inicio.split('T')[0] : '',
        fecha_fin: proyecto.fecha_fin ? proyecto.fecha_fin.split('T')[0] : '',
        estado: proyecto.estado || 'pendiente'
      })
      if (proyecto.imagen) {
        setPreviewImage(proyecto.imagen)
      }
    }
  }, [proyecto])

  // Validaciones
  const validateField = (name, value) => {
    switch (name) {
      case 'nombre':
        if (!value.trim()) return 'El nombre del proyecto es requerido'
        if (value.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres'
        if (value.trim().length > 255) return 'El nombre no puede exceder 255 caracteres'
        return ''
      
      case 'descripcion':
        if (value.trim().length > 1000) return 'La descripción no puede exceder 1000 caracteres'
        return ''
      
      case 'cliente':
        if (value.trim().length > 255) return 'El nombre del cliente no puede exceder 255 caracteres'
        return ''
      
      case 'ubicacion':
        if (value.trim().length > 255) return 'La ubicación no puede exceder 255 caracteres'
        return ''
      
      case 'fecha_inicio':
        return ''
      
      case 'fecha_fin':
        if (value && formData.fecha_inicio && value < formData.fecha_inicio) {
          return 'La fecha de fin no puede ser anterior a la fecha de inicio'
        }
        return ''
      
      case 'estado':
        if (!value) return 'El estado es requerido'
        return ''
      
      default:
        return ''
    }
  }

  const validateForm = () => {
    const newErrors = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key])
      if (error) newErrors[key] = error
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Validar en tiempo real si el campo ya fue tocado
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, imagen: 'Solo se permiten archivos de imagen' }))
      return
    }
    
    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, imagen: 'La imagen no puede exceder 5MB' }))
      return
    }

    setFormData(prev => ({ ...prev, imagen: file }))
    setErrors(prev => ({ ...prev, imagen: '' }))

    // Crear preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imagen: null }))
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Marcar todos los campos como tocados
    const allTouched = {}
    Object.keys(formData).forEach(key => {
      allTouched[key] = true
    })
    setTouched(allTouched)
    
    // Validar formulario completo
    if (!validateForm()) {
      return
    }

    if (externalIsSubmitting === undefined) {
      setInternalIsSubmitting(true)
    }
    
    try {
      // Preparar datos para enviar
      const dataToSend = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || null,
        imagen: formData.imagen,
        cliente: formData.cliente || null,
        ubicacion: formData.ubicacion || null,
        fecha_inicio: formData.fecha_inicio ? new Date(formData.fecha_inicio).toISOString() : null,
        fecha_fin: formData.fecha_fin ? new Date(formData.fecha_fin).toISOString() : null,
        estado: formData.estado
      }
      
      if (proyecto) {
        // Modo edición: actualizar proyecto existente
        await apiPut(`/api/proyectos/${proyecto.id}`, dataToSend)
      } else {
        // Modo creación: añadir nuevo proyecto
        await apiPost('/api/proyectos', dataToSend)
      }
      
      if (onSubmit) {
        onSubmit(dataToSend)
      }
    } catch (error) {
      console.error('Error al guardar proyecto:', error)
      alert('Error al guardar el proyecto. Por favor, intenta de nuevo.')
    } finally {
      if (externalIsSubmitting === undefined) {
        setInternalIsSubmitting(false)
      }
    }
  }

  const getFieldStatus = (fieldName) => {
    if (!touched[fieldName]) return 'default'
    if (errors[fieldName]) return 'error'
    return 'success'
  }

  const inputClasses = (fieldName) => {
    const status = getFieldStatus(fieldName)
    const baseClasses = 'w-full px-4 py-2.5 border rounded-lg transition-colors focus:outline-none focus:ring-2'
    
    switch (status) {
      case 'error':
        return `${baseClasses} border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50`
      case 'success':
        return `${baseClasses} border-green-300 focus:ring-green-200 focus:border-green-500 bg-green-50`
      default:
        return `${baseClasses} border-gray-300 focus:ring-blue-200 focus:border-blue-500`
    }
  }

  const isEditMode = !!proyecto

  return (
    <SectionAnimation>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <SectionHeader
          title={isEditMode ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          description={isEditMode ? 'Modifica los datos del proyecto' : 'Completa el formulario para agregar un nuevo proyecto'}
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Nombre del Proyecto */}
        <div className="space-y-2">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nombre del Proyecto <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej: Sistema de Ventas"
              className={inputClasses('nombre')}
            />
            {touched.nombre && !errors.nombre && (
              <HiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={20} />
            )}
            {touched.nombre && errors.nombre && (
              <HiExclamationCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={20} />
            )}
          </div>
          {touched.nombre && errors.nombre && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <HiExclamationCircle size={14} />
              {errors.nombre}
            </p>
          )}
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <div className="relative">
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Describe el proyecto..."
              rows={4}
              className={`${inputClasses('descripcion')} resize-none`}
            />
            {touched.descripcion && !errors.descripcion && (
              <HiCheck className="absolute right-3 top-3 text-green-500" size={20} />
            )}
            {touched.descripcion && errors.descripcion && (
              <HiExclamationCircle className="absolute right-3 top-3 text-red-500" size={20} />
            )}
          </div>
          <div className="flex justify-between items-center">
            {touched.descripcion && errors.descripcion ? (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <HiExclamationCircle size={14} />
                {errors.descripcion}
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Opcional
              </p>
            )}
            <p className={`text-sm ${formData.descripcion.length > 1000 ? 'text-red-600' : 'text-gray-500'}`}>
              {formData.descripcion.length}/1000
            </p>
          </div>
        </div>

        {/* Cliente y Ubicación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="cliente" className="block text-sm font-medium text-gray-700">
              Cliente
            </label>
            <div className="relative">
              <input
                type="text"
                id="cliente"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Nombre del cliente"
                className={inputClasses('cliente')}
              />
              {touched.cliente && !errors.cliente && formData.cliente && (
                <HiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={20} />
              )}
              {touched.cliente && errors.cliente && (
                <HiExclamationCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={20} />
              )}
            </div>
            {touched.cliente && errors.cliente && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <HiExclamationCircle size={14} />
                {errors.cliente}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700">
              Ubicación
            </label>
            <div className="relative">
              <input
                type="text"
                id="ubicacion"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ciudad o dirección"
                className={inputClasses('ubicacion')}
              />
              {touched.ubicacion && !errors.ubicacion && formData.ubicacion && (
                <HiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={20} />
              )}
              {touched.ubicacion && errors.ubicacion && (
                <HiExclamationCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={20} />
              )}
            </div>
            {touched.ubicacion && errors.ubicacion && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <HiExclamationCircle size={14} />
                {errors.ubicacion}
              </p>
            )}
          </div>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700">
              Fecha de Inicio
            </label>
            <input
              type="date"
              id="fecha_inicio"
              name="fecha_inicio"
              value={formData.fecha_inicio}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses('fecha_inicio')}
            />
            {touched.fecha_inicio && errors.fecha_inicio && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <HiExclamationCircle size={14} />
                {errors.fecha_inicio}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="fecha_fin" className="block text-sm font-medium text-gray-700">
              Fecha de Fin
            </label>
            <input
              type="date"
              id="fecha_fin"
              name="fecha_fin"
              value={formData.fecha_fin}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClasses('fecha_fin')}
            />
            {touched.fecha_fin && errors.fecha_fin && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <HiExclamationCircle size={14} />
                {errors.fecha_fin}
              </p>
            )}
          </div>
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
            Estado <span className="text-red-500">*</span>
          </label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClasses('estado')}
          >
            <option value="pendiente">Pendiente</option>
            <option value="en_progreso">En Progreso</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>
          {touched.estado && errors.estado && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <HiExclamationCircle size={14} />
              {errors.estado}
            </p>
          )}
        </div>

        {/* Upload de Imagen */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Imagen del Proyecto
          </label>
          
          {/* Zona de drop/upload */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              errors.imagen && touched.imagen
                ? 'border-red-300 bg-red-50 hover:bg-red-100'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <div className="flex flex-col items-center gap-3">
              <div className={`p-4 rounded-full ${
                errors.imagen && touched.imagen
                  ? 'bg-red-100'
                  : 'bg-blue-100'
              }`}>
                <HiPhotograph className={`${
                  errors.imagen && touched.imagen
                    ? 'text-red-600'
                    : 'text-blue-600'
                }`} size={32} />
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Haz clic para subir una imagen
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, WEBP hasta 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Error de imagen */}
          {touched.imagen && errors.imagen && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <HiExclamationCircle size={14} />
              {errors.imagen}
            </p>
          )}

          {/* Preview de imagen */}
          {previewImage && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Imagen seleccionada
              </p>
              <div className="relative inline-block">
                <div className="w-48 h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Botón eliminar */}
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <HiX size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Crear Proyecto')}
          </Button>
        </div>
      </form>
    </div>
    </SectionAnimation>
  )
}
