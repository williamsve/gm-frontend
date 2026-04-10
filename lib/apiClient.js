/**
 * Cliente API con autenticación JWT
 * 
 * Este módulo proporciona funciones para hacer peticiones HTTP
 * a la API FastAPI con manejo automático de autenticación JWT.
 */

import { buildApiUrl, DEFAULT_HEADERS, HTTP_STATUS, ERROR_MESSAGES } from './apiConfig'

// Clave para almacenar el token en localStorage
const TOKEN_KEY = 'auth_token'

/**
 * Obtiene el token JWT almacenado
 * @returns {string|null}
 */
export function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Almacena el token JWT
 * @param {string} token
 */
export function setToken(token) {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * Elimina el token JWT
 */
export function removeToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Configura la cookie HttpOnly con el token JWT
 * Esta función llama al backend para que configure la cookie de forma segura
 * @param {string} token - El token JWT
 * @returns {Promise<boolean>} - true si se configuró correctamente
 */
export async function setTokenCookie(token) {
  if (typeof window === 'undefined') return false
  
  try {
    const apiUrl = buildApiUrl('/api/auth/set-cookie')
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
      // Importante: credentials: 'include' para enviar/recibir cookies
      credentials: 'include',
    })
    
    if (response.ok) {
      console.log('[COOKIE] Cookie HttpOnly configurada correctamente')
      return true
    } else {
      console.error('[COOKIE] Error al configurar cookie:', response.status)
      return false
    }
  } catch (error) {
    console.error('[COOKIE] Error al configurar cookie:', error)
    return false
  }
}

/**
 * Limpia la cookie de autenticación
 * @returns {Promise<boolean>}
 */
export async function clearTokenCookie() {
  if (typeof window === 'undefined') return false
  
  try {
    const apiUrl = buildApiUrl('/api/auth/logout')
    await fetch(apiUrl, {
      method: 'POST',
      credentials: 'include',
    })
    return true
  } catch (error) {
    console.error('[COOKIE] Error al limpiar cookie:', error)
    return false
  }
}

/**
 * Verifica si hay un token almacenado
 * @returns {boolean}
 */
export function hasToken() {
  return !!getToken()
}

/**
 * Construye los headers para una petición
 * @param {boolean} includeAuth - Si incluir el header de autenticación
 * @returns {Object}
 */
function buildHeaders(includeAuth = true) {
  const headers = { ...DEFAULT_HEADERS }
  
  if (includeAuth) {
    const token = getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  
  return headers
}

/**
 * Maneja la respuesta de la API
 * @param {Response} response
 * @returns {Promise}
 */
async function handleResponse(response) {
  // Si la respuesta es 204 No Content, retornar null
  if (response.status === 204) {
    return null
  }
  
  // Intentar parsear como JSON
  let data
  try {
    data = await response.json()
  } catch (error) {
    // Si no es JSON, crear un error genérico
    throw new Error(ERROR_MESSAGES.UNKNOWN)
  }
  
  // Si la respuesta no es ok, lanzar error
  if (!response.ok) {
    const error = new Error(data.detail || data.message || getErrorMessage(response.status))
    error.status = response.status
    error.data = data
    throw error
  }
  
  return data
}

/**
 * Obtiene el mensaje de error según el código de estado
 * @param {number} status
 * @returns {string}
 */
function getErrorMessage(status) {
  switch (status) {
    case HTTP_STATUS.UNAUTHORIZED:
      return ERROR_MESSAGES.UNAUTHORIZED
    case HTTP_STATUS.FORBIDDEN:
      return ERROR_MESSAGES.FORBIDDEN
    case HTTP_STATUS.NOT_FOUND:
      return ERROR_MESSAGES.NOT_FOUND
    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      return ERROR_MESSAGES.SERVER_ERROR
    default:
      return ERROR_MESSAGES.UNKNOWN
  }
}

/**
 * Realiza una petición GET
 * @param {string} endpoint - El endpoint relativo
 * @param {Object} options - Opciones adicionales
 * @returns {Promise}
 */
export async function apiGet(endpoint, options = {}) {
  const url = buildApiUrl(endpoint)
  const { includeAuth = true, ...fetchOptions } = options
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: buildHeaders(includeAuth),
      ...fetchOptions,
    })
    
    return await handleResponse(response)
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
    }
    throw error
  }
}

/**
 * Realiza una petición POST
 * @param {string} endpoint - El endpoint relativo
 * @param {Object} data - Los datos a enviar
 * @param {Object} options - Opciones adicionales
 * @returns {Promise}
 */
export async function apiPost(endpoint, data = {}, options = {}) {
  const url = buildApiUrl(endpoint)
  const { includeAuth = true, ...fetchOptions } = options
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: buildHeaders(includeAuth),
      body: JSON.stringify(data),
      ...fetchOptions,
    })
    
    return await handleResponse(response)
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
    }
    throw error
  }
}

/**
 * Realiza una petición PUT
 * @param {string} endpoint - El endpoint relativo
 * @param {Object} data - Los datos a enviar
 * @param {Object} options - Opciones adicionales
 * @returns {Promise}
 */
export async function apiPut(endpoint, data = {}, options = {}) {
  const url = buildApiUrl(endpoint)
  const { includeAuth = true, ...fetchOptions } = options
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: buildHeaders(includeAuth),
      body: JSON.stringify(data),
      ...fetchOptions,
    })
    
    return await handleResponse(response)
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
    }
    throw error
  }
}

/**
 * Realiza una petición DELETE
 * @param {string} endpoint - El endpoint relativo
 * @param {Object} options - Opciones adicionales
 * @returns {Promise}
 */
export async function apiDelete(endpoint, options = {}) {
  const url = buildApiUrl(endpoint)
  const { includeAuth = true, ...fetchOptions } = options
  
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: buildHeaders(includeAuth),
      ...fetchOptions,
    })
    
    return await handleResponse(response)
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
    }
    throw error
  }
}

/**
 * Realiza una petición con form-data (para login)
 * @param {string} endpoint - El endpoint relativo
 * @param {FormData} formData - Los datos del formulario
 * @param {Object} options - Opciones adicionales
 * @returns {Promise}
 */
export async function apiPostFormData(endpoint, formData, options = {}) {
  const url = buildApiUrl(endpoint)
  const { includeAuth = false, ...fetchOptions } = options
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      // No incluir Content-Type para que el browser lo establezca automáticamente
      headers: includeAuth && getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {},
      body: formData,
      ...fetchOptions,
    })
    
    return await handleResponse(response)
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
    }
    throw error
  }
}

export default {
  getToken,
  setToken,
  removeToken,
  setTokenCookie,
  clearTokenCookie,
  hasToken,
  apiGet,
  apiPost,
  apiPut,
  apiDelete,
  apiPostFormData,
}
