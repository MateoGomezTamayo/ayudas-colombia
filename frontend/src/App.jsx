import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import SolicitarAyuda from './pages/SolicitarAyuda'
import PuntosAcopio from './pages/PuntosAcopio'
import ListaPuntos from './pages/ListaPuntos'
import AgregarPunto from './pages/AgregarPunto'
import Ayudas from './pages/Ayudas'
import Voluntariado from './pages/Voluntariado'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminSolicitudes from './pages/AdminSolicitudes'
import AdminPuntos from './pages/AdminPuntos'
import AdminEmergencias from './pages/AdminEmergencias'
import AdminVoluntariado from './pages/AdminVoluntariado'

export default function App() {
  const { pathname } = useLocation()
  const hideNav = pathname === '/'
  return (
    <>
      {!hideNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/solicitar" element={<SolicitarAyuda />} />
        <Route path="/acopio" element={<ListaPuntos tipo="acopio" />} />
        <Route path="/albergues" element={<ListaPuntos tipo="refugio" />} />
        <Route path="/ayudas" element={<Ayudas />} />
        <Route path="/voluntariado" element={<Voluntariado />} />
        <Route path="/puntos-acopio" element={<PuntosAcopio />} />
        <Route path="/agregar-acopio" element={<AgregarPunto tipo="acopio" />} />
        <Route path="/agregar-albergue" element={<AgregarPunto tipo="refugio" />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/solicitudes" element={<ProtectedRoute><AdminSolicitudes /></ProtectedRoute>} />
        <Route path="/admin/puntos" element={<ProtectedRoute><AdminPuntos /></ProtectedRoute>} />
        <Route path="/admin/emergencias" element={<ProtectedRoute><AdminEmergencias /></ProtectedRoute>} />
        <Route path="/admin/voluntariado" element={<ProtectedRoute><AdminVoluntariado /></ProtectedRoute>} />
      </Routes>
      <BottomNav />
    </>
  )
}
