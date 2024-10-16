import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import { collectDefaultMetrics, register, Counter, Histogram } from "prom-client"; // Import Prometheus client

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
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
  console.log("Server listening on port 5000");
});
