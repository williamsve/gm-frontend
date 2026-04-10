import { HiExclamationCircle } from 'react-icons/hi'
import EstadisticasVisitas from './EstadisticasVisitas'
import { SectionAnimation } from '../../ui'

export default function Dashboard() {
  return (
    <SectionAnimation>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Bienvenido al panel de administración</p>
        </div>

        {/* Estadísticas de visitas */}
        <EstadisticasVisitas />
      </div>
    </SectionAnimation>
  )
}
