import { factions, locations, npcs, quests } from "@tome-master/shared";
import { createSelectSchema } from "drizzle-zod";

import { z } from "zod";

const factionSchema = createSelectSchema(factions);
const locationSchema = createSelectSchema(locations);
const npcSchema = createSelectSchema(npcs);
const questSchema = createSelectSchema(quests);

export type Faction = z.infer<typeof factionSchema>;
export type Location = z.infer<typeof locationSchema>;
export type Npc = z.infer<typeof npcSchema>;
export type Quest = z.infer<typeof questSchema>;

export type Entities = "factions" | "locations" | "npcs" | "quests";