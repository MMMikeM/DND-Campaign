import { eq, and } from "drizzle-orm"
import {
	locations,
	locationNotableFeatures,
	locationPointsOfInterest,
	locationConnections,
	locationDistricts,
	districtFeatures,
	locationAreas,
	areaFeatures,
	areaEncounters,
	areaTreasures,
	type Location,
} from "./location.schema.js"
import type { DrizzleDb } from "../../common/database.js"
import { districtNpcs, locationNpcs, locationFactions, areaNpcs } from "../relations.schema.js"

export const createLocationOperations = (db: DrizzleDb) => {
	const create = (location: Location): void => {
		db.transaction((tx) => {
			// Insert main location data
			const result = tx
				.insert(locations)
				.values({
					name: location.name,
					type: location.type,
					region: location.region,
					description: location.description,
					history: location.history,
					dangerLevel: location.dangerLevel,
					factionControl: location.factionControl,
				})
				.returning({ id: locations.id })
				.get()

			const locationId = result.id

			// Insert notable features
			if (location.notable_features?.length) {
				tx.insert(locationNotableFeatures)
					.values(
						location.notable_features.map((feature) => ({
							locationId,
							feature,
						})),
					)
					.run()
			}

			// Insert NPCs
			if (location.npcs?.length) {
				tx.insert(locationNpcs)
					.values(
						location.npcs.map((npc) => ({
							locationId,
							npcId: npc.id,
							description: npc.description,
						})),
					)
					.run()
			}

			// Insert factions
			if (location.factions?.length) {
				tx.insert(locationFactions)
					.values(
						location.factions.map((faction) => ({
							locationId,
							factionId: faction.id,
							description: faction.description,
						})),
					)
					.run()
			}

			// Insert points of interest
			if (location.points_of_interest?.length) {
				tx.insert(locationPointsOfInterest)
					.values(
						location.points_of_interest.map((poi) => ({
							locationId,
							name: poi.name,
							description: poi.description,
							type: poi.type,
						})),
					)
					.run()
			}

			// Insert connections
			if (location.connections?.length) {
				tx.insert(locationConnections)
					.values(
						location.connections.map((connection) => ({
							locationId,
							targetId: connection.id,
							description: connection.description,
						})),
					)
					.run()
			}

			// Insert districts
			if (location.districts?.length) {
				for (const district of location.districts) {
					const districtResult = tx
						.insert(locationDistricts)
						.values({
							locationId,
							name: district.name,
							description: district.description,
						})
						.returning({ id: locationDistricts.id })
						.get()

					const districtId = districtResult.id

					// Insert district features
					if (district.features?.length) {
						tx.insert(districtFeatures)
							.values(
								district.features.map((feature) => ({
									locationId,
									districtId,
									feature,
								})),
							)
							.run()
					}

					// Insert district NPCs
					if (district.npcs?.length) {
						tx.insert(districtNpcs)
							.values(
								district.npcs.map((npc) => ({
									locationId,
									districtId,
									npcId: npc.id,
									description: npc.description,
								})),
							)
							.run()
					}
				}
			}

			// Insert areas
			if (location.areas?.length) {
				for (const area of location.areas) {
					const areaResult = tx
						.insert(locationAreas)
						.values({
							locationId,
							name: area.name,
							description: area.description,
							dangerLevel: area.dangerLevel,
						})
						.returning({ id: locationAreas.id })
						.get()

					const areaId = areaResult.id

					// Insert area features
					if (area.features?.length) {
						tx.insert(areaFeatures)
							.values(
								area.features.map((feature) => ({
									locationId,
									areaId,
									feature,
								})),
							)
							.run()
					}

					// Insert area encounters
					if (area.encounters?.length) {
						tx.insert(areaEncounters)
							.values(
								area.encounters.map((encounter) => ({
									locationId,
									areaId,
									encounter,
								})),
							)
							.run()
					}

					// Insert area treasures
					if (area.treasures?.length) {
						tx.insert(areaTreasures)
							.values(
								area.treasures.map((treasure) => ({
									locationId,
									areaId,
									treasure,
								})),
							)
							.run()
					}

					// Insert area NPCs
					if (area.npcs?.length) {
						tx.insert(areaNpcs)
							.values(
								area.npcs.map((npc) => ({
									locationId,
									areaId,
									npcId: npc.id,
									description: npc.description,
								})),
							)
							.run()
					}
				}
			}
		})
	}

	const get = (id: number) => {
		// Return raw join results without processing
		return db
			.select({
				location: locations,
				feature: locationNotableFeatures.feature,
				npc: {
					id: locationNpcs.npcId,
					description: locationNpcs.description,
				},
				faction: {
					id: locationFactions.factionId,
					description: locationFactions.description,
				},
				poi: {
					name: locationPointsOfInterest.name,
					description: locationPointsOfInterest.description,
					type: locationPointsOfInterest.type,
				},
				connection: {
					targetId: locationConnections.targetId,
					description: locationConnections.description,
				},
				district: {
					id: locationDistricts.id,
					name: locationDistricts.name,
					description: locationDistricts.description,
				},
				districtFeature: districtFeatures.feature,
				districtNpc: {
					id: districtNpcs.npcId,
					description: districtNpcs.description,
				},
				area: {
					id: locationAreas.id,
					name: locationAreas.name,
					description: locationAreas.description,
					dangerLevel: locationAreas.dangerLevel,
				},
				areaFeature: areaFeatures.feature,
				areaEncounter: areaEncounters.encounter,
				areaTreasure: areaTreasures.treasure,
				areaNpc: {
					id: areaNpcs.npcId,
					description: areaNpcs.description,
				},
			})
			.from(locations)
			.leftJoin(locationNotableFeatures, eq(locationNotableFeatures.locationId, locations.id))
			.leftJoin(locationNpcs, eq(locationNpcs.locationId, locations.id))
			.leftJoin(locationFactions, eq(locationFactions.locationId, locations.id))
			.leftJoin(locationPointsOfInterest, eq(locationPointsOfInterest.locationId, locations.id))
			.leftJoin(locationConnections, eq(locationConnections.locationId, locations.id))
			.leftJoin(locationDistricts, eq(locationDistricts.locationId, locations.id))
			.leftJoin(districtFeatures, eq(districtFeatures.locationId, locations.id))
			.leftJoin(districtNpcs, eq(districtNpcs.locationId, locations.id))
			.leftJoin(locationAreas, eq(locationAreas.locationId, locations.id))
			.leftJoin(areaFeatures, eq(areaFeatures.locationId, locations.id))
			.leftJoin(areaEncounters, eq(areaEncounters.locationId, locations.id))
			.leftJoin(areaTreasures, eq(areaTreasures.locationId, locations.id))
			.leftJoin(areaNpcs, eq(areaNpcs.locationId, locations.id))
			.where(eq(locations.id, id))
			.all()
	}

	const update = (id: number, partialLocation: Location): void => {
		db.transaction((tx) => {
			// Extract the base location fields from partialLocation
			const {
				notable_features,
				npcs,
				factions,
				points_of_interest,
				connections,
				districts,
				areas,
				...locationFields,
			} = partialLocation

			// Update main location record if there are fields to update
			if (Object.keys(locationFields).length > 0) {
				tx.update(locations).set(locationFields).where(eq(locations.id, id)).run()
			}

			// Update related data only if provided in the partial update

			// Update notable features if provided
			if (notable_features !== undefined) {
				tx.delete(locationNotableFeatures).where(eq(locationNotableFeatures.locationId, id)).run()
				if (notable_features.length > 0) {
					tx.insert(locationNotableFeatures)
						.values(
							notable_features.map((feature) => ({
								locationId: id,
								feature,
							})),
						)
						.run()
				}
			}

			// Update NPCs if provided
			if (npcs !== undefined) {
				tx.delete(locationNpcs).where(eq(locationNpcs.locationId, id)).run()
				if (npcs.length > 0) {
					tx.insert(locationNpcs)
						.values(
							npcs.map((npc) => ({
								locationId: id,
								npcId: npc.id,
								description: npc.description,
							})),
						)
						.run()
				}
			}

			// Update factions if provided
			if (factions !== undefined) {
				tx.delete(locationFactions).where(eq(locationFactions.locationId, id)).run()
				if (factions.length > 0) {
					tx.insert(locationFactions)
						.values(
							factions.map((faction) => ({
								locationId: id,
								factionId: faction.id,
								description: faction.description,
							})),
						)
						.run()
				}
			}

			// Update points of interest if provided
			if (points_of_interest !== undefined) {
				tx.delete(locationPointsOfInterest)
					.where(eq(locationPointsOfInterest.locationId, id))
					.run()
				if (points_of_interest.length > 0) {
					tx.insert(locationPointsOfInterest)
						.values(
							points_of_interest.map((poi) => ({
								locationId: id,
								name: poi.name,
								description: poi.description,
								type: poi.type,
							})),
						)
						.run()
				}
			}

			// Update connections if provided
			if (connections !== undefined) {
				tx.delete(locationConnections).where(eq(locationConnections.locationId, id)).run()
				if (connections.length > 0) {
					tx.insert(locationConnections)
						.values(
							connections.map((connection) => ({
								locationId: id,
								targetId: connection.id,
								description: connection.description,
							})),
						)
						.run()
				}
			}

			// Update districts if provided
			if (districts !== undefined) {
				// Delete all district-related data
				tx.delete(districtFeatures).where(eq(districtFeatures.locationId, id)).run()
				tx.delete(districtNpcs).where(eq(districtNpcs.locationId, id)).run()
				tx.delete(locationDistricts).where(eq(locationDistricts.locationId, id)).run()

				if (districts.length > 0) {
					for (const district of districts) {
						const districtResult = tx
							.insert(locationDistricts)
							.values({
								locationId: id,
								name: district.name,
								description: district.description,
							})
							.returning({ id: locationDistricts.id })
							.get()

						const districtId = districtResult.id

						// Insert district features
						if (district.features?.length) {
							tx.insert(districtFeatures)
								.values(
									district.features.map((feature) => ({
										locationId: id,
										districtId,
										feature,
									})),
								)
								.run()
						}

						// Insert district NPCs
						if (district.npcs?.length) {
							tx.insert(districtNpcs)
								.values(
									district.npcs.map((npc) => ({
										locationId: id,
										districtId,
										npcId: npc.id,
										description: npc.description,
									})),
								)
								.run()
						}
					}
				}
			}

			// Update areas if provided
			if (areas !== undefined) {
				// Delete all area-related data
				tx.delete(areaFeatures).where(eq(areaFeatures.locationId, id)).run()
				tx.delete(areaEncounters).where(eq(areaEncounters.locationId, id)).run()
				tx.delete(areaTreasures).where(eq(areaTreasures.locationId, id)).run()
				tx.delete(areaNpcs).where(eq(areaNpcs.locationId, id)).run()
				tx.delete(locationAreas).where(eq(locationAreas.locationId, id)).run()

				if (areas.length > 0) {
					for (const area of areas) {
						const areaResult = tx
							.insert(locationAreas)
							.values({
								locationId: id,
								name: area.name,
								description: area.description,
								dangerLevel: area.dangerLevel,
							})
							.returning({ id: locationAreas.id })
							.get()

						const areaId = areaResult.id

						// Insert area features
						if (area.features?.length) {
							tx.insert(areaFeatures)
								.values(
									area.features.map((feature) => ({
										locationId: id,
										areaId,
										feature,
									})),
								)
								.run()
						}

						// Insert area encounters
						if (area.encounters?.length) {
							tx.insert(areaEncounters)
								.values(
									area.encounters.map((encounter) => ({
										locationId: id,
										areaId,
										encounter,
									})),
								)
								.run()
						}

						// Insert area treasures
						if (area.treasures?.length) {
							tx.insert(areaTreasures)
								.values(
									area.treasures.map((treasure) => ({
										locationId: id,
										areaId,
										treasure,
									})),
								)
								.run()
						}

						// Insert area NPCs
						if (area.npcs?.length) {
							tx.insert(areaNpcs)
								.values(
									area.npcs.map((npc) => ({
										locationId: id,
										areaId,
										npcId: npc.id,
										description: npc.description,
									})),
								)
								.run()
						}
					}
				}
			}
		})
	}

	const deleteFn = (id: number): void => {
		db.transaction((tx) => {
			// Delete all related data first
			tx.delete(locationNotableFeatures).where(eq(locationNotableFeatures.locationId, id)).run()
			tx.delete(locationNpcs).where(eq(locationNpcs.locationId, id)).run()
			tx.delete(locationFactions).where(eq(locationFactions.locationId, id)).run()
			tx.delete(locationPointsOfInterest).where(eq(locationPointsOfInterest.locationId, id)).run()
			tx.delete(locationConnections).where(eq(locationConnections.locationId, id)).run()
			tx.delete(districtFeatures).where(eq(districtFeatures.locationId, id)).run()
			tx.delete(districtNpcs).where(eq(districtNpcs.locationId, id)).run()
			tx.delete(locationDistricts).where(eq(locationDistricts.locationId, id)).run()
			tx.delete(areaFeatures).where(eq(areaFeatures.locationId, id)).run()
			tx.delete(areaEncounters).where(eq(areaEncounters.locationId, id)).run()
			tx.delete(areaTreasures).where(eq(areaTreasures.locationId, id)).run()
			tx.delete(areaNpcs).where(eq(areaNpcs.locationId, id)).run()
			tx.delete(locationAreas).where(eq(locationAreas.locationId, id)).run()

			// Delete main location record
			tx.delete(locations).where(eq(locations.id, id)).run()
		})
	}

	const addFeature = (locationId: number, feature: string): void => {
		db.insert(locationNotableFeatures)
			.values({
				locationId,
				feature,
			})
			.run()
	}

	const removeFeature = (locationId: number, feature: string): void => {
		db.delete(locationNotableFeatures)
			.where(
				and(
					eq(locationNotableFeatures.locationId, locationId),
					eq(locationNotableFeatures.feature, feature),
				),
			)
			.run()
	}

	return {
		create,
		get,
		update,
		delete: deleteFn,
		addFeature,
		removeFeature,
	}
} 