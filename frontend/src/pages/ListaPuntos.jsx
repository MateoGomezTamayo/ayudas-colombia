import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPuntosAcopio, getEmergencias } from '../api'

const dark = '#0d1117'
const card = '#161b22'
const border = '#30363d'
const text = '#f0f6fc'
const muted = '#8b949e'

const IcoPlus = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
)

const IcoPhone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
)

const IcoClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
  </svg>
)

const IcoLocation = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
)

export default function ListaPuntos({ tipo = 'acopio' }) {
  const isAlbergue = tipo === 'refugio'
  const [puntos, setPuntos] = useState([])
  const [emergencias, setEmergencias] = useState([])
  const [emergenciaId, setEmergenciaId] = useState('')
  const [loading, setLoading] = useState(true)

  const accentColor = isAlbergue ? '#1d4ed8' : '#16a34a'
  const addTo = isAlbergue ? '/agregar-albergue' : '/agregar-acopio'
  const title = isAlbergue ? 'Albergues' : 'Puntos de Acopio'
  const emptyMsg = isAlbergue
    ? 'No hay albergues registrados aun'
    : 'No hay puntos de acopio registrados aun'

  useEffect(() => {
    getEmergencias()
      .then(data => { setEmergencias(data); if (data.length) setEmergenciaId(String(data[0].id)) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    getPuntosAcopio({ tipo, ...(emergenciaId ? { emergencia_id: emergenciaId } : {}) })
      .then(data => setPuntos(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [tipo, emergenciaId])

  return (
    <div style={{ background: dark, minHeight: '100vh', color: text, fontFamily: 'system-ui,-apple-system,sans-serif', paddingBottom: 100 }}>

      {/* Header */}
      <div style={{ padding: '20px 18px 16px', borderBottom: `1px solid ${border}` }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{title}</h1>
        <p style={{ fontSize: 12, color: muted, marginTop: 4, marginBottom: 0 }}>
          {puntos.length} {isAlbergue ? 'albergues disponibles' : 'puntos activos'}
        </p>
      </div>

      {/* Live map banner — solo para acopio */}
      {!isAlbergue && (
        <a
          href="https://www.google.com/maps/@4.8004247,-74.2817011,11z/data=!4m3!11m2!2sXJQY-o3hsph0A1kkDaEESw!3e3"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 18px 0', background: '#161b22', border: '1px solid #30363d', borderRadius: 12, padding: '12px 14px', textDecoration: 'none' }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: text }}>145+ puntos en tiempo real</div>
            <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>Ver mapa completo en Google Maps</div>
          </div>
          <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill={muted}>
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </a>
      )}

      {/* Emergency filter */}
      {emergencias.length > 1 && (
        <div style={{ padding: '12px 18px' }}>
          <select
            value={emergenciaId}
            onChange={e => setEmergenciaId(e.target.value)}
            style={{ background: card, border: `1px solid ${border}`, borderRadius: 10, padding: '9px 12px', color: text, fontSize: 13, width: '100%', outline: 'none' }}
          >
            <option value="">Todas las emergencias</option>
            {emergencias.map(em => <option key={em.id} value={em.id}>{em.nombre}</option>)}
          </select>
        </div>
      )}

      {/* List */}
      <div style={{ padding: '12px 18px 0' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: muted, fontSize: 14 }}>
            Cargando...
          </div>
        ) : puntos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.3 }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill={muted}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
            </div>
            <p style={{ color: muted, fontSize: 14, margin: 0 }}>{emptyMsg}</p>
            <Link to={addTo} style={{ display: 'inline-block', marginTop: 16, background: accentColor, color: 'white', textDecoration: 'none', padding: '10px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600 }}>
              Registrar {isAlbergue ? 'albergue' : 'punto'}
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {puntos.map(p => (
              <div key={p.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, overflow: 'hidden' }}>
                {/* Card header */}
                <div style={{ background: accentColor, padding: '14px 16px' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'white' }}>{p.nombre}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <IcoLocation />
                    {p.ciudad}{p.departamento ? `, ${p.departamento}` : ''}
                  </div>
                </div>
                {/* Card body */}
                <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {p.direccion && (
                    <div style={{ fontSize: 13, color: muted, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <IcoLocation />
                      <span>{p.direccion}</span>
                    </div>
                  )}
                  {p.horario && (
                    <div style={{ fontSize: 13, color: muted, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <IcoClock />
                      <span>{p.horario}</span>
                    </div>
                  )}
                  {p.telefono && (
                    <div style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <IcoPhone />
                      <a href={`tel:${p.telefono}`} style={{ color: '#58a6ff', textDecoration: 'none', fontWeight: 500 }}>{p.telefono}</a>
                    </div>
                  )}
                  {p.contacto && p.contacto.startsWith('http') ? null : p.contacto && (
                    <div style={{ fontSize: 12, color: muted }}>Contacto: {p.contacto}</div>
                  )}

                  {/* Navigation buttons */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${border}` }}>
                    <a
                      href={p.lat && p.lng
                        ? `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`
                        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((p.direccion || '') + ' ' + p.ciudad)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ flex: 1, background: '#1a56db', color: 'white', textDecoration: 'none', borderRadius: 10, padding: '8px 10px', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      Google Maps
                    </a>
                    <a
                      href={p.lat && p.lng
                        ? `https://waze.com/ul?ll=${p.lat},${p.lng}&navigate=yes`
                        : `https://waze.com/ul?q=${encodeURIComponent((p.direccion || '') + ' ' + p.ciudad)}&navigate=yes`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ flex: 1, background: '#00d1ff20', color: '#00d1ff', border: '1px solid #00d1ff40', textDecoration: 'none', borderRadius: 10, padding: '8px 10px', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
                      </svg>
                      Waze
                    </a>
                    {p.contacto && p.contacto.startsWith('http') && (
                      <a
                        href={p.contacto}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ flex: 1, background: '#16a34a20', color: '#4ade80', border: '1px solid #16a34a40', textDecoration: 'none', borderRadius: 10, padding: '8px 10px', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.117 1.522 5.847L.057 23.143a.5.5 0 0 0 .6.6l5.297-1.465A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.67-.523-5.186-1.432l-.369-.219-3.843 1.063 1.024-3.75-.24-.386A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                        </svg>
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB to add */}
      <Link
        to={addTo}
        style={{
          position: 'fixed', bottom: 90, right: 20,
          background: accentColor, borderRadius: '50%',
          width: 56, height: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', textDecoration: 'none',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          zIndex: 100,
        }}
      >
        <IcoPlus />
      </Link>
    </div>
  )
}
