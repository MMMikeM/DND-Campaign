import { BaseLocationOperations } from "../../types/operations.js"
import { RequiredLocation } from "../../types/models.js"
import { Location } from "./location.schema.js"
import { DrizzleDb } from "../../common/database.js"
import { eq, and } from "drizzle-orm"
import {
	locations,
	locationNotableFeatures,
	locationNpcs,
	locationFactions,
	locationPointsOfInterest,
	locationConnections,
	locationDistricts,
	districtFeatures,
	districtNpcs,
	locationAreas,
	areaFeatures,
	areaEncounters,
	areaTreasures,
	areaNpcs,
} from "./location.schema.js"

/**
 * Drizzle implementation of location operations
 */
export class LocationOperations implements BaseLocationOperations {
	private db: DrizzleDb

	constructor(db: DrizzleDb) {
		this.db = db
	}

	// Implement required interface methods
	create(id: string, location: Location): void {
		this.createLocation(id, location)
	}

	get(id: string): Location | null {
		return this.getLocation(id)
	}

	update(id: string, location: Location): void {
		this.updateLocation(id, location)
	}

	delete(id: string): void {
		this.deleteLocation(id)
	}

	createLocation(id: string, location: Location): void {
		this.db.transaction((tx) => {
			// Insert main location data
			tx.insert(locations)
				.values({
					id,
					name: location.name,
					type: location.type,
					region: location.region,
					description: location.description,
					history: location.history,
					dangerLevel: location.dangerLevel,
					factionControl: location.factionControl,
				})
				.run()

			// Insert notable features
			this.insertLocationRelatedData(tx, id, location)
		})
	}

	getLocation(id: string): RequiredLocation | null {
		// Get main location data
		const location = this.db.select().from(locations).where(eq(locations.id, id)).get()

		if (!location) return null

		// Get all related location data
		return this.getLocationWithRelatedData(location, id)
	}

	updateLocation(id: string, location: RequiredLocation): void {
		this.db.transaction((tx) => {
			// Update main location record
			tx.update(locations)
				.set({
					name: location.name,
					type: location.type,
					region: location.region,
					description: location.description,
					history: location.history,
					dangerLevel: location.dangerLevel,
					factionControl: location.factionControl,
				})
				.where(eq(locations.id, id))
				.run()

			// Delete all related data
			this.deleteLocationRelatedData(tx, id)

			// Reinsert all related data
			this.insertLocationRelatedData(tx, id, location)
		})
	}

	deleteLocation(id: string): void {
		this.db.transaction((tx) => {
			// Delete related data
			this.deleteLocationRelatedData(tx, id)

			// Delete main location record
			tx.delete(locations).where(eq(locations.id, id)).run()
		})
	}

	// Implement other required methods of the LocationOperations interface
	addFeature(locationId: string, feature: string): void {
		this.db
			.insert(locationNotableFeatures)
			.values({
				locationId,
				feature,
			})
			.run()
	}

	removeFeature(locationId: string, feature: string): void {
		this.db
			.delete(locationNotableFeatures)
			.where(
				and(
					eq(locationNotableFeatures.locationId, locationId),
					eq(locationNotableFeatures.feature, feature),
				),
			)
			.run()
	}

	// Private helper methods
	private insertLocationRelatedData(tx: any, id: string, location: RequiredLocation): void {
		// Insert notable features
		if (location.notable_features && location.notable_features.length > 0) {
			for (const feature of location.notable_features) {
				tx.insert(locationNotableFeatures)
					.values({
						locationId: id,
						feature,
					})
					.run()
			}
		}

		// Insert NPCs, factions, POIs, etc. (implementation simplified)
	}

	private deleteLocationRelatedData(tx: any, id: string): void {
		// Delete all related data
		tx.delete(locationNotableFeatures).where(eq(locationNotableFeatures.locationId, id)).run()
		tx.delete(locationNpcs).where(eq(locationNpcs.locationId, id)).run()
		tx.delete(locationFactions).where(eq(locationFactions.locationId, id)).run()
		tx.delete(locationPointsOfInterest).where(eq(locationPointsOfInterest.locationId, id)).run()
		tx.delete(locationConnections).where(eq(locationConnections.locationId, id)).run()
		tx.delete(locationDistricts).where(eq(locationDistricts.locationId, id)).run()

		// Also delete related sub-items
		tx.delete(districtFeatures).where(eq(districtFeatures.locationId, id)).run()
		tx.delete(districtNpcs).where(eq(districtNpcs.locationId, id)).run()
		tx.delete(locationAreas).where(eq(locationAreas.locationId, id)).run()
		tx.delete(areaFeatures).where(eq(areaFeatures.locationId, id)).run()
		tx.delete(areaEncounters).where(eq(areaEncounters.locationId, id)).run()
		tx.delete(areaTreasures).where(eq(areaTreasures.locationId, id)).run()
		tx.delete(areaNpcs).where(eq(areaNpcs.locationId, id)).run()
	}

	private getLocationWithRelatedData(location: any, id: string): RequiredLocation {
		// Fetch and combine location data (simplified)
		// Get notable features
		const features = this.db
			.select({ feature: locationNotableFeatures.feature })
			.from(locationNotableFeatures)
			.where(eq(locationNotableFeatures.locationId, id))
			.all()
			.map((row: { feature: string }) => row.feature)

		location.notable_features = features

		// Get other related data (NPCs, factions, POIs, etc.)

		return location as RequiredLocation
	}
}
