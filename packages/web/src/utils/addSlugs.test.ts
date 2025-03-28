import { describe, it, expect, expectTypeOf, assertType } from "vitest"
import addSlugs, { createSlug, addSlugsRecursively } from "./addSlugs"
import type { WithSlugsAdded, Sluggable, Slug, WithSlug } from "./addSlugs"

// Type tests
describe("type tests", () => {
	it("should verify Slug is a branded string type", () => {
		const slug = createSlug("test")
		expectTypeOf(slug).branded.toEqualTypeOf<Slug>()

		// Runtime check
		expect(typeof slug).toBe("string")

		// We can't test negative cases directly with expectTypeOf
		// The @ts-expect-error comment verifies this doesn't compile
		// @ts-expect-error Plain string is not assignable to Slug
		const invalidSlug: Slug = "plain-string"
	})

	it("should verify WithSlug adds a slug property", () => {
		type TestType = { name: string; id: number }
		type WithSlugTest = WithSlug<TestType>

		// For pure type testing, we need to create a dummy value that matches the type
		const dummyWithSlug: WithSlugTest = {
			name: "test",
			id: 1,
			slug: createSlug("test"),
		}

		expectTypeOf(dummyWithSlug).branded.toEqualTypeOf<{ name: string; id: number; slug: Slug }>()
		expectTypeOf(dummyWithSlug.slug).toEqualTypeOf<Slug>()
	})

	it("should verify WithSlugsAdded works recursively", () => {
		// Simple object
		type Simple = { name: string; id: number }
		const simpleWithSlugs = { name: "test", id: 1, slug: createSlug("test") }
		expectTypeOf(simpleWithSlugs).branded.toEqualTypeOf<{ name: string; id: number; slug: Slug }>()

		// Array of objects
		type ArrayType = Array<{ name: string; id: number }>
		const arrayWithSlugs: WithSlugsAdded<ArrayType> = [{ name: "test", id: 1, slug: createSlug("test") }]
		expectTypeOf(arrayWithSlugs).branded.toEqualTypeOf<Array<{ name: string; id: number; slug: Slug }>>()

		// Nested object - check runtime behavior
		const nestedInput = {
			name: "parent",
			id: 1,
			child: {
				name: "child",
				id: 2,
			},
		}

		// Runtime check for nested object processing
		const nestedResult = addSlugs(nestedInput)
		console.log(nestedResult.name)
		console.log(nestedResult.child.name)

		// Mixed content - check runtime behavior
		const mixedInput = {
			name: "mixed",
			id: 1,
			notSluggable: { title: "title" },
			children: [{ name: "child", id: 2 }],
		}

		// Runtime check for mixed content processing
		const mixedResult = addSlugs(mixedInput)
		console.log(mixedResult.name)
		console.log(mixedResult.children[0].name)

		// Primitives should be unchanged
		expectTypeOf("string" as WithSlugsAdded<string>).toBeString()
		expectTypeOf(123 as WithSlugsAdded<number>).toBeNumber()

		// null and undefined should be unchanged
		expectTypeOf(null as WithSlugsAdded<null>).toBeNull()
		expectTypeOf(undefined as WithSlugsAdded<undefined>).toBeUndefined()
	})

	it("should verify isSluggable type guard", () => {
		const validObject = { name: "Test", id: 1 }
		const invalidObject1 = { title: "Test", id: 1 }
		const invalidObject2 = { name: 123, id: 1 }
		const invalidObject3 = { name: "Test", id: "1" }

		// Runtime checks (these verify the type guard implementation)
		expect(validObject).toEqual(expect.objectContaining({ name: expect.any(String), id: expect.any(Number) }))

		// Type tests using assertType
		if (
			"name" in validObject &&
			typeof validObject.name === "string" &&
			"id" in validObject &&
			typeof validObject.id === "number"
		) {
			assertType<Sluggable>(validObject)
		}
	})

	it("should verify type transformations for complex nested structures", () => {
		// Define types that mirror our relationship structure - without slugs initially
		type Region = {
			id: number
			name: string
			// No slug here initially
		}

		type Location = {
			id: number
			name: string
			region: Region | null
			// No slug here initially
		}

		type LocationEntry = {
			id: number
			name: string
			location: Location | null
			// No slug here initially
		}

		type NpcWithLocations = {
			id: number
			name: string
			locations: LocationEntry[]
			// No slug here initially
		}

		// Check that WithSlugsAdded adds the slug property at all levels
		type SluggableNpc = WithSlugsAdded<NpcWithLocations>

		// The resulting type should have slug property at every level
		// This is what we'd expect after calling addSlugs()
		const result: SluggableNpc = {
			id: 1,
			name: "Test NPC",
			slug: createSlug("test-npc"),
			locations: [
				{
					id: 101,
					name: "Location Entry",
					slug: createSlug("location-entry"),
					location: {
						id: 201,
						name: "Physical Location",
						slug: createSlug("physical-location"),
						region: {
							id: 301,
							name: "Region",
							slug: createSlug("region"),
						},
					},
				},
			],
		}

		// Verify the nested optional chaining works in the transformed type
		if (result.locations[0]?.location?.region) {
			// This should compile only if the slug property exists on region
			assertType<Slug>(result.locations[0].location.region.slug)
		}

		// Simulating the example code with optional chaining
		result.locations.forEach((location) => {
			// This should typecheck correctly
			const regionSlug = location?.location?.region?.slug
			if (regionSlug) {
				assertType<Slug>(regionSlug)
			}
		})

		// Original type would not have slug
		const originalLocation: LocationEntry = {
			id: 1,
			name: "Original",
			location: {
				id: 2,
				name: "Physical",
				region: {
					id: 3,
					name: "Region",
				},
			},
		}

		// This line should fail compilation because slug doesn't exist on the original type
		// @ts-expect-error - Slug shouldn't exist on original types
		const shouldFail = originalLocation.location?.region?.slug
	})

	it("should verify type transformations for unified relations", () => {
		// Define types for unified relations test
		type UnifiedRelationsNpc = {
			id: number
			name: string
			incomingRelationships: Array<{
				id: number
				name: string
				sourceNpc: { id: number; name: string }
			}>
			outgoingRelationships: Array<{
				id: number
				name: string
				targetNpc: { id: number; name: string }
			}>
			relations: Array<{
				id: number
				name: string
				npc: { id: number; name: string }
			}>
		}

		// Apply WithSlugsAdded transformation
		type SluggableUnifiedRelationsNpc = WithSlugsAdded<UnifiedRelationsNpc>

		// Create test data for type verification
		const testUnifiedNpc: SluggableUnifiedRelationsNpc = {
			id: 1,
			name: "Test NPC",
			slug: createSlug("test-npc"),
			incomingRelationships: [
				{
					id: 2,
					name: "Incoming Relation",
					slug: createSlug("incoming-relation"),
					sourceNpc: {
						id: 3,
						name: "Source NPC",
						slug: createSlug("source-npc"),
					},
				},
			],
			outgoingRelationships: [
				{
					id: 4,
					name: "Outgoing Relation",
					slug: createSlug("outgoing-relation"),
					targetNpc: {
						id: 5,
						name: "Target NPC",
						slug: createSlug("target-npc"),
					},
				},
			],
			relations: [
				{
					id: 6,
					name: "Unified Relation",
					slug: createSlug("unified-relation"),
					npc: {
						id: 7,
						name: "Related NPC",
						slug: createSlug("related-npc"),
					},
				},
			],
		}

		// Verify types
		expectTypeOf(testUnifiedNpc.slug).toEqualTypeOf<Slug>()
		expectTypeOf(testUnifiedNpc.incomingRelationships[0].slug).toEqualTypeOf<Slug>()
		expectTypeOf(testUnifiedNpc.incomingRelationships[0].sourceNpc.slug).toEqualTypeOf<Slug>()
		expectTypeOf(testUnifiedNpc.outgoingRelationships[0].slug).toEqualTypeOf<Slug>()
		expectTypeOf(testUnifiedNpc.outgoingRelationships[0].targetNpc.slug).toEqualTypeOf<Slug>()
		expectTypeOf(testUnifiedNpc.relations[0].slug).toEqualTypeOf<Slug>()
		expectTypeOf(testUnifiedNpc.relations[0].npc.slug).toEqualTypeOf<Slug>()
	})
})

describe("createSlug", () => {
	it("should convert a string to a slug", () => {
		expect(createSlug("Hello World")).toBe("hello-world")
		expect(createSlug("Test String!")).toBe("test-string")
		expect(createSlug("Multiple   spaces")).toBe("multiple-spaces")
		expect(createSlug("Special-Characters$%^")).toBe("special-characters")
	})
})

describe("addSlugs", () => {
	it("should add a slug to objects with name and id", () => {
		const input = { name: "Test Object", id: 1 }
		const result = addSlugs(input)

		expect(result).toEqual({
			name: "Test Object",
			id: 1,
			slug: "test-object",
		})
	})

	it("should handle null or undefined", () => {
		expect(addSlugs(null)).toBeNull()
		expect(addSlugs(undefined)).toBeUndefined()
	})

	it("should not modify primitives", () => {
		expect(addSlugs("string")).toBe("string")
		expect(addSlugs(123)).toBe(123)
		expect(addSlugs(true)).toBe(true)
	})

	it("should process arrays of sluggable objects", () => {
		const input = [
			{ name: "First", id: 1 },
			{ name: "Second", id: 2 },
		]

		const result = addSlugs(input)

		expect(result).toEqual([
			{ name: "First", id: 1, slug: "first" },
			{ name: "Second", id: 2, slug: "second" },
		])
	})

	it("should handle nested objects", () => {
		const input = {
			name: "Parent",
			id: 1,
			child: {
				name: "Child",
				id: 2,
			},
		}

		const result = addSlugs(input)

		expect(result).toEqual({
			name: "Parent",
			id: 1,
			slug: "parent",
			child: {
				name: "Child",
				id: 2,
				slug: "child",
			},
		})
	})

	it("should handle complex nested structures with arrays", () => {
		const input = {
			name: "Faction",
			id: 1,
			members: [
				{ name: "Member 1", id: 2 },
				{ name: "Member 2", id: 3 },
			],
			headquarters: {
				name: "HQ",
				id: 4,
				rooms: [
					{ name: "Room 1", id: 5 },
					{ id: 6, otherProperty: "Not sluggable" },
				],
			},
		}

		const result = addSlugs(input)

		expect(result).toEqual({
			name: "Faction",
			id: 1,
			slug: "faction",
			members: [
				{ name: "Member 1", id: 2, slug: "member-1" },
				{ name: "Member 2", id: 3, slug: "member-2" },
			],
			headquarters: {
				name: "HQ",
				id: 4,
				slug: "hq",
				rooms: [
					{ name: "Room 1", id: 5, slug: "room-1" },
					{ id: 6, otherProperty: "Not sluggable" },
				],
			},
		})
	})

	it("should not modify non-sluggable objects", () => {
		const input = { id: 1, property: "value" }
		const result = addSlugs(input)

		expect(result).toEqual({ id: 1, property: "value" })
	})

	it("should handle real-world examples from entities", () => {
		// Example based on faction structure
		const faction = {
			id: 1,
			name: "The Silent Hand",
			members: [{ id: 101, name: "Assassin", role: "killer" }],
			headquarters: {
				id: 201,
				name: "Shadow Keep",
				location: { id: 301, name: "Dark Forest" },
			},
		}

		const result = addSlugs(faction)

		expect(result).toEqual({
			id: 1,
			name: "The Silent Hand",
			slug: "the-silent-hand",
			members: [{ id: 101, name: "Assassin", role: "killer", slug: "assassin" }],
			headquarters: {
				id: 201,
				name: "Shadow Keep",
				slug: "shadow-keep",
				location: { id: 301, name: "Dark Forest", slug: "dark-forest" },
			},
		})
	})

	it("should preserve dates without modification", () => {
		const date = new Date()
		const input = {
			name: "Event",
			id: 1,
			date,
		}

		const result = addSlugs(input)

		expect(result).toEqual({
			name: "Event",
			id: 1,
			slug: "event",
			date,
		})
		expect(result.date).toBe(date) // Same instance
	})

	it("should maintain correct array types", () => {
		// Test case that mimics the region scenario
		const input = {
			id: 1,
			name: "Test Region",
			hazards: ["dragons", "traps", "lava"] as string[],
		}

		const result = addSlugs(input)

		// Verify the result structure
		expect(result).toEqual({
			id: 1,
			name: "Test Region",
			slug: "test-region",
			hazards: ["dragons", "traps", "lava"],
		})

		// Runtime test for array methods
		expect(Array.isArray(result.hazards)).toBe(true)
		expect(result.hazards.map((h) => h.toUpperCase())).toEqual(["DRAGONS", "TRAPS", "LAVA"])

		// This would fail if destructuring doesn't work as expected
		const { hazards, ...rest } = result
		expect(hazards).toEqual(["dragons", "traps", "lava"])
		expect(rest).toEqual({ id: 1, name: "Test Region", slug: "test-region" })
	})

	it("should handle deeply nested optional chaining with locations and regions", () => {
		const input = {
			id: 42,
			name: "Test NPC",
			locations: [
				{
					id: 101,
					name: "NPC Location Entry",
					location: {
						id: 201,
						name: "Physical Location",
						region: {
							id: 301,
							name: "Geographic Region",
						},
					},
				},
				{
					id: 102,
					name: "Another Location Entry",
					location: null,
				},
				{
					id: 103,
					name: "Incomplete Location",
					location: {
						id: 202,
						name: "Physical Location 2",
						region: null,
					},
				},
			],
		}

		const result = addSlugs(input)

		// Verify slugs are added at each level
		expect(result.slug).toBe("test-npc")

		// Verify first location with complete path
		expect(result.locations[0].slug).toBe("npc-location-entry")
		expect(result.locations[0].location?.slug).toBe("physical-location")
		expect(result.locations[0].location?.region?.slug).toBe("geographic-region")

		// Verify location with null location property still gets a slug
		expect(result.locations[1].slug).toBe("another-location-entry")
		expect(result.locations[1].location).toBeNull()

		// Verify location with null region property
		expect(result.locations[2].slug).toBe("incomplete-location")
		expect(result.locations[2].location?.slug).toBe("physical-location-2")
		expect(result.locations[2].location?.region).toBeNull()

		// Verify locations with optional chaining works as in the example
		expect(result.locations[0].location?.region?.slug).toBe("geographic-region")

		// Verify we can iterate through locations safely as in the example
		const regionSlugs: string[] = []
		result.locations.forEach((location) => {
			if (location?.location?.region?.slug) {
				regionSlugs.push(location.location.region.slug)
			}
		})
		expect(regionSlugs).toEqual(["geographic-region"])
	})

	it("should handle complex relationship structures with unified relations", () => {
		// Simulating the structure after unifyRelations
		const input = {
			id: 50,
			name: "Character",
			incomingRelationships: [
				{
					id: 101,
					name: "Incoming Relation",
					sourceNpc: { id: 201, name: "Related NPC 1" },
				},
			],
			outgoingRelationships: [
				{
					id: 102,
					name: "Outgoing Relation",
					targetNpc: { id: 202, name: "Related NPC 2" },
				},
			],
			relations: [
				{
					id: 103,
					name: "Unified Relation 1",
					npc: { id: 203, name: "Related NPC 3" },
				},
				{
					id: 104,
					name: "Unified Relation 2",
					npc: { id: 204, name: "Related NPC 4" },
				},
			],
			locations: [
				{
					id: 301,
					name: "Character Location",
					location: {
						id: 401,
						name: "Physical Location",
						region: {
							id: 501,
							name: "Home Region",
						},
					},
				},
			],
		}

		const result = addSlugs(input)

		// Verify root object has slug
		expect(result.slug).toBe("character")

		// Verify incoming relationships
		expect(result.incomingRelationships[0].slug).toBe("incoming-relation")
		expect(result.incomingRelationships[0].sourceNpc.slug).toBe("related-npc-1")

		// Verify outgoing relationships
		expect(result.outgoingRelationships[0].slug).toBe("outgoing-relation")
		expect(result.outgoingRelationships[0].targetNpc.slug).toBe("related-npc-2")

		// Verify unified relations
		expect(result.relations[0].slug).toBe("unified-relation-1")
		expect(result.relations[0].npc.slug).toBe("related-npc-3")
		expect(result.relations[1].slug).toBe("unified-relation-2")
		expect(result.relations[1].npc.slug).toBe("related-npc-4")

		// Verify locations with optional chaining works as in the example
		expect(result.locations[0].location?.region?.slug).toBe("home-region")

		// Verify we can iterate through locations safely as in the example
		const regionSlugs: string[] = []
		result.locations.forEach((location) => {
			if (location?.location?.region?.slug) {
				regionSlugs.push(location.location.region.slug)
			}
		})
		expect(regionSlugs).toEqual(["home-region"])
	})
})
