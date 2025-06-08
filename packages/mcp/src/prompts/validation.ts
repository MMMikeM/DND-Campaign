/**
 * Prompt Validation and Error Handling
 *
 * Provides input validation, sanitization, error handling, and performance
 * monitoring for all prompt operations with graceful degradation support.
 */

import { z } from "zod/v4"
import { logger } from ".."

// Common validation schemas
export const entityNameSchema = z
	.string()
	.min(1, "Entity name cannot be empty")
	.max(100, "Entity name must be 100 characters or less")
	.regex(
		/^[a-zA-Z0-9\s\-'.]+$/,
		"Entity name can only contain letters, numbers, spaces, hyphens, apostrophes, and periods",
	)

export const hintSchema = z.string().max(200, "Hints must be 200 characters or less").optional()

export const typeHintSchema = z.string().max(50, "Type hints must be 50 characters or less").optional()

// Validation functions
export function validateEntityName(name: string): { valid: boolean; error?: string } {
	try {
		entityNameSchema.parse(name)
		return { valid: true }
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				valid: false,
				error: error.issues[0]?.message || "Invalid entity name",
			}
		}
		return { valid: false, error: "Unknown validation error" }
	}
}

export function sanitizeHint(hint?: string): string | undefined {
	if (!hint) return undefined

	// Sanitize and truncate hints
	return hint
		.trim()
		.slice(0, 200)
		.replace(/[<>"']/g, "") // Remove potentially problematic characters
}

export function validateContextGatheringArgs(args: Record<string, any>): {
	valid: boolean
	error?: string
	sanitized?: Record<string, any>
} {
	try {
		// Validate required name field
		const nameValidation = validateEntityName(args.name)
		if (!nameValidation.valid) {
			return { valid: false, error: `Name validation failed: ${nameValidation.error}` }
		}

		// Sanitize optional hints
		const sanitized = {
			...args,
			name: args.name.trim(),
			occupation: sanitizeHint(args.occupation),
			location_hint: sanitizeHint(args.location_hint),
			faction_hint: sanitizeHint(args.faction_hint),
			role_hint: sanitizeHint(args.role_hint),
			type_hint: sanitizeHint(args.type_hint),
			alignment_hint: sanitizeHint(args.alignment_hint),
			region_hint: sanitizeHint(args.region_hint),
			size_hint: sanitizeHint(args.size_hint),
			purpose_hint: sanitizeHint(args.purpose_hint),
			level_hint: sanitizeHint(args.level_hint),
			theme_hint: sanitizeHint(args.theme_hint),
		}

		// Remove undefined fields
		Object.keys(sanitized).forEach((key) => {
			if ((sanitized as any)[key] === undefined) {
				delete (sanitized as any)[key]
			}
		})

		return { valid: true, sanitized }
	} catch (error) {
		logger.error("Context gathering validation error:", error)
		return { valid: false, error: "Validation error occurred" }
	}
}

// Error handling wrapper for context gathering
export async function safeContextGathering<T>(
	contextFunction: () => Promise<T>,
	entityType: string,
	entityName: string,
): Promise<{ success: boolean; context?: T; error?: string }> {
	try {
		logger.info(`Starting context gathering for ${entityType}: ${entityName}`)
		const context = await contextFunction()
		logger.info(`Context gathering successful for ${entityType}: ${entityName}`)
		return { success: true, context }
	} catch (error) {
		logger.error(`Context gathering failed for ${entityType}: ${entityName}`, error)

		// Provide fallback context for graceful degradation
		const fallbackMessage = `Context gathering temporarily unavailable for ${entityType} "${entityName}". Using simplified prompt.`

		return {
			success: false,
			error: error instanceof Error ? error.message : String(error),
			context: {
				nameConflicts: [],
				fallbackMode: true,
				fallbackMessage,
			} as T,
		}
	}
}

// Enhanced error messages for users
export function formatUserError(error: string, entityType: string, entityName: string): string {
	const commonErrors = {
		name_too_long: `Entity name "${entityName}" is too long. Please use 100 characters or less.`,
		name_empty: "Entity name cannot be empty. Please provide a name for your entity.",
		invalid_characters: `Entity name "${entityName}" contains invalid characters. Please use only letters, numbers, spaces, hyphens, apostrophes, and periods.`,
		context_gathering_failed: `Unable to gather campaign context for ${entityType} "${entityName}". This may be due to database connectivity issues. The prompt will work with limited context.`,
		database_error: "Database connection issue. Please try again in a moment.",
	}

	// Match error patterns
	if (error.includes("too long")) return commonErrors.name_too_long
	if (error.includes("empty")) return commonErrors.name_empty
	if (error.includes("invalid")) return commonErrors.invalid_characters
	if (error.includes("context") || error.includes("database")) return commonErrors.context_gathering_failed

	// Default error message
	return `An error occurred while creating ${entityType} "${entityName}": ${error}`
}

// Performance monitoring
export class PromptPerformanceMonitor {
	private static instance: PromptPerformanceMonitor
	private metrics: Map<string, { count: number; totalTime: number; errors: number }> = new Map()

	static getInstance(): PromptPerformanceMonitor {
		if (!PromptPerformanceMonitor.instance) {
			PromptPerformanceMonitor.instance = new PromptPerformanceMonitor()
		}
		return PromptPerformanceMonitor.instance
	}

	startTiming(promptName: string): () => void {
		const startTime = performance.now()

		return () => {
			const endTime = performance.now()
			const duration = endTime - startTime
			this.recordMetric(promptName, duration, false)
		}
	}

	recordError(promptName: string): void {
		this.recordMetric(promptName, 0, true)
	}

	private recordMetric(promptName: string, duration: number, isError: boolean): void {
		const current = this.metrics.get(promptName) || { count: 0, totalTime: 0, errors: 0 }

		this.metrics.set(promptName, {
			count: current.count + 1,
			totalTime: current.totalTime + duration,
			errors: current.errors + (isError ? 1 : 0),
		})

		// Log performance warnings
		if (duration > 1000) {
			// > 1 second
			logger.warn(`Slow prompt execution: ${promptName} took ${duration.toFixed(0)}ms`)
		}

		if (current.errors > 5) {
			// More than 5 errors
			logger.warn(`High error rate for prompt: ${promptName} (${current.errors} errors)`)
		}
	}

	getMetrics(): Record<string, { avgTime: number; errorRate: number; totalCalls: number }> {
		const result: Record<string, { avgTime: number; errorRate: number; totalCalls: number }> = {}

		for (const [promptName, metrics] of Array.from(this.metrics.entries())) {
			result[promptName] = {
				avgTime: metrics.count > 0 ? metrics.totalTime / metrics.count : 0,
				errorRate: metrics.count > 0 ? (metrics.errors / metrics.count) * 100 : 0,
				totalCalls: metrics.count,
			}
		}

		return result
	}
}

// Enhanced prompt handler wrapper
export function withEnhancedValidation<TArgs, TResult>(promptName: string, handler: (args: TArgs) => Promise<TResult>) {
	return async (args: TArgs): Promise<TResult> => {
		const monitor = PromptPerformanceMonitor.getInstance()
		const endTiming = monitor.startTiming(promptName)

		try {
			// Validate arguments
			const validation = validateContextGatheringArgs(args as any)
			if (!validation.valid) {
				monitor.recordError(promptName)
				throw new Error(formatUserError(validation.error || "Validation failed", promptName, (args as any).name))
			}

			// Execute with sanitized args
			const result = await handler(validation.sanitized as TArgs)
			endTiming()
			return result
		} catch (error) {
			monitor.recordError(promptName)
			endTiming()

			// Re-throw with enhanced error message
			const enhancedError =
				error instanceof Error
					? formatUserError(error.message, promptName, (args as any).name || "unknown")
					: String(error)

			throw new Error(enhancedError)
		}
	}
}
