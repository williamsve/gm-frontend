import Head from 'next/head'
import Link from 'next/link'
import Icon from '../components/Icon'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Página no encontrada - Global Mantenimiento C.A.</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
              <img 
                src="/logo-default.png" 
                alt="Global Mantenimiento C.A." 
                className="h-12 w-auto"
              />
            </div>
            <h1 className="text-2xl font-bold text-white">Global Mantenimiento C.A.</h1>
          </div>

          {/* 404 Error */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 max-w-lg mx-auto border border-white/20">
            <div className="text-8xl font-bold text-white/20 mb-4">404</div>
            <h2 className="text-3xl font-bold text-white mb-4">Página no encontrada</h2>
            <p className="text-blue-100 mb-8">
              Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="bg-yellow-500 text-blue-900 font-bold px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center"
              >
                <Icon name="home" className="w-5 h-5 mr-2" aria-hidden="true" />
                Volver al inicio
              </Link>
              <Link 
                href="/#contacto"
                className="border-2 border-white text-white font-bold px-6 py-3 rounded-lg hover:bg-white hover:text-blue-900 transition-colors flex items-center justify-center"
              >
                <Icon name="phone" className="w-5 h-5 mr-2" aria-hidden="true" />
                Contáctanos
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-blue-200 text-sm">
            <p>© 2024 Global Mantenimiento C.A. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </>
  )
}
