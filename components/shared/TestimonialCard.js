import { motion } from 'framer-motion'
import Icon from '../Icon'
import Revealer from '../Revealer'

function StarRating({ rating }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: rating }).map((_, i) => (
        <Icon key={i} name="star" className="w-5 h-5 text-yellow-400" />
      ))}
    </div>
  )
}

export default function TestimonialCard({ testimonial, index }) {
  return (
    <Revealer delay={index * 0.1}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-100"
      >
        <div className="flex justify-between items-start mb-4">
          <StarRating rating={testimonial.rating} />
          <Icon name="formatQuote" className="text-blue-100 w-8 h-8" />
        </div>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          "{testimonial.content}"
        </p>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {testimonial.name.charAt(0)}
            </span>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
            <p className="text-sm text-gray-600">{testimonial.position}</p>
            <p className="text-sm text-blue-600">{testimonial.company}</p>
            {testimonial.email && (
              <p className="text-sm text-gray-500 mt-1">
                <Icon name="email" className="w-3 h-3 inline mr-1" />
                {testimonial.email}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </Revealer>
  )
}
