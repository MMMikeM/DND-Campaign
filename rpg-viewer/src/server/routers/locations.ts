import path from "path";
import fs from "fs";
import yaml from "js-yaml";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { LocationsFileSchema, type Location } from "../schemas/locationSchema";

export const locationsRouter = router({
  // Get all locations
  getAllLocations: publicProcedure.query(async () => {
    try {
      const locationsFileName = "shattered-spire-locations.yaml";

      // Define possible locations to look for the file
      const possibleLocations = [
        global.yamlDir
          ? path.normalize(path.join(global.yamlDir, locationsFileName))
          : null,
        // Look in the parent directory
        path.normalize(path.join(process.cwd(), "..", locationsFileName)),
        // Look in the public/data directory
        path.join(process.cwd(), "public", "data", locationsFileName),
      ].filter(Boolean) as string[];

      console.log(
        "Looking for locations file in locations:",
        possibleLocations
      );

      // Find the file in possible locations
      let filePath: string | null = null;

      for (const location of possibleLocations) {
        if (fs.existsSync(location)) {
          filePath = location;
          break;
        }
      }

      if (filePath) {
        console.log("Locations file found at:", filePath);

        try {
          const fileContent = fs.readFileSync(filePath, "utf8");
          const parsedYaml = yaml.load(fileContent);

          // Validate data against schema
          const validatedData = LocationsFileSchema.parse(parsedYaml);

          // Transform the data to include IDs and names
          const locations: Location[] = Object.entries(
            validatedData.locations
          ).map(([id, locationData]) => ({
            ...locationData,
            id,
            name: id
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()), // Format the ID to be a readable name
          }));

          return {
            title: validatedData.title,
            version: validatedData.version,
            locations,
          };
        } catch (readErr) {
          console.error("Error reading locations file:", readErr);
          throw new Error(
            `Failed to read or parse locations file: ${
              (readErr as Error).message
            }`
          );
        }
      }

      console.log("Locations file not found in any location");
      throw new Error("Locations file not found");
    } catch (error) {
      console.error("Error fetching locations:", error);
      throw new Error(
        `Failed to fetch locations data: ${(error as Error).message}`
      );
    }
  }),

  // Get a specific location by ID
  getLocationById: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      // If the input looks like a file name rather than a location ID, return null
      if (input.includes("locations") || input.length === 0) {
        return null;
      }

      try {
        const locationsFileName = "shattered-spire-locations.yaml";

        // Define possible locations to look for the file
        const possibleLocations = [
          global.yamlDir
            ? path.normalize(path.join(global.yamlDir, locationsFileName))
            : null,
          // Look in the parent directory
          path.normalize(path.join(process.cwd(), "..", locationsFileName)),
          // Look in the public/data directory
          path.join(process.cwd(), "public", "data", locationsFileName),
        ].filter(Boolean) as string[];

        console.log(
          "Looking for locations file in locations:",
          possibleLocations
        );

        // Find the file in possible locations
        let filePath: string | null = null;

        for (const location of possibleLocations) {
          if (fs.existsSync(location)) {
            filePath = location;
            break;
          }
        }

        if (filePath) {
          console.log("Locations file found at:", filePath);

          try {
            const fileContent = fs.readFileSync(filePath, "utf8");
            const parsedYaml = yaml.load(fileContent);

            // Validate data against schema
            const validatedData = LocationsFileSchema.parse(parsedYaml);

            // Look for the location with the specified ID
            const locationData = validatedData.locations[input];

            if (locationData) {
              // Format the location name
              const name = input
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase());

              return {
                ...locationData,
                id: input,
                name,
              };
            }

            // If we get here, no location was found
            console.log(`Location with ID ${input} not found`);
            return null; // Return null instead of throwing an error
          } catch (readErr) {
            console.error("Error reading locations file:", readErr);
            throw new Error(
              `Failed to read or parse locations file: ${
                (readErr as Error).message
              }`
            );
          }
        }

        console.log(`Locations file not found for ID: ${input}`);
        throw new Error("Locations file not found");
      } catch (error) {
        console.error(`Error fetching location ${input}:`, error);
        throw new Error(
          `Failed to fetch location data: ${(error as Error).message}`
        );
      }
    }),
});
