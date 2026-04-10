// Simple i18n implementation using React Context
// This system works reliably without server-side routing complexity

import { createContext, useContext, useState, useEffect } from 'react'

// Available languages configuration
export const languages = [
  { code: 'es', name: 'Español', nameEn: 'Spanish', flag: 'es' },
  { code: 'en', name: 'English', nameEn: 'English', flag: 'us' },
  { code: 'pt', name: 'Português', nameEn: 'Portuguese', flag: 'br' },
  { code: 'fr', name: 'Français', nameEn: 'French', flag: 'fr' },
  { code: 'de', name: 'Deutsch', nameEn: 'German', flag: 'de' },
  { code: 'it', name: 'Italiano', nameEn: 'Italian', flag: 'it' }
]

// Default language
export const defaultLocale = 'es'

// Import all language files
import esMessages from '../i18n/messages/es.json'
import enMessages from '../i18n/messages/en.json'
import ptMessages from '../i18n/messages/pt.json'
import frMessages from '../i18n/messages/fr.json'
import deMessages from '../i18n/messages/de.json'
import itMessages from '../i18n/messages/it.json'

const messages = {
  es: esMessages,
  en: enMessages,
  pt: ptMessages,
  fr: frMessages,
  de: deMessages,
  it: itMessages
}

// Create context
const I18nContext = createContext({
  locale: defaultLocale,
  setLocale: () => {},
  t: () => ''
})

// Storage key for persistence
const STORAGE_KEY = 'gm-language'

// Get nested value from object
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

// Provider component
export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(defaultLocale)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored && languages.find(l => l.code === stored)) {
        setLocaleState(stored)
      }
    }
    setIsInitialized(true)
  }, [])

  // Persist locale changes
  const setLocale = (newLocale) => {
    if (languages.find(l => l.code === newLocale)) {
      setLocaleState(newLocale)
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, newLocale)
      }
    }
  }

  // Translation function
  const t = (key, fallback = '') => {
    const langMessages = messages[locale] || messages[defaultLocale]
    const translation = getNestedValue(langMessages, key)
    return translation || fallback || key
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!isInitialized) {
    return <>{children}</>
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

// Hook to use translations
export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    // Fallback for when used outside provider
    return {
      locale: defaultLocale,
      setLocale: () => {},
      t: (key, fallback = '') => {
        const langMessages = messages[defaultLocale]
        return getNestedValue(langMessages, key) || fallback || key
      }
    }
  }
  return context
}

// Export languages helper
export function useLanguages() {
  return languages
}

export default I18nContext