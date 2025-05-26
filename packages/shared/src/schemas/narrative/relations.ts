import { relations } from "drizzle-orm"
import { majorConflicts } from "../conflict/tables"
import { embeddings } from "../embeddings/tables"
import { consequences } from "../events/tables"
import { regions } from "../regions/tables"
import { destinationRelationships, narrativeDestinations } from "./tables"

export const narrativeDestinationsRelations = relations(narrativeDestinations, ({ many, one }) => ({
	consequences: many(consequences, {
		relationName: "consequencesForDestination",
	}),
	embedding: one(embeddings, {
		fields: [narrativeDestinations.embeddingId],
		references: [embeddings.id],
	}),
	primaryRegion: one(regions, {
		fields: [narrativeDestinations.primaryRegionId],
		references: [regions.id],
		relationName: "regionNarrativeDestinations",
	}),
	relatedConflict: one(majorConflicts, {
		fields: [narrativeDestinations.relatedConflictId],
		references: [majorConflicts.id],
		relationName: "conflictNarrativeDestinations",
	}),
	sourceOfRelationships: many(destinationRelationships, {
		relationName: "sourceDestinationInRelationship",
	}),
	targetInRelationships: many(destinationRelationships, {
		relationName: "relatedDestinationInRelationship",
	}),
}))

export const destinationRelationshipsRelations = relations(destinationRelationships, ({ one }) => ({
	sourceDestination: one(narrativeDestinations, {
		fields: [destinationRelationships.sourceDestinationId],
		references: [narrativeDestinations.id],
		relationName: "sourceDestinationInRelationship",
	}),
	relatedDestination: one(narrativeDestinations, {
		fields: [destinationRelationships.relatedDestinationId],
		references: [narrativeDestinations.id],
		relationName: "relatedDestinationInRelationship",
	}),
}))
