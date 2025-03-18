import { sqliteTable, text, primaryKey, integer } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

// Define the main factions table
export const factions = sqliteTable("factions", {
	id: integer("id").primaryKey().notNull(),
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
export const factionResources = sqliteTable(
	"faction_resources",
	{
		factionId: integer("faction_id")
			.notNull()
			.references(() => factions.id, { onDelete: "cascade" }),
		resource: text("resource").notNull(),
	},
	(table) => primaryKey({ columns: [table.factionId, table.resource] }),
)

// Define the faction leadership table
export const factionLeadership = sqliteTable(
	"faction_leadership",
	{
		factionId: integer("faction_id")
			.notNull()
			.references(() => factions.id),
		name: text("name").notNull(),
		role: text("role"),
		description: text("description"),
		secret: text("secret"),
		stats: text("stats"),
		bio: text("bio"),
	},
	(table) => [primaryKey({ columns: [table.factionId, table.name] })],
)

// Define the faction members table
export const factionMembers = sqliteTable(
	"faction_members",
	{
		factionId: integer("faction_id")
			.notNull()
			.references(() => factions.id),
		name: text("name").notNull(),
		description: text("description"),
		stats: text("stats"),
	},
	(table) => [primaryKey({ columns: [table.factionId, table.name] })],
)

// Define the faction allies table
export const factionAllies = sqliteTable(
	"faction_allies",
	{
		factionId: integer("faction_id")
			.notNull()
			.references(() => factions.id),
		allyId: integer("ally_id")
			.notNull()
			.references(() => factions.id),
	},
	(table) => [primaryKey({ columns: [table.factionId, table.allyId] })],
)

// Define the faction enemies table
export const factionEnemies = sqliteTable(
	"faction_enemies",
	{
		factionId: integer("faction_id")
			.notNull()
			.references(() => factions.id),
		enemyId: integer("enemy_id")
			.notNull()
			.references(() => factions.id),
	},
	(table) => [primaryKey({ columns: [table.factionId, table.enemyId] })],
)

// Define the faction quests table
export const factionQuests = sqliteTable(
	"faction_quests",
	{
		factionId: integer("faction_id")
			.notNull()
			.references(() => factions.id, { onDelete: "cascade" }),
		questId: integer("quest_id").notNull(),
	},
	(table) => [primaryKey({ columns: [table.factionId, table.questId] })],
)

const factionSchemas = {
	select: {
		factions: createSelectSchema(factions),
		factionResources: createSelectSchema(factionResources),
		factionLeadership: createSelectSchema(factionLeadership),
		factionMembers: createSelectSchema(factionMembers),
		factionAllies: createSelectSchema(factionAllies),
		factionEnemies: createSelectSchema(factionEnemies),
		factionQuests: createSelectSchema(factionQuests),
	},
	insert: {
		factions: createInsertSchema(factions),
		factionResources: createInsertSchema(factionResources),
		factionLeadership: createInsertSchema(factionLeadership),
		factionMembers: createInsertSchema(factionMembers),
		factionAllies: createInsertSchema(factionAllies),
		factionEnemies: createInsertSchema(factionEnemies),
		factionQuests: createInsertSchema(factionQuests),
	},
	update: {
		factions: createUpdateSchema(factions),
		factionResources: createUpdateSchema(factionResources),
		factionLeadership: createUpdateSchema(factionLeadership),
		factionMembers: createUpdateSchema(factionMembers),
		factionAllies: createUpdateSchema(factionAllies),
		factionEnemies: createUpdateSchema(factionEnemies),
		factionQuests: createUpdateSchema(factionQuests),
	},
}

// Define a typed Faction schema using Zod
export const FactionSchema = factionSchemas.select.factions.extend({
	resources: z.array(z.string()),
	leadership: z.array(factionSchemas.select.factionLeadership.omit({ factionId: true })),
	members: z.array(factionSchemas.select.factionMembers.omit({ factionId: true })),
	allies: z.array(z.number()),
	enemies: z.array(z.number()),
	quests: z.array(z.number()),
})

// Define types based on the Zod schemas
export type Faction = z.infer<typeof FactionSchema>
export type NewFaction = z.infer<typeof factionSchemas.insert.factions>
