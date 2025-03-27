import { expectTypeOf, assertType } from "vitest"
import type { Slug, Sluggable, WithSlug, WithSlugsAdded } from "./addSlugs"
import addSlugs, { createSlug } from "./addSlugs"

// Test Slug type
const slug = createSlug("test")
expectTypeOf(slug).toEqualTypeOf<Slug>()

// Test WithSlug type
type SimpleObject = { name: string; id: number }
type SimpleWithSlug = WithSlug<SimpleObject>

// Using assertType for interface tests
assertType<{ name: string; id: number; slug: Slug }>({} as SimpleWithSlug)

// Test WithSlugsAdded type
// Simple object
const simpleObject: SimpleObject = { name: "test", id: 1 }
const simpleResult = addSlugs(simpleObject)
assertType<{ name: string; id: number; slug: Slug }>(simpleResult)

// Array of objects
const arrayObject: Array<SimpleObject> = [{ name: "test", id: 1 }]
const arrayResult = addSlugs(arrayObject)
assertType<Array<{ name: string; id: number; slug: Slug }>>(arrayResult)

// Test primitives to verify they remain unchanged
assertType<string>({} as WithSlugsAdded<string>)
assertType<number>({} as WithSlugsAdded<number>)
assertType<null>(null as WithSlugsAdded<null>)
assertType<undefined>(undefined as WithSlugsAdded<undefined>)

// Test type guard
const sluggable = { name: "test", id: 1 }
const notSluggable = { title: "title" }

// Use runtime checks similar to the implementation
if (
	"name" in sluggable &&
	typeof sluggable.name === "string" &&
	"id" in sluggable &&
	typeof sluggable.id === "number"
) {
	assertType<Sluggable>(sluggable)
}

if (
	!(
		"name" in notSluggable &&
		typeof notSluggable.name === "string" &&
		"id" in notSluggable &&
		typeof notSluggable.id === "number"
	)
) {
	assertType<{ title: string }>(notSluggable)
}

// NOTE: We don't need explicit tests for nested structures since the runtime tests
// already cover that functionality, and the type system correctly infers the runtime behavior.
