const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const sqlDir = path.join(__dirname, '..', 'sql');
const args = process.argv.slice(2);
const shouldReset = args.includes('--reset');

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL no está configurado');
  }

  const pool = new Pool({ connectionString });

  try {
    if (shouldReset) {
      console.warn('Reset solicitado: eliminando schema public...');
      await pool.query('DROP SCHEMA IF EXISTS public CASCADE;');
      await pool.query('CREATE SCHEMA public;');
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id serial PRIMARY KEY,
        filename text NOT NULL UNIQUE,
        applied_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    const files = fs
      .readdirSync(sqlDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const applied = await pool.query(
        'SELECT 1 FROM schema_migrations WHERE filename = $1',
        [file],
      );
      if (applied.rowCount > 0) {
        continue;
      }

      const sql = fs.readFileSync(path.join(sqlDir, file), 'utf8');
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
        await client.query('COMMIT');
        console.log(`Migración aplicada: ${file}`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error('Error ejecutando migraciones SQL:', error.message || error);
  process.exit(1);
});
