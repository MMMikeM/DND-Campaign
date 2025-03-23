import type { icons } from "@iconify-json/lucide/icons.json"

type RemoveLucidePrefix<T extends string> = T extends `lucide:${infer R}` ? R : T

export type IconName = RemoveLucidePrefix<keyof typeof icons>

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl"
export type IconAnimation = "spin" | "pulse" | "bounce" | "none"
export type IconSpacing = "none" | "xs" | "sm" | "md" | "lg"
export type IconColor =
	| "current"
	| "amber" // Amber-orange-yellow
	| "black"
	| "blue"
	| "cyan" // Cyan-sky-blue
	| "gray"
	| "green" // Green-emerald-teal
	| "indigo" // Indigo-violet-blue
	| "pink"
	| "purple" // Purple-violet-indigo
	| "red"
	| "teal"
	| "white"
	| "yellow"
