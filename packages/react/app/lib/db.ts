import { initializeDatabase } from "@tome-master/shared/db"

export const db = initializeDatabase(
	process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:5432/dnd_campaign",
)
