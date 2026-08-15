import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getPuntosAcopio, getEmergencias } from '../api'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function createPuntoIcon() {
  return L.divIcon({
    html: `<div style="background:#1d4ed8;width:22px;height:22px;border-radius:4px;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-size:12px;line-height:1;">📦</div>`,
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

export default function PuntosAcopio() {
  const [puntos, setPuntos] = useState([])
  const [emergencias, setEmergencias] = useState([])
  const [filtros, setFiltros] = useState({ ciudad: '', emergencia_id: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getEmergencias().then(setEmergencias).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)
    const params = filtros.emergencia_id ? { emergencia_id: filtros.emergencia_id } : {}
    getPuntosAcopio(params)
      .then(setPuntos)
      .catch(() => setError('Error al cargar los puntos de acopio'))
      .finally(() => setLoading(false))
  }, [filtros.emergencia_id])

  const puntosFiltrados = puntos.filter(
    (p) =>
      !filtros.ciudad ||
      p.ciudad?.toLowerCase().includes(filtros.ciudad.toLowerCase()) ||
      p.departamento?.toLowerCase().includes(filtros.ciudad.toLowerCase())
  )

  return (
    <div className="min-h-screen py-6" style={{ background: '#0d1117' }}>
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#f0f6fc' }}>Puntos de Acopio</h1>
        <p className="text-sm mb-5" style={{ color: '#8b949e' }}>
          Centros de recolección y distribución de ayuda humanitaria
        </p>

        {/* Filters */}
        <div className="rounded-xl p-4 mb-5 flex flex-wrap gap-4" style={{ background: '#161b22', border: '1px solid #30363d' }}>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#8b949e' }}>Emergencia</label>
            <select
              value={filtros.emergencia_id}
              onChange={(e) => setFiltros((f) => ({ ...f, emergencia_id: e.target.value }))}
              className="rounded-lg px-3 py-2 text-sm focus:outline-none min-w-[180px]"
              style={{ background: '#161b22', color: '#f0f6fc', border: '1px solid #30363d' }}
            >
              <option value="">Todas las emergencias</option>
              {emergencias.map((em) => (
                <option key={em.id} value={em.id}>
                  {em.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#8b949e' }}>
              Ciudad / Departamento
            </label>
            <input
              value={filtros.ciudad}
              onChange={(e) => setFiltros((f) => ({ ...f, ciudad: e.target.value }))}
              placeholder="Buscar ciudad..."
              className="rounded-lg px-3 py-2 text-sm focus:outline-none min-w-[200px]"
              style={{ background: '#161b22', color: '#f0f6fc', border: '1px solid #30363d' }}
            />
          </div>
          <div className="flex items-end">
            <span className="text-sm" style={{ color: '#8b949e' }}>
              {puntosFiltrados.length} punto{puntosFiltrados.length !== 1 ? 's' : ''} encontrado
              {puntosFiltrados.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {error && (
          <div className="rounded-lg p-3 mb-4 text-sm" style={{ background: '#1a0a0a', border: '1px solid #dc2626', color: '#f87171' }}>
            {error}
          </div>
        )}

        {/* Map */}
        <div className="rounded-xl overflow-hidden mb-5" style={{ border: '1px solid #30363d' }}>
          <MapContainer center={[4.5, -74.0]} zoom={6} style={{ height: '360px' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {puntosFiltrados
              .filter((p) => p.lat && p.lng)
              .map((p) => (
                <Marker key={p.id} position={[p.lat, p.lng]} icon={createPuntoIcon()}>
                  <Popup>
                    <div className="text-sm space-y-1">
                      <p className="font-semibold">{p.nombre}</p>
                      <p>
                        {p.ciudad}
                        {p.departamento ? `, ${p.departamento}` : ''}
                      </p>
                      {p.direccion && <p>{p.direccion}</p>}
                      {p.horario && <p>Horario: {p.horario}</p>}
                      {p.telefono && <p>Tel: {p.telefono}</p>}
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="text-center py-12 text-sm" style={{ color: '#8b949e' }}>
            Cargando puntos de acopio...
          </div>
        ) : puntosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-sm" style={{ color: '#8b949e' }}>
            No se encontraron puntos de acopio
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {puntosFiltrados.map((p) => (
              <div
                key={p.id}
                className={`rounded-xl p-4 ${p.activo === false ? 'opacity-60' : ''}`}
                style={{ background: '#161b22', border: '1px solid #30363d' }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm" style={{ color: '#f0f6fc' }}>{p.nombre}</h3>
                  {p.activo === false && (
                    <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ background: '#21262d', color: '#8b949e' }}>
                      Inactivo
                    </span>
                  )}
                </div>
                <div className="text-xs space-y-1" style={{ color: '#8b949e' }}>
                  <p>
                    📍{' '}
                    {p.ciudad}
                    {p.departamento ? `, ${p.departamento}` : ''}
                  </p>
                  {p.direccion && <p>🏠 {p.direccion}</p>}
                  {p.horario && <p>🕐 {p.horario}</p>}
                  {p.telefono && <p>📞 {p.telefono}</p>}
                  {p.contacto && <p>👤 {p.contacto}</p>}
                </div>
                {p.acepta?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {p.acepta.map((cat, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: '#1e3a5f', color: '#58a6ff' }}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
