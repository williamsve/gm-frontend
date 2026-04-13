'use client'

import { useState, useEffect } from 'react'
import { HiStar, HiUser, HiOfficeBuilding, HiBriefcase, HiCheck, HiX } from 'react-icons/hi'
import { apiPost } from '../../../../lib/apiClient'

export default function TestimonioInvitacion() {
  const [token, setToken] = useState('')
  const [mounted, setMounted] = useState(false)

  // Extraer token de la URL sin usar NextRouter
  useEffect(() => {
    setMounted(true)
    const pathParts = window.location.pathname.split('/')
    const tokenPart = pathParts[pathParts.length - 1]
    // Quitar la extensión .html si existe
    setToken(tokenPart.replace('.html', ''))
  }, [])
  
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    cargo: '',
    contenido: '',
    rating: 0
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [tokenError, setTokenError] = useState(false)

  // Validar token (solo en cliente después de montaje)
  const isTokenValid = mounted && token && token.length > 0 && token !== '[token]'

  const validateForm = () => {
    const errors = {}
    
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido'
    } else if (formData.nombre.trim().length < 2) {
      errors.nombre = 'El nombre debe tener al menos 2 caracteres'
    } else if (formData.nombre.trim().length > 100) {
      errors.nombre = 'El nombre no puede exceder 100 caracteres'
    }
    
    if (!formData.empresa.trim()) {
      errors.empresa = 'La empresa es requerida'
    } else if (formData.empresa.trim().length < 2) {
      errors.empresa = 'La empresa debe tener al menos 2 caracteres'
    } else if (formData.empresa.trim().length > 100) {
      errors.empresa = 'La empresa no puede exceder 100 caracteres'
    }
    
    if (!formData.cargo.trim()) {
      errors.cargo = 'El cargo es requerido'
    } else if (formData.cargo.trim().length < 2) {
      errors.cargo = 'El cargo debe tener al menos 2 caracteres'
    } else if (formData.cargo.trim().length > 100) {
      errors.cargo = 'El cargo no puede exceder 100 caracteres'
    }
    
    if (!formData.contenido.trim()) {
      errors.contenido = 'El testimonio es requerido'
    } else if (formData.contenido.trim().length < 20) {
      errors.contenido = 'El testimonio debe tener al menos 20 caracteres'
    } else if (formData.contenido.trim().length > 500) {
      errors.contenido = 'El testimonio no puede exceder 500 caracteres'
    }
    
    if (formData.rating < 1 || formData.rating > 5) {
      errors.rating = 'Por favor selecciona una calificación'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }))
    if (formErrors.rating) {
      setFormErrors(prev => ({
        ...prev,
        rating: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Preparar datos para enviar a la API
      const dataToSend = {
        nombre: formData.nombre.trim(),
        empresa: formData.empresa.trim(),
        cargo: formData.cargo.trim(),
        testimonio: formData.contenido.trim(),
        calificacion: formData.rating
      }
      
      // Enviar testimonio a la API
      await apiPost(`/api/testimonios/invitacion/${token}`, dataToSend, { includeAuth: false })
      
      setIsSubmitting(false)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error al enviar testimonio:', error)
      setIsSubmitting(false)
      
      // Mostrar error al usuario
      if (error.status === 400) {
        setFormErrors({ submit: 'Token de invitación inválido' })
      } else if (error.status === 422) {
        setFormErrors({ submit: 'Error de validación. Por favor revisa los campos.' })
      } else {
        setFormErrors({ submit: 'Error al enviar el testimonio. Por favor intenta de nuevo.' })
      }
    }
  }

  // Pantalla de éxito después de enviar
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiCheck className="text-green-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">¡Gracias por tu testimonio!</h1>
          <p className="text-gray-600 mb-6">
            Tu opinión ha sido enviada exitosamente. Apreciamos mucho que hayas tomado el tiempo 
            para compartir tu experiencia con nosotros.
          </p>
          <p className="text-sm text-gray-500">
            Este enlace ya no está disponible para uso futuro.
          </p>
        </div>
      </div>
    )
  }

  // Error de token inválido o usado
  if (!isTokenValid || tokenError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiX className="text-red-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Enlace no válido</h1>
          <p className="text-gray-600 mb-6">
            Este enlace de invitación no es válido o ya ha sido utilizado. 
            Si crees que esto es un error, por favor contacta al administrador.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  // Formulario para el cliente
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Deja tu Testimonio</h1>
          <p className="text-gray-600">
            Nos encantaría conocer tu experiencia con nuestro servicio. 
            Tu opinión es muy importante para nosotros.
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    formErrors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              {formErrors.nombre && (
                <p className="text-red-500 text-sm mt-1">{formErrors.nombre}</p>
              )}
            </div>

            {/* Empresa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empresa *
              </label>
              <div className="relative">
                <HiOfficeBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    formErrors.empresa ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Tech Solutions S.A."
                />
              </div>
              {formErrors.empresa && (
                <p className="text-red-500 text-sm mt-1">{formErrors.empresa}</p>
              )}
            </div>

            {/* Cargo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cargo *
              </label>
              <div className="relative">
                <HiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    formErrors.cargo ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Director de Tecnología"
                />
              </div>
              {formErrors.cargo && (
                <p className="text-red-500 text-sm mt-1">{formErrors.cargo}</p>
              )}
            </div>

            {/* Calificación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calificación *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="focus:outline-none"
                  >
                    <HiStar
                      size={32}
                      className={`${
                        star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    />
                  </button>
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {formData.rating > 0 ? `${formData.rating} de 5 estrellas` : 'Selecciona una calificación'}
                </span>
              </div>
              {formErrors.rating && (
                <p className="text-red-500 text-sm mt-1">{formErrors.rating}</p>
              )}
            </div>

            {/* Testimonio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tu Testimonio *
              </label>
              <textarea
                name="contenido"
                value={formData.contenido}
                onChange={handleInputChange}
                rows={5}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                  formErrors.contenido ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Cuéntanos tu experiencia con nuestro servicio. ¿Qué te gustó? ¿Cómo fue la comunicación? ¿Recomendarías nuestro trabajo?"
              />
              <div className="flex items-center justify-between mt-1">
                {formErrors.contenido ? (
                  <p className="text-red-500 text-sm">{formErrors.contenido}</p>
                ) : (
                  <p className="text-gray-500 text-sm">Mínimo 20 caracteres</p>
                )}
                <p className={`text-sm ${
                  formData.contenido.length > 500 ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {formData.contenido.length}/500
                </p>
              </div>
            </div>

            {/* Error de envío */}
            {formErrors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{formErrors.submit}</p>
              </div>
            )}

            {/* Botón de envío */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-medium"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <span>Enviar Testimonio</span>
                )}
              </button>
            </div>
          </form>

          {/* Nota de privacidad */}
          <p className="text-xs text-gray-500 text-center mt-6">
            Tu información será utilizada únicamente para mostrar tu testimonio en nuestro sitio web.
            No compartiremos tus datos con terceros.
          </p>
        </div>
      </div>
    </div>
  )
}
