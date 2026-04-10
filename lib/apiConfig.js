/**
 * Configuración centralizada de la API
 * 
 * Este archivo contiene toda la configuración necesaria para conectarse
 * a la API FastAPI de Global Mantenimiento.
 */

// URL base de la API - se configura via variable de entorno
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Endpoints de la API
export const API_ENDPOINTS = {
  // Autenticación
  auth: {
    login: '/api/auth/login',
    loginJson: '/api/auth/login/json',
    me: '/api/auth/me',  // Este debe apuntar a FastAPI: /api/auth/me
    register: '/api/auth/register',
    logout: '/api/auth/logout',
  },
  // Servicios
  servicios: {
    list: '/api/servicios/',
    detail: (id) => `/api/servicios/${id}`,
  },
  // Próximamente: más endpoints
  // proyectos: {
  //   list: '/api/proyectos/',
  //   detail: (id) => `/api/proyectos/${id}`,
  // },
  // testimonios: {
  //   list: '/api/testimonios/',
  //   detail: (id) => `/api/testimonios/${id}`,
  // },
  // trabajos: {
  //   list: '/api/trabajos/',
  //   detail: (id) => `/api/trabajos/${id}`,
  // },
}

// Configuración de headers por defecto
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
}

// Configuración de timeouts (en milisegundos)
export const API_CONFIG = {
  timeout: 30000, // 30 segundos
  retryAttempts: 3,
  retryDelay: 1000, // 1 segundo
}

// Códigos de estado HTTP que manejamos
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}

// Mensajes de error personalizados
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu conexión a internet.',
  UNAUTHORIZED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  FORBIDDEN: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  SERVER_ERROR: 'Error del servidor. Por favor, intenta de nuevo más tarde.',
  UNKNOWN: 'Ha ocurrido un error inesperado.',
}

/**
 * Construye la URL completa de un endpoint
 * @param {string} endpoint - El endpoint relativo
 * @returns {string} - La URL completa
 */
export function buildApiUrl(endpoint) {
  // Asegurar que el endpoint empiece con /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${API_BASE_URL}${normalizedEndpoint}`
}

/**
 * Verifica si la API está configurada correctamente
 * @returns {boolean}
 */
export function isApiConfigured() {
  return !!API_BASE_URL
}

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  DEFAULT_HEADERS,
  API_CONFIG,
  HTTP_STATUS,
  ERROR_MESSAGES,
  buildApiUrl,
  isApiConfigured,
}
