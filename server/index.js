const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const { verifyToken } = require("./utils/adminToken");

const emailRoute = require("./routes/email");
const membershipRoute = require("./routes/membership");

const { startRenewalScheduler } = require("./utils/renewalScheduler");

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;

// ── ENV VALIDATION (UPDATED FOR RESEND) ───────────────────────
const REQUIRED_ENV = [
  "MONGO_URI",
  "RESEND_API_KEY",
  "FROM_EMAIL",
  "RECIPIENT_EMAIL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const PRODUCTION_REQUIRED_ENV = [
  ...REQUIRED_ENV,
  "SERVER_URL",
  "ADMIN_TOKEN_SECRET",
];

const requiredEnv =
  process.env.NODE_ENV === "production"
    ? PRODUCTION_REQUIRED_ENV
    : REQUIRED_ENV;

const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length) {
  console.error(`❌ Missing env variable(s): ${missingEnv.join(", ")}`);
  process.exit(1);
}

if (process.env.NODE_ENV !== "production") {
  if (!process.env.SERVER_URL) {
    console.warn(
      "⚠️ SERVER_URL not set; using http://localhost:5000 for links",
    );
  }
  if (!process.env.ADMIN_TOKEN_SECRET) {
    console.warn("⚠️ ADMIN_TOKEN_SECRET not set (dev only)");
  }
}

// ── MongoDB ──────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    startRenewalScheduler();
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ── CORS ─────────────────────────────────────────────────────
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
      return callback(new Error(`CORS blocked: ${origin}`));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);

// ── Body Parser ──────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// ── Legacy File Route ─────────────────────────────────────────
app.get("/uploads/membership/:filename", (req, res) => {
  if (!verifyToken(req.query.id, req.query.token)) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const filename = path.basename(req.params.filename);
  if (filename !== req.params.filename) {
    return res.status(400).json({ error: "Invalid filename" });
  }

  return res.sendFile(
    path.join(__dirname, "uploads", "membership", filename),
    (err) => {
      if (err && !res.headersSent) {
        return res.status(404).json({ error: "File not found" });
      }
    },
  );
});

// ── Routes ───────────────────────────────────────────────────
app.use("/api", emailRoute);
app.use("/api/membership", membershipRoute);

// ── Health Check ─────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Nexus Biomedical server is running",
  });
});

// ── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Emails sending from: ${process.env.FROM_EMAIL}`);
  console.log(`📥 Admin receives emails at: ${process.env.RECIPIENT_EMAIL}`);
});