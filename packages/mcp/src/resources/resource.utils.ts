import type { Resource, ResourceTemplate } from "@modelcontextprotocol/sdk/types.js"
import { logger } from "../index"

// Define the base resource types
export const RESOURCE_TYPES = [
	"quests",
	"npcs",
	"locations",
	"factions",
	"areas",
	"encounters",
	"stages",
] as const
export type ResourceType = (typeof RESOURCE_TYPES)[number]

// Define relationship types that can be queried
export const RELATION_TYPES = [
	"quest_npcs",
	"quest_locations",
	"quest_factions",
	"quest_stages",
	"quest_decisions",
	"quest_clues",
	"quest_relations",
	"npc_quests",
	"npc_locations",
	"npc_factions",
	"npc_relationships",
	"npc_items",
	"location_quests",
	"location_npcs",
	"location_factions",
	"location_areas",
	"location_encounters",
	"location_relations",
	"faction_quests",
	"faction_npcs",
	"faction_locations",
	"faction_relationships",
] as const
export type RelationType = (typeof RELATION_TYPES)[number]

// Helper to create URI for a resource
export const createResourceUri = (type: ResourceType, id: number): string => {
	return `tomekeeper://entity/${type}/${id}`
}

// Helper to create URI for a relation
export const createRelationUri = (type: RelationType, id: number): string => {
	return `tomekeeper://relation/${type}/${id}`
}

// Parse entity URI
export const parseEntityUri = (uri: string): { type: ResourceType; id: number } | null => {
	const match = uri.match(/^tomekeeper:\/\/entity\/([a-z]+)\/(\d+)$/)
	if (!match || !match[1] || !match[2]) return null

	const type = match[1] as ResourceType
	const id = Number.parseInt(match[2], 10)

	if (!RESOURCE_TYPES.includes(type)) return null

	return { type, id }
}

// Parse relation URI
export const parseRelationUri = (uri: string): { type: RelationType; id: number } | null => {
	const match = uri.match(/^tomekeeper:\/\/relation\/([a-z_]+)\/(\d+)$/)
	if (!match || !match[1] || !match[2]) return null

	const type = match[1] as RelationType
	const id = Number.parseInt(match[2], 10)

	if (!RELATION_TYPES.includes(type)) return null

	return { type, id }
}

// Format JSON for LLM consumption (simplified version)
export function jsonToText(data: unknown): string {
	return JSON.stringify(data, null, 2)
}

// Error logging helper for resource operations
export function logResourceError(operation: string, uri: string, error: unknown): void {
	logger.error(`Error during ${operation}: ${uri}`, error as Record<string, unknown>)
}
