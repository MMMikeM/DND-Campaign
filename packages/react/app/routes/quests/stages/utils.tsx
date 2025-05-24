import * as Icons from "lucide-react"
import type * as React from "react"

// Condition Types
export const conditionTypes = [
	"choice",
	"skill_check",
	"item",
	"npc_relation",
	"faction",
	"time",
	"combat",
	"custom_event",
] as const

type ConditionType = (typeof conditionTypes)[number]

// Decision Types
export const decisionTypes = [
	"moral_choice",
	"tactical_decision",
	"resource_allocation",
	"trust_test",
	"sacrifice_opportunity",
	"identity_question",
] as const

type DecisionType = (typeof decisionTypes)[number]

// Configuration for condition types
export const conditionTypeConfig: Record<
	ConditionType,
	{
		icon: React.ReactNode
		bgColor: string
		textColor: string
		label: string
		description: string
	}
> = {
	choice: {
		icon: <Icons.SplitSquareVertical className="h-3.5 w-3.5 mr-1" />,
		bgColor: "bg-violet-500",
		textColor: "text-white",
		label: "Choice",
		description: "Player must make a decision between options",
	},
	skill_check: {
		icon: <Icons.Dices className="h-3.5 w-3.5 mr-1" />,
		bgColor: "bg-blue-500",
		textColor: "text-white",
		label: "Skill Check",
		description: "Requires a successful ability or skill check",
	},
	item: {
		icon: <Icons.Briefcase className="h-3.5 w-3.5 mr-1" />,
		bgColor: "bg-amber-500",
		textColor: "text-white",
		label: "Item",
		description: "Depends on possessing a specific item",
	},
	npc_relation: {
		icon: <Icons.Users className="h-3.5 w-3.5 mr-1" />,
		bgColor: "bg-pink-500",
		textColor: "text-white",
		label: "NPC Relation",
		description: "Based on relationship with an NPC",
	},
	faction: {
		icon: <Icons.Flag className="h-3.5 w-3.5 mr-1" />,
		bgColor: "bg-indigo-500",
		textColor: "text-white",
		label: "Faction",
		description: "Depends on standing with a faction",
	},
	time: {
		icon: <Icons.Clock className="h-3.5 w-3.5 mr-1" />,
		bgColor: "bg-cyan-500",
		textColor: "text-white",
		label: "Time",
		description: "Triggered after a specific time or duration",
	},
	combat: {
		icon: <Icons.Swords className="h-3.5 w-3.5 mr-1" />,
		bgColor: "bg-red-500",
		textColor: "text-white",
		label: "Combat",
		description: "Occurs during or as a result of combat",
	},
	custom_event: {
		icon: <Icons.Sparkles className="h-3.5 w-3.5 mr-1" />,
		bgColor: "bg-purple-500",
		textColor: "text-white",
		label: "Custom Event",
		description: "Triggered by a custom scenario",
	},
}

// Configuration for decision types
export const decisionTypeConfig: Record<
	DecisionType,
	{
		icon: React.ReactNode
		bgColor: string
		textColor: string
		label: string
		description: string
	}
> = {
	moral_choice: {
		icon: <Icons.Scale className="h-3.5 w-3.5 mr-1" />,
		bgColor: "bg-emerald-600",
		textColor: "text-white",
		label: "Moral Choice",
		description: "Tests the party's ethics and values",
	},
	tactical_decision: {
		icon: <Icons.Brain className="h-3.5 w-3.5 mr-1" />,
		bgColor: "bg-blue-600",
		textColor: "text-white",
		label: "Tactical Decision",
		description: "Strategic choice affecting encounter outcome",
	},
	resource_allocation: {
		icon: <Icons.CircleDollarSign className="h-3.5 w-3.5 mr-1" />,
		bgColor: "bg-amber-600",
		textColor: "text-white",
		label: "Resource Allocation",
		description: "How to distribute limited resources",
	},
	trust_test: {
		icon: <Icons.HeartHandshake className="h-3.5 w-3.5 mr-1" />,
		bgColor: "bg-orange-600",
		textColor: "text-white",
		label: "Trust Test",
		description: "Challenges players to trust an NPC or situation",
	},
	sacrifice_opportunity: {
		icon: <Icons.Trophy className="h-3.5 w-3.5 mr-1" />,
		bgColor: "bg-red-600",
		textColor: "text-white",
		label: "Sacrifice Opportunity",
		description: "Give up something valuable for potential gain",
	},
	identity_question: {
		icon: <Icons.UserCircle className="h-3.5 w-3.5 mr-1" />,
		bgColor: "bg-purple-600",
		textColor: "text-white",
		label: "Identity Question",
		description: "Relates to character identity or development",
	},
}

// Helper functions to get badge props for BadgeWithTooltip
export const getConditionTypeBadgeProps = (type: ConditionType | string) => {
	const config =
		type in conditionTypeConfig
			? conditionTypeConfig[type as ConditionType]
			: {
					icon: null,
					bgColor: "bg-gray-500",
					textColor: "text-white",
					label: type,
					description: type,
				}

	return {
		tooltipContent: config.description,
		className: `text-sm ${config.bgColor} ${config.textColor} flex items-center`,
		children: (
			<>
				{config.icon}
				{config.label}
			</>
		),
	}
}

export const getDecisionTypeBadgeProps = (type: DecisionType | string) => {
	const config =
		type in decisionTypeConfig
			? decisionTypeConfig[type as DecisionType]
			: {
					icon: null,
					bgColor: "bg-gray-500",
					textColor: "text-white",
					label: type,
					description: type,
				}

	return {
		tooltipContent: config.description,
		className: `text-sm ${config.bgColor} ${config.textColor} flex items-center`,
		children: (
			<>
				{config.icon}
				{config.label}
			</>
		),
	}
}
