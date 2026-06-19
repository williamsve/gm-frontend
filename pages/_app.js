import '../styles/globals.css'
import { I18nProvider } from '../lib/i18n'
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
        <CookieConsent />
        <a href="#main-content" className="skip-link">
          Saltar al contenido principal
        </a>
        <Component {...pageProps} />
      </I18nProvider>
    </>
  )
}
