import { z } from "zod/v4"

// Schema for enhanced faction creation with context hints
export const factionCreationSchema = z.object({
	name: z.string().describe("Name for the new faction"),
	type_hint: z.string().optional().describe("Type of faction (military, religious, trade, criminal, etc.)"),
	location_hint: z.string().optional().describe("Where they're based or operate"),
	alignment_hint: z.string().optional().describe("Faction alignment preference"),
	role_hint: z.string().optional().describe("Role in campaign (ally, enemy, neutral, etc.)"),
})

export type FactionCreationArgs = z.infer<typeof factionCreationSchema>

// Type definitions for faction analysis
export interface FactionForAnalysis {
	id: number
	name: string
	type: readonly string[]
	publicAlignment: string
	secretAlignment: string | null
	description: string[]
	primaryHqSite: { area: { id: number; name: string } | null } | null
}

export interface FactionAgendaForAnalysis {
	id: number
	name: string
	agendaType: string
	currentStage: string
	importance: string
	ultimateAim: string
	description: string[]
	faction: { id: number; name: string }
}

export interface FactionDiplomacyForAnalysis {
	id: number
	strength: string
	diplomaticStatus: string
	description: string[]
	sourceFaction: { id: number; name: string }
	targetFaction: { id: number; name: string }
}

export interface NarrativeParticipationForAnalysis {
	id: number
	roleInArc: string
	arcImportance: string
	involvementDetails: string[]
	faction: { id: number; name: string } | null
	destination: { id: number; name: string; type: string; status: string }
}

export interface ConflictForFactionAnalysis {
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

// Analysis result types
export interface PoliticalLandscapeAnalysis {
	powerVacuums: string[]
	alignmentGaps: string[]
	territorialOpportunities: string[]
	diplomaticOpenings: string[]
	narrativeIntegrationPotential: string[]
}

export interface FactionRelationshipSuggestions {
	potentialAllies: Array<{
		faction: { id: number; name: string; type: readonly string[] }
		reasoning: string
		suggestedRelationshipType: string
	}>
	potentialRivals: Array<{
		faction: { id: number; name: string; type: readonly string[] }
		reasoning: string
		conflictType: string
	}>
	territorialOverlap: Array<{
		location: { id: number; name: string; type: string }
		reasoning: string
		competitionLevel: string
	}>
	narrativeOpportunities: string[]
}

// Nearby entities type
export interface NearbyEntities {
	sites: Array<{ id: number; name: string; type: string }>
	npcs: Array<{ id: number; name: string; type: string; npcs: unknown[] }>
	factions: Array<{
		id: number
		name: string
		type: readonly string[]
		publicAlignment: string
		secretAlignment: string | null
	}>
	influence: Array<{
		id: number
		influenceLevel: string
		presenceTypes: string[]
		faction: { id: number; name: string }
	}>
}
