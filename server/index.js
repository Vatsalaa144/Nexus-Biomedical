const express = require("express");
const cors = require("cors");
require("dotenv").config();

const emailRoute = require("./routes/email");

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

// ── CORS ──────────────────────────────────────────────────────────────────────
// Controls which domains can talk to your backend
// In development: allows localhost:3000 (your React app)
// In production:  allows only your real domain
const allowedOrigins = [
  "http://localhost:3000", // local React dev
  "http://localhost:5173", // local Vite dev
  "nexus-biomedical-git-main-vatsalas-projects-9d1036a9.vercel.app", // production domain from .env
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: ${origin} is not allowed`));
    },
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);

// ── Body Parser ───────────────────────────────────────────────────────────────
// Allows Express to read JSON from request body
app.use(express.json({ limit: "10kb" })); // max 10kb to prevent large payloads

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api", emailRoute);

// ── Health Check ──────────────────────────────────────────────────────────────
// Simple route to verify server is running
// Visit http://localhost:5000/health to check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Nexus Biomedical server is running",
  });
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📧 Emails will be sent to: ${process.env.RECIPIENT_EMAIL}`);
});
