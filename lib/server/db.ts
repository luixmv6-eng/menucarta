import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { randomUUID } from "node:crypto"
import type { DatabaseShape } from "../types"
import { buildSeed } from "./seed"

// On serverless platforms (Vercel) the project directory is read-only; only the
// system temp dir is writable. Fall back to it so persisting never crashes a request.
const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)
const DATA_DIR = IS_SERVERLESS ? path.join(os.tmpdir(), "lumina-data") : path.join(process.cwd(), "data")
const DB_FILE = path.join(DATA_DIR, "db.json")

declare global {
  // eslint-disable-next-line no-var
  var __luminaDb: DatabaseShape | undefined
}

function load(): DatabaseShape {
  if (globalThis.__luminaDb) return globalThis.__luminaDb
  let db: DatabaseShape
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8")
    const parsed = JSON.parse(raw) as Partial<DatabaseShape>
    const seed = buildSeed()
    // Fill any collections missing from older db files so upgrades never crash
    db = {
      settings: { ...seed.settings, ...parsed.settings, about: { ...seed.settings.about, ...parsed.settings?.about }, ordering: { ...seed.settings.ordering, ...parsed.settings?.ordering } },
      categories: parsed.categories ?? seed.categories,
      experiences: parsed.experiences ?? seed.experiences,
      tables: parsed.tables ?? seed.tables,
      reservations: parsed.reservations ?? [],
      orders: parsed.orders ?? [],
      messages: parsed.messages ?? [],
      analytics: parsed.analytics ?? [],
    }
  } catch {
    db = buildSeed()
    persist(db)
  }
  globalThis.__luminaDb = db
  return db
}

function persist(db: DatabaseShape) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true })
    const tmp = DB_FILE + ".tmp"
    fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8")
    fs.renameSync(tmp, DB_FILE)
  } catch {
    // Read-only filesystem (e.g. serverless cold start): keep serving from the
    // in-memory copy held in globalThis.__luminaDb so requests never 500.
  }
}

export function getDb(): DatabaseShape {
  return load()
}

export function mutateDb<T>(fn: (db: DatabaseShape) => T): T {
  const db = load()
  const result = fn(db)
  persist(db)
  return result
}

export function newId(prefix: string): string {
  return `${prefix}-${randomUUID().slice(0, 8)}`
}

export function trackEvent(type: "page_view" | "item_view", name: string) {
  mutateDb((db) => {
    db.analytics.push({ id: newId("ev"), type, name, ts: new Date().toISOString() })
    // Keep the log bounded so the JSON file never grows unchecked
    if (db.analytics.length > 20000) db.analytics = db.analytics.slice(-15000)
  })
}
