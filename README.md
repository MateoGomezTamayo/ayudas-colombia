# Sistema de Ayudas Colombia

Plataforma web para la gestión de solicitudes de ayuda humanitaria en situaciones de emergencia. Permite a ciudadanos registrar solicitudes, consultar puntos de acopio y emergencias activas, mientras los administradores gestionan toda la información desde un panel dedicado.

---

## Arquitectura

```
ayudas-colombia/
├── frontend/   → React + Vite + Tailwind CSS  (Vercel)
├── backend/    → Node.js + Express + PostgreSQL (Railway)
└── vercel.json / railway.toml
```

| Capa       | Tecnología          | Plataforma |
|------------|---------------------|------------|
| Frontend   | React 18 + Vite     | Vercel     |
| Backend    | Node.js + Express   | Railway    |
| Base datos | PostgreSQL          | Railway (plugin) |

---

## Variables de entorno

### Backend (`backend/.env`)

| Variable       | Descripción                                              |
|----------------|----------------------------------------------------------|
| `DATABASE_URL` | Connection string PostgreSQL (`postgresql://user:pass@host:5432/db`) |
| `JWT_SECRET`   | Clave secreta para firmar tokens JWT (mín. 32 chars)    |
| `PORT`         | Puerto del servidor (Railway lo inyecta automáticamente) |
| `CORS_ORIGIN`  | URL del frontend en producción (ej. `https://ayudas.vercel.app`) |

### Frontend (`frontend/.env`)

| Variable        | Descripción                                   |
|-----------------|-----------------------------------------------|
| `VITE_API_URL`  | URL base del backend (ej. `https://api.railway.app/api`) |

---

## Instalación local

### Pre-requisitos
- Node.js ≥ 18
- PostgreSQL corriendo localmente (o connection string a una BD remota)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL y JWT_SECRET
node seed.js        # Crea las tablas en la BD
npm run dev         # Inicia el servidor en http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Editar .env: VITE_API_URL=http://localhost:3001/api
npm run dev         # Inicia la app en http://localhost:5173
```

---

## Deploy

### Backend en Railway

1. Conectar el repositorio en [railway.app](https://railway.app)
2. Establecer **Root Directory** = `/` (se usa `railway.toml` en la raíz)
3. Agregar el plugin **PostgreSQL** — Railway inyecta `DATABASE_URL` automáticamente
4. En **Variables**, añadir:
   - `JWT_SECRET`
   - `CORS_ORIGIN` → URL de producción del frontend
5. Railway detecta `railway.toml` y ejecuta el build/start automáticamente

### Frontend en Vercel

1. Conectar el repositorio en [vercel.com](https://vercel.com)
2. Vercel detecta `vercel.json` en la raíz — no se necesita configuración adicional
3. En **Environment Variables**, añadir:
   - `VITE_API_URL` → URL pública del backend en Railway (ej. `https://ayudas-colombia-production.up.railway.app/api`)
4. Hacer deploy — Vercel ejecuta `cd frontend && npm install && npm run build` y sirve `frontend/dist/`

---

## Primeros pasos post-deploy

Crear el primer usuario administrador enviando una petición al endpoint de setup:

```bash
POST /api/auth/setup
Content-Type: application/json

{
  "nombre": "Admin Principal",
  "email": "admin@example.com",
  "password": "contraseña-segura"
}
```

> Este endpoint sólo funciona cuando no existe ningún usuario administrador en la base de datos.

---

## Endpoints principales del API

### Autenticación
| Método | Ruta                  | Descripción                        |
|--------|-----------------------|------------------------------------|
| POST   | `/api/auth/setup`     | Crear primer admin (una sola vez)  |
| POST   | `/api/auth/login`     | Iniciar sesión, retorna JWT        |

### Público
| Método | Ruta                        | Descripción                          |
|--------|-----------------------------|--------------------------------------|
| GET    | `/api/emergencias`          | Listar emergencias activas           |
| GET    | `/api/puntos-acopio`        | Listar puntos de acopio              |
| POST   | `/api/solicitudes`          | Registrar nueva solicitud de ayuda   |
| GET    | `/api/solicitudes/:id`      | Consultar estado de una solicitud    |

### Administración (requiere JWT)
| Método | Ruta                              | Descripción                          |
|--------|-----------------------------------|--------------------------------------|
| GET    | `/api/admin/solicitudes`          | Listar todas las solicitudes         |
| PUT    | `/api/admin/solicitudes/:id`      | Actualizar estado de solicitud       |
| GET    | `/api/admin/puntos-acopio`        | Gestionar puntos de acopio           |
| POST   | `/api/admin/puntos-acopio`        | Crear punto de acopio                |
| PUT    | `/api/admin/puntos-acopio/:id`    | Actualizar punto de acopio           |
| DELETE | `/api/admin/puntos-acopio/:id`    | Eliminar punto de acopio             |
| GET    | `/api/admin/emergencias`          | Gestionar emergencias                |
| POST   | `/api/admin/emergencias`          | Crear emergencia                     |
| PUT    | `/api/admin/emergencias/:id`      | Actualizar emergencia                |
| DELETE | `/api/admin/emergencias/:id`      | Eliminar emergencia                  |

### Health check
| Método | Ruta       | Descripción                         |
|--------|------------|-------------------------------------|
| GET    | `/health`  | Estado del servidor (usado por Railway) |

---

## Required env vars checklist (para el equipo de seguridad)

- [ ] `DATABASE_URL` — Railway lo genera; NO hardcodear
- [ ] `JWT_SECRET` — generar con `openssl rand -base64 32`; NO reutilizar entre entornos
- [ ] `CORS_ORIGIN` — debe apuntar exclusivamente al dominio de producción del frontend
- [ ] `VITE_API_URL` — debe apuntar exclusivamente al dominio de producción del backend
