import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg select-none">
            <span>🇨🇴</span>
            <span className="text-blue-900">Ayudas</span>
            <span style={{ color: '#FCD116' }}>Colombia</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/" className="text-gray-700 hover:text-blue-900 font-medium transition-colors">
              Inicio
            </Link>
            <Link to="/solicitar" className="text-gray-700 hover:text-blue-900 font-medium transition-colors">
              Solicitar Ayuda
            </Link>
            <Link to="/puntos-acopio" className="text-gray-700 hover:text-blue-900 font-medium transition-colors">
              Puntos de Acopio
            </Link>
            {admin ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="text-blue-800 hover:text-blue-900 font-semibold transition-colors"
                >
                  Panel Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-800 font-medium transition-colors"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link to="/admin" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">
                Admin
              </Link>
            )}
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 flex flex-col gap-1 text-sm">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 font-medium px-2 py-2 rounded-lg hover:bg-gray-50"
            >
              Inicio
            </Link>
            <Link
              to="/solicitar"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 font-medium px-2 py-2 rounded-lg hover:bg-gray-50"
            >
              Solicitar Ayuda
            </Link>
            <Link
              to="/puntos-acopio"
              onClick={() => setMenuOpen(false)}
              className="text-gray-700 font-medium px-2 py-2 rounded-lg hover:bg-gray-50"
            >
              Puntos de Acopio
            </Link>
            {admin ? (
              <>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="text-blue-800 font-semibold px-2 py-2 rounded-lg hover:bg-blue-50"
                >
                  Panel Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-600 font-medium px-2 py-2 rounded-lg hover:bg-red-50 text-left"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="text-gray-400 text-xs px-2 py-2"
              >
                Admin
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Colombian flag stripe */}
      <div className="flex h-1">
        <div className="flex-1" style={{ background: '#FCD116' }} />
        <div className="flex-1" style={{ background: '#003893' }} />
        <div className="flex-1" style={{ background: '#CE1126' }} />
      </div>
    </nav>
  )
}
