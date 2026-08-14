import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'))
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('adminData')
    try {
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const login = (newToken, adminData) => {
    localStorage.setItem('adminToken', newToken)
    localStorage.setItem('adminData', JSON.stringify(adminData))
    setToken(newToken)
    setAdmin(adminData)
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminData')
    setToken(null)
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ token, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
