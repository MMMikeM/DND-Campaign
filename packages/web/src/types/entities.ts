import { factions, locations, npcs, quests } from "@tome-master/shared"
import { createSelectSchema } from "drizzle-zod"
import type { z } from "zod"
import type { Slug } from "../utils/addSlugs"

const factionSchema = createSelectSchema(factions)
const locationSchema = createSelectSchema(locations)
const npcSchema = createSelectSchema(npcs)
const questSchema = createSelectSchema(quests)

export type Faction = z.infer<typeof factionSchema> & { slug?: Slug }
export type Location = z.infer<typeof locationSchema> & { slug?: Slug }
export type Npc = z.infer<typeof npcSchema> & { slug?: Slug }
export type Quest = z.infer<typeof questSchema> & { slug?: Slug }

export type Entities = "factions" | "locations" | "npcs" | "quests"
