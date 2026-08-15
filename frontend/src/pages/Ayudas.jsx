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
              {emergencias[0]?.nombre || 'Solicitudes activas'}
            </p>
          </div>
          <Link
            to="/solicitar"
            style={{ background: '#dc2626', color: 'white', textDecoration: 'none', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 700, flexShrink: 0 }}
          >
            + Pedir ayuda
          </Link>
        </div>

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
                    <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: muted }}>
                        {s.nombre_solicitante ? `Solicitado por ${s.nombre_solicitante}` : 'Anonimo'}
                      </span>
                      <Link
                        to="/acopio"
                        style={{ background: '#1d4ed8', color: 'white', textDecoration: 'none', borderRadius: 10, padding: '6px 14px', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}
                      >
                        Ayudar
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                        </svg>
                      </Link>
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
