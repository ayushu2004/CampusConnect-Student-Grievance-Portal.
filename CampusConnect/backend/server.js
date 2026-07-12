require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/error");

const authRoutes = require("./routes/auth.routes");
const complaintRoutes = require("./routes/complaint.routes");
const userRoutes = require("./routes/user.routes");
const statsRoutes = require("./routes/stats.routes");

const app = express();

// --- Security & core middleware ---
app.use(helmet());
app.use(
  cors({
    origin: (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(","),
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Basic rate limiting on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again later." },
});

// --- Routes ---
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", uptime: process.uptime(), ts: Date.now() })
);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stats", statsRoutes);

// --- Errors ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 CampusConnect API running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Mongo connection failed:", err.message);
    process.exit(1);
  });
