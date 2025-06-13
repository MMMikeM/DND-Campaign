// maps/relations.ts
import { relations } from "drizzle-orm"
import { sites } from "../regions/tables"
import { mapDetails, maps } from "./tables"

export const mapsRelations = relations(maps, ({ one }) => ({
	mapDetails: one(mapDetails, {
		fields: [maps.id],
		references: [mapDetails.mapId],
	}),
	site: one(sites, {
		fields: [maps.id],
		references: [sites.mapId],
	}),
}))

export const mapDetailsRelations = relations(mapDetails, ({ one }) => ({
	map: one(maps, {
		fields: [mapDetails.mapId],
		references: [maps.id],
	}),
}))
