import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

// Define the main factions table
export const factions = sqliteTable("factions", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	type: text("type").notNull(),
	alignment: text("alignment"),
	description: text("description"),
	publicGoal: text("public_goal"),
	trueGoal: text("true_goal"),
	headquarters: text("headquarters"),
	territory: text("territory"),
	history: text("history"),
	notes: text("notes"),
})

// Define the faction resources table
export const factionResources = sqliteTable("faction_resources", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	factionId: integer("faction_id")
		.notNull()
		.references(() => factions.id, { onDelete: "cascade" }),
	resource: text("resource").notNull(),
})

// Define the faction leadership table
export const factionLeadership = sqliteTable("faction_leadership", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	factionId: integer("faction_id")
		.notNull()
		.references(() => factions.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	role: text("role"),
	description: text("description"),
	secret: text("secret"),
	stats: text("stats"),
	bio: text("bio"),
})

// Define the faction members table
export const factionMembers = sqliteTable("faction_members", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	factionId: integer("faction_id")
		.notNull()
		.references(() => factions.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	description: text("description"),
	stats: text("stats"),
})

// Define the faction allies table
export const factionAllies = sqliteTable("faction_allies", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	factionId: integer("faction_id")
		.notNull()
		.references(() => factions.id, { onDelete: "cascade" }),
	allyId: integer("ally_id")
		.notNull()
		.references(() => factions.id),
	relationship: text("relationship"),
	notes: text("notes"),
})

// Define the faction enemies table
export const factionEnemies = sqliteTable("faction_enemies", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	factionId: integer("faction_id")
		.notNull()
		.references(() => factions.id, { onDelete: "cascade" }),
	enemyId: integer("enemy_id")
		.notNull()
		.references(() => factions.id),
	conflict: text("conflict"),
	severity: text("severity"),
})

// Define the faction quests table
export const factionQuests = sqliteTable("faction_quests", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	factionId: integer("faction_id")
		.notNull()
		.references(() => factions.id, { onDelete: "cascade" }),
	questId: integer("quest_id").notNull(),
	importance: text("importance"),
})

// Define the NPCs in factions table
export const factionNpcs = sqliteTable("faction_npcs", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	factionId: integer("faction_id")
		.notNull()
		.references(() => factions.id, { onDelete: "cascade" }),
	npcId: integer("npc_id").notNull(),
	role: text("role"),
	status: text("status"),
})

// Define the faction locations table
export const factionLocations = sqliteTable("faction_locations", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	factionId: integer("faction_id")
		.notNull()
		.references(() => factions.id, { onDelete: "cascade" }),
	locationId: integer("location_id").notNull(),
	controlLevel: text("control_level"),
	purpose: text("purpose"),
})
