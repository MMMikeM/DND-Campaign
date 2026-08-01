import winston from "winston"

const LOG_FILE = process.env.LOG_FILE ?? new URL("../server.log", import.meta.url).pathname

const errorFormat = winston.format((info) => {
	if (info instanceof Error) {
		return {
			...info,
			message: info.message,
			stack: info.stack,
			...Object.getOwnPropertyNames(info).reduce(
				(acc, key) => {
					if (!["name", "message", "stack"].includes(key)) {
						acc[key] = (info as any)[key]
					}
					return acc
				},
				{} as Record<string, any>,
			),
		}
	}
	return info
})

export const serializeError = (error: unknown) =>
	error instanceof Error
		? { name: error.name, message: error.message, stack: error.stack, cause: error.cause }
		: { errorType: typeof error, errorValue: error, errorString: String(error) }

export const createLogger = () => {
	const logger = winston.createLogger({
		level: "debug",
		format: winston.format.combine(
			winston.format.timestamp({ format: "isoDateTime" }),
			errorFormat(),
			winston.format.json(),
		),
		transports: [
			new winston.transports.File({
				filename: LOG_FILE,
				tailable: true,
				maxsize: 10 * 1024 * 1024, // 10MB
				maxFiles: 5,
			}),
		],
		exceptionHandlers: [new winston.transports.File({ filename: LOG_FILE })],
		rejectionHandlers: [new winston.transports.File({ filename: LOG_FILE })],
	})

	process.on("SIGINT", () => {
		logger.info("SIGINT received, shutting down gracefully.")
		logger.end(() => process.exit(0))
	})

	logger.info("Logger initialized", {
		logFile: LOG_FILE,
		logLevel: "debug",
	})

	return logger
}
