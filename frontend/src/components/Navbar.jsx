import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/'); setOpen(false) }

  const linkStyle = { color: '#8b949e', textDecoration: 'none', fontWeight: 500, fontSize: 14 }
  const itemStyle = { color: '#c9d1d9', textDecoration: 'none', padding: '10px 12px', borderRadius: 8, fontWeight: 500, display: 'block' }

  return (
    <nav style={{ background: '#161b22', borderBottom: '1px solid #30363d', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
            <span style={{ color: '#58a6ff', fontWeight: 800, fontSize: 17 }}>Ayuda</span>
            <span style={{ color: '#FCD116', fontWeight: 800, fontSize: 17 }}>Colombia</span>
          </Link>

          <div style={{ display: 'none', gap: 24, alignItems: 'center' }} className="md:flex">
            <Link to="/" style={linkStyle}>Inicio</Link>
            <Link to="/solicitar" style={linkStyle}>Solicitar Ayuda</Link>
            <Link to="/puntos-acopio" style={linkStyle}>Puntos de Acopio</Link>
            {admin ? (
              <>
                <Link to="/admin/dashboard" style={{ ...linkStyle, color: '#58a6ff' }}>Panel Admin</Link>
                <button onClick={handleLogout} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 14 }}>Cerrar Sesion</button>
              </>
            ) : (
              <Link to="/admin" style={{ ...linkStyle, fontSize: 12, color: '#484f58' }}>Admin</Link>
            )}
          </div>

          <button onClick={() => setOpen(o => !o)} className="md:hidden" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b949e', padding: 8 }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>

        {open && (
          <div style={{ borderTop: '1px solid #30363d', paddingTop: 8, paddingBottom: 12 }}>
            {[['/', 'Inicio'], ['/solicitar', 'Solicitar Ayuda'], ['/puntos-acopio', 'Puntos de Acopio']].map(([to, label]) => (
              <Link key={to} to={to} onClick={() => setOpen(false)} style={itemStyle}>{label}</Link>
            ))}
            {admin ? (
              <>
                <Link to="/admin/dashboard" onClick={() => setOpen(false)} style={{ ...itemStyle, color: '#58a6ff' }}>Panel Admin</Link>
                <button onClick={handleLogout} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '10px 12px', fontWeight: 500, width: '100%' }}>Cerrar Sesion</button>
              </>
            ) : (
              <Link to="/admin" onClick={() => setOpen(false)} style={{ ...itemStyle, fontSize: 12, color: '#484f58' }}>Admin</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}