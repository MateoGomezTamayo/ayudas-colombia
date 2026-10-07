# Ayudas Colombia

Plataforma de ayudas humanitarias (sismo 2026): solicitudes de ayuda, puntos de acopio, albergues, voluntariado y panel admin. Dominio: **www.ayudacolombia.online**.

- `frontend/`: React 18 + Vite + Tailwind 3 + react-leaflet → Vercel, proyecto **`frontend`** (equipo mateogomeztamayos-projects).
- `backend/`: Node + Express + PostgreSQL → Railway (`https://ayudas-colombia-production-b028.up.railway.app`, health en `/health`).

## Despliegue

- Frontend: `cd frontend && vercel deploy --prod`. El proyecto Vercel se llama `frontend` y sirve ayudacolombia.online: **no** desplegar otros proyectos (p. ej. HoldMyID) en él.
- `VITE_API_URL` está en las variables de producción de Vercel (= `<backend>/api`). En local `.env` apunta a `localhost:3001`; si ves `baseURL:"http://localhost` en un build de producción, falta la variable.
- Repo: `MateoGomezTamayo/ayudas-colombia` (rama `master`).

## Mapas

- Inicio (`src/pages/Dashboard.jsx`): Esri World Dark Gray (base + referencia), gratis y sin clave. CARTO dejó de funcionar sin API key (oct 2026): no volver a usarlo.
- Puntos de acopio (`src/pages/PuntosAcopio.jsx`): OpenStreetMap estándar.
- Si un mapa se ve gris o con marca de agua, revisa las respuestas de los tiles (`server.arcgisonline.com`, `tile.openstreetmap.org`) antes de tocar el código.
