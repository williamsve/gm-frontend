import { useState, useRef, useEffect } from 'react'
import { HiPhotograph, HiX, HiCheck, HiExclamationCircle } from 'react-icons/hi'
import { SectionHeader, Button, SectionAnimation } from '../../ui'

export default function ServicioForm({ servicio, onCancel, onSubmit, isSubmitting: externalIsSubmitting }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    imagen: null
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false)
  const isSubmitting = externalIsSubmitting !== undefined ? externalIsSubmitting : internalIsSubmitting
  const [previewImage, setPreviewImage] = useState(null)
  const fileInputRef = useRef(null)

  // Si se proporciona un servicio, cargar sus datos (modo edición)
  useEffect(() => {
    if (servicio) {
      setFormData({
        nombre: servicio.nombre || '',
        descripcion: servicio.descripcion || '',
        imagen: null
      })
      if (servicio.imagen) {
        setPreviewImage(servicio.imagen)
      }
    }
  }, [servicio])

  // Validaciones
  const validateField = (name, value) => {
    switch (name) {
      case 'nombre':
        if (!value.trim()) return 'El nombre del servicio es requerido'
        if (value.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres'
        if (value.trim().length > 100) return 'El nombre no puede exceder 100 caracteres'
        return ''
      
      case 'descripcion':
        if (!value.trim()) return 'La descripción es requerida'
        if (value.trim().length < 3) return 'La descripción debe tener al menos 3 caracteres'
        if (value.trim().length > 500) return 'La descripción no puede exceder 500 caracteres'
        return ''
      
      case 'imagen':
        // En modo edición, la imagen es opcional si ya existe una
        if (!servicio && !value) return 'Debe subir una imagen'
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
    
    // Validar después de remover (solo si es modo creación)
    if (!servicio) {
      setErrors(prev => ({ ...prev, imagen: 'Debe subir una imagen' }))
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
    
    // Preparar datos para enviar
    const dataToSend = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      imagen: formData.imagen
    }
    
    if (onSubmit) {
      onSubmit(dataToSend)
    }
    
    if (externalIsSubmitting === undefined) {
      setInternalIsSubmitting(false)
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

  const isEditMode = !!servicio

  return (
    <SectionAnimation>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <SectionHeader
          title={isEditMode ? 'Editar Servicio' : 'Nuevo Servicio'}
          description={isEditMode ? 'Modifica los datos del servicio' : 'Completa el formulario para agregar un nuevo servicio'}
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Nombre del Servicio */}
        <div className="space-y-2">
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nombre del Servicio <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej: Mantenimiento Preventivo"
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
            Descripción <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Describe el servicio que ofreces..."
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
                Mínimo 3 caracteres
              </p>
            )}
            <p className={`text-sm ${formData.descripcion.length > 500 ? 'text-red-600' : 'text-gray-500'}`}>
              {formData.descripcion.length}/500
            </p>
          </div>
        </div>

        {/* Upload de Imagen */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Imagen del Servicio {!isEditMode && <span className="text-red-500">*</span>}
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

        {/* Resumen de errores */}
        {Object.keys(errors).filter(key => errors[key]).length > 0 && touched.imagen && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <HiExclamationCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Por favor, corrige los siguientes errores:
                </p>
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                  {Object.entries(errors).map(([key, error]) => (
                    error && <li key={key}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : (isEditMode ? 'Guardar Cambios' : 'Crear Servicio')}
          </Button>
        </div>
      </form>
    </div>
    </SectionAnimation>
  )
}
