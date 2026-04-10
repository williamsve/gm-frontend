import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'
import Icon from './Icon'
import Revealer from './Revealer'
import useInView from '../lib/useInView'
import ProjectModal from './ProjectModal'
import { useTrabajos } from '../lib/useApi'
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
  
  // Transformar /uploads/... a http://localhost:3000/uploads/...
  // El rewrite en next.config.js se encarga de redirigir a localhost:8000
  if (url.startsWith('/uploads/')) {
    return url
  }
  
  return url
}

function ProjectCard({ project, index, onClick, viewProjectLabel }) {
  const [ref, inView] = useInView({ rootMargin: '0px 0px 100px 0px' })

  return (
    <Revealer delay={index * 0.1}>
      <motion.div 
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className="group cursor-pointer"
        onClick={() => onClick(project)}
      >
        <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg mb-4">
          {inView ? (
            <Image 
              src={project.img || '/placeholder.jpg'} 
              alt={project.title} 
              fill 
              style={{ objectFit: 'cover' }}
              className="group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gray-100" />
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white font-medium flex items-center gap-2">
              <Icon name="visibility" className="text-xl" />
              {viewProjectLabel}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-sm text-blue-600 font-medium">{project.category}</span>
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors">{project.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
        </div>
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
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">{value}</div>
      <div className="text-blue-200 text-sm md:text-base">{label}</div>
    </motion.div>
  )
}

export default function Works() {
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const { data: trabajosData, isLoading: loadingTrabajos, error: errorTrabajos } = useTrabajos()

  const loading = loadingTrabajos
  const error = errorTrabajos

  const projects = trabajosData?.items ? trabajosData.items.map(trabajo => ({
    id: trabajo.id,
    title: trabajo.nombre,
    category: trabajo.tipo_servicio || 'Trabajo',
    description: trabajo.descripcion,
    details: trabajo.descripcion,
    img: trabajo.imagenes && trabajo.imagenes.length > 0 
      ? transformImageUrl(trabajo.imagenes[0]) 
      : '/placeholder.jpg',
    images: trabajo.imagenes ? trabajo.imagenes.map(transformImageUrl) : []
  })) : []

  const handleProjectClick = (project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

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

  const stats = [
    { value: '15+', label: t('works.yearsExperience', 'Años de Experiencia') },
    { value: '500+', label: t('works.projectsCompleted', 'Proyectos Completados') },
    { value: '98%', label: t('works.satisfiedClients', 'Clientes Satisfechos') }
  ]

  return (
    <section id="trabajos" className="scroll-mt-16 py-14 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          className="text-3xl font-bold text-center text-gray-800 mb-4"
        >
          {t('works.title', 'Proyectos Realizados')}
        </motion.h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
          {t('works.subtitle', 'Proyectos realizados para diferentes empresas del sector industrial')}
        </p>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
            {projects.map((project, idx) => (
              <ProjectCard key={project.id} project={project} index={idx} onClick={handleProjectClick} viewProjectLabel={t('works.viewProject', 'Ver Proyecto')} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-16">
            <Icon name="work" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">{t('works.noProjects', 'No hay proyectos disponibles')}</p>
          </div>
        )}

        <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-6 mb-16 -mx-2 md:-mx-4 px-2 md:px-4 py-6 md:py-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl">
          {stats.map((stat, idx) => (
            <StatCard key={stat.label} {...stat} index={idx} />
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
