const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createTicket,
  getTickets,
  assignTicket,
  updateStatus,
  deleteTicket,
} = require("../controllers/ticketController");

router.post("/", protect, authorize("USER", "MANAGER"), createTicket);

router.get("/", protect, authorize("USER", "SUPPORT", "MANAGER"), getTickets);

router.patch("/:id/assign", protect, authorize("MANAGER", "SUPPORT"), assignTicket);

router.patch("/:id/status", protect, authorize("MANAGER", "SUPPORT"), updateStatus);

router.delete("/:id", protect, authorize("MANAGER"), deleteTicket);

module.exports = router;