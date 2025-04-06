import { tables } from "@tome-master/shared"
import {
  createEntityActionDescription,
  createEntityHandler,
  type ToolDefinition,
} from "./tool.utils"
import { zodToMCP } from "../zodToMcp"
import { schemas, type ForeshadowingTools } from "./foreshadowing-tools-schema"

const {
  foreshadowingTables: { narrativeForeshadowing },
} = tables

export const foreshadowingToolDefinitions: Record<
  ForeshadowingTools,
  ToolDefinition
> = {
  manage_narrative_foreshadowing: {
    description: createEntityActionDescription("narrative foreshadowing hint"),
    inputSchema: zodToMCP(schemas.manage_narrative_foreshadowing),
    handler: createEntityHandler(
      narrativeForeshadowing,
      schemas.manage_narrative_foreshadowing,
      "narrative foreshadowing hint"
    ),
  },
}
