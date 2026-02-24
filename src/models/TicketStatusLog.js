const mongoose = require("mongoose");

const ticketStatusLogSchema = new mongoose.Schema({
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
  },
  old_status: {
    type: String,
    enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
    required: true,
  },
  new_status: {
    type: String,
    enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
    required: true,
  },
  changed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: { createdAt: "changed_at", updatedAt: false } });

module.exports = mongoose.model("TicketStatusLog", ticketStatusLogSchema);