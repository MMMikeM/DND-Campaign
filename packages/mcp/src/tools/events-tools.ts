import { tables } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { db } from "../index"
import { schemas, tableEnum } from "./events-tools-schema"
import { createManageEntityHandler, createManageSchema } from "./tool.utils"
import type { CreateEntityGetters, ToolDefinition } from "./utils/types"

const {
	eventTables: { narrativeEvents },
} = tables

type EventGetters = CreateEntityGetters<typeof tables.eventTables>

// Define specific getters if needed, like fetching events with relations
export const entityGetters: EventGetters = {
	all_narrative_events: () => db.query.narrativeEvents.findMany({}),
	narrative_event_by_id: (id: number) =>
		db.query.narrativeEvents.findFirst({
			where: eq(narrativeEvents.id, id),
			// Add relations if needed for context when fetching single event
			with: {
				questStage: true,
				triggeringDecision: true,
				relatedQuest: true,
				foreshadowedBy: true,
			},
		}),
}

export const eventToolDefinitions: Record<"manage_events", ToolDefinition> = {
	manage_events: {
		description: "Manage narrative events (complications, escalations, twists).",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_events", tables.eventTables, tableEnum, schemas),
	},
}
