import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import path from "node:path";
import fs from "node:fs";
import yaml from "js-yaml";
import { FactionsFileSchema } from "../schemas/factionSchema";

export const factionsRouter = router({
	// Get all factions
	getAllFactions: publicProcedure.query(async () => {
		try {
			const factionsFileName = "shattered-spire-factions.yaml";

			// Define possible locations to look for the file
			const possibleLocations = [
				global.yamlDir
					? path.normalize(path.join(global.yamlDir, factionsFileName))
					: null,
				// Look in the parent directory
				path.normalize(path.join(process.cwd(), "..", factionsFileName)),
				// Look in the public/data directory
				path.join(process.cwd(), "public", "data", factionsFileName),
			].filter(Boolean) as string[];

			console.log("Looking for factions file in locations:", possibleLocations);

			// Find the file in possible locations
			let filePath: string | null = null;

			for (const location of possibleLocations) {
				if (fs.existsSync(location)) {
					filePath = location;
					break;
				}
			}

			if (filePath) {
				console.log("Factions file found at:", filePath);

				try {
					const fileContent = fs.readFileSync(filePath, "utf8");
					const parsedYaml = yaml.load(fileContent);

					// Validate data against schema
					const validatedData = FactionsFileSchema.parse(parsedYaml);

					// Transform data for the UI
					return {
						factions: Object.entries(validatedData.factions).map(
							([id, faction]) => ({
								id,
								...faction,
							}),
						),
						title: validatedData.title,
						version: validatedData.version,
						description: validatedData.description,
					};
				} catch (readErr) {
					console.error("Error reading factions file:", readErr);
					throw new Error(
						`Failed to read or parse factions file: ${
							(readErr as Error).message
						}`,
					);
				}
			}

			console.log("Factions file not found in any location");
			throw new Error("Factions file not found");
		} catch (error) {
			console.error("Error fetching factions:", error);
			throw new Error(
				`Failed to fetch factions data: ${(error as Error).message}`,
			);
		}
	}),

	// Get a specific faction by ID
	getFactionById: publicProcedure.input(z.string()).query(async ({ input }) => {
		try {
			const factionsFileName = "shattered-spire-factions.yaml";

			// Define possible locations to look for the file
			const possibleLocations = [
				global.yamlDir
					? path.normalize(path.join(global.yamlDir, factionsFileName))
					: null,
				// Look in the parent directory
				path.normalize(path.join(process.cwd(), "..", factionsFileName)),
				// Look in the public/data directory
				path.join(process.cwd(), "public", "data", factionsFileName),
			].filter(Boolean) as string[];

			console.log("Looking for factions file in locations:", possibleLocations);

			// Find the file in possible locations
			let filePath: string | null = null;

			for (const location of possibleLocations) {
				if (fs.existsSync(location)) {
					filePath = location;
					break;
				}
			}

			if (filePath) {
				console.log("Factions file found at:", filePath);

				try {
					const fileContent = fs.readFileSync(filePath, "utf8");
					const parsedYaml = yaml.load(fileContent);

					// Validate data against schema
					const validatedData = FactionsFileSchema.parse(parsedYaml);

					// Get the specific faction
					const faction = validatedData.factions[input];

					if (!faction) {
						throw new Error(`Faction with ID ${input} not found`);
					}

					return {
						id: input,
						...faction,
					};
				} catch (readErr) {
					console.error("Error reading factions file:", readErr);
					throw new Error(
						`Failed to read or parse factions file: ${
							(readErr as Error).message
						}`,
					);
				}
			}

			console.log(`Factions file not found for ID: ${input}`);
			throw new Error("Factions file not found");
		} catch (error) {
			console.error(`Error fetching faction ${input}:`, error);
			throw new Error(
				`Failed to fetch faction data: ${(error as Error).message}`,
			);
		}
	}),
});
