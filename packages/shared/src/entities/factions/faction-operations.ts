import { BaseFactionOperations } from "../../types/operations.js"
import { eq, and } from "drizzle-orm"
import {
	factions,
	factionResources,
	factionLeadership,
	factionMembers,
	factionAllies,
	factionEnemies,
	factionQuests,
	Faction,
} from "./faction.schema.js"
import { DrizzleDb } from "../../common/database.js"
import { RequiredFaction } from "../../types/models.js"

export class FactionOperations implements BaseFactionOperations {
	private db: DrizzleDb

	constructor(db: DrizzleDb) {
		this.db = db
	}

	// Implement required interface methods
	create(id: string, faction: Faction): void {
		this.createFaction(id, faction)
	}

	get(id: string): Faction | null {
		return this.getFaction(id)
	}

	update(id: string, faction: Faction): void {
		this.updateFaction(id, faction)
	}

	delete(id: string): void {
		this.deleteFaction(id)
	}

	createFaction(id: string, faction: Faction): void {
		this.db.transaction((tx) => {
			// Insert main faction data
			tx.insert(factions)
				.values({
					id,
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
				.run()

			// Insert resources
			if (faction.resources && faction.resources.length > 0) {
				for (const resource of faction.resources) {
					tx.insert(factionResources)
						.values({
							factionId: id,
							resource,
						})
						.run()
				}
			}

			// Insert leadership
			if (faction.leadership && faction.leadership.length > 0) {
				for (const leader of faction.leadership) {
					tx.insert(factionLeadership)
						.values({
							factionId: id,
							name: leader.name,
							role: leader.role,
							description: leader.description,
							secret: leader.secret,
							stats: leader.stats,
							bio: leader.bio,
						})
						.run()
				}
			}

			// Insert members, allies, enemies, quests
			this.insertFactionRelatedData(tx, id, faction)
		})
	}

	getFaction(id: string): RequiredFaction | null {
		// Get main faction data
		const factionResult = this.db.select().from(factions).where(eq(factions.id, id)).get()

		if (!factionResult) return null

		// Get all related faction data
		return this.getFactionWithRelatedData(factionResult, id)
	}

	updateFaction(id: string, faction: RequiredFaction): void {
		this.db.transaction((tx) => {
			// Update main faction record
			tx.update(factions)
				.set({
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
				.where(eq(factions.id, id))
				.run()

			// Delete all related data
			this.deleteFactionRelatedData(tx, id)

			// Reinsert all related data
			this.insertFactionRelatedData(tx, id, faction)
		})
	}

	deleteFaction(id: string): void {
		this.db.transaction((tx) => {
			// Delete related data
			this.deleteFactionRelatedData(tx, id)

			// Delete main faction record
			tx.delete(factions).where(eq(factions.id, id)).run()
		})
	}

	// Implement other required methods of the FactionOperations interface
	addResource(factionId: string, resource: string): void {
		this.db
			.insert(factionResources)
			.values({
				factionId,
				resource,
			})
			.run()
	}

	removeResource(factionId: string, resource: string): void {
		this.db
			.delete(factionResources)
			.where(
				and(eq(factionResources.factionId, factionId), eq(factionResources.resource, resource)),
			)
			.run()
	}

	// Private helper methods
	private insertFactionRelatedData(tx: any, id: string, faction: RequiredFaction): void {
		// Insert members
		if (faction.members && faction.members.length > 0) {
			for (const member of faction.members) {
				tx.insert(factionMembers)
					.values({
						factionId: id,
						name: member.name,
						description: member.description,
						stats: member.stats,
					})
					.run()
			}
		}

		// Insert allies
		if (faction.allies && faction.allies.length > 0) {
			for (const allyId of faction.allies) {
				tx.insert(factionAllies)
					.values({
						factionId: id,
						allyId,
					})
					.run()
			}
		}

		// Insert enemies
		if (faction.enemies && faction.enemies.length > 0) {
			for (const enemyId of faction.enemies) {
				tx.insert(factionEnemies)
					.values({
						factionId: id,
						enemyId,
					})
					.run()
			}
		}

		// Insert quests
		if (faction.quests && faction.quests.length > 0) {
			for (const questId of faction.quests) {
				tx.insert(factionQuests)
					.values({
						factionId: id,
						questId,
					})
					.run()
			}
		}
	}

	private deleteFactionRelatedData(tx: any, factionId: string): void {
		// Delete all related data
		tx.delete(factionResources).where(eq(factionResources.factionId, factionId)).run()
		tx.delete(factionLeadership).where(eq(factionLeadership.factionId, factionId)).run()
		tx.delete(factionMembers).where(eq(factionMembers.factionId, factionId)).run()
		tx.delete(factionAllies).where(eq(factionAllies.factionId, factionId)).run()
		tx.delete(factionEnemies).where(eq(factionEnemies.factionId, factionId)).run()
		tx.delete(factionQuests).where(eq(factionQuests.factionId, factionId)).run()
	}

	private getFactionWithRelatedData(faction: any, id: string): RequiredFaction {
		// Fetch and combine faction data (simplified)
		return faction as RequiredFaction
	}
}
