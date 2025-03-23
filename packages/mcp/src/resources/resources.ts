// src/mcp/resources.ts

import {
	ListResourcesRequestSchema,
	ListResourceTemplatesRequestSchema,
	ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"
import { resourceHandlers } from "./resource.relations"
import type { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { logger } from ".."

export function registerResourceHandlers(server: Server) {
	logger.info("Registering resource handlers")
	// Register resource handlers
	server.setRequestHandler(ListResourcesRequestSchema, async () => {
		logger.info("ListResourcesRequestSchema", await resourceHandlers["resources/list"]())
		return await resourceHandlers["resources/list"]()
	})

	server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => {
		logger.info(
			"ListResourceTemplatesRequestSchema",
			await resourceHandlers["resources/templates/list"](),
		)
		return await resourceHandlers["resources/templates/list"]()
	})

	server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
		logger.info("ReadResourceRequestSchema", request.params)
		return await resourceHandlers["resources/read"](request.params)
	})

	// Log that resources are registered
	logger.info("MCP Resource handlers registered")
}
