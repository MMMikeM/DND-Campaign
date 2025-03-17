#!/usr/bin/env bun
import { join } from "node:path"
import { readFileSync } from "node:fs"
import { parse } from "yaml"
import { SQLiteDatabase } from "../src/database/index"
import type { RequiredFaction } from "../src/database/operations/types"
import { FactionsFileSchema } from "../src/schemas/factionsSchema"

// Path to the factions.yaml file
const factionsFilePath = join(
  process.cwd(),
  "..",
  "campaigns",
  "shattered-spire",
  "factions",
  "factions.yaml"
)

// Path to the database
const dbPath = join(process.cwd(), "data.sqlite")

// Read and parse the factions file
console.log(`Reading factions from ${factionsFilePath}`)
const yamlContent = readFileSync(factionsFilePath, "utf-8")
const data = FactionsFileSchema.parse(parse(yamlContent))

if (!data || !data.factions) {
  console.error("No faction data found in the file.")
  process.exit(1)
}

// Initialize the database
console.log(`Connecting to database at ${dbPath}`)
const database = new SQLiteDatabase(dbPath)

// Count of processed factions
let created = 0
let updated = 0
let errors = 0

// Process each faction
console.log("Processing factions...")
Object.entries(data.factions).forEach(([id, factionData]) => {
  try {
    // Convert YAML data to RequiredFaction format
    const faction: RequiredFaction = {
      name: factionData.name || "",
      type: factionData.type || "",
      description: factionData.description || "",
      alignment: factionData.alignment || "",
      public_goal: factionData.public_goal || "",
      true_goal: factionData.true_goal || "",
      headquarters: factionData.headquarters || "",
      territory: factionData.territory || "",
      history: factionData.history || "",
        notes: factionData.notes || "",
      resources: factionData.resources || [],
      leaders: [], // Simple list for faction leaders
      leadership: (factionData.leadership || []).map((leader: any) => ({
        name: leader.name || "",
        role: leader.role || "",
        description: leader.description || "",
        secret: leader.secret || "",
        stats: leader.stats || "",
        bio: leader.bio || "",
      })),
      members: (factionData.members || []).map((member: any) => ({
        name: member.name || "",
        description: member.description || "",
        stats: member.stats || null,
      })),
      allies: factionData.allies || [],
      enemies: factionData.enemies || [],
      quests: factionData.quests || [],
    }

    // Create the faction fresh
    console.log(`Creating faction: ${id} (${faction.name})`)
    database.factions.createFaction(id, faction)
    created++
  } catch (error) {
    console.error(`Error processing faction ${id}:`, error)
    errors++
  }
})

// Summary
console.log("\nIngest complete!")
console.log(`Factions created: ${created}`)
console.log(`Factions updated: ${updated}`)
console.log(`Errors: ${errors}`)

// Close the database connection
database.close()
console.log("Database connection closed.") 