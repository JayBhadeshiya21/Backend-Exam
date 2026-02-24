const Ticket = require("../models/Ticket");
const User = require("../models/User");


exports.createTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      created_by: req.user._id, 
    });

    res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    res.status(400).json({ message: `Ticket validation failed: ${error.message}` });
  }
};


exports.getTickets = async (req, res) => {
  try {
    let tickets;

    if (req.user.role.name === "MANAGER") {
      tickets = await Ticket.find().populate("created_by assigned_to", "name email role");
    } else if (req.user.role.name === "SUPPORT") {
      tickets = await Ticket.find({ assigned_to: req.user._id }).populate("created_by assigned_to", "name email role");
    } else {
      // USER
      tickets = await Ticket.find({ created_by: req.user._id }).populate("created_by assigned_to", "name email role");
    }

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    // Only assign to SUPPORT
    const user = await User.findById(userId);
    if (!user || user.role.name !== "SUPPORT") {
      return res.status(400).json({ message: "Ticket can only be assigned to SUPPORT users" });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.assigned_to = userId;
    ticket.status = "IN_PROGRESS";
    await ticket.save();

    res.status(200).json({
      message: "Ticket assigned successfully",
      ticket,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    // Check allowed transition
    if (!ticket.canTransition(status)) {
      return res.status(400).json({ message: `Cannot transition from ${ticket.status} → ${status}` });
    }

    ticket.status = status;
    await ticket.save();

    res.status(200).json({
      message: "Ticket status updated",
      ticket,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    await ticket.remove();

    res.status(200).json({
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};