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
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-neutral-900 shadow-2xl border-t border-neutral-200 dark:border-neutral-700"
          role="region"
          aria-label="Consentimiento de cookies"
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                {t('cookieBanner.title')}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {t('cookieBanner.description')}
                <a
                  href="/privacy"
                  className="text-primary-600 dark:text-primary-400 hover:underline font-medium ml-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded"
                >
                  {t('cookieBanner.privacyPolicy')}
                </a>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 min-w-[200px]">
              <button
                onClick={handleReject}
                className="px-5 py-2.5 text-sm font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl transition-colors min-h-[44px]"
              >
                {t('common.reject')}
              </button>
              <button
                onClick={handleAccept}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-md hover:shadow-lg min-h-[44px]"
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