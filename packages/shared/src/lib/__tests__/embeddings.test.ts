import { describe, expect, it } from "vitest"
import { getTextForEmbeddingLegacy as getTextForEmbedding } from "../embeddings"

// Legacy configuration type for tests
interface EmbeddingConfig {
	fieldConfig?: Record<
		string,
		{
			booleanTrueForm?: string
			booleanFalseForm?: string
			listItemTypeName?: string
		}
	>
}

describe("getTextForEmbedding", () => {
	const mockRecord = {
		name: "Test Entity",
		description: "A test entity for embedding.",
		multiParagraphDescription: ["First paragraph.", "Second paragraph with details."],
		tags: ["tag1", "tag2", "tag3"],
		objectives: ["Objective A", "Objective B"],
		isActive: true,
		isSystemGenerated: false,
		isHidden: false,
		count: 42,
		priorityLevel: 3,
		emptyArray: [],
		stringArrayWithEmpties: ["valid", "", "  ", "also-valid"],
		mixedArray: ["string", 123, true, null, undefined, "another item"],
		emptyString: "",
		nullValue: null,
		undefinedValue: undefined,
		regionId: "region-alpha",
		mainNPC_ID: "npc-001",
		user_id: "user-beta",
		id: "plain-id-123",
		ID: "PLAIN-ID-456",
	}

	describe("Field Label Processing (removeAppendedId and camelToTitle)", () => {
		it("should convert camelCase to Title Case and preserve non-Id fields", () => {
			const result = getTextForEmbedding(mockRecord, ["name", "priorityLevel"])
			expect(result).toContain("Name: Test Entity")
			expect(result).toContain("Priority Level: 3")
		})

		it("should remove 'Id' (case-insensitive) suffix and title case", () => {
			const result = getTextForEmbedding(mockRecord, ["regionId"])
			expect(result).toContain("Region: region-alpha")
		})

		it("should remove 'ID' (uppercase) suffix and title case", () => {
			const result = getTextForEmbedding(mockRecord, ["mainNPC_ID"])
			expect(result).toContain("Main NPC: npc-001")
		})

		it("should remove '_id' (snake_case) suffix and title case", () => {
			const result = getTextForEmbedding(mockRecord, ["user_id"])
			expect(result).toContain("User: user-beta")
		})

		it("should handle field renaming, overriding default label processing", () => {
			const result = getTextForEmbedding(mockRecord, ["regionId"], { regionId: "Primary Zone" })
			expect(result).toContain("Primary Zone: region-alpha")
		})

		it("should handle field name that is exactly 'id' or 'ID'", () => {
			const result1 = getTextForEmbedding(mockRecord, ["id"])
			const result2 = getTextForEmbedding(mockRecord, ["ID"])
			expect(result1).toContain("Id: plain-id-123")
			expect(result2).toContain("ID: PLAIN-ID-456")
		})
	})

	describe("String and Numeric Field Processing", () => {
		it("should process string fields correctly", () => {
			const result = getTextForEmbedding(mockRecord, ["name", "description"])
			expect(result).toContain("Name: Test Entity")
			expect(result).toContain("Description: A test entity for embedding.")
		})

		it("should process numeric fields correctly", () => {
			const result = getTextForEmbedding(mockRecord, ["count"])
			expect(result).toContain("Count: 42")
		})

		it("should skip empty strings, null, and undefined values", () => {
			const result = getTextForEmbedding(mockRecord, ["emptyString", "nullValue", "undefinedValue"])
			expect(result).toBe("")
		})
	})

	describe("Array Field Processing", () => {
		it("should format string arrays with default dot-space joiner when no itemTypeName", () => {
			const result = getTextForEmbedding(mockRecord, ["tags"])
			expect(result).toContain("Tags: tag1. tag2. tag3")
		})

		it("should format string arrays with itemTypeName as a list for multiple items", () => {
			const config: EmbeddingConfig = { fieldConfig: { objectives: { listItemTypeName: "Goal" } } }
			const result = getTextForEmbedding(mockRecord, ["objectives"], undefined, config)
			expect(result).toBe("Objectives:\n- Goal: Objective A\n- Goal: Objective B")
		})

		it("should format string arrays with itemTypeName concisely for a single item", () => {
			const singleObjectiveRecord = { ...mockRecord, objectives: ["Single Goal"] }
			const config: EmbeddingConfig = { fieldConfig: { objectives: { listItemTypeName: "Task" } } }
			const result = getTextForEmbedding(singleObjectiveRecord, ["objectives"], undefined, config)
			expect(result).toBe("Objectives: Task: Single Goal")
		})

		it("should skip empty arrays", () => {
			const result = getTextForEmbedding(mockRecord, ["emptyArray"])
			expect(result).toBe("")
		})

		it("should filter out empty/whitespace-only strings from arrays before formatting", () => {
			const resultDefault = getTextForEmbedding(mockRecord, ["stringArrayWithEmpties"])
			expect(resultDefault).toBe("String Array With Empties: valid. also-valid")

			const config: EmbeddingConfig = { fieldConfig: { stringArrayWithEmpties: { listItemTypeName: "Item" } } }
			const resultTyped = getTextForEmbedding(mockRecord, ["stringArrayWithEmpties"], undefined, config)
			expect(resultTyped).toBe("String Array With Empties:\n- Item: valid\n- Item: also-valid")
		})

		it("should handle arrays of paragraphs (multi-line strings) using itemTypeName for structure", () => {
			const config: EmbeddingConfig = { fieldConfig: { multiParagraphDescription: { listItemTypeName: "Paragraph" } } }
			const result = getTextForEmbedding(mockRecord, ["multiParagraphDescription"], undefined, config)
			expect(result).toContain("Multi Paragraph Description:")
			expect(result).toContain("- Paragraph: First paragraph.")
			expect(result).toContain("- Paragraph: Second paragraph with details.")
		})

		it("should handle arrays of long strings with better formatting", () => {
			const longStringRecord = {
				descriptions: [
					"This is a very long description that exceeds the typical length threshold and should be treated as paragraph content for better readability.",
					"Another long description that also exceeds the length threshold and demonstrates the paragraph formatting behavior.",
				],
			}

			const result = getTextForEmbedding(longStringRecord, ["descriptions"])
			expect(result).toContain("Descriptions:")
			expect(result).toContain("This is a very long description")
			expect(result).toContain("Another long description")
			// Should use double newlines for paragraph separation
			expect(result).toMatch(/\n\n/)
		})

		it("should process arrays containing non-string values by filtering them out", () => {
			const result = getTextForEmbedding(mockRecord, ["mixedArray"])
			expect(result).toContain("Mixed Array: string. another item")
			expect(result).not.toContain("123")
			expect(result).not.toContain("true")
		})
	})

	describe("Boolean Field Processing", () => {
		it("should default to 'Yes'/'No' when no custom forms are provided", () => {
			const result = getTextForEmbedding(mockRecord, ["isActive", "isHidden"])
			expect(result).toContain("Is Active: Yes")
			expect(result).toContain("Is Hidden: No")
		})

		it("should use booleanTrueForm when value is true", () => {
			const config: EmbeddingConfig = { fieldConfig: { isActive: { booleanTrueForm: "Currently Operational" } } }
			const result = getTextForEmbedding(mockRecord, ["isActive"], undefined, config)
			expect(result).toContain("Is Active: Currently Operational")
		})

		it("should use booleanFalseForm when value is false", () => {
			const config: EmbeddingConfig = { fieldConfig: { isHidden: { booleanFalseForm: "Publicly Visible" } } }
			const result = getTextForEmbedding(mockRecord, ["isHidden"], undefined, config)
			expect(result).toContain("Is Hidden: Publicly Visible")
		})

		it("should fallback to default 'Yes' if booleanTrueForm is missing for true value", () => {
			const config: EmbeddingConfig = { fieldConfig: { isActive: { booleanFalseForm: "Off" } } }
			const result = getTextForEmbedding(mockRecord, ["isActive"], undefined, config)
			expect(result).toContain("Is Active: Yes")
		})

		it("should fallback to default 'No' if booleanFalseForm is missing for false value", () => {
			const config: EmbeddingConfig = { fieldConfig: { isHidden: { booleanTrueForm: "Secret" } } }
			const result = getTextForEmbedding(mockRecord, ["isHidden"], undefined, config)
			expect(result).toContain("Is Hidden: No")
		})
	})

	describe("Configuration and Edge Cases", () => {
		it("should handle an empty fields array", () => {
			const result = getTextForEmbedding(mockRecord, [])
			expect(result).toBe("")
		})

		it("should handle fields not present in the record", () => {
			const result = getTextForEmbedding(mockRecord, ["nonExistentField" as any])
			expect(result).toBe("")
		})

		it("should function with an empty config object", () => {
			const result = getTextForEmbedding(mockRecord, ["name"], undefined, {})
			expect(result).toContain("Name: Test Entity")
		})

		it("should function if config.fieldConfig is undefined", () => {
			const result = getTextForEmbedding(mockRecord, ["name"], undefined, { fieldConfig: undefined })
			expect(result).toContain("Name: Test Entity")
		})

		it("should ignore irrelevant field configurations", () => {
			const config: EmbeddingConfig = { fieldConfig: { nonexistentField: { booleanTrueForm: "Should not appear" } } }
			const result = getTextForEmbedding(mockRecord, ["name"], undefined, config)
			expect(result).toContain("Name: Test Entity")
			expect(result).not.toContain("Should not appear")
		})

		it("should process all specified fields in the given order", () => {
			const result = getTextForEmbedding(mockRecord, ["name", "count", "isActive"])
			const expectedOrder = "Name: Test Entity\nCount: 42\nIs Active: Yes"
			expect(result).toBe(expectedOrder)
		})

		it("should handle errors gracefully without breaking the entire embedding", () => {
			// Create a record that might cause errors during processing
			const problematicRecord = {
				name: "Valid Name",
				problematicField: {
					toString: () => {
						throw new Error("toString error")
					},
				},
				validField: "Valid Value",
			}

			// Should not throw and should process valid fields
			const result = getTextForEmbedding(problematicRecord, ["name", "problematicField", "validField"])
			expect(result).toContain("Name: Valid Name")
			expect(result).toContain("Valid Field: Valid Value")
			// problematicField should be skipped due to error
		})
	})

	describe("Complex Configuration", () => {
		it("should handle multiple field configurations", () => {
			const complexRecord = {
				name: "Complex Entity",
				features: ["feature1", "feature2"],
				isEnabled: true,
				tags: ["important", "test"],
				count: 5,
			}

			const config: EmbeddingConfig = {
				fieldConfig: {
					features: { listItemTypeName: "Feature" },
					tags: { listItemTypeName: "Tag" },
					isEnabled: {
						booleanTrueForm: "This entity is enabled",
						booleanFalseForm: "This entity is disabled",
					},
				},
			}

			const result = getTextForEmbedding(
				complexRecord,
				["name", "features", "isEnabled", "tags", "count"],
				undefined,
				config,
			)

			expect(result).toContain("Name: Complex Entity")
			expect(result).toContain("Features:")
			expect(result).toContain("- Feature: feature1")
			expect(result).toContain("- Feature: feature2")
			expect(result).toContain("Is Enabled: This entity is enabled")
			expect(result).toContain("Tags:")
			expect(result).toContain("- Tag: important")
			expect(result).toContain("- Tag: test")
			expect(result).toContain("Count: 5")
		})

		it("should combine field renaming with configuration", () => {
			const config: EmbeddingConfig = {
				fieldConfig: {
					tags: { listItemTypeName: "Category" },
				},
			}

			const result = getTextForEmbedding(mockRecord, ["tags"], { tags: "Categories" }, config)

			expect(result).toContain("Categories:")
			expect(result).toContain("- Category: tag1")
		})
	})
})
