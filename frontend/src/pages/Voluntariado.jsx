import { useState, useEffect } from 'react'
import api from '../api'

const dark = '#0d1117'
const card = '#161b22'
const border = '#30363d'
const text = '#f0f6fc'
const muted = '#8b949e'

const TIPO_STYLE = {
  presencial: { bg: '#1e3a5f', color: '#60a5fa', label: 'Presencial' },
  transporte:  { bg: '#14532d', color: '#4ade80', label: 'Transporte' },
  virtual:     { bg: '#312e81', color: '#a5b4fc', label: 'Virtual' },
}

const IcoHand = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 7.5a2.5 2.5 0 0 0-2.5-2.5c-.3 0-.6.05-.87.15A2.5 2.5 0 0 0 15.5 3c-.62 0-1.19.22-1.63.58A2.5 2.5 0 0 0 9.5 5c-.3 0-.6.05-.87.15A2.5 2.5 0 0 0 4 7.5v8.69l-1.87-1.87L.7 15.74 4.63 19.67A8 8 0 0 0 10.3 22H14a8 8 0 0 0 8-8V7.5zM20 14a6 6 0 0 1-6 6h-3.7a6 6 0 0 1-4.25-1.76L4 16.17V7.5C4 6.67 4.67 6 5.5 6S7 6.67 7 7.5V12h2V5.5C9 4.67 9.67 4 10.5 4S12 4.67 12 5.5V12h2V5.5c0-.83.67-1.5 1.5-1.5S17 4.67 17 5.5V12h2V7.5c0-.83.67-1.5 1.5-1.5S22 6.67 22 7.5"/>
  </svg>
)

export default function Voluntariado() {
  const [voluntarios, setVoluntarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('todos')

  useEffect(() => {
    api.get('/voluntarios')
      .then(r => setVoluntarios(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtrado = tab === 'todos' ? voluntarios : voluntarios.filter(v => v.tipo === tab)

  return (
    <div style={{ background: dark, minHeight: '100vh', color: text, fontFamily: 'system-ui,-apple-system,sans-serif', paddingBottom: 100 }}>

      {/* Header */}
      <div style={{ padding: '20px 18px 0', borderBottom: `1px solid ${border}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Voluntariado</h1>
            <p style={{ fontSize: 12, color: muted, marginTop: 4, marginBottom: 0 }}>
              {voluntarios.length} oportunidades activas
            </p>
          </div>
          <a
            href="https://docs.google.com/spreadsheets/d/1-hMGwC0XaSu5ddZ896gYyVRpmbPkVYg3NJ_6rSxK4Y8/htmlview"
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: '#1d4ed820', color: '#58a6ff', border: '1px solid #1d4ed840', borderRadius: 10, padding: '6px 12px', fontSize: 11, fontWeight: 600, textDecoration: 'none', flexShrink: 0 }}
          >
            Ver hoja en tiempo real
          </a>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0 }}>
          {[['todos', 'Todos'], ['presencial', 'Presencial'], ['transporte', 'Transporte']].map(([t, l]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1, padding: '10px 4px', fontSize: 12, fontWeight: 600,
                background: 'none', border: 'none', cursor: 'pointer',
                color: tab === t ? text : muted,
                borderBottom: tab === t ? '2px solid #58a6ff' : '2px solid transparent',
              }}
            >{l}</button>
          ))}
        </div>
      </div>

      {/* Banner hoja en tiempo real */}
      <a
        href="https://docs.google.com/spreadsheets/d/1-hMGwC0XaSu5ddZ896gYyVRpmbPkVYg3NJ_6rSxK4Y8/htmlview"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 18px 0', background: '#161b22', border: '1px solid #30363d', borderRadius: 12, padding: '12px 14px', textDecoration: 'none' }}
      >
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: text }}>Hoja en tiempo real - Bogota</div>
          <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>60+ puntos de voluntariado actualizados en vivo</div>
        </div>
        <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill={muted}>
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </a>

      {/* List */}
      <div style={{ padding: '14px 18px 0' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: muted }}>Cargando...</div>
        ) : filtrado.map(v => {
          const t = TIPO_STYLE[v.tipo] || TIPO_STYLE.presencial
          return (
            <div key={v.id} style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, marginBottom: 12, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '13px 16px', borderBottom: `1px solid ${border}` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: text, lineHeight: 1.3 }}>{v.nombre}</div>
                  <span style={{ background: t.bg, color: t.color, borderRadius: 20, padding: '2px 10px', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{t.label}</span>
                </div>
                {v.ciudad && (
                  <div style={{ fontSize: 12, color: muted, marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                    {v.ciudad}
                  </div>
                )}
              </div>

              {/* Body */}
              <div style={{ padding: '12px 16px' }}>
                {v.descripcion && (
                  <p style={{ fontSize: 13, color: '#c9d1d9', margin: '0 0 12px', lineHeight: 1.5 }}>{v.descripcion}</p>
                )}

                {/* Action buttons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {v.link_inscripcion && (
                    <a href={v.link_inscripcion} target="_blank" rel="noopener noreferrer"
                      style={{ background: '#1d4ed8', color: 'white', textDecoration: 'none', borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 600 }}>
                      Inscribirme
                    </a>
                  )}
                  {v.whatsapp && (
                    <a href={v.whatsapp} target="_blank" rel="noopener noreferrer"
                      style={{ background: '#16a34a20', color: '#4ade80', border: '1px solid #16a34a40', textDecoration: 'none', borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 600 }}>
                      Unirse al WhatsApp
                    </a>
                  )}
                  {v.instagram && (
                    <a href={`https://instagram.com/${v.instagram}`} target="_blank" rel="noopener noreferrer"
                      style={{ background: '#9333ea20', color: '#c084fc', border: '1px solid #9333ea40', textDecoration: 'none', borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 600 }}>
                      Instagram
                    </a>
                  )}
                  {v.telefono && (
                    <a href={`tel:${v.telefono}`}
                      style={{ background: '#0f172a', color: '#58a6ff', border: `1px solid ${border}`, textDecoration: 'none', borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 600 }}>
                      {v.telefono}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
