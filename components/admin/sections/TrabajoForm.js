import { useState, useRef, useEffect } from 'react'
import { HiPhotograph, HiX, HiCheck, HiExclamationCircle } from 'react-icons/hi'
import { SectionHeader, Button, SectionAnimation } from '../../ui'

export default function TrabajoForm({ trabajo, onCancel, onSubmit, isSubmitting: externalIsSubmitting }) {
  const [formData, setFormData] = useState({
    nombre: '',
    cliente: '',
    descripcion: '',
    fecha: '',
    categoria: '',
    imagenes: []
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [internalIsSubmitting, setInternalIsSubmitting] = useState(false)
  const isSubmitting = externalIsSubmitting !== undefined ? externalIsSubmitting : internalIsSubmitting
  const [previewImages, setPreviewImages] = useState([])
  const fileInputRef = useRef(null)

  // Si se proporciona un trabajo, cargar sus datos (modo edición)
  useEffect(() => {
    if (trabajo) {
      setFormData({
        nombre: trabajo.nombre || '',
        cliente: trabajo.cliente || '',
        descripcion: trabajo.descripcion || '',
        fecha: trabajo.fecha_inicio ? trabajo.fecha_inicio.split('T')[0] : '',
        categoria: trabajo.tipo_servicio || '',
        imagenes: []
      })
      if (trabajo.imagenes && trabajo.imagenes.length > 0) {
        setPreviewImages(trabajo.imagenes.map(img => ({
          preview: img,
          name: 'Imagen existente'
        })))
      }
    }
  }, [trabajo])

  // Validaciones
  const validateField = (name, value) => {
    switch (name) {
      case 'nombre':
        if (!value.trim()) return 'El nombre del trabajo es requerido'
        if (value.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres'
        if (value.trim().length > 100) return 'El nombre no puede exceder 100 caracteres'
        return ''
      
      case 'cliente':
        if (!value.trim()) return 'El nombre del cliente es requerido'
        if (value.trim().length < 2) return 'El nombre del cliente debe tener al menos 2 caracteres'
        if (value.trim().length > 100) return 'El nombre del cliente no puede exceder 100 caracteres'
        return ''
      
      case 'descripcion':
        if (!value.trim()) return 'La descripción es requerida'
        if (value.trim().length < 10) return 'La descripción debe tener al menos 10 caracteres'
        if (value.trim().length > 1000) return 'La descripción no puede exceder 1000 caracteres'
        return ''
      
      case 'fecha':
        if (!value) return 'La fecha es requerida'
        const selectedDate = new Date(value)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (selectedDate > today) return 'La fecha no puede ser futura'
        return ''
      
      case 'categoria':
        if (value && value.trim().length > 50) return 'La categoría no puede exceder 50 caracteres'
        return ''
      
      case 'imagenes':
  // En modo edición, permitir si hay imágenes existentes en preview
  const hasExistingImages = previewImages.length > 0
  const hasNewImages = value && value.length > 0
  if (!hasExistingImages && !hasNewImages) return 'Debe subir al menos una imagen'
  const totalImages = previewImages.length + (value?.length || 0)
  if (totalImages > 10) return 'No puede subir más de 10 imágenes'
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
    const files = Array.from(e.target.files)
    
    // Validar número máximo de imágenes
    if (formData.imagenes.length + files.length > 10) {
      setErrors(prev => ({ ...prev, imagenes: 'No puede subir más de 10 imágenes' }))
      return
    }

    // Validar cada archivo
    const validFiles = []
    const validPreviews = []
    
    files.forEach(file => {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, imagenes: 'Solo se permiten archivos de imagen' }))
        return
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, imagenes: 'Cada imagen no puede exceder 5MB' }))
        return
      }
      
      validFiles.push(file)
      
      // Crear preview
      const reader = new FileReader()
      reader.onloadend = () => {
        validPreviews.push({
          file,
          preview: reader.result,
          name: file.name
        })
        
        if (validPreviews.length === validFiles.length) {
          setPreviewImages(prev => [...prev, ...validPreviews])
        }
      }
      reader.readAsDataURL(file)
    })

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        imagenes: [...prev.imagenes, ...validFiles]
      }))
      setErrors(prev => ({ ...prev, imagenes: '' }))
    }
  }

  const removeImage = (index) => {
  setFormData(prev => ({
    ...prev,
    imagenes: prev.imagenes.filter((_, i) => i !== index)
  }))
  setPreviewImages(prev => prev.filter((_, i) => i !== index))
  
  // Validar después de remover - considerar tanto imágenes nuevas como existentes
  const newImages = formData.imagenes.filter((_, i) => i !== index)
  const remainingPreviews = previewImages.filter((_, i) => i !== index)
  if (newImages.length === 0 && remainingPreviews.length === 0) {
    setErrors(prev => ({ ...prev, imagenes: 'Debe subir al menos una imagen' }))
  } else {
    setErrors(prev => ({ ...prev, imagenes: '' }))
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
    
    if (onSubmit) {
      onSubmit(formData)
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

  return (
    <SectionAnimation>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <SectionHeader
          title={trabajo ? 'Editar Trabajo' : 'Nuevo Trabajo'}
          description={trabajo ? 'Modifica los datos del trabajo' : 'Completa el formulario para agregar un nuevo trabajo'}
        />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Grid de campos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre del Trabajo */}
          <div className="space-y-2">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre del Trabajo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: Sitio Web Corporativo"
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

          {/* Cliente */}
          <div className="space-y-2">
            <label htmlFor="cliente" className="block text-sm font-medium text-gray-700">
              Cliente <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="cliente"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: Empresa ABC"
                className={inputClasses('cliente')}
              />
              {touched.cliente && !errors.cliente && (
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

          {/* Fecha */}
          <div className="space-y-2">
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
              Fecha del Trabajo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                onBlur={handleBlur}
                max={new Date().toISOString().split('T')[0]}
                className={inputClasses('fecha')}
              />
              {touched.fecha && !errors.fecha && (
                <HiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={20} />
              )}
              {touched.fecha && errors.fecha && (
                <HiExclamationCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={20} />
              )}
            </div>
            {touched.fecha && errors.fecha && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <HiExclamationCircle size={14} />
                {errors.fecha}
              </p>
            )}
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <div className="relative">
              <input
                type="text"
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: Desarrollo Web, Diseño, Marketing"
                className={inputClasses('categoria')}
              />
              {touched.categoria && !errors.categoria && formData.categoria && (
                <HiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={20} />
              )}
              {touched.categoria && errors.categoria && (
                <HiExclamationCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500" size={20} />
              )}
            </div>
            {touched.categoria && errors.categoria && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <HiExclamationCircle size={14} />
                {errors.categoria}
              </p>
            )}
          </div>
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
              placeholder="Describe el trabajo, sus objetivos y resultados..."
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
                Mínimo 10 caracteres
              </p>
            )}
            <p className={`text-sm ${formData.descripcion.length > 1000 ? 'text-red-600' : 'text-gray-500'}`}>
              {formData.descripcion.length}/1000
            </p>
          </div>
        </div>

        {/* Upload de Imágenes */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Imágenes del Trabajo <span className="text-red-500">*</span>
          </label>
          
          {/* Zona de drop/upload */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              errors.imagenes && touched.imagenes
                ? 'border-red-300 bg-red-50 hover:bg-red-100'
                : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <div className="flex flex-col items-center gap-3">
              <div className={`p-4 rounded-full ${
                errors.imagenes && touched.imagenes
                  ? 'bg-red-100'
                  : 'bg-blue-100'
              }`}>
                <HiPhotograph className={`${
                  errors.imagenes && touched.imagenes
                    ? 'text-red-600'
                    : 'text-blue-600'
                }`} size={32} />
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Haz clic para subir imágenes
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, WEBP hasta 5MB cada una (máximo 10 imágenes)
                </p>
              </div>
            </div>
          </div>

          {/* Error de imágenes */}
          {touched.imagenes && errors.imagenes && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <HiExclamationCircle size={14} />
              {errors.imagenes}
            </p>
          )}

          {/* Preview de imágenes */}
          {previewImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Imágenes seleccionadas ({previewImages.length}/10)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {previewImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      <img
                        src={img.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Botón eliminar */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage(index)
                      }}
                      className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                    >
                      <HiX size={14} />
                    </button>
                    
                    {/* Nombre del archivo */}
                    <p className="mt-1 text-xs text-gray-500 truncate" title={img.name}>
                      {img.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Resumen de errores */}
        {Object.keys(errors).filter(key => errors[key]).length > 0 && touched.imagenes && (
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
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Guardando...
              </span>
            ) : (
              'Guardar Trabajo'
            )}
          </Button>
        </div>
      </form>
    </div>
    </SectionAnimation>
  )
}
