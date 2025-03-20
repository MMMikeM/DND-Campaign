"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const index_1 = require("@modelcontextprotocol/sdk/server/index");
const stdio_1 = require("@modelcontextprotocol/sdk/server/stdio");
const sse_1 = require("@modelcontextprotocol/sdk/server/sse");
const types_1 = require("@modelcontextprotocol/sdk/types");
const logger_js_1 = __importDefault(require("./logger.js"));
const node_http_1 = require("node:http");
const shared_1 = require("@tome-keeper/shared");
const quests_1 = require("./tools/quests");
const npcs_js_1 = require("./tools/npcs.js");
const factions_js_1 = require("./tools/factions.js");
const relations_js_1 = require("./tools/relations.js");
const locations_js_1 = require("./tools/locations.js");
// Debug: Log environment variables
logger_js_1.default.debug("Environment variables", {
    MCP_PORT: process.env.MCP_PORT,
    MCP_TRANSPORT: process.env.MCP_TRANSPORT,
    DB_PATH: process.env.DB_PATH,
    LOG_LEVEL: process.env.LOG_LEVEL,
    LOG_FILE: process.env.LOG_FILE,
    NODE_ENV: process.env.NODE_ENV,
});
// Initialize database
logger_js_1.default.info("Initializing database...");
const dbPath = "/Users/mikemurray/Development/DND-Campaign/dnddb.sqlite";
logger_js_1.default.info(`Using database at: ${dbPath}`);
exports.db = (0, shared_1.initializeDatabase)(dbPath);
logger_js_1.default.info("Database initialized successfully");
// Create MCP Server
const mcpServer = new index_1.Server({
    name: "sqlite-manager",
    version: "0.1.0",
}, {
    capabilities: {
        resources: {},
        tools: {},
        prompts: {},
    },
});
const tools = [...quests_1.questTools, ...npcs_js_1.npcTools, ...relations_js_1.relationTools, ...factions_js_1.factionTools, ...locations_js_1.locationTools];
// Tool handlers
mcpServer.setRequestHandler(types_1.ListToolsRequestSchema, async () => ({
    tools,
}));
mcpServer.setRequestHandler(types_1.CallToolRequestSchema, async (request) => {
    const args = request.params.arguments;
    const name = request.params.name;
    logger_js_1.default.debug("Handling CallToolRequest", {
        request: request,
        tool: name,
        args: args,
    });
    const toolName = name;
    const toolHandlers = {
        ...quests_1.questToolHandlers,
        ...npcs_js_1.npcToolHandlers,
        ...relations_js_1.relationToolHandlers,
        ...factions_js_1.factionToolHandlers,
        ...locations_js_1.locationToolHandlers,
    };
    try {
        // Look up the handler in our object
        const handler = toolHandlers[toolName];
        if (handler) {
            const data = await handler(args);
            return {
                content: [{ type: "text", text: JSON.stringify(data) }],
            };
        }
        return {
            content: [{ type: "text", text: `Unknown tool: ${name}` }],
        };
    }
    catch (error) {
        logger_js_1.default.error("Error handling tool call", {
            error: error.message,
        });
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
        };
    }
});
async function startServer() {
    console.error("Starting server...");
    logger_js_1.default.info("Initializing server...");
    logger_js_1.default.debug("Server configuration", {
        port: process.env.MCP_PORT,
        transport: process.env.MCP_TRANSPORT,
    });
    const port = process.env.MCP_PORT ? Number(process.env.MCP_PORT) : 3100;
    let transport;
    if (process.env.MCP_TRANSPORT === "sse") {
        console.error("Starting server with SSE transport...");
        // Create HTTP server for SSE
        const httpServer = (0, node_http_1.createServer)(async (req, res) => {
            logger_js_1.default.info("Received request", {
                url: req.url,
                method: req.method,
                headers: req.headers,
            });
            // Parse the URL to handle query parameters
            const url = new URL(req.url || "", `http://${req.headers.host}`);
            const pathname = url.pathname;
            if (pathname === "/mcp" && req.method === "GET") {
                logger_js_1.default.info("Establishing SSE connection");
                // SSE connection
                transport = new sse_1.SSEServerTransport("/mcp", res);
                await mcpServer.connect(transport);
                logger_js_1.default.info("SSE connection established");
            }
            else if (pathname === "/mcp" && req.method === "POST") {
                logger_js_1.default.info("Handling POST request");
                // Handle incoming messages
                if (transport instanceof sse_1.SSEServerTransport) {
                    await transport.handlePostMessage(req, res);
                    logger_js_1.default.info("POST request handled successfully");
                }
                else {
                    logger_js_1.default.error("No SSE connection established for POST request");
                    res.writeHead(500).end("No SSE connection established");
                }
            }
            else {
                logger_js_1.default.warn("Invalid request path", { pathname });
                res.writeHead(404).end();
            }
        });
        httpServer.listen(port, () => {
            logger_js_1.default.info("SSE server listening", {
                url: `http://localhost:${port}/mcp`,
                transport: process.env.MCP_TRANSPORT,
                port: port,
            });
        });
    }
    else {
        console.error("Starting server with stdio transport...");
        logger_js_1.default.info("Starting server with stdio transport");
        // Default to stdio transport
        transport = new stdio_1.StdioServerTransport();
        await mcpServer.connect(transport);
        logger_js_1.default.info("Server started with stdio transport");
    }
}
startServer().catch((err) => {
    console.error(err);
    logger_js_1.default.fatal("Unhandled error", {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
    });
    process.exit(1);
});
//# sourceMappingURL=index.js.map