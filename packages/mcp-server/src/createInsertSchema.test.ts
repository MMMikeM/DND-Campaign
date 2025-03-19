import { createInsertSchema } from "drizzle-zod"
import { factions } from "@tome-keeper/shared"
import { describe, it, expect } from "vitest"

describe("createInsertSchema", () => {
	it("should create a valid schema for factions", () => {
		console.log(factions.getSQL())
		const testSchema = createInsertSchema(factions)
		console.log(testSchema)

		// Example valid data
		const validData = {
			name: "Faction Name",
			description: "A description of the faction",
			type: "Guild",
			alignment: "Neutral",
			publicGoal: "To protect the realm",
			trueGoal: "To seize power",
			headquarters: "Hidden fortress",
			territory: "Northern mountains",
			history: "Founded 100 years ago",
			notes: "Currently recruiting",
			// The 'id' field might be auto-generated, so you might not need to include it
		}

		// Example invalid data
		const invalidData = {
			name: 123, // Invalid type
			description: null, // Invalid type
		}

		// Validate valid data
		expect(() => testSchema.parse(validData)).not.toThrow()

		// Validate invalid data
		expect(() => testSchema.parse(invalidData)).toThrow()
	})
})
