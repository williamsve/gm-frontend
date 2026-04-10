/**
 * Hooks de React para interactuar con la API
 * 
 * Estos hooks utilizan SWR para el fetching de datos y el cliente API
 * con autenticación JWT para las peticiones.
 */

import useSWR from 'swr'
import { apiGet } from './apiClient'
import { API_ENDPOINTS } from './apiConfig'

/**
 * Fetcher personalizado que usa el cliente API
 * @param {string} url - La URL a la que hacer fetch
 * @returns {Promise}
 */
const fetcher = async (url) => {
  // Extraer el endpoint de la URL completa
  // Las URLs vienen como '/api/servicios/' y necesitamos pasarlas al cliente
  return apiGet(url, { includeAuth: false })
}

/**
 * Hook genérico para hacer fetch de datos de la API
 * @param {string} endpoint - El endpoint de la API
 * @param {Object} options - Opciones de SWR
 * @returns {Object} - { data, error, isLoading, mutate, isError }
 */
export function useApi(endpoint, options = {}) {
  const { data, error, isLoading, mutate } = useSWR(endpoint, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 10000, // 10 segundos
    ...options
  })

  return {
    data,
    error,
    isLoading,
    mutate,
    isError: error
  }
}

/**
 * Hook para obtener la lista de trabajos
 * @param {Object} options - Opciones adicionales
 * @returns {Object}
 */
export function useTrabajos(options = {}) {
  return useApi('/api/trabajos/', options)
}

/**
 * Hook para obtener la lista de testimonios
 * @param {Object} options - Opciones adicionales
 * @returns {Object}
 */
export function useTestimonios(options = {}) {
  return useApi('/api/testimonios/', options)
}

/**
 * Hook para obtener solo testimonios aprobados (para la página pública)
 * @param {Object} options - Opciones adicionales
 * @returns {Object}
 */
export function useTestimoniosAprobados(options = {}) {
  return useApi('/api/testimonios/?aprobado=true', options)
}

/**
 * Hook para obtener la lista de proyectos
 * @param {Object} options - Opciones adicionales
 * @returns {Object}
 */
export function useProyectos(options = {}) {
  return useApi('/api/proyectos/', options)
}

/**
 * Hook para obtener la lista de servicios
 * @param {Object} options - Opciones adicionales
 * @returns {Object}
 */
export function useServicios(options = {}) {
  return useApi('/api/servicios/', options)
}

/**
 * Hook para obtener un servicio por ID
 * @param {number|string} id - El ID del servicio
 * @param {Object} options - Opciones adicionales
 * @returns {Object}
 */
export function useServicio(id, options = {}) {
  return useApi(id ? `/api/servicios/${id}` : null, options)
}

/**
 * Hook para obtener un proyecto por ID
 * @param {number|string} id - El ID del proyecto
 * @param {Object} options - Opciones adicionales
 * @returns {Object}
 */
export function useProyecto(id, options = {}) {
  return useApi(id ? `/api/proyectos/${id}` : null, options)
}

/**
 * Hook para obtener un testimonio por ID
 * @param {number|string} id - El ID del testimonio
 * @param {Object} options - Opciones adicionales
 * @returns {Object}
 */
export function useTestimonio(id, options = {}) {
  return useApi(id ? `/api/testimonios/${id}` : null, options)
}

/**
 * Hook para obtener un trabajo por ID
 * @param {number|string} id - El ID del trabajo
 * @param {Object} options - Opciones adicionales
 * @returns {Object}
 */
export function useTrabajo(id, options = {}) {
  return useApi(id ? `/api/trabajos/${id}` : null, options)
}

/**
 * Hook para obtener estadísticas de visitas
 * @param {Object} options - Opciones adicionales
 * @returns {Object}
 */
export function useEstadisticasVisitas(options = {}) {
  return useApi('/api/visitas/estadisticas', options)
}

export default {
  useApi,
  useTrabajos,
  useTestimonios,
  useTestimoniosAprobados,
  useProyectos,
  useServicios,
  useServicio,
  useProyecto,
  useTestimonio,
  useTrabajo,
}
