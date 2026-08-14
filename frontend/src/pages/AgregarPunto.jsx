import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getEmergencias, submitPuntoPublico } from '../api'

const INPUT_CLASS =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md text-center">
          <div className="text-5xl mb-4">{isAlbergue ? '🏠' : '📦'}</div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Solicitud enviada</h2>
          <p className="text-gray-600 mb-2">
            Tu {isAlbergue ? 'albergue' : 'punto de acopio'} fue registrado.
            El equipo lo revisara y activara pronto.
          </p>
          <p className="text-sm text-gray-400">Redirigiendo al inicio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-lg mx-auto px-4">
        <Link to="/" className="text-blue-700 hover:text-blue-900 text-sm">← Volver al inicio</Link>

        <div className="mt-4 mb-6 flex items-center gap-3">
          <span className="text-3xl">{isAlbergue ? '🏠' : '📦'}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isAlbergue ? 'Registrar Albergue' : 'Registrar Punto de Acopio'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {isAlbergue
                ? 'Reporta un lugar donde las personas pueden refugiarse'
                : 'Reporta un lugar donde se pueden llevar donaciones'}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emergencia relacionada</label>
            <select name="emergencia_id" value={form.emergencia_id} onChange={handleChange} className={INPUT_CLASS}>
              <option value="">Sin emergencia específica</option>
              {emergencias.map((em) => (
                <option key={em.id} value={em.id}>{em.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del {isAlbergue ? 'albergue' : 'punto'} *
            </label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              placeholder={isAlbergue ? 'Ej: Coliseo Municipal San José' : 'Ej: Iglesia San Pedro'}
              className={INPUT_CLASS}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
              <input name="ciudad" value={form.ciudad} onChange={handleChange} required placeholder="Ej: Cali" className={INPUT_CLASS} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
              <input name="departamento" value={form.departamento} onChange={handleChange} placeholder="Ej: Valle del Cauca" className={INPUT_CLASS} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Ej: Calle 10 # 5-32" className={INPUT_CLASS} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Horario de atención</label>
            <input name="horario" value={form.horario} onChange={handleChange} placeholder="Ej: Lunes a Sábado 8am-6pm" className={INPUT_CLASS} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="300 000 0000" className={INPUT_CLASS} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contacto / Responsable</label>
              <input name="contacto" value={form.contacto} onChange={handleChange} placeholder="Nombre del responsable" className={INPUT_CLASS} />
            </div>
          </div>

          <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
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
