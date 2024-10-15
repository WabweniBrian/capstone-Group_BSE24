import express from "express";
import mongoose from "mongoose";
import morgan from "morgan"; // Import Morgan using ES module syntax
import logger from "./utils/logger.js"; // Import Winston logger (make sure logger.js uses ES module syntax)
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import path from "path";

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

app.use(express.json());
app.use(cookieParser());

// Morgan stream to log HTTP requests to Winston
const morganStream = {
  write: (message) => logger.info(message.trim()) // Send Morgan logs to Winston
};

// Use Morgan middleware to log HTTP requests and integrate with Winston
app.use(morgan('combined', { stream: morganStream }));

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

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

app.listen(5000, () => {
  logger.info("Server listening on port 5000");  // Log server start using Winston
});
