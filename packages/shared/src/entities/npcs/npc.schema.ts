import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

// Define the main npcs table
export const npcs = sqliteTable("npcs", {
	id: text("id").primaryKey().notNull(),
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
		npcId: text("npc_id")
			.notNull()
			.references(() => npcs.id, { onDelete: "cascade" }),
		description: text("description").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.npcId, table.description] }),
		}
	},
)

// Define the npc personality traits table
export const npcPersonalityTraits = sqliteTable(
	"npc_personality_traits",
	{
		npcId: text("npc_id")
			.notNull()
			.references(() => npcs.id, { onDelete: "cascade" }),
		trait: text("trait").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.npcId, table.trait] }),
		}
	},
)

// Define the npc quests table
export const npcQuests = sqliteTable(
	"npc_quests",
	{
		npcId: text("npc_id")
			.notNull()
			.references(() => npcs.id, { onDelete: "cascade" }),
		questId: text("quest_id").notNull(),
		description: text("description").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.npcId, table.questId] }),
		}
	},
)

// Define the npc relationships table
export const npcRelationships = sqliteTable(
	"npc_relationships",
	{
		npcId: text("npc_id")
			.notNull()
			.references(() => npcs.id, { onDelete: "cascade" }),
		targetId: text("target_id").notNull(),
		description: text("description").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.npcId, table.targetId] }),
		}
	},
)

// Define the npc locations table
export const npcLocations = sqliteTable(
	"npc_locations",
	{
		npcId: text("npc_id")
			.notNull()
			.references(() => npcs.id, { onDelete: "cascade" }),
		locationId: text("location_id").notNull(),
		description: text("description").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.npcId, table.locationId] }),
		}
	},
)

// Define the npc inventory table
export const npcInventory = sqliteTable(
	"npc_inventory",
	{
		npcId: text("npc_id")
			.notNull()
			.references(() => npcs.id, { onDelete: "cascade" }),
		item: text("item").notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.npcId, table.item] }),
		}
	},
)

// Create Zod schemas for insert and select operations
export const insertNpcSchema = createInsertSchema(npcs)
export const selectNpcSchema = createSelectSchema(npcs)
export const insertNpcDescriptionSchema = createInsertSchema(npcDescriptions)
export const selectNpcDescriptionSchema = createSelectSchema(npcDescriptions)
export const insertNpcPersonalitySchema = createInsertSchema(npcPersonalityTraits)
export const selectNpcPersonalitySchema = createSelectSchema(npcPersonalityTraits)
export const insertNpcQuestSchema = createInsertSchema(npcQuests)
export const selectNpcQuestSchema = createSelectSchema(npcQuests)
export const insertNpcRelationshipSchema = createInsertSchema(npcRelationships)
export const selectNpcRelationshipSchema = createSelectSchema(npcRelationships)
export const insertNpcLocationSchema = createInsertSchema(npcLocations)
export const selectNpcLocationSchema = createSelectSchema(npcLocations)
export const insertNpcInventorySchema = createInsertSchema(npcInventory)
export const selectNpcInventorySchema = createSelectSchema(npcInventory)

// Define a typed NPC schema using Zod
export const NpcSchema = selectNpcSchema.extend({
	description: z.array(z.string()),
	personality: z.array(z.string()),
	quests: z.array(
		z.object({
			id: z.string(),
			description: z.string(),
		}),
	),
	relationships: z.array(
		z.object({
			id: z.string(),
			description: z.string(),
		}),
	),
	location: z.array(
		z.object({
			id: z.string(),
			description: z.string(),
		}),
	),
	inventory: z.array(z.string()),
})

// Define types based on the Zod schemas
export type Npc = z.infer<typeof NpcSchema>
export type NewNpc = z.infer<typeof insertNpcSchema>
export type NpcRelationship = z.infer<typeof selectNpcRelationshipSchema>
export type NewNpcRelationship = z.infer<typeof insertNpcRelationshipSchema>
