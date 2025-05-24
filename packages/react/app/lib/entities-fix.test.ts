import { describe, expect, it } from "vitest"
import { unifyRelations } from "./unify"

// Define the outgoing relation type for testing
interface OutgoingRelation {
	id: number
	description: string[]
	creativePrompts: string[]
	regionId: number
	otherRegionId: number
	relationType: string
	targetRegion: number
	connections: Array<{
		id: number
		description: string[]
		creativePrompts: string[]
		relation: {
			id: number
			sourceRegion: { name: string }
			targetRegion: { name: string }
		}
	}>
}

// Define the type for transformed relation
interface TransformedOutgoingRelation {
	id: number
	description: string[]
	creativePrompts: string[]
	regionId: number
	otherRegionId: number
	relationType: string
	region: number
	connections: Array<{
		id: number
		description: string[]
		creativePrompts: string[]
		relation: {
			id: number
			sourceRegion: { name: string }
			targetRegion: { name: string }
		}
	}>
}

describe("unifyRelations in entities.ts", () => {
	it("should correctly handle the region relationship case", () => {
		// Sample data similar to what's in entities.ts
		const byId = {
			id: 1,
			name: "Region Name",
			incomingRelations: [
				{
					id: 101,
					description: ["Incoming relation description"],
					creativePrompts: ["Prompt 1"],
					regionId: 1,
					otherRegionId: 2,
					relationType: "connected",
					sourceRegion: 2,
				},
			],
			outgoingRelations: [
				{
					id: 201,
					description: ["Outgoing relation description"],
					creativePrompts: ["Prompt 2"],
					regionId: 1,
					otherRegionId: 3,
					relationType: "connected",
					targetRegion: 3,
					connections: [
						{
							id: 301,
							description: ["Connection description"],
							creativePrompts: ["Connection prompt"],
							relation: {
								id: 201,
								sourceRegion: { name: "Source" },
								targetRegion: { name: "Target" },
							},
						},
					],
				} as OutgoingRelation,
			],
		}

		// This is the exact code that was failing in entities.ts
		const unified = unifyRelations(byId)
			.from({ property: "incomingRelations", key: "sourceRegion" })
			.with({ property: "outgoingRelations", key: "targetRegion" })
			.to({ property: "relations", key: "region" })

		// Test the basic unification worked
		expect(unified.relations).toBeDefined()
		expect(unified.relations.length).toBe(2) // Both incoming and outgoing relations

		// Get the relations and sort them by ID
		const relations = [...unified.relations].sort((a, b) => a.id - b.id)

		// Verify we can access properties on the incoming relation
		const incomingRelation = relations[0]
		expect(incomingRelation).toBeDefined()
		expect(incomingRelation.id).toBe(101)
		expect(incomingRelation.description).toEqual(["Incoming relation description"])
		expect(incomingRelation.region).toBe(2) // The sourceRegion becomes region

		// Verify we can access properties on the outgoing relation
		// Use a type assertion to help TypeScript understand the relation has connections
		const outgoingRelation = relations[1] as TransformedOutgoingRelation
		expect(outgoingRelation).toBeDefined()
		expect(outgoingRelation.id).toBe(201)
		expect(outgoingRelation.description).toEqual(["Outgoing relation description"])
		expect(outgoingRelation.region).toBe(3) // The targetRegion becomes region

		// Verify connections are preserved on the outgoing relation
		expect(outgoingRelation.connections).toBeDefined()
		expect(outgoingRelation.connections.length).toBe(1)
		expect(outgoingRelation.connections[0].id).toBe(301)

		// Confirm the relation.relation is preserved
		expect(outgoingRelation.connections[0].relation).toBeDefined()
		expect(outgoingRelation.connections[0].relation.id).toBe(201)
		expect(outgoingRelation.connections[0].relation.sourceRegion).toBeDefined()
		expect(outgoingRelation.connections[0].relation.sourceRegion.name).toBe("Source")
		expect(outgoingRelation.connections[0].relation.targetRegion).toBeDefined()
		expect(outgoingRelation.connections[0].relation.targetRegion.name).toBe("Target")
	})
})
