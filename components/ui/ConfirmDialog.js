import { useState, useEffect, useRef, useCallback } from 'react'
import { HiExclamation } from 'react-icons/hi'

/**
 * ConfirmDialog - A reusable confirmation modal component
 * Replaces native window.confirm() with a better UX
 * 
 * @param {boolean} open - Whether the dialog is visible
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {string} confirmText - Text for confirm button (default: "Confirmar")
 * @param {string} cancelText - Text for cancel button (default: "Cancelar")
 * @param {string} confirmVariant - Variant for confirm button: "danger" | "primary" (default: "danger")
 * @param {function} onConfirm - Callback when confirm is clicked
 * @param {function} onCancel - Callback when cancel is clicked (optional)
 * @param {function} onClose - Callback when dialog is closed (ESC or outside click)
 */
export default function ConfirmDialog({
  open = false,
  title = 'Confirmar acción',
  message = '¿Estás seguro de que deseas continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
  onClose
}) {
  const [isClosing, setIsClosing] = useState(false)
  const dialogRef = useRef(null)
  const confirmButtonRef = useRef(null)
  const previousActiveElement = useRef(null)

  // Handle close animation
  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      if (onClose) onClose()
      // Restore focus to previous element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }, 200)
  }, [onClose])

  // Handle confirm
  const handleConfirm = () => {
    if (onConfirm) onConfirm()
    handleClose()
  }

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) onCancel()
    handleClose()
  }

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        e.preventDefault()
        handleClose()
      }
    }

    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, handleClose])

  // Focus trap and focus management
  useEffect(() => {
    if (open && !isClosing) {
      // Store current focused element
      previousActiveElement.current = document.activeElement
      
      // Focus the confirm button when dialog opens
      setTimeout(() => {
        if (confirmButtonRef.current) {
          confirmButtonRef.current.focus()
        }
      }, 50)
    }
  }, [open, isClosing])

  // Handle click outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  // Don't render if not open and not closing
  if (!open && !isClosing) return null

  return (
    <div 
      className={`fixed inset-0 z-50 top-0 flex items-center justify-center p-4 ${isClosing ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 -top-6 backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div 
        ref={dialogRef}
        className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl transform transition-all duration-200 ${isClosing ? 'scale-95 translate-y-4' : 'scale-100 translate-y-0'}`}
      >
        {/* Icon */}
        <div className="flex justify-center pt-6">
          <div className={`p-3 rounded-full ${confirmVariant === 'danger' ? 'bg-red-100' : 'bg-blue-100'}`}>
            <HiExclamation 
              className={`w-8 h-8 ${confirmVariant === 'danger' ? 'text-red-600' : 'text-blue-600'}`} 
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <h2 
            id="confirm-dialog-title" 
            className="text-xl font-semibold text-gray-900 mb-2"
          >
            {title}
          </h2>
          <p 
            id="confirm-dialog-description" 
            className="text-gray-600"
          >
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            ref={confirmButtonRef}
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              confirmVariant === 'danger'
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
          >
            {confirmText}
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper function to use ConfirmDialog imperatively (like window.confirm)
// Returns a promise that resolves to true/false
export function useConfirm() {
  const [dialogState, setDialogState] = useState({
    open: false,
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    confirmVariant: 'danger'
  })
  const resolverRef = useRef(null)

  const confirm = useCallback((options) => {
    const {
      title = 'Confirmar acción',
      message = '¿Estás seguro de que deseas continuar?',
      confirmText = 'Confirmar',
      cancelText = 'Cancelar',
      confirmVariant = 'danger'
    } = options

    setDialogState({
      open: true,
      title,
      message,
      confirmText,
      cancelText,
      confirmVariant
    })

    return new Promise((resolve) => {
      resolverRef.current = resolve
    })
  }, [])

  const handleConfirm = () => {
    if (resolverRef.current) {
      resolverRef.current(true)
      resolverRef.current = null
    }
  }

  const handleClose = () => {
    if (resolverRef.current) {
      resolverRef.current(false)
      resolverRef.current = null
    }
    setDialogState(prev => ({ ...prev, open: false }))
  }

  const ConfirmDialogComponent = useCallback(({ children }) => (
    <>
      {children}
      <ConfirmDialog
        open={dialogState.open}
        title={dialogState.title}
        message={dialogState.message}
        confirmText={dialogState.confirmText}
        cancelText={dialogState.cancelText}
        confirmVariant={dialogState.confirmVariant}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    </>
  ), [dialogState])

  return { confirm, ConfirmDialogComponent }
}