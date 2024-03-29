require("dotenv").config({ path: __dirname + "/.env" });
const checkEnvVariables = require("./src/utils/checkEnvVariables");
const logger = require("./src/utils/errorHandlings/logger");

// Check for required environment variables
const requiredEnvVariables = [
    "PORT",
    "DB_URL",
    "CORS_ORIGIN",
    "JWT_SECRET_KEY",
];

checkEnvVariables(requiredEnvVariables);

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Routes
const authRoutes = require("./src/routes/authRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const userRoutes = require("./src/routes/userRoutes");
const formRoutes = require("./src/routes/formRoutes");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Configure CORS to allow requests from your frontend domain
app.use(cors({
    origin: "https://form-builder-kappa-nine.vercel.app",
    // origin: "http://localhost:5173",
    methods: ["GET", "POST"], // You can specify the allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify the allowed headers
    credentials: true, // Allow credentials
}));

app.use((err, req, res, next) => {
    logger.error("Global error middleware: ", err.stack);
    res.status(500).json({
        status: "failed",
        message: "Something went wrong!"
    });
});

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/forms", formRoutes);

module.exports = app;
