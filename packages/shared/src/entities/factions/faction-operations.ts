import type { Faction } from "./faction.schema.js"
import type { DrizzleDb } from "@tome-keeper/shared/common/database.js"
import { eq } from "drizzle-orm"
import {
	factions,
	factionResources,
	factionLeadership,
	factionMembers,
	factionAllies,
	factionEnemies,
	factionQuests,
} from "./faction.schema.js"

export const createFactionOperations = (db: DrizzleDb) => {
	const create = (faction: Faction): void => {
		db.transaction((tx) => {
			// Insert main faction data
			const result = tx
				.insert(factions)
				.values({
					name: faction.name,
					type: faction.type,
					alignment: faction.alignment,
					description: faction.description,
					publicGoal: faction.publicGoal,
					trueGoal: faction.trueGoal,
					headquarters: faction.headquarters,
					territory: faction.territory,
					history: faction.history,
					notes: faction.notes,
				})
				.returning({ id: factions.id })
				.get()

			const factionId = result.id

			// Insert resources
			if (faction.resources?.length) {
				tx.insert(factionResources)
					.values(
						faction.resources.map((resource) => ({
							factionId,
							resource,
						})),
					)
					.run()
			}

			// Insert leadership
			if (faction.leadership?.length) {
				tx.insert(factionLeadership)
					.values(
						faction.leadership.map((leader) => ({
							factionId,
							name: leader.name,
							role: leader.role,
							description: leader.description,
							secret: leader.secret,
							stats: leader.stats,
							bio: leader.bio,
						})),
					)
					.run()
			}

			// Insert members
			if (faction.members?.length) {
				tx.insert(factionMembers)
					.values(
						faction.members.map((member) => ({
							factionId,
							name: member.name,
							description: member.description,
							stats: member.stats,
						})),
					)
					.run()
			}

			// Insert allies
			if (faction.allies?.length) {
				tx.insert(factionAllies)
					.values(
						faction.allies.map((allyId) => ({
							factionId,
							allyId,
						})),
					)
					.run()
			}

			// Insert enemies
			if (faction.enemies?.length) {
				tx.insert(factionEnemies)
					.values(
						faction.enemies.map((enemyId) => ({
							factionId,
							enemyId,
						})),
					)
					.run()
			}

			// Insert quests
			if (faction.quests?.length) {
				tx.insert(factionQuests)
					.values(
						faction.quests.map((questId) => ({
							factionId,
							questId,
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
				faction: factions,
				resource: factionResources.resource,
				leadership: {
					name: factionLeadership.name,
					role: factionLeadership.role,
					description: factionLeadership.description,
					secret: factionLeadership.secret,
					stats: factionLeadership.stats,
					bio: factionLeadership.bio,
				},
				member: {
					name: factionMembers.name,
					description: factionMembers.description,
					stats: factionMembers.stats,
				},
				allyId: factionAllies.allyId,
				enemyId: factionEnemies.enemyId,
				questId: factionQuests.questId,
			})
			.from(factions)
			.leftJoin(factionResources, eq(factionResources.factionId, factions.id))
			.leftJoin(factionLeadership, eq(factionLeadership.factionId, factions.id))
			.leftJoin(factionMembers, eq(factionMembers.factionId, factions.id))
			.leftJoin(factionAllies, eq(factionAllies.factionId, factions.id))
			.leftJoin(factionEnemies, eq(factionEnemies.factionId, factions.id))
			.leftJoin(factionQuests, eq(factionQuests.factionId, factions.id))
			.where(eq(factions.id, id))
			.all()
	}

	const update = (id: number, partialFaction: Faction): void => {
		db.transaction((tx) => {
			// Extract the base faction fields from partialFaction
			const { resources, leadership, members, allies, enemies, quests, ...factionFields } =
				partialFaction

			// Update main faction record if there are fields to update
			if (Object.keys(factionFields).length > 0) {
				tx.update(factions).set(factionFields).where(eq(factions.id, id)).run()
			}

			// Update related data only if provided in the partial update

			// Update resources if provided
			if (resources !== undefined) {
				tx.delete(factionResources).where(eq(factionResources.factionId, id)).run()
				if (resources.length > 0) {
					tx.insert(factionResources)
						.values(
							resources.map((resource) => ({
								factionId: id,
								resource,
							})),
						)
						.run()
				}
			}

			// Update leadership if provided
			if (leadership !== undefined) {
				tx.delete(factionLeadership).where(eq(factionLeadership.factionId, id)).run()
				if (leadership.length > 0) {
					tx.insert(factionLeadership)
						.values(
							leadership.map((leader) => ({
								factionId: id,
								...leader,
							})),
						)
						.run()
				}
			}

			// Update members if provided
			if (members !== undefined) {
				tx.delete(factionMembers).where(eq(factionMembers.factionId, id)).run()
				if (members.length > 0) {
					tx.insert(factionMembers)
						.values(
							members.map((member) => ({
								factionId: id,
								...member,
							})),
						)
						.run()
				}
			}

			// Update allies if provided
			if (allies !== undefined) {
				tx.delete(factionAllies).where(eq(factionAllies.factionId, id)).run()
				if (allies.length > 0) {
					tx.insert(factionAllies)
						.values(
							allies.map((allyId) => ({
								factionId: id,
								allyId,
							})),
						)
						.run()
				}
			}

			// Update enemies if provided
			if (enemies !== undefined) {
				tx.delete(factionEnemies).where(eq(factionEnemies.factionId, id)).run()
				if (enemies.length > 0) {
					tx.insert(factionEnemies)
						.values(
							enemies.map((enemyId) => ({
								factionId: id,
								enemyId,
							})),
						)
						.run()
				}
			}

			// Update quests if provided
			if (quests !== undefined) {
				tx.delete(factionQuests).where(eq(factionQuests.factionId, id)).run()
				if (quests.length > 0) {
					tx.insert(factionQuests)
						.values(
							quests.map((questId) => ({
								factionId: id,
								questId,
							})),
						)
						.run()
				}
			}
		})
	}
	const deleteFn = (id: number): void => {
		db.delete(factions).where(eq(factions.id, id)).run()
	}

	return {
		create,
		get,
		update,
		delete: deleteFn,
	}
}
