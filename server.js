require("dotenv").config();

const express = require("express");
const connectDB = require("./src/DB/db");

const { notFound, errorHandler } = require("./src/middleware/errorMiddleware");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const roleRoutes = require("./src/routes/roleRoutes");
const ticketRoutes = require("./src/routes/ticketRoutes")
const seedRoles = require("./src/seedRoles");
const commentRoutes = require("./src/routes/commentRoutes");

const app = express();

// Connect to database
connectDB();

// Body parser
app.use(express.json());

// Start route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Ticket Management API running 🚀",
  });
});
 

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/roles", roleRoutes);
app.use("/tickets", ticketRoutes);
app.use("/", commentRoutes);  

// 4Global lavel err handle
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});