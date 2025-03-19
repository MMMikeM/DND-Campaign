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
	districtNpcs,
	areaNpcs,
	locationNpcs,
} from "./location.schema.js"
import type { DrizzleDb } from "../../db/index.js"
import type { NewLocation, UpdateLocation } from "./location.zod.js"
import { locationFactions } from "../relations.schema.js"

export const createLocationOperations = (db: DrizzleDb) => {
	const create = async (newLocation: NewLocation): Promise<number> => {
		try {
			return await db.transaction(async (tx) => {
				// Insert main location data
				const locationResult = await tx
					.insert(locations)
					.values({
						name: newLocation.name,
						type: newLocation.type,
						region: newLocation.region,
						description: newLocation.description,
						history: newLocation.history,
						dangerLevel: newLocation.dangerLevel,
						factionControl: newLocation.factionControl,
					})
					.returning({ id: locations.id })

				const locationId = locationResult[0].id

				// Insert notable features
				if (newLocation.notableFeatures?.length) {
					await tx.insert(locationNotableFeatures).values(
						newLocation.notableFeatures.map((feature) => ({
							locationId,
							feature: feature.feature,
						})),
					)
				}

				// Insert points of interest
				if (newLocation.pointsOfInterest?.length) {
					await tx.insert(locationPointsOfInterest).values(
						newLocation.pointsOfInterest.map((poi) => ({
							locationId,
							name: poi.name,
							description: poi.description,
						})),
					)
				}

				// Insert connections
				if (newLocation.connections?.length) {
					await tx.insert(locationConnections).values(
						newLocation.connections.map((connection) => ({
							locationId,
							connectedLocationId: connection.connectedLocationId,
						})),
					)
				}

				// Insert districts and their related data
				if (newLocation.districts?.length) {
					for (const district of newLocation.districts) {
						// Insert district
						const districtResult = await tx
							.insert(locationDistricts)
							.values({
								locationId,
								name: district.name,
								description: district.description,
							})
							.returning({ id: locationDistricts.id })

						const districtId = districtResult[0].id

						// Insert district features
						if (district.features?.length) {
							await tx.insert(districtFeatures).values(
								district.features.map((feature) => ({
									districtId,
									feature: feature.feature,
								})),
							)
						}

						// Insert district NPCs
						if (district.npcs?.length) {
							await tx.insert(districtNpcs).values(
								district.npcs.map((npc) => ({
									districtId,
									npcId: npc.npcId,
								})),
							)
						}
					}
				}

				// Insert areas and their related data
				if (newLocation.areas?.length) {
					for (const area of newLocation.areas) {
						// Insert area
						const areaResult = await tx
							.insert(locationAreas)
							.values({
								locationId,
								name: area.name,
								description: area.description,
							})
							.returning({ id: locationAreas.id })

						const areaId = areaResult[0].id

						// Insert area features
						if (area.features?.length) {
							await tx.insert(areaFeatures).values(
								area.features.map((feature) => ({
									areaId,
									feature: feature.feature,
								})),
							)
						}

						// Insert area encounters
						if (area.encounters?.length) {
							await tx.insert(areaEncounters).values(
								area.encounters.map((encounter) => ({
									areaId,
									encounter: encounter.encounter,
								})),
							)
						}

						// Insert area treasures
						if (area.treasures?.length) {
							await tx.insert(areaTreasures).values(
								area.treasures.map((treasure) => ({
									areaId,
									treasure: treasure.treasure,
								})),
							)
						}

						// Insert area NPCs
						if (area.npcs?.length) {
							await tx.insert(areaNpcs).values(
								area.npcs.map((npc) => ({
									areaId,
									npcId: npc.npcId,
								})),
							)
						}
					}
				}

				// Insert NPCs
				if (newLocation.npcs?.length) {
					await tx.insert(locationNpcs).values(
						newLocation.npcs.map((npc) => ({
							locationId,
							npcId: npc.npcId,
						})),
					)
				}

				// Insert factions
				if (newLocation.factions?.length) {
					await tx.insert(locationFactions).values(
						newLocation.factions.map((faction) => ({
							locationId,
							factionId: faction.factionId,
							influence: faction.influence,
							description: faction.description,
						})),
					)
				}

				return locationId
			})
		} catch (error) {
			console.error("Error creating location:", error)
			throw error
		}
	}

	const get = async (id: number) => {
		try {
			// Return raw join results per your request
			const result = await db
				.select()
				.from(locations)
				.leftJoin(locationNotableFeatures, eq(locationNotableFeatures.locationId, locations.id))
				.leftJoin(locationPointsOfInterest, eq(locationPointsOfInterest.locationId, locations.id))
				.leftJoin(locationConnections, eq(locationConnections.locationId, locations.id))
				.leftJoin(locationDistricts, eq(locationDistricts.locationId, locations.id))
				.leftJoin(districtFeatures, eq(districtFeatures.districtId, locationDistricts.id))
				.leftJoin(districtNpcs, eq(districtNpcs.districtId, locationDistricts.id))
				.leftJoin(locationAreas, eq(locationAreas.locationId, locations.id))
				.leftJoin(areaFeatures, eq(areaFeatures.areaId, locationAreas.id))
				.leftJoin(areaEncounters, eq(areaEncounters.areaId, locationAreas.id))
				.leftJoin(areaTreasures, eq(areaTreasures.areaId, locationAreas.id))
				.leftJoin(areaNpcs, eq(areaNpcs.areaId, locationAreas.id))
				.leftJoin(locationNpcs, eq(locationNpcs.locationId, locations.id))
				.leftJoin(locationFactions, eq(locationFactions.locationId, locations.id))
				.where(eq(locations.id, id))
				.all()

			return result
		} catch (error) {
			console.error("Error retrieving location:", error)
			throw error
		}
	}

	const update = async (locationId: number, partialLocation: UpdateLocation): Promise<void> => {
		try {
			await db.transaction(async (tx) => {
				// Extract the base location fields from partialLocation
				const {
					notableFeatures,
					pointsOfInterest,
					connections,
					districts,
					areas,
					npcs,
					factions,
					...locationFields
				} = partialLocation

				// Update the main location record if there are fields to update
				if (Object.keys(locationFields).length > 0) {
					await tx.update(locations).set(locationFields).where(eq(locations.id, locationId))
				}

				// Update notable features if provided
				if (notableFeatures !== undefined) {
					await tx
						.delete(locationNotableFeatures)
						.where(eq(locationNotableFeatures.locationId, locationId))
					if (notableFeatures.length > 0) {
						await tx.insert(locationNotableFeatures).values(
							notableFeatures.map((feature) => ({
								locationId,
								feature: feature.feature,
							})),
						)
					}
				}

				// Update points of interest if provided
				if (pointsOfInterest !== undefined) {
					await tx
						.delete(locationPointsOfInterest)
						.where(eq(locationPointsOfInterest.locationId, locationId))
					if (pointsOfInterest.length > 0) {
						await tx.insert(locationPointsOfInterest).values(
							pointsOfInterest.map((poi) => ({
								locationId,
								name: poi.name,
								description: poi.description,
							})),
						)
					}
				}

				// Update connections if provided
				if (connections !== undefined) {
					await tx.delete(locationConnections).where(eq(locationConnections.locationId, locationId))
					if (connections.length > 0) {
						await tx.insert(locationConnections).values(
							connections.map((connection) => ({
								locationId,
								connectedLocationId: connection.connectedLocationId,
							})),
						)
					}
				}

				// Update districts and their related data if provided
				if (districts !== undefined) {
					// Get existing districts to find which ones to delete
					const existingDistricts = await tx
						.select({ id: locationDistricts.id })
						.from(locationDistricts)
						.where(eq(locationDistricts.locationId, locationId))

					// Delete all existing district-related data
					for (const district of existingDistricts) {
						await tx.delete(districtFeatures).where(eq(districtFeatures.districtId, district.id))
						await tx.delete(districtNpcs).where(eq(districtNpcs.districtId, district.id))
					}

					// Delete all districts
					await tx.delete(locationDistricts).where(eq(locationDistricts.locationId, locationId))

					// Insert new districts and their related data
					if (districts.length > 0) {
						for (const district of districts) {
							const districtResult = await tx
								.insert(locationDistricts)
								.values({
									locationId,
									name: district.name,
									description: district.description,
								})
								.returning({ id: locationDistricts.id })

							const districtId = districtResult[0].id

							// Insert district features
							if (district.features?.length) {
								await tx.insert(districtFeatures).values(
									district.features.map((feature) => ({
										districtId,
										feature: feature.feature,
									})),
								)
							}

							// Insert district NPCs
							if (district.npcs?.length) {
								await tx.insert(districtNpcs).values(
									district.npcs.map((npc) => ({
										districtId,
										npcId: npc.npcId,
									})),
								)
							}
						}
					}
				}

				// Update areas and their related data if provided
				if (areas !== undefined) {
					// Get existing areas to find which ones to delete
					const existingAreas = await tx
						.select({ id: locationAreas.id })
						.from(locationAreas)
						.where(eq(locationAreas.locationId, locationId))

					// Delete all existing area-related data
					for (const area of existingAreas) {
						await tx.delete(areaFeatures).where(eq(areaFeatures.areaId, area.id))
						await tx.delete(areaEncounters).where(eq(areaEncounters.areaId, area.id))
						await tx.delete(areaTreasures).where(eq(areaTreasures.areaId, area.id))
						await tx.delete(areaNpcs).where(eq(areaNpcs.areaId, area.id))
					}

					// Delete all areas
					await tx.delete(locationAreas).where(eq(locationAreas.locationId, locationId))

					// Insert new areas and their related data
					if (areas.length > 0) {
						for (const area of areas) {
							const areaResult = await tx
								.insert(locationAreas)
								.values({
									locationId,
									name: area.name,
									description: area.description,
								})
								.returning({ id: locationAreas.id })

							const areaId = areaResult[0].id

							// Insert area features
							if (area.features?.length) {
								await tx.insert(areaFeatures).values(
									area.features.map((feature) => ({
										areaId,
										feature: feature.feature,
									})),
								)
							}

							// Insert area encounters
							if (area.encounters?.length) {
								await tx.insert(areaEncounters).values(
									area.encounters.map((encounter) => ({
										areaId,
										encounter: encounter.encounter,
									})),
								)
							}

							// Insert area treasures
							if (area.treasures?.length) {
								await tx.insert(areaTreasures).values(
									area.treasures.map((treasure) => ({
										areaId,
										treasure: treasure.treasure,
									})),
								)
							}

							// Insert area NPCs
							if (area.npcs?.length) {
								await tx.insert(areaNpcs).values(
									area.npcs.map((npc) => ({
										areaId,
										npcId: npc.npcId,
									})),
								)
							}
						}
					}
				}

				// Update NPCs if provided
				if (npcs !== undefined) {
					await tx.delete(locationNpcs).where(eq(locationNpcs.locationId, locationId))
					if (npcs.length > 0) {
						await tx.insert(locationNpcs).values(
							npcs.map((npc) => ({
								locationId,
								npcId: npc.npcId,
							})),
						)
					}
				}

				// Update factions if provided
				if (factions !== undefined) {
					await tx.delete(locationFactions).where(eq(locationFactions.locationId, locationId))
					if (factions.length > 0) {
						await tx.insert(locationFactions).values(
							factions.map((faction) => ({
								locationId,
								factionId: faction.factionId,
								influence: faction.influence,
								description: faction.description,
							})),
						)
					}
				}
			})
		} catch (error) {
			console.error("Error updating location:", error)
			throw error
		}
	}

	const deleteFn = async (id: number): Promise<void> => {
		try {
			await db.transaction(async (tx) => {
				// With cascade delete on foreign keys, we can simplify this
				await tx.delete(locations).where(eq(locations.id, id))
			})
		} catch (error) {
			console.error("Error deleting location:", error)
			throw error
		}
	}

	return {
		create,
		get,
		update,
		delete: deleteFn,
	}
}
