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
  // Create a minimal NPC
  const npcId = "test_npc_" + Date.now()
  console.log(`Creating NPC: ${npcId}`)
  database.npcs.createNPC({
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
    description: [],
    personality: [],
    inventory: [],
    quests: [],
    relationships: [],
    location: []
  })
  
  // Retrieve the NPC
  console.log("Retrieving created NPC...")
  const retrievedNPC = database.npcs.getNPC(npcId)
  if (retrievedNPC) {
    console.log(`Retrieved NPC: ${retrievedNPC.name} (ID: ${retrievedNPC.id})`)
    console.log("NPC create/retrieve test passed!")
  } else {
    console.error("Failed to retrieve the NPC")
  }
  
  // Clean up
  console.log("Cleaning up test NPC...")
  database.npcs.deleteNPC(npcId)
} catch (error) {
  console.error("Error in NPC operations test:", error)
}

// Test creating a basic Location
console.log("\n--- Testing Location Operations ---")
try {
  // Create a minimal Location
  const locationId = "test_location_" + Date.now()
  console.log(`Creating Location: ${locationId}`)
  database.locations.createLocation(locationId, {
    name: "Test Location",
    type: "Development Area",
    region: "Test Region",
    description: "A test location for development purposes",
    history: "Created for testing database operations",
    danger_level: "Safe",
    faction_control: "",  // Empty string instead of null
    notable_features: [],
    npcs: [],
    factions: [],
    points_of_interest: [],
    connections: [],
    districts: {},
    areas: {}
  })
  
  // Retrieve the Location
  console.log("Retrieving created Location...")
  const retrievedLocation = database.locations.getLocation(locationId)
  if (retrievedLocation) {
    console.log(`Retrieved Location: ${retrievedLocation.name} (Type: ${retrievedLocation.type})`)
    console.log("Location create/retrieve test passed!")
  } else {
    console.error("Failed to retrieve the Location")
  }
  
  // Clean up
  console.log("Cleaning up test Location...")
  database.locations.deleteLocation(locationId)
} catch (error) {
  console.error("Error in Location operations test:", error)
}

// Close the database connection
database.close()
console.log("\nDatabase connection closed.") 