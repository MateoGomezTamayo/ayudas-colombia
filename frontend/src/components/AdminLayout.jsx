import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>' },
  { to: '/admin/solicitudes', label: 'Solicitudes', icon: '<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>' },
  { to: '/admin/puntos', label: 'Puntos de Acopio', icon: '<path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4z"/>' },
  { to: '/admin/emergencias', label: 'Emergencias', icon: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>' },
]

const SvgIcon = ({ d }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" dangerouslySetInnerHTML={{ __html: d }} />
)

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const NavItems = ({ onClick }) => (
    <>
      {NAV.map(l => (
        <NavLink
          key={l.to}
          to={l.to}
          onClick={onClick}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10, fontSize: 13, fontWeight: 500,
            textDecoration: 'none', transition: 'background 0.15s',
            background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
            color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
          })}
        >
          <SvgIcon d={l.icon} />
          {l.label}
        </NavLink>
      ))}
      <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', fontSize: 12, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginTop: 8 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
        Ver sitio publico
      </NavLink>
    </>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f3f4f6' }}>

      {/* Desktop sidebar */}
      <aside style={{ width: 220, background: '#1e3a5f', color: 'white', display: 'flex', flexDirection: 'column', flexShrink: 0 }} className="hidden md:flex">
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontWeight: 800, fontSize: 14, color: '#FCD116' }}>Ayudas Colombia</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Panel Admin</div>
        </div>
        <nav style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <NavItems />
        </nav>
        <div style={{ padding: 12, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>{admin?.nombre || admin?.email}</div>
          <button onClick={handleLogout} style={{ width: '100%', background: 'rgba(239,68,68,0.2)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '7px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
            Cerrar Sesion
          </button>
        </div>
      </aside>

      {/* Mobile overlay drawer */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }} onClick={() => setOpen(false)}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
          <aside style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 260, background: '#1e3a5f', color: 'white', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#FCD116' }}>Ayudas Colombia</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Panel Admin</div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: 4 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            </div>
            <nav style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <NavItems onClick={() => setOpen(false)} />
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {/* Top bar */}
        <header style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setOpen(true)} className="md:hidden" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#374151', padding: 4 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
            </button>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#1e3a5f' }} className="md:hidden">Admin</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: '#6b7280' }}>{admin?.nombre || admin?.email}</span>
            <button onClick={handleLogout} style={{ fontSize: 12, color: '#dc2626', border: '1px solid #fecaca', borderRadius: 8, padding: '5px 10px', background: '#fff5f5', cursor: 'pointer', fontWeight: 500 }}>
              Salir
            </button>
          </div>
        </header>

        <main style={{ flex: 1, padding: 16 }}>{children}</main>
      </div>
    </div>
  )
}