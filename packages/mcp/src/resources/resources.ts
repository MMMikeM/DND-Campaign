import { type McpServer, ResourceTemplate } from "@modelcontextprotocol/server"
import { logger } from ".."
import { campaignResourceDefinitions } from "."

// Register resource handlers with the MCP server; the SDK handles list/read
// routing and URI-template matching per registered resource.
export function registerResourceHandlers(server: McpServer) {
	logger.debug("Registering resource handlers")

	for (const [key, definition] of Object.entries(campaignResourceDefinitions)) {
		const { uriTemplate, name, description, mimeType, handler, lister } = definition

		const readResource = async (uri: URL) => {
			logger.info(`Reading resource: ${uri.href}`, { key })
			try {
				const result = await handler(uri.href)
				return { contents: Array.isArray(result) ? result : [result] }
			} catch (error) {
				logger.error(`Error handling resource ${uri.href}`, { error, key })
				throw error
			}
		}

		// A definition with a lister must go through ResourceTemplate even when its
		// URI has no variables — the static branch has no way to expose the listing.
		if (lister || uriTemplate.includes("{")) {
			const template = new ResourceTemplate(uriTemplate, {
				list: lister ? async () => ({ resources: await lister() }) : undefined,
			})
			server.registerResource(name, template, { description, mimeType }, readResource)
		} else {
			server.registerResource(name, uriTemplate, { description, mimeType }, readResource)
		}
	}

	logger.debug(`Registered ${Object.keys(campaignResourceDefinitions).length} resources`)
}
