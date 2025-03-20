/**
 * Client-side schema types for the DND Campaign Manager
 *
 * This file contains TypeScript interfaces for database entities.
 * It doesn't include actual database implementation - just type definitions
 * for use in the client application.
 */

// Location schema types
export interface Location {
	id?: number
	name: string
	type: string
	region?: string | null
	description: string
	history?: string | null
	dangerLevel?: string | null
	factionControl?: string | null
	notableFeatures?: string[] | null
}

export interface LocationArea {
	id?: number
	locationId: number
	name: string
	description: string
	areaType: string
	environment: string
	terrain: string
	climate: string
	features: string[]
	encounters: string[]
	treasures: string[]
	creatures: string[]
	plants: string[]
	loot: string[]
}

// NPC schema types
export interface NPC {
	id?: number
	name: string
	race: string
	class?: string | null
	level?: number | null
	background?: string | null
	alignment?: string | null
	description: string
	personality?: string | null
	motivation?: string | null
	quirks?: string[] | null
	factionId?: number | null
}

// Faction schema types
export interface Faction {
	id?: number
	name: string
	description: string
	alignment?: string | null
	goals?: string[] | null
	allies?: number[] | null
	enemies?: number[] | null
}

// Quest schema types
export interface Quest {
	id?: number
	name: string
	description: string
	status: string
	difficulty?: string | null
	rewards?: string[] | null
	questGiver?: number | null
	locations?: number[] | null
	npcs?: number[] | null
}

// Helper functions
export function isValidLocation(location: unknown): location is Location {
	return (
		typeof location === "object" &&
		location !== null &&
		location !== undefined &&
		"name" in location &&
		typeof (location as Record<string, unknown>).name === "string" &&
		"type" in location &&
		typeof (location as Record<string, unknown>).type === "string" &&
		"description" in location &&
		typeof (location as Record<string, unknown>).description === "string" &&
		(!("notableFeatures" in location) ||
			(location as Record<string, unknown>).notableFeatures === null ||
			(location as Record<string, unknown>).notableFeatures === undefined ||
			Array.isArray((location as Record<string, unknown>).notableFeatures))
	)
}

export function isValidNPC(npc: unknown): npc is NPC {
	return (
		typeof npc === "object" &&
		npc !== null &&
		npc !== undefined &&
		"name" in npc &&
		typeof (npc as Record<string, unknown>).name === "string" &&
		"race" in npc &&
		typeof (npc as Record<string, unknown>).race === "string" &&
		"description" in npc &&
		typeof (npc as Record<string, unknown>).description === "string"
	)
}
