import express from "express";
import mongoose from "mongoose";
import morgan from "morgan"; // Import Morgan using ES module syntax
import logger from "./utils/logger.js"; // Import Winston logger (make sure logger.js uses ES module syntax)
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import { collectDefaultMetrics, register, Counter, Histogram } from "prom-client";
dotenv.config();

console.log("MONGODB_URI:", process.env.MONGODB_URI);


// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    logger.info("Connected to MongoDB");  // Log successful connection using Winston
  })
  .catch((err) => {
    logger.error("MongoDB connection error:", err);  // Log error using Winston
  });



const __dirname = path.resolve();

const app = express();

// Start collecting default metrics (Node.js process metrics)
collectDefaultMetrics();


// Custom Prometheus Metrics
const httpRequestCounter = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
});

const httpRequestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  buckets: [0.1, 0.3, 0.5, 1, 1.5], // Request duration buckets in seconds
});

// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Morgan stream to log HTTP requests to Winston
const morganStream = {
  write: (message) => logger.info(message.trim()) // Send Morgan logs to Winston
};

// Use Morgan middleware to log HTTP requests and integrate with Winston
app.use(morgan('combined', { stream: morganStream }));

// Middleware to collect custom metrics for each HTTP request
app.use((req, res, next) => {
  httpRequestCounter.inc(); // Increment the counter for each request

  const end = httpRequestDuration.startTimer(); // Start the timer for request duration
  res.on("finish", () => {
    end(); // Stop the timer when the request finishes
  });
  next();
});

// Define routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// Expose Prometheus metrics at /metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log the error details using Winston
  logger.error(`${statusCode} - ${message} - ${err.stack}`);

  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// Catch-all route for frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Start the server
app.listen(5000, () => {
  logger.info("Server listening on port 5000");  // Log server start using Winston
});
