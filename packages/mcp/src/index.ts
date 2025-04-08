import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { initializeDatabase } from "@tome-master/shared"
import { createServer } from "node:http"
import { createLogger } from "./logger.js"
import { registerPromptHandlers } from "./prompts/index.js"
import { registerToolHandlers } from "./tools/tools.js"

export const logger = createLogger()

logger.info("Environment variables", {
	MCP_PORT: process.env.MCP_PORT,
	MCP_TRANSPORT: process.env.MCP_TRANSPORT,
	DB_PATH: process.env.DB_PATH,
	LOG_LEVEL: process.env.LOG_LEVEL,
	LOG_FILE: process.env.LOG_FILE,
	NODE_ENV: process.env.NODE_ENV,
})

// Initialize database
logger.info("Initializing database...")
const dbPath = "postgres://postgres:postgres@localhost:5432/dnd_campaign"
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
			resources: {
				subscribe: true,
				listChanged: true,
			},
			tools: {},
			prompts: {},
		},
	},
)

logger.info("Registering tool handlers")

registerToolHandlers(mcpServer)
logger.info("Tool handlers registered")

registerPromptHandlers(mcpServer)
logger.info("Prompts added")

async function startServer() {
	logger.info("Starting server...")
	logger.info("Initializing server...")
	logger.debug("Server configuration", {
		port: process.env.MCP_PORT,
		transport: process.env.MCP_TRANSPORT,
	})

	const port = process.env.MCP_PORT ? Number(process.env.MCP_PORT) : 3100
	let transport: StdioServerTransport | SSEServerTransport

	if (process.env.MCP_TRANSPORT! === "sse") {
		logger.info("Starting server with SSE transport...")

		// Create HTTP server for SSE
		const httpServer = createServer(async (req, res) => {
			logger.debug("Received request", {
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
		logger.info("Starting server with stdio transport...")
		// Default to stdio transport
		transport = new StdioServerTransport()
		await mcpServer.connect(transport)
		logger.info("Server started with stdio transport")
	}
}

startServer().catch((err) => {
	logger.fatal({ err }, "Unhandled error during server startup")
	logger.fatal("Unhandled error", {
		// Keep original fatal log for detailed error info
		error: err instanceof Error ? err.message : String(err),
		stack: err instanceof Error ? err.stack : undefined,
	})
	process.exit(1)
})
