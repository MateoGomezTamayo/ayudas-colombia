/*
 * Seed script — ejecutar con: node seed.js
 * Requiere .env con DATABASE_URL configurado.
 *
 * 1. Aplica src/schema.sql
 * 2. Inserta emergencia de ejemplo
 * 3. Inserta 3 solicitudes con items
 * 4. Inserta 2 puntos de acopio (Cali y Bogotá)
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const client = await pool.connect();
  try {
    // 1. Schema
    const schemaSql = fs.readFileSync(path.join(__dirname, 'src', 'schema.sql'), 'utf8');
    await client.query(schemaSql);
    console.log('✓ Schema aplicado');

    // 2. Emergencia
    const { rows: [emergencia] } = await client.query(
      `INSERT INTO emergencias (nombre, descripcion, tipo, estado, departamento, municipio, fecha_inicio)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        'Inundaciones Valle del Cauca 2026',
        'Desbordamiento del río Cauca y afluentes en múltiples municipios del departamento. Más de 8.000 familias afectadas.',
        'Inundación',
        'activa',
        'Valle del Cauca',
        'Cali',
        '2026-07-15'
      ]
    );
    const emergId = emergencia.id;
    console.log(`✓ Emergencia insertada (id: ${emergId})`);

    // 3. Solicitud 1 — Cali, prioridad alta
    const { rows: [s1] } = await client.query(
      `INSERT INTO solicitudes (emergencia_id, ciudad, departamento, lat, lng, nombre_solicitante, contacto, descripcion, prioridad)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [emergId, 'Cali', 'Valle del Cauca', 3.4516, -76.5320, 'María Torres', '310-555-0001',
       'Familia de 5 personas sin acceso a comida ni agua potable desde hace 3 días', 'alta']
    );
    await client.query(
      `INSERT INTO solicitud_items (solicitud_id, categoria_id, producto, cantidad, unidad)
       VALUES ($1,1,'Arroz','10','kg'), ($1,2,'Agua embotellada','20','litros'), ($1,7,'Cobijas','5','unidades')`,
      [s1.id]
    );

    // 3. Solicitud 2 — Palmira, prioridad alta
    const { rows: [s2] } = await client.query(
      `INSERT INTO solicitudes (emergencia_id, ciudad, departamento, lat, lng, nombre_solicitante, contacto, descripcion, prioridad)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [emergId, 'Palmira', 'Valle del Cauca', 3.5394, -76.3034, 'Juan Gómez', '311-555-0002',
       'Comunidad de 30 familias afectadas, necesitan medicamentos con urgencia', 'alta']
    );
    await client.query(
      `INSERT INTO solicitud_items (solicitud_id, categoria_id, producto, cantidad, unidad)
       VALUES ($1,3,'Acetaminofén','100','tabletas'), ($1,3,'Suero oral','50','sobres'), ($1,6,'Jabón antibacterial','30','barras')`,
      [s2.id]
    );

    // 3. Solicitud 3 — Buenaventura, prioridad media
    const { rows: [s3] } = await client.query(
      `INSERT INTO solicitudes (emergencia_id, ciudad, departamento, lat, lng, nombre_solicitante, contacto, descripcion, prioridad)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [emergId, 'Buenaventura', 'Valle del Cauca', 3.8801, -77.0311, 'Carmen Ríos', '312-555-0003',
       'Zona costera afectada, adultos mayores sin acceso a suministros básicos', 'media']
    );
    await client.query(
      `INSERT INTO solicitud_items (solicitud_id, categoria_id, producto, cantidad, unidad)
       VALUES ($1,1,'Frijoles','20','kg'), ($1,7,'Colchonetas','10','unidades'), ($1,5,'Palas','5','unidades')`,
      [s3.id]
    );

    console.log('✓ 3 solicitudes de ejemplo insertadas');

    // 4. Punto de acopio — Cali
    await client.query(
      `INSERT INTO puntos_acopio (nombre, ciudad, departamento, direccion, lat, lng, horario, contacto, telefono, que_acepta, emergencia_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        'Centro Comunitario La Flora', 'Cali', 'Valle del Cauca',
        'Cra 50 #25-30, Barrio La Flora', 3.4621, -76.5280,
        'Lunes a Sábado 8am-6pm', 'Cruz Roja Cali', '602-555-0010',
        ['Alimentos', 'Agua', 'Ropa y Abrigo', 'Medicamentos'],
        emergId
      ]
    );

    // 4. Punto de acopio — Bogotá
    await client.query(
      `INSERT INTO puntos_acopio (nombre, ciudad, departamento, direccion, lat, lng, horario, contacto, telefono, que_acepta, emergencia_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        'Coliseo El Campín', 'Bogotá', 'Cundinamarca',
        'Cra 30 #57-60, Teusaquillo', 4.6472, -74.0957,
        'Todos los días 7am-8pm', 'Secretaría de Integración Social', '601-555-0020',
        ['Alimentos', 'Ropa y Abrigo', 'Colchonetas y Cobijas'],
        emergId
      ]
    );

    console.log('✓ 2 puntos de acopio de ejemplo insertados');
    console.log('\n✅ Seed completado exitosamente');
  } catch (err) {
    console.error('❌ Error en seed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
