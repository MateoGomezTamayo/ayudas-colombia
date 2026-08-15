import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { getAdminEmergencias, createEmergencia, updateEmergencia } from '../api'

const TIPO_LABELS = {
  inundacion: 'Inundación',
  sismo: 'Sismo',
  deslizamiento: 'Deslizamiento',
  otro: 'Otro',
}

const EMPTY_FORM = {
  nombre: '',
  descripcion: '',
  tipo: 'otro',
  estado: 'activa',
  departamento: '',
  municipio: '',
  fecha_inicio: '',
}

const INPUT_CLASS =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

export default function AdminEmergencias() {
  const [emergencias, setEmergencias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const fetchEmergencias = () => {
    setLoading(true)
    getAdminEmergencias()
      .then(setEmergencias)
      .catch(() => setError('Error cargando emergencias'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchEmergencias()
  }, [])

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setEditId(null)
    setShowForm(true)
    setError(null)
  }

  const openEdit = (em) => {
    setForm({
      nombre: em.nombre || '',
      descripcion: em.descripcion || '',
      tipo: em.tipo || 'otro',
      estado: em.estado || 'activa',
      departamento: em.departamento || '',
      municipio: em.municipio || '',
      fecha_inicio: em.fecha_inicio ? em.fecha_inicio.slice(0, 10) : '',
    })
    setEditId(em.id)
    setShowForm(true)
    setError(null)
  }

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (editId) {
        await updateEmergencia(editId, form)
      } else {
        await createEmergencia(form)
      }
      setShowForm(false)
      fetchEmergencias()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar la emergencia')
    } finally {
      setSaving(false)
    }
  }

  const handleClose = async (id) => {
    if (!window.confirm('¿Cerrar esta emergencia?')) return
    try {
      await updateEmergencia(id, { estado: 'cerrada' })
      fetchEmergencias()
    } catch {
      setError('Error al cerrar la emergencia')
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-gray-900">Emergencias</h1>
          <button
            onClick={openCreate}
            className="text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            style={{ background: '#CE1126' }}
          >
            + Nueva Emergencia
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">
                  {editId ? 'Editar Emergencia' : 'Nueva Emergencia'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Inundación río Bogotá 2026"
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe la situación de la emergencia..."
                    className={`${INPUT_CLASS} resize-none`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                      name="tipo"
                      value={form.tipo}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    >
                      <option value="inundacion">Inundación</option>
                      <option value="sismo">Sismo</option>
                      <option value="deslizamiento">Deslizamiento</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      name="estado"
                      value={form.estado}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    >
                      <option value="activa">Activa</option>
                      <option value="cerrada">Cerrada</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departamento
                    </label>
                    <input
                      name="departamento"
                      value={form.departamento}
                      onChange={handleChange}
                      placeholder="Cundinamarca"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Municipio
                    </label>
                    <input
                      name="municipio"
                      value={form.municipio}
                      onChange={handleChange}
                      placeholder="Bogotá"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de inicio
                  </label>
                  <input
                    name="fecha_inicio"
                    value={form.fecha_inicio}
                    onChange={handleChange}
                    type="date"
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-blue-800 hover:bg-blue-900 disabled:opacity-60 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
                  >
                    {saving
                      ? 'Guardando...'
                      : editId
                      ? 'Guardar Cambios'
                      : 'Crear Emergencia'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Cargando emergencias...</div>
        ) : emergencias.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 text-center py-12 text-gray-400 text-sm">
            No hay emergencias registradas
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {emergencias.map((em) => (
              <div
                key={em.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{em.nombre}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          em.estado === 'activa'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {em.estado === 'activa' ? 'Activa' : 'Cerrada'}
                      </span>
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                        {TIPO_LABELS[em.tipo] || em.tipo}
                      </span>
                    </div>
                    {em.descripcion && (
                      <p className="text-sm text-gray-600 mb-2">{em.descripcion}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                      {(em.departamento || em.municipio) && (
                        <span>
                          📍{' '}
                          {[em.departamento, em.municipio].filter(Boolean).join(' · ')}
                        </span>
                      )}
                      {em.fecha_inicio && (
                        <span>
                          📅 {new Date(em.fecha_inicio).toLocaleDateString('es-CO')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => openEdit(em)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Editar
                    </button>
                    {em.estado === 'activa' && (
                      <button
                        onClick={() => handleClose(em.id)}
                        className="text-red-600 hover:text-red-800 text-xs font-medium border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Cerrar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
