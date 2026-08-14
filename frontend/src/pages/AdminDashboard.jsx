import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import SolicitudCard from '../components/SolicitudCard'
import { getAdminSolicitudes } from '../api'

export default function AdminDashboard() {
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getAdminSolicitudes()
      .then(setSolicitudes)
      .catch(() => setError('Error cargando solicitudes'))
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    total: solicitudes.length,
    pendiente: solicitudes.filter((s) => s.estado === 'pendiente').length,
    en_proceso: solicitudes.filter((s) => s.estado === 'en_proceso').length,
    cubierto: solicitudes.filter((s) => s.estado === 'cubierto').length,
    alta: solicitudes.filter((s) => s.prioridad === 'alta').length,
    media: solicitudes.filter((s) => s.prioridad === 'media').length,
    baja: solicitudes.filter((s) => s.prioridad === 'baja').length,
  }

  const urgentes = solicitudes.filter((s) => s.prioridad === 'alta').slice(0, 5)

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <h1 className="text-xl font-bold text-gray-900 mb-5">Dashboard</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Stats by estado */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-xs text-gray-500 mt-1">Total</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-gray-500">{stats.pendiente}</div>
            <div className="text-xs text-gray-500 mt-1">Pendientes</div>
          </div>
          <div className="bg-white rounded-xl border border-blue-100 p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{stats.en_proceso}</div>
            <div className="text-xs text-gray-500 mt-1">En Proceso</div>
          </div>
          <div className="bg-white rounded-xl border border-green-100 p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600">{stats.cubierto}</div>
            <div className="text-xs text-gray-500 mt-1">Cubiertos</div>
          </div>
        </div>

        {/* Stats by prioridad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-red-50 rounded-xl border border-red-100 p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.alta}</div>
            <div className="text-xs text-red-500 mt-1">Alta Prioridad</div>
          </div>
          <div className="bg-orange-50 rounded-xl border border-orange-100 p-3 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.media}</div>
            <div className="text-xs text-orange-500 mt-1">Media Prioridad</div>
          </div>
          <div className="bg-green-50 rounded-xl border border-green-100 p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.baja}</div>
            <div className="text-xs text-green-500 mt-1">Baja Prioridad</div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Link
            to="/admin/solicitudes"
            className="bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-300 hover:shadow-md transition-all text-center shadow-sm"
          >
            <div className="text-2xl mb-1">📋</div>
            <div className="text-sm font-medium text-gray-700">Gestionar Solicitudes</div>
          </Link>
          <Link
            to="/admin/puntos"
            className="bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-300 hover:shadow-md transition-all text-center shadow-sm"
          >
            <div className="text-2xl mb-1">📦</div>
            <div className="text-sm font-medium text-gray-700">Puntos de Acopio</div>
          </Link>
          <Link
            to="/admin/emergencias"
            className="bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-300 hover:shadow-md transition-all text-center shadow-sm"
          >
            <div className="text-2xl mb-1">🚨</div>
            <div className="text-sm font-medium text-gray-700">Emergencias</div>
          </Link>
        </div>

        {/* Recent urgent */}
        {loading ? (
          <div className="text-center py-8 text-gray-400 text-sm">Cargando...</div>
        ) : urgentes.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-800 text-sm">
                Solicitudes urgentes recientes
              </h2>
              <Link to="/admin/solicitudes" className="text-xs text-blue-600 hover:underline">
                Ver todas →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {urgentes.map((s) => (
                <SolicitudCard key={s.id} solicitud={s} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </AdminLayout>
  )
}
