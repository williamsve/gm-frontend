// Utility function to get WhatsApp URL
// Add this to your project for reusable WhatsApp links

export function normalizeNumber(raw) {
  if (!raw) return ''
  return String(raw).replace(/\D+/g, '')
}

export function formatWhatsAppUrl(number, text = '') {
  const normalized = normalizeNumber(number)
  const encoded = encodeURIComponent(text)
  return `https://wa.me/${normalized}${text ? `?text=${encoded}` : ''}`
}

// Default number for Global Mantenimiento
export const DEFAULT_WHATSAPP_NUMBER = '+584242618663'

export function getDefaultWhatsAppUrl(prefillMessage = '') {
  return formatWhatsAppUrl(DEFAULT_WHATSAPP_NUMBER, prefillMessage)
}