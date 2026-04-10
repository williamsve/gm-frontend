import { motion, useReducedMotion } from 'framer-motion'
import Icon from './Icon'
import Revealer from './Revealer'
import TestimonialCard from './shared/TestimonialCard'
import { useTestimoniosAprobados } from '../lib/useApi'
import { useTranslation } from '../lib/i18n'

export default function Testimonials() {
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()
  const { data: testimonials, isLoading: loading, error } = useTestimoniosAprobados()

  if (loading) {
    return (
      <section id="testimonios" className="scroll-mt-16 py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="testimonios" className="scroll-mt-16 py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <Icon name="formatQuote" className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <p className="text-red-500">{t('services.error', 'Error al cargar los testimonios')}</p>
            <p className="text-gray-600 text-sm mt-2">{t('common.retry', 'Por favor, intenta de nuevo más tarde')}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="testimonios" className="scroll-mt-16 py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4"
        >
          {t('testimonials.title', 'Lo que dicen nuestros clientes')}
        </motion.h2>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.1 }}
          className="text-gray-600 text-center max-w-2xl mx-auto mb-12"
        >
          {t('testimonials.subtitle', 'Con más de 500 proyectos exitosos, estos son los testimonios de algunos de nuestros clientes satisfechos')}
        </motion.p>

        {testimonials?.items?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {testimonials.items.map((testimonial, idx) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Icon name="formatQuote" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">{t('testimonials.noTestimonials', 'No hay testimonios disponibles')}</p>
          </div>
        )}
      </div>
    </section>
  )
}
