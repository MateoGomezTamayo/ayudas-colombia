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

    // 5. Nueva emergencia — Crisis humanitaria nacional (puntos Bogotá)
    const { rows: [emergBog] } = await client.query(
      `INSERT INTO emergencias (nombre, descripcion, tipo, estado, departamento, municipio, fecha_inicio)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        'Crisis Humanitaria Nacional 2026 - Puntos Bogotá',
        'Puntos de acopio activos en Bogotá para enviar ayuda humanitaria a comunidades afectadas en Chocó, Buenaventura y otras zonas del país. Fuente: hoja colaborativa en tiempo real.',
        'Otro',
        'activa',
        'Cundinamarca',
        'Bogotá',
        '2026-08-14'
      ]
    );
    const emergBogId = emergBog.id;
    console.log(`✓ Emergencia Bogotá insertada (id: ${emergBogId})`);

    // 6. Puntos de acopio Bogotá (fuente: VOLUNTARIADO Y DONACIONES EN TIEMPO REAL BOGOTÁ)
    const puntosBogota = [
      {
        nombre: 'Unicentro',
        dir: 'Carrera 15 #124-30', lat: 4.7007, lng: -74.0431,
        horario: '9am - 6pm', contacto: null, tel: null,
        items: ['Alimentos', 'Medicamentos', 'Higiene', 'Ropa y Abrigo']
      },
      {
        nombre: 'Vive Claro',
        dir: 'Carrera 60 #42-41', lat: 4.6318, lng: -74.1064,
        horario: null, contacto: null, tel: null,
        items: ['Medicamentos', 'Higiene']
      },
      {
        nombre: 'Estadio El Campín',
        dir: 'NQS con Calle 57', lat: 4.6471, lng: -74.0975,
        horario: 'Hasta las 8pm', contacto: null, tel: null,
        items: ['Alimentos', 'Higiene', 'Colchonetas y Cobijas', 'Ropa y Abrigo']
      },
      {
        nombre: 'C.C. Nuestro Bogotá',
        dir: 'Carrera 86 #55A-75', lat: 4.6399, lng: -74.1253,
        horario: null, contacto: null, tel: null,
        items: ['Alimentos', 'Medicamentos', 'Higiene']
      },
      {
        nombre: 'Compensar Carrera 60',
        dir: 'Carrera 60 #66B-05', lat: 4.6565, lng: -74.1066,
        horario: null, contacto: null, tel: null,
        items: ['Alimentos', 'Higiene', 'Colchonetas y Cobijas', 'Otro']
      },
      {
        nombre: 'Universidad Distrital Bosa',
        dir: 'Calle 52 Sur #93D-97', lat: 4.5698, lng: -74.1704,
        horario: null, contacto: null, tel: null,
        items: ['Alimentos', 'Higiene']
      },
      {
        nombre: 'The Spot Park',
        dir: 'Carrera 13A #37-68', lat: 4.6233, lng: -74.0637,
        horario: null, contacto: null, tel: null,
        items: ['Alimentos', 'Higiene']
      },
      {
        nombre: 'Galería Aborigen',
        dir: 'Carrera 6A #116-17', lat: 4.7031, lng: -74.0487,
        horario: 'Hasta las 10pm', contacto: null, tel: null,
        items: ['Alimentos', 'Ropa y Abrigo', 'Otro']
      },
      {
        nombre: 'Universidad Cooperativa',
        dir: 'Carrera 9 #172-90', lat: 4.7497, lng: -74.0504,
        horario: null, contacto: null, tel: null,
        items: ['Alimentos', 'Higiene']
      },
      {
        nombre: 'Punto Carrera 13A #101-74',
        dir: 'Carrera 13A #101-74 Apto 404', lat: 4.6932, lng: -74.0638,
        horario: null, contacto: null, tel: null,
        items: ['Medicamentos']
      },
      {
        nombre: 'Punto Carrera 14B #106-75',
        dir: 'Carrera 14B #106-75', lat: 4.6952, lng: -74.0635,
        horario: null, contacto: null, tel: null,
        items: ['Alimentos', 'Higiene', 'Otro']
      },
      {
        nombre: 'Punto Calle 14 #19-64',
        dir: 'Calle 14 #19-64', lat: 4.5966, lng: -74.0726,
        horario: null, contacto: null, tel: null,
        items: ['Alimentos', 'Higiene']
      },
      {
        nombre: 'Uniagraria',
        dir: 'Calle 170 #54A-10, Sala de Juntas Bloque C', lat: 4.7682, lng: -74.1030,
        horario: null, contacto: null, tel: null,
        items: ['Higiene', 'Colchonetas y Cobijas', 'Otro']
      },
      {
        nombre: 'JAC Pastranita - Kennedy',
        dir: 'Carrera 80a #49-08, Barrio Calarcá', lat: 4.6292, lng: -74.1420,
        horario: '10am - 7pm (sábado y domingo)', contacto: null, tel: null,
        items: ['Alimentos', 'Higiene', 'Medicamentos', 'Ropa y Abrigo']
      },
      {
        nombre: 'Palacio de los Deportes',
        dir: 'Calle 63 #59A-06', lat: 4.6553, lng: -74.1048,
        horario: 'Hasta las 10pm', contacto: null, tel: null,
        items: ['Alimentos', 'Ropa y Abrigo', 'Otro']
      },
      {
        nombre: 'Cantón de Caballería',
        dir: 'Carrera 7 #106-10', lat: 4.6960, lng: -74.0463,
        horario: null, contacto: 'Nicolás Pinzon', tel: '3115380066',
        items: ['Medicamentos', 'Alimentos', 'Colchonetas y Cobijas']
      },
      {
        nombre: 'Punto Calle 116 #71A-49',
        dir: 'Calle 116 #71A-49', lat: 4.7031, lng: -74.1136,
        horario: null, contacto: null, tel: null,
        items: ['Alimentos', 'Medicamentos', 'Colchonetas y Cobijas']
      },
      {
        nombre: 'Punto Calle 94A #11-27',
        dir: 'Calle 94a #11-27 Of. 204', lat: 4.6787, lng: -74.0481,
        horario: null, contacto: null, tel: null,
        items: ['Alimentos', 'Medicamentos', 'Colchonetas y Cobijas']
      },
      {
        nombre: 'La Campiña - Suba',
        dir: 'Calle 140B #96-60', lat: 4.7413, lng: -74.1279,
        horario: null, contacto: '@estebansldanas (IG)', tel: null,
        items: ['Alimentos', 'Otro']
      },
      {
        nombre: 'Carulla 85 - somos.70veces7',
        dir: 'Autopista 85 #15-23', lat: 4.6727, lng: -74.0481,
        horario: null, contacto: null, tel: null,
        items: ['Medicamentos', 'Higiene', 'Alimentos', 'Ropa y Abrigo']
      },
      {
        nombre: 'Casa PCN',
        dir: 'Calle 12d #1a-10', lat: 4.5985, lng: -74.0775,
        horario: '9am - 6pm', contacto: 'PCN Bogotá (@PCN_Bogota)', tel: null,
        items: ['Medicamentos', 'Higiene', 'Alimentos']
      },
      {
        nombre: '122 Plaza Apartahotel',
        dir: 'Carrera 15a #122-27', lat: 4.7003, lng: -74.0417,
        horario: '24 horas', contacto: null, tel: null,
        items: ['Alimentos', 'Agua', 'Higiene', 'Medicamentos', 'Colchonetas y Cobijas']
      },
      {
        nombre: 'SOS Juntos por el Chocó',
        dir: 'Calle 38 #29-29', lat: 4.6178, lng: -74.0893,
        horario: null, contacto: 'IG: PCN_Bogota', tel: null,
        items: ['Alimentos', 'Higiene', 'Medicamentos']
      },
      {
        nombre: 'Parque de los Hippies',
        dir: 'Autopista 63 #59A-06', lat: 4.6519, lng: -74.1050,
        horario: 'Desde 1pm', contacto: null, tel: null,
        items: ['Alimentos', 'Higiene', 'Ropa y Abrigo', 'Otro']
      },
      {
        nombre: 'Escuela de Caballería',
        dir: 'Carrera 7 #106-10', lat: 4.6960, lng: -74.0463,
        horario: 'Hasta las 8pm', contacto: null, tel: null,
        items: ['Alimentos', 'Otro']
      },
      {
        nombre: 'Casa de la Memoria Usaquén',
        dir: 'Calle 161a #7F-55', lat: 4.7530, lng: -74.0430,
        horario: null, contacto: null, tel: null,
        items: ['Alimentos', 'Higiene', 'Medicamentos', 'Colchonetas y Cobijas', 'Herramientas']
      },
      {
        nombre: 'C.C. Multiplaza',
        dir: 'Calle 19A #72-57', lat: 4.6047, lng: -74.1128,
        horario: '2pm - 9pm', contacto: null, tel: null,
        items: ['Alimentos', 'Higiene', 'Medicamentos']
      }
    ];

    for (const p of puntosBogota) {
      await client.query(
        `INSERT INTO puntos_acopio (nombre, ciudad, departamento, direccion, lat, lng, horario, contacto, telefono, que_acepta, emergencia_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [p.nombre, 'Bogotá', 'Cundinamarca', p.dir, p.lat, p.lng, p.horario, p.contacto, p.tel, p.items, emergBogId]
      );
    }
    console.log(`✓ ${puntosBogota.length} puntos de acopio Bogotá insertados`);

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
