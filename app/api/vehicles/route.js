import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

const vehiclesFilePath = path.join(process.cwd(), 'data', 'vehicles.json')

function readLocalVehicles() {
  if (!fs.existsSync(vehiclesFilePath)) return []
  try {
    return JSON.parse(fs.readFileSync(vehiclesFilePath, 'utf8'))
  } catch (err) {
    return []
  }
}

function writeLocalVehicles(vehicles) {
  try {
    const dir = path.dirname(vehiclesFilePath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(vehiclesFilePath, JSON.stringify(vehicles, null, 2), 'utf8')
  } catch (err) {
    console.warn('Error writing local vehicles cache:', err.message)
  }
}

function formatVehicleFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    class: row.category,
    category: row.category,
    topSpeed: Number(row.top_speed) || row.top_speed || 200,
    top_speed: row.top_speed,
    acceleration: Number(row.acceleration) || row.acceleration || 3.0,
    handling: Number(row.handling) || 8.0,
    armor: Number(row.armor) || 7.0,
    price: row.price || '$1,000,000',
    location: row.spawn_location || 'Vice City Dealership',
    spawn_location: row.spawn_location,
    desc: row.description || '',
    description: row.description,
    coverText: row.cover_subtitle || `${row.brand?.toUpperCase()} MOTOR DIVISION`,
    cover_subtitle: row.cover_subtitle,
    badge: row.badge || 'CONFIRMED',
    color: row.color || 'from-gta-teal to-blue-500',
    audioEngine: row.audio_preset || 'v8',
    audio_preset: row.audio_preset,
    custom_audio_url: row.custom_audio_url || null,
  }
}

export async function GET() {
  try {
    const rows = await query('SELECT * FROM vehicles ORDER BY id ASC')
    if (rows && rows.length > 0) {
      const fallback = readLocalVehicles()
      const vehicles = rows.map((row) => {
        const fb = fallback.find((f) => f.name === row.name || String(f.id) === String(row.id))
        const formatted = formatVehicleFromDb(row)
        return {
          ...formatted,
          badge: fb?.badge || formatted.badge,
          desc: fb?.desc || formatted.desc,
          description: fb?.desc || formatted.description,
          location: fb?.location || formatted.location,
          spawn_location: fb?.location || formatted.spawn_location,
          price: fb?.price || formatted.price,
        }
      })
      return NextResponse.json({ success: true, vehicles })
    }
  } catch (dbErr) {
    console.warn('MySQL vehicles fetch warning, falling back to local file:', dbErr.message)
  }

  const fallback = readLocalVehicles()
  return NextResponse.json({ success: true, vehicles: fallback })
}

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      id,
      name,
      brand = 'Grotti',
      category,
      class: vehClass,
      topSpeed,
      top_speed,
      acceleration = 3.0,
      handling = 8.0,
      armor = 7.0,
      price = '$1,000,000',
      desc,
      description,
      location,
      spawn_location,
      coverText,
      cover_subtitle,
      badge = 'CONFIRMED',
      color = 'from-gta-teal to-blue-500',
      audioEngine,
      audio_preset,
      custom_audio_url = null,
    } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Vehicle name is required' }, { status: 400 })
    }

    const vehId = String(id || Date.now())
    const finalCategory = category || vehClass || 'Super'
    const finalTopSpeed = String(top_speed || topSpeed || '200')
    const finalDesc = description || desc || ''
    const finalLocation = spawn_location || location || 'Vice City Dealership'
    const finalCover = cover_subtitle || coverText || `${brand.toUpperCase()} MOTOR DIVISION`
    const finalAudio = audio_preset || audioEngine || 'v8'

    // Persist to Bluehost MySQL
    try {
      await query(
        `INSERT INTO vehicles (id, name, brand, category, top_speed, acceleration, handling, armor, price, description, spawn_location, cover_subtitle, badge, color, audio_preset, custom_audio_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           brand = VALUES(brand),
           category = VALUES(category),
           top_speed = VALUES(top_speed),
           acceleration = VALUES(acceleration),
           handling = VALUES(handling),
           armor = VALUES(armor),
           price = VALUES(price),
           description = VALUES(description),
           spawn_location = VALUES(spawn_location),
           cover_subtitle = VALUES(cover_subtitle),
           badge = VALUES(badge),
           color = VALUES(color),
           audio_preset = VALUES(audio_preset),
           custom_audio_url = VALUES(custom_audio_url)`,
        [
          vehId,
          name.trim(),
          brand.trim(),
          finalCategory,
          finalTopSpeed,
          acceleration,
          handling,
          armor,
          price,
          finalDesc,
          finalLocation,
          finalCover,
          badge,
          color,
          finalAudio,
          custom_audio_url,
        ]
      )
    } catch (dbErr) {
      console.warn('MySQL vehicle save error:', dbErr.message)
    }

    const formatted = {
      id: vehId,
      name: name.trim(),
      brand: brand.trim(),
      class: finalCategory,
      category: finalCategory,
      topSpeed: Number(finalTopSpeed) || 200,
      top_speed: finalTopSpeed,
      acceleration: Number(acceleration),
      handling: Number(handling),
      armor: Number(armor),
      price,
      location: finalLocation,
      spawn_location: finalLocation,
      desc: finalDesc,
      description: finalDesc,
      coverText: finalCover,
      cover_subtitle: finalCover,
      badge,
      color,
      audioEngine: finalAudio,
      audio_preset: finalAudio,
      custom_audio_url,
    }

    // Sync to local file cache
    const current = readLocalVehicles()
    const idx = current.findIndex((v) => String(v.id) === String(vehId))
    let updated
    if (idx >= 0) {
      updated = [...current]
      updated[idx] = { ...updated[idx], ...formatted }
    } else {
      updated = [formatted, ...current]
    }
    writeLocalVehicles(updated)

    return NextResponse.json({ success: true, vehicle: formatted })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    let id = searchParams.get('id')
    if (!id) {
      const body = await request.json().catch(() => ({}))
      id = body.id
    }

    if (!id) {
      return NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 })
    }

    const vehId = String(id)

    try {
      await query('DELETE FROM vehicles WHERE id = ?', [vehId])
    } catch (dbErr) {
      console.warn('MySQL vehicle delete error:', dbErr.message)
    }

    // Update local cache
    const current = readLocalVehicles()
    const updated = current.filter((v) => String(v.id) !== vehId)
    writeLocalVehicles(updated)

    return NextResponse.json({ success: true, id: vehId })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
