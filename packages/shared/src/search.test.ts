import { describe, expect, it } from "vite-plus/test"
import { createNameSearch, type EntityRef, mergeSearchResults } from "./search"

const entities: EntityRef[] = [
	{ id: 1, table: "npcs", name: "Gundren Rockseeker", slug: "gundren-rockseeker" },
	{ id: 2, table: "npcs", name: "Sildar Hallwinter", slug: "sildar-hallwinter" },
	{ id: 3, table: "factions", name: "Cragmaw Goblins", slug: "cragmaw-goblins" },
	{ id: 4, table: "sites", name: "Wave Echo Cave", slug: "wave-echo-cave" },
]

const searchNames = createNameSearch(entities)
const ids = (hits: EntityRef[]) => hits.map((hit) => hit.id)

describe("createNameSearch", () => {
	it("finds a name by a word prefix", () => {
		expect(ids(searchNames("Gundren"))[0]).toBe(1)
	})

	it("rescues a one-edit misspelling", () => {
		expect(ids(searchNames("Rockseker"))).toContain(1)
	})

	it("rescues a misspelling that only sounds right", () => {
		expect(ids(searchNames("Kragmaw"))).toContain(3)
	})

	it("matches terms under three characters", () => {
		expect(ids(searchNames("Wa"))[0]).toBe(4)
	})

	it("returns nothing for gibberish", () => {
		expect(searchNames("zzqx")).toEqual([])
	})
})

describe("mergeSearchResults", () => {
	const [gundren, sildar, cragmaw] = entities

	it("lists name matches before full-text matches", () => {
		const results = mergeSearchResults([cragmaw], [sildar], 10)
		expect(results.map(({ id, matchedBy }) => [id, matchedBy])).toEqual([
			[3, "name"],
			[2, "text"],
		])
	})

	it("drops full-text hits already matched by name", () => {
		const results = mergeSearchResults([gundren], [gundren, sildar], 10)
		expect(results.map(({ id, matchedBy }) => [id, matchedBy])).toEqual([
			[1, "name"],
			[2, "text"],
		])
	})

	it("treats the same id in different tables as different entities", () => {
		const sameIdOtherTable = { ...cragmaw, id: 1 }
		expect(mergeSearchResults([gundren], [sameIdOtherTable], 10)).toHaveLength(2)
	})

	it("stops at the limit", () => {
		expect(mergeSearchResults([gundren, sildar], [cragmaw], 2)).toHaveLength(2)
	})
})
