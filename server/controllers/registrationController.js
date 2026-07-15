import Registration from "../models/Registration.js";
import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";
import crypto from "crypto";
import QRCode from "qrcode";

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

    const qrCodeImage = await QRCode.toDataURL(qrCode);

    const registration = await Registration.create({
      user: req.user._id,
      event: ticket.event,
      ticket: ticket._id,
      guestCount: guestCount || 1,
      specialRequests: specialRequests || "",
      amount: ticket.price * (guestCount || 1),
      paymentStatus: ticket.price > 0 ? "pending" : "not_required",
      qrCode,
      qrCodeImage,
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

// @desc    Check-in attendee via QR code
// @route   POST /api/registrations/checkin
export const checkInAttendee = async (req, res) => {
  try {
    const { qrCode } = req.body;

    const registration = await Registration.findOne({ qrCode }).populate("event").populate("user", "name email");

    if (!registration) {
      return res.status(404).json({ message: "Invalid QR code — registration not found" });
    }

    // Sirf event ka organizer hi check-in kar sake
    if (registration.event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to check in attendees for this event" });
    }

    if (registration.status === "cancelled") {
      return res.status(400).json({ message: "This registration has been cancelled" });
    }

    if (registration.checkedInAt) {
      return res.status(400).json({
        message: `Already checked in at ${registration.checkedInAt.toLocaleString()}`,
      });
    }

    registration.checkedInAt = new Date();
    await registration.save();

    res.status(200).json({
      message: "Checked in successfully",
      attendeeName: registration.user.name,
      eventTitle: registration.event.title,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export attendance records as CSV for an event
// @route   GET /api/registrations/event/:eventId/export
export const exportAttendance = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const registrations = await Registration.find({
      event: req.params.eventId,
      status: { $ne: "cancelled" },
    })
      .populate("user", "name email")
      .populate("ticket", "name price");

    // CSV header row
    let csv = "Name,Email,Ticket Type,Amount,Status,Checked In At,Registered At\n";

    registrations.forEach((reg) => {
      const row = [
        reg.user?.name || "",
        reg.user?.email || "",
        reg.ticket?.name || "",
        reg.amount,
        reg.checkedInAt ? "Checked In" : "Not Checked In",
        reg.checkedInAt ? new Date(reg.checkedInAt).toLocaleString() : "",
        new Date(reg.createdAt).toLocaleString(),
      ];
      csv += row.map((val) => `"${val}"`).join(",") + "\n";
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${event.slug}-attendance.csv"`
    );
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};