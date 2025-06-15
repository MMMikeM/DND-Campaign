import { sql } from "drizzle-orm"
import { db } from "../.."

/**
 * Centralized fuzzy search function for better entity matching
 * Uses database function to find similar entities across multiple tables
 *
 * @param searchTerm - The term to search for
 * @param fuzzyWeight - Weight for fuzzy matching (default: 1.0)
 * @param similarityThreshold - Minimum similarity threshold (default: 0.3)
 * @param maxLevenshtein - Maximum Levenshtein distance (default: 2)
 * @param phoneticStrength - Phonetic matching strength (default: 2)
 * @param limit - Maximum number of results to return (default: 10)
 */
export const searchBySimilarity = async (
	searchTerm: string,
	fuzzyWeight = 1.0,
	similarityThreshold = 0.3,
	maxLevenshtein = 2,
	phoneticStrength = 2,
	limit = 10,
) =>
	await db.execute(sql`
    SELECT id, name, source_table FROM search_fuzzy_combined(
      ${searchTerm},
      ${fuzzyWeight},
      ${similarityThreshold},
      ${maxLevenshtein},
      ${phoneticStrength}
    ) limit ${limit}
  `)
