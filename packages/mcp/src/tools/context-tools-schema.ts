import { z } from "zod/v4"

export const contextSchemas = {
	gather_entity_context: z.object({
		entity_type: z.enum(["npc", "faction", "quest", "region", "site"]).describe("Type of entity to gather context for"),
		entity_id: z.number().describe("ID of the entity to gather context for"),
		include_related: z.boolean().default(true).describe("Include semantically related entities"),
		include_geographic: z.boolean().default(true).describe("Include entities in same location/region"),
		context_radius: z.number().default(5).describe("Number of related entities to include"),
	}),

	gather_location_context: z.object({
		location_type: z.enum(["region", "site"]).describe("Type of location"),
		location_id: z.number().describe("ID of the location"),
		include_npcs: z.boolean().default(true).describe("Include NPCs in this location"),
		include_factions: z.boolean().default(true).describe("Include active factions"),
		include_quests: z.boolean().default(true).describe("Include related quests"),
		include_encounters: z.boolean().default(false).describe("Include potential encounters"),
	}),

	gather_thematic_context: z.object({
		theme: z.string().describe("Thematic query to search for (e.g., 'political intrigue', 'ancient mysteries')"),
		entity_types: z
			.array(z.enum(["npc", "faction", "quest", "region", "site"]))
			.default(["npc", "faction", "quest"])
			.describe("Types of entities to search"),
		max_results: z.number().default(10).describe("Maximum entities to return"),
		similarity_threshold: z.number().default(0.7).describe("Minimum similarity score (0-1)"),
	}),

	gather_narrative_threads: z.object({
		central_entity_type: z.enum(["npc", "faction", "quest"]).describe("Type of central entity"),
		central_entity_id: z.number().describe("ID of the central entity"),
		thread_depth: z.number().default(2).describe("How many relationship hops to explore"),
		include_conflicts: z.boolean().default(true).describe("Include faction conflicts and tensions"),
		include_quests: z.boolean().default(true).describe("Include related quest chains"),
	}),

	gather_campaign_snapshot: z.object({
		focus_area: z.enum(["global", "regional", "local"]).default("regional").describe("Scope of the snapshot"),
		location_id: z.number().optional().describe("ID of specific location to focus on (for regional/local)"),
		include_tensions: z.boolean().default(true).describe("Include current faction tensions"),
		include_active_quests: z.boolean().default(true).describe("Include ongoing quest status"),
		include_recent_events: z.boolean().default(true).describe("Include recent narrative events"),
	}),

	suggest_content_gaps: z.object({
		analysis_scope: z.enum(["campaign", "region", "faction"]).describe("Scope of gap analysis"),
		target_id: z.number().optional().describe("ID of specific region/faction to analyze"),
		gap_types: z
			.array(z.enum(["npcs", "quests", "locations", "conflicts", "events"]))
			.default(["npcs", "quests"])
			.describe("Types of gaps to identify"),
	}),
}

export type ContextSchemas = typeof contextSchemas
