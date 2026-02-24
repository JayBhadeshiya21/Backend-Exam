const mongoose = require("mongoose");

const allowedStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const allowedTransitions = {
  OPEN: "IN_PROGRESS",
  IN_PROGRESS: "RESOLVED",
  RESOLVED: "CLOSED",
};

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: [5, "Title must be at least 5 characters"],
  },
  description: {
    type: String,
    required: true,
    minlength: [10, "Description must be at least 10 characters"],
  },
  status: {
    type: String,
    enum: allowedStatuses,
    default: "OPEN",
  },
  priority: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH"],
    default: "MEDIUM",
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
}, { timestamps: true });


// 🔒 Status transition validation
ticketSchema.methods.canTransition = function(newStatus) {
  return allowedTransitions[this.status] === newStatus;
};

module.exports = mongoose.model("Ticket", ticketSchema);