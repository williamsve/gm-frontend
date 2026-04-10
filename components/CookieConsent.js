import { useState, useEffect } from 'react'
import { useTranslation } from '../lib/i18n'
import { motion, AnimatePresence } from 'framer-motion'

export default function CookieConsent() {
  const { t } = useTranslation()
  const [showBanner, setShowBanner] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => {
        setShowBanner(true)
        setTimeout(() => setIsVisible(true), 100)
      }, 1500)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setIsVisible(false)
    setTimeout(() => setShowBanner(false), 300)
  }

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected')
    setIsVisible(false)
    setTimeout(() => setShowBanner(false), 300)
  }

  if (!showBanner) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-700"
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {t('cookieBanner.title')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {t('cookieBanner.description')}
                <a 
                  href="/privacy" 
                  className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                >
                  {t('cookieBanner.privacyPolicy')}
                </a>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleReject}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {t('common.reject')}
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                {t('common.accept')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}