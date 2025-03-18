import { join } from "node:path"
import { readFileSync } from "node:fs"
import { parse } from "yaml"
import { SQLiteDatabase } from "../src/database/index"
import type { RequiredQuest } from "../src/database/operations/types"
import { QuestsFileSchema } from "../src/schemas/questsSchema"

// Path to the quests folder
const questsFolderPath = join(
  process.cwd(),
  "..",
  "campaigns",
  "shattered-spire",
  "quests",
)

const questsFilePaths = [
  join(questsFolderPath, "main-quests.yaml"),
  join(questsFolderPath, "side-quests.yaml"),
  join(questsFolderPath, "faction-quests.yaml"),
  join(questsFolderPath, "personal-quests.yaml"),
]

// Path to the database
const dbPath = join(process.cwd(), "data.sqlite")

// Read and parse the quest files
console.log(`Reading quests from ${questsFolderPath}`)

let questsFileContents = []
for (const filePath of questsFilePaths) {
  try {
    const fileContent = readFileSync(filePath, "utf-8")
    const parsed = parse(fileContent)
    questsFileContents.push(parsed)
    console.log(`Successfully read ${filePath}`)
  } catch (error: any) {
    console.warn(`Could not read or parse ${filePath}: ${error.message}`)
  }
}

// Parse quest data using schema
const parsedQuestFiles = questsFileContents.map(content => {
  try {
    return QuestsFileSchema.parse(content)
  } catch (error: any) {
    console.error("Error parsing quest file:", error.message)
    return null
  }
}).filter(Boolean)

if (parsedQuestFiles.length === 0) {
  console.error("No valid quest data found in the files.")
  process.exit(1)
}

// Initialize the database
console.log(`Connecting to database at ${dbPath}`)
const database = new SQLiteDatabase(dbPath)

// Count of processed quests
let created = 0
let updated = 0
let errors = 0

// Process each quest file and its quests
console.log("Processing quests...")
parsedQuestFiles.forEach(parsedQuestFile => {
  if (!parsedQuestFile || !parsedQuestFile.quests) return

  parsedQuestFile.quests.forEach(questData => {
    try {
      // Create the base quest object with required fields
      const quest: RequiredQuest = {
        id: questData.id,
        title: questData.title || "",
        type: questData.type || "",
        difficulty: questData.difficulty || "Medium",
        description: questData.description || "",
        associated_npc: questData.associated_npc || [], 
        
        // Map quest stages correctly
        quest_stages: (questData.quest_stages || []).map(stage => ({
          stage: stage.stage,
          title: stage.title || "",
          objectives: stage.objectives || [],
          completion_paths: stage.completion_paths || {}
        })),
        
        // Add required fields
        potential_twists: questData.potential_twists || [],
        follow_up_quests: questData.follow_up_quests || [],
        adaptable: questData.adaptable !== undefined ? questData.adaptable : true,
        related_quests: questData.related_quests || [],
        
        // Optional fields
        key_decision_points: questData.key_decision_points || [],
        rewards: { 
          standard: questData.rewards?.standard || []
        }
      }

      // Check if quest exists
      const existingQuest = database.quests.getQuest(quest.id)

      if (existingQuest) {
        try {
          console.log(`Deleting existing quest: ${quest.id}`)
          database.quests.deleteQuest(quest.id)
        } catch (error) {
          console.error(`Error deleting quest ${quest.id}:`, error)
        }
      }

      // Create the quest fresh
      console.log(`Creating quest: ${quest.id} (${quest.title})`)
      database.quests.createQuest(quest)
      created++
    } catch (error: any) {
      console.error(`Error processing quest ${questData.id}:`, error.message)
      errors++
    }
  })
})

// Summary
console.log("\nIngest complete!")
console.log(`Quests created: ${created}`)
console.log(`Quests updated: ${updated}`)
console.log(`Errors: ${errors}`)

// Close the database connection
database.close()
console.log("Database connection closed.") 
console.log("Database connection closed.") 