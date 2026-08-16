import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import { getAdminPuntos, createPunto, updatePunto } from '../api'

const CATEGORIAS = [
  { id: 1, nombre: 'Alimentos' },
  { id: 2, nombre: 'Agua' },
  { id: 3, nombre: 'Medicamentos' },
  { id: 4, nombre: 'Ropa y Abrigo' },
  { id: 5, nombre: 'Herramientas' },
  { id: 6, nombre: 'Higiene' },
  { id: 7, nombre: 'Colchonetas y Cobijas' },
  { id: 8, nombre: 'Otro' },
]

const EMPTY_FORM = {
  nombre: '',
  ciudad: '',
  departamento: '',
  direccion: '',
  lat: '',
  lng: '',
  horario: '',
  contacto: '',
  telefono: '',
  que_acepta: [],
  activo: true,
  tipo: 'acopio',
}

const INPUT_CLASS =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

export default function AdminPuntos() {
  const [puntos, setPuntos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const fetchPuntos = () => {
    setLoading(true)
    getAdminPuntos()
      .then(setPuntos)
      .catch(() => setError('Error cargando puntos de acopio'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchPuntos()
  }, [])

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setEditId(null)
    setShowForm(true)
    setError(null)
  }

  const openEdit = (punto) => {
    setForm({
      nombre: punto.nombre || '',
      ciudad: punto.ciudad || '',
      departamento: punto.departamento || '',
      direccion: punto.direccion || '',
      lat: punto.lat ?? '',
      lng: punto.lng ?? '',
      horario: punto.horario || '',
      contacto: punto.contacto || '',
      telefono: punto.telefono || '',
      que_acepta: punto.que_acepta || [],
      activo: punto.activo !== false,
    })
    setEditId(punto.id)
    setShowForm(true)
    setError(null)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox' && name === 'que_acepta') {
      setForm((f) => ({
        ...f,
        que_acepta: checked
          ? [...f.que_acepta, value]
          : f.que_acepta.filter((a) => a !== value),
      }))
    } else if (type === 'checkbox') {
      setForm((f) => ({ ...f, [name]: checked }))
    } else {
      setForm((f) => ({ ...f, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const data = {
        ...form,
        lat: form.lat !== '' ? Number(form.lat) : null,
        lng: form.lng !== '' ? Number(form.lng) : null,
      }
      if (editId) {
        await updatePunto(editId, data)
      } else {
        await createPunto(data)
      }
      setShowForm(false)
      fetchPuntos()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar el punto')
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivate = async (id) => {
    try {
      await updatePunto(id, { activo: false })
      fetchPuntos()
    } catch {
      setError('Error al desactivar el punto')
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold text-gray-900">Puntos de Acopio</h1>
          <button
            onClick={openCreate}
            className="bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Nuevo Punto
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
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-800">
                  {editId ? 'Editar Punto de Acopio' : 'Nuevo Punto de Acopio'}
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
                    placeholder="Nombre del punto de acopio"
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad *
                    </label>
                    <input
                      name="ciudad"
                      value={form.ciudad}
                      onChange={handleChange}
                      required
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departamento
                    </label>
                    <input
                      name="departamento"
                      value={form.departamento}
                      onChange={handleChange}
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    placeholder="Calle y número"
                    className={INPUT_CLASS}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitud
                    </label>
                    <input
                      name="lat"
                      value={form.lat}
                      onChange={handleChange}
                      type="number"
                      step="any"
                      placeholder="4.6097"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitud
                    </label>
                    <input
                      name="lng"
                      value={form.lng}
                      onChange={handleChange}
                      type="number"
                      step="any"
                      placeholder="-74.0817"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horario
                    </label>
                    <input
                      name="horario"
                      value={form.horario}
                      onChange={handleChange}
                      placeholder="Lun-Vie 8am–5pm"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      name="telefono"
                      value={form.telefono}
                      onChange={handleChange}
                      placeholder="300 000 0000"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contacto
                  </label>
                  <input
                    name="contacto"
                    value={form.contacto}
                    onChange={handleChange}
                    placeholder="Nombre del responsable"
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Qué acepta?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIAS.map((cat) => (
                      <label
                        key={cat.id}
                        className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          name="que_acepta"
                          value={cat.nombre}
                          checked={form.que_acepta.includes(cat.nombre)}
                          onChange={handleChange}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        {cat.nombre}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                  <select name="tipo" value={form.tipo} onChange={handleChange} className={INPUT_CLASS}>
                    <option value="acopio">Punto de Acopio</option>
                    <option value="refugio">Refugio</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={form.activo}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Punto activo (visible en el mapa público)
                </label>

                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-blue-800 hover:bg-blue-900 disabled:opacity-60 text-white font-medium py-2.5 rounded-xl transition-colors text-sm"
                  >
                    {saving ? 'Guardando...' : editId ? 'Guardar Cambios' : 'Crear Punto'}
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

        {/* Table */}
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Cargando...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {puntos.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                No hay puntos de acopio registrados
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-left">
                      <th className="px-4 py-3 font-medium text-gray-500">Nombre</th>
                      <th className="px-4 py-3 font-medium text-gray-500">Ubicación</th>
                      <th className="px-4 py-3 font-medium text-gray-500">Horario</th>
                      <th className="px-4 py-3 font-medium text-gray-500">Estado</th>
                      <th className="px-4 py-3 font-medium text-gray-500">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {puntos.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">{p.nombre}</div>
                          {p.acepta?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {p.acepta.slice(0, 3).map((a, i) => (
                                <span
                                  key={i}
                                  className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded"
                                >
                                  {a}
                                </span>
                              ))}
                              {p.acepta.length > 3 && (
                                <span className="text-xs text-gray-400">
                                  +{p.acepta.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <div>
                            {p.ciudad}
                            {p.departamento ? `, ${p.departamento}` : ''}
                          </div>
                          {p.direccion && (
                            <div className="text-xs text-gray-400">{p.direccion}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-xs">
                          {p.horario || '—'}
                        </td>
                        <td className="px-4 py-3">
                          {p.activo !== false ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                              Activo
                            </span>
                          ) : (
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                              Inactivo
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-3">
                            <button
                              onClick={() => openEdit(p)}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                            >
                              Editar
                            </button>
                            {p.activo !== false && (
                              <button
                                onClick={() => handleDeactivate(p.id)}
                                className="text-red-500 hover:text-red-700 text-xs font-medium"
                              >
                                Desactivar
                              </button>
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
