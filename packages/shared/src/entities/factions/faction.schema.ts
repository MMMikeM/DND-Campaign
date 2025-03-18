import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"
import {
	npcFactionSchema,
	locationFactionSchema,
	questFactionSchema,
	insertNpcFactionSchema,
	insertLocationFactionSchema,
	insertQuestFactionSchema,
} from "../relations.schema.js"

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

const factionSchemas = {
	select: {
		factions: createSelectSchema(factions),
		factionResources: createSelectSchema(factionResources),
		factionLeadership: createSelectSchema(factionLeadership),
		factionMembers: createSelectSchema(factionMembers),
		factionAllies: createSelectSchema(factionAllies),
		factionEnemies: createSelectSchema(factionEnemies),
		factionQuests: createSelectSchema(factionQuests),
		factionNpcs: createSelectSchema(factionNpcs),
		factionLocations: createSelectSchema(factionLocations),
	},
	insert: {
		factions: createInsertSchema(factions),
		factionResources: createInsertSchema(factionResources),
		factionLeadership: createInsertSchema(factionLeadership),
		factionMembers: createInsertSchema(factionMembers),
		factionAllies: createInsertSchema(factionAllies),
		factionEnemies: createInsertSchema(factionEnemies),
		factionQuests: createInsertSchema(factionQuests),
		factionNpcs: createInsertSchema(factionNpcs),
		factionLocations: createInsertSchema(factionLocations),
	},
	update: {
		factions: createUpdateSchema(factions),
		factionResources: createUpdateSchema(factionResources),
		factionLeadership: createUpdateSchema(factionLeadership),
		factionMembers: createUpdateSchema(factionMembers),
		factionAllies: createUpdateSchema(factionAllies),
		factionEnemies: createUpdateSchema(factionEnemies),
		factionQuests: createUpdateSchema(factionQuests),
		factionNpcs: createUpdateSchema(factionNpcs),
		factionLocations: createUpdateSchema(factionLocations),
	},
}

const { select, insert, update } = factionSchemas

// Define a typed Faction schema using Zod
export const FactionSchema = select.factions
	.extend({
		resources: z.array(select.factionResources.omit({ factionId: true })),
		leadership: z.array(select.factionLeadership.omit({ factionId: true })),
		members: z.array(select.factionMembers.omit({ factionId: true })),
		allies: z.array(select.factionAllies.omit({ factionId: true })),
		enemies: z.array(select.factionEnemies.omit({ factionId: true })),
		quests: z.array(select.factionQuests.omit({ factionId: true })),
		npcs: z.array(select.factionNpcs.omit({ factionId: true })),
		locations: z.array(select.factionLocations.omit({ factionId: true })),
	})
	.strict()

export const newFactionSchema = insert.factions
	.omit({ id: true })
	.extend({
		resources: z.array(insert.factionResources.omit({ id: true, factionId: true })).optional(),
		leadership: z.array(insert.factionLeadership.omit({ id: true, factionId: true })).optional(),
		members: z.array(insert.factionMembers.omit({ id: true, factionId: true })).optional(),
		allies: z.array(insert.factionAllies.omit({ id: true, factionId: true })).optional(),
		enemies: z.array(insert.factionEnemies.omit({ id: true, factionId: true })).optional(),
		quests: z.array(insert.factionQuests.omit({ id: true, factionId: true })).optional(),
		npcs: z.array(insert.factionNpcs.omit({ id: true, factionId: true })).optional(),
		locations: z.array(insert.factionLocations.omit({ id: true, factionId: true })).optional(),
	})
	.strict()

export const updateFactionSchema = update.factions
	.extend({
		resources: z.array(insert.factionResources.omit({ id: true, factionId: true })).optional(),
		leadership: z.array(insert.factionLeadership.omit({ id: true, factionId: true })).optional(),
		members: z.array(insert.factionMembers.omit({ id: true, factionId: true })).optional(),
		allies: z.array(insert.factionAllies.omit({ id: true, factionId: true })).optional(),
		enemies: z.array(insert.factionEnemies.omit({ id: true, factionId: true })).optional(),
		quests: z.array(insert.factionQuests.omit({ id: true, factionId: true })).optional(),
		npcs: z.array(insert.factionNpcs.omit({ id: true, factionId: true })).optional(),
		locations: z.array(insert.factionLocations.omit({ id: true, factionId: true })).optional(),
	})
	.strict()

export const getFactionSchema = z
	.number()
	.refine((id) => id > 0, {
		message: "Faction ID must be greater than 0",
	})
	.describe("Get a faction by ID")

// Define types based on the Zod schemas
export type Faction = z.infer<typeof FactionSchema>
export type NewFaction = z.infer<typeof newFactionSchema>
export type UpdateFaction = z.infer<typeof updateFactionSchema>
