import { useState, useEffect, useRef } from 'react'
import { useTranslation, useLanguages } from '../lib/i18n'
import Icon from './Icon'
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
        className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-neutral-300 hover:border-primary-500 transition-all bg-white hover:shadow-md min-h-[44px]"
        aria-label={`Cambiar idioma. Actual: ${currentLang.name}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={`text-lg leading-none fi fi-${currentLang.flag}`} aria-hidden="true"></span>
        <span className="text-sm font-semibold text-neutral-700">{currentLang.code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 py-2 z-50 overflow-hidden"
          role="listbox"
          aria-label="Seleccionar idioma"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors ${
                locale === lang.code ? 'bg-primary-50 text-primary-600' : 'text-neutral-700'
              }`}
              role="option"
              aria-selected={locale === lang.code}
            >
              <span className={`text-lg leading-none fi fi-${lang.flag}`} aria-hidden="true"></span>
              <div className="flex flex-col items-start text-left">
                <span className="text-sm font-semibold">{lang.name}</span>
                <span className="text-xs text-neutral-400">{lang.nameEn}</span>
              </div>
              {locale === lang.code && (
                <Icon name="check" className="w-5 h-5 text-primary-600 ml-auto" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}