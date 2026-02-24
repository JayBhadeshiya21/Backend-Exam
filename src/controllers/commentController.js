const TicketComment = require("../models/TicketComment");
const Ticket = require("../models/Ticket");

// Add Commmet 
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params; 
    const { comment } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // RBAC: USER (creator), SUPPORT (assigned), MANAGER
    if (
      req.user.role.name === "USER" && ticket.created_by.toString() !== req.user._id.toString() &&
      req.user.role.name === "SUPPORT" && ticket.assigned_to?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const newComment = await TicketComment.create({
      ticket: id,
      user: req.user._id,
      comment,
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// List of comments
exports.listComments = async (req, res) => {
  try {
    const { id } = req.params; // ticket ID

    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // RBAC: USER (creator), SUPPORT (assigned), MANAGER
    if (
      req.user.role.name === "USER" && ticket.created_by.toString() !== req.user._id.toString() &&
      req.user.role.name === "SUPPORT" && ticket.assigned_to?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const comments = await TicketComment.find({ ticket: id })
      .populate("user", "name email role")
      .sort({ created_at: 1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// edit comment 
exports.editComment = async (req, res) => {
  try {
    const { id } = req.params; // comment ID
    const { comment } = req.body;

    const existingComment = await TicketComment.findById(id);
    if (!existingComment) return res.status(404).json({ message: "Comment not found" });

    // Only author or MANAGER can edit
    if (
      existingComment.user.toString() !== req.user._id.toString() &&
      req.user.role.name !== "MANAGER"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    existingComment.comment = comment;
    await existingComment.save();

    res.status(200).json({
      message: "Comment updated successfully",
      comment: existingComment,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

  // Delete commnet mange 
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const existingComment = await TicketComment.findById(id);
    if (!existingComment) return res.status(404).json({ message: "Comment not found" });

    // Only mange can d o it 
    if (
      existingComment.user.toString() !== req.user._id.toString() &&
      req.user.role.name !== "MANAGER"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await existingComment.remove();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};