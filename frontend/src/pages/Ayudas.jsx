import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getSolicitudes, getEmergencias } from '../api'

const dark = '#0d1117'
const card = '#161b22'
const border = '#30363d'
const text = '#f0f6fc'
const muted = '#8b949e'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `Hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `Hace ${hrs} h`
  const days = Math.floor(hrs / 24)
  return `Hace ${days} dia${days > 1 ? 's' : ''}`
}

function buildWhatsApp(solicitud) {
  const raw = solicitud.contacto || ''
  const digits = raw.replace(/\D/g, '')
  if (!digits || digits.length < 7) return null
  const phone = digits.startsWith('57') ? digits : `57${digits.replace(/^0/, '')}`
  const items = solicitud.items?.map(i => `- ${i.producto}${i.cantidad ? ` (${i.cantidad} ${i.unidad || ''})`.trim() : ''}`).join('\n') || ''
  const msg = `Hola ${solicitud.nombre_solicitante || ''}! Vi tu solicitud de ayuda en AyudaColombia.online 🇨🇴\n\n📍 ${solicitud.ciudad}${solicitud.departamento ? `, ${solicitud.departamento}` : ''}\n${items ? `\nNecesitas:\n${items}\n` : ''}\nQuiero ayudarte. ¿Cómo puedo coordinar la entrega?`
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
}

const PRIORITY = {
  alta:  { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',  label: 'Urgente' },
  media: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'Media' },
  baja:  { color: '#22c55e', bg: 'rgba(34,197,94,0.15)',  label: 'Baja' },
}

const STATUS_STEPS = [
  { key: 'pendiente',  label: 'Recibida'  },
  { key: 'en_proceso', label: 'En proceso' },
  { key: 'cubierto',   label: 'Cubierta'  },
]

function stepIndex(estado) {
  if (estado === 'cubierto')   return 2
  if (estado === 'en_proceso') return 1
  return 0
}

const IcoCheck = ({ done, active }) => (
  <div style={{
    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
    background: done ? (active ? '#22c55e' : '#1d4ed8') : 'transparent',
    border: `2px solid ${done ? (active ? '#22c55e' : '#1d4ed8') : border}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    {done && (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
      </svg>
    )}
  </div>
)

function Checklist({ estado }) {
  const current = stepIndex(estado)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 10 }}>
      {STATUS_STEPS.map((step, i) => (
        <div key={step.key} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <IcoCheck done={i <= current} active={i === current} />
            <span style={{ fontSize: 9, color: i <= current ? (i === current ? '#22c55e' : '#58a6ff') : muted, whiteSpace: 'nowrap' }}>
              {step.label}
            </span>
          </div>
          {i < 2 && (
            <div style={{
              flex: 1, height: 2, margin: '0 4px', marginBottom: 14,
              background: i < current ? '#1d4ed8' : border,
              borderRadius: 2,
            }} />
          )}
        </div>
      ))}
    </div>
  )
}

const TABS = ['urgentes', 'en_proceso', 'todas']
const TAB_LABELS = { urgentes: 'Urgentes', en_proceso: 'En proceso', todas: 'Todas' }

export default function Ayudas() {
  const [solicitudes, setSolicitudes] = useState([])
  const [emergencias, setEmergencias] = useState([])
  const [emergenciaId, setEmergenciaId] = useState('')
  const [tab, setTab] = useState('urgentes')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEmergencias()
      .then(data => { setEmergencias(data); if (data.length) setEmergenciaId(String(data[0].id)) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    getSolicitudes(emergenciaId ? { emergencia_id: emergenciaId } : {})
      .then(data => setSolicitudes(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [emergenciaId])

  const filtered = solicitudes.filter(s => {
    if (tab === 'urgentes')   return s.prioridad === 'alta' && s.estado !== 'cubierto'
    if (tab === 'en_proceso') return s.estado === 'en_proceso'
    return true
  })

  const counts = {
    urgentes:   solicitudes.filter(s => s.prioridad === 'alta' && s.estado !== 'cubierto').length,
    en_proceso: solicitudes.filter(s => s.estado === 'en_proceso').length,
    todas:      solicitudes.length,
  }

  return (
    <div style={{ background: dark, minHeight: '100vh', color: text, fontFamily: 'system-ui,-apple-system,sans-serif', paddingBottom: 100 }}>

      {/* Header */}
      <div style={{ padding: '20px 18px 0', borderBottom: `1px solid ${border}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Ayudas</h1>
            <p style={{ fontSize: 12, color: muted, marginTop: 4, marginBottom: 0 }}>
              {filtered.length} solicitudes activas
            </p>
          </div>
          <Link
            to="/solicitar"
            style={{ background: '#dc2626', color: 'white', textDecoration: 'none', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 700, flexShrink: 0 }}
          >
            + Pedir ayuda
          </Link>
        </div>

        {/* Emergency notification cards */}
        {emergencias.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
            {emergencias.map(em => {
              const isSelected = emergenciaId === String(em.id)
              return (
                <button
                  key={em.id}
                  onClick={() => setEmergenciaId(isSelected ? '' : String(em.id))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: isSelected ? 'rgba(220,38,38,0.12)' : 'rgba(220,38,38,0.05)',
                    border: `1px solid ${isSelected ? 'rgba(220,38,38,0.5)' : 'rgba(220,38,38,0.2)'}`,
                    borderRadius: 10, padding: '9px 12px',
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                  }}
                >
                  {/* Pulsing dot */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
                    <div style={{
                      position: 'absolute', inset: -3,
                      borderRadius: '50%', border: '2px solid #ef4444',
                      animation: 'pulse-ring 1.5s ease-out infinite',
                      opacity: isSelected ? 1 : 0.6,
                    }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fca5a5', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {em.nombre}
                    </div>
                    <div style={{ fontSize: 10, color: muted, marginTop: 2 }}>
                      {[em.tipo, em.departamento, em.municipio].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 20, flexShrink: 0,
                    background: isSelected ? '#dc2626' : 'rgba(220,38,38,0.2)',
                    color: isSelected ? 'white' : '#f87171',
                  }}>
                    {isSelected ? 'ACTIVA ✓' : 'ACTIVA'}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: -1 }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '10px 4px', fontSize: 12, fontWeight: 600,
                background: 'none', border: 'none', cursor: 'pointer',
                color: tab === t ? '#f0f6fc' : muted,
                borderBottom: tab === t ? '2px solid #1d4ed8' : '2px solid transparent',
              }}
            >
              {TAB_LABELS[t]}
              {counts[t] > 0 && (
                <span style={{
                  marginLeft: 5, background: t === 'urgentes' ? '#dc2626' : '#30363d',
                  color: t === 'urgentes' ? 'white' : muted,
                  borderRadius: 20, padding: '1px 7px', fontSize: 10,
                }}>
                  {counts[t]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ padding: '14px 18px 0' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: muted, fontSize: 14 }}>Cargando...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill={border} style={{ marginBottom: 12 }}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <p style={{ color: muted, fontSize: 14 }}>No hay solicitudes en esta categoria</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(s => {
              const p = PRIORITY[s.prioridad] || PRIORITY.baja
              return (
                <div key={s.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: '15px 16px' }}>

                  {/* Top row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: text }}>
                        {s.ciudad}{s.departamento ? `, ${s.departamento}` : ''}
                      </div>
                      <div style={{ fontSize: 11, color: muted, marginTop: 3 }}>{timeAgo(s.created_at)}</div>
                    </div>
                    <span style={{ background: p.bg, color: p.color, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                      {p.label}
                    </span>
                  </div>

                  {/* Description */}
                  {s.descripcion && (
                    <p style={{ fontSize: 13, color: muted, margin: '0 0 10px', lineHeight: 1.5 }}>{s.descripcion}</p>
                  )}

                  {/* Items needed */}
                  {s.items?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                      {s.items.map((it, i) => (
                        <span key={i} style={{ background: '#21262d', color: '#c9d1d9', borderRadius: 8, padding: '3px 10px', fontSize: 11 }}>
                          {it.producto}{it.cantidad ? `: ${it.cantidad}` : ''}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Progress checklist */}
                  <Checklist estado={s.estado} />

                  {/* Bottom action */}
                  {s.estado !== 'cubierto' && (
                    <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontSize: 12, color: muted }}>
                        {s.nombre_solicitante ? s.nombre_solicitante : 'Anonimo'}
                      </span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {buildWhatsApp(s) && (
                          <a
                            href={buildWhatsApp(s)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ background: '#16a34a', color: 'white', textDecoration: 'none', borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.117 1.522 5.847L.057 23.143a.5.5 0 0 0 .6.6l5.297-1.465A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.67-.523-5.186-1.432l-.369-.219-3.843 1.063 1.024-3.75-.24-.386A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                            </svg>
                            WhatsApp
                          </a>
                        )}
                        <Link
                          to="/acopio"
                          style={{ background: '#1d4ed8', color: 'white', textDecoration: 'none', borderRadius: 10, padding: '6px 12px', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}
                        >
                          Donar
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
