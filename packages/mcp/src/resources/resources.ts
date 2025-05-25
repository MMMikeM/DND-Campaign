import type { Server } from "@modelcontextprotocol/sdk/server/index.js"
import {
	ListResourcesRequestSchema,
	ListResourceTemplatesRequestSchema,
	ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"
import { db, logger } from ".."
import { campaignResourceDefinitions } from "./campaign-resources"
import type { CampaignResourceHandlers, ResourceContent } from "./resource-types"

// Create resource handlers
const createResourceHandlers = (): CampaignResourceHandlers => {
	const listResources = async () => {
		logger.info("Listing available campaign resources")

		try {
			// Get some real campaign entities to create actual resources
			const [factions, npcs, sites, regions] = await Promise.all([
				db.query.factions.findMany({
					columns: { id: true, name: true },
					limit: 3,
				}),
				db.query.npcs.findMany({
					columns: { id: true, name: true },
					limit: 3,
				}),
				db.query.sites.findMany({
					columns: { id: true, name: true },
					limit: 3,
				}),
				db.query.regions.findMany({
					columns: { id: true, name: true },
					limit: 2,
				}),
			])

			const resources = []

			// Add example template resources
			resources.push(
				{
					uri: "campaign://npc-creation/example-character",
					name: "Example NPC Creation Context",
					description: "Example of campaign context for creating a new NPC",
					mimeType: "application/json",
				},
				{
					uri: "campaign://quest-creation/example-quest",
					name: "Example Quest Creation Context",
					description: "Example of campaign state for designing a new quest",
					mimeType: "application/json",
				},
			)

			// Add real faction response resources
			for (const faction of factions) {
				resources.push({
					uri: `campaign://faction-response/${encodeURIComponent(faction.name)}`,
					name: `${faction.name} Response Context`,
					description: `Detailed information about ${faction.name} for generating authentic responses`,
					mimeType: "application/json",
				})
			}

			// Add real NPC dialogue resources
			for (const npc of npcs) {
				resources.push({
					uri: `campaign://npc-dialogue-context/${npc.id}`,
					name: `${npc.name} Dialogue Context`,
					description: `Complete profile and relationships for ${npc.name} dialogue generation`,
					mimeType: "application/json",
				})
			}

			// Add real location resources
			for (const site of sites) {
				resources.push({
					uri: `campaign://location-context/${encodeURIComponent(site.name)}`,
					name: `${site.name} Location Context`,
					description: `Detailed information about ${site.name} for scene setting`,
					mimeType: "application/json",
				})
			}

			for (const region of regions) {
				resources.push({
					uri: `campaign://location-context/${encodeURIComponent(region.name)}`,
					name: `${region.name} Regional Context`,
					description: `Regional information about ${region.name} for campaign context`,
					mimeType: "application/json",
				})
			}

			logger.info(`Returning ${resources.length} campaign resources`)
			return resources
		} catch (error) {
			logger.error("Error gathering campaign resources", { error })
			// Return example resources as fallback
			return [
				{
					uri: "campaign://npc-creation/example-character",
					name: "Example NPC Creation Context",
					description: "Example of campaign context for creating a new NPC",
					mimeType: "application/json",
				},
				{
					uri: "campaign://quest-creation/example-quest",
					name: "Example Quest Creation Context",
					description: "Example of campaign state for designing a new quest",
					mimeType: "application/json",
				},
			]
		}
	}

	const listResourceTemplates = async () => {
		logger.info("Listing resource templates")

		return Object.values(campaignResourceDefinitions).map((def) => ({
			uriTemplate: def.uriTemplate,
			name: def.name,
			description: def.description,
			mimeType: def.mimeType,
		}))
	}

	const readResource = async (uri: string): Promise<ResourceContent[]> => {
		logger.info(`Reading resource: ${uri}`)

		// Find the appropriate handler based on URI pattern
		for (const [key, definition] of Object.entries(campaignResourceDefinitions)) {
			// Convert URI template to regex pattern
			const pattern = definition.uriTemplate
				.replace(/\{[^}]+\}/g, "([^/]+)") // Replace {param} with capture group
				.replace(/\//g, "\\/") // Escape forward slashes
				.replace(/:/g, "\\:") // Escape colons

			const regex = new RegExp(`^${pattern}$`)

			if (regex.test(uri)) {
				logger.info(`Found handler for resource: ${key}`)
				try {
					const result = await definition.handler(uri)
					return Array.isArray(result) ? result : [result]
				} catch (error) {
					logger.error(`Error handling resource ${uri}`, { error, key })
					throw error
				}
			}
		}

		logger.warn(`No handler found for resource URI: ${uri}`)
		throw new Error(`Resource not found: ${uri}`)
	}

	return {
		listResources,
		listResourceTemplates,
		readResource,
	}
}

// Register resource handlers with the MCP server
export function registerResourceHandlers(server: Server) {
	logger.info("Registering resource handlers")

	const handlers = createResourceHandlers()

	// List available resources
	server.setRequestHandler(ListResourcesRequestSchema, async (request) => {
		logger.debug("Handling resources/list request", { params: request.params })

		try {
			const resources = await handlers.listResources()
			return {
				resources,
				// Add pagination support if needed in the future
				...(request.params?.cursor && { nextCursor: undefined }),
			}
		} catch (error) {
			logger.error("Error listing resources", { error })
			throw error
		}
	})

	// List resource templates
	server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => {
		logger.debug("Handling resources/templates/list request")

		try {
			const resourceTemplates = await handlers.listResourceTemplates()
			return { resourceTemplates }
		} catch (error) {
			logger.error("Error listing resource templates", { error })
			throw error
		}
	})

	// Read resource content
	server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
		const { uri } = request.params
		logger.debug("Handling resources/read request", { uri })

		try {
			const contents = await handlers.readResource(uri)

			return { contents }
		} catch (error) {
			logger.error("Error reading resource", { error, uri })
			throw error
		}
	})

	logger.info(`Registered ${Object.keys(campaignResourceDefinitions).length} resource templates`)
}
