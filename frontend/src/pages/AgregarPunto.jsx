import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getEmergencias, submitPuntoPublico } from '../api'

const INPUT_CLASS = 'w-full rounded-lg px-3 py-2 text-sm focus:outline-none'
const INPUT_STYLE = { background: '#161b22', color: '#f0f6fc', border: '1px solid #30363d' }

export default function AgregarPunto({ tipo = 'acopio' }) {
  const navigate = useNavigate()
  const isAlbergue = tipo === 'refugio'
  const [emergencias, setEmergencias] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    emergencia_id: '',
    nombre: '',
    ciudad: '',
    departamento: '',
    direccion: '',
    horario: '',
    contacto: '',
    telefono: '',
  })

  useEffect(() => {
    getEmergencias()
      .then((data) => {
        setEmergencias(data)
        if (data.length > 0) setForm((f) => ({ ...f, emergencia_id: data[0].id }))
      })
      .catch(() => {})
  }, [])

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await submitPuntoPublico({
        ...form,
        tipo,
        emergencia_id: form.emergencia_id ? Number(form.emergencia_id) : null,
      })
      setSuccess(true)
      setTimeout(() => navigate('/'), 2500)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d1117' }}>
        <div className="rounded-2xl p-10 max-w-md text-center" style={{ background: '#161b22', border: '1px solid #30363d' }}>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#16a34a' }}>Solicitud enviada</h2>
          <p className="mb-2" style={{ color: '#8b949e' }}>
            Tu {isAlbergue ? 'albergue' : 'punto de acopio'} fue registrado.
            El equipo lo revisara y activara pronto.
          </p>
          <p className="text-sm" style={{ color: '#8b949e' }}>Redirigiendo al inicio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8" style={{ background: '#0d1117' }}>
      <div className="max-w-lg mx-auto px-4">
        <Link to="/" className="text-sm" style={{ color: '#58a6ff' }}>← Volver al inicio</Link>

        <div className="mt-4 mb-6">
          <h1 className="text-2xl font-bold" style={{ color: '#f0f6fc' }}>
            {isAlbergue ? 'Registrar Albergue' : 'Registrar Punto de Acopio'}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: '#8b949e' }}>
            {isAlbergue
              ? 'Reporta un lugar donde las personas pueden refugiarse'
              : 'Reporta un lugar donde se pueden llevar donaciones'}
          </p>
        </div>

        {error && (
          <div className="rounded-lg p-3 mb-4 text-sm" style={{ background: '#1a0a0a', border: '1px solid #dc2626', color: '#f87171' }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} className="rounded-xl p-6 flex flex-col gap-4" style={{ background: '#161b22', border: '1px solid #30363d' }}>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#8b949e' }}>Emergencia relacionada</label>
            <select name="emergencia_id" value={form.emergencia_id} onChange={handleChange} className={INPUT_CLASS} style={INPUT_STYLE}>
              <option value="">Sin emergencia específica</option>
              {emergencias.map((em) => (
                <option key={em.id} value={em.id}>{em.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#8b949e' }}>
              Nombre del {isAlbergue ? 'albergue' : 'punto'} *
            </label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              placeholder={isAlbergue ? 'Ej: Coliseo Municipal San José' : 'Ej: Iglesia San Pedro'}
              className={INPUT_CLASS}
              style={INPUT_STYLE}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#8b949e' }}>Ciudad *</label>
              <input name="ciudad" value={form.ciudad} onChange={handleChange} required placeholder="Ej: Cali" className={INPUT_CLASS} style={INPUT_STYLE} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#8b949e' }}>Departamento</label>
              <input name="departamento" value={form.departamento} onChange={handleChange} placeholder="Ej: Valle del Cauca" className={INPUT_CLASS} style={INPUT_STYLE} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#8b949e' }}>Dirección</label>
            <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Ej: Calle 10 # 5-32" className={INPUT_CLASS} style={INPUT_STYLE} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#8b949e' }}>Horario de atención</label>
            <input name="horario" value={form.horario} onChange={handleChange} placeholder="Ej: Lunes a Sábado 8am-6pm" className={INPUT_CLASS} style={INPUT_STYLE} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#8b949e' }}>Teléfono</label>
              <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="300 000 0000" className={INPUT_CLASS} style={INPUT_STYLE} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#8b949e' }}>Contacto / Responsable</label>
              <input name="contacto" value={form.contacto} onChange={handleChange} placeholder="Nombre del responsable" className={INPUT_CLASS} style={INPUT_STYLE} />
            </div>
          </div>

          <p className="text-xs rounded-lg p-3" style={{ color: '#8b949e', background: '#0d1117' }}>
            Tu registro sera revisado por el equipo de coordinación antes de publicarse.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full font-semibold py-3 rounded-xl text-white transition-colors disabled:opacity-60 text-sm"
            style={{ background: isAlbergue ? '#16a34a' : '#1d4ed8' }}
          >
            {loading ? 'Enviando...' : `Registrar ${isAlbergue ? 'Albergue' : 'Punto de Acopio'}`}
          </button>
        </form>
      </div>
    </div>
  )
}
