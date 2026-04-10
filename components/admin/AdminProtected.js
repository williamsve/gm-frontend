import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../lib/useAuth'

export default function AdminProtected({ children }) {
  const router = useRouter()
  const { isAuthenticated, isAdmin, loading, user } = useAuth()

  useEffect(() => {
    // Si no está autenticado, redirigir a login
    if (!loading && !isAuthenticated) {
      router.push('/admin/login')
    }
    // Si está autenticado pero no es admin, redirigir al inicio
    else if (!loading && isAuthenticated && !isAdmin) {
      router.push('/')
    }
  }, [isAuthenticated, isAdmin, loading, router])

  // Mostrar loading mientras verifica autenticación y rol
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, no mostrar nada (se redirigirá)
  if (!isAuthenticated) {
    return null
  }

  // Si está autenticado pero no es admin, mostrar mensaje de acceso denegado
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-full p-4 inline-block mb-4">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600 mb-6">
            No tienes permisos de administrador para acceder a esta sección.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    )
  }

  // Si está autenticado y es admin, mostrar el contenido
  return children
}
