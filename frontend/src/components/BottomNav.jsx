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
    <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
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
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: card,
      borderTop: '1px solid #21262d',
      display: 'flex',
      alignItems: 'center',
      paddingBottom: 'env(safe-area-inset-bottom, 8px)',
      paddingTop: 8,
      zIndex: 1000,
    }}>
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

      <Link to="/albergues" style={tab(pathname === '/albergues')}>
        <IcoBed />
        <span>Albergue</span>
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
    </nav>
  )
}