import { motion, useReducedMotion } from 'framer-motion'
import useParallax from '../lib/useParallax'
import Card from './ui/Card'
import Icon from './ui/Icon'
import Revealer from './Revealer'
import useInView from '../lib/useInView'
import Image from 'next/image'
import { useServicios } from '../lib/useApi'
import { useTranslation } from '../lib/i18n'

/**
 * Transforma URLs de imágenes del formato /uploads/xxx al formato absoluto
 * para que Next.js pueda servirlas correctamente
 * @param {string} url - URL relativa de la imagen
 * @returns {string} - URL absoluta
 */
function transformImageUrl(url) {
  if (!url) return url
  
  // Si ya es una URL absoluta, extraer la ruta relativa
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const urlObj = new URL(url)
      return urlObj.pathname
    } catch {
      return url
    }
  }
  
  // Retornar la URL relativa tal cual
  return url
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: 'easeOut'
    }
  })
}

function ListItem({ children }) {
  return (
    <li className="flex items-start">
      <span className="text-green-500 text-lg mr-3 mt-1"><Icon name="check" className="w-5 h-5" /></span>
      <span className="text-gray-700">{children}</span>
    </li>
  )
}

function ServiceCard({ children, img, title, description, items, index }) {
  const [ref, inView] = useInView({ rootMargin: '0px 0px 100px 0px' })
  const shouldReduceMotion = useReducedMotion()
  
  return (
    <Revealer delay={index * 0.1}>
      <motion.div
        ref={ref}
        custom={index}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={cardVariants}
        whileHover={shouldReduceMotion ? {} : { y: -6, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className="h-full"
      >
        <Card className="h-full flex flex-col">
          <div className="relative w-full h-40 overflow-hidden flex-shrink-0">
            {(() => {
              const [imgRef, imgInView] = useInView()
              return (
                <div ref={imgRef} className="w-full h-full">
                  {imgInView ? (
                    <Image src={img || '/placeholder.jpg'} alt={title} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <div aria-hidden className="w-full h-full bg-gray-100" />
                  )}
                </div>
              )
            })()}
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex-shrink-0">
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
          <div className="p-6 flex-grow">
            {description && (
              <p className="text-gray-600 mb-4">{description}</p>
            )}
            <ul className="space-y-3">
              {items.map((item, i) => (
                <ListItem key={i}>{item}</ListItem>
              ))}
            </ul>
          </div>
        </Card>
      </motion.div>
    </Revealer>
  )
}

export default function Services() {
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()
  const { data: servicios, isLoading: loading, error } = useServicios()

  const services = servicios?.items ? servicios.items.map(servicio => ({
    id: servicio.id,
    title: servicio.nombre,
    description: servicio.descripcion,
    icon: 'build',
    img: transformImageUrl(servicio.imagen) || '/placeholder.jpg',
    items: []
  })) : []

  if (loading) {
    return (
      <section id="servicios" className="scroll-mt-16 py-14 bg-gray-50">
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
      <section id="servicios" className="scroll-mt-16 py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <Icon name="build" className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <p className="text-red-500">{t('services.error', 'Error al cargar los servicios')}</p>
            <p className="text-gray-600 text-sm mt-2">{t('common.retry', 'Por favor, intenta de nuevo más tarde')}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="servicios" className="scroll-mt-16 py-14 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          className="text-3xl font-bold text-center text-gray-800 mb-4"
        >
          {t('services.title', 'Nuestros Servicios')}
        </motion.h2>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.1 }}
          className="text-gray-600 text-center max-w-3xl mx-auto mb-12"
        >
          {t('services.subtitle', 'Áreas de experiencia en mantenimiento industrial que ofrecemos a nuestros clientes')}
        </motion.p>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, idx) => (
              <ServiceCard key={service.id} {...service} index={idx} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Icon name="build" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">{t('services.noResults', 'No hay servicios disponibles')}</p>
          </div>
        )}
      </div>
    </section>
  )
}
