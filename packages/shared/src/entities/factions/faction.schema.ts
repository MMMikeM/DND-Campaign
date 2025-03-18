import { sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

// Define the main factions table
export const factions = sqliteTable("factions", {
	id: text("id").primaryKey().notNull(),
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
		factionId: text("faction_id")
			.notNull()
			.references(() => factions.id, { onDelete: "cascade" }),
		resource: text("resource").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.factionId, table.resource] }),
		}
	},
)

// Define the faction leadership table
export const factionLeadership = sqliteTable(
	"faction_leadership",
	{
		factionId: text("faction_id")
			.notNull()
			.references(() => factions.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		role: text("role"),
		description: text("description"),
		secret: text("secret"),
		stats: text("stats"),
		bio: text("bio"),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.factionId, table.name] }),
		}
	},
)

// Define the faction members table
export const factionMembers = sqliteTable(
	"faction_members",
	{
		factionId: text("faction_id")
			.notNull()
			.references(() => factions.id, { onDelete: "cascade" }),
		name: text("name").notNull(),
		description: text("description"),
		stats: text("stats"),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.factionId, table.name] }),
		}
	},
)

// Define the faction allies table
export const factionAllies = sqliteTable(
	"faction_allies",
	{
		factionId: text("faction_id")
			.notNull()
			.references(() => factions.id, { onDelete: "cascade" }),
		allyId: text("ally_id").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.factionId, table.allyId] }),
		}
	},
)

// Define the faction enemies table
export const factionEnemies = sqliteTable(
	"faction_enemies",
	{
		factionId: text("faction_id")
			.notNull()
			.references(() => factions.id, { onDelete: "cascade" }),
		enemyId: text("enemy_id").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.factionId, table.enemyId] }),
		}
	},
)

// Define the faction quests table
export const factionQuests = sqliteTable(
	"faction_quests",
	{
		factionId: text("faction_id")
			.notNull()
			.references(() => factions.id, { onDelete: "cascade" }),
		questId: text("quest_id").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.factionId, table.questId] }),
		}
	},
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

// Define a typed Faction schema using Zod
export const FactionSchema = selectFactionSchema.extend({
	resources: z.array(z.string()),
	leadership: z.array(selectFactionLeadershipSchema.omit({ factionId: true })),
	members: z.array(selectFactionMemberSchema.omit({ factionId: true })),
	allies: z.array(z.string()),
	enemies: z.array(z.string()),
	quests: z.array(z.string()),
})

// Define types based on the Zod schemas
export type Faction = z.infer<typeof FactionSchema>
export type NewFaction = z.infer<typeof insertFactionSchema>
export type FactionLeader = z.infer<typeof selectFactionLeadershipSchema>
export type FactionMember = z.infer<typeof selectFactionMemberSchema>
