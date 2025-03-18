import { eq, and } from "drizzle-orm"
import {
	npcs,
	npcDescriptions,
	npcPersonalityTraits,
	npcQuests,
	npcRelationships,
	npcLocations,
	npcInventory,
	Npc,
} from "./npc.schema.js"
import { BaseNPCOperations } from "../../types/operations.js"
import { DrizzleDb } from "../../common/database.js"

/**
 * Drizzle implementation of NPC operations
 */
export class NPCOperations implements BaseNPCOperations {
	private db: DrizzleDb

	constructor(db: DrizzleDb) {
		this.db = db
	}

	create(id: string, npc: Npc): void {
		this.db.transaction((tx) => {
			// Insert main NPC data
			tx.insert(npcs)
				.values({
					id: id,
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
				.run()

			// Insert descriptions
			if (npc.description && npc.description.length > 0) {
				for (const desc of npc.description) {
					tx.insert(npcDescriptions)
						.values({
							npcId: id,
							description: desc,
						})
						.run()
				}
			}

			// Insert personality traits
			if (npc.personality && npc.personality.length > 0) {
				for (const trait of npc.personality) {
					tx.insert(npcPersonalityTraits)
						.values({
							npcId: id,
							trait,
						})
						.run()
				}
			}

			// Insert relationships
			if (npc.relationships && npc.relationships.length > 0) {
				for (const relationship of npc.relationships) {
					tx.insert(npcRelationships)
						.values({
							npcId: id,
							targetId: relationship.id,
							description: relationship.description,
						})
						.run()
				}
			}

			// Insert related data
			this.insertNpcRelatedData(tx, id, npc)
		})
	}

	get(id: string): Npc | null {
		// Get main NPC data
		const npcResult = this.db.select().from(npcs).where(eq(npcs.id, id)).get()
		if (!npcResult) return null

		// Get all related NPC data
		return this.getNpcWithRelatedData(npcResult)
	}

	update(id: string, npc: Npc): void {
		this.db.transaction((tx) => {
			// Update main NPC record
			tx.update(npcs)
				.set({
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
				.where(eq(npcs.id, id))
				.run()

			// Delete all related data
			this.deleteNpcRelatedData(tx, id)

			// Reinsert all related data
			this.insertNpcRelatedData(tx, id, npc)
		})
	}

	delete(id: string): void {
		this.db.transaction((tx) => {
			// Delete related data
			this.deleteNpcRelatedData(tx, id)

			// Delete main NPC record
			tx.delete(npcs).where(eq(npcs.id, id)).run()
		})
	}

	// Private helper methods
	private insertNpcRelatedData(tx: any, id: string, npc: Npc): void {
		// Insert quests
		if (npc.quests && npc.quests.length > 0) {
			for (const quest of npc.quests) {
				tx.insert(npcQuests)
					.values({
						npcId: id,
						questId: quest.id,
						description: quest.description,
					})
					.run()
			}
		}

		// Insert locations
		if (npc.location && npc.location.length > 0) {
			for (const loc of npc.location) {
				tx.insert(npcLocations)
					.values({
						npcId: id,
						locationId: loc.id,
						description: loc.description,
					})
					.run()
			}
		}

		// Insert inventory items
		if (npc.inventory && npc.inventory.length > 0) {
			for (const item of npc.inventory) {
				tx.insert(npcInventory)
					.values({
						npcId: id,
						item,
					})
					.run()
			}
		}
	}

	private deleteNpcRelatedData(tx: any, id: string): void {
		tx.delete(npcDescriptions).where(eq(npcDescriptions.npcId, id)).run()
		tx.delete(npcPersonalityTraits).where(eq(npcPersonalityTraits.npcId, id)).run()
		tx.delete(npcQuests).where(eq(npcQuests.npcId, id)).run()
		tx.delete(npcRelationships).where(eq(npcRelationships.npcId, id)).run()
		tx.delete(npcLocations).where(eq(npcLocations.npcId, id)).run()
		tx.delete(npcInventory).where(eq(npcInventory.npcId, id)).run()
	}

	private getNpcWithRelatedData(npcResult: any): Npc {
		const id = npcResult.id

		// Get descriptions
		const description = this.db
			.select()
			.from(npcDescriptions)
			.where(eq(npcDescriptions.npcId, id))
			.all()
			.map((row) => row.description)

		// Get personality traits
		const personality = this.db
			.select()
			.from(npcPersonalityTraits)
			.where(eq(npcPersonalityTraits.npcId, id))
			.all()
			.map((row) => row.trait)

		// Get quests
		const quests = this.db
			.select()
			.from(npcQuests)
			.where(eq(npcQuests.npcId, id))
			.all()
			.map((row) => ({
				id: row.questId,
				description: row.description,
			}))

		// Get relationships
		const relationships = this.db
			.select()
			.from(npcRelationships)
			.where(eq(npcRelationships.npcId, id))
			.all()
			.map((row) => ({
				target_id: row.targetId,
				description: row.description,
			}))

		// Get locations
		const location = this.db
			.select()
			.from(npcLocations)
			.where(eq(npcLocations.npcId, id))
			.all()
			.map((row) => ({
				id: row.locationId,
				description: row.description,
			}))

		// Get inventory
		const inventory = this.db
			.select()
			.from(npcInventory)
			.where(eq(npcInventory.npcId, id))
			.all()
			.map((row) => row.item)

		// Construct and return the complete NPC object
		return {
			...npcResult,
			description,
			personality,
			quests,
			relationships,
			location,
			inventory,
		}
	}
}
