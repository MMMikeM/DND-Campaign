import { createServer } from "node:http"
import { toNodeHandler } from "@modelcontextprotocol/node"
import { createMcpHandler, McpServer } from "@modelcontextprotocol/server"
import { serveStdio } from "@modelcontextprotocol/server/stdio"
import { initializeDatabase } from "@tome-master/shared/db"
import { createLogger, serializeError } from "./logger"
import { registerPromptHandlers } from "./prompts"
import { registerResourceHandlers } from "./resources/resources"
import { registerToolHandlers } from "./tools/tools"

console.error("Starting MCP server")

export const logger = createLogger()

logger.info("Environment variables", {
	MCP_PORT: process.env.MCP_PORT,
	MCP_TRANSPORT: process.env.MCP_TRANSPORT,
	DB_PATH: process.env.DB_PATH,
	LOG_LEVEL: process.env.LOG_LEVEL,
	LOG_FILE: process.env.LOG_FILE,
	NODE_ENV: process.env.NODE_ENV,
})

logger.info("Initializing database...")
const dbPath = "postgres://postgres:postgres@localhost:5432/dnd_campaign"
logger.info(`Using database at: ${dbPath}`)
export const db: ReturnType<typeof initializeDatabase> = initializeDatabase(dbPath)

logger.info("Database initialized successfully")

function buildServer(): McpServer {
	const mcpServer = new McpServer({
		name: "DND MCP",
		version: "0.1.0",
	})

	registerToolHandlers(mcpServer)
	registerResourceHandlers(mcpServer)
	registerPromptHandlers(mcpServer)

	return mcpServer
}

async function startServer() {
	logger.info("Starting server...")
	logger.info("Initializing server...")
	logger.debug("Server configuration", {
		port: process.env.MCP_PORT,
		transport: process.env.MCP_TRANSPORT,
	})

	const port = process.env.MCP_PORT ? Number(process.env.MCP_PORT) : 3100

	const transportMode = process.env.MCP_TRANSPORT
	if (transportMode === "http" || transportMode === "sse") {
		if (transportMode === "sse") {
			logger.warn("MCP_TRANSPORT=sse is deprecated; serving Streamable HTTP instead. Use MCP_TRANSPORT=http.")
		}
		logger.info("Starting server with Streamable HTTP transport...")

		// Sessionless: a fresh server serves each request. The default legacy
		// posture ('stateless') also serves 2025-era clients from the same
		// factory — no sessions on either leg, GET/DELETE answered 405.
		const mcpHandler = toNodeHandler(
			createMcpHandler(buildServer, {
				onerror: (error) => logger.error("MCP handler error", { error: serializeError(error) }),
			}),
		)

		const httpServer = createServer(async (req, res) => {
			logger.debug("Received request", {
				url: req.url,
				method: req.method,
				headers: req.headers,
			})

			// Parse the URL to handle query parameters
			const url = new URL(req.url || "", `http://${req.headers.host}`)
			const pathname = url.pathname

			if (pathname === "/mcp") {
				await mcpHandler(req, res)
			} else {
				logger.warn("Invalid request path", { pathname })
				res.writeHead(404).end()
			}
		})

		httpServer.listen(port, () => {
			logger.info("Streamable HTTP server listening", {
				url: `http://localhost:${port}/mcp`,
				transport: transportMode,
				port: port,
			})
		})
	} else {
		logger.info("Starting server with stdio transport...")
		// Default to stdio transport
		serveStdio(buildServer, { onerror: (error) => logger.error("Stdio transport error", { error }) })
		logger.info("Server started with stdio transport")
	}
}

startServer().catch((err) => {
	logger.error("Unhandled error during server startup", { err })
	process.exit(1)
})
