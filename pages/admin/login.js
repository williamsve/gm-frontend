import { useState, useEffect } from 'react'
import { HiEye, HiEyeOff, HiLockClosed, HiUser, HiExclamationCircle } from 'react-icons/hi'
import { useAuth } from '../../lib/useAuth'

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [router, setRouter] = useState(null)

  // Solo ejecutar en cliente después de montaje
  useEffect(() => {
    import('next/router').then((module) => {
      setRouter(module.useRouter())
    })
    setMounted(true)
  }, [])

  const { login, isAuthenticated, loading } = useAuth()

  // Redirigir si ya está autenticado (solo en cliente)
  useEffect(() => {
    if (mounted && router && !loading && isAuthenticated) {
      router.push('/admin')
    }
  }, [mounted, router, isAuthenticated, loading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(username, password)
    
    if (result.success && router) {
      router.push('/admin')
    } else if (!result.success) {
      setError(result.error)
    }
    
    setIsLoading(false)
  }

  // Mostrar loading mientras verifica autenticación (solo en cliente)
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src="/logo-default.png" 
              alt="Logo de la empresa" 
              className="h-16 w-auto filter brightness-0 invert"
              style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(180deg)' }}
            />
          </div>
          <h1 className="text-3xl font-bold text-white">Globalmantenimiento C.A</h1>
          <p className="text-gray-400 mt-2">Ingresa tus credenciales para acceder</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <HiExclamationCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Username field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiUser size={20} className="text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="admin"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiLockClosed size={20} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>


        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <img 
            src="/logo-default.png" 
            alt="Logo de la empresa" 
            className="h-8 w-auto mx-auto mb-2 opacity-50 filter brightness-0 invert"
            style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(5) hue-rotate(180deg)' }}
          />
          <p className="text-sm text-gray-500">
            © 2024 Globalmantenimiento C.A. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
