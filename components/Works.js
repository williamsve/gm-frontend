import { motion, useReducedMotion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Icon from './Icon'
import Revealer from './Revealer'
import ProjectModal from './ProjectModal'
import { useTranslation } from '../lib/i18n'
import trabajosData from '../lib/trabajosData'

/**
 * Transforma URLs de imágenes del formato /uploads/xxx al formato absoluto
 * para que Next.js pueda servirlas correctamente
 * @param {string} url - URL relativa de la imagen
 * @returns {string} - URL absoluta
 */
export function transformImageUrl(url) {
  if (!url) return url
  // If it's an absolute URL, return the pathname (to make it relative)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      return new URL(url).pathname
    } catch {
      return url
    }
  }
  // Otherwise, return the URL as is
  return url
}

function ProjectCard({ project, index, onClick, viewProjectLabel }) {
  const [ref, inView] = useInView({ rootMargin: '0px 0px 100px 0px' })

  // Get the first image from images array, or fallback to placeholder
  const getImageSrc = () => {
    const firstImage = project.images && project.images.length > 0 && project.images[0]
    if (firstImage && typeof firstImage === 'string' && firstImage.trim() !== '') {
      return transformImageUrl(firstImage)
    }
    return '/placeholder.jpg'
  }

  return (
    <Revealer delay={index * 0.1}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -8 }}
        className="group cursor-pointer"
        onClick={() => onClick(project)}
      >
        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg mb-5 group-hover:shadow-2xl transition-all duration-300">
          {inView ? (
            <Image
              src={getImageSrc()}
              alt={project.title}
              fill
              style={{ objectFit: 'cover' }}
              className="group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gray-100" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white font-semibold flex items-center gap-2 px-4 py-1 bg-black/30 rounded-full backdrop-blur-sm">
              <Icon name="visibility" className="text-xl" />
              {viewProjectLabel}
            </span>
          </div>
        </div>
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors px-1">{project.title}</h3>
      </motion.div>
    </Revealer>
  )
}

function StatCard({ value, label, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">{value}</div>
      <div className="text-blue-100 text-sm md:text-base font-medium">{label}</div>
    </motion.div>
  )
}

export default function Works() {
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load projects from the static data
  useEffect(() => {
    setLoading(true)
    setProjects(trabajosData)
    setLoading(false)
  }, [])

  // Helper function to transform image URLs in a project object
  const transformProjectImages = (project) => {
    if (!project) return project
    
    // Create a copy of the project to avoid mutating the original
    const transformedProject = { ...project }
    
    // Transform images array if it exists
    if (transformedProject.images && Array.isArray(transformedProject.images)) {
      transformedProject.images = transformedProject.images.map(transformImageUrl)
    }
    
    return transformedProject
  }

  const handleProjectClick = (project) => {
    setSelectedProject(transformProjectImages(project))
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  const stats = [
    { value: '15+', label: t('works.yearsExperience', 'Años de Experiencia') },
    { value: '500+', label: t('works.projectsCompleted', 'Proyectos Completados') },
    { value: '98%', label: t('works.satisfiedClients', 'Clientes Satisfechos') }
  ]

  if (loading) {
    return (
      <section id="trabajos" className="scroll-mt-16 py-14 bg-white">
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
      <section id="trabajos" className="scroll-mt-16 py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <Icon name="work" className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <p className="text-red-500">{t('services.error', 'Error al cargar los trabajos')}</p>
            <p className="text-gray-600 text-sm mt-2">{t('common.retry', 'Por favor, intenta de nuevo más tarde')}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="trabajos" className="scroll-mt-16 py-14 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center text-neutral-800 mb-4"
        >
          {t('works.title', 'Algunos trabajos realizados')}
        </motion.h2>
        <p className="text-neutral-600 text-center max-w-3xl mx-auto mb-16 text-lg leading-relaxed">
          {t('works.subtitle', 'Global Mantenimiento C.A. ha ejecutado diversos trabajos para empresas del sector industrial')}
        </p>

        {/* Sección de servicios realizados */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="mb-16"
         >
           <h3 className="text-2xl font-bold text-center text-neutral-800 mb-10">
             {t('works.servicesPerformed', 'Servicios realizados:')}
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {projects.map((project, idx) => (
               <motion.div
                 key={project.id}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: idx * 0.1 }}
                 className="group cursor-pointer"
                 onClick={() => handleProjectClick(project)}
               >
                 <div className="relative w-full h-40 rounded-lg overflow-hidden mb-3">
                   <Image
                     src={transformImageUrl(project.images?.[0])}
                     alt={project.title}
                     fill
                     style={{ objectFit: 'cover' }}
                     className="group-hover:scale-105 transition-transform duration-300"
                   />
                 </div>
                 <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{project.title}</h4>
               </motion.div>
             ))}
           </div>
         </motion.div>

        {/* Sección de clientes destacados */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-center text-neutral-800 mb-10">
            {t('works.clients', 'Clientes destacados:')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(Array.isArray(t('works.clientsList')) ? t('works.clientsList') : [
              'Fundición del Centro, C.A.',
              'DH Vital, C.A.',
              'Mamusa Industrial, C.A.',
              'Instalaciones Mecánicas JLC, C.A.',
              'Gleason, C.A.',
              'Windoor House, C.A.',
              'Embotelladora El Samán'
            ]).map((client, idx) => (
              <motion.div
                key={`client-${idx}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-5 text-center shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <p className="text-gray-800 font-medium text-sm md:text-base">{client}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-6 mb-16 -mx-2 md:-mx-4 px-2 md:px-4 py-8 md:py-10 bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl shadow-xl">
          {stats.map((stat, idx) => (
            <StatCard key={`stat-${idx}`} {...stat} index={idx} />
          ))}
        </div>
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </section>
  )
}
