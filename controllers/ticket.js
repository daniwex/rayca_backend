const ticket = require("../db/models/ticket");
const User = require("../db/models/Users");

const sendEmailNotification = require("../email/mail");

const getAllTickets = async (req, res) => {
  try {
    const tickets = await ticket.find({
      $or: [{ created_by: req.user.userId }, { assignedTo: req.user.userId }],
    });
    res.status(200).json({ tickets, count: tickets.length });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve tickets", error });
  }
};

const getTicketsCreated = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "support") {
      return res.status(403).json({
        message:
          "You do not have the right authorization to complete this action",
      });
    }
    const tickets = await ticket.find();
    res.status(200).json({ tickets, count: tickets.length });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve tickets", error });
  }
};

const createTicket = async (req, res) => {
  const created_by = req.user.userId;

  try {
    const newTicket = await ticket.create({
      ...req.body,
      created_by,
    });
    res.status(201).json({ ticket: newTicket });
  } catch (error) {
    res.status(400).json({ message: "Failed to create ticket", error });
  }
};

const findTicket = async (req, res) => {
  const id = req.params.id;

  try {
    const tik = await ticket.findById({ _id: id });
    if (!tik) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json({ tik });
  } catch (error) {
    res.status(500).json({ message: "Failed to find ticket", error });
  }
};

const updateTicket = async (req, res) => {
  const id = req.params.id;
  const { body, status, title } = req.body;

  try {
    if (req.user.role !== "admin" && req.user.role !== "support") {
      return res.status(403).json({
        message:
          "You do not have the right authorization to complete this action",
      });
    }

    const updatedTicket = await ticket.findByIdAndUpdate(
      { _id: id, created_by: req.user.userId },
      { body, status, title },
      { new: true, runValidators: true }
    );
    if (ticketToUpdate.status !== status) {
      const user = await User.findById(updatedTicket.created_by);
      const emailSubject = `Ticket Status Updated: ${title}`;
      const emailText = `Hello, \n\nThe status of your ticket "${title}" has been updated to "${status}"`;

      await sendEmailNotification(user.email, emailSubject, emailText);
    }

    if (!updatedTicket) {
      return res
        .status(404)
        .json({ message: "Ticket not found or not authorized to update" });
    }
    res
      .status(200)
      .json({ updatedTicket, message: "Ticket successfully updated" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update ticket", error });
  }
};

const deleteTicket = async (req, res) => {
  const id = req.params.id;

  try {
    if (req.user.role != "admin" && req.user.role != "support") {
      return res.status(403).json({
        message:
          "You do not have the right authorization to complete this action",
      });
    }

    const deletedTicket = await ticket.findByIdAndDelete({
      _id: id,
      created_by: req.user.userId,
    });

    if (!deletedTicket) {
      return res
        .status(404)
        .json({ message: "Ticket not found or not authorized to delete" });
    }
    res
      .status(200)
      .json({ deletedTicket, message: "Ticket successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete ticket", error });
  }
};

const assignTicket = async (req, res) => {
  const id = req.params.id;
  const userId = req.body.userId;

  try {
    const user = await User.findById(userId);
    if (req.user.role != "admin" && req.user.role != "support") {
      return res.status(403).json({
        message:
          "You do not have the right authorization to complete this action",
      });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedTicket = await ticket.findByIdAndUpdate(id, {
      assignedTo: userId,
    });

    if (!updatedTicket) {
      return res
        .status(404)
        .json({ message: "Ticket not found or not authorized to assign" });
    }

    res.status(200).json({
      updatedTicket,
      message: `Ticket successfully assigned to user ${userId}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to assign ticket", error });
  }
};

module.exports = {
  getAllTickets,
  createTicket,
  findTicket,
  updateTicket,
  deleteTicket,
  getTicketsCreated,
  assignTicket,
};
