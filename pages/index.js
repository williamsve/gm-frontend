import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Works from '../components/Works'
import Testimonials from '../components/Testimonials'
import ContactCTA from '../components/ContactCTA'
import Icon from '../components/Icon'
import quienesImg from '../public/i (4).jpeg'
import img5 from '../public/i (5).jpeg'
import img1 from '../public/i (1).jpeg'
import img2 from '../public/i (2).jpeg'
import img3 from '../public/i (3).jpeg'
import Image from 'next/image'
import Revealer from '../components/Revealer'
import useInView from '../lib/useInView'
import { motion } from 'framer-motion'
import { useTranslation } from '../lib/i18n'

// Extended translations for "Quiénes Somos" section in all languages
const quienesTranslations = {
  es: {
    title: 'Quiénes Somos',
    companyName: 'Global Mantenimiento C.A.',
    description: 'Somos una empresa especializada en servicios de mantenimiento industrial y ejecución de proyectos, comprometida con la calidad, los plazos establecidos y los precios justos.',
    constants: 'Constantes, eficientes y responsables',
    safety: 'Criterios de seguridad garantizados',
    social: 'Contribuimos al desarrollo social',
    deadlines: 'Cumplimiento de plazos establecidos',
    philosophy: 'Nuestra Filosofía',
    philosophyText: 'Compromiso con la excelencia, transparencia y responsabilidad en cada proyecto. Creemos en relaciones duraderas construidas sobre la confianza mutua y la entrega de resultados que superan expectativas.',
    mission: 'Nuestra Misión',
    missionText: 'Prestar servicios de mantenimiento industrial y ejecución de proyectos con los más altos estándares de calidad, seguridad y puntualidad, contribuyendo al crecimiento sostenible de nuestros clientes.',
    vision: 'Nuestra Visión',
    visionText: 'Ser reconocidos como la empresa de referencia en mantenimiento industrial en Venezuela, innovando constantemente y formando profesionales altamente competitivos.'
  },
  en: {
    title: 'About Us',
    companyName: 'Global Mantenimiento C.A.',
    description: 'We are a company specialized in industrial maintenance services and project execution, committed to quality, deadlines and fair prices.',
    constants: 'Constant, efficient and responsible',
    safety: 'Guaranteed safety criteria',
    social: 'We contribute to social development',
    deadlines: 'Meeting established deadlines',
    philosophy: 'Our Philosophy',
    philosophyText: 'Commitment to excellence, transparency and responsibility in every project. We believe in lasting relationships built on mutual trust and delivery of results that exceed expectations.',
    mission: 'Our Mission',
    missionText: 'To provide industrial maintenance services and project execution with the highest standards of quality, safety and punctuality, contributing to the sustainable growth of our clients.',
    vision: 'Our Vision',
    visionText: 'To be recognized as the reference company in industrial maintenance in Venezuela, constantly innovating and training highly competitive professionals.'
  },
  pt: {
    title: 'Quem Somos',
    companyName: 'Global Mantenimiento C.A.',
    description: 'Somos uma empresa especializada em serviços de manutenção industrial e execução de projetos, comprometidos com qualidade, prazos e preços justos.',
    constants: 'Constantes, eficientes e responsáveis',
    safety: 'Critérios de segurança garantidos',
    social: 'Contribuimos para o desenvolvimento social',
    deadlines: 'Cumprimento dos prazos estabelecidos',
    philosophy: 'Nossa Filosofia',
    philosophyText: 'Compromisso com a excelência, transparência e responsabilidade em cada projeto. Acreditamos em relacionamentos duradouros construídos sobre confiança mútua e entrega de resultados que superam expectativas.',
    mission: 'Nossa Missão',
    missionText: 'Prestar serviços de manutenção industrial e execução de projetos com os mais altos padrões de qualidade, segurança e pontualidade, contribuindo para o crescimento sustentável de nossos clientes.',
    vision: 'Nossa Visão',
    visionText: 'Ser reconhecida como a empresa de referência em manutenção industrial na Venezuela, inovando constantemente e formando profissionais altamente competitivos.'
  },
  fr: {
    title: 'À Propos',
    companyName: 'Global Mantenimiento C.A.',
    description: 'Nous sommes une entreprise spécialisée dans les services de maintenance industrielle et l\'exécution de projets, engagés envers la qualité, les délais et les prix justes.',
    constants: 'Constants, efficaces et responsables',
    safety: 'Critères de sécurité garantis',
    social: 'Nous contribuons au développement social',
    deadlines: 'Respect des délais établis',
    philosophy: 'Notre Philosophie',
    philosophyText: 'Engagement envers l\'excellence, la transparence et la responsabilité dans chaque projet. Nous croyons aux relations durables fondées sur la confiance mutuelle et la livraison de résultats qui dépassent les attentes.',
    mission: 'Notre Mission',
    missionText: 'Fournir des services de maintenance industrielle et exécution de projets avec les plus hauts standards de qualité, sécurité et ponctualité, contribuant à la croissance durable de nos clients.',
    vision: 'Notre Vision',
    visionText: 'Être reconnue comme l\'entreprise de référence en maintenance industrielle au Venezuela, innovuant constamment et formant des professionnels hautement compétitifs.'
  },
  de: {
    title: 'Über Uns',
    companyName: 'Global Mantenimiento C.A.',
    description: 'Wir sind ein Unternehmen, das sich auf industrielle Wartungsdienstleistungen und Projektausführung spezialisiert hat, verpflichtet zu Qualität, Fristen und fairen Preisen.',
    constants: 'Konstant, effizient und verantwortungsbewusst',
    safety: 'Garantierte Sicherheitskriterien',
    social: 'Wir tragen zur sozialen Entwicklung bei',
    deadlines: 'Einhaltung vereinbarter Fristen',
    philosophy: 'Unsere Philosophie',
    philosophyText: 'Engagement für Exzellenz, Transparenz und Verantwortung in jedem Projekt. Wir glauben an dauerhafte Beziehungen, die auf gegenseitigem Vertrauen und der Lieferung von Ergebnissen basieren, die die Erwartungen übertreffen.',
    mission: 'Unsere Mission',
    missionText: 'Industrielle Wartungsdienstleistungen und Projektausführung mit den höchsten Qualitäts-, Sicherheits- und Pünktlichkeitsstandards zu erbringen, die zum nachhaltigen Wachstum unserer Kunden beitragen.',
    vision: 'Unsere Vision',
    visionText: 'Als das Referenzunternehmen für industrielle Wartung in Venezuela anerkannt werden, ständig innovieren und hochkompetente Fachkräfte ausbilden.'
  },
  it: {
    title: 'Chi Siamo',
    companyName: 'Global Mantenimiento C.A.',
    description: 'Siamo un\'azienda specializzata in servizi di manutenzione industriale ed esecuzione di progetti, impegnati per qualità, scadenze e prezzi equi.',
    constants: 'Costanti, efficienti e responsabili',
    safety: 'Criteri di sicurezza garantiti',
    social: 'Contribuiamo allo sviluppo sociale',
    deadlines: 'Rispetto delle scadenze stabilite',
    philosophy: 'La Nostra Filosofia',
    philosophyText: 'Impegno per l\'eccellenza, la trasparenza e la responsabilità in ogni progetto. Crediamo in relazioni durature costruite sulla fiducia reciproca e sulla consegna di risultati che superano le aspettative.',
    mission: 'La Nostra Missione',
    missionText: 'Fornire servizi di manutenzione industriale ed esecuzione di progetti con i più alti standard di qualità, sicurezza e puntualità, contribuendo alla crescita sostenibile dei nostri clienti.',
    vision: 'La Nostra Visione',
    visionText: 'Essere riconosciuti come l\'azienda di riferimento per la manutenzione industriale in Venezuela, innovando costantemente e formando professionisti altamente competitivi.'
  }
}

// Contact section translations
const contactTranslations = {
  es: { title: 'Contáctanos', description: 'Especialistas en mantenimiento industrial y ejecución de proyectos.', phone: 'Teléfono' },
  en: { title: 'Contact Us', description: 'Specialists in industrial maintenance and project execution.', phone: 'Phone' },
  pt: { title: 'Fale Conosco', description: 'Especialistas em manutenção industrial e execução de projetos.', phone: 'Telefone' },
  fr: { title: 'Contactez-nous', description: 'Spécialistes en maintenance industrielle et exécution de projets.', phone: 'Téléphone' },
  de: { title: 'Kontakt', description: 'Spezialisten für industrielle Wartung und Projektausführung.', phone: 'Telefon' },
  it: { title: 'Contattaci', description: 'Specialisti in manutenzione industriale ed esecuzione di progetti.', phone: 'Telefono' }
}

export default function Home() {
  const { locale, t } = useTranslation()
  const quienes = quienesTranslations[locale] || quienesTranslations.es
  const contact = contactTranslations[locale] || contactTranslations.es

  // Get navigation translations
  const navHome = t('nav.home', 'Inicio')
  const navAbout = t('nav.about', 'Quiénes Somos')
  const navServices = t('nav.services', 'Servicios')
  const navWorks = t('nav.works', 'Trabajos')
  const navContact = t('nav.contact', 'Contacto')

  const translations = {
    nav: {
      home: navHome,
      about: navAbout,
      services: navServices,
      works: navWorks,
      contact: navContact
    }
  }

  return (
    <>
      <Head>
        <title>Global Mantenimiento C.A. - Especialistas en Mantenimiento Industrial</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <meta name="description" content="Global Mantenimiento C.A. - Especialistas en servicios de mantenimiento industrial y ejecución de proyectos en Venezuela." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <div id="main-content" className="min-h-screen bg-gray-50 smooth-scroll">
        <Header translations={translations} />
        <Hero />

      <section id="quienes-somos" className="scroll-mt-16 py-8 md:py-12 bg-white">
          <div className="container mx-auto px-4">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-center text-gray-800 mb-12"
            >
              {quienes.title}
            </motion.h2>

            {[
              {
                title: quienes.companyName,
                content: (
                  <>
                    <p className="text-gray-700 text-lg mb-6">
                      {quienes.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="flex items-start">
                        <Icon name="check" className="text-green-500 text-xl mr-3 mt-1" aria-hidden="true" />
                        <span className="text-gray-700">
                          {quienes.constants}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <Icon name="shield" className="text-green-500 text-xl mr-3 mt-1" aria-hidden="true" />
                        <span className="text-gray-700">
                          {quienes.safety}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <Icon name="groups" className="text-green-500 text-xl mr-3 mt-1" aria-hidden="true" />
                        <span className="text-gray-700">
                          {quienes.social}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <Icon name="clock" className="text-green-500 text-xl mr-3 mt-1" aria-hidden="true" />
                        <span className="text-gray-700">
                          {quienes.deadlines}
                        </span>
                      </div>
                    </div>
                  </>
                ),
                img: quienesImg
              },
              {
                title: quienes.philosophy,
                content: (
                  <>
                    <p className="text-gray-700 text-lg mb-6">
                      {quienes.philosophyText}
                    </p>
                  </>
                ),
                img: img5
              },
              {
                title: quienes.mission,
                content: (
                  <>
                    <p className="text-gray-700 text-lg mb-6">
                      {quienes.missionText}
                    </p>
                  </>
                ),
                img: img1
              },
              {
                title: quienes.vision,
                content: (
                  <>
                    <p className="text-gray-700 text-lg mb-6">
                      {quienes.visionText}
                    </p>
                  </>
                ),
                img: img2
              }
            ].map((block, idx) => (
              <motion.div
                key={block.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`mb-12 flex flex-col lg:flex-row items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className="lg:w-1/2 w-full lg:px-6">
                  <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
                    <h3 className="text-2xl font-bold text-blue-800 mb-6">{block.title}</h3>
                    {block.content}
                  </div>
                </div>

                <div className="lg:w-1/2 w-full mt-6 lg:mt-0">
                  <Revealer>
                    {(() => {
                      const [imgRef, imgInView] = useInView({ rootMargin: '0px 0px 200px 0px' })
                      return (
                        <div ref={imgRef} className="rounded-xl overflow-hidden border border-blue-100 relative w-full aspect-video">
                          {imgInView ? (
                            <Image src={block.img} alt={block.title} fill style={{ objectFit: 'cover' }} placeholder="blur" />
                          ) : (
                            <div aria-hidden className="w-full h-full bg-gray-100" />
                          )}
                        </div>
                      )
                    })()}
                  </Revealer>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <Services />
        <Works />
        <Testimonials />
        
        <section id="contacto" className="scroll-mt-16 py-12 md:py-20 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
          <div className="container mx-auto px-4">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-center mb-12"
            >
              {contact.title}
            </motion.h2>
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <div className="lg:w-2/5 mb-10 lg:mb-0">
                <h3 className="text-2xl font-bold mb-6">Global Mantenimiento C.A.</h3>
                <p className="mb-8 text-blue-100">
                  {contact.description}
                </p>
                <div className="space-y-5">
                  <div className="flex items-center">
                    <div className="bg-white/20 p-3 rounded-lg mr-4">
                      <Icon name="phone" className="text-xl" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium">{contact.phone}</p>
                      <p className="text-blue-100">+58 4242618663</p>
                    </div>
                  </div>
                </div>
              </div>
              <ContactCTA />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
