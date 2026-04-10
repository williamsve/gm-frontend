import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { motion } from 'framer-motion'
import { useTranslation } from '../lib/i18n'
import Icon from '../components/Icon'

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
}

export default function PoliticaPrivacidad() {
  const { t } = useTranslation()
  
  // Get company domain for interpolation
  const companyDomain = t('footer.companyDomain', 'globalmantenimiento.site')
  const email = t('privacyPolicy.contactInfo.email', 'info@globalmantenimiento.site')
  const phone = t('privacyPolicy.contactInfo.phone', '+58 412-456-7890')
  const address = t('privacyPolicy.contactInfo.address', 'Caracas, Venezuela')

  // Build sections from i18n with interpolation
  const sections = [
    {
      id: 'introduction',
      title: t('privacyPolicy.sections.introduction.title'),
      content: t('privacyPolicy.sections.introduction.content').replace('{{companyDomain}}', companyDomain)
    },
    {
      id: 'informationCollected',
      title: t('privacyPolicy.sections.informationCollected.title'),
      content: t('privacyPolicy.sections.informationCollected.content')
    },
    {
      id: 'useOfInformation',
      title: t('privacyPolicy.sections.useOfInformation.title'),
      content: t('privacyPolicy.sections.useOfInformation.content')
    },
    {
      id: 'cookies',
      title: t('privacyPolicy.sections.cookies.title'),
      content: t('privacyPolicy.sections.cookies.content')
    },
    {
      id: 'thirdPartyServices',
      title: t('privacyPolicy.sections.thirdPartyServices.title'),
      content: t('privacyPolicy.sections.thirdPartyServices.content')
    },
    {
      id: 'dataProtection',
      title: t('privacyPolicy.sections.dataProtection.title'),
      content: t('privacyPolicy.sections.dataProtection.content')
    },
    {
      id: 'userRights',
      title: t('privacyPolicy.sections.userRights.title'),
      content: t('privacyPolicy.sections.userRights.content')
    },
    {
      id: 'childrenPrivacy',
      title: t('privacyPolicy.sections.childrenPrivacy.title'),
      content: t('privacyPolicy.sections.childrenPrivacy.content')
    },
    {
      id: 'policyChanges',
      title: t('privacyPolicy.sections.policyChanges.title'),
      content: t('privacyPolicy.sections.policyChanges.content')
    },
    {
      id: 'contact',
      title: t('privacyPolicy.sections.contact.title'),
      content: t('privacyPolicy.sections.contact.content')
        .replace('{{email}}', email)
        .replace('{{phone}}', phone)
        .replace('{{address}}', address)
    }
  ]

  return (
    <>
      <Head>
        <title>{t('privacyPolicy.title')} - Global Mantenimiento</title>
        <meta name="description" content={`${t('privacyPolicy.title')} de Global Mantenimiento C.A. Conozca cómo protegemos su información en ${companyDomain}`} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://globalmantenimiento.site/politica-privacidad" />
      </Head>

      <Header />

      <motion.main
        className="min-h-screen bg-gray-50"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        {/* Hero Section */}
        <motion.section 
          className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-20"
          variants={itemVariants}
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center mb-6">
                <Icon name="shield" className="w-12 h-12 text-yellow-500 mr-3" />
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  {t('privacyPolicy.title')}
                </h1>
              </div>
              <p className="text-xl text-gray-300">
                {t('privacyPolicy.subtitle')}
              </p>
              <p className="text-gray-400 mt-4">
                {t('privacyPolicy.lastUpdate')}: {t('privacyPolicy.date')}
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Content Section */}
        <motion.section className="py-16" variants={itemVariants}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  className="bg-white rounded-lg shadow-md mb-8 overflow-hidden"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <div className="p-6 md:p-8">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-gray-900 font-bold">{index + 1}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {section.title}
                      </h2>
                    </div>
                    <div className="pl-14 prose prose-gray max-w-none">
                      {section.content.split('\n\n').map((paragraph, paraIndex) => (
                        <p key={paraIndex} className="text-gray-700 leading-relaxed mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Contact CTA Section */}
        <motion.section 
          className="bg-gray-100 py-16"
          variants={itemVariants}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center mb-6">
                <Icon name="mail" className="w-8 h-8 text-yellow-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('privacyPolicy.questions')}
                </h2>
              </div>
              <p className="text-gray-600 mb-8">
                {t('privacyPolicy.contactMessage')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href={`mailto:${email}`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors"
                >
                  <Icon name="mail" className="w-5 h-5 mr-2" />
                  {email}
                </a>
                <a 
                  href={`tel:${phone}`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                >
                  <Icon name="phone" className="w-5 h-5 mr-2" />
                  {phone}
                </a>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.main>

      <Footer />
    </>
  )
}