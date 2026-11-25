import fs from 'fs'
import path from 'path'
import { query } from '@/lib/db'

const vehiclesFilePath = path.join(process.cwd(), 'data', 'vehicles.json')
const cheatsFilePath = path.join(process.cwd(), 'data', 'cheats.json')

function readJsonFile(filePath) {
  if (!fs.existsSync(filePath)) return []
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (err) {
    return []
  }
}

export async function getVehicles() {
  try {
    const rows = await query('SELECT * FROM vehicles ORDER BY id ASC')
    if (rows && rows.length > 0) {
      const fallbackVehicles = readJsonFile(vehiclesFilePath)
      return rows.map((row) => {
        const fallback = fallbackVehicles.find((fv) => fv.name === row.name || String(fv.id) === String(row.id))
        return {
          id: row.id,
          name: row.name,
          brand: row.brand,
          class: row.category,
          category: row.category,
          topSpeed: Number(row.top_speed) || fallback?.topSpeed || 180,
          top_speed: row.top_speed || String(fallback?.topSpeed || 180),
          acceleration: Number(row.acceleration) || fallback?.acceleration || 3.0,
          handling: Number(row.handling) || fallback?.handling || 8.0,
          armor: Number(row.armor) || fallback?.armor || 7.0,
          price: fallback?.price || row.price || 'In-Game Economy TBD',
          location: fallback?.location || row.spawn_location || 'Vice City & Leonida',
          spawn_location: fallback?.location || row.spawn_location || 'Vice City & Leonida',
          desc: fallback?.desc || row.description || '',
          description: fallback?.desc || row.description || '',
          coverText: row.cover_subtitle || `${row.brand?.toUpperCase()} MOTOR DIVISION`,
          cover_subtitle: row.cover_subtitle,
          badge: fallback?.badge || row.badge || 'SPOTTED IN TRAILER 1',
          color: row.color || fallback?.color || 'from-gta-teal to-blue-500',
          audioEngine: row.audio_preset || 'v8',
          audio_preset: row.audio_preset,
          custom_audio_url: row.custom_audio_url || null,
        }
      })
    }
  } catch (err) {
    console.warn('MySQL getVehicles warning, using JSON cache:', err.message)
  }
  return readJsonFile(vehiclesFilePath)
}

export async function getCheats() {
  try {
    const rows = await query('SELECT * FROM cheats WHERE active = 1 ORDER BY id ASC')
    if (rows && rows.length > 0) {
      const fallbackCheats = readJsonFile(cheatsFilePath)
      const mapped = rows
        .filter((r) => !r.name.toLowerCase().startsWith('audit'))
        .map((r) => {
          const fallback = fallbackCheats.find((fc) => fc.name === r.name)
          return {
            id: r.id,
            name: r.name,
            category: r.category || fallback?.category || 'Player',
            effect: r.effect || fallback?.effect || '',
            description: fallback?.description || r.effect || '',
            ps5: r.code_ps || fallback?.ps5 || '',
            xbox: r.code_xbox || fallback?.xbox || '',
            pc: r.code_pc || fallback?.pc || null,
            combo: fallback?.combo || r.code_ps || r.code_xbox || '',
            warning: fallback?.warning || 'Using cheats disables Trophies and Achievements for the active session',
            active: Boolean(r.active !== 0),
          }
        })

      // Deduplicate by name
      const unique = []
      const seenNames = new Set()
      for (const item of mapped) {
        if (!seenNames.has(item.name.toLowerCase())) {
          seenNames.add(item.name.toLowerCase())
          unique.push(item)
        }
      }
      return unique
    }
  } catch (err) {
    console.warn('MySQL getCheats warning, using JSON cache:', err.message)
  }
  return readJsonFile(cheatsFilePath)
}
