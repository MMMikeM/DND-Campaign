import { defineConfig } from "vite-plus"

// Workspace-wide lint/format defaults, ported from the old biome.jsonc.
// Per-package Vite/Vitest/pack settings live in each package's own vite.config.ts.
export default defineConfig({
	fmt: {
		// biome: indentStyle "tab", indentWidth 2, lineWidth 120
		useTabs: true,
		tabWidth: 2,
		printWidth: 120,
		// biome javascript.formatter: quoteStyle "double", semicolons "asNeeded"
		singleQuote: false,
		semi: false,
		// replaces biome's assist.actions.source.organizeImports
		// experimentalSortImports: true,
		sortImports: {
			newlinesBetween: false
		},
		// biome's files.includes was a whitelist of **/*.ts and **/*.tsx, so it never
		// touched markdown, JSON, or the generated drizzle snapshots. Keep that scope:
		// oxfmt formats everything by default.
		ignorePatterns: [
			"**/*.md",
			"**/*.json",
			"**/*.jsonc",
			"**/*.css",
			"**/*.js",
			"**/*.mjs",
			"**/*.cjs",
			"**/*.yaml",
			"**/*.yml",
			"**/dist/**",
			"**/build/**",
			"**/.react-router/**",
			"**/src/server/schemas/generated/**",
			"packages/react/app/components/ui/**",
		],
	},
	lint: {
		ignorePatterns: [
			"**/dist/**",
			"**/build/**",
			"**/.react-router/**",
			"**/src/server/schemas/generated/**",
			"packages/react/app/components/ui/**",
		],
		rules: {
			// biome had complexity/noForEach disabled
			"unicorn/no-array-for-each": "off",
		},
	},
	staged: {
		"*.{js,jsx,ts,tsx}": "vp check --fix",
	},
})
