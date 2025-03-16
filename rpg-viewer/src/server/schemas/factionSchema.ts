import { z } from "zod";

// Shared character/NPC schema that can be reused across various structures
export const StatBlockSchema = z.string();

export const CharacterSchema = z.object({
	name: z.string(),
	role: z.string().optional(),
	position: z.string().optional(), // Alternative to role in some contexts
	description: z.string(),
	secret: z.string().optional(),
	stats: StatBlockSchema.optional(),
	bio: z.string().optional(),
});

// Leadership is an array of characters with roles and positions
export const LeadershipSchema = z.array(CharacterSchema);

// Members are typically less detailed than leadership
export const MembersSchema = z.array(CharacterSchema);

// Individual faction schema
export const FactionSchema = z.object({
	type: z.string(),
	public_goal: z.string(),
	true_goal: z.string(),
	resources: z.array(z.string()).optional(),
	leadership: LeadershipSchema.optional(),
	members: MembersSchema.optional(),
	territory: z.string().optional(),
	allies: z.array(z.string()).optional(),
	enemies: z.array(z.string()).optional(),
	quests: z.array(z.string()).optional(),
	notes: z.string().optional(),
});

// The full factions file schema
export const FactionsFileSchema = z.object({
	title: z.string(),
	version: z.string(),
	description: z.string().optional(),
	factions: z.record(z.string(), FactionSchema),
});

// Export TypeScript types
export type StatBlock = z.infer<typeof StatBlockSchema>;
export type Character = z.infer<typeof CharacterSchema>;
export type Leadership = z.infer<typeof LeadershipSchema>;
export type Members = z.infer<typeof MembersSchema>;
export type Faction = z.infer<typeof FactionSchema>;
export type FactionsFile = z.infer<typeof FactionsFileSchema>;
