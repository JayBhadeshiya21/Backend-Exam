const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { createUser, getUsers } = require("../controllers/userController");

// MANAGER c an create all role
router.post("/", protect, authorize("MANAGER"), createUser);

// MANAGER can see all user
router.get("/", protect, authorize("MANAGER"), getUsers);

module.exports = router;