import { initializeDatabase } from "@tome-master/shared";

const dbPath = "/Users/mikemurray/Development/DND-Campaign/dnddb.sqlite"
export const db: ReturnType<typeof initializeDatabase> = initializeDatabase(dbPath)