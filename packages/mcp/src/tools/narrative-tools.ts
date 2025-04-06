import { tables } from "@tome-master/shared"
import {
  createEntityActionDescription,
  createEntityHandler,
  type ToolDefinition,
} from "./tool.utils"
import { zodToMCP } from "../zodToMcp"
import { schemas, type NarrativeTools } from "./narrative-tools-schema"

const {
  narrativeTables: { narrativeArcs, arcMembership },
} = tables

export const narrativeToolDefinitions: Record<NarrativeTools, ToolDefinition> = {
  manage_narrative_arcs: {
    description: createEntityActionDescription("narrative arc"),
    inputSchema: zodToMCP(schemas.manage_narrative_arcs),
    handler: createEntityHandler(
      narrativeArcs,
      schemas.manage_narrative_arcs,
      "narrative arc"
    ),
  },
  manage_arc_membership: {
    description: createEntityActionDescription("arc membership record"),
    inputSchema: zodToMCP(schemas.manage_arc_membership),
    handler: createEntityHandler(
      arcMembership,
      schemas.manage_arc_membership,
      "arc membership record"
    ),
  },
}
