import { describe, expectTypeOf, test } from "vitest"
import { unifyRelations } from "./unify"
import { unifyTestData } from "./addSlugs.test.data"

describe("unifyRelations types with real data", () => {
	test("correctly infers types from real-world region data", () => {
		const unified = unifyRelations(unifyTestData)
			.from({ property: "incomingRelations", key: "sourceRegion" })
			.with({ property: "outgoingRelations", key: "targetRegion" })
			.to({ property: "relations", key: "region" })

		// Check that the original properties are preserved
		expectTypeOf(unified).toHaveProperty("id")
		expectTypeOf(unified.id).toBeNumber()
		expectTypeOf(unified).toHaveProperty("name")
		expectTypeOf(unified.name).toBeString()

		// Check source properties were removed
		// @ts-expect-error - incomingRelations should be removed
		unified.incomingRelations
		// @ts-expect-error - outgoingRelations should be removed
		unified.outgoingRelations

		// Check that relations array exists and has the correct type
		expectTypeOf(unified).toHaveProperty("relations")
		expectTypeOf(unified.relations).toBeArray()

		// Verify relation properties can be accessed and have correct types
		if (unified.relations.length > 0) {
			const relation = unified.relations[0]

			// Check common properties
			expectTypeOf(relation).toHaveProperty("id")
			expectTypeOf(relation.id).toBeNumber()
			expectTypeOf(relation).toHaveProperty("description")
			expectTypeOf(relation.description).toBeArray()
			expectTypeOf(relation.description[0]).toBeString()
			expectTypeOf(relation).toHaveProperty("creativePrompts")
			expectTypeOf(relation.creativePrompts).toBeArray()

			// Check the renamed key property
			expectTypeOf(relation).toHaveProperty("region")
			expectTypeOf(relation.region).toBeNumber()

			// Check other important properties from the real data
			expectTypeOf(relation).toHaveProperty("regionId")
			expectTypeOf(relation.regionId).toBeNumber()
			expectTypeOf(relation).toHaveProperty("otherRegionId")
			expectTypeOf(relation.otherRegionId).toBeNumber()
			expectTypeOf(relation).toHaveProperty("relationType")
			expectTypeOf(relation.relationType).toBeString()

			// Check for nested complex properties
			expectTypeOf(relation).toHaveProperty("connections")
			expectTypeOf(relation.connections).toBeArray()

			if (relation.connections && relation.connections.length > 0) {
				const connection = relation.connections[0]
				expectTypeOf(connection).toHaveProperty("id")
				expectTypeOf(connection.id).toBeNumber()
				expectTypeOf(connection).toHaveProperty("relationId")
				expectTypeOf(connection.relationId).toBeNumber()

				// Check for deep nested properties to ensure type inference works
				expectTypeOf(connection).toHaveProperty("relation")
				if (connection.relation) {
					expectTypeOf(connection.relation).toHaveProperty("id")
					expectTypeOf(connection.relation.id).toBeNumber()

					// The original object has sourceRegion and targetRegion nested objects
					if ("sourceRegion" in connection.relation) {
						expectTypeOf(connection.relation.sourceRegion).toHaveProperty("name")
						expectTypeOf(connection.relation.sourceRegion.name).toBeString()
					}

					if ("targetRegion" in connection.relation) {
						expectTypeOf(connection.relation.targetRegion).toHaveProperty("name")
						expectTypeOf(connection.relation.targetRegion.name).toBeString()
					}
				}
			}
		}
	})
})
