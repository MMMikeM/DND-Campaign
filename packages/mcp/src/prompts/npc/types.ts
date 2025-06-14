import { z } from "zod/v4"

// Schema for enhanced NPC creation with context hints
export const enhancedNpcCreationSchema = z.object({
	name: z.string().describe("Name for the new NPC"),
	location_hint: z.string().optional().describe("Location where they're based (optional)"),
	faction_hint: z.string().optional().describe("Faction affiliation hint (optional)"),
	role_hint: z.string().optional().describe("Role in campaign (optional)"),
	relationship_hint: z.string().optional().describe("Relationship to existing NPC (optional)"),
	occupation: z.string().optional().describe("Occupation or job (optional)"),
	alignment: z.string().optional().describe("Moral alignment tendencies (optional)"),
})

export type EnhancedNpcCreationArgs = z.infer<typeof enhancedNpcCreationSchema>

// Campaign analysis types
export interface CampaignAnalysis {
	complexityGaps: string[]
	playerPerceptionGaps: string[]
	factionRepresentationGaps: string[]
	narrativeIntegrationOpportunities: string[]
}

// Regional context types
export interface RegionalContext {
	matchedLocations: Array<{
		id: number
		name: string
		type: string
		area?: {
			id: number
			name: string
			region?: {
				id: number
				name: string
			}
		}
	}>
	regionalNPCs: Array<{
		id: number
		name: string
		occupation: string
		alignment: string
		relatedFactions: Array<{
			faction: { name: string }
			role: string
		}>
	}>
	regionalFactions: Array<{
		id: number
		name: string
		type: string[]
	}>
	culturalInfluences: Array<{
		id: number
		name: string
		conceptType: string
		summary: string
		links: Array<{
			regionId?: number | null
			factionId?: number | null
			npcId?: number | null
			linkStrength: string
			linkRoleOrTypeText: string
		}>
	}>
}

// Relationship suggestions types
export interface RelationshipSuggestions {
	targetNPCs: Array<{
		npc: { id: number; name: string; occupation: string }
		suggestedRelationshipTypes: string[]
		reasoning: string
	}>
	factionOpportunities: Array<{
		faction: string
		role: string
		reasoning: string
	}>
	narrativeHooks: string[]
	characterComplexity: string[]
}

// Input types for analysis functions
export interface NPCForAnalysis {
	id: number
	complexityProfile: string
	playerPerceptionGoal: string
	relatedFactions: Array<{ role: string; loyalty: string }>
}

export interface FactionForAnalysis {
	id: number
	name: string
	type: string[]
}

export interface ConflictForAnalysis {
	id: number
	name: string
	status: string
	moralDilemma: string
	participants: Array<{
		npc?: { id: number; name: string } | null
		faction?: { id: number; name: string } | null
		role: string
		motivation: string
	}>
}

export interface QuestForAnalysis {
	id: number
	name: string
	type: string
	urgency: string
	visibility: string
	participants: Array<{
		npc?: { id: number } | null
		importanceInQuest: string
	}>
}

export interface NarrativeArcForAnalysis {
	id: number
	name: string
	type: string
	status: string
	participantInvolvement: Array<{
		npc?: { id: number } | null
		arcImportance: string
	}>
}
