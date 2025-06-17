// maps/relations.ts
import { relations } from "drizzle-orm"
import { sites } from "../regions/tables"
import { mapFiles, maps } from "./tables"

export const mapsRelations = relations(mapFiles, ({ one }) => ({
	mapDetails: one(maps),
	site: one(sites),
}))

export const mapDetailsRelations = relations(maps, ({ one }) => ({
	map: one(mapFiles, {
		fields: [maps.mapId],
		references: [mapFiles.id],
	}),
}))
