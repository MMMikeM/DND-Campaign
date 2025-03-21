import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { initializeDatabase, RunResult } from "@tome-master/shared"
import logger from "./logger.js"
import { factionToolHandlers, factionTools, type FactionToolNames } from "./tools/factions.js"
import { locationToolHandlers, locationTools, type LocationToolNames } from "./tools/locations.js"
import { npcToolHandlers, npcTools, type NcpToolNames } from "./tools/npcs.js"
import { questToolHandlers, questTools, type QuestToolNames } from "./tools/quests.js"
import { getByRelationToolHandlers, getByRelationTools, type GetRelations } from "./tools/relations.js"
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { createServer } from "node:http"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { addPrompts } from "./prompts/index.js"

// Debug: Log environment variables
logger.debug("Environment variables", {
	MCP_PORT: process.env.MCP_PORT,
	MCP_TRANSPORT: process.env.MCP_TRANSPORT,
	DB_PATH: process.env.DB_PATH,
	LOG_LEVEL: process.env.LOG_LEVEL,
	LOG_FILE: process.env.LOG_FILE,
	NODE_ENV: process.env.NODE_ENV,
})

// Initialize database
logger.info("Initializing database...")
const dbPath = "/Users/mikemurray/Development/DND-Campaign/dnddb.sqlite"
logger.info(`Using database at: ${dbPath}`)
export const db: ReturnType<typeof initializeDatabase> = initializeDatabase(dbPath)
logger.info("Database initialized successfully")

// Create MCP Server
const mcpServer = new Server(
	{
		name: "DND MCP",
		version: "0.1.0",
	},
	{
		capabilities: {
			resources: {},
			tools: {},
			prompts: {},
		},
	},
)
const tools = [...questTools, ...npcTools, ...getByRelationTools, ...factionTools, ...locationTools]

// Tool handlers
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
	tools,
}))

addPrompts(mcpServer)


export type ToolHandlers<T extends PropertyKey> = Record<
	T,
	(
		args?: Record<string, unknown>,
	) => Promise<RunResult | Record<string, unknown> | Record<string, unknown>[]>
>

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
	const args = request.params.arguments
	const name = request.params.name

	logger.debug("Handling CallToolRequest", {
		request: request,
		tool: name,
		args: args,
	})

	type ToolNames =
		| QuestToolNames
		| NcpToolNames
		| FactionToolNames
		| GetRelations
		| LocationToolNames

	const toolName = name as ToolNames

	const toolHandlers: ToolHandlers<ToolNames> = {
		...questToolHandlers,
		...npcToolHandlers,
		...getByRelationToolHandlers,
		...factionToolHandlers,
		...locationToolHandlers,
	}

	try {
		// Look up the handler in our object
		const handler = toolHandlers[toolName]

		if (handler) {
			const data = await handler(args)
			return {
				content: [{ type: "text", text: JSON.stringify(data) }],
			}
		}
		return {
			content: [{ type: "text", text: `Unknown tool: ${name}` }],
		}
	} catch (error) {
		logger.error("Error handling tool call", {
			error: (error as Error).message,
		})
		return {
			content: [{ type: "text", text: `Error: ${(error as Error).message}` }],
		}
	}
})

mcpServer

async function startServer() {
	console.error("Starting server...")
	logger.info("Initializing server...")
	logger.debug("Server configuration", {
		port: process.env.MCP_PORT,
		transport: process.env.MCP_TRANSPORT,
	})

	const port = process.env.MCP_PORT ? Number(process.env.MCP_PORT) : 3100
	let transport: StdioServerTransport | SSEServerTransport

	if (process.env.MCP_TRANSPORT === "sse") {
		console.error("Starting server with SSE transport...")

		// Create HTTP server for SSE
		const httpServer = createServer(async (req, res) => {
			logger.info("Received request", {
				url: req.url,
				method: req.method,
				headers: req.headers,
			})

			// Parse the URL to handle query parameters
			const url = new URL(req.url || "", `http://${req.headers.host}`)
			const pathname = url.pathname

			if (pathname === "/mcp" && req.method === "GET") {
				logger.info("Establishing SSE connection")
				// SSE connection
				transport = new SSEServerTransport("/mcp", res)
				await mcpServer.connect(transport)
				logger.info("SSE connection established")
			} else if (pathname === "/mcp" && req.method === "POST") {
				logger.info("Handling POST request")
				// Handle incoming messages
				if (transport instanceof SSEServerTransport) {
					await transport.handlePostMessage(req, res)
					logger.info("POST request handled successfully")
				} else {
					logger.error("No SSE connection established for POST request")
					res.writeHead(500).end("No SSE connection established")
				}
			} else {
				logger.warn("Invalid request path", { pathname })
				res.writeHead(404).end()
			}
		})

		httpServer.listen(port, () => {
			logger.info("SSE server listening", {
				url: `http://localhost:${port}/mcp`,
				transport: process.env.MCP_TRANSPORT,
				port: port,
			})
		})
	} else {
		console.error("Starting server with stdio transport...")
		logger.info("Starting server with stdio transport")
		// Default to stdio transport
		transport = new StdioServerTransport()
		await mcpServer.connect(transport)
		logger.info("Server started with stdio transport")
	}
}

startServer().catch((err) => {
	console.error(err)
	logger.fatal("Unhandled error", {
		error: err instanceof Error ? err.message : String(err),
		stack: err instanceof Error ? err.stack : undefined,
	})
	process.exit(1)
})
