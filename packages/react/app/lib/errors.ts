import { data } from "react-router"

/**
 * Custom error class for when an entity is not found.
 */
export class EntityNotFoundError extends Error {
	public entityType: string
	public identifier: string | number

	constructor(entityType: string, identifier: string | number, message?: string) {
		super(message || `${entityType} with identifier "${identifier}" not found.`)
		this.name = "EntityNotFoundError"
		this.entityType = entityType
		this.identifier = identifier

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, EntityNotFoundError)
		}
	}
}

export const orNotFound = async <T>(entity: Promise<T>): Promise<T> => {
	try {
		return await entity
	} catch (error) {
		if (error instanceof EntityNotFoundError) {
			throw data(error.message, { status: 404 })
		}
		throw error
	}
}
