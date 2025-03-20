"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const sse_js_1 = require("@modelcontextprotocol/sdk/server/sse.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const logger_js_1 = __importDefault(require("./logger.js"));
const node_http_1 = require("node:http");
const zod_1 = __importDefault(require("zod"));
const drizzle_zod_1 = require("drizzle-zod");
const shared_1 = require("@tome-keeper/shared");
const quests_js_1 = require("./tools/quests.js");
const path_1 = __importDefault(require("path"));
const drizzle_orm_1 = require("drizzle-orm");
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
const dbPath = process.env.DB_PATH || path_1.default.join(process.cwd(), "dnddb.sqlite");
logger_js_1.default.info(`Using database at: ${dbPath}`);
const db = (0, shared_1.initializeDatabase)(dbPath);
logger_js_1.default.info("Database initialized successfully");
// Create MCP Server
const mcpServer = new index_js_1.Server({
    name: "sqlite-manager",
    version: "0.1.0",
}, {
    capabilities: {
        resources: {},
        tools: {},
        prompts: {},
    },
});
// Tool handlers
mcpServer.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => ({
    tools: [
        ...quests_js_1.questTools,
        {
            name: "get_npc_quests",
            description: "Get all quests associated with an NPC",
            inputSchema: {
                type: "object",
                properties: {
                    npcId: { type: "number" },
                },
                required: ["npcId"],
            },
        },
    ],
}));
mcpServer.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const args = request.params.arguments;
    const name = request.params.name;
    logger_js_1.default.debug("Handling CallToolRequest", {
        request: request,
        tool: name,
        args: args,
    });
    try {
        switch (name) {
            // Quest operations
            case "mcp_dnd_create_quest": {
                if (!args)
                    throw new Error("No arguments provided");
                const parsed = (0, drizzle_zod_1.createInsertSchema)(shared_1.quests).parse(args);
                logger_js_1.default.info("Creating quest", { parsed });
                try {
                    const result = await db.insert(shared_1.quests).values(parsed).execute();
                    logger_js_1.default.info("Quest created", { id: result });
                    return {
                        content: [{ type: "text", text: JSON.stringify({ id: result }) }],
                    };
                }
                catch (error) {
                    logger_js_1.default.error("Failed to create quest", {
                        error: error.message,
                    });
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error creating quest: ${error.message}`,
                            },
                        ],
                    };
                }
            }
            case "mcp_dnd_get_quest": {
                if (!args)
                    throw new Error("No arguments provided");
                logger_js_1.default.debug("Parsing arguments", { args });
                const parsed = zod_1.default.object({ id: zod_1.default.number() }).parse(args);
                logger_js_1.default.debug("Getting quest", { parsed });
                try {
                    const quest = await db
                        .select()
                        .from(shared_1.quests)
                        .where((0, drizzle_orm_1.eq)(shared_1.quests.id, parsed.id))
                        .limit(1);
                    logger_js_1.default.debug("Quest retrieved", { found: !!quest });
                    return { content: [{ type: "text", text: JSON.stringify(quest) }] };
                }
                catch (error) {
                    logger_js_1.default.error("Failed to get quest", {
                        error: error.message,
                    });
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error getting quest: ${error.message}`,
                            },
                        ],
                    };
                }
            }
            case "mcp_dnd_create_npc": {
                if (!args)
                    throw new Error("No arguments provided");
                const parsed = (0, drizzle_zod_1.createInsertSchema)(shared_1.npcs).parse(args);
                logger_js_1.default.info("Creating NPC", { parsed });
                try {
                    const result = await db.insert(shared_1.npcs).values(parsed).execute();
                    logger_js_1.default.info("NPC created", { id: result });
                    return {
                        content: [{ type: "text", text: JSON.stringify({ id: result }) }],
                    };
                }
                catch (error) {
                    logger_js_1.default.error("Failed to create NPC", {
                        error: error.message,
                    });
                    return {
                        content: [
                            {
                                type: "text",
                                text: `Error creating NPC: ${error.message}`,
                            },
                        ],
                    };
                }
            }
            default: {
                return {
                    content: [{ type: "text", text: `Unknown tool: ${name}` }],
                };
            }
        }
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
                transport = new sse_js_1.SSEServerTransport("/mcp", res);
                await mcpServer.connect(transport);
                logger_js_1.default.info("SSE connection established");
            }
            else if (pathname === "/mcp" && req.method === "POST") {
                logger_js_1.default.info("Handling POST request");
                // Handle incoming messages
                if (transport instanceof sse_js_1.SSEServerTransport) {
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
        transport = new stdio_js_1.StdioServerTransport();
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