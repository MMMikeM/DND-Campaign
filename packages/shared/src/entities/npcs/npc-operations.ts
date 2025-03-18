import { eq } from "drizzle-orm"
import {
	npcs,
	npcDescriptions,
	npcPersonalityTraits,
	npcQuests,
	npcRelationships,
	npcLocations,
	npcInventory,
	type Npc,
} from "./npc.schema.js"
import type { DrizzleDb } from "../../common/database.js"

export const createNPCOperations = (db: DrizzleDb) => {
	const create = (npc: Npc): void => {
		db.transaction((tx) => {
			// Insert main NPC data
			const result = tx
				.insert(npcs)
				.values({
					name: npc.name,
					race: npc.race,
					gender: npc.gender,
					occupation: npc.occupation,
					role: npc.role,
					quirk: npc.quirk,
					background: npc.background,
					motivation: npc.motivation,
					secret: npc.secret,
					stats: npc.stats,
				})
				.returning({ id: npcs.id })
				.get()

			const npcId = result.id

			// Insert descriptions
			if (npc.description?.length) {
				tx.insert(npcDescriptions)
					.values(
						npc.description.map((desc) => ({
							npcId,
							description: desc,
						})),
					)
					.run()
			}

			// Insert personality traits
			if (npc.personality?.length) {
				tx.insert(npcPersonalityTraits)
					.values(
						npc.personality.map((trait) => ({
							npcId,
							trait,
						})),
					)
					.run()
			}

			// Insert relationships
			if (npc.relationships?.length) {
				tx.insert(npcRelationships)
					.values(
						npc.relationships.map((relationship) => ({
							npcId,
							targetId: relationship.id,
							description: relationship.description,
						})),
					)
					.run()
			}

			// Insert quests
			if (npc.quests?.length) {
				tx.insert(npcQuests)
					.values(
						npc.quests.map((quest) => ({
							npcId,
							questId: quest.id,
							description: quest.description,
						})),
					)
					.run()
			}

			// Insert locations
			if (npc.location?.length) {
				tx.insert(npcLocations)
					.values(
						npc.location.map((loc) => ({
							npcId,
							locationId: loc.id,
							description: loc.description,
						})),
					)
					.run()
			}

			// Insert inventory items
			if (npc.inventory?.length) {
				tx.insert(npcInventory)
					.values(
						npc.inventory.map((item) => ({
							npcId,
							item,
						})),
					)
					.run()
			}
		})
	}

	const get = (id: number) => {
		// Return raw join results without processing
		return db
			.select({
				npc: npcs,
				description: npcDescriptions.description,
				personality: npcPersonalityTraits.trait,
				quest: {
					id: npcQuests.questId,
					description: npcQuests.description,
				},
				relationship: {
					targetId: npcRelationships.targetId,
					description: npcRelationships.description,
				},
				location: {
					id: npcLocations.locationId,
					description: npcLocations.description,
				},
				inventory: npcInventory.item,
			})
			.from(npcs)
			.leftJoin(npcDescriptions, eq(npcDescriptions.npcId, npcs.id))
			.leftJoin(npcPersonalityTraits, eq(npcPersonalityTraits.npcId, npcs.id))
			.leftJoin(npcQuests, eq(npcQuests.npcId, npcs.id))
			.leftJoin(npcRelationships, eq(npcRelationships.npcId, npcs.id))
			.leftJoin(npcLocations, eq(npcLocations.npcId, npcs.id))
			.leftJoin(npcInventory, eq(npcInventory.npcId, npcs.id))
			.where(eq(npcs.id, id))
			.all()
	}

	const update = (id: number, partialNpc: Npc): void => {
		db.transaction((tx) => {
			// Extract the base NPC fields from partialNpc
			const { description, personality, relationships, quests, location, inventory, ...npcFields } =
				partialNpc

			// Update main NPC record if there are fields to update
			if (Object.keys(npcFields).length > 0) {
				tx.update(npcs).set(npcFields).where(eq(npcs.id, id)).run()
			}

			// Update related data only if provided in the partial update

			// Update descriptions if provided
			if (description !== undefined) {
				tx.delete(npcDescriptions).where(eq(npcDescriptions.npcId, id)).run()
				if (description.length > 0) {
					tx.insert(npcDescriptions)
						.values(
							description.map((desc) => ({
								npcId: id,
								description: desc,
							})),
						)
						.run()
				}
			}

			// Update personality traits if provided
			if (personality !== undefined) {
				tx.delete(npcPersonalityTraits).where(eq(npcPersonalityTraits.npcId, id)).run()
				if (personality.length > 0) {
					tx.insert(npcPersonalityTraits)
						.values(
							personality.map((trait) => ({
								npcId: id,
								trait,
							})),
						)
						.run()
				}
			}

			// Update relationships if provided
			if (relationships !== undefined) {
				tx.delete(npcRelationships).where(eq(npcRelationships.npcId, id)).run()
				if (relationships.length > 0) {
					tx.insert(npcRelationships)
						.values(
							relationships.map((relationship) => ({
								npcId: id,
								targetId: relationship.id,
								description: relationship.description,
							})),
						)
						.run()
				}
			}

			// Update quests if provided
			if (quests !== undefined) {
				tx.delete(npcQuests).where(eq(npcQuests.npcId, id)).run()
				if (quests.length > 0) {
					tx.insert(npcQuests)
						.values(
							quests.map((quest) => ({
								npcId: id,
								questId: quest.id,
								description: quest.description,
							})),
						)
						.run()
				}
			}

			// Update locations if provided
			if (location !== undefined) {
				tx.delete(npcLocations).where(eq(npcLocations.npcId, id)).run()
				if (location.length > 0) {
					tx.insert(npcLocations)
						.values(
							location.map((loc) => ({
								npcId: id,
								locationId: loc.id,
								description: loc.description,
							})),
						)
						.run()
				}
			}

			// Update inventory if provided
			if (inventory !== undefined) {
				tx.delete(npcInventory).where(eq(npcInventory.npcId, id)).run()
				if (inventory.length > 0) {
					tx.insert(npcInventory)
						.values(
							inventory.map((item) => ({
								npcId: id,
								item,
							})),
						)
						.run()
				}
			}
		})
	}

	const deleteFn = (id: number): void => {
		db.transaction((tx) => {
			// Delete related data first
			tx.delete(npcDescriptions).where(eq(npcDescriptions.npcId, id)).run()
			tx.delete(npcPersonalityTraits).where(eq(npcPersonalityTraits.npcId, id)).run()
			tx.delete(npcQuests).where(eq(npcQuests.npcId, id)).run()
			tx.delete(npcRelationships).where(eq(npcRelationships.npcId, id)).run()
			tx.delete(npcLocations).where(eq(npcLocations.npcId, id)).run()
			tx.delete(npcInventory).where(eq(npcInventory.npcId, id)).run()

			// Delete main NPC record
			tx.delete(npcs).where(eq(npcs.id, id)).run()
		})
	}

	return {
		create,
		get,
		update,
		delete: deleteFn,
	}
}
