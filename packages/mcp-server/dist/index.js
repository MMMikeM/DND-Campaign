import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import logger from "./logger.js";
import { createServer } from "node:http";
import z from "zod";
import { createInsertSchema } from "drizzle-zod";
import { initializeDatabase, npcs, quests } from "@tome-keeper/shared";
import { questTools } from "./tools/quests.js";
// Debug: Log environment variables
logger.debug("Environment variables", {
    MCP_PORT: process.env.MCP_PORT,
    MCP_TRANSPORT: process.env.MCP_TRANSPORT,
    DB_PATH: process.env.DB_PATH,
    LOG_LEVEL: process.env.LOG_LEVEL,
    LOG_FILE: process.env.LOG_FILE,
    NODE_ENV: process.env.NODE_ENV,
});
// Initialize database
logger.info("Initializing database...");
const db = initializeDatabase("/Users/mikemurray/Development/DND-Campaign/dnddb.sqlite");
logger.info("Database initialized successfully");
// Create MCP Server
const mcpServer = new Server({
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
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        ...questTools,
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
mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
    const args = request.params.arguments;
    const name = request.params.name;
    logger.debug("Handling CallToolRequest", {
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
                const parsed = createInsertSchema(quests).parse(args);
                logger.info("Creating quest", { parsed });
                try {
                    const result = await db.insert(quests).values(parsed).execute();
                    logger.info("Quest created", { id: result });
                    return { content: [{ type: "text", text: JSON.stringify({ id: result }) }] };
                }
                catch (error) {
                    logger.error("Failed to create quest", { error: error.message });
                    return {
                        content: [{ type: "text", text: `Error creating quest: ${error.message}` }],
                    };
                }
            }
            case "mcp_dnd_get_quest": {
                if (!args)
                    throw new Error("No arguments provided");
                logger.debug("Parsing arguments", { args });
                const parsed = z.object({ id: z.number() }).parse(args);
                logger.debug("Getting quest", { parsed });
                try {
                    const quest = await db.query.quests.findFirst().execute();
                    logger.debug("Quest retrieved", { found: !!quest });
                    return { content: [{ type: "text", text: JSON.stringify(quest) }] };
                }
                catch (error) {
                    logger.error("Failed to get quest", { error: error.message });
                    return {
                        content: [{ type: "text", text: `Error getting quest: ${error.message}` }],
                    };
                }
            }
            case "mcp_dnd_create_npc": {
                if (!args)
                    throw new Error("No arguments provided");
                const parsed = createInsertSchema(npcs).parse(args);
                logger.info("Creating NPC", { parsed });
                try {
                    const result = await db.insert(npcs).values(parsed).execute();
                    logger.info("NPC created", { id: result });
                    return { content: [{ type: "text", text: JSON.stringify({ id: result }) }] };
                }
                catch (error) {
                    logger.error("Failed to create NPC", { error: error.message });
                    return {
                        content: [{ type: "text", text: `Error creating NPC: ${error.message}` }],
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
        logger.error("Error handling tool call", { error: error.message });
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
        };
    }
});
async function startServer() {
    console.error("Starting server...");
    logger.info("Initializing server...");
    logger.debug("Server configuration", {
        port: process.env.MCP_PORT,
        transport: process.env.MCP_TRANSPORT,
    });
    const port = process.env.MCP_PORT ? Number(process.env.MCP_PORT) : 3100;
    let transport;
    if (process.env.MCP_TRANSPORT === "sse") {
        console.error("Starting server with SSE transport...");
        // Create HTTP server for SSE
        const httpServer = createServer(async (req, res) => {
            logger.info("Received request", {
                url: req.url,
                method: req.method,
                headers: req.headers,
            });
            // Parse the URL to handle query parameters
            const url = new URL(req.url || "", `http://${req.headers.host}`);
            const pathname = url.pathname;
            if (pathname === "/mcp" && req.method === "GET") {
                logger.info("Establishing SSE connection");
                // SSE connection
                transport = new SSEServerTransport("/mcp", res);
                await mcpServer.connect(transport);
                logger.info("SSE connection established");
            }
            else if (pathname === "/mcp" && req.method === "POST") {
                logger.info("Handling POST request");
                // Handle incoming messages
                if (transport instanceof SSEServerTransport) {
                    await transport.handlePostMessage(req, res);
                    logger.info("POST request handled successfully");
                }
                else {
                    logger.error("No SSE connection established for POST request");
                    res.writeHead(500).end("No SSE connection established");
                }
            }
            else {
                logger.warn("Invalid request path", { pathname });
                res.writeHead(404).end();
            }
        });
        httpServer.listen(port, () => {
            logger.info("SSE server listening", {
                url: `http://localhost:${port}/mcp`,
                transport: process.env.MCP_TRANSPORT,
                port: port,
            });
        });
    }
    else {
        console.error("Starting server with stdio transport...");
        logger.info("Starting server with stdio transport");
        // Default to stdio transport
        transport = new StdioServerTransport();
        await mcpServer.connect(transport);
        logger.info("Server started with stdio transport");
    }
}
startServer().catch((err) => {
    console.error(err);
    logger.fatal("Unhandled error", {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
    });
    process.exit(1);
});
//# sourceMappingURL=index.js.map