const express  = require("express");
const cors     = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const emailRoute      = require("./routes/email");
const membershipRoute = require("./routes/membership");           // ← NEW

const { startRenewalScheduler } = require("./utils/renewalScheduler"); // ← NEW

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

// ── MongoDB ───────────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    startRenewalScheduler();                                       // ← NEW
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ── CORS ──────────────────────────────────────────────────────────────────────
// Controls which domains can talk to your backend
// In development: allows localhost:3000 (your React app)
// In production:  allows only your real domain
const allowedOrigins = [
  "http://localhost:5173",
  "https://nexus-biomedical.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (origin === process.env.SERVER_URL) return callback(null, true);
      return callback(new Error(`CORS blocked: ${origin} is not allowed`));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);

// ── Body Parser ───────────────────────────────────────────────────────────────
// Allows Express to read JSON from request body
app.use(express.json({ limit: "10kb" })); // max 10kb to prevent large payloads
app.use(express.urlencoded({ extended: true }));                  // ← NEW (needed for multipart form fields)

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/uploads", express.static("uploads"));

app.use("/api", emailRoute);
app.use("/api/membership", membershipRoute);                      // ← NEW

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