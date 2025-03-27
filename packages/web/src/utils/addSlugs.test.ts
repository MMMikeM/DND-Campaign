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
})
