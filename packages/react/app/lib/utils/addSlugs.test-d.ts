import { expectTypeOf, assertType } from "vitest"
import type { Slug, Sluggable, WithSlug, WithSlugsAdded } from "./addSlugs"
import addSlugs, { createSlug } from "./addSlugs"

// Test Slug type
const slug = createSlug("test")
expectTypeOf(slug).branded.toEqualTypeOf<Slug>()

// Simple object
type SimpleObject = { name: string; id: number }
const simpleObject: SimpleObject = { name: "test", id: 1 }

// Test WithSlug type
type SluggedSimpleObject = WithSlug<SimpleObject>
const sluggedObject: SluggedSimpleObject = {
	name: "test",
	id: 1,
	slug: createSlug("test"),
}
assertType<{ name: string; id: number; slug: Slug }>(sluggedObject)

// Test WithSlugsAdded type
const simpleResult = addSlugs(simpleObject)
assertType<{ name: string; id: number; slug: Slug }>(simpleResult)

// Test nested structures
type NestedType = {
	id: number
	name: string
	children: Array<{
		id: number
		name: string
		items: string[]
	}>
}

type WithSlugsNestedType = WithSlugsAdded<NestedType>

const nested: NestedType = {
	id: 1,
	name: "Parent",
	children: [
		{
			id: 2,
			name: "Child",
			items: ["item1", "item2"],
		},
	],
}

const nestedResult = addSlugs(nested)

// Type assertions for nested structure
assertType<{
	id: number
	name: string
	slug: Slug
	children: Array<{
		id: number
		name: string
		slug: Slug
		items: string[]
	}>
}>(nestedResult)

// Test arrays
const array = [simpleObject]
const arrayResult = addSlugs(array)
assertType<Array<{ name: string; id: number; slug: Slug }>>(arrayResult)

// Test complex structures with simplified approach to avoid Date type issues
type ComplexType = {
	id: number
	name: string
	metadata: {
		tags: string[]
	}
	relations: Array<{
		id: number
		name: string
		target: {
			id: number
			name: string
		} | null
	}>
}

const complex: ComplexType = {
	id: 1,
	name: "Complex",
	metadata: {
		tags: ["tag1", "tag2"],
	},
	relations: [
		{
			id: 2,
			name: "Relation",
			target: {
				id: 3,
				name: "Target",
			},
		},
		{
			id: 4,
			name: "Empty Relation",
			target: null,
		},
	],
}

const complexResult = addSlugs(complex)

// Type assertion for complex structure
assertType<{
	id: number
	name: string
	slug: Slug
	metadata: {
		tags: string[]
	}
	relations: Array<{
		id: number
		name: string
		slug: Slug
		target: {
			id: number
			name: string
			slug: Slug
		} | null
	}>
}>(complexResult)

// Test optional chaining type safety
if (complexResult.relations[0].target) {
	assertType<Slug>(complexResult.relations[0].target.slug)
}

// Verify non-sluggable objects remain unchanged
type NonSluggable = { id: number; value: string }
const nonSluggable: NonSluggable = { id: 1, value: "test" }
const nonSluggableResult = addSlugs(nonSluggable)
assertType<NonSluggable>(nonSluggableResult)

// Test non-sluggable object arrays (like culture array)
type CultureItem = {
	id: number
	factionId: number
	symbols: string[]
	rituals: string[]
	taboos: string[]
	aesthetics: string[]
	jargon: string[]
	recognitionSigns: string[]
}

type WithCulture = {
	id: number
	name: string
	culture: CultureItem[]
}

const withCulture: WithCulture = {
	id: 1,
	name: "Test Faction",
	culture: [
		{
			id: 101,
			factionId: 1,
			symbols: ["symbol1"],
			rituals: ["ritual1"],
			taboos: ["taboo1"],
			aesthetics: ["aesthetic1"],
			jargon: ["jargon1"],
			recognitionSigns: ["sign1"],
		},
	],
}

const withCultureResult = addSlugs(withCulture)

// The parent object should get a slug
assertType<Slug>(withCultureResult.slug)

// But culture items should not get slugs
assertType<CultureItem[]>(withCultureResult.culture)

// Test accessing culture properties
const firstCulture = withCultureResult.culture[0]
assertType<string[]>(firstCulture.symbols)
assertType<string[]>(firstCulture.rituals)

// Verify the culture item type doesn't have a slug property
// @ts-expect-error Culture items shouldn't have slugs
const shouldNotExist = firstCulture.slug
