import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getEmergencias, getSolicitudes, getPuntosAcopio } from '../api'
import SolicitudCard from '../components/SolicitudCard'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const PRIORITY_COLORS = { alta: '#dc2626', media: '#ea580c', baja: '#16a34a' }

function createPriorityIcon(prioridad) {
  const color = PRIORITY_COLORS[prioridad] || '#6b7280'
  return L.divIcon({
    html: `<div style="background:${color};width:16px;height:16px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

function createPuntoIcon() {
  return L.divIcon({
    html: '<div style="background:#1d4ed8;width:22px;height:22px;border-radius:4px;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-size:13px;line-height:1;">&#128246;</div>',
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  })
}

export default function Dashboard() {
  const [emergencias, setEmergencias] = useState([])
  const [selectedEmergencia, setSelectedEmergencia] = useState('')
  const [solicitudes, setSolicitudes] = useState([])
  const [puntos, setPuntos] = useState([])
  const [refugios, setRefugios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getEmergencias()
      .then((data) => {
        setEmergencias(data)
        if (data.length > 0) setSelectedEmergencia(String(data[0].id))
      })
      .catch(() => setError('No se pudieron cargar las emergencias'))
  }, [])

  useEffect(() => {
    if (!selectedEmergencia) return
    setLoading(true)
    setError(null)
    Promise.all([
      getSolicitudes({ emergencia_id: selectedEmergencia }),
      getPuntosAcopio({ emergencia_id: selectedEmergencia, tipo: 'acopio' }),
      getPuntosAcopio({ emergencia_id: selectedEmergencia, tipo: 'refugio' }),
    ])
      .then(([sol, pts, refs]) => {
        setSolicitudes(sol)
        setPuntos(pts)
        setRefugios(refs)
      })
      .catch(() => setError('Error cargando datos de la emergencia'))
      .finally(() => setLoading(false))
  }, [selectedEmergencia])

  const stats = {
    total: solicitudes.length,
    alta: solicitudes.filter((s) => s.prioridad === 'alta').length,
    en_proceso: solicitudes.filter((s) => s.estado === 'en_proceso').length,
    cubiertos: solicitudes.filter((s) => s.estado === 'cubierto').length,
  }

  const urgentes = solicitudes.filter((s) => s.prioridad === 'alta').slice(0, 6)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-white py-8 px-4" style={{ background: 'linear-gradient(135deg, #003893 0%, #1d4ed8 100%)' }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Sistema de Ayudas Humanitarias Colombia</h1>
          <p className="text-blue-200 text-sm mb-4">Coordinacion de ayuda en emergencias nacionales</p>
          <div className="flex flex-wrap items-center gap-3">
            <label className="font-medium text-sm text-blue-100">Emergencia activa:</label>
            <select value={selectedEmergencia} onChange={(e) => setSelectedEmergencia(e.target.value)} className="bg-blue-800 text-white border border-blue-600 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400">
              {emergencias.length === 0 && <option value="">Sin emergencias activas</option>}
              {emergencias.map((em) => (<option key={em.id} value={em.id}>{em.nombre}</option>))}
            </select>
          </div>

          <div className="flex flex-wrap gap-3 mt-5">
            <Link to="/solicitar" className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow flex items-center gap-2">
              &#128591; Solicitar Ayuda
            </Link>
            <Link to="/agregar-acopio" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors border border-white/30 flex items-center gap-2">
              &#128246; Agregar Punto de Acopio
            </Link>
            <Link to="/agregar-albergue" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors border border-white/30 flex items-center gap-2">
              &#127968; Agregar Albergue
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{error}</div>}

        {!loading && puntos.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-800">Puntos de Acopio</h2>
              <Link to="/puntos-acopio" className="text-blue-600 hover:underline text-sm">Ver todos</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {puntos.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="bg-blue-600 px-4 py-3">
                    <h3 className="font-bold text-white text-sm">{p.nombre}</h3>
                    <p className="text-blue-200 text-xs mt-0.5">{p.ciudad}{p.departamento ? `, ${p.departamento}` : ''}</p>
                  </div>
                  <div className="px-4 py-3 space-y-1 text-sm text-gray-600">
                    {p.direccion && <p>{p.direccion}</p>}
                    {p.horario && <p>Horario: {p.horario}</p>}
                    {p.telefono && <p>Tel: <a href={`tel:${p.telefono}`} className="text-blue-600">{p.telefono}</a></p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Refugios */}
        {!loading && refugios.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-800">🏠 Refugios</h2>
              <Link to="/puntos-acopio" className="text-blue-600 hover:underline text-sm">Ver todos</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {refugios.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="bg-green-600 px-4 py-3">
                    <h3 className="font-bold text-white text-sm">{p.nombre}</h3>
                    <p className="text-green-200 text-xs mt-0.5">{p.ciudad}{p.departamento ? `, ${p.departamento}` : ''}</p>
                  </div>
                  <div className="px-4 py-3 space-y-1 text-sm text-gray-600">
                    {p.direccion && <p>{p.direccion}</p>}
                    {p.horario && <p>Horario: {p.horario}</p>}
                    {p.telefono && <p>Tel: <a href={`tel:${p.telefono}`} className="text-blue-600">{p.telefono}</a></p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-xs text-gray-500 mt-1">Total Solicitudes</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-red-100 p-4 text-center">
            <div className="text-3xl font-bold text-red-600">{stats.alta}</div>
            <div className="text-xs text-gray-500 mt-1">Alta Prioridad</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.en_proceso}</div>
            <div className="text-xs text-gray-500 mt-1">En Proceso</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-green-100 p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{stats.cubiertos}</div>
            <div className="text-xs text-gray-500 mt-1">Cubiertos</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold text-gray-700 text-sm">Mapa de solicitudes y puntos de acopio</h2>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-600 inline-block" />Alta</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />Media</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-600 inline-block" />Baja</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-700 inline-block" />Punto Acopio</span>
            </div>
          </div>
          <MapContainer center={[4.5, -74.0]} zoom={6} style={{ height: '400px' }}>
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {solicitudes.filter((s) => s.lat && s.lng).map((s) => (
              <Marker key={`sol-${s.id}`} position={[s.lat, s.lng]} icon={createPriorityIcon(s.prioridad)}>
                <Popup>
                  <div className="text-sm space-y-1">
                    <p className="font-semibold">{s.ciudad}{s.departamento ? `, ${s.departamento}` : ''}</p>
                    <p>Prioridad: <span style={{ color: PRIORITY_COLORS[s.prioridad] }}>{s.prioridad}</span></p>
                    {s.descripcion && <p>{s.descripcion}</p>}
                    {s.items && s.items.map((it, i) => <p key={i}>{it.producto}: {it.cantidad} {it.unidad}</p>)}
                  </div>
                </Popup>
              </Marker>
            ))}
            {puntos.filter((p) => p.lat && p.lng).map((p) => (
              <Marker key={`pt-${p.id}`} position={[p.lat, p.lng]} icon={createPuntoIcon()}>
                <Popup>
                  <div className="text-sm space-y-1">
                    <p className="font-semibold">{p.nombre}</p>
                    <p>{p.ciudad}{p.departamento ? `, ${p.departamento}` : ''}</p>
                    {p.direccion && <p>{p.direccion}</p>}
                    {p.horario && <p>Horario: {p.horario}</p>}
                    {p.telefono && <p>Tel: {p.telefono}</p>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Cargando solicitudes...</div>
        ) : urgentes.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Solicitudes urgentes <span className="ml-2 text-sm font-normal text-red-500">({urgentes.length} de alta prioridad)</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {urgentes.map((s) => <SolicitudCard key={s.id} solicitud={s} />)}
            </div>
          </div>
        ) : selectedEmergencia ? (
          <div className="text-center py-12 text-gray-400 text-sm">No hay solicitudes urgentes para esta emergencia</div>
        ) : null}
      </div>

      <Link to="/solicitar" className="fixed bottom-6 right-6 text-white font-semibold px-5 py-3 rounded-full shadow-lg flex items-center gap-2 text-sm" style={{ background: '#16a34a' }}>
        <span className="text-lg leading-none">+</span> Solicitar Ayuda
      </Link>
    </div>
  )
}