import AdminLayout from '../../components/admin/AdminLayout'
import AdminProtected from '../../components/admin/AdminProtected'

export default function AdminDashboard() {
  return (
    <AdminProtected>
      <AdminLayout />
    </AdminProtected>
  )
}
