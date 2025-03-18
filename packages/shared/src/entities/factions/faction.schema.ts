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
	(table) => ({
		pk: primaryKey({ columns: [table.factionId, table.resource] }),
	}),
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
	(table) => ({
		pk: primaryKey({ columns: [table.factionId, table.name] }),
	}),
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
	(table) => ({
		pk: primaryKey({ columns: [table.factionId, table.name] }),
	}),
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
	(table) => ({
		pk: primaryKey({ columns: [table.factionId, table.allyId] }),
	}),
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
	(table) => ({
		pk: primaryKey({ columns: [table.factionId, table.enemyId] }),
	}),
)

// Define the faction quests table
export const factionQuests = sqliteTable(
	"faction_quests",
	{
		factionId: integer("faction_id")
			.notNull()
			.references(() => factions.id, { onDelete: "cascade" }),
		questId: integer("quest_id").notNull(),
		// Note: Not adding a reference to quests table since it might be defined elsewhere
	},
	(table) => ({
		pk: primaryKey({ columns: [table.factionId, table.questId] }),
	}),
)

// Create Zod schemas for insert and select operations
export const insertFactionSchema = createInsertSchema(factions)
export const selectFactionSchema = createSelectSchema(factions)
export const insertFactionResourceSchema = createInsertSchema(factionResources)
export const selectFactionResourceSchema = createSelectSchema(factionResources)
export const insertFactionLeadershipSchema = createInsertSchema(factionLeadership)
export const selectFactionLeadershipSchema = createSelectSchema(factionLeadership)
export const insertFactionMemberSchema = createInsertSchema(factionMembers)
export const selectFactionMemberSchema = createSelectSchema(factionMembers)
export const updateFactionMemberSchema = createUpdateSchema(factionMembers)

// Define a typed Faction schema using Zod
export const FactionSchema = selectFactionSchema.extend({
	resources: z.array(z.string()),
	leadership: z.array(selectFactionLeadershipSchema.omit({ factionId: true })),
	members: z.array(selectFactionMemberSchema.omit({ factionId: true })),
	allies: z.array(z.number()),
	enemies: z.array(z.number()),
	quests: z.array(z.number()),
})

// Define types based on the Zod schemas
export type Faction = z.infer<typeof FactionSchema>
export type NewFaction = z.infer<typeof insertFactionSchema>
export type FactionLeader = z.infer<typeof selectFactionLeadershipSchema>
export type FactionMember = z.infer<typeof selectFactionMemberSchema>
