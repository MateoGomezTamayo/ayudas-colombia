import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { getAdminVoluntarios, createVoluntario, updateVoluntario, deleteVoluntario } from '../api'

const TIPOS = ['presencial', 'transporte', 'virtual']

const EMPTY_FORM = {
  nombre: '',
  ciudad: '',
  tipo: 'presencial',
  descripcion: '',
  link_inscripcion: '',
  whatsapp: '',
  instagram: '',
  telefono: '',
}

const INPUT_CLASS =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

export default function AdminVoluntariado() {
  const [voluntarios, setVoluntarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const fetchVoluntarios = () => {
    setLoading(true)
    getAdminVoluntarios()
      .then(setVoluntarios)
      .catch(() => setError('Error cargando voluntarios'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchVoluntarios() }, [])

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); setError(null) }

  const openEdit = (v) => {
    setForm({
      nombre: v.nombre || '',
      ciudad: v.ciudad || '',
      tipo: v.tipo || 'presencial',
      descripcion: v.descripcion || '',
      link_inscripcion: v.link_inscripcion || '',
      whatsapp: v.whatsapp || '',
      instagram: v.instagram || '',
      telefono: v.telefono || '',
    })
    setEditId(v.id)
    setShowForm(true)
    setError(null)
  }

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (editId) {
        await updateVoluntario(editId, form)
      } else {
        await createVoluntario(form)
      }
      setShowForm(false)
      fetchVoluntarios()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Desactivar esta oportunidad?')) return
    try {
      await deleteVoluntario(id)
      fetchVoluntarios()
    } catch {
      setError('Error al desactivar')
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-gray-900">Voluntariado</h1>
          <button
            onClick={openCreate}
            className="bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Nueva Oportunidad
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{error}</div>
        )}

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">
                  {editId ? 'Editar Oportunidad' : 'Nueva Oportunidad de Voluntariado'}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none" aria-label="Cerrar">×</button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre / Organización *</label>
                  <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Ej: Cruz Roja Colombia" className={INPUT_CLASS} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                    <input name="ciudad" value={form.ciudad} onChange={handleChange} placeholder="Bogotá" className={INPUT_CLASS} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select name="tipo" value={form.tipo} onChange={handleChange} className={INPUT_CLASS}>
                      {TIPOS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} placeholder="¿Qué hace el voluntario? ¿Qué se necesita?" className={INPUT_CLASS} style={{ resize: 'vertical' }} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link de inscripción</label>
                  <input name="link_inscripcion" value={form.link_inscripcion} onChange={handleChange} placeholder="https://..." className={INPUT_CLASS} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (URL)</label>
                    <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="https://wa.me/..." className={INPUT_CLASS} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                    <input name="instagram" value={form.instagram} onChange={handleChange} placeholder="@usuario" className={INPUT_CLASS} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="300 000 0000" className={INPUT_CLASS} />
                </div>

                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  <button type="submit" disabled={saving} className="flex-1 bg-blue-800 hover:bg-blue-900 disabled:opacity-60 text-white font-medium py-2.5 rounded-xl transition-colors text-sm">
                    {saving ? 'Guardando...' : editId ? 'Guardar Cambios' : 'Crear'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl transition-colors text-sm">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Cargando...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {voluntarios.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">No hay oportunidades registradas</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-left">
                      <th className="px-4 py-3 font-medium text-gray-500">Nombre</th>
                      <th className="px-4 py-3 font-medium text-gray-500">Ciudad</th>
                      <th className="px-4 py-3 font-medium text-gray-500">Tipo</th>
                      <th className="px-4 py-3 font-medium text-gray-500">Estado</th>
                      <th className="px-4 py-3 font-medium text-gray-500">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {voluntarios.map(v => (
                      <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">{v.nombre}</div>
                          {v.descripcion && <div className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{v.descripcion}</div>}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{v.ciudad || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${v.tipo === 'presencial' ? 'bg-blue-100 text-blue-700' : v.tipo === 'transporte' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                            {v.tipo}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${v.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {v.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(v)} className="text-xs text-blue-600 hover:underline">Editar</button>
                            {v.activo && (
                              <button onClick={() => handleDelete(v.id)} className="text-xs text-red-500 hover:underline">Desactivar</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
