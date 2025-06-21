import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./narrative-events-tools.schema"
import { createEnhancedPolymorphicConfig, createManageEntityHandler, createManageSchema } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"

const createEntityGetters = createEntityGettersFactory(tables.narrativeEventTables)

// Configure polymorphic validation for consequences table
const { consequenceTriggerTypes, consequenceAffectedEntityTypes } = tables.narrativeEventTables.enums
const polymorphicHelper = createEnhancedPolymorphicConfig(tables)
const polymorphicConfig = polymorphicHelper.fromEnums("consequences", [
	{
		typeField: "triggerEntityType",
		idField: "triggerEntityId",
		enumValues: consequenceTriggerTypes,
		// No exclusions needed - all trigger types map to tables
	},
	{
		typeField: "affectedEntityType",
		idField: "affectedEntityId",
		enumValues: consequenceAffectedEntityTypes,
		// No exclusions needed - all affected entity types map to tables
	},
])

export const entityGetters = createEntityGetters({
	all_narrative_events: () => db.query.narrativeEvents.findMany({}),
	all_consequences: () => db.query.consequences.findMany({}),

	narrative_event_by_id: (id: number) =>
		db.query.narrativeEvents.findFirst({
			where: (narrativeEvents, { eq }) => eq(narrativeEvents.id, id),
			with: {
				questStage: { columns: { name: true, id: true } },
				relatedQuest: { columns: { name: true, id: true } },
				triggeringStageDecision: true,
			},
		}),

	consequence_by_id: (id: number) =>
		db.query.consequences.findFirst({
			where: (consequences, { eq }) => eq(consequences.id, id),
			with: {
				affectedConflict: true,
				affectedNarrativeDestination: true,
				affectedNpc: true,
				affectedQuest: true,
				triggerConflict: true,
				triggerQuest: true,
				affectedRegion: true,
				affectedArea: true,
				affectedSite: true,
				affectedFaction: true,
			},
		}),
})

export const narrativeEventToolDefinitions: Record<"manage_narrative_event", ToolDefinition> = {
	manage_narrative_event: {
		enums: tables.narrativeEventTables.enums,
		description: "Manage narrative event-related entities.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler(
			"manage_narrative_event",
			tables.narrativeEventTables,
			tableEnum,
			schemas,
			polymorphicConfig,
		),
		annotations: {
			title: "Manage Narrative Events",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
}
