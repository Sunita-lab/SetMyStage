import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import User from "../models/User.js";

// @desc    Get organizer's dashboard stats
// @route   GET /api/dashboard/organizer
export const getOrganizerStats = async (req, res) => {
  try {
    const organizerId = req.user._id;

    // Organizer ke saare events dhoondo
    const events = await Event.find({ organizer: organizerId });
    const eventIds = events.map((e) => e._id);

    // Un events ke saare registrations dhoondo
    const registrations = await Registration.find({
      event: { $in: eventIds },
      status: { $ne: "cancelled" },
    });

    const totalRevenue = registrations.reduce((sum, reg) => sum + reg.amount, 0);
    const totalCheckedIn = registrations.filter((reg) => reg.checkedInAt).length;

    const upcomingEvents = events
      .filter((e) => new Date(e.startDate) > new Date())
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 5);

    res.status(200).json({
      totalEvents: events.length,
      totalRegistrations: registrations.length,
      totalRevenue,
      totalCheckedIn,
      upcomingEvents,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin's platform-wide stats
// @route   GET /api/dashboard/admin
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrganizers = await User.countDocuments({ role: "organizer" });
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments({
      status: { $ne: "cancelled" },
    });

    res.status(200).json({
      totalUsers,
      totalOrganizers,
      totalEvents,
      totalRegistrations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendee's dashboard stats
// @route   GET /api/dashboard/attendee
export const getAttendeeStats = async (req, res) => {
  try {
    const registrations = await Registration.find({
      user: req.user._id,
      status: { $ne: "cancelled" },
    }).populate("event", "title slug startDate");

    const totalRegistrations = registrations.length;
    const totalAttended = registrations.filter((reg) => reg.checkedInAt).length;

    const upcoming = registrations
      .filter((reg) => reg.event && new Date(reg.event.startDate) > new Date())
      .sort((a, b) => new Date(a.event.startDate) - new Date(b.event.startDate))
      .slice(0, 5);

    res.status(200).json({
      totalRegistrations,
      totalAttended,
      upcoming,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};