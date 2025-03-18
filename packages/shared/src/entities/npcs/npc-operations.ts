import { eq } from "drizzle-orm"
import {
	npcs,
	npcDescriptions,
	npcPersonalityTraits,
	npcRelationships,
	npcInventory,
	npcLocations,
	npcFactions,
	npcQuests,
	npcDialogue,
	type Npc,
	type NewNpc,
	type UpdateNpc,
} from "./npc.schema.js"
import type { DrizzleDb } from "../../db/index.js"

export const createNPCOperations = (db: DrizzleDb) => {
	const create = async (newNpc: NewNpc): Promise<number> => {
		try {
			return await db.transaction(async (tx) => {
				// Insert main NPC data
				const result = await tx
					.insert(npcs)
					.values({
						name: newNpc.name,
						race: newNpc.race,
						gender: newNpc.gender,
						occupation: newNpc.occupation,
						role: newNpc.role,
						quirk: newNpc.quirk,
						background: newNpc.background,
						motivation: newNpc.motivation,
						secret: newNpc.secret,
						stats: newNpc.stats,
					})
					.returning({ id: npcs.id })

				const npcId = result[0].id

				// Insert descriptions
				if (newNpc.descriptions?.length) {
					await tx.insert(npcDescriptions).values(
						newNpc.descriptions.map((desc) => ({
							npcId,
							description: desc.description,
						})),
					)
				}

				// Insert personality traits
				if (newNpc.personalityTraits?.length) {
					await tx.insert(npcPersonalityTraits).values(
						newNpc.personalityTraits.map((trait) => ({
							npcId,
							trait: trait.trait,
						})),
					)
				}

				// Insert relationships
				if (newNpc.relationships?.length) {
					await tx.insert(npcRelationships).values(
						newNpc.relationships.map((rel) => ({
							npcId,
							targetId: rel.targetId,
							description: rel.description,
							relationship: rel.relationship,
						})),
					)
				}

				// Insert inventory
				if (newNpc.inventory?.length) {
					await tx.insert(npcInventory).values(
						newNpc.inventory.map((item) => ({
							npcId,
							item: item.item,
							quantity: item.quantity,
							notes: item.notes,
						})),
					)
				}

				// Insert locations
				if (newNpc.locations?.length) {
					await tx.insert(npcLocations).values(
						newNpc.locations.map((loc) => ({
							npcId,
							locationId: loc.locationId,
							context: loc.context,
						})),
					)
				}

				// Insert factions
				if (newNpc.factions?.length) {
					await tx.insert(npcFactions).values(
						newNpc.factions.map((faction) => ({
							npcId,
							factionId: faction.factionId,
							role: faction.role,
							status: faction.status,
						})),
					)
				}

				// Insert quests
				if (newNpc.quests?.length) {
					await tx.insert(npcQuests).values(
						newNpc.quests.map((quest) => ({
							npcId,
							questId: quest.questId,
							role: quest.role,
						})),
					)
				}

				// Insert dialogue
				if (newNpc.dialogue?.length) {
					await tx.insert(npcDialogue).values(
						newNpc.dialogue.map((dialogue) => ({
							npcId,
							topic: dialogue.topic,
							response: dialogue.response,
							condition: dialogue.condition,
						})),
					)
				}

				// Add area and district relations here when needed

				return npcId
			})
		} catch (error) {
			console.error("Error creating NPC:", error)
			throw error
		}
	}

	const get = async (id: number) => {
		try {
			// Return raw join results using left joins
			const result = await db
				.select()
				.from(npcs)
				.leftJoin(npcDescriptions, eq(npcDescriptions.npcId, npcs.id))
				.leftJoin(npcPersonalityTraits, eq(npcPersonalityTraits.npcId, npcs.id))
				.leftJoin(npcRelationships, eq(npcRelationships.npcId, npcs.id))
				.leftJoin(npcInventory, eq(npcInventory.npcId, npcs.id))
				.leftJoin(npcLocations, eq(npcLocations.npcId, npcs.id))
				.leftJoin(npcFactions, eq(npcFactions.npcId, npcs.id))
				.leftJoin(npcQuests, eq(npcQuests.npcId, npcs.id))
				.leftJoin(npcDialogue, eq(npcDialogue.npcId, npcs.id))
				.where(eq(npcs.id, id))
				.all()

			return result
		} catch (error) {
			console.error("Error retrieving NPC:", error)
			throw error
		}
	}

	const update = async (id: number, partialNpc: UpdateNpc): Promise<void> => {
		try {
			await db.transaction(async (tx) => {
				// Extract the base NPC fields from partialNpc
				const {
					descriptions,
					personalityTraits,
					relationships,
					inventory,
					locations,
					factions,
					quests,
					dialogue,
					areas,
					districts,
					...npcFields
				} = partialNpc

				// Update main NPC record if there are fields to update
				if (Object.keys(npcFields).length > 0) {
					await tx.update(npcs).set(npcFields).where(eq(npcs.id, id))
				}

				// Update descriptions if provided
				if (descriptions !== undefined) {
					await tx.delete(npcDescriptions).where(eq(npcDescriptions.npcId, id))
					if (descriptions.length > 0) {
						await tx.insert(npcDescriptions).values(
							descriptions.map((desc) => ({
								npcId: id,
								description: desc.description,
							})),
						)
					}
				}

				// Update personality traits if provided
				if (personalityTraits !== undefined) {
					await tx.delete(npcPersonalityTraits).where(eq(npcPersonalityTraits.npcId, id))
					if (personalityTraits.length > 0) {
						await tx.insert(npcPersonalityTraits).values(
							personalityTraits.map((trait) => ({
								npcId: id,
								trait: trait.trait,
							})),
						)
					}
				}

				// Update relationships if provided
				if (relationships !== undefined) {
					await tx.delete(npcRelationships).where(eq(npcRelationships.npcId, id))
					if (relationships.length > 0) {
						await tx.insert(npcRelationships).values(
							relationships.map((rel) => ({
								npcId: id,
								targetId: rel.targetId,
								description: rel.description,
								relationship: rel.relationship,
							})),
						)
					}
				}

				// Update inventory if provided
				if (inventory !== undefined) {
					await tx.delete(npcInventory).where(eq(npcInventory.npcId, id))
					if (inventory.length > 0) {
						await tx.insert(npcInventory).values(
							inventory.map((item) => ({
								npcId: id,
								item: item.item,
								quantity: item.quantity,
								notes: item.notes,
							})),
						)
					}
				}

				// Update locations if provided
				if (locations !== undefined) {
					await tx.delete(npcLocations).where(eq(npcLocations.npcId, id))
					if (locations.length > 0) {
						await tx.insert(npcLocations).values(
							locations.map((loc) => ({
								npcId: id,
								locationId: loc.locationId,
								context: loc.context,
							})),
						)
					}
				}

				// Update factions if provided
				if (factions !== undefined) {
					await tx.delete(npcFactions).where(eq(npcFactions.npcId, id))
					if (factions.length > 0) {
						await tx.insert(npcFactions).values(
							factions.map((faction) => ({
								npcId: id,
								factionId: faction.factionId,
								role: faction.role,
								status: faction.status,
							})),
						)
					}
				}

				// Update quests if provided
				if (quests !== undefined) {
					await tx.delete(npcQuests).where(eq(npcQuests.npcId, id))
					if (quests.length > 0) {
						await tx.insert(npcQuests).values(
							quests.map((quest) => ({
								npcId: id,
								questId: quest.questId,
								role: quest.role,
							})),
						)
					}
				}

				// Update dialogue if provided
				if (dialogue !== undefined) {
					await tx.delete(npcDialogue).where(eq(npcDialogue.npcId, id))
					if (dialogue.length > 0) {
						await tx.insert(npcDialogue).values(
							dialogue.map((d) => ({
								npcId: id,
								topic: d.topic,
								response: d.response,
								condition: d.condition,
							})),
						)
					}
				}

				// Update areas and districts if needed
			})
		} catch (error) {
			console.error("Error updating NPC:", error)
			throw error
		}
	}

	const deleteFn = async (id: number): Promise<void> => {
		try {
			await db.transaction(async (tx) => {
				// With cascade delete on schema, we can just delete the main record
				await tx.delete(npcs).where(eq(npcs.id, id))
			})
		} catch (error) {
			console.error("Error deleting NPC:", error)
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
