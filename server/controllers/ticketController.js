import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";

// @desc    Create a ticket type for an event
// @route   POST /api/events/:eventId/tickets
export const createTicket = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to add tickets to this event" });
    }

    const ticket = await Ticket.create({
      ...req.body,
      event: event._id,
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tickets for an event
// @route   GET /api/events/:eventId/tickets
export const getTicketsForEvent = async (req, res) => {
  try {
    const tickets = await Ticket.find({ event: req.params.eventId, isActive: true });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};