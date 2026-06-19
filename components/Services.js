import { motion, useReducedMotion } from 'framer-motion'
import useParallax from '../lib/useParallax'
import Revealer from './Revealer'
import useInView from '../lib/useInView'
import ImageCarousel from './ui/ImageCarousel'
import { useTranslation } from '../lib/i18n'

export default function Services() {
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  const carouselItems = t('services.carousel.items', [])
  const services = Array.isArray(carouselItems) ? carouselItems : []

  const slides = services.map((service) => ({
    id: service.id,
    src: service.img,
    alt: service.title,
    title: service.title,
    description: service.description || ''
  }))

  return (
    <section id="servicios" className="scroll-mt-0 py-10 md:py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center text-neutral-800 mb-3"
        >
          {t('services.title', 'Nuestros Servicios')}
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.1 }}
          className="text-neutral-600 text-center max-w-3xl mx-auto mb-10 md:mb-12 text-base md:text-lg leading-relaxed"
        >
          {t('services.subtitle', 'Áreas de experiencia en mantenimiento industrial que ofrecemos a nuestros clientes')}
        </motion.p>

        {slides.length > 0 ? (
          <Revealer>
            <ImageCarousel
              slides={slides}
              showArrows
              showDots
              autoPlay
              autoPlayInterval={5000}
            />
          </Revealer>
        ) : (
          <div className="text-center py-12">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 mb-4">
              <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </span>
            <p className="text-neutral-500">{t('services.noResults', 'No hay servicios disponibles')}</p>
          </div>
        )}
      </div>
    </section>
  )
}
