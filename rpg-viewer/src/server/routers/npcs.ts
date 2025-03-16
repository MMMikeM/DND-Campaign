import path from "node:path";
import fs from "node:fs";
import yaml from "js-yaml";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { NpcsFileSchema, type Npc } from "../schemas/npcSchema";

export const npcsRouter = router({
	// Get all NPCs
	getAllNpcs: publicProcedure.query(async () => {
		try {
			const npcsFileName = "shattered-spire-generic-npcs.yaml";

			// Define possible locations to look for the file
			const possibleLocations = [
				global.yamlDir
					? path.normalize(path.join(global.yamlDir, npcsFileName))
					: null,
				// Look in the parent directory
				path.normalize(path.join(process.cwd(), "..", npcsFileName)),
				// Look in the public/data directory
				path.join(process.cwd(), "public", "data", npcsFileName),
			].filter(Boolean) as string[];

			console.log("Looking for NPCs file in locations:", possibleLocations);

			// Find the file in possible locations
			let filePath: string | null = null;

			for (const location of possibleLocations) {
				if (fs.existsSync(location)) {
					filePath = location;
					break;
				}
			}

			if (filePath) {
				console.log("NPCs file found at:", filePath);

				try {
					const fileContent = fs.readFileSync(filePath, "utf8");
					const parsedYaml = yaml.load(fileContent);

					// Validate data against schema
					const validatedData = NpcsFileSchema.parse(parsedYaml);

					// Transform data for the UI - add an ID based on the NPC name
					const npcs = [
						...(validatedData.npcs || []).map((npc) => ({
							...npc,
							id: npc.name.toLowerCase().replace(/\s+/g, "_"),
						})),
						...(validatedData.generic_npcs || []).map((npc) => ({
							...npc,
							id: npc.name.toLowerCase().replace(/\s+/g, "_"),
						})),
					];

					return {
						title: validatedData.title,
						version: validatedData.version,
						description: validatedData.description,
						npcs,
					};
				} catch (readErr) {
					console.error("Error reading NPCs file:", readErr);
					throw new Error(
						`Failed to read or parse NPCs file: ${(readErr as Error).message}`,
					);
				}
			}

			console.log("NPCs file not found in any location");
			throw new Error("NPCs file not found");
		} catch (error) {
			console.error("Error fetching NPCs:", error);
			throw new Error(`Failed to fetch NPCs data: ${(error as Error).message}`);
		}
	}),

	// Get a specific NPC by name or ID
	getNpcByNameOrId: publicProcedure
		.input(z.string())
		.query(async ({ input }) => {
			try {
				const npcsFileName = "shattered-spire-generic-npcs.yaml";

				// Define possible locations to look for the file
				const possibleLocations = [
					global.yamlDir
						? path.normalize(path.join(global.yamlDir, npcsFileName))
						: null,
					// Look in the parent directory
					path.normalize(path.join(process.cwd(), "..", npcsFileName)),
					// Look in the public/data directory
					path.join(process.cwd(), "public", "data", npcsFileName),
				].filter(Boolean) as string[];

				console.log("Looking for NPCs file in locations:", possibleLocations);

				// Find the file in possible locations
				let filePath: string | null = null;

				for (const location of possibleLocations) {
					if (fs.existsSync(location)) {
						filePath = location;
						break;
					}
				}

				if (filePath) {
					console.log("NPCs file found at:", filePath);

					try {
						const fileContent = fs.readFileSync(filePath, "utf8");
						const parsedYaml = yaml.load(fileContent);

						// Validate data against schema
						const validatedData = NpcsFileSchema.parse(parsedYaml);

						// Look for the NPC with the specified name or ID
						const normalizedInput = input.toLowerCase().replace(/[-_]/g, " ");

						// Try to find the NPC in the main npcs array
						let npc = validatedData.npcs.find(
							(npc) =>
								npc.name.toLowerCase() === normalizedInput ||
								npc.name.toLowerCase().replace(/\s+/g, "_") === input,
						);

						// If not found in main array, try in generic_npcs
						if (!npc && validatedData.generic_npcs) {
							npc = validatedData.generic_npcs.find(
								(npc) =>
									npc.name.toLowerCase() === normalizedInput ||
									npc.name.toLowerCase().replace(/\s+/g, "_") === input,
							);
						}

						if (npc) {
							return {
								...npc,
								id: npc.name.toLowerCase().replace(/\s+/g, "_"),
							};
						}

						// If we get here, no NPC was found
						console.log(`NPC with name or ID ${input} not found`);
						return null;
					} catch (readErr) {
						console.error("Error reading NPCs file:", readErr);
						throw new Error(
							`Failed to read or parse NPCs file: ${(readErr as Error).message}`,
						);
					}
				}

				console.log(`NPCs file not found for input: ${input}`);
				throw new Error("NPCs file not found");
			} catch (error) {
				console.error(`Error fetching NPC ${input}:`, error);
				throw new Error(
					`Failed to fetch NPC data: ${(error as Error).message}`,
				);
			}
		}),
});
