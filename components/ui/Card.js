export default function Card({ children, className = '', style = {}, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-neutral-200 ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  )
}
