import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { motion } from 'framer-motion'
import Icon from './Icon'
import { formatWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER } from '../lib/whatsapp'
import { useTranslation } from '../lib/i18n'

export default function ContactCTA({ prefillMessage = 'Hola, estoy interesado en sus servicios.', isOpen = false, onClose = () => {} }) {
  const { t } = useTranslation()
  const phoneRaw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER
  const url = formatWhatsAppUrl(phoneRaw, prefillMessage)

  const [qrSmall, setQrSmall] = useState(null)
  const [qrLarge, setQrLarge] = useState(null)
  const [open, setOpen] = useState(isOpen)

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  useEffect(() => {
    let mounted = true
    async function gen() {
      try {
        const s = await QRCode.toDataURL(url, { margin: 1, width: 300 })
        const l = await QRCode.toDataURL(url, { margin: 1, width: 600 })
        if (mounted) {
          setQrSmall(s)
          setQrLarge(l)
        }
      } catch (e) {
        console.error('QR generation error', e)
      }
    }
    gen()
    return () => { mounted = false }
  }, [url])

  function downloadDataUrl(dataUrl, filename = 'qr-whatsapp.png') {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className="lg:w-2/5 mb-8 lg:mb-0 bg-white/5 rounded-xl p-4 md:p-6 shadow-lg">
      <h3 className="text-2xl font-bold mb-3">{t('contact.whatsapp', 'Contacta por WhatsApp')}</h3>
      <p className="mb-4 text-sm">{t('contact.whatsappDesc', 'Escanea el QR o pulsa el botón para abrir el chat de WhatsApp. Funciona en móvil y en equipos mediante WhatsApp Web.')}</p>

      <div className="flex flex-col sm:flex-row items-center sm:space-x-4 gap-4 sm:gap-0">
        {qrSmall ? (
          <button aria-label={t('common.view', 'Ver QR')} onClick={() => setOpen(true)} className="p-0 bg-transparent border-none rounded-md focus:outline-none">
            <img src={qrSmall} alt="QR WhatsApp Global Mantenimiento" className="w-28 h-28 rounded-md shadow-md" />
          </button>
        ) : (
          <div className="w-28 h-28 bg-white/10 rounded-md flex items-center justify-center">...</div>
        )}

        <div className="flex-1 min-w-0 text-center sm:text-left">
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition whitespace-nowrap w-full sm:w-auto">
            <span className="mr-2"><Icon name="whatsapp" className="w-5 h-5 text-white" /></span>
            {t('contact.openWhatsapp', 'Abrir WhatsApp')}
          </a>

          <div className="mt-3 text-blue-100 text-sm">
            <div className="flex items-center">
              <span className="mr-2"><Icon name="envelope" className="w-4 h-4 text-blue-100" /></span>
              <span>info@globalmantenimiento.site</span>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0  bg-black/50 backdrop-blur-sm transition-all" onClick={() => { setOpen(false); onClose(); }} />
          <div className="relative bg-white rounded-2xl p-6 shadow-xl max-w-md w-full mx-4">
            <button aria-label={t('common.close', 'Cerrar')} onClick={() => { setOpen(false); onClose(); }} className="absolute right-4 top-3 text-gray-600 hover:text-gray-900">✕</button>
            <h4 className="text-lg font-bold mb-4 text-black text-center">{t('contact.scanToOpen', 'Escanea con tu teléfono para abrir WhatsApp')}</h4>
            {qrLarge ? (
              <div className="flex flex-col items-center">
                <img src={qrLarge} alt="QR grande WhatsApp" className="w-56 h-56 rounded-md shadow-md" />
                <div className="mt-4 flex space-x-3">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition whitespace-nowrap">
                    <Icon name="whatsapp" className="w-4 h-4 mr-2 text-white" />{t('contact.openWhatsapp', 'Abrir WhatsApp')}
                  </a>
                  <button onClick={() => downloadDataUrl(qrLarge)} className="inline-flex items-center bg-gray-200 text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-300 transition whitespace-nowrap">
                    {t('contact.downloadQR', 'Descargar QR')}
                  </button>
                </div>
              </div>
            ) : (
              <div>{t('common.loading', 'Cargando...')}</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
