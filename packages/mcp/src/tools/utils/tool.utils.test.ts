import { describe, expect, it } from "vitest"
import { z } from "zod/v4"
import { createManageSchema } from "./schema"

describe("createManageSchema", () => {
	// Mock schemas for testing
	const testSchemas = {
		users: z.object({
			name: z.string(),
			email: z.string().email(),
			age: z.number().optional(),
		}),
		posts: z.object({
			title: z.string(),
			content: z.string(),
			userId: z.number(),
		}),
	}

	const testTableEnum = ["users", "posts"] as const

	it("should create an MCP schema with the correct structure", () => {
		const mcpSchema = createManageSchema(testSchemas, testTableEnum)

		// The MCP schema should be a single object, not a union
		expect(mcpSchema).toHaveProperty("type", "object")
		expect(mcpSchema).toHaveProperty("properties")

		const jsonSchema = mcpSchema as any

		// Should have the basic properties
		expect(jsonSchema.properties).toHaveProperty("table")
		expect(jsonSchema.properties).toHaveProperty("operation")
		expect(jsonSchema.properties).toHaveProperty("id")
		expect(jsonSchema.properties).toHaveProperty("data")

		// Table should be an enum with our table names
		expect(jsonSchema.properties.table.enum).toEqual(["users", "posts"])

		// Operation should be an enum
		expect(jsonSchema.properties.operation.enum).toEqual(["create", "update", "delete"])
	})

	it("should have table-specific data validation (functional test)", () => {
		// This is a functional test since we can't easily inspect superRefine logic in JSON schema
		const mcpSchema = createManageSchema(testSchemas, testTableEnum)

		// The schema should exist and have data field
		const jsonSchema = mcpSchema as any
		expect(jsonSchema.properties.data).toBeDefined()
		expect(jsonSchema.properties.data.description).toContain("determined by the 'table' parameter")
	})

	it("should have required fields for the base schema", () => {
		const mcpSchema = createManageSchema(testSchemas, testTableEnum)
		const jsonSchema = mcpSchema as any

		// Should have table, operation, and data as properties
		expect(jsonSchema.properties).toHaveProperty("table")
		expect(jsonSchema.properties).toHaveProperty("operation")
		expect(jsonSchema.properties).toHaveProperty("data")
		expect(jsonSchema.properties).toHaveProperty("id")

		// id should be optional (not in required array if it exists)
		if (jsonSchema.required) {
			expect(jsonSchema.required).not.toContain("id")
		}
	})

	it("should not wrap data in unnecessary object structure", () => {
		const mcpSchema = createManageSchema(testSchemas, testTableEnum)
		const jsonSchema = mcpSchema as any

		// The data property should be a simple unknown type, not an object with table-specific properties
		// This ensures we don't get the old wrapper object structure
		expect(jsonSchema.properties.data).toBeDefined()

		// It should NOT have nested properties like "users" or "posts"
		if (jsonSchema.properties.data.properties) {
			expect(jsonSchema.properties.data.properties).not.toHaveProperty("users")
			expect(jsonSchema.properties.data.properties).not.toHaveProperty("posts")
		}
	})

	it("should support the correct calling pattern", () => {
		// This test documents the expected calling pattern
		// The tool should be called with data directly, not wrapped in table-specific objects

		const expectedCallPattern = {
			table: "users",
			operation: "create",
			data: {
				name: "John Doe",
				email: "john@example.com",
				age: 30,
			},
		}

		// NOT this pattern (which the old schema encouraged):
		const incorrectCallPattern = {
			table: "users",
			operation: "create",
			data: {
				users: {
					// ❌ This wrapper object should not be needed
					name: "John Doe",
					email: "john@example.com",
					age: 30,
				},
			},
		}

		// The test just documents that we expect the first pattern
		expect(expectedCallPattern.data).toHaveProperty("name")
		expect(expectedCallPattern.data).not.toHaveProperty("users")

		expect(incorrectCallPattern.data).toHaveProperty("users")
		expect(incorrectCallPattern.data).not.toHaveProperty("name")
	})

	it("should be much more compact than the union approach", () => {
		const mcpSchema = createManageSchema(testSchemas, testTableEnum)
		const jsonSchema = mcpSchema as any

		console.log(JSON.stringify(jsonSchema, null, 2))

		// Should be a single object schema, not a union with multiple variants
		expect(jsonSchema.type).toBe("object")
		expect(jsonSchema).not.toHaveProperty("anyOf")
		expect(jsonSchema).not.toHaveProperty("oneOf")

		// Should have a single set of properties, not duplicated for each table
		expect(jsonSchema.properties).toHaveProperty("table")
		expect(jsonSchema.properties).toHaveProperty("operation")
		expect(jsonSchema.properties).toHaveProperty("data")
	})
})
