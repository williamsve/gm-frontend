import { HiStar, HiChat } from 'react-icons/hi'
import StatusBadge from './StatusBadge'
import ActionButton from './ActionButton'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} de 5 estrellas`}>
      {[...Array(5)].map((_, index) => (
        <HiStar
          key={index}
          size={16}
          className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export default function TestimonialAdminCard({ 
  testimonial,
  onApprove,
  onReject,
  onEdit,
  onDelete,
  onView,
  className = '' 
}) {
  const isPending = testimonial.estado === 'pendiente'

  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow ${
      isPending ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
    } ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
          {testimonial.avatar}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">{testimonial.nombre}</h3>
                <StatusBadge status={testimonial.estado} />
              </div>
              <p className="text-sm text-gray-600">{testimonial.empresa}</p>
            </div>
            <StarRating rating={testimonial.rating} />
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <HiChat className="text-gray-400" size={16} aria-hidden="true" />
            <span className="text-sm text-gray-500">{testimonial.fecha}</span>
          </div>
          
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            &ldquo;{testimonial.contenido}&rdquo;
          </p>
          
          <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
            {isPending ? (
              <>
                {onApprove && (
                  <ActionButton 
                    variant="approve" 
                    onClick={() => onApprove(testimonial)}
                    label="Aprobar"
                  />
                )}
                {onReject && (
                  <ActionButton 
                    variant="reject" 
                    onClick={() => onReject(testimonial)}
                    label="Rechazar"
                  />
                )}
              </>
            ) : (
              <>
                {onView && (
                  <ActionButton variant="view" onClick={() => onView(testimonial)} />
                )}
                {onEdit && (
                  <ActionButton variant="edit" onClick={() => onEdit(testimonial)} />
                )}
                {onDelete && (
                  <ActionButton variant="delete" onClick={() => onDelete(testimonial)} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
