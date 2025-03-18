import { sqliteTable, text, primaryKey, integer } from "drizzle-orm/sqlite-core"
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
	(table) => [primaryKey({ columns: [table.factionId, table.resource] })],
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
		npcs: z.array(npcFactionSchema.omit({ factionId: true })),
		locations: z.array(locationFactionSchema.omit({ factionId: true })),
		associatedQuests: z.array(questFactionSchema.omit({ factionId: true })),
	})
	.strict()

export const newFactionSchema = insert.factions
	.omit({ id: true })
	.extend({
		resources: z.array(insert.factionResources.omit({ factionId: true })),
		leadership: z.array(insert.factionLeadership.omit({ factionId: true })),
		members: z.array(insert.factionMembers.omit({ factionId: true })),
		allies: z.array(insert.factionAllies.omit({ factionId: true })),
		enemies: z.array(insert.factionEnemies.omit({ factionId: true })),
		quests: z.array(insert.factionQuests.omit({ factionId: true })),
		npcs: z.array(insertNpcFactionSchema.omit({ factionId: true })),
		locations: z.array(insertLocationFactionSchema.omit({ factionId: true })),
		associatedQuests: z.array(insertQuestFactionSchema.omit({ factionId: true })),
	})
	.strict()

export const updateFactionSchema = update.factions
	.extend({
		resources: z.array(insert.factionResources.omit({ factionId: true })).optional(),
		leadership: z.array(insert.factionLeadership.omit({ factionId: true })).optional(),
		members: z.array(insert.factionMembers.omit({ factionId: true })).optional(),
		allies: z.array(insert.factionAllies.omit({ factionId: true })).optional(),
		enemies: z.array(insert.factionEnemies.omit({ factionId: true })).optional(),
		quests: z.array(insert.factionQuests.omit({ factionId: true })).optional(),
		npcs: z.array(insertNpcFactionSchema.omit({ factionId: true })).optional(),
		locations: z.array(insertLocationFactionSchema.omit({ factionId: true })).optional(),
		associatedQuests: z.array(insertQuestFactionSchema.omit({ factionId: true })).optional(),
	})
	.strict()

// Define types based on the Zod schemas
export type Faction = z.infer<typeof FactionSchema>
export type NewFaction = z.infer<typeof newFactionSchema>
export type UpdateFaction = z.infer<typeof updateFactionSchema>
