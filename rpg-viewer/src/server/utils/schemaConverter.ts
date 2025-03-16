import fs from "node:fs";
import path from "node:path";
import { jsonSchemaToZod, type JsonSchema } from "json-schema-to-zod";

/**
 * Converts a JSON schema file to a Zod validation schema
 * @param schemaPath Path to the JSON schema file relative to the project root
 * @param options Configuration options for the conversion
 * @returns Generated Zod schema as a string
 */
export function convertJsonSchemaToZod(
	schemaPath: string,
	options: {
		zodSchemaName?: string;
		withJsdocs?: boolean;
		withoutDefaults?: boolean;
		withoutDescribes?: boolean;
	} = {},
): string {
	try {
		// Determine the full path - need to go up one level from the current directory
		const fullPath = path.join(process.cwd(), "..", schemaPath);

		// Read the JSON file
		const jsonContent = fs.readFileSync(fullPath, "utf8");

		// Parse JSON content to object
		const jsonSchema = JSON.parse(jsonContent) as JsonSchema;

		// Convert JSON Schema to Zod
		const zodSchema = jsonSchemaToZod(jsonSchema, {
			name: options.zodSchemaName ?? "Schema",
			withJsdocs: options.withJsdocs ?? true,
			withoutDefaults: options.withoutDefaults,
			withoutDescribes: options.withoutDescribes,
		});

		return zodSchema;
	} catch (error) {
		console.error(`Failed to convert JSON schema at ${schemaPath}:`, error);
		throw new Error(
			`JSON schema conversion failed: ${(error as Error).message}`,
		);
	}
}

/**
 * Loads a schema file (YAML or JSON), converts it to a Zod schema, and generates a TypeScript file
 * @param schemaPath Path to the schema file relative to the project root
 * @param outputPath Path to write the generated TypeScript file
 * @param options Configuration options
 */
export function generateZodSchemaFile(
	schemaPath: string,
	outputPath: string,
	options: {
		zodSchemaName?: string;
		typeName?: string;
		withJsdocs?: boolean;
		withoutDefaults?: boolean;
		withoutDescribes?: boolean;
		additionalImports?: string[];
	} = {},
): void {
	try {
		// Determine which converter to use based on file extension
		const fileExtension = path.extname(schemaPath).toLowerCase();
		let zodSchema: string;

			zodSchema = convertJsonSchemaToZod(schemaPath, {
				zodSchemaName: options.zodSchemaName,
				withJsdocs: options.withJsdocs,
				withoutDefaults: options.withoutDefaults,
				withoutDescribes: options.withoutDescribes,
			});

		// Build the complete TypeScript file content
		const imports = ['import { z } from "zod";'];

		if (options.additionalImports?.length) {
			imports.push(...options.additionalImports);
		}

		let fileContent = `${imports.join("\n")}\n\n`;

		// Replace 'const X =' with 'export const X ='
		const schemaName = options.zodSchemaName ?? "Schema";
		if (zodSchema.indexOf(`const ${schemaName} =`) !== -1) {
			fileContent += zodSchema.replace(
				`const ${schemaName} =`,
				`export const ${schemaName} =`,
			);
		} else {
			fileContent += zodSchema;
		}

		// Add TypeScript type export if requested
		if (options.typeName) {
			fileContent += `\n\n// Export TypeScript type\nexport type ${options.typeName} = z.infer<typeof ${options.zodSchemaName ?? "Schema"}>;`;
		}

		// Determine the full output path
		const fullOutputPath = path.join(process.cwd(), outputPath);

		// Ensure directory exists
		const dirPath = path.dirname(fullOutputPath);
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}

		// Write the file
		fs.writeFileSync(fullOutputPath, fileContent);
		console.log(`Generated Zod schema file at: ${fullOutputPath}`);
	} catch (error) {
		console.error(
			`Failed to generate schema file from ${schemaPath} to ${outputPath}:`,
			error,
		);
		throw new Error(
			`Schema file generation failed: ${(error as Error).message}`,
		);
	}
}
