import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./events-tools-schema"
import { createManageEntityHandler, createManageSchema } from "./tool.utils"
import type { CreateEntityGetters, ToolDefinition } from "./utils/types"

type EventGetters = CreateEntityGetters<typeof tables.eventTables>

export const entityGetters: EventGetters = {
	all_narrative_events: () => db.query.narrativeEvents.findMany({}),
	all_consequences: () => db.query.consequences.findMany({}),

	narrative_event_by_id: (id: number) =>
		db.query.narrativeEvents.findFirst({
			where: (narrativeEvents, { eq }) => eq(narrativeEvents.id, id),
			with: {
				questStage: { columns: { name: true, id: true } },
				relatedQuest: { columns: { name: true, id: true } },
				triggeringDecision: { columns: { name: true, id: true } },
			},
		}),

	consequence_by_id: (id: number) =>
		db.query.consequences.findFirst({
			where: (consequences, { eq }) => eq(consequences.id, id),
			with: {
				affectedConflict: true,
				affectedDestination: true,
				affectedNpc: true,
				futureQuest: true,
				triggerConflict: true,
				triggerQuest: true,
				triggerDecision: true,
				affectedRegion: true,
				affectedArea: true,
				affectedSite: true,
				affectedFaction: true,
			},
		}),
}

export const eventToolDefinitions: Record<"manage_event", ToolDefinition> = {
	manage_event: {
		description: "Manage event-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_event", tables.eventTables, tableEnum, schemas),
	},
}
