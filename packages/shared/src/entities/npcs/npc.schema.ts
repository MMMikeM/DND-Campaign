import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { npcFactionSchema } from "../relations.schema.js"

// Define the main npcs table
export const npcs = sqliteTable("npcs", {
	id: integer("id").primaryKey().notNull(),
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
})

// Define the npc descriptions table (for the array of descriptions)
export const npcDescriptions = sqliteTable(
	"npc_descriptions",
	{
		npcId: integer("npc_id")
			.notNull()
			.references(() => npcs.id, { onDelete: "cascade" }),
		description: text("description").notNull(),
	},
	(table) => [primaryKey({ columns: [table.npcId, table.description] })],
)

// Define the npc personality traits table
export const npcPersonalityTraits = sqliteTable(
	"npc_personality_traits",
	{
		npcId: integer("npc_id")
			.notNull()
			.references(() => npcs.id, { onDelete: "cascade" }),
		trait: text("trait").notNull(),
	},
	(table) => [primaryKey({ columns: [table.npcId, table.trait] })],
)

// Define the npc quests table
export const npcQuests = sqliteTable(
	"npc_quests",
	{
		npcId: integer("npc_id")
			.notNull()
			.references(() => npcs.id, { onDelete: "cascade" }),
		questId: integer("quest_id").notNull(),
		description: text("description").notNull(),
	},
	(table) => [primaryKey({ columns: [table.npcId, table.questId] })],
)

// Define the npc relationships table
export const npcRelationships = sqliteTable(
	"npc_relationships",
	{
		npcId: integer("npc_id")
			.notNull()
			.references(() => npcs.id, { onDelete: "cascade" }),
		targetId: integer("target_id")
			.notNull()
			.references(() => npcs.id),
		description: text("description").notNull(),
	},
	(table) => [primaryKey({ columns: [table.npcId, table.targetId] })],
)

// Define the npc locations table
export const npcLocations = sqliteTable(
	"npc_locations",
	{
		npcId: integer("npc_id")
			.notNull()
			.references(() => npcs.id, { onDelete: "cascade" }),
		locationId: integer("location_id").notNull(),
		description: text("description").notNull(),
	},
	(table) => [primaryKey({ columns: [table.npcId, table.locationId] })],
)

// Define the npc inventory table
export const npcInventory = sqliteTable(
	"npc_inventory",
	{
		npcId: integer("npc_id")
			.notNull()
			.references(() => npcs.id, { onDelete: "cascade" }),
		item: text("item").notNull(),
	},
	(table) => [primaryKey({ columns: [table.npcId, table.item] })],
)

const npcSchemas = {
	select: {
		npcs: createSelectSchema(npcs),
		npcDescriptions: createSelectSchema(npcDescriptions),
		npcPersonalityTraits: createSelectSchema(npcPersonalityTraits),
		npcQuests: createSelectSchema(npcQuests),
		npcRelationships: createSelectSchema(npcRelationships),
		npcLocations: createSelectSchema(npcLocations),
		npcInventory: createSelectSchema(npcInventory),
	},
	insert: {
		npcs: createInsertSchema(npcs),
		npcDescriptions: createInsertSchema(npcDescriptions),
		npcPersonalityTraits: createInsertSchema(npcPersonalityTraits),
		npcQuests: createInsertSchema(npcQuests),
		npcRelationships: createInsertSchema(npcRelationships),
		npcLocations: createInsertSchema(npcLocations),
		npcInventory: createInsertSchema(npcInventory),
	},
}

// Define a typed NPC schema using Zod
export const NpcSchema = npcSchemas.select.npcs.extend({
	description: z.array(z.string()),
	personality: z.array(z.string()),
	quests: z.array(
		z.object({
			id: z.number(),
			description: z.string(),
		}),
	),
	relationships: z.array(
		z.object({
			id: z.number(),
			description: z.string(),
		}),
	),
	location: z.array(
		z.object({
			id: z.number(),
			description: z.string(),
		}),
	),
	inventory: z.array(z.string()),
	factions: z.array(npcFactionSchema.omit({ npcId: true })),
})

// Define types based on the Zod schemas
export type Npc = z.infer<typeof NpcSchema>
export type NewNpc = z.infer<typeof npcSchemas.insert.npcs>
export type NpcRelationship = z.infer<typeof npcSchemas.select.npcRelationships>
export type NewNpcRelationship = z.infer<typeof npcSchemas.insert.npcRelationships>
