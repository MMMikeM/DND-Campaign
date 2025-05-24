import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./events-tools-schema"
import { createManageEntityHandler, createManageSchema } from "./tool.utils"
import type { CreateEntityGetters, ToolDefinition } from "./utils/types"

type EventGetters = CreateEntityGetters<typeof tables.eventTables>

export const entityGetters: EventGetters = {
	all_narrative_events: () => db.query.narrativeEvents.findMany({}),
	narrative_event_by_id: (id: number) =>
		db.query.narrativeEvents.findFirst({
			where: (narrativeEvents, { eq }) => eq(narrativeEvents.id, id),
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
