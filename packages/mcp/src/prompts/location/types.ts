import { z } from "zod/v4"

// Schema for enhanced location creation with context hints
export const enhancedLocationCreationSchema = z.object({
	name: z.string().describe("Name for the new location"),
	type_hint: z.string().optional().describe("Type of location (city, town, village, fortress, dungeon, etc.)"),
	region_hint: z.string().optional().describe("Region or area where it's located"),
	size_hint: z.string().optional().describe("Size of the location (small, medium, large, etc.)"),
	purpose_hint: z.string().optional().describe("Primary purpose or function (trade hub, military outpost, etc.)"),
})

export type EnhancedLocationCreationArgs = z.infer<typeof enhancedLocationCreationSchema>

// Type definitions for location analysis
export interface SiteForAnalysis {
	id: number
	name: string
	type: string
	intendedSiteFunction: string
	description: string[]
	features: string[]
	mood: string
	environment: string
	area: { id: number; name: string; region: { id: number; name: string } } | null
	encounters: { id: number; name: string; objectiveType: string; encounterCategory: string }[]
	secrets: { id: number; secretType: string; difficultyToDiscover: string }[]
	npcs: { associationType: string; npc: { id: number; name: string; occupation: string } }[]
}

export interface RegionForAnalysis {
	id: number
	name: string
	type: string
	description: string[]
	dangerLevel: string
	atmosphereType: string
	areas: { id: number; name: string; type: string }[]
}

export interface EncounterForAnalysis {
	id: number
	name: string
	objectiveType: string
	encounterCategory: string
	encounterVibe: string[]
	site: { id: number; name: string; type: string } | null
}

export interface SecretForAnalysis {
	id: number
	secretType: string
	difficultyToDiscover: string
	description: string[]
	site: { id: number; name: string; type: string } | null
}

export interface LinkForAnalysis {
	id: number
	linkType: string
	description: string[]
	sourceSite: { id: number; name: string; type: string } | null
	targetSite: { id: number; name: string; type: string } | null
}

export interface NPCSiteAssociationForAnalysis {
	id: number
	associationType: string
	description: string[]
	npc: { id: number; name: string; occupation: string; alignment: string }
	site: { id: number; name: string; type: string }
}

export interface FactionInfluenceForAnalysis {
	id: number
	influenceLevel: string
	presenceTypes: string[]
	presenceDetails: string[]
	priorities: string[]
	faction: { id: number; name: string }
	region: { id: number; name: string } | null
	area: { id: number; name: string } | null
	site: { id: number; name: string } | null
}

export interface QuestStageForAnalysis {
	id: number
	name: string
	stageType: string
	stageImportance: string
	description: string[]
	quest: { id: number; name: string; type: string }
	site: { id: number; name: string; type: string } | null
}

export interface ConflictForLocationAnalysis {
	id: number
	name: string
	description: string[]
	moralDilemma: string
	stakes: string[]
	participants: Array<{
		faction: { id: number; name: string } | null
		npc: { id: number; name: string } | null
	}>
}

export interface ForeshadowingSeedForAnalysis {
	id: number
	targetEntityType: string
	subtlety: string
	narrativeWeight: string
	description: string[]
	sourceSite: { id: number; name: string } | null
	targetSite: { id: number; name: string } | null
}

export interface ItemHistoryForAnalysis {
	id: number
	eventDescription: string
	timeframe: string
	npcRoleInEvent: string
	item: { id: number; name: string; itemType: string }
	eventLocationSite: { id: number; name: string; type: string }
}

// Analysis result types
export interface LocationLandscapeAnalysis {
	siteTypeGaps: string[]
	encounterTypeGaps: string[]
	secretTypeGaps: string[]
	functionGaps: string[]
	territorialOpportunities: string[]
	narrativePositioning: string[]
	conflictIntegration: string[]
}

export interface LocationConnectionSuggestions {
	typeBasedConnections: string[]
	regionalConnections: string[]
	purposeBasedConnections: string[]
	strategicPositioning: string[]
	uniqueConnectionOpportunities: string[]
}

// Nearby entities type for regional context
export interface NearbyEntitiesForLocation {
	regions: { id: number; name: string; type: string }[]
	areas: { id: number; name: string; type: string }[]
	sites: {
		id: number
		name: string
		type: string
		intendedSiteFunction: string
	}[]
	factions: { id: number; name: string; type: readonly string[]; influence: unknown[] }[]
	npcs: { id: number; name: string; occupation: string; sites: unknown[] }[]
}

export interface CampaignThemes {
	relevantQuests: Array<{
		id: number
		name: string
		type: string
		description: string[]
		mood: string
		themes: string[]
	}>
	activeConflicts: ConflictForLocationAnalysis[]
	foreshadowingElements: ForeshadowingSeedForAnalysis[]
}
