import { motion, useReducedMotion } from 'framer-motion'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Icon from './Icon'
import CTAButton from './ui/CTAButton'
import ScrollIndicator from './ScrollIndicator'
import useParallax from '../lib/useParallax'
import { useTranslation } from '../lib/i18n'
import img1 from '../public/services/reparacion_de_equipos_mecanicos.jpg'
import img2 from '../public/services/mantenimientoElectrico.jpg'
import img3 from '../public/services/mantenimiento de calderas segun normas covenin.jpg'
import img4 from '../public/services/automatización.jpg'

export default function Hero({ autoPlay = true, autoPlayInterval = 5000 }) {
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()
  const [bgRef, bgOffset] = useParallax(0.06)
  const [titleRef, titleOffset] = useParallax(0.14)

  const [currentIndex, setCurrentIndex] = useState(1)
  const [isAnimating, setIsAnimating] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  
  const slideRef = useRef(null)
  const autoRef = useRef(null)
  const isTransitioningRef = useRef(false)

  const slides = [
    {
      key: 'mecanico',
      title: 'Reparación de equipos mecánicos',
      desc: 'Mantenimiento correctivo de bombas, transportadores, válvulas y sistemas neumáticos y oleohidráulicos.',
      img: img1
    },
    {
      key: 'electrico',
      title: 'Instalación y acometida eléctrica de baja tensión',
      desc: 'Diseño e instalación de redes eléctricas de baja tensión para líneas de producción.',
      img: img2
    },
    {
      key: 'calderas',
      title: 'Mantenimiento de Calderas según Normas COVENIN',
      desc: 'Servicio de mantenimiento de calderas cumpliendo con las normativas COVENIN vigentes.',
      img: img3
    },
    {
      key: 'instrumentacion',
      title: 'Automatización de procesos industriales con PLC',
      desc: 'Soluciones de automatización con controladores lógicos programables para optimizar operaciones.',
      img: img4
    }
  ]

  const totalSlides = slides.length
  const extendedSlides = [slides[totalSlides - 1], ...slides, slides[0]]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleTransitionEnd = useCallback(() => {
    isTransitioningRef.current = false
    
    if (currentIndex === extendedSlides.length - 1) {
      setIsAnimating(false)
      setCurrentIndex(1)
    }
    else if (currentIndex === 0) {
      setIsAnimating(false)
      setCurrentIndex(totalSlides)
    }
  }, [currentIndex])

  useEffect(() => {
    if (!autoPlay || !isMounted) return
    
    autoRef.current = setInterval(() => {
      if (!isTransitioningRef.current) {
        isTransitioningRef.current = true
        setIsAnimating(true)
        setCurrentIndex(prev => prev + 1)
      }
    }, autoPlayInterval)
    
    return () => clearInterval(autoRef.current)
  }, [autoPlay, autoPlayInterval, isMounted])

  useEffect(() => {
    const el = slideRef.current
    if (!el) return
    
    const onEnter = () => {
      if (autoRef.current) {
        clearInterval(autoRef.current)
        autoRef.current = null
      }
    }
    
    const onLeave = () => {
      if (autoPlay && isMounted) {
        autoRef.current = setInterval(() => {
          if (!isTransitioningRef.current) {
            isTransitioningRef.current = true
            setIsAnimating(true)
            setCurrentIndex(prev => prev + 1)
          }
        }, autoPlayInterval)
      }
    }
    
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    
    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [autoPlay, autoPlayInterval, isMounted])

  const goTo = useCallback((index) => {
    if (index >= 1 && index <= totalSlides) {
      setCurrentIndex(index)
      setIsAnimating(true)
      isTransitioningRef.current = true
    }
  }, [])

  const next = useCallback(() => {
    isTransitioningRef.current = true
    setIsAnimating(true)
    setCurrentIndex(prev => prev + 1)
  }, [])

  const prev = useCallback(() => {
    isTransitioningRef.current = true
    setIsAnimating(true)
    setCurrentIndex(prev => prev - 1)
  }, [])

  const handleKeyDown = useCallback((e, direction) => {
    if (e.key === 'ArrowLeft' && direction === 'prev') {
      e.preventDefault()
      prev()
    } else if (e.key === 'ArrowRight' && direction === 'next') {
      e.preventDefault()
      next()
    }
  }, [prev, next])

  const getSafeIndex = useCallback(() => {
    if (currentIndex === 0) return totalSlides
    if (currentIndex === extendedSlides.length - 1) return 1
    return currentIndex
  }, [currentIndex])

  const translateX = `-${currentIndex * 100}%`

  if (!isMounted) {
    return (
      <section id="inicio" className="scroll-offset relative overflow-hidden bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold mb-4">
                {t('hero.title', 'Global Mantenimiento C.A.')}
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                {t('hero.subtitle', 'Especialistas en')} <span className="text-yellow-300">{t('hero.highlight', 'Mantenimiento Industrial')}</span>
              </h2>
              <p className="text-xl mb-6 text-blue-100">{t('hero.description', 'Comprometidos con la calidad, los plazos establecidos y los precios justos.')}</p>
            </div>
          </div>
        </div>
        <ScrollIndicator />
      </section>
    )
  }

  return (
    <section id="inicio" className="scroll-offset relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white py-16 md:py-20">
      <div ref={bgRef} aria-hidden className="absolute inset-0 pointer-events-none -z-10">
        <div style={{ transform: `translate3d(0, ${bgOffset}px, 0)` }} className="absolute inset-0 bg-[url('/hero-bg.svg')] bg-cover bg-center opacity-30" />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: shouldReduceMotion ? 0 : 0.6 }} style={{ transform: `translate3d(0, ${titleOffset}px, 0)` }} className="text-3xl md:text-4xl lg:text-4xl font-bold mb-4">
              {t('hero.title', 'Global Mantenimiento C.A.')}
            </motion.h1>
            <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : 0.1 }} style={{ transform: `translate3d(0, ${titleOffset}px, 0)` }} className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              {t('hero.subtitle', 'Especialistas en')} <span className="text-yellow-300">{t('hero.highlight', 'Mantenimiento Industrial')}</span>
            </motion.h2>
            <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: shouldReduceMotion ? 0 : 0.1, duration: shouldReduceMotion ? 0 : 0.5 }} className="text-xl mb-6 text-blue-100">{t('hero.description', 'Comprometidos con la calidad, los plazos establecidos y los precios justos.')}</motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: shouldReduceMotion ? 0 : 0.2 }} className="flex flex-col sm:flex-row gap-4 sm:space-x-4">
              <CTAButton href="#contacto" variant="primary" className="w-full sm:w-auto">
                {t('hero.cta', 'Habla con nosotros')}
              </CTAButton>
              <CTAButton href="#servicios" variant="secondary" className="w-full sm:w-auto">
                {t('hero.ctaSecondary', 'Ver Servicios')}
              </CTAButton>
            </motion.div>
          </div>

          <div className="w-full lg:w-1/2">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: shouldReduceMotion ? 0 : 0.6 }} className="relative bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-6 border border-white/30 shadow-xl shadow-black/10 -mx-4 lg:mx-0">
              <h3 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 text-center">{t('hero.whatWeDo', 'Lo que hacemos')}</h3>

              <div className="relative overflow-hidden rounded-lg">
                <div 
                  ref={slideRef} 
                  className="flex" 
                  style={{ 
                    transform: `translateX(${translateX})`, 
                    transition: isAnimating && !shouldReduceMotion ? 'transform 500ms ease-in-out' : 'none' 
                  }}
                  onTransitionEnd={handleTransitionEnd}
                >
                  {extendedSlides.map((s, idx) => (
                    <div key={`${s.key}-${idx}`} className="w-full flex-shrink-0">
                      <div className="relative aspect-video w-full rounded-xl shadow-lg overflow-hidden">
                        <Image 
                          src={s.img} 
                          alt={s.title} 
                          fill 
                          style={{ objectFit: 'cover' }} 
                          placeholder="blur"
                          priority={idx === 1}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col justify-end p-4 md:p-6">
                          <div className="flex flex-col items-center text-center">
                            <h4 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2 drop-shadow-lg">{s.title}</h4>
                            <p className="text-white/95 text-xs md:text-sm line-clamp-2 drop-shadow">{s.desc}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={prev}
                  onKeyDown={(e) => handleKeyDown(e, 'prev')}
                  tabIndex={0}
                  role="button"
                  aria-label={t('common.previous', 'Anterior')}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/95 text-gray-800 p-3 sm:p-4 rounded-full shadow-lg hover:bg-white z-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-[44px] min-w-[44px]"
                >
                  <Icon name="chevronLeft" className="text-xl sm:text-2xl" />
                </button>
                <button
                  onClick={next}
                  onKeyDown={(e) => handleKeyDown(e, 'next')}
                  tabIndex={0}
                  role="button"
                  aria-label={t('common.next', 'Siguiente')}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/95 text-gray-800 p-3 sm:p-4 rounded-full shadow-lg hover:bg-white z-10 focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-[44px] min-w-[44px]"
                >
                  <Icon name="chevronRight" className="text-xl sm:text-2xl" />
                </button>

                <div className="flex justify-center mt-4 space-x-2" role="tablist" aria-label="Navegación de slides">
                  {slides.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => goTo(i + 1)} 
                      role="tab"
                      aria-selected={getSafeIndex() === i + 1}
                      aria-label={`Slide ${i + 1}`}
                      tabIndex={getSafeIndex() === i + 1 ? 0 : -1}
                      className={`h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 ${getSafeIndex() === i + 1 ? 'w-6 bg-yellow-400' : 'w-2 bg-white/60 hover:bg-white/80'}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}


/*
quiero rediseñar la sección de servicios. en lugar de mostrar cards con descripción, quiero mostrar una imagen por cada servicio, para lo cual deberás diseñar un carousel de imagenes teniendo en cuenta las siguientes directrices:

reusabilidad
simpleza
estilo moderno
minimalista


texto de cada imagen (segun cada servicio):

1 Inspección y detección de fallas
2 Gestión de activos industriales
3 Reparación de equipos mecánicos
4 Reparación de tanques
5 Instalación y acometida eléctrica de baja tensión para líneas de producción.
6 Diseño, fabricación y suministro de CCM, paneles de control e instalación en campo.
7 Automatización de procesos industriales con PLC.
8Optimización de líneas de producción.
9Planificación, control y seguimiento de proyectos y paradas mayores de planta.
10 Cursos de calidad en gestión de mantenimiento.
11 Cursos básicos de mantenimiento y operaciones de calderas.
12 Mantenimiento de Calderas según Normas COVENIN

*/