import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import fs from 'fs'

const DB_PATH = process.env.DATABASE_PATH || './database/db.json'

let db = null

export async function getDb() {
  if (!db) {
    const dbPath = path.resolve(process.cwd(), DB_PATH)
    
    // Ensure directory exists
    const dir = path.dirname(dbPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    const adapter = new JSONFile(dbPath)
    db = new Low(adapter)
    
    await db.read()
    
    // Initialize with default data if empty
    db.data ||= {
      users: [],
      trabajos: [],
      testimonios: [],
      proyectos: [],
      servicios: []
    }
    await db.write()
  }
  return db
}

export async function closeDb() {
  if (db) {
    await db.write()
    db = null
  }
}
