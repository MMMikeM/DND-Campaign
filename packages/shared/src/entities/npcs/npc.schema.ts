import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
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
	id: integer("id").primaryKey({ autoIncrement: true }),
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

// Define the npc descriptions table
export const npcDescriptions = sqliteTable("npc_descriptions", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id, { onDelete: "cascade" }),
	description: text("description").notNull(),
})

// Define the npc personality traits table
export const npcPersonalityTraits = sqliteTable("npc_personality_traits", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id, { onDelete: "cascade" }),
	trait: text("trait").notNull(),
})

// Define the npc relationships table
export const npcRelationships = sqliteTable("npc_relationships", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id, { onDelete: "cascade" }),
	targetId: integer("target_id")
		.notNull()
		.references(() => npcs.id),
	description: text("description").notNull(),
	relationship: text("relationship"),
})

// Define the npc inventory table
export const npcInventory = sqliteTable("npc_inventory", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id, { onDelete: "cascade" }),
	item: text("item").notNull(),
	quantity: integer("quantity").default(1),
	notes: text("notes"),
})

// Define the npc location connection table
export const npcLocations = sqliteTable("npc_locations", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id, { onDelete: "cascade" }),
	locationId: integer("location_id").notNull(),
	context: text("context"),
})

// Define the npc faction connection table
export const npcFactions = sqliteTable("npc_factions", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id, { onDelete: "cascade" }),
	factionId: integer("faction_id").notNull(),
	role: text("role"),
	status: text("status"),
})

// Define the npc quest connection table
export const npcQuests = sqliteTable("npc_quests", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id, { onDelete: "cascade" }),
	questId: integer("quest_id").notNull(),
	role: text("role"),
})

// Define the npc dialogue table
export const npcDialogue = sqliteTable("npc_dialogue", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	npcId: integer("npc_id")
		.notNull()
		.references(() => npcs.id, { onDelete: "cascade" }),
	topic: text("topic").notNull(),
	response: text("response").notNull(),
	condition: text("condition"),
})

const schemas = {
	select: {
		npcs: createSelectSchema(npcs),
		npcDescriptions: createSelectSchema(npcDescriptions),
		npcPersonalityTraits: createSelectSchema(npcPersonalityTraits),
		npcRelationships: createSelectSchema(npcRelationships),
		npcInventory: createSelectSchema(npcInventory),
		npcLocations: createSelectSchema(npcLocations),
		npcFactions: createSelectSchema(npcFactions),
		npcQuests: createSelectSchema(npcQuests),
		npcDialogue: createSelectSchema(npcDialogue),
	},
	insert: {
		npcs: createInsertSchema(npcs),
		npcDescriptions: createInsertSchema(npcDescriptions),
		npcPersonalityTraits: createInsertSchema(npcPersonalityTraits),
		npcRelationships: createInsertSchema(npcRelationships),
		npcInventory: createInsertSchema(npcInventory),
		npcLocations: createInsertSchema(npcLocations),
		npcFactions: createInsertSchema(npcFactions),
		npcQuests: createInsertSchema(npcQuests),
		npcDialogue: createInsertSchema(npcDialogue),
	},
	update: {
		npcs: createUpdateSchema(npcs),
		npcDescriptions: createUpdateSchema(npcDescriptions),
		npcPersonalityTraits: createUpdateSchema(npcPersonalityTraits),
		npcRelationships: createUpdateSchema(npcRelationships),
		npcInventory: createUpdateSchema(npcInventory),
		npcLocations: createUpdateSchema(npcLocations),
		npcFactions: createUpdateSchema(npcFactions),
		npcQuests: createUpdateSchema(npcQuests),
		npcDialogue: createUpdateSchema(npcDialogue),
	},
}

const { select, insert, update } = schemas

// Define a typed NPC schema using Zod
export const NpcSchema = select.npcs
	.extend({
		descriptions: z.array(select.npcDescriptions.omit({ npcId: true })),
		personalityTraits: z.array(select.npcPersonalityTraits.omit({ npcId: true })),
		relationships: z.array(select.npcRelationships.omit({ npcId: true })),
		inventory: z.array(select.npcInventory.omit({ npcId: true })),
		locations: z.array(select.npcLocations.omit({ npcId: true })),
		factions: z.array(select.npcFactions.omit({ npcId: true })),
		quests: z.array(select.npcQuests.omit({ npcId: true })),
		dialogue: z.array(select.npcDialogue.omit({ npcId: true })),
		// Include the area and district relations from imported schemas
		areas: z.array(areaNpcSchema.omit({ npcId: true })),
		districts: z.array(districtNpcSchema.omit({ npcId: true })),
	})
	.strict()

export const newNpcSchema = insert.npcs
	.omit({ id: true })
	.extend({
		descriptions: z.array(insert.npcDescriptions.omit({ id: true, npcId: true })).optional(),
		personalityTraits: z
			.array(insert.npcPersonalityTraits.omit({ id: true, npcId: true }))
			.optional(),
		relationships: z.array(insert.npcRelationships.omit({ id: true, npcId: true })).optional(),
		inventory: z.array(insert.npcInventory.omit({ id: true, npcId: true })).optional(),
		locations: z.array(insert.npcLocations.omit({ id: true, npcId: true })).optional(),
		factions: z.array(insert.npcFactions.omit({ id: true, npcId: true })).optional(),
		quests: z.array(insert.npcQuests.omit({ id: true, npcId: true })).optional(),
		dialogue: z.array(insert.npcDialogue.omit({ id: true, npcId: true })).optional(),
		// Include the area and district relations
		areas: z.array(insertAreaNpcSchema.omit({ npcId: true })).optional(),
		districts: z.array(insertDistrictNpcSchema.omit({ npcId: true })).optional(),
	})
	.strict()

export const updateNpcSchema = update.npcs
	.extend({
		descriptions: z.array(insert.npcDescriptions.omit({ id: true, npcId: true })).optional(),
		personalityTraits: z
			.array(insert.npcPersonalityTraits.omit({ id: true, npcId: true }))
			.optional(),
		relationships: z.array(insert.npcRelationships.omit({ id: true, npcId: true })).optional(),
		inventory: z.array(insert.npcInventory.omit({ id: true, npcId: true })).optional(),
		locations: z.array(insert.npcLocations.omit({ id: true, npcId: true })).optional(),
		factions: z.array(insert.npcFactions.omit({ id: true, npcId: true })).optional(),
		quests: z.array(insert.npcQuests.omit({ id: true, npcId: true })).optional(),
		dialogue: z.array(insert.npcDialogue.omit({ id: true, npcId: true })).optional(),
		// Include the area and district relations
		areas: z.array(insertAreaNpcSchema.omit({ npcId: true })).optional(),
		districts: z.array(insertDistrictNpcSchema.omit({ npcId: true })).optional(),
	})
	.strict()

export const getNpcSchema = z
	.number()
	.refine((id) => id > 0, {
		message: "NPC ID must be greater than 0",
	})
	.describe("Get an NPC by ID")

// Define types based on the Zod schemas
export type Npc = z.infer<typeof NpcSchema>
export type NewNpc = z.infer<typeof newNpcSchema>
export type UpdateNpc = z.infer<typeof updateNpcSchema>
