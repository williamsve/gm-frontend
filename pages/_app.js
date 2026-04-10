import '../styles/globals.css'
import { AuthProvider } from '../lib/useAuth'
import { I18nProvider } from '../lib/i18n'
import VisitTracker from '../components/VisitTracker'
import CookieConsent from '../components/CookieConsent'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <I18nProvider>
        <AuthProvider>
          <VisitTracker />
          <CookieConsent />
          <a href="#main-content" className="skip-link">
            Saltar al contenido principal
          </a>
          <Component {...pageProps} />
        </AuthProvider>
      </I18nProvider>
    </>
  )
}
