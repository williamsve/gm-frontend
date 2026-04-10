# Componentes UI Reutilizables

Este directorio contiene componentes de UI reutilizables diseñados para reducir la redundancia en el código del panel de administración.

## Componentes Disponibles

### 1. ActionButton
Botón de acción reutilizable para operaciones comunes (ver, editar, eliminar, aprobar, rechazar).

```jsx
import { ActionButton } from '../ui'

<ActionButton variant="view" onClick={() => handleView()} />
<ActionButton variant="edit" onClick={() => handleEdit()} />
<ActionButton variant="delete" onClick={() => handleDelete()} />
<ActionButton variant="approve" onClick={() => handleApprove()} label="Aprobar" />
```

**Props:**
- `variant`: 'view' | 'edit' | 'delete' | 'approve' | 'reject'
- `onClick`: Función a ejecutar al hacer clic
- `label`: Texto opcional junto al icono
- `size`: Tamaño del icono (default: 18)
- `className`: Clases CSS adicionales

### 2. Button
Botón principal con variantes de estilo y animaciones.

```jsx
import { Button } from '../ui'

<Button icon={HiPlus}>Nuevo Proyecto</Button>
<Button variant="success" icon={HiLink}>Generar Enlace</Button>
<Button variant="outline" size="lg">Cancelar</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `icon`: Componente de icono
- `iconPosition`: 'left' | 'right'
- `disabled`: boolean

### 3. StatCard
Tarjeta para mostrar estadísticas con icono y cambio porcentual.

```jsx
import { StatCard } from '../ui'

<StatCard
  label="Total Proyectos"
  value="12"
  icon={HiFolderOpen}
  color="blue"
  change="+2 este mes"
/>
```

**Props:**
- `label`: Etiqueta de la estadística
- `value`: Valor numérico o texto
- `icon`: Componente de icono (opcional)
- `color`: 'blue' | 'green' | 'purple' | 'orange' | 'yellow' | 'red' | 'gray'
- `change`: Texto de cambio (opcional, ej: "+2 este mes")

### 4. SectionHeader
Encabezado de sección con título, descripción y acción.

```jsx
import { SectionHeader, Button } from '../ui'

<SectionHeader
  title="Proyectos"
  description="Gestiona todos tus proyectos"
  action={<Button icon={HiPlus}>Nuevo Proyecto</Button>}
/>
```

**Props:**
- `title`: Título de la sección
- `description`: Descripción (opcional)
- `action`: Componente de acción (opcional)

### 5. FilterBar
Barra de filtros reutilizable con búsqueda y selects.

```jsx
import { FilterBar } from '../ui'

<FilterBar
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  searchPlaceholder="Buscar proyectos..."
  filters={[
    {
      value: filterCategory,
      onChange: setFilterCategory,
      options: [
        { value: 'todos', label: 'Todas las categorías' },
        { value: 'desarrollo', label: 'Desarrollo' }
      ]
    }
  ]}
/>
```

**Props:**
- `searchTerm`: Valor del campo de búsqueda
- `onSearchChange`: Función para actualizar el término de búsqueda
- `searchPlaceholder`: Placeholder del campo de búsqueda
- `filters`: Array de objetos de filtro con `value`, `onChange` y `options`

### 6. StatusBadge
Badge de estado reutilizable para mostrar estados y categorías.

```jsx
import { StatusBadge } from '../ui'

<StatusBadge status="aprobado" />
<StatusBadge status="pendiente" />
<StatusBadge status="completado" />
<StatusBadge status="desarrollo" />
```

**Estados predefinidos:**
- Testimonios: 'pendiente', 'aprobado', 'rechazado'
- Trabajos: 'completado', 'en_progreso', 'pendiente'
- Servicios: 'desarrollo', 'diseno', 'consultoria'

### 7. DataTable
Tabla de datos reutilizable con columnas personalizables.

```jsx
import { DataTable } from '../ui'

const columns = [
  { header: 'Nombre', accessor: 'nombre' },
  { header: 'Estado', render: (row) => <StatusBadge status={row.estado} /> },
  { header: 'Acciones', render: (row) => (
    <div className="flex gap-2">
      <ActionButton variant="edit" onClick={() => handleEdit(row)} />
      <ActionButton variant="delete" onClick={() => handleDelete(row)} />
    </div>
  )}
]

<DataTable columns={columns} data={data} emptyMessage="No hay datos" />
```

**Props:**
- `columns`: Array de definiciones de columna
- `data`: Array de datos a mostrar
- `onRowClick`: Función al hacer clic en una fila (opcional)
- `emptyMessage`: Mensaje cuando no hay datos

### 8. ServiceCard
Tarjeta para mostrar servicios con icono, descripción y acciones.

```jsx
import { ServiceCard } from '../ui'

<ServiceCard
  service={servicio}
  onView={(s) => console.log('Ver', s.id)}
  onEdit={(s) => console.log('Editar', s.id)}
  onDelete={(s) => console.log('Eliminar', s.id)}
/>
```

**Props:**
- `service`: Objeto con datos del servicio (nombre, descripcion, categoria, precio, icon, color)
- `onView`, `onEdit`, `onDelete`: Funciones de callback para acciones

### 9. TestimonialAdminCard
Tarjeta para mostrar testimonios en el panel de admin con acciones de aprobación/rechazo.

```jsx
import { TestimonialAdminCard } from '../ui'

<TestimonialAdminCard
  testimonial={testimonio}
  onApprove={handleAprobar}
  onReject={handleRechazar}
  onView={handleVer}
  onEdit={handleEditar}
  onDelete={handleEliminar}
/>
```

**Props:**
- `testimonial`: Objeto con datos del testimonio
- `onApprove`, `onReject`: Funciones para aprobar/rechazar (solo para pendientes)
- `onView`, `onEdit`, `onDelete`: Funciones para otras acciones

### 10. QuickActionButton
Botón de acción rápida para el dashboard.

```jsx
import { QuickActionButton } from '../ui'

<QuickActionButton icon={HiFolderOpen} label="Nuevo Proyecto" color="blue" />
```

**Props:**
- `icon`: Componente de icono
- `label`: Texto del botón
- `color`: 'blue' | 'green' | 'purple' | 'orange' | 'red'

### 11. ActivityItem
Item de actividad reciente para el dashboard.

```jsx
import { ActivityItem } from '../ui'

<ActivityItem
  action="Nuevo proyecto creado"
  time="Hace 2 horas"
  type="proyecto"
/>
```

**Props:**
- `action`: Texto de la acción
- `time`: Tiempo relativo
- `type`: 'proyecto' | 'testimonio' | 'servicio' | 'trabajo' | 'default'

### 12. QuickStat
Estadística rápida para el dashboard.

```jsx
import { QuickStat } from '../ui'

<QuickStat
  label="Visitas totales"
  value="12,847"
  icon={HiEye}
  trend="+15%"
/>
```

**Props:**
- `label`: Etiqueta de la estadística
- `value`: Valor
- `icon`: Componente de icono
- `trend`: Texto de tendencia (ej: "+15%", "-12%")

### 13. EmptyState
Estado vacío reutilizable cuando no hay datos.

```jsx
import { EmptyState } from '../ui'

<EmptyState message="No se encontraron proyectos" icon={HiFolderOpen} />
```

**Props:**
- `message`: Mensaje a mostrar
- `icon`: Componente de icono (opcional)

## Importación

Todos los componentes se pueden importar desde el archivo index:

```jsx
import { 
  ActionButton, 
  Button, 
  StatCard, 
  SectionHeader, 
  FilterBar, 
  StatusBadge, 
  DataTable, 
  ServiceCard, 
  TestimonialAdminCard,
  QuickActionButton,
  ActivityItem,
  QuickStat,
  EmptyState
} from '../ui'
```

## Beneficios

1. **Reducción de código**: Elimina duplicación de código similar en múltiples componentes
2. **Consistencia**: Asegura un diseño y comportamiento uniforme en toda la aplicación
3. **Mantenibilidad**: Cambios centralizados en un solo lugar
4. **Reutilización**: Componentes diseñados para ser usados en múltiples contextos
5. **Personalización**: Props flexibles para adaptarse a diferentes necesidades
