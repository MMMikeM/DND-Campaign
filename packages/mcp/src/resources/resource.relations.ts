import type {
	Resource,
	ResourceTemplate,
	TextResourceContents,
} from "@modelcontextprotocol/sdk/types.js"
import { parseEntityUri, parseRelationUri, jsonToText, logResourceError } from "./resource.utils"
import {
	fetchQuest,
	questRelationFetchers,
	listQuestResources,
	getQuestResourceTemplates,
} from "./resource.quests"
import {
	fetchNpc,
	npcRelationFetchers,
	listNpcResources,
	getNpcResourceTemplates,
} from "./resource.npcs"
import {
	fetchLocation,
	locationRelationFetchers,
	listLocationResources,
	getLocationResourceTemplates,
} from "./resource.locations"
import {
	fetchFaction,
	factionRelationFetchers,
	listFactionResources,
	getFactionResourceTemplates,
} from "./resource.factions"

// Create a map of all entity fetchers
const entityFetchers = {
	quests: fetchQuest,
	npcs: fetchNpc,
	locations: fetchLocation,
	factions: fetchFaction,
}

// Create a map of all relation fetchers
const relationFetchers = {
	...questRelationFetchers,
	...npcRelationFetchers,
	...locationRelationFetchers,
	...factionRelationFetchers,
}

// Function to read a resource by URI
export async function readResource(uri: string): Promise<TextResourceContents> {
	// Handle entity resources
	const entityMatch = parseEntityUri(uri)
	if (entityMatch) {
		const { type, id } = entityMatch
		const fetcher = entityFetchers[type as keyof typeof entityFetchers]
		if (!fetcher) {
			throw new Error(`No fetcher found for resource type: ${type}`)
		}

		try {
			const data = await fetcher(id)
			if (!data) {
				throw new Error(`Resource not found: ${uri}`)
			}

			return {
				uri,
				mimeType: "application/json",
				text: jsonToText(data),
			}
		} catch (error) {
			logResourceError("fetching resource", uri, error)
			throw error
		}
	}

	// Handle relation resources
	const relationMatch = parseRelationUri(uri)
	if (relationMatch) {
		const { type, id } = relationMatch
		const fetcher = relationFetchers[type]
		if (!fetcher) {
			throw new Error(`No fetcher found for relation type: ${type}`)
		}

		try {
			const data = await fetcher(id)
			return {
				uri,
				mimeType: "application/json",
				text: jsonToText(data),
			}
		} catch (error) {
			logResourceError("fetching relation", uri, error)
			throw error
		}
	}

	throw new Error(`Invalid resource URI: ${uri}`)
}

// Function to list available resources
export async function listResources(): Promise<Resource[]> {
	const resources: Resource[] = []

	// Collect resources from all entity types
	resources.push(...(await listQuestResources()))
	resources.push(...(await listNpcResources()))
	resources.push(...(await listLocationResources()))
	resources.push(...(await listFactionResources()))

	return resources
}

// Function to list resource templates
export function getResourceTemplates(): ResourceTemplate[] {
	const templates: ResourceTemplate[] = []

	// Collect templates from all entity types
	templates.push(...getQuestResourceTemplates())
	templates.push(...getNpcResourceTemplates())
	templates.push(...getLocationResourceTemplates())
	templates.push(...getFactionResourceTemplates())

	return templates
}

// MCP handlers for resources
export const resourceHandlers = {
	// List available resources
	"resources/list": async () => {
		const resources = await listResources()
		return { resources }
	},

	// List resource templates
	"resources/templates/list": async () => {
		const resourceTemplates = getResourceTemplates()
		return { resourceTemplates }
	},

	// Read a specific resource
	"resources/read": async (params: { uri: string }) => {
		const { uri } = params
		const content = await readResource(uri)
		return {
			contents: [content],
		}
	},
}
