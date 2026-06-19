import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Icon from './ui/Icon'
import LanguageSwitcher from './LanguageSwitcher'

const headerVariants = {
  hidden: { y: -10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } }
}

function useActiveSection(sections) {
  const [activeSection, setActiveSection] = useState('inicio')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150
      let currentSection = 'inicio'
      
      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (!element) continue

        const offsetTop = element.offsetTop
        const offsetHeight = element.offsetHeight

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          currentSection = section.id
          break
        }
      }

      setActiveSection(currentSection)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash && sections.find(s => s.id === hash)) {
        setActiveSection(hash)
      }
    }
    
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [isMounted, sections])

  return activeSection
}

function NavLink({ href, label, isActive, onClick, className = '' }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`
        block font-semibold transition-colors duration-200 relative py-2
        ${isActive ? 'text-primary-600' : 'text-neutral-700 hover:text-primary-600'}
        ${className}
      `}
      aria-current={isActive ? 'page' : undefined}
    >
      {label}
      {isActive && (
        <motion.span
          layoutId="activeIndicator"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600 rounded-full"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </a>
  )
}

function MobileMenu({ isOpen, onClose, activeSection, sections }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm bg-white z-50 md:hidden shadow-2xl flex flex-col"
          >
            {/* Header del menú */}
            <div className="p-5 border-b border-neutral-100 bg-neutral-50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-neutral-800">Menú</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-neutral-100 rounded-xl transition-colors min-h-[44px] min-w-[44px]"
                  aria-label="Cerrar menú"
                >
                  <Icon name="close" className="w-6 h-6 text-neutral-600" />
                </button>
              </div>
            </div>

            {/* Navegación */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {sections.map(section => (
                <div key={section.id} className="w-full">
                  <NavLink
                    href={`#${section.id}`}
                    label={section.label}
                    isActive={activeSection === section.id}
                    onClick={onClose}
                  />
                </div>
              ))}
            </nav>

            {/* Selector de idioma */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50">
              <div className="flex items-center justify-center">
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMounted])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isMounted || !isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-all hover:scale-110 min-h-[48px] min-w-[48px]"
      aria-label="Volver al inicio de la página"
    >
      <Icon name="keyboardArrowUp" className="w-6 h-6" />
    </button>
  )
}

export default function Header({ translations }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const sections = translations ? [
    { id: 'inicio', label: translations.nav.home },
    { id: 'quienes-somos', label: translations.nav.about },
    { id: 'servicios', label: translations.nav.services },
    { id: 'trabajos', label: translations.nav.works },
    { id: 'contacto', label: translations.nav.contact }
  ] : [
    { id: 'inicio', label: 'Inicio' },
    { id: 'quienes-somos', label: 'Quiénes Somos' },
    { id: 'servicios', label: 'Servicios' },
    { id: 'trabajos', label: 'Trabajos' },
    { id: 'contacto', label: 'Contacto' }
  ]

  const activeSection = useActiveSection(sections)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  return (
    <>
      <header className="backdrop-blur-xl bg-white/95 shadow-md sticky top-0 z-50 border-b border-neutral-100">
        <motion.div
          className="container mx-auto px-4 py-3 flex justify-between items-center"
          initial="hidden"
          animate="visible"
          variants={headerVariants}
        >
          <div className="flex items-center">
            <div className="relative inline-flex items-center">
              <img
                src="/favicon.svg"
                alt="Global Mantenimiento C.A. - Inicio"
                className="h-10 w-auto mr-2 md:mr-3"
              />
              <h1 className="text-lg md:text-xl font-bold text-primary-600">
                Global Mantenimiento C.A.
              </h1>
            </div>
          </div>

          <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center">
            {sections.map(section => (
              <NavLink
                key={section.id}
                href={`#${section.id}`}
                label={section.label}
                isActive={activeSection === section.id}
                onClick={() => {}}
              />
            ))}
            <LanguageSwitcher />
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-neutral-100 rounded-xl transition-colors min-h-[44px] min-w-[44px]"
              aria-label="Abrir menú de navegación"
            >
              <Icon name="menu" className="w-6 h-6 text-neutral-800" />
            </button>
          </div>
        </motion.div>
      </header>

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        activeSection={activeSection}
        sections={sections}
      />

      <ScrollToTopButton />
    </>
  )
}
