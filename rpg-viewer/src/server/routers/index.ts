import { router } from "../trpc";
import { yamlRouter } from "./yaml";
import { factionsRouter } from "./factions";
import { questsRouter } from "./quests";
import { locationsRouter } from "./locations";
import { npcsRouter } from "./npcs";

export const appRouter = router({
	yaml: yamlRouter,
	factions: factionsRouter,
	quests: questsRouter,
	locations: locationsRouter,
	npcs: npcsRouter,
});

// Export the router type
export type AppRouter = typeof appRouter;
