import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Icon from './Icon'

/**
 * Carrusel de imágenes reutilizable, minimalista y moderno.
 *
 * @param {Array} slides - Array de objetos { id, src, alt, title, description }
 * @param {string} [slides[].src] - Ruta de la imagen (acepta rutas absolutas o relativas)
 * @param {string} [slides[].alt] - Texto alternativo de la imagen
 * @param {string} [slides[].title] - Título opcional sobre la imagen
 * @param {string} [slides[].description] - Descripción opcional sobre la imagen
 * @param {boolean} [showArrows=true] - Mostrar flechas de navegación
 * @param {boolean} [showDots=true] - Mostrar indicadores de punto
 * @param {boolean} [autoPlay=false] - Reproducción automática
 * @param {number} [autoPlayInterval=5000] - Intervalo de autoplay en ms
 * @param {string} [className] - Clases adicionales para el contenedor
 */
export default function ImageCarousel({
  slides = [],
  showArrows = true,
  showDots = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  className = ''
}) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef(null)

  const total = slides.length
  if (total === 0) return null

  const goTo = useCallback(
    (index) => {
      setDirection(index > current ? 1 : -1)
      setCurrent(((index % total) + total) % total)
    },
    [current, total]
  )

  const next = useCallback(() => goTo(current + 1), [current, goTo, total])
  const prev = useCallback(() => goTo(current - 1), [current, goTo, total])

  // Autoplay
  useEffect(() => {
    if (autoPlay && !isPaused && total > 1) {
      intervalRef.current = setInterval(next, autoPlayInterval)
      return () => clearInterval(intervalRef.current)
    }
  }, [autoPlay, autoPlayInterval, isPaused, next, total])

  // Pausar autoplay al salir del viewport
  useEffect(() => {
    if (!autoPlay) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsPaused(!entry.isIntersecting),
      { threshold: 0.3 }
    )
    const el = document.getElementById('image-carousel-container')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [autoPlay])

  // Teclado
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [prev, next])

  const slide = slides[current]

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 })
  }

  return (
    <div
      id="image-carousel-container"
      className={`relative w-full select-none ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ventana del carrusel */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl bg-neutral-100">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image
              src={slide.src}
              alt={slide.alt || slide.title || ''}
              fill
              priority={current === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              className="object-cover"
            />

            {/* Overlay con texto */}
            {(slide.title || slide.description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-neutral-900 p-6 md:p-10 text-white">
                {slide.title && (
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-white">
                    {slide.title}
                  </h3>
                )}
                {slide.description && (
                  <p className="text-sm md:text-base text-white/90 leading-relaxed">
                    {slide.description}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Flechas */}
      {showArrows && total > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
          >
            <Icon name="chevronLeft" className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Siguiente"
            className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-neutral-800 shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
          >
            <Icon name="chevronRight" className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </>
      )}

      {/* Indicadores (dots) */}
      {showDots && total > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              aria-label={`Ir a diapositiva ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === current
                  ? 'w-8 bg-primary-600'
                  : 'w-2 bg-neutral-300 hover:bg-neutral-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
