import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import path from "path";
import fs from "fs";
import yaml from "js-yaml";
import { QuestsFileSchema, Quest } from "../schemas/questSchema";

export const questsRouter = router({
  // Get all quests
  getAllQuests: publicProcedure.query(async () => {
    try {
      const questsFileName = "shattered-spire-quests.yaml";

      // Define possible locations to look for the file
      const possibleLocations = [
        global.yamlDir
          ? path.normalize(path.join(global.yamlDir, questsFileName))
          : null,
        // Look in the parent directory
        path.normalize(path.join(process.cwd(), "..", questsFileName)),
        // Look in the public/data directory
        path.join(process.cwd(), "public", "data", questsFileName),
      ].filter(Boolean) as string[];

      console.log("Looking for quests file in locations:", possibleLocations);

      // Find the file in possible locations
      let filePath: string | null = null;

      for (const location of possibleLocations) {
        if (fs.existsSync(location)) {
          filePath = location;
          break;
        }
      }

      if (filePath) {
        console.log("Quests file found at:", filePath);

        try {
          const fileContent = fs.readFileSync(filePath, "utf8");
          const parsedYaml = yaml.load(fileContent);

          // Validate data against schema
          const validatedData = QuestsFileSchema.parse(parsedYaml);

          // Combine all quest types into a single array with category information
          const allQuests = [
            ...(validatedData.main_quests || []).map((quest) => ({
              ...quest,
              category: "main_quest",
            })),
            ...(validatedData.side_quests || []).map((quest) => ({
              ...quest,
              category: "side_quest",
            })),
            ...(validatedData.faction_quests || []).map((quest) => ({
              ...quest,
              category: "faction_quest",
            })),
            ...(validatedData.personal_quests || []).map((quest) => ({
              ...quest,
              category: "personal_quest",
            })),
          ];

          // Transform data for the UI
          return {
            quests: allQuests,
            title: validatedData.title,
            version: validatedData.version,
            description: validatedData.description,
          };
        } catch (readErr) {
          console.error("Error reading quests file:", readErr);
          throw new Error(
            `Failed to read or parse quests file: ${(readErr as Error).message}`
          );
        }
      }

      console.log("Quests file not found in any location");
      throw new Error("Quests file not found");
    } catch (error) {
      console.error("Error fetching quests:", error);
      throw new Error(
        `Failed to fetch quests data: ${(error as Error).message}`
      );
    }
  }),

  // Get a specific quest by ID
  getQuestById: publicProcedure.input(z.string()).query(async ({ input }) => {
    // If the input looks like a file name rather than a quest ID, return null
    if (input.includes("quests") || input.length === 0) {
      return null;
    }

    try {
      const questsFileName = "shattered-spire-quests.yaml";

      // Define possible locations to look for the file
      const possibleLocations = [
        global.yamlDir
          ? path.normalize(path.join(global.yamlDir, questsFileName))
          : null,
        // Look in the parent directory
        path.normalize(path.join(process.cwd(), "..", questsFileName)),
        // Look in the public/data directory
        path.join(process.cwd(), "public", "data", questsFileName),
      ].filter(Boolean) as string[];

      console.log("Looking for quests file in locations:", possibleLocations);

      // Find the file in possible locations
      let filePath: string | null = null;

      for (const location of possibleLocations) {
        if (fs.existsSync(location)) {
          filePath = location;
          break;
        }
      }

      if (filePath) {
        console.log("Quests file found at:", filePath);

        try {
          const fileContent = fs.readFileSync(filePath, "utf8");
          const parsedYaml = yaml.load(fileContent);

          // Validate data against schema
          const validatedData = QuestsFileSchema.parse(parsedYaml);

          // Search for the quest in all quest arrays
          const allQuestArrays = [
            { quests: validatedData.main_quests || [], category: "main_quest" },
            { quests: validatedData.side_quests || [], category: "side_quest" },
            {
              quests: validatedData.faction_quests || [],
              category: "faction_quest",
            },
            {
              quests: validatedData.personal_quests || [],
              category: "personal_quest",
            },
          ];

          for (const { quests, category } of allQuestArrays) {
            const quest = quests.find((q) => q.id === input);
            if (quest) {
              return {
                ...quest,
                category,
              };
            }
          }

          // If we get here, no quest was found
          console.log(`Quest with ID ${input} not found`);
          return null; // Return null instead of throwing an error
        } catch (readErr) {
          console.error("Error reading quests file:", readErr);
          throw new Error(
            `Failed to read or parse quests file: ${(readErr as Error).message}`
          );
        }
      }

      console.log(`Quests file not found for ID: ${input}`);
      throw new Error("Quests file not found");
    } catch (error) {
      console.error(`Error fetching quest ${input}:`, error);
      throw new Error(
        `Failed to fetch quest data: ${(error as Error).message}`
      );
    }
  }),

  // Get quests by category
  getQuestsByCategory: publicProcedure
    .input(
      z.enum(["main_quest", "side_quest", "faction_quest", "personal_quest"])
    )
    .query(async ({ input }) => {
      try {
        const questsFileName = "shattered-spire-quests.yaml";

        // Define possible locations to look for the file
        const possibleLocations = [
          global.yamlDir
            ? path.normalize(path.join(global.yamlDir, questsFileName))
            : null,
          // Look in the parent directory
          path.normalize(path.join(process.cwd(), "..", questsFileName)),
          // Look in the public/data directory
          path.join(process.cwd(), "public", "data", questsFileName),
        ].filter(Boolean) as string[];

        console.log("Looking for quests file in locations:", possibleLocations);

        // Find the file in possible locations
        let filePath: string | null = null;

        for (const location of possibleLocations) {
          if (fs.existsSync(location)) {
            filePath = location;
            break;
          }
        }

        if (filePath) {
          console.log("Quests file found at:", filePath);

          try {
            const fileContent = fs.readFileSync(filePath, "utf8");
            const parsedYaml = yaml.load(fileContent);

            // Validate data against schema
            const validatedData = QuestsFileSchema.parse(parsedYaml);

            // Map the category input to the corresponding property name in the file
            const categoryMap = {
              main_quest: "main_quests",
              side_quest: "side_quests",
              faction_quest: "faction_quests",
              personal_quest: "personal_quests",
            };

            const propertyName = categoryMap[input];
            const questsArray =
              validatedData[propertyName as keyof typeof validatedData];

            // Transform data for the UI with proper type checking
            const typedQuests = Array.isArray(questsArray)
              ? (questsArray as Quest[])
              : [];

            return {
              quests: typedQuests.map((quest) => ({
                ...quest,
                category: input,
              })),
              title: validatedData.title,
              version: validatedData.version,
              description: validatedData.description,
            };
          } catch (readErr) {
            console.error("Error reading quests file:", readErr);
            throw new Error(
              `Failed to read or parse quests file: ${
                (readErr as Error).message
              }`
            );
          }
        }

        console.log("Quests file not found in any location");
        throw new Error("Quests file not found");
      } catch (error) {
        console.error(`Error fetching quests for category ${input}:`, error);
        throw new Error(
          `Failed to fetch quests data: ${(error as Error).message}`
        );
      }
    }),
});
