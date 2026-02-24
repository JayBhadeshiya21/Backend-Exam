const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { createUser, getUsers } = require("../controllers/userController");

// MANA GER c an create all role
router.post("/", protect, authorize("MANAGER"), createUser);

// MANAHER can see all user
router.get("/", protect, authorize("MANAGER"), getUsers);

module.exports = router;