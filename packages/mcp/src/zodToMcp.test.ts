import { describe, it, expect, vi } from "vitest"
import { z } from "zod"
import zodToMCPSchema from "./zodToMcp.js"
import { tables } from "@tome-master/shared"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import zodToMCP from "./zodToMcp.js"

const {
	factionTables: { factions, factionRelationships },
} = tables

vi.importMock("./logger.js")

vi.importMock("./index.js")

const expectedResults = {
	// Input schema for the create_faction tool
	createFactionSchema: {
		type: "object",
		properties: {
			name: {
				type: "string",
			},
			type: {
				type: "string",
			},
			alignment: {
				type: "string",
				enum: [
					"lawful good",
					"neutral good",
					"chaotic good",
					"lawful neutral",
					"true neutral",
					"chaotic neutral",
					"lawful evil",
					"neutral evil",
					"chaotic evil",
				],
			},
			description: {
				type: "string",
			},
			publicGoal: {
				type: "string",
			},
			trueGoal: {
				type: "string",
			},
			headquarters: {
				type: "string",
			},
			territory: {
				type: "string",
			},
			history: {
				type: "array",
				items: {
					type: "string",
				},
			},
			notes: {
				type: "array",
				items: {
					type: "string",
				},
			},
			resources: {
				type: "array",
				items: {
					type: "string",
				},
			},
		},
		required: ["name", "type", "history", "notes", "resources"],
	},

	// Input schema for the get_faction tool
	getFactionSchema: {
		type: "object",
		properties: {
			id: {
				type: "number",
			},
		},
		required: ["id"],
	},

	// Input schema for the update_faction tool
	updateFactionSchema: {
		type: "object",
		properties: {
			id: {
				type: "number",
			},
			name: {
				type: "string",
			},
			type: {
				type: "string",
			},
			alignment: {
				type: "string",
				enum: [
					"lawful good",
					"neutral good",
					"chaotic good",
					"lawful neutral",
					"true neutral",
					"chaotic neutral",
					"lawful evil",
					"neutral evil",
					"chaotic evil",
				],
			},
			description: {
				type: "string",
			},
			publicGoal: {
				type: "string",
			},
			trueGoal: {
				type: "string",
			},
			headquarters: {
				type: "string",
			},
			territory: {
				type: "string",
			},
			history: {
				type: "array",
				items: {
					type: "string",
				},
			},
			notes: {
				type: "array",
				items: {
					type: "string",
				},
			},
			resources: {
				type: "array",
				items: {
					type: "string",
				},
			},
		},
		required: ["id", "history", "notes", "resources"],
	},

	// Input schema for the create_faction_relationship tool
	createFactionRelationshipSchema: {
		type: "object",
		properties: {
			factionId: {
				type: "number",
			},
			otherFactionId: {
				type: "number",
			},
			type: {
				type: "string",
				enum: ["ally", "enemy", "neutral"],
			},
			description: {
				type: "string",
			},
			strength: {
				type: "string",
			},
			notes: {
				type: "array",
				items: {
					type: "string",
				},
			},
		},
		required: ["factionId", "otherFactionId", "type"],
	},

	// Input schema for the get_faction_relationships tool
	getFactionRelationshipsSchema: {
		type: "object",
		properties: {
			factionId: {
				type: "number",
			},
		},
		required: ["factionId"],
	},

	// Input schema for the update_faction_relationship tool
	updateFactionRelationshipSchema: {
		type: "object",
		properties: {
			id: {
				type: "number",
			},
			type: {
				type: "string",
				enum: ["ally", "enemy", "neutral"],
			},
			description: {
				type: "string",
			},
			strength: {
				type: "string",
			},
			notes: {
				type: "array",
				items: {
					type: "string",
				},
			},
		},
		required: ["id", "type"],
	},
}

const schemas = {
	factionInsertSchema: createInsertSchema(factions, {
		history: z.array(z.string()),
		notes: z.array(z.string()),
		resources: z.array(z.string()),
	}),

	factionUpdateSchema: createUpdateSchema(factions, {
		history: z.array(z.string()).optional(),
		notes: z.array(z.string()).optional(),
		resources: z.array(z.string()).optional(),
	}),

	factionGetSchema: z.object({ id: z.number() }),

	factionDeleteSchema: z.object({ id: z.number() }),

	factionRelationshipInsertSchema: createInsertSchema(factionRelationships, {
		description: z.array(z.string()),
		strength: z.string(),
		notes: z.array(z.string()),
	}),

	factionRelationshipUpdateSchema: createUpdateSchema(factionRelationships, {
		id: z.number(),
		factionId: z.number(),
		otherFactionId: z.number(),
		description: z.array(z.string()),
		strength: z.string(),
		notes: z.array(z.string()),
	}),

	getFactionRelationshipsSchema: z.object({ id: z.number() }),

	deleteFactionRelationshipSchema: z.object({ id: z.number() }),
}

// const test = {
// 	factionInsertSchema: schemas.factionInsertSchema.parse({}),
// 	factionUpdateSchema: schemas.factionUpdateSchema.parse({}),
// 	factionGetSchema: schemas.factionGetSchema.parse({}),
// 	factionDeleteSchema: schemas.factionDeleteSchema.parse({}),
// 	factionRelationshipInsertSchema: schemas.factionRelationshipInsertSchema.parse({}),
// 	factionRelationshipUpdateSchema: schemas.factionRelationshipUpdateSchema.parse({}),
// 	getFactionRelationshipsSchema: schemas.getFactionRelationshipsSchema.parse({}),
// 	deleteFactionRelationshipSchema: schemas.deleteFactionRelationshipSchema.parse({}),
// }

// const {
// 	factionInsertSchema,
// 	factionUpdateSchema,
// 	factionGetSchema,
// 	factionDeleteSchema,
// 	factionRelationshipInsertSchema,
// 	factionRelationshipUpdateSchema,
// 	getFactionRelationshipsSchema,
// 	deleteFactionRelationshipSchema,
// } = test

// for (const item in schema.shape) {
// 	console.log({
// 		item,
// 		isZodObject: schema.shape[item] instanceof z.ZodObject,
// 		isOptional: schema.shape[item] instanceof z.ZodOptional,
// 		isNullable: schema.shape[item] instanceof z.ZodNullable,
// 		isUnion: schema.shape[item] instanceof z.ZodUnion,
// 		isLiteral: schema.shape[item] instanceof z.ZodLiteral,
// 		isEnum: schema.shape[item] instanceof z.ZodEnum,
// 		isString: schema.shape[item] instanceof z.ZodString,
// 		isNumber: schema.shape[item] instanceof z.ZodNumber,
// 		isBoolean: schema.shape[item] instanceof z.ZodBoolean,
// 		isNull: schema.shape[item] instanceof z.ZodNull,
// 		isUndefined: schema.shape[item] instanceof z.ZodUndefined,
// 		isArray: schema.shape[item] instanceof z.ZodArray,
// 		isObject: schema.shape[item] instanceof z.ZodObject,
// 	})
// }
describe("zodToMCPSchema", () => {
	// describe("primitives", () => {
	// 	it("should convert a string schema", () => {
	// 		const schema = z.string().describe("A string field")
	// 		const result = zodToMCPSchema(schema)

	// 		expect(result).toEqual({
	// 			type: "object",
	// 			properties: {
	// 				value: {
	// 					type: "string",
	// 					description: "A string field",
	// 				},
	// 			},
	// 			required: ["value"],
	// 		})
	// 	})

	// 	it("should convert a boolean schema", () => {
	// 		const schema = z.boolean().describe("A boolean field")
	// 		const result = zodToMCPSchema(schema)

	// 		expect(result).toEqual({
	// 			type: "object",
	// 			properties: {
	// 				value: {
	// 					type: "boolean",
	// 					description: "A boolean field",
	// 				},
	// 			},
	// 			required: ["value"],
	// 		})
	// 	})
	// })

	// describe("strings with formats", () => {
	// 	it("should convert email format", () => {
	// 		const schema = z.string().email().describe("Email address")
	// 		const result = zodToMCPSchema(schema)

	// 		expect(result).toEqual({
	// 			type: "object",
	// 			properties: {
	// 				value: {
	// 					type: "string",
	// 					format: "email",
	// 					description: "Email address",
	// 				},
	// 			},
	// 			required: ["value"],
	// 		})
	// 	})

	// 	it("should convert URL format", () => {
	// 		const schema = z.string().url().describe("Website URL")
	// 		const result = zodToMCPSchema(schema)

	// 		expect(result).toEqual({
	// 			type: "object",
	// 			properties: {
	// 				value: {
	// 					type: "string",
	// 					format: "uri",
	// 					description: "Website URL",
	// 				},
	// 			},
	// 			required: ["value"],
	// 		})
	// 	})

	// 	it("should convert regex pattern", () => {
	// 		const schema = z
	// 			.string()
	// 			.regex(/^[a-z]+$/)
	// 			.describe("Lowercase letters only")
	// 		const result = zodToMCPSchema(schema)

	// 		expect(result).toEqual({
	// 			type: "object",
	// 			properties: {
	// 				value: {
	// 					type: "string",
	// 					pattern: "^[a-z]+$",
	// 					description: "Lowercase letters only",
	// 				},
	// 			},
	// 			required: ["value"],
	// 		})
	// 	})
	// })

	// describe("objects", () => {
	// 	it("should convert a simple object schema", () => {
	// 		const schema = z
	// 			.object({
	// 				name: z.string().describe("Person name"),
	// 				age: z.number().int().describe("Age in years"),
	// 			})
	// 			.describe("Person information")

	// 		const result = zodToMCPSchema(schema)

	// 		expect(result).toEqual({
	// 			type: "object",
	// 			description: "Person information",
	// 			properties: {
	// 				name: {
	// 					type: "string",
	// 					description: "Person name",
	// 				},
	// 				age: {
	// 					type: "number",
	// 					description: "Age in years",
	// 				},
	// 			},
	// 			required: ["name", "age"],
	// 		})
	// 	})

	// 	it("should handle optional fields in objects", () => {
	// 		const schema = z.object({
	// 			name: z.string().describe("Person name"),
	// 			age: z.number().optional().describe("Optional age"),
	// 		})

	// 		const result = zodToMCPSchema(schema)

	// 		expect(result).toEqual({
	// 			type: "object",
	// 			properties: {
	// 				name: {
	// 					type: "string",
	// 					description: "Person name",
	// 				},
	// 				age: {
	// 					type: "number",
	// 					description: "Optional age",
	// 				},
	// 			},
	// 			required: ["name"],
	// 		})
	// 	})
	// })

	// describe("arrays", () => {
	// 	it("should convert an array schema", () => {
	// 		const schema = z.array(z.string()).describe("List of names")
	// 		const result = zodToMCPSchema(schema)

	// 		expect(result).toEqual({
	// 			type: "object",
	// 			properties: {
	// 				value: {
	// 					type: "array",
	// 					items: {
	// 						type: "string",
	// 					},
	// 					description: "List of names",
	// 				},
	// 			},
	// 			required: ["value"],
	// 		})
	// 	})

	// 	it("should convert an array of objects", () => {
	// 		const schema = z
	// 			.array(
	// 				z.object({
	// 					id: z.number(),
	// 					name: z.string(),
	// 				}),
	// 			)
	// 			.describe("List of users")

	// 		const result = zodToMCPSchema(schema)

	// 		expect(result).toEqual({
	// 			type: "object",
	// 			properties: {
	// 				value: {
	// 					type: "array",
	// 					items: {
	// 						type: "object",
	// 						properties: {
	// 							id: { type: "number" },
	// 							name: { type: "string" },
	// 						},
	// 						required: ["id", "name"],
	// 					},
	// 					description: "List of users",
	// 				},
	// 			},
	// 			required: ["value"],
	// 		})
	// 	})
	// })

	// describe("enums and unions", () => {
	// 	it("should convert an enum schema", () => {
	// 		const schema = z.enum(["red", "green", "blue"]).describe("Color choices")
	// 		const result = zodToMCPSchema(schema)

	// 		expect(result).toEqual({
	// 			type: "object",
	// 			properties: {
	// 				value: {
	// 					type: "string",
	// 					enum: ["red", "green", "blue"],
	// 					description: "Color choices",
	// 				},
	// 			},
	// 			required: ["value"],
	// 		})
	// 	})

	// 	it("should convert a union of literals", () => {
	// 		const schema = z
	// 			.union([z.literal("small"), z.literal("medium"), z.literal("large")])
	// 			.describe("Size options")

	// 		const result = zodToMCPSchema(schema)

	// 		expect(result).toEqual({
	// 			type: "object",
	// 			properties: {
	// 				value: {
	// 					anyOf: [
	// 						{ type: "string", enum: ["small"] },
	// 						{ type: "string", enum: ["medium"] },
	// 						{ type: "string", enum: ["large"] },
	// 					],
	// 					description: "Size options",
	// 					type: "object",
	// 				},
	// 			},
	// 			required: ["value"],
	// 		})
	// 	})
	// })

	// describe("edge cases", () => {
	// 	it("should handle null and undefined", () => {
	// 		const nullSchema = z.null().describe("Null value")
	// 		const undefinedSchema = z.undefined().describe("Undefined value")

	// 		expect(zodToMCPSchema(nullSchema)).toEqual({
	// 			type: "object",
	// 			properties: {
	// 				value: { type: "null" },
	// 			},
	// 			required: ["value"],
	// 		})

	// 		expect(zodToMCPSchema(undefinedSchema)).toEqual({
	// 			type: "object",
	// 			properties: {
	// 				value: { type: "null" },
	// 			},
	// 			required: ["value"],
	// 		})
	// 	})

	// 	it("should handle nullable and optional types", () => {
	// 		const schema = z.string().nullable().describe("Nullable string")
	// 		const result = zodToMCPSchema(schema)

	// 		expect(result).toEqual({
	// 			type: "object",
	// 			properties: {
	// 				value: {
	// 					type: "string",
	// 					description: "Nullable string",
	// 				},
	// 			},
	// 			required: ["value"],
	// 		})
	// 	})
	// })
	describe("drizzle schemas", () => {
		it("should properly convert JSON array fields in drizzle schemas", () => {
			const schema = schemas.factionInsertSchema
			const result = zodToMCPSchema(schema)

			// First, verify that the overall schema structure is correct
			expect(result.type).toBe("object")
			expect(result.properties).toBeDefined()

			// Check that fields with jsonArray are converted to array types
			// These are the fields we know should be arrays based on the schema
			const jsonArrayFields = ["history", "notes", "resources"]

			// Type assertion for result properties to avoid TypeScript errors
			const properties = result.properties as Record<
				string,
				{
					type: string
					items?: unknown
					anyOf?: Array<{
						type: string
						items?: unknown
					}>
				}
			>

			// Verify each JSON array field has the correct structure
			for (const field of jsonArrayFields) {
				const fieldSchema = properties[field]
				if (!fieldSchema) {
					expect(fieldSchema).toBeDefined()
					continue
				}

				// We're checking that our JSON fields are either:
				// 1. Directly identified as arrays (ideal case from our implementation)
				if (fieldSchema.type === "array") {
					expect(fieldSchema.items).toBeDefined()
				}
				// 2. Or at least represented in our generic JSON structure that can handle arrays
				else if (fieldSchema.type === "object" && fieldSchema.anyOf) {
					// There should be an option for arrays in the anyOf
					const hasArrayOption = fieldSchema.anyOf.some((option) => option.type === "array" && option.items)
					expect(hasArrayOption).toBe(true)
				} else {
					// If neither of the above conditions are met, the test should fail
					expect(fieldSchema.type === "array" || (fieldSchema.type === "object" && fieldSchema.anyOf)).toBe(
						true,
					)
				}
			}
		})
	})
	it("should convert a create schema", () => {
		const result = zodToMCP(schemas.factionInsertSchema, {
			skipIdField: true,
			requiredFields: ["name", "type", "history", "notes", "resources"],
			forceRequiredFields: true,
		})

		expect(result).toEqual(expectedResults.createFactionSchema)
	})

	it("should convert a get schema", () => {
		const schema = schemas.factionGetSchema
		const result = zodToMCPSchema(schema)

		expect(result).toEqual(expectedResults.getFactionSchema)
	})

	it("should convert an update schema", () => {
		const result = zodToMCP(schemas.factionUpdateSchema, {
			requiredFields: ["id", "history", "notes", "resources"],
			forceRequiredFields: true,
		})

		expect(result).toEqual(expectedResults.updateFactionSchema)
	})

	it("should convert a relation insert drizzle schema", () => {
		const result = zodToMCP(schemas.factionRelationshipInsertSchema, {
			skipIdField: true,
			requiredFields: ["factionId", "otherFactionId", "type"],
			forceRequiredFields: true,
		})

		expect(result).toEqual(expectedResults.createFactionRelationshipSchema)
	})

	it("should convert a relation update drizzle schema", () => {
		const result = zodToMCP(schemas.factionRelationshipUpdateSchema, {
			requiredFields: ["id", "type"],
			forceRequiredFields: true,
		})

		expect(result).toEqual(expectedResults.updateFactionRelationshipSchema)
	})
})
