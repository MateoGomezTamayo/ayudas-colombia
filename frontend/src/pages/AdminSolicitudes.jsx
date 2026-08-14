import { useState, useEffect, useCallback } from 'react'
import AdminLayout from '../components/AdminLayout'
import PriorityBadge from '../components/PriorityBadge'
import StatusBadge from '../components/StatusBadge'
import { getAdminSolicitudes, updateSolicitud } from '../api'

export default function AdminSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtros, setFiltros] = useState({ estado: '', prioridad: '', ciudad: '' })
  const [updating, setUpdating] = useState({})

  const fetchSolicitudes = useCallback(() => {
    const params = {}
    if (filtros.estado) params.estado = filtros.estado
    if (filtros.prioridad) params.prioridad = filtros.prioridad
    setLoading(true)
    getAdminSolicitudes(params)
      .then(setSolicitudes)
      .catch(() => setError('Error cargando solicitudes'))
      .finally(() => setLoading(false))
  }, [filtros.estado, filtros.prioridad])

  useEffect(() => {
    fetchSolicitudes()
  }, [fetchSolicitudes])

  const handleUpdate = async (id, field, value) => {
    setUpdating((prev) => ({ ...prev, [id]: true }))
    try {
      await updateSolicitud(id, { [field]: value })
      setSolicitudes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
      )
    } catch {
      setError('Error al actualizar la solicitud')
    } finally {
      setUpdating((prev) => ({ ...prev, [id]: false }))
    }
  }

  const filtradas = solicitudes.filter(
    (s) =>
      !filtros.ciudad ||
      s.ciudad?.toLowerCase().includes(filtros.ciudad.toLowerCase())
  )

  return (
    <AdminLayout>
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-5">Solicitudes</h1>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Estado</label>
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros((f) => ({ ...f, estado: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="cubierto">Cubierto</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Prioridad</label>
            <select
              value={filtros.prioridad}
              onChange={(e) => setFiltros((f) => ({ ...f, prioridad: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Ciudad</label>
            <input
              value={filtros.ciudad}
              onChange={(e) => setFiltros((f) => ({ ...f, ciudad: e.target.value }))}
              placeholder="Filtrar por ciudad..."
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
            />
          </div>
          <span className="text-xs text-gray-400 pb-1.5">
            {filtradas.length} resultado{filtradas.length !== 1 ? 's' : ''}
          </span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              Cargando solicitudes...
            </div>
          ) : filtradas.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              No hay solicitudes con los filtros seleccionados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-left">
                    <th className="px-4 py-3 font-medium text-gray-500">ID</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Ciudad</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Prioridad</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Estado</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Solicitante</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Productos</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Fecha</th>
                    <th className="px-4 py-3 font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtradas.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-400 text-xs">#{s.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{s.ciudad}</div>
                        {s.departamento && (
                          <div className="text-xs text-gray-400">{s.departamento}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <PriorityBadge prioridad={s.prioridad} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge estado={s.estado} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-800">{s.nombre_solicitante || '—'}</div>
                        {s.contacto && (
                          <div className="text-xs text-gray-400">{s.contacto}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-600 max-w-[160px]">
                          {s.items?.slice(0, 2).map((it, i) => (
                            <div key={i}>
                              {it.producto}: {it.cantidad} {it.unidad}
                            </div>
                          ))}
                          {s.items?.length > 2 && (
                            <div className="text-gray-400">+{s.items.length - 2} más</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {s.created_at
                          ? new Date(s.created_at).toLocaleDateString('es-CO')
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1.5 min-w-[130px]">
                          <select
                            value={s.estado}
                            disabled={updating[s.id]}
                            onChange={(e) => handleUpdate(s.id, 'estado', e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 bg-white"
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="en_proceso">En Proceso</option>
                            <option value="cubierto">Cubierto</option>
                          </select>
                          <select
                            value={s.prioridad}
                            disabled={updating[s.id]}
                            onChange={(e) => handleUpdate(s.id, 'prioridad', e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 bg-white"
                          >
                            <option value="alta">Alta</option>
                            <option value="media">Media</option>
                            <option value="baja">Baja</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
