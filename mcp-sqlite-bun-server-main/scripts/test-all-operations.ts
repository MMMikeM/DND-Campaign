#!/usr/bin/env bun
import { join } from "node:path"
import { SQLiteDatabase } from "../src/database/index"

// Path to the database
const dbPath = join(process.cwd(), "data.sqlite")

// Initialize the database
console.log(`Connecting to database at ${dbPath}`)
const database = new SQLiteDatabase(dbPath)

// Test creating a basic NPC
console.log("\n--- Testing NPC Operations ---")
try {
  const npcId = "test_npc_" + Date.now()
  const testNPC = {
    id: npcId,
    name: "Test NPC",
    race: "Human",
    gender: "Non-binary",
    occupation: "Tester",
    role: "Test Subject",
    quirk: "Always tests things",
    background: "Came from a family of testers",
    motivation: "To test all the things",
    secret: "Secretly loves failing tests",
    stats: "STR: 10, DEX: 12, CON: 14, INT: 16, WIS: 8, CHA: 13",
    description: ["A test NPC for development purposes"],
    personality: ["Curious", "Methodical"],
    inventory: ["Test equipment", "Notepad"],
    quests: [],
    relationships: [],
    locations: []
  }
  
  console.log(`Creating NPC: ${npcId}`)
  database.npcs.createNPC(testNPC)
  
  console.log("Retrieving created NPC...")
  const retrievedNPC = database.npcs.getNPC(npcId)
  console.log(`Retrieved NPC: ${retrievedNPC ? retrievedNPC.name : 'Not found'}`)
  
  console.log("Cleaning up test NPC...")
  database.npcs.deleteNPC(npcId)
  
  console.log("NPC operations test completed successfully")
} catch (error) {
  console.error("Error in NPC operations test:", error)
}

// Test creating a basic Quest
console.log("\n--- Testing Quest Operations ---")
try {
  const questId = "test_quest_" + Date.now()
  const testQuest = {
    id: questId,
    title: "Test Quest",
    type: "Development",
    difficulty: "Easy",
    description: "A test quest for development purposes",
    quest_stages: [
      {
        stage: 1,
        title: "Initial Stage",
        description: "The first stage of the test quest",
        objectives: ["Test objective 1", "Test objective 2"],
        completion_paths: {
          success: {
            challenges: "None",
            outcomes: "Success"
          }
        }
      }
    ],
    key_decision_points: [],
    twists: ["Unexpected test failure"],
    rewards: {
      success: ["Knowledge", "Experience"]
    },
    follow_ups: {},
    related_quests: [],
    associated_npcs: []
  }
  
  console.log(`Creating Quest: ${questId}`)
  database.quests.createQuest(testQuest)
  
  console.log("Retrieving created Quest...")
  const retrievedQuest = database.quests.getQuest(questId)
  console.log(`Retrieved Quest: ${retrievedQuest ? retrievedQuest.title : 'Not found'}`)
  
  console.log("Cleaning up test Quest...")
  database.quests.deleteQuest(questId)
  
  console.log("Quest operations test completed successfully")
} catch (error) {
  console.error("Error in Quest operations test:", error)
}

// Test creating a basic Location
console.log("\n--- Testing Location Operations ---")
try {
  const locationId = "test_location_" + Date.now()
  const testLocation = {
    name: "Test Location",
    type: "Development Area",
    region: "Test Region",
    description: "A test location for development purposes",
    history: "Created for testing database operations",
    danger_level: "Safe",
    faction_control: null,
    notable_features: ["Test feature 1", "Test feature 2"],
    npcs: [],
    factions: [],
    points_of_interest: [
      {
        name: "Test POI",
        description: "A point of interest for testing"
      }
    ],
    connections: [],
    districts: {},
    areas: {}
  }
  
  console.log(`Creating Location: ${locationId}`)
  database.locations.createLocation(locationId, testLocation)
  
  console.log("Retrieving created Location...")
  const retrievedLocation = database.locations.getLocation(locationId)
  console.log(`Retrieved Location: ${retrievedLocation ? retrievedLocation.name : 'Not found'}`)
  
  console.log("Cleaning up test Location...")
  database.locations.deleteLocation(locationId)
  
  console.log("Location operations test completed successfully")
} catch (error) {
  console.error("Error in Location operations test:", error)
}

// Close the database connection
database.close()
console.log("\nDatabase connection closed.") 