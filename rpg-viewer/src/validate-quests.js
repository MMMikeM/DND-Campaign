#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const yaml = require("js-yaml");

// Path to the quests YAML file - updated to look in parent directory
const questsFile = path.join(__dirname, "..", "shattered-spire-quests.yaml");

// Define our schema requirements
const requiredQuestFields = [
	"id",
	"title",
	"type",
	"difficulty",
	"description",
	"objectives",
	"quest_stages",
	"potential_twists",
	"rewards",
	"adaptable",
];

const recommendedQuestFields = [
	"associated_npc",
	"key_decision_points",
	"follow_up_quests",
	"related_quests",
];

const requiredStageFields = [
	"stage",
	"title",
	"objectives",
	"completion_paths",
];
const requiredCompletionPathFields = ["description", "challenges", "outcomes"];

// Counters for reporting
const stats = {
	totalQuests: 0,
	fullyCompliant: 0,
	missingRequired: 0,
	missingRecommended: 0,
	completionPathsMissingRewards: 0,
	questsWithInconsistentCompletionPaths: 0,
};

// Detailed issues tracking
const issues = [];

// Load and parse the YAML file
try {
	console.log(`Reading quests from ${questsFile}...`);
	const fileContents = fs.readFileSync(questsFile, "utf8");
	const quests = yaml.load(fileContents);

	console.log(`Found ${quests.length} quests. Validating...`);
	stats.totalQuests = quests.length;

	// Validate each quest
	for (const quest of quests) {
		const questIssues = [];
		let isFullyCompliant = true;

		// Check required fields
		const missingRequired = requiredQuestFields.filter(
			(field) => !quest[field],
		);
		if (missingRequired.length > 0) {
			questIssues.push(
				`Quest "${quest.id}" (${quest.title}) is missing required fields: ${missingRequired.join(", ")}`,
			);
			isFullyCompliant = false;
			stats.missingRequired++;
		}

		// Check recommended fields
		const missingRecommended = recommendedQuestFields.filter(
			(field) => !quest[field],
		);
		if (missingRecommended.length > 0) {
			questIssues.push(
				`Quest "${quest.id}" (${quest.title}) is missing recommended fields: ${missingRecommended.join(", ")}`,
			);
			isFullyCompliant = false;
			stats.missingRecommended++;
		}

		// Skip further checks if quest_stages is missing
		if (!quest.quest_stages) {
			issues.push(...questIssues);
			continue;
		}

		// Track all completion paths
		const allCompletionPaths = new Set();

		// Validate quest stages
		let hasStageIssues = false;
		for (const stage of quest.quest_stages) {
			const stageIssues = [];

			// Check required stage fields
			const missingStageFields = requiredStageFields.filter(
				(field) => stage[field] === undefined,
			);
			if (missingStageFields.length > 0) {
				stageIssues.push(
					`Stage ${stage.stage} missing fields: ${missingStageFields.join(", ")}`,
				);
				hasStageIssues = true;
			}

			// Skip further checks if completion_paths is missing
			if (!stage.completion_paths) {
				questIssues.push(...stageIssues);
				continue;
			}

			// Check completion paths
			for (const [pathName, path] of Object.entries(stage.completion_paths)) {
				allCompletionPaths.add(`${pathName}_path`);

				const missingPathFields = requiredCompletionPathFields.filter(
					(field) => !path[field],
				);
				if (missingPathFields.length > 0) {
					stageIssues.push(
						`Stage ${stage.stage}, path "${pathName}" missing fields: ${missingPathFields.join(", ")}`,
					);
					hasStageIssues = true;
				}

				// Check for specific challenge format (DC values, CR ratings, etc.)
				if (path.challenges && typeof path.challenges === "string") {
					const hasDC = path.challenges.includes("DC");
					const hasCR = path.challenges.includes("CR");
					const hasGold = path.challenges.includes("gold");
					const hasTime = path.challenges.match(
						/\(\d+[^\)]*(?:day|hour|week|month)/i,
					);

					if (!hasDC && !hasCR && !hasGold && !hasTime) {
						stageIssues.push(
							`Stage ${stage.stage}, path "${pathName}" challenges may be missing specifics (DC, CR, cost, time)`,
						);
						hasStageIssues = true;
					}
				}
			}

			if (stageIssues.length > 0) {
				questIssues.push(`Quest "${quest.id}" stage ${stage.stage} issues:`);
				questIssues.push(...stageIssues.map((issue) => `  - ${issue}`));
				isFullyCompliant = false;
			}
		}

		if (hasStageIssues) {
			stats.questsWithInconsistentCompletionPaths++;
		}

		// Validate rewards section matches completion paths
		if (quest.rewards) {
			// Check for standard_rewards
			if (!quest.rewards.standard_rewards) {
				questIssues.push(
					`Quest "${quest.id}" is missing 'standard_rewards' in the rewards section`,
				);
				isFullyCompliant = false;
			}

			// Find completion paths without corresponding rewards
			const missingRewardPaths = [...allCompletionPaths].filter(
				(path) => !quest.rewards[path],
			);
			if (missingRewardPaths.length > 0) {
				questIssues.push(
					`Quest "${quest.id}" is missing rewards for completion paths: ${missingRewardPaths.join(", ")}`,
				);
				isFullyCompliant = false;
				stats.completionPathsMissingRewards++;
			}

			// Find reward paths that don't correspond to completion paths
			const extraRewardPaths = Object.keys(quest.rewards).filter(
				(key) => key !== "standard_rewards" && !allCompletionPaths.has(key),
			);
			if (extraRewardPaths.length > 0) {
				questIssues.push(
					`Quest "${quest.id}" has rewards for non-existent completion paths: ${extraRewardPaths.join(", ")}`,
				);
				isFullyCompliant = false;
			}
		}

		// Check follow_up_quests references
		if (quest.follow_up_quests) {
			for (const [key, questIds] of Object.entries(quest.follow_up_quests)) {
				if (!Array.isArray(questIds) || questIds.length === 0) {
					questIssues.push(
						`Quest "${quest.id}" has empty or invalid follow_up_quests for path "${key}"`,
					);
					isFullyCompliant = false;
				}
			}
		}

		// Check related_quests
		if (
			quest.related_quests &&
			(!Array.isArray(quest.related_quests) ||
				quest.related_quests.length === 0)
		) {
			questIssues.push(
				`Quest "${quest.id}" has empty or invalid related_quests`,
			);
			isFullyCompliant = false;
		}

		if (isFullyCompliant) {
			stats.fullyCompliant++;
		}
	}
} catch (error) {
	console.error(`Error reading quests file: ${error.message}`);
	process.exit(1);
}
