/**
 * Hook de autenticación con JWT
 * 
 * Este módulo proporciona el contexto y hook para manejar la autenticación
 * de usuarios usando JWT con la API FastAPI.
 */

import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { apiPost, apiGet, getToken, setToken, removeToken, hasToken, setTokenCookie, clearTokenCookie } from './apiClient'
import { API_ENDPOINTS, API_BASE_URL } from './apiConfig'

const AuthContext = createContext(null)

/**
 * Proveedor de autenticación
 * Debe envolver la aplicación o las rutas que requieran autenticación
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Verificar si hay sesión activa al cargar
  useEffect(() => {
    checkAuth()
  }, [])

  /**
   * Verifica si el usuario está autenticado
   * Intenta obtener el usuario actual usando el token almacenado
   */
  const checkAuth = useCallback(async () => {
    // Si no hay token, no hay sesión
    if (!hasToken()) {
      console.log('[DEBUG CHECKAUTH] No hay token en localStorage')
      setLoading(false)
      return
    }

    try {
      // Llamar directamente a FastAPI (puerto 8000) ya que ese es el backend principal
      const token = getToken()
      console.log('[DEBUG CHECKAUTH] Token encontrado:', token?.substring(0, 20) + '...')
      
      const apiUrl = `${API_BASE_URL}${API_ENDPOINTS.auth.me}`
      console.log('[DEBUG CHECKAUTH] Llamando a:', apiUrl)

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      console.log('[DEBUG CHECKAUTH] Response status:', response.status)

      if (!response.ok) {
        throw new Error('Token inválido o expirado')
      }

      const data = await response.json()
      // FastAPI devuelve directamente UserResponse, no {success, user}
      console.log('[DEBUG CHECKAUTH] Usuario obtained:', data)
      setUser(data)
    } catch (err) {
      // Si el token es inválido o expiró, limpiar
      console.error('[DEBUG CHECKAUTH] Error al verificar autenticación:', err)
      console.error('[DEBUG CHECKAUTH] Nombre del error:', err.name)
      console.error('[DEBUG CHECKAUTH] Mensaje:', err.message)
      removeToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Inicia sesión con username y password
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const login = useCallback(async (username, password) => {
    setError(null)
    
    try {
      // La API FastAPI espera form-data para login
      const formData = new URLSearchParams()
      formData.append('username', username)
      formData.append('password', password)

      const apiUrl = `${API_BASE_URL}${API_ENDPOINTS.auth.login}`
      console.log('[DEBUG LOGIN] URL:', apiUrl)
      console.log('[DEBUG LOGIN] Request:', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formData.toString() })

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      })

      console.log('[DEBUG LOGIN] Response status:', response.status)
      console.log('[DEBUG LOGIN] Response ok:', response.ok)

      const data = await response.json()
      console.log('[DEBUG LOGIN] Response data:', data)

      if (!response.ok) {
        throw new Error(data.detail || 'Error al iniciar sesión')
      }

      // Almacenar el token
      if (data.access_token) {
        console.log('[DEBUG LOGIN] Guardando token en localStorage:', data.access_token.substring(0, 20) + '...')
        setToken(data.access_token)
        
        // También configurar la cookie HttpOnly para mayor seguridad
        // Esto proporciona protección adicional contra XSS
        try {
          await setTokenCookie(data.access_token)
          console.log('[DEBUG LOGIN] Cookie HttpOnly configurada')
        } catch (cookieError) {
          console.warn('[DEBUG LOGIN] No se pudo configurar la cookie, usando fallback:', cookieError)
        }
      }

      // Obtener información del usuario
      console.log('[DEBUG LOGIN] Llamando a checkAuth()...')
      await checkAuth()
      console.log('[DEBUG LOGIN] checkAuth() completado, user:', user)

      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }, [checkAuth])

  /**
   * Inicia sesión con JSON (endpoint alternativo)
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const loginJson = useCallback(async (username, password) => {
    setError(null)
    
    try {
      // Llamar directamente a FastAPI (puerto 8000)
      const response = await fetch(`${API_BASE_URL}/api/auth/login/json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Error al iniciar sesión')
      }

      // Almacenar el token
      if (data.access_token) {
        setToken(data.access_token)
        
        // También configurar la cookie HttpOnly para mayor seguridad
        try {
          await setTokenCookie(data.access_token)
        } catch (cookieError) {
          console.warn('[DEBUG LOGIN] No se pudo configurar la cookie:', cookieError)
        }
      }

      // Obtener información del usuario
      await checkAuth()

      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }, [checkAuth])

  /**
   * Cierra la sesión del usuario
   */
  const logout = useCallback(async () => {
    try {
      // Llamar directamente a FastAPI (puerto 8000)
      const token = getToken()
      await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.logout}`, {
        method: 'POST',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
      })
    } catch (err) {
      // Ignorar errores al cerrar sesión
      console.error('Error al cerrar sesión:', err)
    } finally {
      // Siempre limpiar el token y el estado local
      removeToken()
      // Limpiar la cookie HttpOnly
      try {
        await clearTokenCookie()
      } catch (cookieError) {
        console.warn('[DEBUG LOGOUT] No se pudo limpiar la cookie:', cookieError)
      }
      setUser(null)
    }
  }, [])

  /**
   * Registra un nuevo usuario (solo admin)
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const register = useCallback(async (userData) => {
    setError(null)
    
    try {
      // Llamar directamente a FastAPI (puerto 8000)
      const token = getToken()
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.register}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Error al registrar usuario')
      }

      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }, [])

  const value = {
    user,
    loading,
    error,
    login,
    loginJson,
    logout,
    register,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook para acceder al contexto de autenticación
 * @returns {Object} - { user, loading, error, login, logout, isAuthenticated, isAdmin }
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

export default useAuth
