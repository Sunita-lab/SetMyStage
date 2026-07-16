import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { getEventBySlug } from "../services/eventService";
import { getTicketsForEvent, createTicket } from "../services/ticketService";
import { registerForEvent } from "../services/registrationService";
import { useAuth } from "../context/AuthContext";

function EventDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState(null);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  // Naya state — add ticket form ke liye
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketForm, setTicketForm] = useState({ name: "", price: "", quantity: "", maxPerUser: "5" });
  const [addingTicket, setAddingTicket] = useState(false);

  const fetchData = async () => {
    try {
      const eventData = await getEventBySlug(slug);
      setEvent(eventData);

      const ticketData = await getTicketsForEvent(eventData._id);
      setTickets(ticketData);
    } catch (err) {
      setError("Event not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  const isOrganizerOfEvent = user && event && event.organizer?._id === user._id;

  const handleAddTicket = async (e) => {
    e.preventDefault();
    setAddingTicket(true);

    try {
      await createTicket(event._id, {
        name: ticketForm.name,
        price: Number(ticketForm.price) || 0,
        quantity: Number(ticketForm.quantity),
        maxPerUser: Number(ticketForm.maxPerUser) || 5,
      });
      setTicketForm({ name: "", price: "", quantity: "", maxPerUser: "5" });
      setShowTicketForm(false);
      fetchData(); // list refresh karo naye ticket ke saath
    } catch (err) {
      setBookingError(err.response?.data?.message || "Failed to add ticket");
    } finally {
      setAddingTicket(false);
    }
  };

  const handleBook = async (ticketId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    setBookingId(ticketId);
    setBookingError("");
    setBookingSuccess("");

    try {
      const registration = await registerForEvent({ ticketId, guestCount: 1 });
      if (registration.status === "waitlisted") {
        setBookingSuccess("You've been added to the waitlist. We'll notify you if a spot opens up.");
      } else {
        setBookingSuccess("Ticket booked! Check 'My Registrations' for your QR code.");
      }
    } catch (err) {
      setBookingError(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingId(null);
    }
  };

  if (loading) return <p className="text-center mt-10 text-mist">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-danger">{error}</p>;

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="max-w-3xl mx-auto bg-surface rounded-card shadow-md p-8 border border-border">
        <span className="bg-accent text-ink px-3 py-1 rounded-full text-xs font-semibold">
          {event.category}
        </span>

        <h1 className="font-heading font-bold text-3xl text-primary mt-4 mb-2">{event.title}</h1>
        <p className="text-mist mb-6">{event.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-mist">Start Date</p>
            <p className="text-ink font-medium">{new Date(event.startDate).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-mist">End Date</p>
            <p className="text-ink font-medium">{new Date(event.endDate).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-mist">Mode</p>
            <p className="text-ink font-medium capitalize">{event.mode}</p>
          </div>
          <div>
            <p className="text-mist">Capacity</p>
            <p className="text-ink font-medium">{event.registeredCount} / {event.capacity} registered</p>
          </div>
          {event.location?.venue && (
            <div className="col-span-2">
              <p className="text-mist">Location</p>
              <p className="text-ink font-medium">{event.location.venue}, {event.location.city}</p>
            </div>
          )}
        </div>

        <p className="text-mist text-sm mt-6">
          Organized by <span className="text-ink font-medium">{event.organizer?.name}</span>
        </p>

        {/* Tickets Section */}
        <div className="mt-8 border-t border-border pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-heading font-semibold text-xl text-ink">Tickets</h2>
            {isOrganizerOfEvent && (
              <button
                onClick={() => setShowTicketForm(!showTicketForm)}
                className="flex items-center gap-1 text-secondary text-sm font-semibold hover:underline"
              >
                <Plus size={16} /> Add Ticket Type
              </button>
            )}
          </div>

          {showTicketForm && (
            <form
              onSubmit={handleAddTicket}
              className="bg-background border border-border rounded-input p-4 mb-4 space-y-3"
            >
              <input
                type="text"
                placeholder="Ticket name (e.g. VIP Pass)"
                value={ticketForm.name}
                onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                required
                className="w-full border border-border rounded-input px-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={ticketForm.price}
                  onChange={(e) => setTicketForm({ ...ticketForm, price: e.target.value })}
                  min={0}
                  className="border border-border rounded-input px-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={ticketForm.quantity}
                  onChange={(e) => setTicketForm({ ...ticketForm, quantity: e.target.value })}
                  required
                  min={1}
                  className="border border-border rounded-input px-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <input
                  type="number"
                  placeholder="Max/user"
                  value={ticketForm.maxPerUser}
                  onChange={(e) => setTicketForm({ ...ticketForm, maxPerUser: e.target.value })}
                  min={1}
                  className="border border-border rounded-input px-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <button
                type="submit"
                disabled={addingTicket}
                className="bg-primary text-white text-sm font-semibold px-4 py-2 rounded-btn hover:opacity-90 transition disabled:opacity-50"
              >
                {addingTicket ? "Adding..." : "Add Ticket"}
              </button>
            </form>
          )}

          {bookingError && <p className="text-danger text-sm mb-4">{bookingError}</p>}
          {bookingSuccess && <p className="text-success text-sm mb-4">{bookingSuccess}</p>}

          {tickets.length === 0 ? (
            <p className="text-mist text-sm">No tickets available yet.</p>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => {
                const soldOut = ticket.soldCount >= ticket.quantity;
                return (
                  <div key={ticket._id} className="flex justify-between items-center border border-border rounded-input p-4">
                    <div>
                      <p className="font-semibold text-ink">{ticket.name}</p>
                      <p className="text-mist text-sm">{ticket.description}</p>
                      <p className="text-primary font-semibold mt-1">
                        {ticket.price > 0 ? `₹${ticket.price}` : "Free"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleBook(ticket._id)}
                      disabled={bookingId === ticket._id}
                      className="bg-secondary text-white text-sm font-semibold px-5 py-2 rounded-btn hover:opacity-90 transition disabled:opacity-50"
                    >
                      {bookingId === ticket._id ? "Booking..." : soldOut ? "Join Waitlist" : "Book"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Link to="/" className="inline-block mt-6 text-primary font-semibold">
          ← Back to Events
        </Link>
      </div>
    </div>
  );
}

export default EventDetailPage;