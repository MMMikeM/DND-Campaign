import { readFileSync } from "fs"
import { parse } from "yaml"

// Initialize database
const db = new Database("data.sqlite", { create: true })

// Drop existing tables
db.run("BEGIN TRANSACTION")
try {
	db.run("DROP TABLE IF EXISTS quest_rewards")
	db.run("DROP TABLE IF EXISTS quest_twists")
	db.run("DROP TABLE IF EXISTS quest_decision_choices")
	db.run("DROP TABLE IF EXISTS quest_decision_points")
	db.run("DROP TABLE IF EXISTS quest_stage_completion_paths")
	db.run("DROP TABLE IF EXISTS quest_stage_objectives")
	db.run("DROP TABLE IF EXISTS quest_stages")
	db.run("DROP TABLE IF EXISTS quest_followups")
	db.run("DROP TABLE IF EXISTS quest_relations")
	db.run("DROP TABLE IF EXISTS quests")
	db.run("COMMIT")
} catch (error) {
	db.run("ROLLBACK")
	throw error
}

// Create tables
db.run("BEGIN TRANSACTION")
try {
	// Main quest table
	db.run(`CREATE TABLE quests (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        type TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        description TEXT NOT NULL,
        adaptable BOOLEAN
    )`)

	// Quest stages
	db.run(`CREATE TABLE quest_stages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quest_id TEXT NOT NULL,
        stage_number INTEGER NOT NULL,
        title TEXT NOT NULL,
        FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
    )`)

	// Stage objectives
	db.run(`CREATE TABLE quest_stage_objectives (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        stage_id INTEGER NOT NULL,
        objective TEXT NOT NULL,
        FOREIGN KEY (stage_id) REFERENCES quest_stages(id) ON DELETE CASCADE
    )`)

	// Stage completion paths
	db.run(`CREATE TABLE quest_stage_completion_paths (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        stage_id INTEGER NOT NULL,
        path_name TEXT NOT NULL,
        description TEXT NOT NULL,
        challenges TEXT NOT NULL,
        outcomes TEXT NOT NULL,
        FOREIGN KEY (stage_id) REFERENCES quest_stages(id) ON DELETE CASCADE
    )`)

	// Decision points
	db.run(`CREATE TABLE quest_decision_points (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quest_id TEXT NOT NULL,
        stage_number INTEGER NOT NULL,
        decision TEXT NOT NULL,
        FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
    )`)

	// Decision choices
	db.run(`CREATE TABLE quest_decision_choices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        decision_point_id INTEGER NOT NULL,
        choice TEXT NOT NULL,
        consequences TEXT NOT NULL,
        FOREIGN KEY (decision_point_id) REFERENCES quest_decision_points(id) ON DELETE CASCADE
    )`)

	// Potential twists
	db.run(`CREATE TABLE quest_twists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quest_id TEXT NOT NULL,
        twist TEXT NOT NULL,
        FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
    )`)

	// Rewards
	db.run(`CREATE TABLE quest_rewards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quest_id TEXT NOT NULL,
        reward_path TEXT NOT NULL,
        reward TEXT NOT NULL,
        FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
    )`)

	// Follow-up quests
	db.run(`CREATE TABLE quest_followups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quest_id TEXT NOT NULL,
        followup_path TEXT NOT NULL,
        followup_quest_id TEXT NOT NULL,
        FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
    )`)

	// Related quests
	db.run(`CREATE TABLE quest_relations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quest_id TEXT NOT NULL,
        related_quest_id TEXT NOT NULL,
        FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
    )`)

	db.run("COMMIT")
} catch (error) {
	db.run("ROLLBACK")
	throw error
}

// Define types based on the schema
interface CompletionPath {
	description: string
	challenges: string
	outcomes: string
}

interface QuestStage {
	stage: number
	title: string
	objectives: string[]
	completion_paths: Record<string, CompletionPath>
}

interface DecisionChoice {
	choice: string
	consequences: string
}

interface DecisionPoint {
	stage: number
	decision: string
	choices: DecisionChoice[]
}

interface Quest {
	id: string
	title: string
	associated_npc?: string[]
	type: string
	difficulty: "Easy" | "Medium" | "Hard" | "Very Hard" | "Legendary"
	description: string
	quest_stages?: QuestStage[]
	key_decision_points?: DecisionPoint[]
	potential_twists?: string[]
	rewards?: {
		standard?: string[]
		[key: string]: string[] | undefined
	}
	follow_up_quests?: {
		[key: string]: string[]
	}
	related_quests?: string[]
	adaptable?: boolean
}

interface QuestData {
	title: string
	version: string
	description: string
	category: "Main Quests" | "Side Quests" | "Faction Quests" | "Personal Quests" | "Generic Quests"
	quests: Quest[]
}

// Read and parse all YAML files in the quests directory
const questFiles = [
	"/Users/mikemurray/Development/DND-Campaign/campaigns/shattered-spire/quests/main-quests.yaml",
	"/Users/mikemurray/Development/DND-Campaign/campaigns/shattered-spire/quests/side-quests.yaml",
	"/Users/mikemurray/Development/DND-Campaign/campaigns/shattered-spire/quests/faction-quests.yaml",
	"/Users/mikemurray/Development/DND-Campaign/campaigns/shattered-spire/quests/personal-quests.yaml",
	"/Users/mikemurray/Development/DND-Campaign/campaigns/shattered-spire/quests/generic-quests.yaml",
]

// Begin transaction for data import
db.run("BEGIN TRANSACTION")

try {
	// Prepare statements
	const questStmt = db.prepare(`
        INSERT INTO quests (
            id, title, category, type, difficulty,
            description, adaptable
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

	const stageStmt = db.prepare(`
        INSERT INTO quest_stages (
            quest_id, stage_number, title
        ) VALUES (?, ?, ?)
    `)

	const objectiveStmt = db.prepare(`
        INSERT INTO quest_stage_objectives (
            stage_id, objective
        ) VALUES (?, ?)
    `)

	const completionPathStmt = db.prepare(`
        INSERT INTO quest_stage_completion_paths (
            stage_id, path_name, description, challenges, outcomes
        ) VALUES (?, ?, ?, ?, ?)
    `)

	const decisionPointStmt = db.prepare(`
        INSERT INTO quest_decision_points (
            quest_id, stage_number, decision
        ) VALUES (?, ?, ?)
    `)

	const decisionChoiceStmt = db.prepare(`
        INSERT INTO quest_decision_choices (
            decision_point_id, choice, consequences
        ) VALUES (?, ?, ?)
    `)

	const twistStmt = db.prepare(`
        INSERT INTO quest_twists (
            quest_id, twist
        ) VALUES (?, ?)
    `)

	const rewardStmt = db.prepare(`
        INSERT INTO quest_rewards (
            quest_id, reward_path, reward
        ) VALUES (?, ?, ?)
    `)

	const followupStmt = db.prepare(`
        INSERT INTO quest_followups (
            quest_id, followup_path, followup_quest_id
        ) VALUES (?, ?, ?)
    `)

	const relationStmt = db.prepare(`
        INSERT INTO quest_relations (
            quest_id, related_quest_id
        ) VALUES (?, ?)
    `)

	// Process each quest file
	for (const file of questFiles) {
		try {
			console.log(`Processing file: ${file}`)
			const yamlContent = readFileSync(file, "utf8")
			const data = parse(yamlContent) as QuestData

			// Insert quests from this file
			for (const quest of data.quests) {
				console.log(`Processing quest: ${quest.title} (${quest.id})`)

				// Insert main quest data
				questStmt.run(
					quest.id,
					quest.title,
					data.category,
					quest.type,
					quest.difficulty,
					quest.description,
					quest.adaptable || false,
				)

				// Insert stages and their components
				if (quest.quest_stages) {
					for (const stage of quest.quest_stages) {
						const stageResult = stageStmt.run(quest.id, stage.stage, stage.title)
						const stageId = stageResult.lastInsertRowid

						// Insert objectives
						for (const objective of stage.objectives) {
							objectiveStmt.run(stageId, objective)
						}

						// Insert completion paths
						for (const [pathName, path] of Object.entries(stage.completion_paths)) {
							completionPathStmt.run(
								stageId,
								pathName,
								path.description,
								path.challenges,
								path.outcomes,
							)
						}
					}
				}

				// Insert decision points and choices
				if (quest.key_decision_points) {
					for (const decision of quest.key_decision_points) {
						const decisionResult = decisionPointStmt.run(
							quest.id,
							decision.stage,
							decision.decision,
						)
						const decisionId = decisionResult.lastInsertRowid

						for (const choice of decision.choices) {
							decisionChoiceStmt.run(decisionId, choice.choice, choice.consequences)
						}
					}
				}

				// Insert twists
				if (quest.potential_twists) {
					for (const twist of quest.potential_twists) {
						twistStmt.run(quest.id, twist)
					}
				}

				// Insert rewards
				if (quest.rewards) {
					for (const [path, rewards] of Object.entries(quest.rewards)) {
						if (rewards) {
							for (const reward of rewards) {
								rewardStmt.run(quest.id, path, reward)
							}
						}
					}
				}

				// Insert follow-up quests
				if (quest.follow_up_quests) {
					for (const [path, quests] of Object.entries(quest.follow_up_quests)) {
						for (const followupId of quests) {
							followupStmt.run(quest.id, path, followupId)
						}
					}
				}

				// Insert related quests
				if (quest.related_quests) {
					for (const relatedId of quest.related_quests) {
						relationStmt.run(quest.id, relatedId)
					}
				}

				console.log(`Successfully inserted quest ${quest.id}`)
			}
		} catch (error) {
			if (error.code === "ENOENT") {
				console.log(`Warning: Quest file not found: ${file}`)
				continue
			}
			throw error
		}
	}

	// Commit transaction
	db.run("COMMIT")
	console.log("Successfully imported quest data!")
} catch (error) {
	// Rollback on error
	db.run("ROLLBACK")
	console.error("Error importing quest data:", error)
	throw error
}
