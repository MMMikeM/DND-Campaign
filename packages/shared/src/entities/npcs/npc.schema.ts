import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

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
