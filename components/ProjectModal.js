import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Icon from './Icon'

export default function ProjectModal({ isOpen, onClose, project }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Reset index when project changes
  useEffect(() => {
    if (project) {
      setCurrentIndex(0)
    }
  }, [project])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        prev()
      } else if (e.key === 'ArrowRight') {
        next()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const next = useCallback(() => {
    if (!project?.images || isAnimating) return
    setIsAnimating(true)
    setCurrentIndex(prev => (prev + 1) % project.images.length)
    setTimeout(() => setIsAnimating(false), 300)
  }, [project, isAnimating])

  const prev = useCallback(() => {
    if (!project?.images || isAnimating) return
    setIsAnimating(true)
    setCurrentIndex(prev => (prev - 1 + project.images.length) % project.images.length)
    setTimeout(() => setIsAnimating(false), 300)
  }, [project, isAnimating])

  const goTo = useCallback((index) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex(index)
    setTimeout(() => setIsAnimating(false), 300)
  }, [isAnimating])

  if (!project) return null

  const images = project.images || [project.img]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-2 md:inset-4 lg:inset-8 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 md:px-6 md:py-4 border-b border-gray-200">
              <div>
                <span className="text-xs text-blue-600 font-medium">{project.category}</span>
                <h2 className="text-lg md:text-xl font-bold text-gray-800">{project.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Cerrar"
              >
                <Icon name="close" className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Carousel */}
                <div className="lg:w-2/3">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={images[currentIndex]}
                          alt={`${project.title} - Imagen ${currentIndex + 1}`}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prev}
                          aria-label="Anterior"
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-lg hover:bg-white transition-colors z-10"
                        >
                          <Icon name="chevronLeft" className="text-xl" />
                        </button>
                        <button
                          onClick={next}
                          aria-label="Siguiente"
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-lg hover:bg-white transition-colors z-10"
                        >
                          <Icon name="chevronRight" className="text-xl" />
                        </button>
                      </>
                    )}

                    {/* Image counter */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentIndex + 1} / {images.length}
                    </div>
                  </div>

                  {/* Thumbnails */}
                  {images.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => goTo(idx)}
                          className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            currentIndex === idx ? 'border-blue-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <Image
                            src={img}
                            alt={`Miniatura ${idx + 1}`}
                            width={80}
                            height={80}
                            style={{ objectFit: 'cover' }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="lg:w-1/3">
                  <div className="bg-gray-50 rounded-xl p-6 h-full">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Descripción del Proyecto</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {project.description}
                    </p>
                    {project.details && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-2">Detalles</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {project.details}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
