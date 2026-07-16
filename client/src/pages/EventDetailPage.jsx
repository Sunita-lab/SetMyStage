import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Plus, MapPin, Calendar, Users } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("about");

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
      fetchData();
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
      setBookingSuccess(
        registration.status === "waitlisted"
          ? "Added to waitlist — we'll notify you if a spot opens up."
          : "Booked! Check 'My Registrations' for your QR code."
      );
    } catch (err) {
      setBookingError(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingId(null);
    }
  };

  if (loading) return <p className="text-center mt-10 text-mist">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-danger">{error}</p>;

  const lowestPrice = tickets.length > 0 ? Math.min(...tickets.map((t) => t.price)) : null;
  const totalLeft = tickets.reduce((sum, t) => sum + Math.max(t.quantity - t.soldCount, 0), 0);

  const tabs = [
    { id: "about", label: "About" },
    { id: "location", label: "Location" },
    { id: "organizer", label: "Organizer" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div
        className="h-48 md:h-56 flex items-end relative"
        style={{ background: "linear-gradient(135deg, #312E81 0%, #6D28D9 100%)" }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-6xl mx-auto w-full px-6 pb-6">
          <span className="bg-accent text-ink px-3 py-1 rounded-full text-xs font-semibold">
            {event.category}
          </span>
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-white mt-3">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — details + tabs */}
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-6 mb-8 text-sm">
            <div className="flex items-center gap-2 text-mist">
              <Calendar size={16} />
              {new Date(event.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </div>
            {event.location?.city && (
              <div className="flex items-center gap-2 text-mist">
                <MapPin size={16} />
                {event.location.city}
              </div>
            )}
            <div className="flex items-center gap-2 text-mist">
              <Users size={16} />
              {event.registeredCount} / {event.capacity} registered
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-border mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium border-b-2 transition ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-mist hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "about" && (
            <p className="text-ink leading-relaxed">{event.description}</p>
          )}

          {activeTab === "location" && (
            <div className="text-sm space-y-2">
              {event.mode === "online" ? (
                <p className="text-mist">This is an online event. The meeting link will be shared with registered attendees.</p>
              ) : (
                <>
                  <p><span className="text-mist">Venue:</span> <span className="text-ink font-medium">{event.location?.venue || "—"}</span></p>
                  <p><span className="text-mist">City:</span> <span className="text-ink font-medium">{event.location?.city || "—"}</span></p>
                  <p><span className="text-mist">State:</span> <span className="text-ink font-medium">{event.location?.state || "—"}</span></p>
                </>
              )}
            </div>
          )}

          {activeTab === "organizer" && (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-heading font-bold">
                {event.organizer?.name?.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-ink">{event.organizer?.name}</p>
                <p className="text-mist text-sm">{event.organizer?.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right — sticky tickets card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-surface rounded-card shadow-md border border-border p-6">
            <div className="flex justify-between items-baseline mb-1">
              <p className="font-heading font-bold text-2xl text-primary">
                {lowestPrice === 0 ? "Free" : lowestPrice ? `From ₹${lowestPrice}` : "—"}
              </p>
              {totalLeft > 0 && totalLeft < 20 && (
                <span className="text-danger text-xs font-semibold">{totalLeft} left</span>
              )}
            </div>

            {isOrganizerOfEvent && (
              <button
                onClick={() => setShowTicketForm(!showTicketForm)}
                className="flex items-center gap-1 text-secondary text-sm font-semibold hover:underline mb-4"
              >
                <Plus size={16} /> Add Ticket Type
              </button>
            )}

            {showTicketForm && (
              <form onSubmit={handleAddTicket} className="bg-background border border-border rounded-input p-4 mb-4 space-y-3">
                <input
                  type="text"
                  placeholder="Ticket name"
                  value={ticketForm.name}
                  onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                  required
                  className="w-full border border-border rounded-input px-3 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" placeholder="₹" value={ticketForm.price} onChange={(e) => setTicketForm({ ...ticketForm, price: e.target.value })} min={0} className="border border-border rounded-input px-2 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-secondary" />
                  <input type="number" placeholder="Qty" value={ticketForm.quantity} onChange={(e) => setTicketForm({ ...ticketForm, quantity: e.target.value })} required min={1} className="border border-border rounded-input px-2 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-secondary" />
                  <input type="number" placeholder="Max" value={ticketForm.maxPerUser} onChange={(e) => setTicketForm({ ...ticketForm, maxPerUser: e.target.value })} min={1} className="border border-border rounded-input px-2 py-2 text-sm bg-surface focus:outline-none focus:ring-2 focus:ring-secondary" />
                </div>
                <button type="submit" disabled={addingTicket} className="w-full bg-primary text-white text-sm font-semibold py-2 rounded-btn hover:opacity-90 transition disabled:opacity-50">
                  {addingTicket ? "Adding..." : "Add Ticket"}
                </button>
              </form>
            )}

            {bookingError && <p className="text-danger text-xs mb-3">{bookingError}</p>}
            {bookingSuccess && <p className="text-success text-xs mb-3">{bookingSuccess}</p>}

            {tickets.length === 0 ? (
              <p className="text-mist text-sm">No tickets available yet.</p>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => {
                  const soldOut = ticket.soldCount >= ticket.quantity;
                  return (
                    <div key={ticket._id} className="border border-border rounded-input p-3">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-ink text-sm">{ticket.name}</p>
                        <p className="text-primary font-semibold text-sm">
                          {ticket.price > 0 ? `₹${ticket.price}` : "Free"}
                        </p>
                      </div>
                      <button
                        onClick={() => handleBook(ticket._id)}
                        disabled={bookingId === ticket._id}
                        className="w-full bg-secondary text-white text-sm font-semibold py-2 rounded-btn hover:opacity-90 transition disabled:opacity-50"
                      >
                        {bookingId === ticket._id ? "Booking..." : soldOut ? "Join Waitlist" : "Book Now"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-10">
        <Link to="/events" className="text-primary font-semibold text-sm">
          ← Back to Events
        </Link>
      </div>
    </div>
  );
}

export default EventDetailPage;