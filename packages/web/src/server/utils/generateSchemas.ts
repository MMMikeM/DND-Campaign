import { generateZodSchemaFile } from "./schemaConverter";
import fs from "node:fs";
import path from "node:path";
import { glob } from "glob";

/**
 * This script generates Zod schemas from our schema files
 */
async function generateAllSchemas() {
	console.log("Generating Zod schemas from schema files...");

	// Ensure the generated schemas directory exists
	const generatedDir = path.join(process.cwd(), "src/server/schemas/generated");
	if (!fs.existsSync(generatedDir)) {
		fs.mkdirSync(generatedDir, { recursive: true });
	}

	// Get all schema files
	const campaignsPath = path.join(process.cwd(), "..", "campaigns");
	const schemaGlob = await glob("**/.schema.json", {
		cwd: campaignsPath,
		absolute: false
	});
	
	// Convert absolute paths to relative paths (relative to workspace root)
	const schemaFiles = schemaGlob.map(file => path.join("campaigns", file));
	console.log("Found schema files:", schemaFiles);

	// Track generated schema files for barrel export
	const generatedSchemas: string[] = [];

	// Process each schema file
	for (const schemaFile of schemaFiles) {
		// Extract entity type from directory path
		// e.g., "campaigns/shattered-spire/quests/.schema.json" => "quests"
		const pathParts = schemaFile.split("/");
		const entityType = pathParts[pathParts.length - 2];
		
		// Convert to singular for type name, e.g., "quests" => "Quest"
		const singularEntity = entityType.endsWith('s') 
			? entityType.slice(0, -1) 
			: entityType;
		
		// Capitalize first letter for type name, e.g., "quest" => "Quest"
		const typeName = singularEntity.charAt(0).toUpperCase() + singularEntity.slice(1);
		
		// Output file and schema naming
		const outputFile = `src/server/schemas/generated/${entityType}Schema.ts`;
		const zodSchemaName = `${typeName}sFileSchema`;
		const typeFileName = `${typeName}sFile`;
		
		console.log(`Generating schema for ${entityType} from ${schemaFile} -> ${outputFile}`);
		
		// Generate schema
		generateZodSchemaFile(
			schemaFile,
			outputFile,
			{
				zodSchemaName,
				typeName: typeFileName,
				withJsdocs: true,
				additionalImports: [],
			},
		);
		
		// Add to list of generated schemas
		generatedSchemas.push(entityType);
	}

	// Create barrel file to re-export all schemas
	const barrelImports = generatedSchemas
		.map(type => `export * from './generated/${type}Schema';`)
		.join('\n');
	
	const barrelContent = `// Auto-generated barrel file for schemas - DO NOT EDIT
${barrelImports}
`;

	fs.writeFileSync(
		path.join(process.cwd(), "src/server/schemas/index.ts"),
		barrelContent,
		"utf8",
	);

	console.log("Schema generation complete!");
}

// Run the script if this file is executed directly
if (require.main === module) {
	generateAllSchemas().catch((error) => {
		console.error("Error generating schemas:", error);
		process.exit(1);
	});
}

export { generateAllSchemas };
