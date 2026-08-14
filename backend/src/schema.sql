CREATE TABLE IF NOT EXISTS emergencias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  tipo VARCHAR(100),
  estado VARCHAR(50) DEFAULT 'activa',
  departamento VARCHAR(100),
  municipio VARCHAR(100),
  fecha_inicio DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categorias_producto (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  icono VARCHAR(50)
);

INSERT INTO categorias_producto (nombre, icono) VALUES
  ('Alimentos', '🍱'),
  ('Agua', '💧'),
  ('Medicamentos', '💊'),
  ('Ropa y Abrigo', '👕'),
  ('Herramientas', '🔧'),
  ('Higiene', '🧼'),
  ('Colchonetas y Cobijas', '🛏️'),
  ('Otro', '📦')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS solicitudes (
  id SERIAL PRIMARY KEY,
  emergencia_id INTEGER REFERENCES emergencias(id),
  ciudad VARCHAR(255) NOT NULL,
  departamento VARCHAR(100),
  lat DECIMAL(10, 7),
  lng DECIMAL(10, 7),
  nombre_solicitante VARCHAR(255),
  contacto VARCHAR(255),
  descripcion TEXT,
  estado VARCHAR(50) DEFAULT 'pendiente',
  prioridad VARCHAR(20) DEFAULT 'media',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS solicitud_items (
  id SERIAL PRIMARY KEY,
  solicitud_id INTEGER REFERENCES solicitudes(id) ON DELETE CASCADE,
  categoria_id INTEGER REFERENCES categorias_producto(id),
  producto VARCHAR(255) NOT NULL,
  cantidad VARCHAR(100),
  unidad VARCHAR(50),
  cubierto BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS puntos_acopio (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  ciudad VARCHAR(255) NOT NULL,
  departamento VARCHAR(100),
  direccion TEXT,
  lat DECIMAL(10, 7),
  lng DECIMAL(10, 7),
  horario TEXT,
  contacto VARCHAR(255),
  telefono VARCHAR(50),
  que_acepta TEXT[],
  activo BOOLEAN DEFAULT TRUE,
  emergencia_id INTEGER REFERENCES emergencias(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
