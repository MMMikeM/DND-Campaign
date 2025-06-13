// maps/relations.ts
import { relations } from "drizzle-orm"
import { sites } from "../regions/tables"
import { mapDetails, maps } from "./tables"

export const mapsRelations = relations(maps, ({ one }) => ({
	mapDetails: one(mapDetails),
	site: one(sites),
}))

export const mapDetailsRelations = relations(mapDetails, ({ one }) => ({
	map: one(maps, {
		fields: [mapDetails.mapId],
		references: [maps.id],
	}),
}))
