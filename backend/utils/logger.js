// utils/logger.js
const winston = require('winston');

// Define the log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Create a logger with transports
const logger = winston.createLogger({
  level: 'info', // You can set the log level as needed
  format: logFormat,
  transports: [
    new winston.transports.Console(), // Log to console
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to a file
    new winston.transports.File({ filename: 'logs/combined.log' }) // Log all messages to a file
  ],
});

// Express middleware for logging HTTP requests
const expressLogger = winston.createLogger({
  format: logFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/requests.log' })
  ],
});

module.exports = { logger, expressLogger };