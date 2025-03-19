import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { json } from "../db/utils"

// Define the main npcs table
export const npcs = sqliteTable("npcs", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	race: text("race").notNull(),
	gender: text("gender").notNull(),
	occupation: text("occupation").notNull(),
	role: text("role"),
	quirk: text("quirk"),
	background: text("background").notNull(),
	motivation: text("motivation").notNull(),
	secret: text("secret").notNull(),
	stats: text("stats").notNull(),
	// JSON columns for one-to-many relations
	descriptions: json<string[]>("descriptions"),
	personalityTraits: json<string[]>("personality_traits"),
	inventory: json<{ item: string; quantity: number; notes?: string }[]>("inventory"),
	dialogue: json<{ topic: string; response: string; condition?: string }[]>("dialogue"),
})
