import mysql from 'mysql2/promise'

const globalForDb = globalThis

export function getDbPool() {
  if (!globalForDb._mysqlPool) {
    const host = process.env.DB_HOST || 'sh01064.bluehost.com'
    const user = process.env.DB_USER
    const password = process.env.DB_PASSWORD
    const database = process.env.DB_NAME
    const port = Number(process.env.DB_PORT) || 3306

    if (!user || !database) {
      return null
    }

    // Conservative serverless pool: quickly releases idle connections to protect max_user_connections
    globalForDb._mysqlPool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 3,
      maxIdle: 1,
      idleTimeout: 5000, // Close idle connections after 5 seconds
      connectTimeout: 7000,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    })
  }

  return globalForDb._mysqlPool
}

export async function query(sql, params = []) {
  const db = getDbPool()
  if (!db) {
    throw new Error('Database is not configured. Please define DB_USER, DB_PASSWORD, and DB_NAME in .env.local')
  }

  try {
    const [results] = await db.execute({
      sql,
      values: params,
      timeout: 8000, // 8s query timeout
    })
    return results
  } catch (err) {
    if (err.code === 'ER_TOO_MANY_USER_CONNECTIONS') {
      console.warn('MySQL connection limit reached on Bluehost. Retrying in 1s...')
      await new Promise((r) => setTimeout(r, 1200))
      const [retryResults] = await db.execute({
        sql,
        values: params,
        timeout: 8000,
      })
      return retryResults
    }
    throw err
  }
}

export async function testConnection() {
  try {
    const db = getDbPool()
    if (!db) {
      return {
        success: false,
        message: 'Database credentials missing in .env.local (DB_USER, DB_PASSWORD, DB_NAME)',
      }
    }
    const [rows] = await db.query({
      sql: 'SELECT 1 + 1 AS result, NOW() as server_time, VERSION() as version',
      timeout: 5000,
    })
    return {
      success: true,
      serverTime: rows[0].server_time,
      version: rows[0].version,
      message: 'Successfully connected to Bluehost MySQL!',
    }
  } catch (err) {
    return {
      success: false,
      error: err.message,
      code: err.code,
    }
  }
}
