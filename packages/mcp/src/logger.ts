import winston from "winston"

const LOG_FILE = "/Users/mikemurray/Development/DND-Campaign/server.log"

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
