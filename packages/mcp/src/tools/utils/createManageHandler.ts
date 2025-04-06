import { getTextForEntity, getGeminiEmbedding, EmbeddedEntityName } from "@tome-master/shared"
import { eq } from "drizzle-orm"
import { PgTable } from "drizzle-orm/pg-core"
import { z } from "zod"
import { logger, db } from "../.."
import { ToolHandler, ToolHandlerReturn } from "./types"

type EmbeddingConfig = {
	entityNameForEmbedding: EmbeddedEntityName
	enabledEnvVar: string
}

export const createEntityHandler = (
	table: PgTable,
	schema: z.ZodType<any>,
	entityName: string,
	embeddingConfig?: EmbeddingConfig,
): ToolHandler => {
	return async (args?: Record<string, unknown>): Promise<ToolHandlerReturn> => {
		try {
			if (!args) {
				return {
					content: [
						{
							type: "text",
							text: `Please provide parameters to manage ${entityName}. Use help({tool: 'manage_${entityName.replace(/-/g, "_")}'}) for details.`,
						},
					],
				}
			}
			logger.info(`Managing ${entityName}`, args)

			if (Object.keys(args).length === 1 && "id" in args) {
				const { id } = args as { id: number }

				if (!id) {
					return {
						isError: true,
						content: [
							{
								type: "text",
								text: "Error: Valid ID is required for delete operations.",
							},
						],
					}
				}

				logger.info(`Deleting ${entityName} with id ${id}`)

				const result = await db
					.delete(table)
					.where(eq((table as any).id, id))
					.returning({ deletedId: (table as any).id })

				return {
					content: [
						{
							type: "text",
							text:
								result.length > 0
									? `Successfully deleted ${entityName} with ID: ${id}`
									: `No ${entityName} found with ID: ${id}`,
						},
					],
				}
			}

			try {
				const parsedResult = schema.safeParse(args)
				if (!parsedResult.success) {
					const errors = parsedResult.error.errors.map((err) => `- '${err.path.join(".")}': ${err.message}`).join("\n")
					const operation = "id" in args ? "update" : "create"
					logger.error(`Validation error ${operation}ing ${entityName}:`, { errors })
					return {
						isError: true,
						content: [
							{
								type: "text",
								text: `Error ${operation}ing ${entityName}:\n${errors}\n\nUse help({tool: 'manage_${entityName.replace(/-/g, "_")}'}) for details.`,
							},
						],
					}
				}

				const parsedData = parsedResult.data
				const operation = parsedData.id ? "Updating" : "Creating"
				logger.info(`${operation} ${entityName}`, { args: parsedData })

				// --- Embedding Generation Logic ---
				let embeddingData: { embedding?: number[] } = {}

				if (embeddingConfig && process.env[embeddingConfig.enabledEnvVar] === "true") {
					try {
						logger.info(
							`${embeddingConfig.enabledEnvVar} is true. Generating embedding for ${entityName} ID: ${parsedData.id ?? "(new)"}`,
						)
						const textToEmbed = getTextForEntity(embeddingConfig.entityNameForEmbedding, parsedData)
						if (textToEmbed) {
							const embeddingVector = await getGeminiEmbedding(textToEmbed)
							embeddingData.embedding = embeddingVector
							logger.info(`Embedding generated for ${entityName} ID: ${parsedData.id ?? "(new)"}`)
						} else {
							logger.warn(
								`No text content generated for ${entityName} ID: ${parsedData.id ?? "(new)"}. Skipping embedding.`,
							)
						}
					} catch (embedError) {
						if (embedError instanceof Error) {
							logger.error(
								`Failed to generate embedding during ${operation} ${entityName} ID ${parsedData.id ?? "(new)"}:`,
								{ message: embedError.message, stack: embedError.stack },
							)
						}
					}
				}
				// --- End Embedding Generation Logic ---

				const dataToSave = { ...parsedData, ...embeddingData }

				if (dataToSave.id) {
					const result = await db
						.update(table)
						.set(dataToSave)
						.where(eq((table as any).id, dataToSave.id))
						.returning({
							successfullyUpdated: (table as any).id,
						})
					return {
						content: [
							{
								type: "text",
								text:
									result.length > 0
										? `Successfully updated ${entityName} with ID: ${dataToSave.id}`
										: `No ${entityName} found with ID: ${dataToSave.id}`,
							},
						],
					}
				} else {
					const { id, ...insertData } = dataToSave
					const result = await db
						.insert(table)
						.values(insertData as Record<string, unknown>)
						.returning({
							successfullyCreated: (table as any).id,
						})
					const newId = result[0]?.successfullyCreated
					return {
						content: [{ type: "text", text: `Successfully created new ${entityName} with ID: ${newId}` }],
					}
				}
			} catch (validationError) {
				if (validationError instanceof z.ZodError) {
					const errors = validationError.errors
						.map((err) => {
							const path = err.path.join(".")
							return `- '${path}': ${err.message}`
						})
						.join("\n")

					const operation = "id" in args ? "update" : "create"

					return {
						isError: true,
						content: [
							{
								type: "text",
								text: `Error ${operation}ing ${entityName}:\n${errors}\n\nUse help({tool: 'manage_${entityName.replace(/-/g, "_")}'}) for details on required parameters.`,
							},
						],
					}
				}

				throw validationError
			}
		} catch (error) {
			logger.error(`Error in ${entityName} handler:`, error)

			return {
				isError: true,
				content: [
					{
						type: "text",
						text: `Error processing ${entityName}: ${error instanceof Error ? error.message : String(error)}\n\nUse help({tool: 'manage_${entityName.replace(/-/g, "_")}'}) for usage details.`,
					},
				],
			}
		}
	}
}
