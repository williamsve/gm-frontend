import { useState, useEffect, useRef } from 'react'
import { useTranslation, useLanguages } from '../lib/i18n'
import 'flag-icons/css/flag-icons.min.css'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()
  const languages = useLanguages()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const currentLang = languages.find(l => l.code === locale) || languages[0]

  const switchLanguage = (newLocale) => {
    setLocale(newLocale)
    setIsOpen(false)
  }

  if (!mounted) {
    return (
      <div className="relative">
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:border-blue-500 transition-colors"
          aria-label="Cambiar idioma"
        >
          <span className={`text-lg leading-none fi fi-${currentLang.flag}`}></span>
          <span className="text-sm font-medium">{currentLang.code.toUpperCase()}</span>
        </button>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:border-blue-500 transition-colors bg-white"
        aria-label={`Cambiar idioma. Actual: ${currentLang.name}`}
        aria-expanded={isOpen}
      >
        <span className={`text-lg leading-none fi fi-${currentLang.flag}`}></span>
        <span className="text-sm font-medium text-gray-700">{currentLang.code.toUpperCase()}</span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors ${
                locale === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <span className={`text-lg leading-none fi fi-${lang.flag}`}></span>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{lang.name}</span>
                <span className="text-xs text-gray-400">{lang.nameEn}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}