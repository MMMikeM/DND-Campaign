import { createServer, type IncomingMessage, type ServerResponse } from "node:http"
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

logger.info(
	{
		MCP_PORT: process.env.MCP_PORT,
		MCP_TRANSPORT: process.env.MCP_TRANSPORT,
		DATABASE_URL: process.env.DATABASE_URL ? "set" : "unset (using local default)",
		LOG_LEVEL: process.env.LOG_LEVEL,
		LOG_FILE: process.env.LOG_FILE,
		NODE_ENV: process.env.NODE_ENV,
	},
	"Environment variables",
)

logger.info("Initializing database...")
const databaseUrl = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/dnd_campaign"
export const db: ReturnType<typeof initializeDatabase> = initializeDatabase(databaseUrl)

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
	logger.debug(
		{
			port: process.env.MCP_PORT,
			transport: process.env.MCP_TRANSPORT,
		},
		"Server configuration",
	)

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
				onerror: (error) => logger.error({ error: serializeError(error) }, "MCP handler error"),
			}),
		)

		const handleRequest = async (req: IncomingMessage, res: ServerResponse) => {
			logger.debug(
				{
					url: req.url,
					method: req.method,
					headers: req.headers,
				},
				"Received request",
			)

			let pathname: string
			try {
				pathname = new URL(req.url || "", `http://${req.headers.host}`).pathname
			} catch {
				logger.warn({ url: req.url, host: req.headers.host }, "Unparseable request URL")
				res.writeHead(400).end()
				return
			}

			if (pathname === "/mcp") {
				await mcpHandler(req, res)
			} else {
				logger.warn({ pathname }, "Invalid request path")
				res.writeHead(404).end()
			}
		}

		// An unhandled rejection exits the process (see logger.ts), so one bad request must not escape.
		const httpServer = createServer((req, res) => {
			handleRequest(req, res).catch((error) => {
				logger.error({ error: serializeError(error), url: req.url }, "Error handling HTTP request")
				if (res.headersSent) {
					res.destroy()
				} else {
					res.writeHead(500).end()
				}
			})
		})

		httpServer.listen(port, () => {
			logger.info(
				{
					url: `http://localhost:${port}/mcp`,
					transport: transportMode,
					port: port,
				},
				"Streamable HTTP server listening",
			)
		})
	} else {
		logger.info("Starting server with stdio transport...")
		// Default to stdio transport
		serveStdio(buildServer, { onerror: (error) => logger.error({ error }, "Stdio transport error") })
		logger.info("Server started with stdio transport")
	}
}

startServer().catch((err) => {
	logger.error({ err }, "Unhandled error during server startup")
	process.exit(1)
})
