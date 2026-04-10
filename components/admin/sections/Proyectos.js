import { useState } from 'react'
import { HiPlus, HiExclamationCircle } from 'react-icons/hi'
import { 
  SectionHeader, 
  Button, 
  FilterBar, 
  DataTable, 
  ActionButton, 
  StatCard,
  SectionAnimation 
} from '../../ui'
import ConfirmDialog from '../../ui/ConfirmDialog'
import ProyectoForm from './ProyectoForm'
import { useProyectos } from '../../../lib/useApi'
import { apiPost, apiPut, apiDelete } from '../../../lib/apiClient'

export default function Proyectos() {
  const [filterEstado, setFilterEstado] = useState('todos')
  const [showForm, setShowForm] = useState(false)
  const [editingProyecto, setEditingProyecto] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState({ open: false, proyectoId: null })

  // Usar hook de API para obtener proyectos
  const { data: proyectos, error, isLoading, mutate } = useProyectos()

  // Obtener estados únicos
  const estados = proyectos ? [...new Set(proyectos.map(p => p.estado))].filter(Boolean) : []

  const filteredProyectos = proyectos ? proyectos.filter(proyecto => {
    const matchesEstado = filterEstado === 'todos' || proyecto.estado === filterEstado
    return matchesEstado
  }) : []

  const handleAddNew = () => {
    setEditingProyecto(null)
    setShowForm(true)
  }

  const handleEdit = (proyecto) => {
    setEditingProyecto(proyecto)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    // Show confirmation dialog instead of native confirm()
    setConfirmDialog({ open: true, proyectoId: id })
  }

  const handleConfirmDelete = async () => {
    const id = confirmDialog.proyectoId
    try {
      await apiDelete(`/api/proyectos/${id}`)
      // Actualizar cache de SWR
      mutate()
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar el proyecto. Por favor, intenta de nuevo.')
    }
  }

  const handleCloseConfirm = () => {
    setConfirmDialog({ open: false, proyectoId: null })
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingProyecto(null)
  }

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)

    try {
      if (editingProyecto) {
        // Modo edición: actualizar proyecto existente
        await apiPut(`/api/proyectos/${editingProyecto.id}`, formData)
      } else {
        // Modo creación: añadir nuevo proyecto
        await apiPost('/api/proyectos', formData)
      }

      // Actualizar cache de SWR
      mutate()
      setShowForm(false)
      setEditingProyecto(null)
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar el proyecto. Por favor, intenta de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const columns = [
    { 
      header: 'Proyecto', 
      accessor: 'nombre',
      render: (row) => (
        <div className="text-sm font-medium text-gray-900">{row.nombre}</div>
      )
    },
    { 
      header: 'Cliente', 
      accessor: 'cliente',
      render: (row) => (
        <div className="text-sm text-gray-600">{row.cliente || '-'}</div>
      )
    },
    { 
      header: 'Estado', 
      accessor: 'estado',
      render: (row) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          row.estado === 'completado' ? 'bg-green-100 text-green-800' :
          row.estado === 'en_progreso' ? 'bg-blue-100 text-blue-800' :
          row.estado === 'cancelado' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {row.estado === 'en_progreso' ? 'En Progreso' : 
           row.estado === 'completado' ? 'Completado' :
           row.estado === 'cancelado' ? 'Cancelado' : 'Pendiente'}
        </span>
      )
    },
    { 
      header: 'Fecha Inicio', 
      accessor: 'fecha_inicio',
      render: (row) => (
        <div className="text-sm text-gray-600">
          {row.fecha_inicio ? new Date(row.fecha_inicio).toLocaleDateString() : '-'}
        </div>
      )
    },
    { 
      header: 'Acciones', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <ActionButton variant="edit" onClick={() => handleEdit(row)} />
          <ActionButton variant="delete" onClick={() => handleDelete(row.id)} />
        </div>
      )
    },
  ]

  const filters = [
    {
      value: filterEstado,
      onChange: setFilterEstado,
      options: [
        { value: 'todos', label: 'Todos los estados' },
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'en_progreso', label: 'En Progreso' },
        { value: 'completado', label: 'Completado' },
        { value: 'cancelado', label: 'Cancelado' }
      ]
    }
  ]

  // Si se muestra el formulario, renderizar solo el formulario
  if (showForm) {
    return (
      <ProyectoForm 
        proyecto={editingProyecto}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    )
  }

  // Estado de carga
  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Proyectos"
          description="Gestiona todos tus proyectos"
          action={
            <Button icon={HiPlus} onClick={handleAddNew}>
              Nuevo Proyecto
            </Button>
          }
        />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Proyectos"
          description="Gestiona todos tus proyectos"
          action={
            <Button icon={HiPlus} onClick={handleAddNew}>
              Nuevo Proyecto
            </Button>
          }
        />
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <HiExclamationCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <p className="text-red-500">Error al cargar los proyectos</p>
          <p className="text-gray-500 text-sm mt-2">Por favor, intenta de nuevo más tarde</p>
          <Button 
            variant="secondary" 
            onClick={() => mutate()}
            className="mt-4"
          >
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <SectionAnimation>
      <div className="space-y-6">
        {/* Header */}
        <SectionHeader
        title="Proyectos"
        description="Gestiona todos tus proyectos"
        action={
          <Button icon={HiPlus} onClick={handleAddNew}>
            Nuevo Proyecto
          </Button>
        }
      />

      {/* Filters */}
      <FilterBar filters={filters} />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title="Eliminar proyecto"
        message="¿Estás seguro de que deseas eliminar este proyecto? El registro se guardará en la papelera y podrá ser recuperado posteriormente."
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onClose={handleCloseConfirm}
      />

      {/* Projects table */}
      <DataTable
        columns={columns}
        data={filteredProyectos}
        emptyMessage="No se encontraron proyectos"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Proyectos"
          value={proyectos ? proyectos.length : 0}
          color="gray"
        />
        <StatCard
          label="Pendientes"
          value={proyectos ? proyectos.filter(p => p.estado === 'pendiente').length : 0}
          color="yellow"
        />
        <StatCard
          label="En Progreso"
          value={proyectos ? proyectos.filter(p => p.estado === 'en_progreso').length : 0}
          color="blue"
        />
        <StatCard
          label="Completados"
          value={proyectos ? proyectos.filter(p => p.estado === 'completado').length : 0}
          color="green"
        />
      </div>
    </div>
    </SectionAnimation>
  )
}
