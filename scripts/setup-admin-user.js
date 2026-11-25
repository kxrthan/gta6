import fs from 'fs'
import path from 'path'
import mysql from 'mysql2/promise'
import crypto from 'crypto'

export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password, storedHash) {
  if (!storedHash) return false
  if (storedHash === password) return true // fallback
  const [salt, key] = storedHash.split(':')
  if (!salt || !key) return false
  const hashBuffer = crypto.scryptSync(password, salt, 64)
  const keyBuffer = Buffer.from(key, 'hex')
  if (hashBuffer.length !== keyBuffer.length) return false
  return crypto.timingSafeEqual(hashBuffer, keyBuffer)
}

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...vals] = trimmed.split('=')
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = vals.join('=').trim()
      }
    }
  })
}

async function run() {
  const host = process.env.DB_HOST || 'sh01064.bluehost.com'
  const user = process.env.DB_USER
  const password = process.env.DB_PASSWORD
  const database = process.env.DB_NAME
  const port = Number(process.env.DB_PORT) || 3306

  console.log(`Connecting to Bluehost MySQL at ${host}:${port}/${database}...`)
  const conn = await mysql.createConnection({ host, port, user, password, database })
  console.log('✅ Connected!')

  console.log('Creating admin_users table...')
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(100) DEFAULT 'Vice City Admin',
      role VARCHAR(50) DEFAULT 'superadmin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP NULL,
      INDEX idx_username (username)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `)

  // Check if admin user exists
  const [rows] = await conn.execute('SELECT * FROM admin_users WHERE username = ?', ['admin'])
  if (rows.length === 0) {
    const hashed = hashPassword('vicecity2026')
    await conn.execute(
      'INSERT INTO admin_users (username, password_hash, name, role) VALUES (?, ?, ?, ?)',
      ['admin', hashed, 'Vice City Admin', 'superadmin']
    )
    console.log('✅ Seeded default admin user:')
    console.log('   Username: admin')
    console.log('   Password: vicecity2026')
  } else {
    console.log('ℹ️ Admin user already exists:', rows[0].username)
  }

  const [allUsers] = await conn.execute('SELECT id, username, name, role, created_at, last_login FROM admin_users')
  console.log('📋 Current admin_users in DB:', allUsers)

  await conn.end()
}

run().catch((err) => {
  console.error('❌ Error creating admin user:', err)
  process.exit(1)
})
