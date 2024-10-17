import winston from 'winston';  // Import winston
import 'winston-daily-rotate-file';  // Import daily rotate file for Winston

const { format, transports } = winston;
const { combine, timestamp, printf, errors } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}] ${stack || message}`;
});

// Configure the daily rotate file transport for log rotation
const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: 'logs/%DATE%-app.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',  // Keep logs for 14 days
    maxSize: '20m',   // Max log file size
    level: 'info',    // Log level for file
});

const logger = winston.createLogger({
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),  // Add timestamp to logs
        errors({ stack: true }),  // Capture stack trace for errors
        logFormat
    ),
    transports: [
        dailyRotateFileTransport,  // Log to file with rotation
        new transports.Console({   // Log to console (useful for development)
            format: combine(
                format.colorize(),
                logFormat
            ),
            level: 'debug',  // Lower log level for console in development
        })
    ]
});

export default logger;  // Use ES module export
