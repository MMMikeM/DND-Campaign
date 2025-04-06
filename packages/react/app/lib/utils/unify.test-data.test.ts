import { describe, it, expect } from "vitest"
import { unifyRelations } from "./unify"
import { unifyTestData } from "./addSlugs.test.data"

describe("unifyRelations with real data", () => {
	it("should correctly transform relations from incomingRelations and outgoingRelations", () => {
		// This is the issue case where it returns 'never' type
		const unified = unifyRelations(unifyTestData)
			.from({ property: "incomingRelations", key: "sourceRegion" })
			.with({ property: "outgoingRelations", key: "targetRegion" })
			.to({ property: "relations", key: "region" })

		// Verify basic structure is preserved
		expect(unified.id).toBe(unifyTestData.id)
		expect(unified.name).toBe(unifyTestData.name)

		// Check that the relations array is created
		expect(Array.isArray(unified.relations)).toBe(true)

		// Check the transformation worked for the outgoing relation
		expect(unified.relations.length).toBe(1) // There's one outgoing relation in the data

		const [relation] = unified.relations

		// Verify we can access properties on the relation
		expect(relation.id).toBe(1)
		expect(relation.description).toEqual([
			"The border between Paphos and the Akamas Peninsula is heavily patrolled by the Paphos City Guard",
			"Several watchtowers monitor activity in the peninsula",
			"Refugees fleeing through this area are quarantined and checked for corruption",
			"Occasional skirmishes occur when creatures from Akamas venture too close to Paphos",
			"Several small farming communities exist in this buffer zone, heavily fortified",
		])
		expect(relation.region).toBe(unifyTestData.outgoingRelations[0].targetRegion)

		// Check that connections were preserved
		expect(relation.connections).toBeDefined()
		expect(relation.connections.length).toBe(1)
		expect(relation.connections[0].id).toBe(1)

		// The relation property doesn't exist in the transformed data
		// The keys get renamed as part of the transformation
		expect(relation.regionId).toBe(1)
		expect(relation.otherRegionId).toBe(2)
		expect(relation.relationType).toBe("defensive border")
	})
})
