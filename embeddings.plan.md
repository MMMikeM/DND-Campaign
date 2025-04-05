# Plan: Adding Gemini Embeddings & Search

**CURRENT STATUS (2025-05-04 07:39 AM UTC+3):**

*   **Phase 1 (Database Schema Setup):** Completed.
*   **Phase 2 (Embedding Utilities & Manual Generation Tools):** In Progress.
    *   Installed `@google/generative-ai` in `packages/mcp`.
    *   Created and corrected `packages/mcp/src/embeddingUtils.ts`.
    *   Added `generate_npc_embedding` tool to `packages/mcp/src/tools/tool.npcs.ts`.
    *   **Blocked:** Encountered TypeScript errors in `tool.npcs.ts` after adding the new tool, likely due to Drizzle ORM version mismatch or dialect issues between `packages/shared` and `packages/mcp`.
    *   **Next Step:** Align `drizzle-orm` version in `packages/mcp/package.json` with `packages/shared` (`^0.41.0`) and run `pnpm install`.

---

This plan outlines the steps to integrate Gemini vector embeddings into the DND Campaign Manager application, enabling semantic search capabilities.

**Core Strategy:**

1.  **Database:** Add `vector` columns to relevant tables using `pgvector`.
2.  **Embedding Generation:** Implement logic within the MCP server (`packages/mcp`) to generate embeddings using the Gemini API (`gemini-embedding-exp-03-07`).
3.  **Manual Trigger:** Add buttons in the React UI (`packages/react`) to trigger embedding generation for specific existing records via dedicated MCP tools.
4.  **Automatic Trigger (Optional):** Add an environment variable (`AUTO_GENERATE_EMBEDDINGS`) to control whether the MCP server automatically generates embeddings during create/update operations.
5.  **Search:** Implement MCP tools for performing vector similarity searches.

---

**Phase 1: Database Schema Setup (`packages/shared`)**

*   [ ] **Install pgvector types:**
    *   Run `cd packages/shared && pnpm add drizzle-orm/pgvector`
*   [ ] **Define Vector Type Helper:**
    *   In `packages/shared/src/db/utils.ts`, define a helper function for the vector column that accepts a size parameter:
        ```typescript
        // In packages/shared/src/db/utils.ts
        import { vector } from 'drizzle-orm/pgvector';

        type EmbeddingSize = 'sm' | 'md' | 'lg';
        const dimensionsMap: Record<EmbeddingSize, number> = {
          sm: 768,
          md: 1536,
          lg: 3072,
        };

        export const embeddingVector = (size: EmbeddingSize = 'sm', name: string = 'embedding') => {
          const dimensions = dimensionsMap[size];
          if (!dimensions) {
            throw new Error(`Invalid embedding size: ${size}. Valid sizes are 'sm', 'md', 'lg'.`);
          }
          return vector(name, { dimensions });
        };
        ```
*   [ ] **Add Embedding Column to Schemas:**
    *   For *each* relevant table schema file in `packages/shared/src/schemas/` (e.g., `regions/tables.ts`, `npcs/tables.ts`, `quests/tables.ts`, etc.):
        *   Import the `embeddingVector` helper.
        *   Add the embedding column definition, making it `nullable()` initially:
            ```typescript
            // Example for npcs table in npc/tables.ts
            import { embeddingVector } from '../../db/utils'; // Adjust path if needed
            // ... inside pgTable definition
            embedding: embeddingVector('sm').nullable(), // Defaulting to 'sm' (768 dimensions)
            ```
*   [ ] **Generate Database Migration:**
    *   Run `pnpm --filter @tome-master/shared db:generate`
*   [ ] **Review Migration File:**
    *   Inspect the generated SQL file in `packages/shared/drizzle/` to ensure it correctly adds the `vector(768)` (or chosen dimension) columns.
*   [ ] **Apply Database Migration:**
    *   Run `pnpm --filter @tome-master/shared db:migrate`

**Phase 2: Embedding Utilities & Manual Generation Tools (`packages/mcp`)**

*   [ ] **Install Gemini SDK:**
    *   Run `cd packages/mcp && pnpm add @google/generative-ai`
*   [ ] **Get Gemini API Key:**
    *   Obtain an API key for the Gemini API from Google AI Studio or Google Cloud Console. Store it securely (e.g., environment variable `GEMINI_API_KEY`).
*   [ ] **Create Embedding Utility:**
    *   Create `packages/mcp/src/embeddingUtils.ts`.
    *   Implement `getGeminiEmbedding(text: string): Promise<number[]>`:
        *   Loads `GEMINI_API_KEY` from `process.env`.
        *   Initializes `GoogleGenerativeAI`.
        *   Calls `genAI.getGenerativeModel({ model: "gemini-embedding-exp-03-07" }).embedContent(text)`.
        *   Returns `embedding.values`. Includes error handling.
    *   Implement `getTextForEntity(entityType: string, record: any): string`:
        *   Takes an entity type (e.g., 'npcs') and a database record.
        *   Returns a combined string based on the field combination plan (e.g., combining `name`, `race`, `background`, `personalityTraits` for NPCs). Handle potential null/undefined fields gracefully.
*   [ ] **Add Manual Generation Tools:**
    *   In each relevant `tool.*.ts` file (e.g., `tool.npcs.ts`):
        *   Define a *new* tool definition (e.g., `generate_npc_embedding`).
        *   Input Schema: `z.object({ id: z.number().describe("ID of the entity to generate embedding for") })`. Convert using `zodToMCP`.
        *   Handler:
            *   Parse the input `id`.
            *   Fetch the full entity record from the database using the `id`. Handle "not found".
            *   Generate the combined text using `getTextForEntity`.
            *   Generate the embedding using `getGeminiEmbedding`. Handle API errors.
            *   Update the entity record in the DB: `db.update(table).set({ embedding: embeddingVector }).where(eq(table.id, id))`.
            *   Return a success message (e.g., "Embedding generated successfully for NPC ID: X") or an error message.
*   [ ] **Register Manual Generation Tools:**
    *   In `packages/mcp/src/tools/tools.ts`:
        *   Import the new `generate_*_embedding` tool definitions and handlers.
        *   Add them to the `allTools` array and `allToolHandlers` object.
*   [ ] **Configure API Key for Server:**
    *   Ensure the environment running the MCP server provides the `GEMINI_API_KEY`.

**Phase 3: React UI Integration (`packages/react`)**

*   [ ] **Identify UI Locations:** Determine where "Generate Embedding" buttons should appear (e.g., on NPC detail pages, Quest detail pages within the `packages/react/app/routes/` directory).
*   [ ] **Implement MCP Tool Calling:**
    *   Establish a mechanism for the React frontend to call MCP tools. This might involve:
        *   Creating API endpoints in the React app's server (`server.ts`?) that act as proxies to the MCP server.
        *   Or, if the MCP server is directly accessible (e.g., via SSE on a known port), using `fetch` or a library to send `CallTool` requests directly.
    *   **(Assumption):** A function `callMcpTool(toolName: string, args: Record<string, any>): Promise<any>` will be created or available.
*   [ ] **Add "Generate Embedding" Buttons:**
    *   In the relevant React components:
        *   Add a `<Button>` component.
        *   Add an `onClick` handler.
        *   Inside the handler:
            *   Set a loading state.
            *   Call `callMcpTool('generate_npc_embedding', { id: npc.id })` (adjust tool name and ID source).
            *   Handle the promise result: show success (e.g., using `toast` from `sonner`) or error messages.
            *   Clear the loading state.
        *   Consider disabling the button while loading or if an embedding already exists (requires fetching embedding status).

**Phase 4: Automatic Embedding Generation (Optional) (`packages/mcp`)**

*   [ ] **Add Environment Variable Check:**
    *   In `packages/mcp/src/index.ts` or `embeddingUtils.ts`, check for `process.env.AUTO_GENERATE_EMBEDDINGS === 'true'`.
*   [ ] **Modify CUD Handlers:**
    *   Refactor the `manage_*` handlers in each `tool.*.ts` file (as planned in the original Phase 3, Option B - replacing `createEntityHandler`).
    *   Inside the new handler, *after* successfully parsing the input for a create or update operation:
        *   Check if `process.env.AUTO_GENERATE_EMBEDDINGS === 'true'`.
        *   If true:
            *   Generate the combined text using `getTextForEntity`.
            *   Generate the embedding using `getGeminiEmbedding`.
            *   Add the `embedding` to the data object being inserted/updated.
        *   Perform the `db.insert` or `db.update` operation.
    *   Ensure the delete operation path remains unchanged.

**Phase 5: Similarity Search Tools (`packages/mcp`)**

*   [ ] **Add Similarity Search Tools:**
    *   In each relevant `tool.*.ts` file (e.g., `tool.npcs.ts`):
        *   Define a new tool definition (e.g., `search_npcs_by_similarity`).
        *   Input Schema: `z.object({ query: z.string().describe("Text to search for"), limit: z.number().optional().default(5).describe("Max number of results") })`. Convert using `zodToMCP`.
        *   Handler:
            *   Import `cosineDistance` (or `l2Distance`, `innerProduct`) from `drizzle-orm/pgvector`.
            *   Import `getGeminiEmbedding` from `embeddingUtils.ts`.
            *   Parse input `query` and `limit`.
            *   Generate the embedding for the input `query`. Handle errors.
            *   Perform the DB query: `db.select().from(table).orderBy(cosineDistance(table.embedding, queryEmbedding)).limit(limit).where(isNotNull(table.embedding))`.
            *   Return the results or an error message.
*   [ ] **Register Search Tools:**
    *   In `packages/mcp/src/tools/tools.ts`:
        *   Import the new search tool definitions and handlers.
        *   Add them to `allTools` and `allToolHandlers`.

**Phase 6: Testing**

*   [ ] **Test Manual Generation:** Use the React UI buttons to generate embeddings for various entities. Verify success messages and check the database.
*   [ ] **Test Automatic Generation (If Enabled):** Set `AUTO_GENERATE_EMBEDDINGS=true`. Use MCP tools (`manage_*`) to create/update entities. Verify embeddings are populated/updated automatically.
*   [ ] **Test Search:** Use MCP tools (`search_*_by_similarity`) with diverse queries. Evaluate the relevance of the results.
*   [ ] **Test Delete:** Ensure delete operations still function correctly via `manage_*` tools.

---

This revised plan incorporates the UI-driven approach and optional automatic generation.
