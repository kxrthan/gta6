import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

const cheatsFilePath = path.join(process.cwd(), 'data', 'cheats.json')

function readCheats() {
  if (!fs.existsSync(cheatsFilePath)) {
    return []
  }
  try {
    const raw = fs.readFileSync(cheatsFilePath, 'utf8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error reading cheats.json:', err)
    return []
  }
}

function writeCheats(cheats) {
  try {
    const dir = path.dirname(cheatsFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(cheatsFilePath, JSON.stringify(cheats, null, 2), 'utf8')
  } catch (err) {
    console.warn('Error writing cheats.json:', err.message)
  }
}

export async function GET() {
  try {
    const rows = await query('SELECT * FROM cheats WHERE active = 1 ORDER BY id ASC')
    if (rows && rows.length > 0) {
      const fallbackCheats = readCheats()
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

      const unique = []
      const seen = new Set()
      for (const c of mapped) {
        if (!seen.has(c.name.toLowerCase())) {
          seen.add(c.name.toLowerCase())
          unique.push(c)
        }
      }
      return NextResponse.json({ success: true, cheats: unique })
    }
  } catch (dbErr) {
    console.warn('MySQL cheats fetch warning, using local file:', dbErr.message)
  }

  const fallback = readCheats().filter((c) => !c.name.toLowerCase().startsWith('audit'))
  return NextResponse.json({ success: true, cheats: fallback })
}

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      id,
      name,
      category = 'Player',
      effect = '',
      description = '',
      ps5 = '',
      xbox = '',
      pc = '',
      combo = '',
      warning = null,
    } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Cheat name is required' }, { status: 400 })
    }

    const currentCheats = readCheats()

    const cheatData = {
      id: id ? Number(id) : Date.now(),
      name: name.trim(),
      category: category.trim() || 'Player',
      effect: effect ? effect.trim() : (description ? description.trim() : ''),
      description: description ? description.trim() : (effect ? effect.trim() : ''),
      ps5: ps5 ? ps5.trim() : '',
      xbox: xbox ? xbox.trim() : '',
      pc: pc ? pc.trim() : null,
      combo: combo ? combo.trim() : '',
      warning: warning ? warning.trim() : null,
    }

    let updatedCheats
    const existingIndex = id ? currentCheats.findIndex((c) => Number(c.id) === Number(id)) : -1

    if (existingIndex >= 0) {
      updatedCheats = [...currentCheats]
      updatedCheats[existingIndex] = {
        ...currentCheats[existingIndex],
        ...cheatData,
      }
    } else {
      updatedCheats = [cheatData, ...currentCheats]
    }

    writeCheats(updatedCheats)

    // Sync to Bluehost MySQL
    try {
      if (id) {
        await query(
          `INSERT INTO cheats (id, name, effect, category, code_ps, code_xbox, code_pc)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             name = VALUES(name),
             effect = VALUES(effect),
             category = VALUES(category),
             code_ps = VALUES(code_ps),
             code_xbox = VALUES(code_xbox),
             code_pc = VALUES(code_pc)`,
          [
            Number(id),
            cheatData.name,
            cheatData.effect || cheatData.description || '',
            cheatData.category || 'Player',
            cheatData.ps5 || '',
            cheatData.xbox || '',
            cheatData.pc || '',
          ]
        )
      } else {
        const res = await query(
          `INSERT INTO cheats (name, effect, category, code_ps, code_xbox, code_pc)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            cheatData.name,
            cheatData.effect || cheatData.description || '',
            cheatData.category || 'Player',
            cheatData.ps5 || '',
            cheatData.xbox || '',
            cheatData.pc || '',
          ]
        )
        if (res.insertId) {
          cheatData.id = res.insertId
        }
      }
    } catch (dbErr) {
      console.warn('MySQL cheats sync warning:', dbErr.message)
    }

    return NextResponse.json({
      success: true,
      cheat: cheatData,
      cheats: updatedCheats,
    })
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
      return NextResponse.json({ error: 'Cheat ID is required' }, { status: 400 })
    }

    const currentCheats = readCheats()
    const updatedCheats = currentCheats.filter((c) => Number(c.id) !== Number(id))

    writeCheats(updatedCheats)

    try {
      await query('DELETE FROM cheats WHERE id = ?', [Number(id)])
    } catch (dbErr) {
      console.warn('MySQL cheats delete warning:', dbErr.message)
    }

    return NextResponse.json({
      success: true,
      message: `Cheat #${id} deleted`,
      cheats: updatedCheats,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
