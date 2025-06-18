import { z } from "zod/v4"

// Schema for enhanced NPC creation with context hints
export const enhancedNpcCreationSchema = z.object({
	name: z.string().describe("Name for the new NPC"),
	location_hint: z.string().optional().describe("Location where they're based (optional)"),
	faction_hint: z.string().optional().describe("Faction affiliation hint (optional)"),
	relationship_hint: z.string().optional().describe("Relationship to existing NPC (optional)"),
	quest_hint: z.string().optional().describe("Quest they're involved in (optional)"),
	occupation: z.string().optional().describe("Occupation or job (optional)"),
	alignment: z.string().optional().describe("Moral alignment tendencies (optional)"),
	role_hint: z.string().optional().describe("Role in campaign (optional)"),
})

export type EnhancedNpcCreationArgs = z.infer<typeof enhancedNpcCreationSchema>

// Campaign analysis types
export interface CampaignAnalysis {
	complexityGaps: string[]
	playerPerceptionGaps: string[]
	factionRepresentationGaps: string[]
	narrativeIntegrationOpportunities: string[]
	locationGaps: string[]
	questGaps: string[]
	conflictGaps: string[]
}
