import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/admin/dashboard', label: '📊 Dashboard' },
  { to: '/admin/solicitudes', label: '📋 Solicitudes' },
  { to: '/admin/puntos', label: '📦 Puntos de Acopio' },
  { to: '/admin/emergencias', label: '🚨 Emergencias' },
]

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-56 bg-blue-900 text-white flex flex-col shrink-0">
        <div className="p-4 border-b border-blue-800">
          <p className="font-bold text-sm" style={{ color: '#FCD116' }}>🇨🇴 Ayudas Colombia</p>
          <p className="text-xs text-blue-300 mt-0.5">Panel de Administración</p>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-blue-800">
          <NavLink
            to="/"
            className="block px-3 py-2 rounded-lg text-xs text-blue-300 hover:text-white hover:bg-blue-800 transition-colors"
          >
            ← Ver sitio público
          </NavLink>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{admin?.nombre || admin?.email || 'Admin'}</span>
            <button
              onClick={handleLogout}
              className="text-xs text-red-600 hover:text-red-800 font-medium border border-red-200 px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
