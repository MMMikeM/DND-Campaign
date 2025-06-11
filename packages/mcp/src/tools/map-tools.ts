import { tables } from "@tome-master/shared"
import { db } from "../index"
import { schemas, tableEnum } from "./map-tools.schema"
import { createManageEntityHandler, createManageSchema } from "./utils/tool.utils"
import type { ToolDefinition } from "./utils/types"
import { createEntityGettersFactory } from "./utils/types"


const mapTables = {
	mapDetails: tables.mapTables.mapDetails,
}

const createEntityGetters = createEntityGettersFactory(mapTables)

export const entityGetters = createEntityGetters({

	all_map_details: () =>
		db.query.mapDetails.findMany({
			with: { map: { columns: { name: true, id: true } } },
		}),

	map_detail_by_id: (id: number) =>
		db.query.mapDetails.findFirst({
			where: (mapDetails, { eq }) => eq(mapDetails.mapId, id),
			with: { map: { columns: { name: true, id: true } } },
		}),
})



export const mapToolDefinitions: Record<"manage_map", ToolDefinition> = {
	manage_map: {
		description: "Manage map assets and their associated tactical details.",
		inputSchema: createManageSchema(schemas, tableEnum),
		handler: createManageEntityHandler("manage_map", mapTables, tableEnum, schemas),
		annotations: {
			title: "Manage Maps",
			readOnlyHint: false,
			destructiveHint: false,
			idempotentHint: false,
			openWorldHint: false,
		},
	},
} 