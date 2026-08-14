import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Public ──────────────────────────────────────────────────────────────────
export const getEmergencias = () =>
  api.get('/emergencias').then((r) => r.data)

export const getEmergencia = (id) =>
  api.get(`/emergencias/${id}`).then((r) => r.data)

export const getSolicitudes = (params) =>
  api.get('/solicitudes', { params }).then((r) => r.data)

export const createSolicitud = (data) =>
  api.post('/solicitudes', data).then((r) => r.data)

export const getPuntosAcopio = (params) =>
  api.get('/puntos-acopio', { params }).then((r) => r.data)

export const submitPuntoPublico = (data) =>
  api.post('/puntos-acopio', data).then((r) => r.data)

// ── Admin ────────────────────────────────────────────────────────────────────
export const login = (email, password) =>
  api.post('/auth/login', { email, password }).then((r) => r.data)

export const setupAdmin = (nombre, email, password) =>
  api.post('/auth/setup', { nombre, email, password }).then((r) => r.data)

export const updateSolicitud = (id, data) =>
  api.patch(`/admin/solicitudes/${id}`, data).then((r) => r.data)

export const createPunto = (data) =>
  api.post('/admin/puntos-acopio', data).then((r) => r.data)

export const updatePunto = (id, data) =>
  api.patch(`/admin/puntos-acopio/${id}`, data).then((r) => r.data)

export const deletePunto = (id) =>
  api.delete(`/admin/puntos-acopio/${id}`).then((r) => r.data)

export const createEmergencia = (data) =>
  api.post('/admin/emergencias', data).then((r) => r.data)

export const updateEmergencia = (id, data) =>
  api.patch(`/admin/emergencias/${id}`, data).then((r) => r.data)

export const getAdminSolicitudes = (params) =>
  api.get('/solicitudes', { params }).then((r) => r.data)

export const getAdminPuntos = () =>
  api.get('/puntos-acopio').then((r) => r.data)

export default api
