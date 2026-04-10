import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function VisitTracker() {
  const router = useRouter()

  useEffect(() => {
    const registrarVisita = async () => {
      try {
        // Registrar visita a la página actual
        await fetch('/api/visitas/registrar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pagina: router.asPath,
            user_agent: navigator.userAgent
          })
        })
      } catch (error) {
        // Silenciar errores de registro de visitas
        console.debug('Error al registrar visita:', error)
      }
    }

    // Registrar visita inicial
    registrarVisita()

    // Registrar visita cuando cambie la ruta
    const handleRouteChange = () => {
      registrarVisita()
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router])

  // Este componente no renderiza nada visible
  return null
}
