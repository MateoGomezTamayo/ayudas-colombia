import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import SolicitarAyuda from './pages/SolicitarAyuda'
import PuntosAcopio from './pages/PuntosAcopio'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminSolicitudes from './pages/AdminSolicitudes'
import AdminPuntos from './pages/AdminPuntos'
import AdminEmergencias from './pages/AdminEmergencias'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/solicitar" element={<SolicitarAyuda />} />
        <Route path="/puntos-acopio" element={<PuntosAcopio />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
        />
        <Route
          path="/admin/solicitudes"
          element={<ProtectedRoute><AdminSolicitudes /></ProtectedRoute>}
        />
        <Route
          path="/admin/puntos"
          element={<ProtectedRoute><AdminPuntos /></ProtectedRoute>}
        />
        <Route
          path="/admin/emergencias"
          element={<ProtectedRoute><AdminEmergencias /></ProtectedRoute>}
        />
      </Routes>
    </>
  )
}
