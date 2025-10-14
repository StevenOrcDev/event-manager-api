import winston from "winston";

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// En production, les logs seront disponibles dans des fichiers distincts
// pour les erreurs et les logs combinés.
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  defaultMeta: { service: "event-manager-api" },
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      handleExceptions: true,
      handleRejections: true,
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      handleExceptions: true,
      handleRejections: true,
    }),
  ],
});

// Console logging for development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}
