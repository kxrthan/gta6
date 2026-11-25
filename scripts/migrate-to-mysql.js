// Script to migrate local files (cheats.json, vehicles.json, and content/posts/*.mdx) into Bluehost MySQL
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import mysql from 'mysql2/promise'

// Load .env.local if present
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

async function migrate() {
  const host = process.env.DB_HOST || '50.6.42.209'
  const user = process.env.DB_USER
  const password = process.env.DB_PASSWORD
  const database = process.env.DB_NAME
  const port = Number(process.env.DB_PORT) || 3306

  if (!user || !database || !password) {
    console.error('❌ Please set DB_USER, DB_PASSWORD, and DB_NAME in .env.local before running migration.')
    process.exit(1)
  }

  console.log(`Connecting to Bluehost MySQL at ${host}:${port}/${database}...`)
  const conn = await mysql.createConnection({ host, port, user, password, database })
  console.log('✅ Connected!')

  // 1. Create Tables
  console.log('Creating tables if they do not exist...')
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(191) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      excerpt TEXT,
      content LONGTEXT,
      category VARCHAR(50) DEFAULT 'News',
      tags VARCHAR(255) DEFAULT '',
      cover_image VARCHAR(255) DEFAULT '/images/posts/map-coords.jpg',
      cover_main_caption VARCHAR(255) DEFAULT '',
      cover_sub_caption VARCHAR(255) DEFAULT '',
      author VARCHAR(100) DEFAULT 'Vice City Reporter',
      reading_time VARCHAR(50) DEFAULT '3 min read',
      featured BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_category (category),
      INDEX idx_tags (tags)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `)

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS cheats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      effect VARCHAR(255) NOT NULL,
      category VARCHAR(50) DEFAULT 'Player',
      code_ps VARCHAR(255) DEFAULT '',
      code_xbox VARCHAR(255) DEFAULT '',
      code_pc VARCHAR(100) DEFAULT '',
      active BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `)

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      brand VARCHAR(100) NOT NULL,
      category VARCHAR(50) NOT NULL,
      top_speed VARCHAR(50) DEFAULT '180 MPH',
      acceleration VARCHAR(50) DEFAULT '3.5s',
      handling DECIMAL(3,1) DEFAULT 8.0,
      armor DECIMAL(3,1) DEFAULT 6.0,
      price VARCHAR(50) DEFAULT '$1,000,000',
      description TEXT,
      spawn_location VARCHAR(255) DEFAULT 'Vice City',
      cover_subtitle VARCHAR(150) DEFAULT '',
      audio_preset VARCHAR(50) DEFAULT 'supercar',
      custom_audio_url VARCHAR(255) DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `)

  // 2. Migrate Cheats
  try {
    const cheatsFile = path.join(process.cwd(), 'data', 'cheats.json')
    if (fs.existsSync(cheatsFile)) {
      const cheats = JSON.parse(fs.readFileSync(cheatsFile, 'utf-8'))
      for (const c of cheats) {
        await conn.execute(
          `INSERT INTO cheats (name, effect, category, code_ps, code_xbox, code_pc)
           VALUES (?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE effect = VALUES(effect), code_ps = VALUES(code_ps), code_xbox = VALUES(code_xbox), code_pc = VALUES(code_pc)`,
          [c.name, c.effect, c.category || 'General', c.codePS || '', c.codeXbox || '', c.codePC || '']
        )
      }
      console.log(`✅ Seeded ${cheats.length} cheats into MySQL.`)
    }
  } catch (err) {
    console.error('Cheats migration warning:', err.message)
  }

  // 3. Migrate Vehicles
  try {
    const vehiclesFile = path.join(process.cwd(), 'data', 'vehicles.json')
    if (fs.existsSync(vehiclesFile)) {
      const vehicles = JSON.parse(fs.readFileSync(vehiclesFile, 'utf-8'))
      for (const v of vehicles) {
        await conn.execute(
          `INSERT INTO vehicles (id, name, brand, category, top_speed, acceleration, handling, armor, price, description, spawn_location, cover_subtitle, audio_preset, custom_audio_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), description = VALUES(description)`,
          [
            String(v.id),
            v.name || 'Unknown Vehicle',
            v.brand || 'VCPD / Civ',
            v.class || v.category || 'Super',
            String(v.topSpeed || '180 MPH'),
            String(v.acceleration || '3.5s'),
            Number(v.handling) || 8.0,
            Number(v.armor) || 6.0,
            v.price || '$1,000,000',
            v.desc || v.description || '',
            v.location || v.spawnLocation || '',
            v.badge || v.coverSubtitle || '',
            v.audioEngine || 'supercar',
            v.customAudioUrl || null,
          ]
        )
      }
      console.log(`✅ Seeded ${vehicles.length} vehicles into MySQL.`)
    }
  } catch (err) {
    console.error('Vehicles migration warning:', err.message)
  }

  // 4. Migrate Posts
  try {
    const postsDir = path.join(process.cwd(), 'content', 'posts')
    if (fs.existsSync(postsDir)) {
      const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
      for (const file of files) {
        const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8')
        const { data, content } = matter(raw)
        const slug = file.replace(/\.mdx?$/, '')
        const tagStr = Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || ''
        await conn.execute(
          `INSERT INTO posts (slug, title, excerpt, content, category, tags, cover_image, cover_main_caption, cover_sub_caption, author, reading_time, featured)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content), tags = VALUES(tags), cover_main_caption = VALUES(cover_main_caption), cover_sub_caption = VALUES(cover_sub_caption)`,
          [
            slug,
            data.title || slug,
            data.excerpt || '',
            content,
            data.category || 'News',
            tagStr,
            data.coverImage || '/images/posts/map-coords.jpg',
            data.coverMainCaption || '',
            data.coverSubCaption || '',
            data.author || 'Vice City Reporter',
            data.readingTime || '3 min read',
            data.featured !== false,
          ]
        )
      }
      console.log(`✅ Seeded ${files.length} blog dispatches into MySQL.`)
    }
  } catch (err) {
    console.error('Posts migration warning:', err.message)
  }

  await conn.end()
  console.log('🎉 Database setup and migration completed!')
}

migrate().catch(console.error)
