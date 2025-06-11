import pino from "pino"

const LOG_FILE = "/Users/mikemurray/Development/DND-Campaign/server.log"

export const createLogger = () => {
	// Create a custom error serializer that handles all error properties
	const errorSerializer = (err: any) => {
		if (err instanceof Error) {
			return {
				type: err.constructor.name,
				name: err.name,
				message: err.message,
				stack: err.stack,
				// Include any additional properties on the error object
				...Object.getOwnPropertyNames(err).reduce((acc, key) => {
					if (!['name', 'message', 'stack'].includes(key)) {
						acc[key] = (err as any)[key]
					}
					return acc
				}, {} as any)
			}
		}
		return err
	}

	// Simplified transport configuration - always log to file
	const transport = pino.transport({
		targets: [
			{
				target: "pino/file",
				level: "debug",
				options: { 
					destination: LOG_FILE,
					mkdir: true,
					sync: false  // Use async writing for better performance
				}
			},
		]
	})

	const logger = pino(
		{
			level: "debug", // Always use debug level to capture all logs
			timestamp: pino.stdTimeFunctions.isoTime,
			serializers: {
				error: errorSerializer,
				err: errorSerializer,
			},
		},
		transport,
	)

	process.on("SIGINT", () => {
		logger.info("SIGINT received")
		process.exit(0)
	})
	
	logger.info("Logger initialized", {
		logFile: LOG_FILE,
		logLevel: "debug"
	})

	return logger
}
