import { describe, expect, it } from "vitest"
import { unifyRelations } from "./unify"

describe("unifyRelations", () => {
	it("should transform a single source array", () => {
		const input = {
			id: 1,
			name: "Example",
			children: [
				{ id: 101, childId: "child1", name: "First Child" },
				{ id: 102, childId: "child2", name: "Second Child" },
			],
		}

		const result = unifyRelations(input)
			.from({ property: "children", key: "childId" })
			.to({ property: "relatives", key: "relativeId" })

		expect(result).toEqual({
			id: 1,
			name: "Example",
			relatives: [
				{ id: 101, relativeId: "child1", name: "First Child" },
				{ id: 102, relativeId: "child2", name: "Second Child" },
			],
		})
	})

	it("should transform multiple source arrays", () => {
		const input = {
			id: 1,
			name: "Person",
			incomingRelations: [{ id: 201, sourceRegion: "region1", description: "Incoming 1" }],
			outgoingRelations: [
				{ id: 301, targetRegion: "region2", description: "Outgoing 1" },
				{ id: 302, targetRegion: "region3", description: "Outgoing 2" },
			],
			otherProperty: "Should be preserved",
		}

		const result = unifyRelations(input)
			.from({ property: "incomingRelations", key: "sourceRegion" })
			.with({ property: "outgoingRelations", key: "targetRegion" })
			.to({ property: "relations", key: "region" })

		expect(result).toEqual({
			id: 1,
			name: "Person",
			otherProperty: "Should be preserved",
			relations: [
				{ id: 201, region: "region1", description: "Incoming 1" },
				{ id: 301, region: "region2", description: "Outgoing 1" },
				{ id: 302, region: "region3", description: "Outgoing 2" },
			],
		})
	})

	it("should transform multiple source arrays with three sources", () => {
		const input = {
			id: 1,
			name: "Item",
			source1: [{ id: 501, key1: "value1", data: "Data 1" }],
			source2: [{ id: 502, key2: "value2", data: "Data 2" }],
			source3: [{ id: 503, key3: "value3", data: "Data 3" }],
		}

		const result = unifyRelations(input)
			.from({ property: "source1", key: "key1" })
			.with({ property: "source2", key: "key2" })
			.with({ property: "source3", key: "key3" })
			.to({ property: "combined", key: "unifiedKey" })

		expect(result).toEqual({
			id: 1,
			name: "Item",
			combined: [
				{ id: 501, unifiedKey: "value1", data: "Data 1" },
				{ id: 502, unifiedKey: "value2", data: "Data 2" },
				{ id: 503, unifiedKey: "value3", data: "Data 3" },
			],
		})
	})

	it("should throw an error if a source property is not an array", () => {
		const input = {
			id: 1,
			name: "Example",
			notAnArray: "string value",
		}

		expect(() => {
			unifyRelations(input).from({ property: "notAnArray", key: "id" }).to({ property: "result", key: "newId" })
		}).toThrow("Property must be an array: notAnArray")
	})

	it("should handle empty source arrays", () => {
		const input = {
			id: 1,
			name: "Empty",
			source1: [],
			source2: [],
		}

		const result = unifyRelations(input)
			.from({ property: "source1", key: "key1" })
			.with({ property: "source2", key: "key2" })
			.to({ property: "combined", key: "resultKey" })

		expect(result).toEqual({
			id: 1,
			name: "Empty",
			combined: [],
		})
	})

	it("should preserve objects without the specified key", () => {
		const input = {
			id: 1,
			items: [
				{ id: 101, someKey: "value1", name: "Item 1" },
				{ id: 102, name: "Item 2" }, // Missing the sourceKey
			],
		}

		const result = unifyRelations(input)
			.from({ property: "items", key: "someKey" })
			.to({ property: "transformed", key: "newKey" })

		expect(result.transformed).toEqual([
			{ id: 101, newKey: "value1", name: "Item 1" },
			{ id: 102, newKey: undefined, name: "Item 2" },
		])
	})
})
