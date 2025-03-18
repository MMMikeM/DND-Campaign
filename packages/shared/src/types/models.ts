/**
 * Core entity model types for D&D campaign management
 */
import type { Quest } from "../entities/quests/quest.schema.js"
import type { Npc } from "../entities/npcs/npc.schema.js"
import type { Faction } from "../entities/factions/faction.schema.js"
import type { Location } from "../entities/locations/location.schema.js"

// Define entity type enum for use throughout the application
export type EntityType = "quest" | "npc" | "faction" | "location"

// Re-export all entity types for backward compatibility
export type RequiredQuest = Quest
export type RequiredNPC = Npc
export type RequiredFaction = Faction
export type RequiredLocation = Location
