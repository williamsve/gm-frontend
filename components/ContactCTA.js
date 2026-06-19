import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { motion } from 'framer-motion'
import Icon from './Icon'
import CTAButton from './ui/CTAButton'
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
    <div className="lg:w-2/5 mb-8 lg:mb-0 bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-white/20">
      <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">{t('contact.whatsapp', 'Contacta por WhatsApp')}</h3>
      <p className="mb-6 text-blue-100 leading-relaxed">{t('contact.whatsappDesc', 'Escanea el QR o pulsa el botón para abrir el chat de WhatsApp. Funciona en móvil y en equipos mediante WhatsApp Web.')}</p>

      <div className="flex flex-col sm:flex-row items-center sm:space-x-6 gap-6">
        {qrSmall ? (
          <button
            aria-label={t('common.view', 'Ver código QR para WhatsApp')}
            onClick={() => setOpen(true)}
            className="p-0 bg-transparent border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-transform hover:scale-105"
          >
            <img
              src={qrSmall}
              alt="Código QR para WhatsApp Global Mantenimiento"
              className="w-32 h-32 rounded-lg shadow-lg border-2 border-white/30"
            />
          </button>
        ) : (
          <div className="w-32 h-32 bg-white/10 rounded-lg flex items-center justify-center text-white/50">Cargando...</div>
        )}

        <div className="flex-1 min-w-0 text-center sm:text-left">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-[#25D366] text-white px-6 py-4 rounded-xl font-bold hover:bg-[#20BD5A] transition-all shadow-md hover:shadow-lg whitespace-nowrap w-full sm:w-auto min-h-[48px]"
            aria-label="Abrir chat de WhatsApp con Global Mantenimiento"
          >
            <span className="mr-3"><Icon name="whatsapp" className="w-6 h-6 text-white" /></span>
            {t('contact.openWhatsapp', 'Abrir WhatsApp')}
          </a>

          <div className="mt-4 text-blue-100 text-sm">
            <p className="text-xs text-blue-200/70 italic flex items-center justify-center sm:justify-start">
              <Icon name="clock" className="w-4 h-4 mr-2" aria-hidden="true" />
              Respuesta en menos de 1 hora
            </p>
          </div>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="qr-modal-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all"
            onClick={() => { setOpen(false); onClose(); }}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl p-6 md:p-8 shadow-2xl max-w-md w-full mx-4">
            {/* Botón cerrar */}
            <button
              aria-label={t('common.close', 'Cerrar modal')}
              onClick={() => { setOpen(false); onClose(); }}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600 transition-colors p-2 rounded-full hover:bg-neutral-100 min-h-[44px] min-w-[44px]"
            >
              <Icon name="close" className="w-6 h-6" />
            </button>

            {/* Contenido */}
            <div className="text-center">
              <h4 id="qr-modal-title" className="text-xl md:text-2xl font-bold mb-2 text-neutral-900">
                {t('contact.scanToOpen', 'Escanea con tu teléfono')}
              </h4>
              <p className="text-neutral-600 mb-6">
                {t('contact.scanDesc', 'Abre WhatsApp y escanea el código')}
              </p>

              {qrLarge ? (
                <div className="flex flex-col items-center">
                  <div className="p-2 bg-white rounded-xl shadow-lg border-2 border-neutral-100">
                    <img
                      src={qrLarge}
                      alt="Código QR para WhatsApp Global Mantenimiento"
                      className="w-64 h-64 rounded-lg"
                    />
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <CTAButton
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="primary"
                      className="w-full sm:w-auto"
                      aria-label="Abrir chat de WhatsApp con Global Mantenimiento"
                    >
                      <Icon name="whatsapp" />
                      {t('contact.openWhatsapp', 'Abrir WhatsApp')}
                    </CTAButton>
                    <button
                      onClick={() => downloadDataUrl(qrLarge)}
                      className="inline-flex items-center justify-center bg-neutral-100 text-neutral-700 px-6 py-3 rounded-xl hover:bg-neutral-200 transition-colors font-medium min-h-[48px]"
                      aria-label="Descargar código QR"
                    >
                      <Icon name="download" className="w-5 h-5 mr-2" />
                      {t('contact.downloadQR', 'Descargar QR')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-neutral-500">
                  {t('common.loading', 'Cargando...')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
