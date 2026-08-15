import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getEmergencias, createSolicitud } from '../api'


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

const INPUT_CLASS = 'w-full rounded-lg px-3 py-2 text-sm focus:outline-none'
const INPUT_STYLE = { background: '#161b22', color: '#f0f6fc', border: '1px solid #30363d' }

export default function SolicitarAyuda() {
  const navigate = useNavigate()
  const [emergencias, setEmergencias] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    emergencia_id: '',
    ciudad: '',
    departamento: '',
    direccion: '',
    nombre_solicitante: '',
    contacto: '',
    descripcion: '',
    prioridad: 'media',
  })

  const [items, setItems] = useState([
    { categoria_id: 1, producto: '', cantidad: '', unidad: '' },
  ])

  useEffect(() => {
    getEmergencias()
      .then((data) => {
        setEmergencias(data)
        if (data.length > 0) setForm((f) => ({ ...f, emergencia_id: data[0].id }))
      })
      .catch(() => {})
  }, [])

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleItemChange = (index, field, value) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)))
  }

  const addItem = () => {
    setItems((prev) => [...prev, { categoria_id: 1, producto: '', cantidad: '', unidad: '' }])
  }

  const removeItem = (index) => {
    if (items.length === 1) return
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const invalid = items.filter((it) => !it.producto || !it.cantidad)
    if (invalid.length > 0) {
      setError('Completa el nombre y la cantidad de todos los productos')
      return
    }

    setLoading(true)
    try {
      await createSolicitud({
        ...form,
        emergencia_id: Number(form.emergencia_id),
        lat: null,
        lng: null,
        items: items.map((it) => ({
          ...it,
          categoria_id: Number(it.categoria_id),
          cantidad: Number(it.cantidad),
        })),
      })
      setSuccess(true)
      setTimeout(() => navigate('/'), 2500)
    } catch (err) {
      setError(
        err.response?.data?.error || 'Error al enviar la solicitud. Por favor intenta de nuevo.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d1117' }}>
        <div className="rounded-2xl p-10 max-w-md text-center" style={{ background: '#161b22', border: '1px solid #30363d' }}>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#16a34a' }}>Solicitud enviada</h2>
          <p className="mb-4" style={{ color: '#8b949e' }}>
            Tu solicitud de ayuda ha sido registrada. El equipo de coordinación la revisará pronto.
          </p>
          <p className="text-sm" style={{ color: '#8b949e' }}>Redirigiendo al inicio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8" style={{ background: '#0d1117' }}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-6">
          <Link to="/" className="text-sm" style={{ color: '#58a6ff' }}>
            ← Volver al inicio
          </Link>
          <h1 className="text-2xl font-bold mt-2" style={{ color: '#f0f6fc' }}>Solicitar Ayuda</h1>
          <p className="text-sm mt-1" style={{ color: '#8b949e' }}>
            Completa el formulario para registrar tu solicitud de ayuda humanitaria
          </p>
        </div>

        {error && (
          <div className="rounded-lg p-3 mb-4 text-sm" style={{ background: '#1a0a0a', border: '1px solid #dc2626', color: '#f87171' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* ── Left column ── */}
            <div className="rounded-xl p-5 flex flex-col gap-4" style={{ background: '#161b22', border: '1px solid #30363d' }}>
              <h2 className="font-semibold pb-2" style={{ color: '#f0f6fc', borderBottom: '1px solid #30363d' }}>Información básica</h2>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#8b949e' }}>
                  Emergencia *
                </label>
                <select
                  name="emergencia_id"
                  value={form.emergencia_id}
                  onChange={handleChange}
                  required
                  className={INPUT_CLASS}
                  style={INPUT_STYLE}
                >
                  {emergencias.length === 0 && (
                    <option value="">Sin emergencias activas</option>
                  )}
                  {emergencias.map((em) => (
                    <option key={em.id} value={em.id}>
                      {em.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#8b949e' }}>
                    Ciudad *
                  </label>
                  <input
                    name="ciudad"
                    value={form.ciudad}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Medellín"
                    className={INPUT_CLASS}
                    style={INPUT_STYLE}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#8b949e' }}>
                    Departamento
                  </label>
                  <input
                    name="departamento"
                    value={form.departamento}
                    onChange={handleChange}
                    placeholder="Ej: Antioquia"
                    className={INPUT_CLASS}
                    style={INPUT_STYLE}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#8b949e' }}>
                  Direccion
                </label>
                <input
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  placeholder="Ej: Calle 10 # 5-32, Barrio La Esperanza"
                  className={INPUT_CLASS}
                  style={INPUT_STYLE}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#8b949e' }}>
                  Nombre del solicitante
                </label>
                <input
                  name="nombre_solicitante"
                  value={form.nombre_solicitante}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  className={INPUT_CLASS}
                  style={INPUT_STYLE}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#8b949e' }}>
                  Teléfono / Contacto
                </label>
                <input
                  name="contacto"
                  value={form.contacto}
                  onChange={handleChange}
                  placeholder="300 000 0000"
                  className={INPUT_CLASS}
                  style={INPUT_STYLE}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#8b949e' }}>
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe la situación y la ayuda que necesitas..."
                  className={`${INPUT_CLASS} resize-none`}
                  style={INPUT_STYLE}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#8b949e' }}>
                  Prioridad
                </label>
                <select
                  name="prioridad"
                  value={form.prioridad}
                  onChange={handleChange}
                  className={INPUT_CLASS}
                  style={INPUT_STYLE}
                >
                  <option value="alta">Alta — Urgente</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
            </div>

            {/* ── Right column ── */}
            <div className="rounded-xl p-5 flex flex-col gap-4" style={{ background: '#161b22', border: '1px solid #30363d' }}>
              <h2 className="font-semibold pb-2" style={{ color: '#f0f6fc', borderBottom: '1px solid #30363d' }}>Productos necesarios</h2>

              <div className="flex flex-col gap-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg p-3 flex flex-col gap-2"
                    style={{ background: '#0d1117', border: '1px solid #30363d' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium" style={{ color: '#8b949e' }}>
                        Producto {index + 1}
                      </span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="w-5 h-5 flex items-center justify-center text-red-400 hover:text-red-600 font-bold text-base rounded"
                          aria-label="Eliminar producto"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    <select
                      value={item.categoria_id}
                      onChange={(e) => handleItemChange(index, 'categoria_id', e.target.value)}
                      className={INPUT_CLASS}
                      style={INPUT_STYLE}
                    >
                      {CATEGORIAS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>

                    <input
                      value={item.producto}
                      onChange={(e) => handleItemChange(index, 'producto', e.target.value)}
                      placeholder="Nombre del producto"
                      required
                      className={INPUT_CLASS}
                      style={INPUT_STYLE}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={item.cantidad}
                        onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
                        placeholder="Cantidad"
                        type="number"
                        min="1"
                        required
                        className={INPUT_CLASS}
                        style={INPUT_STYLE}
                      />
                      <input
                        value={item.unidad}
                        onChange={(e) => handleItemChange(index, 'unidad', e.target.value)}
                        placeholder="Unidad (kg, L, pzs…)"
                        className={INPUT_CLASS}
                        style={INPUT_STYLE}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addItem}
                className="rounded-lg py-2.5 text-sm font-medium transition-colors"
                style={{ border: '2px dashed #30363d', color: '#58a6ff' }}
              >
                + Agregar producto
              </button>

              <div className="mt-auto pt-4" style={{ borderTop: '1px solid #30363d' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                  style={{ background: '#16a34a' }}
                >
                  {loading ? 'Enviando...' : 'Enviar Solicitud'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
