require("dotenv").config();

const express = require("express");
const connectDB = require("./src/DB/db");

const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const roleRoutes = require("./src/routes/roleRoutes");
const ticketRoutes = require("./src/routes/ticketRoutes");
const commentRoutes = require("./src/routes/commentRoutes");
const setupSwagger = require("./src/swagger");

const app = express();

// Connect DB
connectDB();

// Body parser
app.use(express.json());

// Swagger docs (mount BEFORE 404 middleware)
setupSwagger(app); // <- this mounts /api-docs

// Test route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Ticket Management API running 🚀" });
});

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/roles", roleRoutes);
app.use("/tickets", ticketRoutes);
app.use("/", commentRoutes);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));