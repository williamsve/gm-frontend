import { useState, useEffect } from 'react'
import { HiGlobeAlt, HiCalendar, HiLocationMarker, HiChartBar } from 'react-icons/hi'
import { useEstadisticasVisitas } from '../../../lib/useApi'
import { SectionAnimation } from '../../ui'

export default function EstadisticasVisitas() {
  const [mesSeleccionado, setMesSeleccionado] = useState('')
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear())
  
  const { data: estadisticas, error, isLoading, mutate } = useEstadisticasVisitas()

  // Generar opciones de meses
  const meses = [
    { value: '', label: 'Todos los meses' },
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ]

  // Generar opciones de años (últimos 5 años)
  const anios = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  // Filtrar estadísticas por mes seleccionado
  const visitasFiltradas = estadisticas?.visitas_por_mes || {}
  const totalVisitas = estadisticas?.total_visitas || 0
  const visitasPorPais = estadisticas?.visitas_por_pais || {}
  const visitasPorCiudad = estadisticas?.visitas_por_ciudad || {}
  const visitasRecientes = estadisticas?.visitas_recientes || []

  // Calcular el máximo para las barras del gráfico
  const maxVisitas = Math.max(...Object.values(visitasFiltradas), 1)

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <p className="text-red-600">Error al cargar las estadísticas</p>
          <button 
            onClick={() => mutate()}
            className="mt-2 text-blue-600 hover:underline"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <SectionAnimation>
      <div className="space-y-6">
      {/* Header con filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <HiGlobeAlt className="text-blue-600" />
              Estadísticas de Visitas
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Total de visitas: <span className="font-semibold">{totalVisitas.toLocaleString()}</span>
            </p>
          </div>
          
          {/* Filtros */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <HiCalendar className="text-gray-400" />
              <select
                value={mesSeleccionado}
                onChange={(e) => setMesSeleccionado(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {meses.map((mes) => (
                  <option key={mes.value} value={mes.value}>
                    {mes.label}
                  </option>
                ))}
              </select>
            </div>
            
            <select
              value={anioSeleccionado}
              onChange={(e) => setAnioSeleccionado(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {anios.map((anio) => (
                <option key={anio} value={anio}>
                  {anio}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gráfico de visitas por mes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <HiChartBar className="text-green-600" />
          Visitas por Mes
        </h3>
        
        <div className="space-y-3">
          {Object.entries(visitasFiltradas).slice(0, 6).map(([mes, visitas]) => (
            <div key={mes} className="flex items-center gap-3">
              <div className="w-24 text-sm text-gray-600 truncate">{mes}</div>
              <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(visitas / maxVisitas) * 100}%` }}
                />
              </div>
              <div className="w-16 text-right text-sm font-medium text-gray-900">
                {visitas.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ubicaciones de visitas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitas por país */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HiLocationMarker className="text-red-600" />
            Visitas por País
          </h3>
          
          <div className="space-y-3">
            {Object.entries(visitasPorPais).length > 0 ? (
              Object.entries(visitasPorPais)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([pais, visitas], index) => (
                  <div key={pais} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{pais}</span>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">
                      {visitas.toLocaleString()} visitas
                    </span>
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay datos de países disponibles
              </p>
            )}
          </div>
        </div>

        {/* Visitas por ciudad */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HiLocationMarker className="text-purple-600" />
            Visitas por Ciudad
          </h3>
          
          <div className="space-y-3">
            {Object.entries(visitasPorCiudad).length > 0 ? (
              Object.entries(visitasPorCiudad)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([ciudad, visitas], index) => (
                  <div key={ciudad} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{ciudad}</span>
                    </div>
                    <span className="text-sm font-semibold text-purple-600">
                      {visitas.toLocaleString()} visitas
                    </span>
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay datos de ciudades disponibles
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Visitas recientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-md font-semibold text-gray-900 mb-4">
          Visitas Recientes
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="pb-3">Página</th>
                <th className="pb-3">Ubicación</th>
                <th className="pb-3">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visitasRecientes.length > 0 ? (
                visitasRecientes.map((visita) => (
                  <tr key={visita.id} className="hover:bg-gray-50">
                    <td className="py-3 text-sm text-gray-900">
                      {visita.pagina || 'Página principal'}
                    </td>
                    <td className="py-3 text-sm text-gray-600">
                      {visita.ciudad && visita.pais 
                        ? `${visita.ciudad}, ${visita.pais}`
                        : visita.pais || visita.ciudad || 'Desconocida'}
                    </td>
                    <td className="py-3 text-sm text-gray-500">
                      {visita.fecha 
                        ? new Date(visita.fecha).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-sm text-gray-500">
                    No hay visitas recientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </SectionAnimation>
  )
}
