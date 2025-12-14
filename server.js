import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import analyzeRoutes from "./routes/analyze.route.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serve frontend files

// routes
console.log("GitHub Token Loaded:", !!process.env.GITHUB_TOKEN);
app.use("/api", analyzeRoutes);

// health check
app.get("/", (req, res) => {
  res.send("Repository Mirror Backend is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
