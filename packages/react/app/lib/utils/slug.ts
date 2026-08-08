/**
 * Mirrors the `slug` generated column in Postgres (see packages/shared/src/db/utils.ts).
 * Only needed where a row reaches the app without its slug, such as the search index view.
 */
export const toSlug = (text: string): string =>
	text
		.toLowerCase()
		.replace(/[^a-z0-9_\s-]/g, "")
		.replace(/[\s-]+/g, "-")
		.replace(/^-+|-+$/g, "")
