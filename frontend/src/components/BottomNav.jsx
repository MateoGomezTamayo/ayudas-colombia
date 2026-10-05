import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getSolicitudes } from '../api'

const dark = '#0d1117'
const card = '#161b22'

const IcoHome = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
)
const IcoBox = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4z"/>
  </svg>
)
const IcoBed = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 7.5a2.5 2.5 0 0 0-2.5-2.5c-.3 0-.6.05-.87.15A2.5 2.5 0 0 0 15.5 3c-.62 0-1.19.22-1.63.58A2.5 2.5 0 0 0 9.5 5c-.3 0-.6.05-.87.15A2.5 2.5 0 0 0 4 7.5v8.69l-1.87-1.87L.7 15.74 4.63 19.67A8 8 0 0 0 10.3 22H14a8 8 0 0 0 8-8V7.5zM20 14a6 6 0 0 1-6 6h-3.7a6 6 0 0 1-4.25-1.76L4 16.17V7.5C4 6.67 4.67 6 5.5 6S7 6.67 7 7.5V12h2V5.5C9 4.67 9.67 4 10.5 4S12 4.67 12 5.5V12h2V5.5c0-.83.67-1.5 1.5-1.5S17 4.67 17 5.5V12h2V7.5c0-.83.67-1.5 1.5-1.5S22 6.67 22 7.5"/>
  </svg>
)
const IcoHeart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
)

export default function BottomNav() {
  const { pathname } = useLocation()
  const [urgentes, setUrgentes] = useState(0)

  useEffect(() => {
    getSolicitudes()
      .then(data => setUrgentes(data.filter(s => s.prioridad === 'alta' && s.estado !== 'cubierto').length))
      .catch(() => {})
  }, [pathname])

  if (pathname.startsWith('/admin')) return null

  const tab = (active) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    textDecoration: 'none',
    color: active ? '#58a6ff' : '#8b949e',
    paddingTop: 4,
    fontSize: 10,
  })

  return (
    <>
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: card,
      borderTop: '1px solid #21262d',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: 'env(safe-area-inset-bottom, 4px)',
      zIndex: 1000,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', paddingTop: 8, paddingBottom: 4 }}>
      <Link to="/" style={tab(pathname === '/')}>
        <div style={{ position: 'relative' }}>
          <IcoHome />
          {urgentes > 0 && pathname !== '/' && (
            <div style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, background: '#ef4444', borderRadius: '50%', border: '1.5px solid #161b22' }} />
          )}
        </div>
        <span>Inicio</span>
      </Link>

      <Link to="/acopio" style={tab(pathname === '/acopio')}>
        <IcoBox />
        <span>Acopio</span>
      </Link>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <Link to="/solicitar" style={{
          background: '#1d4ed8',
          borderRadius: '50%',
          width: 52, height: 52,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, color: 'white', textDecoration: 'none',
          boxShadow: '0 0 0 5px ' + dark,
          marginTop: -18,
          fontWeight: 300,
          lineHeight: 1,
        }}>+</Link>
      </div>

      <Link to="/voluntariado" style={tab(pathname === '/voluntariado')}>
        <IcoBed />
        <span>Voluntarios</span>
      </Link>

      <Link to="/ayudas" style={tab(pathname === '/ayudas')}>
        <div style={{ position: 'relative' }}>
          <IcoHeart />
          {urgentes > 0 && (
            <div style={{
              position: 'absolute', top: -5, right: -8,
              background: '#ef4444', color: 'white',
              borderRadius: 20, minWidth: 16, height: 16,
              fontSize: 9, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 4px',
              border: '1.5px solid #161b22',
            }}>
              {urgentes > 9 ? '9+' : urgentes}
            </div>
          )}
        </div>
        <span>Ayudas</span>
      </Link>
      </div>
      <div style={{ textAlign: 'center', fontSize: 9, color: '#484f58', paddingBottom: 4, letterSpacing: 0.3 }}>
        powered by <span style={{ color: '#58a6ff', fontWeight: 600 }}>Vextrum Labs</span>
      </div>
    </nav>
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, textAlign: 'center', fontSize: 9, color: '#484f58', paddingBottom: 2, zIndex: 999, pointerEvents: 'none', letterSpacing: 0.3 }}>
      powered by <span style={{ color: '#58a6ff', fontWeight: 600 }}>Vextrum Labs</span>
    </div>
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, textAlign: 'center', fontSize: 9, color: '#484f58', paddingBottom: 2, zIndex: 999, pointerEvents: 'none', letterSpacing: 0.3 }}>
      powered by <span style={{ color: '#58a6ff', fontWeight: 600 }}>Vextrum Labs</span>
    </div>
    </>
  )
}