import { readFileSync } from "fs"
import { parse } from "yaml"

// Read the YAML file
const personalQuests = readFileSync(
	"/Users/mikemurray/Development/DND-Campaign/campaigns/shattered-spire/quests/personal-quests.yaml",
	"utf8",
)
const factionQuests = readFileSync(
	"/Users/mikemurray/Development/DND-Campaign/campaigns/shattered-spire/quests/faction-quests.yaml",
	"utf8",
)

const genericQuests = readFileSync(
	"/Users/mikemurray/Development/DND-Campaign/campaigns/shattered-spire/quests/generic-quests.yaml",
	"utf8",
)

const mainQuests = readFileSync(
	"/Users/mikemurray/Development/DND-Campaign/campaigns/shattered-spire/quests/main-quests.yaml",
	"utf8",
)

const sideQuests = readFileSync(
	"/Users/mikemurray/Development/DND-Campaign/campaigns/shattered-spire/quests/side-quests.yaml",
	"utf8",
)

// Parse YAML
const data = parse(yamlContent)

// Function to get type of value
function getType(value: any): string {
	if (Array.isArray(value)) {
		const itemTypes = new Set(
			value.map((item) => (typeof item === "object" ? "object" : typeof item)),
		)
		return `Array<${Array.from(itemTypes).join("|")}>`
	}
	if (value === null) return "null"
	if (typeof value === "object") {
		const structure: Record<string, string> = {}
		for (const [key, val] of Object.entries(value)) {
			structure[key] = getType(val)
		}
		return JSON.stringify(structure, null, 2)
	}
	return typeof value
}

// Analyze structure of first quest
const questStructure: Record<string, string> = {}
const firstQuest = data.quests[0]

for (const [key, value] of Object.entries(firstQuest)) {
	questStructure[key] = getType(value)
}

// Output structure
console.log("Quest Structure:")
console.log(JSON.stringify(questStructure, null, 2))

// Output example values for complex structures
console.log("\nExample Values for Complex Structures:")
console.log("\nQuest Stages Example:")
console.log(JSON.stringify(firstQuest.quest_stages, null, 2))

console.log("\nKey Decision Points Example:")
console.log(JSON.stringify(firstQuest.key_decision_points, null, 2))

console.log("\nPotential Twists Example:")
console.log(JSON.stringify(firstQuest.potential_twists, null, 2))

console.log("\nRewards Example:")
console.log(JSON.stringify(firstQuest.rewards, null, 2))

console.log("\nFollow-up Quests Example:")
console.log(JSON.stringify(firstQuest.follow_up_quests, null, 2))
