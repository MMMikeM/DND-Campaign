import { type McpServer, ResourceTemplate } from "@modelcontextprotocol/server"
import { logger } from ".."
import { campaignResourceDefinitions } from "."

// Built once at module scope: registerResourceHandlers runs per request under
// the sessionless createMcpHandler model, so templates and read callbacks are
// prebuilt and shared across server instances (they hold no per-server state).
const resourceRegistrations = Object.entries(campaignResourceDefinitions).map(([key, definition]) => {
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
	const template =
		lister || uriTemplate.includes("{")
			? new ResourceTemplate(uriTemplate, {
					list: lister ? async () => ({ resources: await lister() }) : undefined,
				})
			: undefined

	return { name, uriTemplate, template, config: { description, mimeType }, readResource }
})

// Register resource handlers with the MCP server; the SDK handles list/read
// routing and URI-template matching per registered resource.
export function registerResourceHandlers(server: McpServer) {
	for (const { name, uriTemplate, template, config, readResource } of resourceRegistrations) {
		if (template) {
			server.registerResource(name, template, config, readResource)
		} else {
			server.registerResource(name, uriTemplate, config, readResource)
		}
	}

	logger.debug(`Registered ${resourceRegistrations.length} resources`)
}
