import { describe, expectTypeOf, test } from "vitest"
import { unifyRelations } from "./unify"

describe("unifyRelations types", () => {
	test("single source transformation preserves types correctly", () => {
		type InputType = {
			id: number
			name: string
			children: Array<{
				id: number
				childId: string
				name: string
				age: number
			}>
		}

		const input: InputType = {
			id: 1,
			name: "Example",
			children: [
				{ id: 101, childId: "child1", name: "First Child", age: 10 },
				{ id: 102, childId: "child2", name: "Second Child", age: 8 },
			],
		}

		const result = unifyRelations(input)
			.from({ property: "children", key: "childId" })
			.to({ property: "relatives", key: "relativeId" })

		// Verify the original structure is preserved except the source property
		expectTypeOf(result).toHaveProperty("id")
		expectTypeOf(result.id).toBeNumber()
		expectTypeOf(result).toHaveProperty("name")
		expectTypeOf(result.name).toBeString()

		// Verify the children property is removed
		// @ts-expect-error - property 'children' should not exist on transformed object
		result.children

		// Verify the new property exists with the correct type
		expectTypeOf(result).toHaveProperty("relatives")
		expectTypeOf(result.relatives).toBeArray()

		// Verify the transformed item structure
		if (result.relatives.length > 0) {
			const firstItem = result.relatives[0]
			expectTypeOf(firstItem).toHaveProperty("id")
			expectTypeOf(firstItem.id).toBeNumber()
			expectTypeOf(firstItem).toHaveProperty("name")
			expectTypeOf(firstItem.name).toBeString()
			expectTypeOf(firstItem).toHaveProperty("age")
			expectTypeOf(firstItem.age).toBeNumber()
			expectTypeOf(firstItem).toHaveProperty("relativeId")
			expectTypeOf(firstItem.relativeId).toBeString()

			// Verify the original key is removed
			// @ts-expect-error - property 'childId' should not exist on transformed item
			firstItem.childId
		}
	})

	test("multiple source transformation with correct union types", () => {
		type InputType = {
			id: number
			name: string
			incomingRelations: Array<{
				id: number
				sourceRegion: string
				description: string
				type: "incoming"
			}>
			outgoingRelations: Array<{
				id: number
				targetRegion: string
				description: string
				priority: number
				type: "outgoing"
			}>
		}

		const input: InputType = {
			id: 1,
			name: "Example",
			incomingRelations: [{ id: 201, sourceRegion: "region1", description: "Incoming 1", type: "incoming" }],
			outgoingRelations: [
				{ id: 301, targetRegion: "region2", description: "Outgoing 1", priority: 1, type: "outgoing" },
			],
		}

		const result = unifyRelations(input)
			.from({ property: "incomingRelations", key: "sourceRegion" })
			.with({ property: "outgoingRelations", key: "targetRegion" })
			.to({ property: "relations", key: "region" })

		// Verify the original structure is preserved except the source properties
		expectTypeOf(result).toHaveProperty("id")
		expectTypeOf(result.id).toBeNumber()
		expectTypeOf(result).toHaveProperty("name")
		expectTypeOf(result.name).toBeString()

		// Verify the source properties are removed
		// @ts-expect-error - property 'incomingRelations' should not exist on transformed object
		result.incomingRelations
		// @ts-expect-error - property 'outgoingRelations' should not exist on transformed object
		result.outgoingRelations

		// Verify the new property exists with the correct type
		expectTypeOf(result).toHaveProperty("relations")
		expectTypeOf(result.relations).toBeArray()

		// Test the case with incoming relation properties
		if (result.relations.length > 0) {
			const relation = result.relations[0]

			// Common properties
			expectTypeOf(relation).toHaveProperty("id")
			expectTypeOf(relation.id).toBeNumber()
			expectTypeOf(relation).toHaveProperty("description")
			expectTypeOf(relation.description).toBeString()
			expectTypeOf(relation).toHaveProperty("region")
			expectTypeOf(relation.region).toBeString()

			// Type discrimination using "type" property
			if ("type" in relation && relation.type === "incoming") {
				expectTypeOf(relation.type).toEqualTypeOf<"incoming">()

				// @ts-expect-error - 'priority' should not exist on incoming relation
				relation.priority
			}

			// For relations with type 'outgoing'
			if ("type" in relation && relation.type === "outgoing") {
				expectTypeOf(relation.type).toEqualTypeOf<"outgoing">()
				expectTypeOf(relation).toHaveProperty("priority")
				expectTypeOf(relation.priority).toBeNumber()
			}

			// Original keys should not exist
			// @ts-expect-error - property 'sourceRegion' should not exist on transformed item
			relation.sourceRegion
			// @ts-expect-error - property 'targetRegion' should not exist on transformed item
			relation.targetRegion
		}
	})

	test("triple source transformation has correct types", () => {
		type InputType = {
			id: number
			source1: Array<{ id: number; key1: string; common: string; unique1: boolean }>
			source2: Array<{ id: number; key2: number; common: string; unique2: string[] }>
			source3: Array<{ id: number; key3: boolean; common: string; unique3: Date }>
		}

		const input: InputType = {
			id: 1,
			source1: [{ id: 101, key1: "string key", common: "common1", unique1: true }],
			source2: [{ id: 201, key2: 42, common: "common2", unique2: ["array"] }],
			source3: [{ id: 301, key3: false, common: "common3", unique3: new Date() }],
		}

		const result = unifyRelations(input)
			.from({ property: "source1", key: "key1" })
			.with({ property: "source2", key: "key2" })
			.with({ property: "source3", key: "key3" })
			.to({ property: "unified", key: "newKey" })

		// Check basic structure
		expectTypeOf(result).toHaveProperty("id")
		expectTypeOf(result).toHaveProperty("unified")
		expectTypeOf(result.unified).toBeArray()

		// Original source properties should be removed
		// @ts-expect-error - source1 should not exist
		result.source1
		// @ts-expect-error - source2 should not exist
		result.source2
		// @ts-expect-error - source3 should not exist
		result.source3

		// Get the type of the unified items for testing
		type UnifiedItem = (typeof result.unified)[number]

		// Test union type properties
		if (result.unified.length > 0) {
			const item = result.unified[0]

			// Common properties
			expectTypeOf(item).toHaveProperty("id")
			expectTypeOf(item.id).toBeNumber()
			expectTypeOf(item).toHaveProperty("common")
			expectTypeOf(item.common).toBeString()
			expectTypeOf(item).toHaveProperty("newKey")

			// Check property existence for type discrimination
			if ("unique1" in item) {
				expectTypeOf(item.unique1).toBeBoolean()
				// @ts-expect-error - unique2 should not exist when unique1 exists
				item.unique2
				// @ts-expect-error - unique3 should not exist when unique1 exists
				item.unique3
			}

			if ("unique2" in item) {
				expectTypeOf(item.unique2).toBeArray()
				// @ts-expect-error - unique1 should not exist when unique2 exists
				item.unique1
				// @ts-expect-error - unique3 should not exist when unique2 exists
				item.unique3
			}

			if ("unique3" in item) {
				// Using type predicate to narrow type
				const isDate = (obj: unknown): obj is Date => obj instanceof Date

				// Check that unique3 can hold a Date object
				if (isDate(item.unique3)) {
					// This should compile if the type is correct
					const date: Date = item.unique3
				}

				// @ts-expect-error - unique1 should not exist when unique3 exists
				item.unique1
				// @ts-expect-error - unique2 should not exist when unique3 exists
				item.unique2
			}
		}
	})

	test("the real world region example works correctly", () => {
		type Region = {
			id: number
			name: string
			incomingRelations: Array<{
				id: number
				description: string[]
				creativePrompts: string[]
				regionId: number
				otherRegionId: number | null
				relationType: string
				sourceRegion: number
			}>
			outgoingRelations: Array<{
				id: number
				description: string[]
				creativePrompts: string[]
				regionId: number
				otherRegionId: number | null
				relationType: string
				targetRegion: number
			}>
		}

		const region: Region = {
			id: 1,
			name: "Test Region",
			incomingRelations: [
				{
					id: 101,
					description: ["Incoming relation"],
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
					description: ["Outgoing relation"],
					creativePrompts: ["Prompt 2"],
					regionId: 1,
					otherRegionId: 3,
					relationType: "connected",
					targetRegion: 3,
				},
			],
		}

		const unified = unifyRelations(region)
			.from({ property: "incomingRelations", key: "sourceRegion" })
			.with({ property: "outgoingRelations", key: "targetRegion" })
			.to({ property: "relations", key: "region" })

		// Check structure
		expectTypeOf(unified).toHaveProperty("id")
		expectTypeOf(unified).toHaveProperty("name")
		expectTypeOf(unified).toHaveProperty("relations")

		// Source properties should be removed
		// @ts-expect-error - incomingRelations should not exist
		unified.incomingRelations
		// @ts-expect-error - outgoingRelations should not exist
		unified.outgoingRelations

		// Check the relations array type
		expectTypeOf(unified.relations).toBeArray()

		if (unified.relations.length > 0) {
			const relation = unified.relations[0]

			// Common properties that should exist
			expectTypeOf(relation).toHaveProperty("id")
			expectTypeOf(relation.id).toBeNumber()
			expectTypeOf(relation).toHaveProperty("description")
			expectTypeOf(relation.description).toBeArray()
			expectTypeOf(relation).toHaveProperty("creativePrompts")
			expectTypeOf(relation.creativePrompts).toBeArray()
			expectTypeOf(relation).toHaveProperty("regionId")
			expectTypeOf(relation.regionId).toBeNumber()
			expectTypeOf(relation).toHaveProperty("otherRegionId")
			expectTypeOf(relation.otherRegionId).toMatchTypeOf<number | null>()
			expectTypeOf(relation).toHaveProperty("relationType")
			expectTypeOf(relation.relationType).toBeString()
			expectTypeOf(relation).toHaveProperty("region")
			expectTypeOf(relation.region).toBeNumber()

			// Original keys should not exist
			// @ts-expect-error - sourceRegion should not exist
			relation.sourceRegion
			// @ts-expect-error - targetRegion should not exist
			relation.targetRegion
		}
	})
})

// Test with simple relation objects
const simpleEntity = {
	id: 1,
	name: "Test Entity",
	incomingRelations: [
		{
			id: 101,
			description: ["Description 1"],
			sourceKey: "source-1",
		},
	],
	outgoingRelations: [
		{
			id: 201,
			description: ["Description 2"],
			targetKey: "target-1",
			connections: [{ id: 301, name: "Connection 1" }],
		},
	],
}

// Unify the relations
const unifiedSimple = unifyRelations(simpleEntity)
	.from({ property: "incomingRelations", key: "sourceKey" })
	.with({ property: "outgoingRelations", key: "targetKey" })
	.to({ property: "relations", key: "relatedKey" })

// Test that the unified property exists with the right type
expectTypeOf(unifiedSimple).toMatchTypeOf<{
	id: number
	name: string
	relations: (
		| { id: number; description: string[]; relatedKey: string }
		| { id: number; description: string[]; relatedKey: string; connections: { id: number; name: string }[] }
	)[]
}>()

// Test that we can access specific properties on a relation
// This checks that the type system properly preserves all properties
if (unifiedSimple.relations.length > 0) {
	const relation = unifiedSimple.relations[0]
	expectTypeOf(relation.id).toBeNumber()
	expectTypeOf(relation.description).toMatchTypeOf<string[]>()
	expectTypeOf(relation.relatedKey).toBeString()

	// Check for connections on outgoing relations (may not exist on all relations)
	if ("connections" in relation) {
		expectTypeOf(relation.connections).toBeArray()
		if (relation.connections.length > 0) {
			expectTypeOf(relation.connections[0].id).toBeNumber()
			expectTypeOf(relation.connections[0].name).toBeString()
		}
	}
}

// Test with complex nested objects
const complexEntity = {
	id: 1,
	name: "Complex Entity",
	incomingRelations: [
		{
			id: 101,
			description: ["Complex incoming"],
			sourceObject: { id: 11, name: "Source" },
		},
	],
	outgoingRelations: [
		{
			id: 201,
			description: ["Complex outgoing"],
			targetObject: { id: 21, name: "Target" },
			complexNested: {
				data: [1, 2, 3],
				metadata: { created: "2023-01-01" },
			},
		},
	],
}

// Unify the complex relations
const unifiedComplex = unifyRelations(complexEntity)
	.from({ property: "incomingRelations", key: "sourceObject" })
	.with({ property: "outgoingRelations", key: "targetObject" })
	.to({ property: "relations", key: "relatedObject" })

// Test that complex nested properties are preserved
if (unifiedComplex.relations.length > 0) {
	const relation = unifiedComplex.relations[0]
	expectTypeOf(relation.id).toBeNumber()
	expectTypeOf(relation.description).toMatchTypeOf<string[]>()
	expectTypeOf(relation.relatedObject).toMatchTypeOf<{ id: number; name: string }>()

	// Check for complex nested on outgoing relations
	if ("complexNested" in relation) {
		expectTypeOf(relation.complexNested).toMatchTypeOf<{ data: number[]; metadata: { created: string } }>()
		expectTypeOf(relation.complexNested.data).toBeArray()
		expectTypeOf(relation.complexNested.metadata.created).toBeString()
	}
}
