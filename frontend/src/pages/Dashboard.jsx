import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getEmergencias, getSolicitudes, getPuntosAcopio } from '../api'
import api from '../api'

delete L.Icon.Default.prototype._getIconUrl

function pin(color) {
  return L.divIcon({
    html: `<div style="width:32px;height:32px;background:${color};border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.5);"></div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  })
}

const C = {
  dark: '#0d1117',
  card: '#161b22',
  border: '#30363d',
  text: '#f0f6fc',
  muted: '#8b949e',
  blue: '#1d4ed8',
  blueLight: '#58a6ff',
  green: '#16a34a',
  greenLight: '#4ade80',
  red: '#dc2626',
  redLight: '#f87171',
}

const IcoHome = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
)

const IcoBox = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4z" />
  </svg>
)

const IcoHeart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
)

const IcoSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const IcoPin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
  </svg>
)

const IcoGrid = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z" />
  </svg>
)

const IcoPerson = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
)

const navLink = (active) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
  textDecoration: 'none',
  color: active ? C.blueLight : C.muted,
  fontSize: 10,
  fontWeight: active ? 600 : 400,
})

export default function Dashboard() {
  const [emergencias, setEmergencias] = useState([])
  const [selectedEmergencia, setSelectedEmergencia] = useState('')
  const [solicitudes, setSolicitudes] = useState([])
  const [puntos, setPuntos] = useState([])
  const [refugios, setRefugios] = useState([])
  const [search, setSearch] = useState('')
  const [voluntariosCount, setVoluntariosCount] = useState(0)

  useEffect(() => {
    api.get('/voluntarios').then(r => setVoluntariosCount(r.data.length)).catch(() => {})
  }, [])

  useEffect(() => {
    getEmergencias()
      .then(data => {
        setEmergencias(data)
        if (data.length) setSelectedEmergencia(String(data[0].id))
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedEmergencia) return
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
      .catch(() => {})
  }, [selectedEmergencia])

  const urgentes = solicitudes.filter(s => s.prioridad === 'alta').length
  const emergenciaActiva = emergencias[0]

  return (
    <div style={{ background: C.dark, minHeight: '100vh', color: C.text, fontFamily: 'system-ui,-apple-system,sans-serif', paddingBottom: 100 }}>

      {/* Header */}
      <div style={{ padding: '24px 18px 10px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Encuentra ayuda</h1>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 4, marginBottom: 0 }}>Colombia</p>
        </div>
      </div>

      {/* Emergency alert notifications */}
      {emergencias.length > 0 && (
        <div style={{ padding: '0 18px 4px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {emergencias.map(em => (
            <div key={em.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(220,38,38,0.08)',
              border: '1px solid rgba(220,38,38,0.25)',
              borderRadius: 12, padding: '10px 14px',
            }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', border: '2px solid #ef4444', animation: 'pulse-ring 1.5s ease-out infinite' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fca5a5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{em.nombre}</div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>
                  {[em.tipo, em.departamento, em.municipio].filter(Boolean).join(' · ')}
                </div>
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 20, background: 'rgba(220,38,38,0.25)', color: '#f87171', flexShrink: 0 }}>ACTIVA</span>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div style={{ padding: '6px 18px 16px' }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: C.muted, display: 'flex', flexShrink: 0 }}>
            <IcoSearch />
          </span>
          <input
            style={{ background: 'none', border: 'none', outline: 'none', color: C.text, fontSize: 14, width: '100%' }}
            placeholder="Buscar albergues, acopio, ayuda..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Urgentes alert banner */}
      {urgentes > 0 && (
        <Link to="/ayudas" style={{ display: 'block', margin: '0 18px 16px', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg,#7f1d1d,#dc2626)',
            borderRadius: 14, padding: '13px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white', animation: 'pulse 1.5s infinite' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'white' }}>
                  {urgentes} solicitud{urgentes > 1 ? 'es' : ''} urgente{urgentes > 1 ? 's' : ''}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
                  Personas necesitan ayuda ahora
                </div>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </div>
        </Link>
      )}

      {/* Map */}
      <div style={{ margin: '0 18px', borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.border}` }}>
        <MapContainer center={[4.5, -74.0]} zoom={6} style={{ height: 240 }} zoomControl={false}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; CartoDB"
          />
          {solicitudes.filter(s => s.lat && s.lng).map(s => (
            <Marker key={'s' + s.id} position={[s.lat, s.lng]} icon={pin('#ef4444')}>
              <Popup><b>{s.ciudad}</b><br />{s.descripcion}</Popup>
            </Marker>
          ))}
          {puntos.filter(p => p.lat && p.lng).map(p => (
            <Marker key={'p' + p.id} position={[p.lat, p.lng]} icon={pin('#22c55e')}>
              <Popup><b>{p.nombre}</b><br />{p.ciudad}</Popup>
            </Marker>
          ))}
          {refugios.filter(r => r.lat && r.lng).map(r => (
            <Marker key={'r' + r.id} position={[r.lat, r.lng]} icon={pin('#3b82f6')}>
              <Popup><b>{r.nombre}</b><br />{r.ciudad}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Actions */}
      <div style={{ padding: '22px 18px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1.2 }}>
          Que necesitas?
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          {/* Albergues */}
          <Link
            to="/albergues"
            style={{ background: 'linear-gradient(135deg,#1e3a5f,#1d4ed8)', borderRadius: 18, padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 10, textDecoration: 'none', position: 'relative', overflow: 'hidden', minHeight: 124 }}
          >
            {refugios.length > 0 && (
              <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.4)', color: '#93c5fd', borderRadius: 20, padding: '2px 9px', fontSize: 11, fontWeight: 700 }}>
                {refugios.length}
              </div>
            )}
            <span style={{ color: 'rgba(255,255,255,0.9)', display: 'flex' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>Albergues</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 3 }}>
                {refugios.length ? `${refugios.length} disponibles` : 'Lugares seguros'}
              </div>
            </div>
          </Link>

          {/* Acopio */}
          <Link
            to="/acopio"
            style={{ background: 'linear-gradient(135deg,#14532d,#16a34a)', borderRadius: 18, padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 10, textDecoration: 'none', position: 'relative', overflow: 'hidden', minHeight: 124 }}
          >
            {puntos.length > 0 && (
              <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.4)', color: '#86efac', borderRadius: 20, padding: '2px 9px', fontSize: 11, fontWeight: 700 }}>
                {puntos.length}
              </div>
            )}
            <span style={{ color: 'rgba(255,255,255,0.9)', display: 'flex' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4z" />
              </svg>
            </span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>Acopio</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 3 }}>
                {puntos.length ? `${puntos.length} puntos activos` : 'Puntos de donacion'}
              </div>
            </div>
          </Link>
        </div>

        {/* Pide Ayuda â€” full width */}
        <Link
          to="/solicitar"
          style={{ background: 'linear-gradient(135deg,#7c2d12,#dc2626)', borderRadius: 18, padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 18, textDecoration: 'none', marginBottom: 10 }}
        >
          <span style={{ color: 'rgba(255,255,255,0.9)', display: 'flex', flexShrink: 0 }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: -0.3 }}>Pide Ayuda</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 3 }}>
              {urgentes ? `${urgentes} solicitudes urgentes activas` : 'Registra tu solicitud ahora'}
            </div>
          </div>
          {urgentes > 0 && (
            <div style={{ background: 'rgba(0,0,0,0.35)', color: '#fca5a5', borderRadius: 20, padding: '4px 13px', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
              {urgentes}
            </div>
          )}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>

      {/* Recent solicitudes — all priorities, most recent first */}
      {solicitudes.length > 0 && (
        <div style={{ padding: '20px 18px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Solicitudes recientes</span>
            <Link to="/ayudas" style={{ fontSize: 12, color: C.blueLight, textDecoration: 'none' }}>Ver todas</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {solicitudes.filter(s => s.estado !== 'cubierto').slice(0, 3).map(s => {
              return (
                <Link key={s.id} to="/ayudas" style={{ textDecoration: 'none' }}>
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#58a6ff', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.ciudad}{s.departamento ? `, ${s.departamento}` : ''}
                      </div>
                      {s.descripcion && (
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {s.descripcion}
                        </div>
                      )}
                      {s.items?.length > 0 && (
                        <div style={{ fontSize: 11, color: '#f59e0b', marginTop: 2 }}>
                          {s.items.slice(0, 2).map(it => it.producto).join(', ')}{s.items.length > 2 ? '...' : ''}
                        </div>
                      )}
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={C.muted}>
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                    </svg>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Voluntariado card */}
      <div style={{ padding: '20px 18px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Voluntariado</span>
          <Link to="/voluntariado" style={{ fontSize: 12, color: C.blueLight, textDecoration: 'none' }}>Ver todos</Link>
        </div>
        <Link to="/voluntariado" style={{ textDecoration: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg,#1e3a5f,#7c3aed)', borderRadius: 16, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, width: 46, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'white' }}>Ser Voluntario</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 3 }}>
                {voluntariosCount > 0 ? `${voluntariosCount} oportunidades activas` : 'Suma tu esfuerzo a Colombia'}
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </Link>
      </div>

    </div>
  )
}
