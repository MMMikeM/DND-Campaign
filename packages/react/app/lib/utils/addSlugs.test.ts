import { describe, expect, expectTypeOf, it } from "vitest"
import { testData } from "../addSlugs.test.data"
import type { Slug, WithSlug, WithSlugsAdded } from "./addSlugs"
import addSlugs, { createSlug } from "./addSlugs"

// Type tests
describe("Type tests for addSlugs", () => {
	it("should validate Slug is a branded string type", () => {
		const slug = createSlug("test")
		expectTypeOf(slug).branded.toEqualTypeOf<Slug>()

		// Runtime check
		expect(typeof slug).toBe("string")
	})

	it("should validate WithSlug adds a slug property to a Sluggable type", () => {
		type TestType = { name: string; id: number }
		type WithSlugTest = WithSlug<TestType>

		// Type check
		expectTypeOf<WithSlugTest>().branded.toEqualTypeOf<{ name: string; id: number; slug: Slug }>()
	})

	it("should verify the WithSlugsAdded type transformation for nested structures", () => {
		// Define a nested structure type
		type Region = {
			id: number
			name: string
			locations: Array<{
				id: number
				name: string
				features: string[]
			}>
		}

		// Check the transformed type
		type ProcessedRegion = WithSlugsAdded<Region>

		// Create a value matching the expected result type
		const processed: ProcessedRegion = {
			id: 1,
			name: "Test Region",
			slug: createSlug("Test Region"),
			locations: [
				{
					id: 101,
					name: "Test Location",
					slug: createSlug("Test Location"),
					features: ["Feature 1", "Feature 2"],
				},
			],
		}

		expectTypeOf(processed).branded.toEqualTypeOf<{
			id: number
			name: string
			slug: Slug
			locations: Array<{
				id: number
				name: string
				slug: Slug
				features: string[]
			}>
		}>()
	})
})

// Implementation tests
describe("addSlugs function", () => {
	it("should add a slug to objects with name and id", () => {
		const input = { name: "Test Object", id: 1 }
		const result = addSlugs(input)

		expect(result).toEqual({
			name: "Test Object",
			id: 1,
			slug: "test-object",
		})
	})

	it("should handle null or undefined values", () => {
		expect(addSlugs(null)).toBeNull()
		expect(addSlugs(undefined)).toBeUndefined()
	})

	it("should not modify primitive values", () => {
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

	it("should handle deeply nested objects", () => {
		const input = {
			name: "Parent",
			id: 1,
			child: {
				name: "Child",
				id: 2,
				grandchild: {
					name: "Grandchild",
					id: 3,
				},
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
				grandchild: {
					name: "Grandchild",
					id: 3,
					slug: "grandchild",
				},
			},
		})
	})

	it("should not add slugs to objects that have id but no name property", () => {
		const input = {
			id: 1,
			name: "Parent",
			cultures: [
				{
					id: 101,
					factionId: 1,
					symbols: ["symbol1"],
					rituals: ["ritual1"],
				},
			],
		}

		const result = addSlugs(input)

		// Parent should have a slug
		expect(result.slug).toBe("parent")

		// But the culture object should not, as it has no name property

		expect((result.cultures[0] as any).slug).toBeUndefined()

		// Make sure other properties are preserved
		expect(result.cultures[0].symbols).toEqual(["symbol1"])
		expect(result.cultures[0].rituals).toEqual(["ritual1"])
	})

	it("should not modify objects that don't match the sluggable criteria", () => {
		const input = { id: 1, property: "value" }
		const result = addSlugs(input)

		expect(result).toEqual({ id: 1, property: "value" })
	})

	it("should process complex structures with arrays and mixed types", () => {
		const input = {
			name: "Complex",
			id: 1,
			items: [{ name: "Item 1", id: 101 }, { name: "Item 2", id: 102 }, { notSluggable: true }],
			metadata: {
				created: new Date("2023-01-01"),
				tags: ["tag1", "tag2"],
			},
		}

		const result = addSlugs(input)

		expect(result).toMatchObject({
			name: "Complex",
			id: 1,
			slug: "complex",
			items: [
				{ name: "Item 1", id: 101, slug: "item-1" },
				{ name: "Item 2", id: 102, slug: "item-2" },
				{ notSluggable: true },
			],
			metadata: {
				tags: ["tag1", "tag2"],
			},
		})

		// Check the date is preserved
		expect(result.metadata.created instanceof Date).toBe(true)
	})

	it("should handle the provided test data correctly", () => {
		const result = addSlugs(testData)

		// Test the main object gets a slug
		expect(result.slug).toBe("paphos")

		// Test nested locations get slugs
		expect(result.locations[0].slug).toBe("temple-of-aphrodite")
		expect(result.locations[1].slug).toBe("the-sentinels-rest")

		// Test deeply nested relationships - outgoingRelations has no name property, so no slug
		// Relation only has regionId, otherRegionId, relationType, but no name
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		expect((result.outgoingRelations[0] as any).slug).toBe(undefined)
		// But target region should have a slug
		expect(result.outgoingRelations[0].targetRegion.slug).toBe("akamas-peninsula")

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		expect((result.outgoingRelations[0].connections[0] as any).slug).toBe(undefined) // Not sluggable, no name property

		// Test incoming relationships with deep nesting, if they exist in the test data
		if (result.locations[2]?.incomingRelations?.[0]) {
			const incomingLocationRelation = result.locations[2].incomingRelations[0]
			// Check if the relation has a slug (depends on if it has a name property)
			if (incomingLocationRelation.sourceLocation) {
				expect(incomingLocationRelation.sourceLocation.slug).toBe("the-garden-of-rebirth")
			}
		}

		// Type safety checks
		expectTypeOf(result).toHaveProperty("slug")
	})
})
