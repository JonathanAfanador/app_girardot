const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',
  host: process.env.DB_HOST,
  database: 'postgres',
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false // Necesario para Supabase
  }
});

// Probar la conexión
pool.query('SELECT NOW()', (err) => {
  if (err) console.error('Error de conexión a DB:', err);
  else console.log('Conexión a Supabase PostgreSQL exitosa');
});

module.exports = pool;