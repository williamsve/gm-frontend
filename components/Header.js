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

function NavLink({ href, label, isActive, onClick }) {
  return (
    <a 
      href={href} 
      onClick={onClick}
      className={`
        font-medium transition-colors duration-200 relative
        ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}
      `}
      style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}
    >
      {label}
      {isActive && (
        <motion.span 
          layoutId="activeIndicator"
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
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
            className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 md:hidden shadow-xl"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800">Menú</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                  <Icon name="close" className="w-6 h-6" />
                </button>
              </div>
              
              <nav className="space-y-2">
                {sections.map(section => (
                  <NavLink 
                    key={section.id}
                    href={`#${section.id}`}
                    label={section.label}
                    isActive={activeSection === section.id}
                    onClick={onClose}
                  />
                ))}
              </nav>
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
      setIsVisible(window.scrollY > 300)
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
      className="fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      aria-label="Volver arriba"
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
      <header className="backdrop-blur-xl bg-transparent shadow-md sticky top-0 z-50">
        <motion.div
          className="container mx-auto px-4 py-4 flex justify-between items-center"
          initial="hidden"
          animate="visible"
          variants={headerVariants}
        >
          <div className="flex items-center">
            <div className="relative inline-flex items-center">
              <img 
                src="/favicon.svg" 
                alt="Global Mantenimiento C.A." 
                className="h-12 w-auto mr-3"
                style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))' }}
              />
              <h1 className="text-xl md:text-2xl font-bold text-[#2374f2]" style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>Global Mantenimiento C.A.</h1>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8 items-center">
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
            <LanguageSwitcher />
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Abrir menú"
            >
              <Icon name="menu" className="w-6 h-6 text-gray-800" />
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
