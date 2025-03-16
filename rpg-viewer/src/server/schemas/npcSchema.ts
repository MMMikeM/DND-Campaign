import { z } from "zod";

// Schema for a quest reference in an NPC
export const NpcQuestReferenceSchema = z.object({
	simple_quest_id: z.string().optional(),
	major_quest_id: z.string().optional(),
	summary: z.string(),
});

// Schema for a single NPC
export const NpcSchema = z.object({
	name: z.string(),
	role: z.string(),
	location: z.string().optional(),
	description: z.string(),
	personality: z.string(),
	motivation: z.string(),
	secret: z.string().optional(),
	stats: z.string().optional(),
	quests: z.array(z.string()).optional(),
	relationships: z.array(z.string()).optional(),
	affiliations: z.array(z.string()).optional(),
	inventory: z.array(z.string()).optional(),
});

// Schema for the entire NPCs file
export const NpcsFileSchema = z.object({
	title: z.string(),
	version: z.string(),
	description: z.string().optional(),
	npcs: z.array(NpcSchema),
	generic_npcs: z.array(NpcSchema).optional(),
});

// Types for use in the application
export type NpcQuestReference = z.infer<typeof NpcQuestReferenceSchema>;
export type Npc = z.infer<typeof NpcSchema> & {
	id?: string; // Optional ID field for referencing
};
export type NpcsFile = z.infer<typeof NpcsFileSchema>;
