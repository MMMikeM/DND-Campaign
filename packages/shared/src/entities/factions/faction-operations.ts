import { eq } from "drizzle-orm"
import {
	factions,
	factionResources,
	factionLeadership,
	factionMembers,
	factionAllies,
	factionEnemies,
	factionQuests,
	factionNpcs,
	factionLocations,
} from "./faction.schema.js"
import type { DrizzleDb } from "../../index.js"
import type { NewFaction, UpdateFaction } from "./faction.zod.js"

export const createFactionOperations = (db: DrizzleDb) => {
	const create = async (newFaction: NewFaction): Promise<number> => {
		try {
			return await db.transaction(async (tx) => {
				// Insert main faction data
				const result = await tx
					.insert(factions)
					.values({
						name: newFaction.name,
						type: newFaction.type,
						alignment: newFaction.alignment,
						description: newFaction.description,
						publicGoal: newFaction.publicGoal,
						trueGoal: newFaction.trueGoal,
						headquarters: newFaction.headquarters,
						territory: newFaction.territory,
						history: newFaction.history,
						notes: newFaction.notes,
					})
					.returning({ id: factions.id })

				const factionId = result[0].id

				// Insert resources
				if (newFaction.resources?.length) {
					await tx.insert(factionResources).values(
						newFaction.resources.map((resource) => ({
							factionId,
							resource: resource.resource,
						})),
					)
				}

				// Insert leadership
				if (newFaction.leadership?.length) {
					await tx.insert(factionLeadership).values(
						newFaction.leadership.map((leader) => ({
							factionId,
							name: leader.name,
							role: leader.role,
							description: leader.description,
							secret: leader.secret,
							stats: leader.stats,
							bio: leader.bio,
						})),
					)
				}

				// Insert members
				if (newFaction.members?.length) {
					await tx.insert(factionMembers).values(
						newFaction.members.map((member) => ({
							factionId,
							name: member.name,
							description: member.description,
							stats: member.stats,
						})),
					)
				}

				// Insert allies
				if (newFaction.allies?.length) {
					await tx.insert(factionAllies).values(
						newFaction.allies.map((ally) => ({
							factionId,
							allyId: ally.allyId,
							relationship: ally.relationship,
							notes: ally.notes,
						})),
					)
				}

				// Insert enemies
				if (newFaction.enemies?.length) {
					await tx.insert(factionEnemies).values(
						newFaction.enemies.map((enemy) => ({
							factionId,
							enemyId: enemy.enemyId,
							conflict: enemy.conflict,
							severity: enemy.severity,
						})),
					)
				}

				// Insert quests
				if (newFaction.quests?.length) {
					await tx.insert(factionQuests).values(
						newFaction.quests.map((quest) => ({
							factionId,
							questId: quest.questId,
							importance: quest.importance,
						})),
					)
				}

				// Insert NPCs
				if (newFaction.npcs?.length) {
					await tx.insert(factionNpcs).values(
						newFaction.npcs.map((npc) => ({
							factionId,
							npcId: npc.npcId,
							role: npc.role,
							status: npc.status,
						})),
					)
				}

				// Insert locations
				if (newFaction.locations?.length) {
					await tx.insert(factionLocations).values(
						newFaction.locations.map((location) => ({
							factionId,
							locationId: location.locationId,
							controlLevel: location.controlLevel,
							purpose: location.purpose,
						})),
					)
				}

				return factionId
			})
		} catch (error) {
			console.error("Error creating faction:", error)
			throw error
		}
	}

	const get = async (id: number) => {
		try {
			// Perform left joins to get all related data
			const result = await db
				.select()
				.from(factions)
				.leftJoin(factionResources, eq(factionResources.factionId, factions.id))
				.leftJoin(factionLeadership, eq(factionLeadership.factionId, factions.id))
				.leftJoin(factionMembers, eq(factionMembers.factionId, factions.id))
				.leftJoin(factionAllies, eq(factionAllies.factionId, factions.id))
				.leftJoin(factionEnemies, eq(factionEnemies.factionId, factions.id))
				.leftJoin(factionQuests, eq(factionQuests.factionId, factions.id))
				.leftJoin(factionNpcs, eq(factionNpcs.factionId, factions.id))
				.leftJoin(factionLocations, eq(factionLocations.factionId, factions.id))
				.where(eq(factions.id, id))
				.all()

			// Return the raw join results as requested
			return result
		} catch (error) {
			console.error("Error retrieving faction:", error)
			throw error
		}
	}

	const update = async (id: number, partialFaction: UpdateFaction): Promise<void> => {
		try {
			await db.transaction(async (tx) => {
				// Extract the base faction fields from partialFaction
				const {
					resources,
					leadership,
					members,
					allies,
					enemies,
					quests,
					npcs,
					locations,
					...factionFields
				} = partialFaction

				// Update main faction record if there are fields to update
				if (Object.keys(factionFields).length > 0) {
					await tx.update(factions).set(factionFields).where(eq(factions.id, id))
				}

				// Update resources if provided
				if (resources !== undefined) {
					await tx.delete(factionResources).where(eq(factionResources.factionId, id))
					if (resources.length > 0) {
						await tx.insert(factionResources).values(
							resources.map((resource) => ({
								factionId: id,
								resource: resource.resource,
							})),
						)
					}
				}

				// Update leadership if provided
				if (leadership !== undefined) {
					await tx.delete(factionLeadership).where(eq(factionLeadership.factionId, id))
					if (leadership.length > 0) {
						await tx.insert(factionLeadership).values(
							leadership.map((leader) => ({
								factionId: id,
								name: leader.name,
								role: leader.role,
								description: leader.description,
								secret: leader.secret,
								stats: leader.stats,
								bio: leader.bio,
							})),
						)
					}
				}

				// Update members if provided
				if (members !== undefined) {
					await tx.delete(factionMembers).where(eq(factionMembers.factionId, id))
					if (members.length > 0) {
						await tx.insert(factionMembers).values(
							members.map((member) => ({
								factionId: id,
								name: member.name,
								description: member.description,
								stats: member.stats,
							})),
						)
					}
				}

				// Update allies if provided
				if (allies !== undefined) {
					await tx.delete(factionAllies).where(eq(factionAllies.factionId, id))
					if (allies.length > 0) {
						await tx.insert(factionAllies).values(
							allies.map((ally) => ({
								factionId: id,
								allyId: ally.allyId,
								relationship: ally.relationship,
								notes: ally.notes,
							})),
						)
					}
				}

				// Update enemies if provided
				if (enemies !== undefined) {
					await tx.delete(factionEnemies).where(eq(factionEnemies.factionId, id))
					if (enemies.length > 0) {
						await tx.insert(factionEnemies).values(
							enemies.map((enemy) => ({
								factionId: id,
								enemyId: enemy.enemyId,
								conflict: enemy.conflict,
								severity: enemy.severity,
							})),
						)
					}
				}

				// Update quests if provided
				if (quests !== undefined) {
					await tx.delete(factionQuests).where(eq(factionQuests.factionId, id))
					if (quests.length > 0) {
						await tx.insert(factionQuests).values(
							quests.map((quest) => ({
								factionId: id,
								questId: quest.questId,
								importance: quest.importance,
							})),
						)
					}
				}

				// Update npcs if provided
				if (npcs !== undefined) {
					await tx.delete(factionNpcs).where(eq(factionNpcs.factionId, id))
					if (npcs.length > 0) {
						await tx.insert(factionNpcs).values(
							npcs.map((npc) => ({
								factionId: id,
								npcId: npc.npcId,
								role: npc.role,
								status: npc.status,
							})),
						)
					}
				}

				// Update locations if provided
				if (locations !== undefined) {
					await tx.delete(factionLocations).where(eq(factionLocations.factionId, id))
					if (locations.length > 0) {
						await tx.insert(factionLocations).values(
							locations.map((location) => ({
								factionId: id,
								locationId: location.locationId,
								controlLevel: location.controlLevel,
								purpose: location.purpose,
							})),
						)
					}
				}
			})
		} catch (error) {
			console.error("Error updating faction:", error)
			throw error
		}
	}

	const deleteFn = async (id: number): Promise<void> => {
		try {
			await db.transaction(async (tx) => {
				// With cascade delete configured in schema, we can just delete the main record
				await tx.delete(factions).where(eq(factions.id, id))
			})
		} catch (error) {
			console.error("Error deleting faction:", error)
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
