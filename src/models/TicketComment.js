const mongoose = require("mongoose");

const ticketCommentSchema = new mongoose.Schema({
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
}, { timestamps: { createdAt: "created_at", updatedAt: false } });

module.exports = mongoose.model("TicketComment", ticketCommentSchema);