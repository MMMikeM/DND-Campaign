import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { jsonArray } from "../db/utils.js"
import { relations } from "drizzle-orm"

const alignments = [
	"lawful good",
	"neutral good",
	"chaotic good",
	"lawful neutral",
	"true neutral",
	"chaotic neutral",
	"lawful evil",
	"neutral evil",
	"chaotic evil",
] as const

// Define the main factions table
export const factions = sqliteTable("factions", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	type: text("type").notNull(),
	alignment: text("alignment", { enum: alignments }),
	description: jsonArray("description"),
	publicGoal: text("public_goal"),
	trueGoal: text("true_goal"),
	headquarters: text("headquarters"),
	territory: text("territory"),
	history: jsonArray("history"),
	notes: jsonArray("notes"),
	resources: jsonArray("resources"),
})

// Faction allies and enemies combined into a single relationships table
export const factionRelationships = sqliteTable("faction_relationships", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	factionId: integer("faction_id")
		.notNull()
		.references(() => factions.id, { onDelete: "cascade" }), // Keep CASCADE here as this is directly tied to the faction
	otherFactionId: integer("other_faction_id")
		.notNull()
		.references(() => factions.id, { onDelete: "set null" }), // If the other faction is deleted, we keep the relationship but set the reference to NULL
	type: text("type", { enum: ["ally", "enemy", "neutral"] }).notNull(),
	description: jsonArray("description"),
	strength: text("strength"),
	notes: jsonArray("notes"),
})
