// maps/relations.ts
import { relations } from "drizzle-orm"
import { siteEncounters, sites } from "../regions/tables"
import { mapFiles, mapGroups, mapVariants } from "./tables"

export const mapFilesRelations = relations(mapFiles, ({ one }) => ({
	variant: one(mapVariants),
}))

export const mapGroupsRelations = relations(mapGroups, ({ one, many }) => ({
	variants: many(mapVariants),
	site: one(sites),
}))

export const mapVariantsRelations = relations(mapVariants, ({ one, many }) => ({
	mapGroup: one(mapGroups, {
		fields: [mapVariants.mapGroupId],
		references: [mapGroups.id],
	}),
	mapFile: one(mapFiles, {
		fields: [mapVariants.mapFileId],
		references: [mapFiles.id],
	}),
	siteEncounters: many(siteEncounters),
}))
