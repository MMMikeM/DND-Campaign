import { buildSimilarityQuery, type SimilarityHit } from "@tome-master/shared"
import { db } from "../.."

/**
 * Executes {@link buildSimilarityQuery} against the application database.
 * Argument order and defaults match the query builder.
 */
export const searchBySimilarity = async (
	searchTerm: string,
	fuzzyWeight = 1.0,
	similarityThreshold = 0.3,
	maxLevenshtein = 2,
	phoneticStrength = 2,
	limit = 10,
) =>
	await db.execute<SimilarityHit>(
		buildSimilarityQuery(searchTerm, fuzzyWeight, similarityThreshold, maxLevenshtein, phoneticStrength, limit),
	)
