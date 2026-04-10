import { motion } from 'framer-motion'
import Icon from './Icon'
import { useTranslation } from '../lib/i18n'

const footerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
}

export default function Footer() {
  const { t } = useTranslation()

  const quickLinks = [
    { key: 'nav.home', href: '#inicio' },
    { key: 'nav.about', href: '#quienes-somos' },
    { key: 'nav.services', href: '#servicios' },
    { key: 'nav.works', href: '#trabajos' },
    { key: 'testimonials.title', href: '#testimonios' },
    { key: 'nav.contact', href: '#contacto' }
  ]

  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={footerVariants}
        >
          <motion.div variants={itemVariants} className="mb-6 md:mb-0">
            <div className="flex items-center mb-4">
              <img 
                src="/favicon.svg" 
                alt="Global Mantenimiento" 
                className="w-16 h-16 object-contain mr-3"
              />
              <h3 className="text-xl font-bold">{t('footer.companyName', 'Global Mantenimiento C.A.')}</h3>
            </div>
            <p className="text-gray-500 max-w-md">{t('footer.companyDescription', 'Especialistas en servicios de mantenimiento industrial y ejecución de proyectos, comprometidos con la calidad, los plazos establecidos y los precios justos.')}</p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold mb-4">{t('footer.quickLinks', 'Enlaces rápidos')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <a href={link.href} className="text-gray-500 hover:text-white">
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-600">
          <p>© {new Date().getFullYear()} {t('footer.companyName', 'Global Mantenimiento C.A.')} - {t('footer.rightsReserved', 'Todos los derechos reservados.')}</p>
        </motion.div>
      </div>
    </footer>
  )
}
