export default function Card({ children, className = '', style = {}, ...props }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 ${className}`} style={style} {...props}>
      {children}
    </div>
  )
}
