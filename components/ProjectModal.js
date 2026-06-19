import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Icon from './Icon'
import { transformImageUrl } from './Works.js'

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

  const images = Array.isArray(project.images) && project.images.length > 0 ? project.images : ['/placeholder.jpg']

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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 md:inset-8 lg:inset-12 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh] md:max-h-[90vh]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition-colors min-h-[44px] min-w-[44px] z-10"
              aria-label="Cerrar modal"
            >
              <Icon name="close" className="w-6 h-6 text-neutral-600" />
            </button>

            {/* Content */}
            <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-6 h-full overflow-hidden">
              {/* Carousel */}
              <div className="lg:w-2/3 flex flex-col min-h-0">
                <div className="relative aspect-video lg:flex-1 lg:min-h-0 rounded-2xl overflow-hidden bg-neutral-100 shadow-inner">
                  <AnimatePresence mode="wait">
                     <motion.div
                       key={currentIndex}
                       initial={{ opacity: 0, scale: 0.98 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.98 }}
                       transition={{ duration: 0.3 }}
                       className="absolute inset-0"
                     >
                       <Image
                         src={transformImageUrl(images[currentIndex])}
                         alt={`${project.title} - Imagen ${currentIndex + 1} de ${images.length}`}
                         fill
                         style={{ objectFit: 'cover' }}
                         priority
                       />
                     </motion.div>
                  </AnimatePresence>

                  {/* Navigation arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prev}
                        aria-label="Imagen anterior"
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95 text-neutral-800 p-3 rounded-full shadow-lg hover:bg-white transition-all z-10 min-h-[44px] min-w-[44px] hover:scale-110"
                      >
                        <Icon name="chevronLeft" className="text-xl" />
                      </button>
                      <button
                        onClick={next}
                        aria-label="Imagen siguiente"
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/95 text-neutral-800 p-3 rounded-full shadow-lg hover:bg-white transition-all z-10 min-h-[44px] min-w-[44px] hover:scale-110"
                      >
                        <Icon name="chevronRight" className="text-xl" />
                      </button>
                    </>
                  )}

                  {/* Image counter */}
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                    {currentIndex + 1} / {images.length}
                  </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="hidden md:flex gap-3 mt-4 overflow-x-auto pb-2 px-1 flex-shrink-0">
                     {images.map((img, idx) => (
                       <button
                         key={idx}
                         onClick={() => goTo(idx)}
                         className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-3 transition-all duration-200 ${
                           currentIndex === idx ? 'border-primary-500 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                         }`}
                         aria-label={`Ver imagen ${idx + 1}`}
                         aria-current={currentIndex === idx ? 'true' : 'false'}
                       >
                         <Image
                           src={transformImageUrl(img)}
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
              <div className="lg:w-1/3 overflow-y-auto min-h-0">
                <div className="bg-neutral-50 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-neutral-900 mb-4">
                    {project.title}
                  </h3>
                  <p className="text-neutral-700 leading-relaxed mb-6">
                    {project.description}
                  </p>
                  {project.details && (
                    <div className="pt-5 border-t border-neutral-200 space-y-4">
                      <h4 className="font-semibold text-neutral-900 mb-3 flex items-center">
                        <Icon name="info" className="w-5 h-5 mr-2 text-primary-600" />
                        Detalles del proyecto
                      </h4>
                      <div className="space-y-3">
                        {project.details.split('\n').map((line, idx) => {
                          const trimmedLine = line.trim();
                          if (!trimmedLine) return null;

                          if (trimmedLine.startsWith('Empresa:')) {
                            const empresa = trimmedLine.replace('Empresa:', '').trim();
                            return (
                              <div key={idx} className="flex items-start">
                                <Icon name="work" className="w-5 h-5 mr-3 text-primary-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-semibold text-neutral-900">Empresa:</span>
                                  <span className="text-neutral-600 ml-1">{empresa}</span>
                                </div>
                              </div>
                            );
                          }

                          if (trimmedLine.startsWith('Trabajo:')) {
                            const trabajo = trimmedLine.replace('Trabajo:', '').trim();
                            return (
                              <div key={idx} className="flex items-start">
                                <Icon name="build" className="w-5 h-5 mr-3 text-primary-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-semibold text-neutral-900">Trabajo:</span>
                                  <span className="text-neutral-600 ml-1">{trabajo}</span>
                                </div>
                              </div>
                            );
                          }

                          if (trimmedLine.startsWith('Descripción:') || trimmedLine.startsWith('descripción:')) {
                            const descripcion = trimmedLine.replace(/^(Descripción|descripción):/, '').trim();
                            return (
                              <div key={idx} className="flex items-start">
                                <Icon name="edit" className="w-5 h-5 mr-3 text-primary-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-semibold text-neutral-900">Descripción:</span>
                                  <span className="text-neutral-600 ml-1">{descripcion}</span>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <p key={idx} className="text-neutral-600 text-sm leading-relaxed pl-8">
                              {trimmedLine}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
