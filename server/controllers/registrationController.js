import Registration from "../models/Registration.js";
import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";
import crypto from "crypto";

// @desc    Register for an event (book a ticket)
// @route   POST /api/registrations
export const registerForEvent = async (req, res) => {
  try {
    const { ticketId, guestCount, specialRequests } = req.body;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket || !ticket.isActive) {
      return res.status(404).json({ message: "Ticket not found or inactive" });
    }

    // Check sold out
    if (ticket.soldCount + (guestCount || 1) > ticket.quantity) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    // Check maxPerUser limit
    const existingCount = await Registration.countDocuments({
      user: req.user._id,
      ticket: ticketId,
      status: { $ne: "cancelled" },
    });

    if (existingCount + (guestCount || 1) > ticket.maxPerUser) {
      return res.status(400).json({
        message: `You can only book up to ${ticket.maxPerUser} of this ticket type`,
      });
    }

    // Generate a unique QR code string
    const qrCode = crypto.randomBytes(16).toString("hex");

    const registration = await Registration.create({
      user: req.user._id,
      event: ticket.event,
      ticket: ticket._id,
      guestCount: guestCount || 1,
      specialRequests: specialRequests || "",
      amount: ticket.price * (guestCount || 1),
      paymentStatus: ticket.price > 0 ? "pending" : "not_required",
      qrCode,
    });

    // Update ticket sold count
    ticket.soldCount += guestCount || 1;
    await ticket.save();

    // Update event registered count
    await Event.findByIdAndUpdate(ticket.event, {
      $inc: { registeredCount: guestCount || 1 },
    });

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's registrations
// @route   GET /api/registrations/my
export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate("event", "title slug startDate banner")
      .populate("ticket", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};