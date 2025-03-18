import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"
import {
	areaNpcSchema,
	districtNpcSchema,
	insertDistrictNpcSchema,
	insertAreaNpcSchema,
	npcFactionSchema,
	npcLocationSchema,
	questNpcSchema,
	insertNpcLocationSchema,
	insertNpcFactionSchema,
	insertQuestNpcSchema,
} from "../relations.schema.js"

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

const schemas = {
	select: {
		npcs: createSelectSchema(npcs),
		npcDescriptions: createSelectSchema(npcDescriptions),
		npcPersonalityTraits: createSelectSchema(npcPersonalityTraits),
		npcRelationships: createSelectSchema(npcRelationships),
		npcInventory: createSelectSchema(npcInventory),
	},
	insert: {
		npcs: createInsertSchema(npcs),
		npcDescriptions: createInsertSchema(npcDescriptions),
		npcPersonalityTraits: createInsertSchema(npcPersonalityTraits),
		npcRelationships: createInsertSchema(npcRelationships),
		npcInventory: createInsertSchema(npcInventory),
	},
	update: {
		npcs: createUpdateSchema(npcs),
		npcDescriptions: createUpdateSchema(npcDescriptions),
		npcPersonalityTraits: createUpdateSchema(npcPersonalityTraits),
		npcRelationships: createUpdateSchema(npcRelationships),
		npcInventory: createUpdateSchema(npcInventory),
	},
}

const { select, insert } = schemas

// Define a typed NPC schema using Zod
export const NpcSchema = select.npcs
	.extend({
		area: z.array(areaNpcSchema.omit({ npcId: true })),
		description: z.array(select.npcDescriptions.omit({ npcId: true })),
		dialogue: z.array(districtNpcSchema.omit({ npcId: true })),
		disctrict: z.array(districtNpcSchema.omit({ npcId: true })),
		factions: z.array(npcFactionSchema.omit({ npcId: true })),
		inventory: z.array(select.npcInventory.omit({ npcId: true })),
		location: z.array(npcLocationSchema.omit({ npcId: true })),
		personality: z.array(select.npcPersonalityTraits.omit({ npcId: true })),
		quests: z.array(questNpcSchema.omit({ npcId: true })),
		relationships: z.array(select.npcRelationships.omit({ npcId: true })),
	})
	.strict()

export const newNpcSchema = schemas.insert.npcs
	.omit({ id: true })
	.extend({
		area: z.array(insertAreaNpcSchema.omit({ npcId: true })),
		description: z.array(schemas.insert.npcDescriptions.omit({ npcId: true })),
		dialogue: z.array(insertDistrictNpcSchema.omit({ npcId: true })),
		disctrict: z.array(insertDistrictNpcSchema.omit({ npcId: true })),
		factions: z.array(insertNpcFactionSchema.omit({ npcId: true })),
		inventory: z.array(insert.npcInventory.omit({ npcId: true })),
		location: z.array(insertNpcLocationSchema.omit({ npcId: true })),
		personality: z.array(insert.npcPersonalityTraits.omit({ npcId: true })),
		quests: z.array(insertQuestNpcSchema.omit({ npcId: true })),
		relationships: z.array(insert.npcRelationships.omit({ npcId: true })),
	})
	.strict()

export const updateNpcSchema = schemas.update.npcs
	.extend({
		area: z.array(insertAreaNpcSchema.omit({ npcId: true })).optional(),
		description: z.array(schemas.insert.npcDescriptions.omit({ npcId: true })).optional(),
		dialogue: z.array(insertDistrictNpcSchema.omit({ npcId: true })).optional(),
		disctrict: z.array(insertDistrictNpcSchema.omit({ npcId: true })).optional(),
		factions: z.array(insertNpcFactionSchema.omit({ npcId: true })).optional(),
		inventory: z.array(insert.npcInventory.omit({ npcId: true })).optional(),
		location: z.array(insertNpcLocationSchema.omit({ npcId: true })).optional(),
		personality: z.array(insert.npcPersonalityTraits.omit({ npcId: true })).optional(),
		quests: z.array(insertQuestNpcSchema.omit({ npcId: true })).optional(),
		relationships: z.array(insert.npcRelationships.omit({ npcId: true })).optional(),
	})
	.strict()

// Define types based on the Zod schemas
export type Npc = z.infer<typeof NpcSchema>
export type NewNpc = z.infer<typeof schemas.insert.npcs>
