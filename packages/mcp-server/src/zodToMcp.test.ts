import { describe, it, expect } from "vitest"
import { z } from "zod"
import zodToMCPSchema from "./zodToMcp"

describe("zodToMCPSchema", () => {
	describe("primitives", () => {
		it("should convert a string schema", () => {
			const schema = z.string().describe("A string field")
			const result = zodToMCPSchema(schema)

			expect(result).toEqual({
				type: "object",
				properties: {
					value: {
						type: "string",
						description: "A string field",
					},
				},
				required: ["value"],
			})
		})

		it("should convert a number schema with constraints", () => {
			const schema = z.number().min(0).max(100).describe("A number with range")
			const result = zodToMCPSchema(schema)

			expect(result).toEqual({
				type: "object",
				properties: {
					value: {
						type: "number",
						minimum: 0,
						maximum: 100,
						description: "A number with range",
					},
				},
				required: ["value"],
			})
		})

		it("should convert a boolean schema", () => {
			const schema = z.boolean().describe("A boolean field")
			const result = zodToMCPSchema(schema)

			expect(result).toEqual({
				type: "object",
				properties: {
					value: {
						type: "boolean",
						description: "A boolean field",
					},
				},
				required: ["value"],
			})
		})
	})

	describe("strings with formats", () => {
		it("should convert email format", () => {
			const schema = z.string().email().describe("Email address")
			const result = zodToMCPSchema(schema)

			expect(result).toEqual({
				type: "object",
				properties: {
					value: {
						type: "string",
						format: "email",
						description: "Email address",
					},
				},
				required: ["value"],
			})
		})

		it("should convert URL format", () => {
			const schema = z.string().url().describe("Website URL")
			const result = zodToMCPSchema(schema)

			expect(result).toEqual({
				type: "object",
				properties: {
					value: {
						type: "string",
						format: "uri",
						description: "Website URL",
					},
				},
				required: ["value"],
			})
		})

		it("should convert regex pattern", () => {
			const schema = z
				.string()
				.regex(/^[a-z]+$/)
				.describe("Lowercase letters only")
			const result = zodToMCPSchema(schema)

			expect(result).toEqual({
				type: "object",
				properties: {
					value: {
						type: "string",
						pattern: "^[a-z]+$",
						description: "Lowercase letters only",
					},
				},
				required: ["value"],
			})
		})
	})

	describe("objects", () => {
		it("should convert a simple object schema", () => {
			const schema = z
				.object({
					name: z.string().describe("Person name"),
					age: z.number().int().describe("Age in years"),
				})
				.describe("Person information")

			const result = zodToMCPSchema(schema)

			expect(result).toEqual({
				type: "object",
				description: "Person information",
				properties: {
					name: {
						type: "string",
						description: "Person name",
					},
					age: {
						type: "number",
						description: "Age in years",
					},
				},
				required: ["name", "age"],
			})
		})

		it("should handle optional fields in objects", () => {
			const schema = z.object({
				name: z.string().describe("Person name"),
				age: z.number().optional().describe("Optional age"),
			})

			const result = zodToMCPSchema(schema)

			expect(result).toEqual({
				type: "object",
				properties: {
					name: {
						type: "string",
						description: "Person name",
					},
					age: {
						type: "number",
						description: "Optional age",
					},
				},
				required: ["name"],
			})
		})
	})

	describe("arrays", () => {
		it("should convert an array schema", () => {
			const schema = z.array(z.string()).describe("List of names")
			const result = zodToMCPSchema(schema)

			expect(result).toEqual({
				type: "object",
				properties: {
					value: {
						type: "array",
						items: {
							type: "string",
						},
						description: "List of names",
					},
				},
				required: ["value"],
			})
		})

		it("should convert an array of objects", () => {
			const schema = z
				.array(
					z.object({
						id: z.number(),
						name: z.string(),
					}),
				)
				.describe("List of users")

			const result = zodToMCPSchema(schema)

			expect(result).toEqual({
				type: "object",
				properties: {
					value: {
						type: "array",
						items: {
							type: "object",
							properties: {
								id: { type: "number" },
								name: { type: "string" },
							},
							required: ["id", "name"],
						},
						description: "List of users",
					},
				},
				required: ["value"],
			})
		})
	})

	describe("enums and unions", () => {
		it("should convert an enum schema", () => {
			const schema = z.enum(["red", "green", "blue"]).describe("Color choices")
			const result = zodToMCPSchema(schema)

			expect(result).toEqual({
				type: "object",
				properties: {
					value: {
						type: "string",
						enum: ["red", "green", "blue"],
						description: "Color choices",
					},
				},
				required: ["value"],
			})
		})

		it("should convert a union of literals", () => {
			const schema = z
				.union([z.literal("small"), z.literal("medium"), z.literal("large")])
				.describe("Size options")

			const result = zodToMCPSchema(schema)

			expect(result).toEqual({
				type: "object",
				properties: {
					value: {
						anyOf: [
							{ type: "string", enum: ["small"] },
							{ type: "string", enum: ["medium"] },
							{ type: "string", enum: ["large"] },
						],
						description: "Size options",
						type: "object",
					},
				},
				required: ["value"],
			})
		})
	})

	describe("edge cases", () => {
		it("should handle null and undefined", () => {
			const nullSchema = z.null().describe("Null value")
			const undefinedSchema = z.undefined().describe("Undefined value")

			expect(zodToMCPSchema(nullSchema)).toEqual({
				type: "object",
				properties: {
					value: { type: "null" },
				},
				required: ["value"],
			})

			expect(zodToMCPSchema(undefinedSchema)).toEqual({
				type: "object",
				properties: {
					value: { type: "null" },
				},
				required: ["value"],
			})
		})

		it("should handle nullable and optional types", () => {
			const schema = z.string().nullable().describe("Nullable string")
			const result = zodToMCPSchema(schema)

			expect(result).toEqual({
				type: "object",
				properties: {
					value: {
						type: "string",
						description: "Nullable string",
					},
				},
				required: ["value"],
			})
		})
	})

	describe("complex schemas", () => {
		it("should convert a complex nested schema", () => {
			const schema = z
				.object({
					user: z.object({
						id: z.number(),
						name: z.string(),
						email: z.string().email().optional(),
						preferences: z.object({
							theme: z.enum(["light", "dark"]),
							notifications: z.boolean(),
						}),
					}),
					posts: z
						.array(
							z.object({
								id: z.number(),
								title: z.string(),
								tags: z.array(z.string()),
							}),
						)
						.optional(),
				})
				.describe("User profile with posts")

			const result = zodToMCPSchema(schema)

			expect(result).toEqual({
				type: "object",
				description: "User profile with posts",
				properties: {
					user: {
						type: "object",
						properties: {
							id: { type: "number" },
							name: { type: "string" },
							email: { type: "string", format: "email" },
							preferences: {
								type: "object",
								properties: {
									theme: { type: "string", enum: ["light", "dark"] },
									notifications: { type: "boolean" },
								},
								required: ["theme", "notifications"],
							},
						},
						required: ["id", "name", "preferences"],
					},
					posts: {
						type: "array",
						items: {
							type: "object",
							properties: {
								id: { type: "number" },
								title: { type: "string" },
								tags: {
									type: "array",
									items: { type: "string" },
								},
							},
							required: ["id", "title", "tags"],
						},
					},
				},
				required: ["user"],
			})
		})
	})
})
